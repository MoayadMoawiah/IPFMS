import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';
import { AuditService } from '../audit/audit.service';
import { MinioService } from '../uploads/minio.service';
import { GrantStatus, Prisma, ProjectStatus } from '@prisma/client';
import { CreateGrantDto } from './dto/create-grant.dto';
import { UserPayload } from '../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../common/dto/pagination.dto';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
]);

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

@Injectable()
export class GrantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowSvc: WorkflowService,
    private readonly auditSvc: AuditService,
    private readonly minioSvc: MinioService,
  ) {}

  async findAll(query: any, user: UserPayload) {
    const { page, limit } = parsePagination(query);
    const { search, status, donorId, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.GrantWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(donorId && { donorId }),
      ...(search && {
        OR: [
          { code: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { donor: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [grants, total] = await Promise.all([
      this.prisma.grant.findMany({
        where,
        include: {
          donor: { select: { id: true, name: true, code: true } },
          grantManager: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { projects: true, purchaseRequisitions: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.grant.count({ where }),
    ]);

    // Calculate utilization percent
    const grantsWithUtil = grants.map((g) => ({
      ...g,
      availableAmount: Number(g.totalBudget) - Number(g.committedAmount) - Number(g.spentAmount),
      utilizationPercent:
        Number(g.totalBudget) > 0
          ? ((Number(g.committedAmount) + Number(g.spentAmount)) / Number(g.totalBudget)) * 100
          : 0,
    }));

    return buildPaginationResponse(grantsWithUtil, total, page, limit);
  }

  async findOne(id: string) {
    const grant = await this.prisma.grant.findUnique({
      where: { id, deletedAt: null },
      include: {
        donor: true,
        fiscalYear: true,
        grantManager: { select: { id: true, firstName: true, lastName: true, email: true } },
        coordinator: { select: { id: true, firstName: true, lastName: true, email: true } },
        budgetLines: {
          where: { deletedAt: null },
          orderBy: { code: 'asc' },
        },
        projects: {
          where: { deletedAt: null },
          include: {
            activities: {
              where: { deletedAt: null },
              include: {
                responsibleUser: {
                  select: { id: true, firstName: true, lastName: true, email: true },
                },
              },
              orderBy: { code: 'asc' },
            },
            milestones: { orderBy: { dueDate: 'asc' } },
            projectManager: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
        },
        amendments: { orderBy: { amendmentNumber: 'desc' } },
        exchangeRates: { orderBy: { effectiveDate: 'desc' }, take: 10 },
        _count: {
          select: {
            purchaseRequisitions: true,
            purchaseOrders: true,
            paymentVouchers: true,
          },
        },
      },
    });

    if (!grant) throw new NotFoundException(`Grant ${id} not found`);

    return {
      ...grant,
      availableAmount:
        Number(grant.totalBudget) - Number(grant.committedAmount) - Number(grant.spentAmount),
      utilizationPercent:
        Number(grant.totalBudget) > 0
          ? ((Number(grant.committedAmount) + Number(grant.spentAmount)) / Number(grant.totalBudget)) * 100
          : 0,
    };
  }

  async create(dto: CreateGrantDto, user: UserPayload) {
    // Check code uniqueness
    const existing = await this.prisma.grant.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(`Grant code '${dto.code}' is already in use`);
    }

    const grant = await this.prisma.$transaction(async (tx) => {
      const created = await tx.grant.create({
        data: {
          code: dto.code.toUpperCase(),
          name: dto.name,
          donorId: dto.donorId,
          fiscalYearId: dto.fiscalYearId,
          currency: dto.currency || 'USD',
          totalBudget: new Prisma.Decimal(dto.totalBudget),
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          signedDate: dto.signedDate ? new Date(dto.signedDate) : null,
          description: dto.description,
          objectives: dto.objectives,
          conditions: dto.conditions,
          reportingRequirements: dto.reportingRequirements,
          targetBeneficiaries: dto.targetBeneficiaries,
          grantManagerId: dto.grantManagerId,
          projectCoordinatorId: dto.projectCoordinatorId,
          createdById: user.id,
          status: GrantStatus.DRAFT,
        },
        include: { donor: true },
      });

      await tx.project.create({
        data: {
          grantId: created.id,
          code: created.code,
          name: created.name,
          description: created.description,
          startDate: created.startDate,
          endDate: created.endDate,
          budget: created.totalBudget,
          targetBeneficiaries: created.targetBeneficiaries,
          projectManagerId: dto.grantManagerId,
          status: ProjectStatus.PLANNING,
          createdById: user.id,
        },
      });

      return created;
    });

    await this.auditSvc.log({
      userId: user.id,
      userEmail: user.email,
      action: 'CREATE',
      module: 'GRANTS',
      resource: 'Grant',
      resourceId: grant.id,
      newValues: grant,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return grant;
  }

  async update(id: string, dto: Partial<CreateGrantDto>, user: UserPayload) {
    const grant = await this.findOne(id);

    if (grant.status === GrantStatus.CLOSED || grant.status === GrantStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a closed or cancelled grant');
    }

    const oldValues = { ...grant };

    const updated = await this.prisma.$transaction(async (tx) => {
      const grantUpdate = await tx.grant.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.totalBudget && { totalBudget: new Prisma.Decimal(dto.totalBudget) }),
          ...(dto.startDate && { startDate: new Date(dto.startDate) }),
          ...(dto.endDate && { endDate: new Date(dto.endDate) }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.objectives !== undefined && { objectives: dto.objectives }),
          ...(dto.conditions !== undefined && { conditions: dto.conditions }),
          ...(dto.reportingRequirements !== undefined && { reportingRequirements: dto.reportingRequirements }),
          ...(dto.targetBeneficiaries !== undefined && { targetBeneficiaries: dto.targetBeneficiaries }),
          ...(dto.grantManagerId && { grantManagerId: dto.grantManagerId }),
          ...(dto.projectCoordinatorId && { projectCoordinatorId: dto.projectCoordinatorId }),
        },
        include: { donor: true },
      });

      const linkedProject = await tx.project.findFirst({
        where: { grantId: id, deletedAt: null },
      });

      if (linkedProject) {
        await tx.project.update({
          where: { id: linkedProject.id },
          data: {
            ...(dto.name && { name: dto.name }),
            ...(dto.totalBudget && { budget: new Prisma.Decimal(dto.totalBudget) }),
            ...(dto.startDate && { startDate: new Date(dto.startDate) }),
            ...(dto.endDate && { endDate: new Date(dto.endDate) }),
            ...(dto.description !== undefined && { description: dto.description }),
            ...(dto.targetBeneficiaries !== undefined && { targetBeneficiaries: dto.targetBeneficiaries }),
            ...(dto.grantManagerId && { projectManagerId: dto.grantManagerId }),
          },
        });
      }

      return grantUpdate;
    });

    await this.auditSvc.log({
      userId: user.id,
      userEmail: user.email,
      action: 'UPDATE',
      module: 'GRANTS',
      resource: 'Grant',
      resourceId: id,
      oldValues,
      newValues: updated,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return updated;
  }

  async activate(id: string, user: UserPayload) {
    const grant = await this.findOne(id);
    if (grant.status !== GrantStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT grants can be activated');
    }

    const updated = await this.prisma.grant.update({
      where: { id },
      data: { status: GrantStatus.ACTIVE },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'APPROVE',
      module: 'GRANTS',
      resource: 'Grant',
      resourceId: id,
      oldValues: { status: 'DRAFT' },
      newValues: { status: 'ACTIVE' },
    });

    return updated;
  }

  async close(id: string, user: UserPayload) {
    const grant = await this.findOne(id);
    if (grant.status !== GrantStatus.ACTIVE) {
      throw new BadRequestException('Only ACTIVE grants can be closed');
    }

    const updated = await this.prisma.grant.update({
      where: { id },
      data: { status: GrantStatus.CLOSED },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'UPDATE',
      module: 'GRANTS',
      resource: 'Grant',
      resourceId: id,
      oldValues: { status: 'ACTIVE' },
      newValues: { status: 'CLOSED' },
    });

    return updated;
  }

  async softDelete(id: string, user: UserPayload) {
    await this.findOne(id);
    await this.prisma.grant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'SOFT_DELETE',
      module: 'GRANTS',
      resource: 'Grant',
      resourceId: id,
    });
  }

  async getBudgetSummary(id: string) {
    const grant = await this.prisma.grant.findUnique({
      where: { id, deletedAt: null },
      include: {
        budgetLines: {
          where: { deletedAt: null },
          include: { activity: { select: { id: true, name: true, code: true } } },
        },
        projects: {
          where: { deletedAt: null },
          include: {
            activities: {
              where: { deletedAt: null },
              select: {
                id: true,
                code: true,
                name: true,
                plannedBudget: true,
                actualSpent: true,
                progressPercent: true,
                status: true,
              },
            },
          },
        },
      },
    });
    if (!grant) throw new NotFoundException(`Grant ${id} not found`);

    const totalBudget = Number(grant.totalBudget);
    const totalCommitted = Number(grant.committedAmount);
    const totalSpent = Number(grant.spentAmount);
    const activities = grant.projects[0]?.activities ?? [];
    const activityAllocated = activities.reduce((sum, a) => sum + Number(a.plannedBudget), 0);

    return {
      grant: { id: grant.id, code: grant.code, name: grant.name, currency: grant.currency },
      summary: {
        totalBudget,
        totalCommitted,
        totalSpent,
        totalEncumbered: totalCommitted + totalSpent,
        available: totalBudget - totalCommitted - totalSpent,
        activityAllocated,
        activityUnallocated: totalBudget - activityAllocated,
        utilizationPercent: totalBudget > 0 ? ((totalCommitted + totalSpent) / totalBudget) * 100 : 0,
      },
      activities,
      budgetLines: grant.budgetLines.map((line) => ({
        ...line,
        available: Number(line.totalBudget) - Number(line.committedAmount) - Number(line.spentAmount),
      })),
    };
  }

  async addBudgetLine(grantId: string, dto: any, user: UserPayload) {
    await this.findOne(grantId);

    const line = await this.prisma.grantBudgetLine.create({
      data: {
        grantId,
        code: dto.code,
        description: dto.description,
        category: dto.category,
        totalBudget: new Prisma.Decimal(dto.totalBudget),
        currency: dto.currency || 'USD',
        notes: dto.notes,
        activityId: dto.activityId,
        createdById: user.id,
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'GRANTS',
      resource: 'GrantBudgetLine',
      resourceId: line.id,
      newValues: line,
    });

    return line;
  }

  // Budget control methods used by procurement module
  async checkBudgetAvailability(budgetLineId: string, amount: number) {
    const line = await this.prisma.grantBudgetLine.findUnique({
      where: { id: budgetLineId },
    });
    if (!line) throw new NotFoundException('Budget line not found');

    const available =
      Number(line.totalBudget) - Number(line.committedAmount) - Number(line.spentAmount);

    if (amount > available) {
      throw new BadRequestException(
        `Insufficient budget. Available: ${available.toFixed(2)}, Requested: ${amount.toFixed(2)}`,
      );
    }

    return { available, requested: amount, line };
  }

  async commitBudget(budgetLineId: string, amount: number) {
    await this.prisma.grantBudgetLine.update({
      where: { id: budgetLineId },
      data: { committedAmount: { increment: new Prisma.Decimal(amount) } },
    });

    // Update grant total
    const line = await this.prisma.grantBudgetLine.findUnique({
      where: { id: budgetLineId },
      select: { grantId: true },
    });
    if (line) {
      await this.prisma.grant.update({
        where: { id: line.grantId },
        data: { committedAmount: { increment: new Prisma.Decimal(amount) } },
      });
    }
  }

  async spendBudget(budgetLineId: string, amount: number) {
    await this.prisma.grantBudgetLine.update({
      where: { id: budgetLineId },
      data: {
        committedAmount: { decrement: new Prisma.Decimal(amount) },
        spentAmount: { increment: new Prisma.Decimal(amount) },
      },
    });

    const line = await this.prisma.grantBudgetLine.findUnique({
      where: { id: budgetLineId },
      select: { grantId: true },
    });
    if (line) {
      await this.prisma.grant.update({
        where: { id: line.grantId },
        data: {
          committedAmount: { decrement: new Prisma.Decimal(amount) },
          spentAmount: { increment: new Prisma.Decimal(amount) },
        },
      });
    }
  }

  // ─── Document Attachments ─────────────────────────────────────────────────

  async uploadDocuments(
    grantId: string,
    files: Express.Multer.File[],
    labels: string[],
    user: UserPayload,
  ) {
    await this.findOne(grantId);

    const results: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const label = labels[i] ?? 'Other';

      if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        throw new BadRequestException(
          `File type '${file.mimetype}' is not allowed for '${file.originalname}'`,
        );
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new BadRequestException(
          `File '${file.originalname}' exceeds the 20 MB size limit`,
        );
      }

      const timestamp = Date.now();
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageKey = `grants/${grantId}/${timestamp}-${safeName}`;

      await this.minioSvc.uploadFile(file.buffer, storageKey, file.mimetype);
      const fileUrl = this.minioSvc.buildPublicUrl(storageKey);

      const attachment = await this.prisma.documentAttachment.create({
        data: {
          documentType: 'Grant',
          documentId: grantId,
          fileName: label,
          originalName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          fileUrl,
          storageKey,
          uploadedById: user.id,
        },
        include: {
          uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      });

      results.push(attachment);
    }

    await this.auditSvc.log({
      userId: user.id,
      userEmail: user.email,
      action: 'CREATE',
      module: 'GRANTS',
      resource: 'DocumentAttachment',
      resourceId: grantId,
      newValues: { count: results.length },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return results;
  }

  async listDocuments(grantId: string) {
    await this.findOne(grantId);

    return this.prisma.documentAttachment.findMany({
      where: {
        documentType: 'Grant',
        documentId: grantId,
        deletedAt: null,
      },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(grantId: string, attachmentId: string, user: UserPayload) {
    const attachment = await this.prisma.documentAttachment.findFirst({
      where: { id: attachmentId, documentType: 'Grant', documentId: grantId, deletedAt: null },
    });
    if (!attachment) throw new NotFoundException('Document not found');

    await this.prisma.documentAttachment.update({
      where: { id: attachmentId },
      data: { deletedAt: new Date() },
    });

    await this.minioSvc.deleteFile(attachment.storageKey);

    await this.auditSvc.log({
      userId: user.id,
      userEmail: user.email,
      action: 'SOFT_DELETE',
      module: 'GRANTS',
      resource: 'DocumentAttachment',
      resourceId: attachmentId,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });
  }
}
