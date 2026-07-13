import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction } from '@prisma/client';
import { parsePagination } from '../common/dto/pagination.dto';

export interface AuditLogDto {
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  module: string;
  resource: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(dto: AuditLogDto): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: dto.userId,
          userEmail: dto.userEmail,
          action: dto.action,
          module: dto.module,
          resource: dto.resource,
          resourceId: dto.resourceId,
          oldValues: dto.oldValues ? JSON.parse(JSON.stringify(dto.oldValues)) : undefined,
          newValues: dto.newValues ? JSON.parse(JSON.stringify(dto.newValues)) : undefined,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
          sessionId: dto.sessionId,
          requestId: dto.requestId,
          duration: dto.duration,
        },
      });
    } catch {
      // Audit failures must NEVER break the main flow
    }
  }

  async findAll(filters: {
    userId?: string;
    module?: string;
    resource?: string;
    resourceId?: string;
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { page, limit } = parsePagination({ limit: filters.limit ?? 50, page: filters.page ?? 1 });
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.module) where.module = filters.module;
    if (filters.resource) where.resource = filters.resource;
    if (filters.resourceId) where.resourceId = filters.resourceId;
    if (filters.action) where.action = filters.action;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findByDocument(documentType: string, documentId: string) {
    return this.prisma.auditLog.findMany({
      where: { resource: documentType, resourceId: documentId },
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
