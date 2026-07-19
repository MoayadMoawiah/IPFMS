import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PafService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditSvc: AuditService,
  ) {}

  async findAll(query: { rfqId?: string; prId?: string }) {
    const { page, limit } = parsePagination(query);
    const where: Prisma.PurchaseAnalysisFormWhereInput = {
      ...(query.rfqId && { rfqId: query.rfqId }),
      ...(query.prId && { prId: query.prId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.purchaseAnalysisForm.findMany({
        where,
        include: {
          rfq: { select: { id: true, serialNumber: true, title: true, status: true } },
          pr: { select: { id: true, serialNumber: true, title: true } },
          rfqVendor: {
            include: { vendor: { select: { id: true, name: true } } },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchaseAnalysisForm.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const paf = await this.prisma.purchaseAnalysisForm.findUnique({
      where: { id },
      include: {
        rfq: { select: { id: true, serialNumber: true, title: true, status: true, prId: true } },
        pr: { select: { id: true, serialNumber: true, title: true } },
        rfqVendor: {
          include: { vendor: { select: { id: true, name: true, email: true } } },
        },
      },
    });
    if (!paf) throw new NotFoundException(`PAF ${id} not found`);
    return paf;
  }

  async create(dto: {
    rfqId: string;
    rfqVendorId: string;
    justification: string;
    committeeMembers?: { name: string; role: string }[];
  }, user: UserPayload) {
    const rfq = await this.prisma.rfq.findUnique({
      where: { id: dto.rfqId, deletedAt: null },
      include: {
        vendors: { include: { vendor: true } },
      },
    });
    if (!rfq) throw new NotFoundException('RFQ not found');
    if (rfq.status !== 'AWARDED') {
      throw new BadRequestException('PAF can only be created for AWARDED RFQs');
    }

    const rfqVendor = rfq.vendors.find((v) => v.id === dto.rfqVendorId);
    if (!rfqVendor) throw new NotFoundException('RFQ vendor not found');
    if (!rfqVendor.isWinner) {
      throw new BadRequestException('PAF must reference the awarded vendor');
    }

    const existing = await this.prisma.purchaseAnalysisForm.findFirst({
      where: { rfqId: dto.rfqId },
    });
    if (existing) {
      throw new ConflictException('A PAF already exists for this RFQ');
    }

    if (!dto.justification?.trim()) {
      throw new BadRequestException('Justification is required');
    }

    const totalAmount = rfqVendor.quotedAmount ?? new Prisma.Decimal(0);
    const currency = rfqVendor.currency ?? 'USD';

    const paf = await this.prisma.purchaseAnalysisForm.create({
      data: {
        rfqId: dto.rfqId,
        prId: rfq.prId,
        rfqVendorId: dto.rfqVendorId,
        recommendedVendorId: rfqVendor.vendorId,
        totalAmount,
        currency,
        justification: dto.justification.trim(),
        committeeMembers: dto.committeeMembers ?? [],
        status: 'DRAFT',
        createdById: user.id,
      },
      include: {
        rfq: { select: { id: true, serialNumber: true, title: true } },
        rfqVendor: {
          include: { vendor: { select: { id: true, name: true } } },
        },
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'RFQ',
      resource: 'PurchaseAnalysisForm',
      resourceId: paf.id,
      newValues: { rfqId: dto.rfqId, recommendedVendorId: rfqVendor.vendorId },
    });

    return paf;
  }
}
