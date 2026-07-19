import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';
import { resolveProcurementRoute } from '../../common/constants/procurement.constants';

@Injectable()
export class RfqService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, grantId, prId } = query;
    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(grantId && { grantId }),
      ...(prId && { prId }),
      ...(search && {
        OR: [
          { serialNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.rfq.findMany({
        where,
        include: {
          pr: { select: { id: true, serialNumber: true, title: true } },
          grant: { select: { id: true, code: true, name: true } },
          _count: { select: { vendors: true, pafForms: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rfq.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const rfq = await this.prisma.rfq.findUnique({
      where: { id, deletedAt: null },
      include: {
        pr: { include: { items: true } },
        grant: true,
        vendors: {
          include: {
            vendor: { select: { id: true, name: true, email: true, rating: true } },
          },
        },
        evaluations: true,
      },
    });
    if (!rfq) throw new NotFoundException(`RFQ ${id} not found`);
    return rfq;
  }

  private resolveSubmissionDeadline(requiredByDate: Date | null | undefined): Date {
    const now = new Date();
    if (requiredByDate && requiredByDate.getTime() > now.getTime()) {
      return requiredByDate;
    }
    const deadline = new Date(now);
    deadline.setDate(deadline.getDate() + 14);
    return deadline;
  }

  async createDraftFromPr(prId: string, user: UserPayload) {
    const pr = await this.prisma.purchaseRequisition.findUnique({
      where: { id: prId, deletedAt: null },
      include: { grant: true },
    });
    if (!pr) throw new NotFoundException('Purchase Requisition not found');
    if (pr.status !== 'APPROVED') {
      throw new BadRequestException('PR must be APPROVED to create RFQ');
    }
    if (resolveProcurementRoute(Number(pr.totalEstimatedAmount)) === 'DIRECT_PO') {
      throw new BadRequestException('RFQ is only required for PRs over $1,001');
    }

    const existing = await this.prisma.rfq.findFirst({
      where: { prId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (existing) return existing;

    const serialNumber = await this.serialSvc.next(pr.grant.code, 'RFQ');
    const submissionDeadline = this.resolveSubmissionDeadline(pr.requiredByDate);

    const rfq = await this.prisma.rfq.create({
      data: {
        serialNumber,
        prId,
        grantId: pr.grantId,
        title: pr.title,
        description: pr.description,
        submissionDeadline,
        openingDate: null,
        procurementMethodId: pr.procurementMethodId,
        status: 'DRAFT',
        createdById: user.id,
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'RFQ',
      resource: 'Rfq',
      resourceId: rfq.id,
      newValues: { serialNumber, title: rfq.title, autoCreatedFromPr: prId },
    });

    return rfq;
  }

  async create(dto: any, user: UserPayload) {
    const pr = await this.prisma.purchaseRequisition.findUnique({
      where: { id: dto.prId },
      include: { grant: true },
    });
    if (!pr) throw new NotFoundException('Purchase Requisition not found');
    if (pr.status !== 'APPROVED') throw new BadRequestException('PR must be APPROVED to create RFQ');
    if (resolveProcurementRoute(Number(pr.totalEstimatedAmount)) === 'DIRECT_PO') {
      throw new BadRequestException('RFQ is only required for PRs over $1,001');
    }

    const serialNumber = await this.serialSvc.next(pr.grant.code, 'RFQ');

    const rfq = await this.prisma.rfq.create({
      data: {
        serialNumber,
        prId: dto.prId,
        grantId: pr.grantId,
        title: dto.title || pr.title,
        description: dto.description,
        submissionDeadline: new Date(dto.submissionDeadline),
        openingDate: dto.openingDate ? new Date(dto.openingDate) : null,
        procurementMethodId: dto.procurementMethodId || pr.procurementMethodId,
        status: 'DRAFT',
        createdById: user.id,
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'RFQ',
      resource: 'Rfq',
      resourceId: rfq.id,
      newValues: { serialNumber, title: rfq.title },
    });

    return rfq;
  }

  async issue(id: string, user: UserPayload) {
    const rfq = await this.findOne(id);
    if (rfq.status !== 'DRAFT') throw new BadRequestException('Only DRAFT RFQs can be issued');
    return this.prisma.rfq.update({
      where: { id },
      data: { status: 'ISSUED', issuedDate: new Date() },
    });
  }

  async inviteVendor(rfqId: string, vendorId: string, user: UserPayload) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.isBlacklisted) throw new BadRequestException('Cannot invite blacklisted vendor');

    return this.prisma.rfqVendor.upsert({
      where: { rfqId_vendorId: { rfqId, vendorId } },
      update: {},
      create: { rfqId, vendorId, invitedAt: new Date() },
      include: { vendor: { select: { id: true, name: true, email: true } } },
    });
  }

  async updateVendorQuotation(rfqId: string, rfqVendorId: string, dto: any) {
    const existing = await this.prisma.rfqVendor.findFirst({
      where: { id: rfqVendorId, rfqId },
    });
    if (!existing) throw new NotFoundException('RFQ vendor not found');

    const technicalScore = dto.technicalScore !== undefined
      ? new Prisma.Decimal(dto.technicalScore)
      : existing.technicalScore;
    const committeeScore = dto.committeeScore !== undefined
      ? new Prisma.Decimal(dto.committeeScore)
      : existing.committeeScore;
    const financialScore = dto.financialScore !== undefined
      ? new Prisma.Decimal(dto.financialScore)
      : existing.financialScore;
    const totalScore = new Prisma.Decimal(
      Number(technicalScore) + Number(committeeScore) + Number(financialScore),
    );

    return this.prisma.rfqVendor.update({
      where: { id: rfqVendorId, rfqId },
      data: {
        respondedAt: new Date(),
        quotedAmount: dto.quotedAmount ? new Prisma.Decimal(dto.quotedAmount) : undefined,
        currency: dto.currency,
        deliveryDays: dto.deliveryDays,
        warrantyTerms: dto.warrantyTerms,
        technicalScore,
        committeeScore,
        financialScore,
        totalScore,
        notes: dto.notes,
      },
      include: {
        vendor: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async awardVendor(rfqId: string, rfqVendorId: string, user: UserPayload) {
    // Clear existing winner
    await this.prisma.rfqVendor.updateMany({
      where: { rfqId },
      data: { isWinner: false },
    });
    // Set new winner
    const winner = await this.prisma.rfqVendor.update({
      where: { id: rfqVendorId },
      data: { isWinner: true },
    });
    await this.prisma.rfq.update({ where: { id: rfqId }, data: { status: 'AWARDED' } });
    return winner;
  }

  async getComparison(id: string) {
    const rfq = await this.findOne(id);
    return {
      rfq: { id: rfq.id, serialNumber: rfq.serialNumber, title: rfq.title },
      vendors: rfq.vendors
        .filter((v) => v.respondedAt !== null)
        .sort((a, b) => Number(b.totalScore) - Number(a.totalScore)),
    };
  }
}
