import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';

@Injectable()
export class VendorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditSvc: AuditService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, isBlacklisted } = query;
    const where: any = {
      deletedAt: null,
      ...(isBlacklisted !== undefined && { isBlacklisted: isBlacklisted === 'true' }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { registrationNumber: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        include: {
          _count: { select: { documents: true, purchaseOrders: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id, deletedAt: null },
      include: {
        documents: { orderBy: { documentType: 'asc' } },
        bankAccounts: true,
        _count: { select: { purchaseOrders: true, contracts: true } },
      },
    });
    if (!vendor) throw new NotFoundException(`Vendor ${id} not found`);
    return vendor;
  }

  async create(dto: any, user: UserPayload) {
    const vendor = await this.prisma.vendor.create({
      data: {
        registrationNumber: dto.registrationNumber,
        name: dto.name,
        arabicName: dto.arabicName,
        vendorType: dto.vendorType || 'SUPPLIER',
        country: dto.country,
        address: dto.address,
        city: dto.city,
        phone: dto.phone,
        email: dto.email,
        website: dto.website,
        taxNumber: dto.taxNumber,
        createdById: user.id,
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'VENDORS',
      resource: 'Vendor',
      resourceId: vendor.id,
      newValues: vendor,
    });

    return vendor;
  }

  async update(id: string, dto: any, user: UserPayload) {
    await this.findOne(id);
    const updated = await this.prisma.vendor.update({ where: { id }, data: dto });
    await this.auditSvc.log({
      userId: user.id,
      action: 'UPDATE',
      module: 'VENDORS',
      resource: 'Vendor',
      resourceId: id,
      newValues: updated,
    });
    return updated;
  }

  async softDelete(id: string, user: UserPayload) {
    await this.findOne(id);
    await this.prisma.vendor.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async blacklist(id: string, reason: string, user: UserPayload) {
    await this.findOne(id);
    const updated = await this.prisma.vendor.update({
      where: { id },
      data: { isBlacklisted: true, blacklistReason: reason, blacklistDate: new Date() },
    });
    await this.auditSvc.log({
      userId: user.id,
      action: 'UPDATE',
      module: 'VENDORS',
      resource: 'Vendor',
      resourceId: id,
      newValues: { isBlacklisted: true, reason },
    });
    return updated;
  }

  async removeBlacklist(id: string, user: UserPayload) {
    await this.findOne(id);
    return this.prisma.vendor.update({
      where: { id },
      data: { isBlacklisted: false, blacklistReason: null, blacklistDate: null },
    });
  }

  async getDocuments(vendorId: string) {
    return this.prisma.vendorDocument.findMany({
      where: { vendorId },
      orderBy: { documentType: 'asc' },
    });
  }

  async addDocument(vendorId: string, dto: any, user: UserPayload) {
    await this.findOne(vendorId);
    return this.prisma.vendorDocument.create({
      data: {
        vendorId,
        documentType: dto.documentType,
        documentNumber: dto.documentNumber,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
      },
    });
  }

  async getExpiringDocuments(days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    return this.prisma.vendorDocument.findMany({
      where: {
        expiryDate: { lte: cutoff, gte: new Date() },
      },
      include: { vendor: { select: { id: true, name: true, email: true } } },
      orderBy: { expiryDate: 'asc' },
    });
  }
}
