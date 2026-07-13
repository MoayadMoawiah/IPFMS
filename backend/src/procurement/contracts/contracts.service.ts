import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, grantId, vendorId } = query;
    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(grantId && { grantId }),
      ...(vendorId && { vendorId }),
      ...(search && {
        OR: [
          { serialNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        include: {
          vendor: { select: { id: true, name: true } },
          grant: { select: { id: true, code: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contract.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id, deletedAt: null },
      include: {
        vendor: true,
        grant: true,
        purchaseOrders: { select: { id: true, serialNumber: true, status: true, totalAmount: true } },
      },
    });
    if (!contract) throw new NotFoundException(`Contract ${id} not found`);
    return contract;
  }

  async create(dto: any, user: UserPayload) {
    const grant = await this.prisma.grant.findUnique({ where: { id: dto.grantId } });
    if (!grant) throw new NotFoundException('Grant not found');

    const serialNumber = await this.serialSvc.next(grant.code, 'CNT');

    const contract = await this.prisma.contract.create({
      data: {
        serialNumber,
        vendorId: dto.vendorId,
        grantId: dto.grantId,
        contractType: dto.contractType || 'SERVICE_CONTRACT',
        title: dto.title,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        totalValue: new Prisma.Decimal(dto.totalValue),
        currency: dto.currency || 'USD',
        paymentTerms: dto.paymentTerms,
        deliverables: dto.deliverables,
        status: 'DRAFT',
        createdById: user.id,
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'CONTRACTS',
      resource: 'Contract',
      resourceId: contract.id,
      newValues: { serialNumber },
    });

    return contract;
  }

  async activate(id: string, user: UserPayload) {
    return this.prisma.contract.update({ where: { id }, data: { status: 'ACTIVE' } });
  }

  async terminate(id: string, reason: string, user: UserPayload) {
    return this.prisma.contract.update({ where: { id }, data: { status: 'TERMINATED' } });
  }

  async getExpiring(days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    return this.prisma.contract.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { lte: cutoff, gte: new Date() },
        deletedAt: null,
      },
      include: { vendor: { select: { id: true, name: true, email: true } } },
      orderBy: { endDate: 'asc' },
    });
  }

  async update(id: string, dto: any, user: UserPayload) {
    await this.findOne(id);
    return this.prisma.contract.update({ where: { id }, data: dto });
  }

  async softDelete(id: string, user: UserPayload) {
    await this.findOne(id);
    await this.prisma.contract.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
