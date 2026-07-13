import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MinioService } from '../uploads/minio.service';
import { Prisma, ProjectStatus, ActivityStatus } from '@prisma/client';
import { UserPayload } from '../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../common/dto/pagination.dto';
import { CreateActivityDto, UpdateActivityDto } from './dto/create-activity.dto';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
]);

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditSvc: AuditService,
    private readonly minioSvc: MinioService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, grantId } = query;

    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(grantId && { grantId }),
      ...(search && {
        OR: [
          { code: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: {
          grant: { select: { id: true, code: true, name: true } },
          _count: { select: { activities: true, milestones: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
      include: {
        grant: { select: { id: true, code: true, name: true, currency: true } },
        milestones: { orderBy: { quarter: 'asc' } },
        activities: {
          where: { deletedAt: null },
          include: { budgetLines: { include: { budgetLine: true } } },
          orderBy: { code: 'asc' },
        },
        staff: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async create(dto: any, user: UserPayload) {
    const existingProject = await this.prisma.project.findFirst({
      where: { grantId: dto.grantId, deletedAt: null },
    });
    if (existingProject) {
      throw new ConflictException(
        'This grant already has a linked project. Grants and projects are 1:1 — update the grant instead.',
      );
    }

    const project = await this.prisma.project.create({
      data: {
        grantId: dto.grantId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        budget: new Prisma.Decimal(dto.budget),
        status: ProjectStatus.PLANNING,
        projectManagerId: dto.projectManagerId,
        createdById: user.id,
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'PROJECTS',
      resource: 'Project',
      resourceId: project.id,
      newValues: project,
    });

    return project;
  }

  async update(id: string, dto: any, user: UserPayload) {
    await this.findOne(id);
    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
        ...(dto.budget && { budget: new Prisma.Decimal(dto.budget) }),
        ...(dto.projectManagerId && { projectManagerId: dto.projectManagerId }),
      },
    });
    await this.auditSvc.log({
      userId: user.id,
      action: 'UPDATE',
      module: 'PROJECTS',
      resource: 'Project',
      resourceId: id,
      newValues: updated,
    });
    return updated;
  }

  async softDelete(id: string, user: UserPayload) {
    await this.findOne(id);
    await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.auditSvc.log({ userId: user.id, action: 'SOFT_DELETE', module: 'PROJECTS', resource: 'Project', resourceId: id });
  }

  // MILESTONES
  async getMilestones(projectId: string) {
    return this.prisma.projectMilestone.findMany({
      where: { projectId },
      orderBy: [{ quarter: 'asc' }, { dueDate: 'asc' }],
    });
  }

  async addMilestone(projectId: string, dto: any, user: UserPayload) {
    await this.findOne(projectId);
    return this.prisma.projectMilestone.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        quarter: dto.quarter,
        dueDate: new Date(dto.dueDate),
        deliverables: dto.deliverables,
        budget: new Prisma.Decimal(dto.budget || '0'),
        paymentPercent: new Prisma.Decimal(dto.paymentPercent || '0'),
      },
    });
  }

  async completeMilestone(projectId: string, milestoneId: string, user: UserPayload) {
    return this.prisma.projectMilestone.update({
      where: { id: milestoneId, projectId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        approvedById: user.id,
      },
    });
  }

  // ACTIVITIES
  private async resolveProjectId(dto: { projectId?: string; grantId?: string }) {
    if (dto.projectId) return dto.projectId;
    if (!dto.grantId) {
      throw new BadRequestException('Either projectId or grantId is required');
    }

    const project = await this.prisma.project.findFirst({
      where: { grantId: dto.grantId, deletedAt: null },
    });
    if (!project) {
      throw new NotFoundException(`No project found for grant ${dto.grantId}`);
    }
    return project.id;
  }

  private async getProjectWithGrant(projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      include: { grant: true },
    });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);
    return project;
  }

  private validateActivityDates(
    startDate: Date,
    endDate: Date,
    projectStart: Date,
    projectEnd: Date,
  ) {
    if (endDate <= startDate) {
      throw new BadRequestException('Activity end date must be after start date');
    }
    if (startDate < projectStart || endDate > projectEnd) {
      throw new BadRequestException('Activity dates must fall within the grant/project period');
    }
  }

  private async validateActivityBudget(
    projectId: string,
    grantTotalBudget: Prisma.Decimal,
    plannedBudget: number,
    excludeActivityId?: string,
  ) {
    const existing = await this.prisma.activity.aggregate({
      where: {
        projectId,
        deletedAt: null,
        ...(excludeActivityId && { id: { not: excludeActivityId } }),
      },
      _sum: { plannedBudget: true },
    });

    const allocated = Number(existing._sum.plannedBudget ?? 0);
    const grantTotal = Number(grantTotalBudget);
    if (allocated + plannedBudget > grantTotal) {
      throw new BadRequestException(
        `Activity budget exceeds grant total. Allocated: ${allocated}, Requested: ${plannedBudget}, Grant total: ${grantTotal}`,
      );
    }
  }

  private async generateActivityCode(projectId: string, grantCode: string) {
    const count = await this.prisma.activity.count({
      where: { projectId, deletedAt: null },
    });
    const next = String(count + 1).padStart(2, '0');
    return `${grantCode}-ACT${next}`;
  }

  private async recalculateProjectProgress(projectId: string) {
    const activities = await this.prisma.activity.findMany({
      where: { projectId, deletedAt: null },
      select: { plannedBudget: true, progressPercent: true },
    });

    if (activities.length === 0) {
      await this.prisma.project.update({
        where: { id: projectId },
        data: { progressPercent: new Prisma.Decimal(0) },
      });
      return;
    }

    const totalBudget = activities.reduce((sum, a) => sum + Number(a.plannedBudget), 0);
    const weightedProgress = activities.reduce((sum, a) => {
      const weight = totalBudget > 0 ? Number(a.plannedBudget) / totalBudget : 1 / activities.length;
      return sum + Number(a.progressPercent) * weight;
    }, 0);

    await this.prisma.project.update({
      where: { id: projectId },
      data: { progressPercent: new Prisma.Decimal(Math.round(weightedProgress * 100) / 100) },
    });
  }

  async findActivities(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status, projectId, grantId } = query;
    const where: Prisma.ActivityWhereInput = {
      deletedAt: null,
      ...(status && { status: status as ActivityStatus }),
      ...(projectId && { projectId }),
      ...(grantId && { project: { grantId, deletedAt: null } }),
      ...(search && {
        OR: [
          { code: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              code: true,
              grant: { select: { id: true, code: true, name: true, currency: true } },
            },
          },
          responsibleUser: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { code: 'asc' },
      }),
      this.prisma.activity.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findActivity(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id, deletedAt: null },
      include: {
        project: {
          include: {
            grant: { select: { id: true, code: true, name: true, currency: true, totalBudget: true } },
          },
        },
        budgetLines: { include: { budgetLine: true } },
        responsibleUser: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!activity) throw new NotFoundException(`Activity ${id} not found`);
    return activity;
  }

  async createActivity(dto: CreateActivityDto, user: UserPayload) {
    const projectId = await this.resolveProjectId(dto);
    const project = await this.getProjectWithGrant(projectId);

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const plannedBudget = Number(dto.plannedBudget);

    this.validateActivityDates(startDate, endDate, project.startDate, project.endDate);
    await this.validateActivityBudget(projectId, project.grant.totalBudget, plannedBudget);

    const code = dto.code || (await this.generateActivityCode(projectId, project.grant.code));

    const activity = await this.prisma.activity.create({
      data: {
        projectId,
        code,
        name: dto.name,
        description: dto.description,
        startDate,
        endDate,
        plannedBudget: new Prisma.Decimal(plannedBudget),
        status: ActivityStatus.PLANNING,
        responsibleUserId: dto.responsibleUserId,
        createdById: user.id,
      },
      include: {
        project: { select: { id: true, code: true, name: true } },
        responsibleUser: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await this.recalculateProjectProgress(projectId);

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'ACTIVITIES',
      resource: 'Activity',
      resourceId: activity.id,
      newValues: activity,
    });

    return activity;
  }

  async updateActivity(id: string, dto: UpdateActivityDto, user: UserPayload) {
    const existing = await this.findActivity(id);
    const project = existing.project;

    const startDate = dto.startDate ? new Date(dto.startDate) : existing.startDate;
    const endDate = dto.endDate ? new Date(dto.endDate) : existing.endDate;
    const plannedBudget = dto.plannedBudget ? Number(dto.plannedBudget) : Number(existing.plannedBudget);

    this.validateActivityDates(startDate, endDate, project.startDate, project.endDate);
    if (dto.plannedBudget) {
      await this.validateActivityBudget(
        existing.projectId,
        project.grant.totalBudget,
        plannedBudget,
        id,
      );
    }

    const updated = await this.prisma.activity.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.startDate && { startDate }),
        ...(dto.endDate && { endDate }),
        ...(dto.plannedBudget && { plannedBudget: new Prisma.Decimal(plannedBudget) }),
        ...(dto.responsibleUserId && { responsibleUserId: dto.responsibleUserId }),
        ...(dto.status && { status: dto.status as ActivityStatus }),
      },
      include: {
        project: { select: { id: true, code: true, name: true } },
        responsibleUser: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await this.recalculateProjectProgress(existing.projectId);

    await this.auditSvc.log({
      userId: user.id,
      action: 'UPDATE',
      module: 'ACTIVITIES',
      resource: 'Activity',
      resourceId: id,
      newValues: updated,
    });

    return updated;
  }

  async softDeleteActivity(id: string, user: UserPayload) {
    const activity = await this.findActivity(id);
    await this.prisma.activity.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await this.recalculateProjectProgress(activity.projectId);
    await this.auditSvc.log({
      userId: user.id,
      action: 'SOFT_DELETE',
      module: 'ACTIVITIES',
      resource: 'Activity',
      resourceId: id,
    });
  }

  async updateProgress(id: string, progressPercent: number, user: UserPayload) {
    if (progressPercent < 0 || progressPercent > 100) {
      throw new BadRequestException('Progress must be between 0 and 100');
    }
    const existing = await this.findActivity(id);
    const status = progressPercent === 100 ? ActivityStatus.COMPLETED :
                   progressPercent > 0 ? ActivityStatus.IN_PROGRESS : ActivityStatus.PLANNING;
    const updated = await this.prisma.activity.update({
      where: { id },
      data: { progressPercent: new Prisma.Decimal(progressPercent), status },
    });
    await this.recalculateProjectProgress(existing.projectId);
    return updated;
  }

  // ─── Activity document attachments ───────────────────────────────────────

  async uploadActivityDocuments(
    activityId: string,
    files: Express.Multer.File[],
    labels: string[],
    user: UserPayload,
  ) {
    await this.findActivity(activityId);

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
      const storageKey = `activities/${activityId}/${timestamp}-${safeName}`;

      await this.minioSvc.uploadFile(file.buffer, storageKey, file.mimetype);
      const fileUrl = this.minioSvc.buildPublicUrl(storageKey);

      const attachment = await this.prisma.documentAttachment.create({
        data: {
          documentType: 'Activity',
          documentId: activityId,
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
      module: 'ACTIVITIES',
      resource: 'DocumentAttachment',
      resourceId: activityId,
      newValues: { count: results.length },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return results;
  }

  async listActivityDocuments(activityId: string) {
    await this.findActivity(activityId);

    return this.prisma.documentAttachment.findMany({
      where: {
        documentType: 'Activity',
        documentId: activityId,
        deletedAt: null,
      },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteActivityDocument(
    activityId: string,
    attachmentId: string,
    user: UserPayload,
  ) {
    const attachment = await this.prisma.documentAttachment.findFirst({
      where: {
        id: attachmentId,
        documentType: 'Activity',
        documentId: activityId,
        deletedAt: null,
      },
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
      module: 'ACTIVITIES',
      resource: 'DocumentAttachment',
      resourceId: attachmentId,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });
  }
}
