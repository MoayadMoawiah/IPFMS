import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { GrantsService } from '../../grants/grants.service';
import { MinioService } from '../../uploads/minio.service';
import { DocumentStatus, Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';
import { resolveProcurementRoute, ProcurementRoute } from '../../common/constants/procurement.constants';
import { RfqService } from '../rfq/rfq.service';

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
export class RequisitionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowSvc: WorkflowService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
    private readonly grantsSvc: GrantsService,
    private readonly minioSvc: MinioService,
    private readonly rfqSvc: RfqService,
  ) {}

  async findAll(query: any, user: UserPayload) {
    const { page, limit } = parsePagination(query);
    const { search, status, grantId } = query;
    const where: Prisma.PurchaseRequisitionWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(grantId && { grantId }),
      ...(search && {
        OR: [
          { serialNumber: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.purchaseRequisition.findMany({
        where,
        include: {
          grant: { select: { id: true, code: true, name: true } },
          requestedBy: { select: { id: true, firstName: true, lastName: true } },
          procurementMethod: { select: { id: true, name: true, code: true } },
          _count: { select: { items: true } },
          workflow: {
            select: {
              id: true,
              status: true,
              templateId: true,
              currentStepNumber: true,
              steps: {
                where: { status: 'IN_PROGRESS' },
                take: 1,
                select: {
                  stepNumber: true,
                  stepName: true,
                  assignedRoleId: true,
                  assignedUserId: true,
                  status: true,
                  dueAt: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchaseRequisition.count({ where }),
    ]);

    const enriched = await Promise.all(
      data.map(async (pr) => {
        const approvalContext = await this.workflowSvc.buildApprovalContext(pr.workflow);
        const { workflow, ...rest } = pr;
        return { ...rest, approvalContext };
      }),
    );

    return buildPaginationResponse(enriched, total, page, limit);
  }

  async findOne(id: string, user?: UserPayload) {
    const pr = await this.prisma.purchaseRequisition.findUnique({
      where: { id, deletedAt: null },
      include: {
        grant: true,
        activity: true,
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: { include: { role: { select: { id: true, name: true } } } },
          },
        },
        procurementMethod: true,
        items: true,
        rfqs: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            serialNumber: true,
            status: true,
            submissionDeadline: true,
            createdAt: true,
          },
        },
        purchaseOrders: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            serialNumber: true,
            status: true,
            totalAmount: true,
            currency: true,
            vendor: { select: { id: true, name: true } },
          },
        },
        pafForms: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            rfqId: true,
            recommendedVendorId: true,
            totalAmount: true,
          },
        },
        workflow: {
          include: {
            template: { select: { id: true } },
            steps: {
              orderBy: { stepNumber: 'asc' },
              include: {
                digitalSignature: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        roles: { include: { role: { select: { id: true, name: true } } } },
                      },
                    },
                  },
                },
              },
            },
            actions: {
              include: {
                actor: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    roles: { include: { role: { select: { id: true, name: true } } } },
                  },
                },
              },
              orderBy: { actionAt: 'asc' },
            },
          },
        },
      },
    });

    if (!pr) throw new NotFoundException(`Purchase Requisition ${id} not found`);

    const approvalContext = user
      ? await this.workflowSvc.buildApprovalContext(pr.workflow, user.id, user.roles)
      : await this.workflowSvc.buildApprovalContext(pr.workflow);

    const procurementRoute = resolveProcurementRoute(Number(pr.totalEstimatedAmount));

    return { ...pr, approvalContext, procurementRoute };
  }

  async create(dto: any, user: UserPayload) {
    // 1. Verify grant exists and is active
    const grant = await this.prisma.grant.findUnique({
      where: { id: dto.grantId, deletedAt: null },
    });
    if (!grant) throw new NotFoundException('Grant not found');
    if (grant.status !== 'ACTIVE') throw new BadRequestException('Grant is not active');

    // 2. Budget availability check if budgetLineId provided
    if (dto.budgetLineId && dto.totalEstimatedAmount) {
      await this.grantsSvc.checkBudgetAvailability(dto.budgetLineId, Number(dto.totalEstimatedAmount));
    }

    // 3. Generate serial number
    const serialNumber = await this.serialSvc.next(grant.code, 'PR');

    // 4. Create PR
    const pr = await this.prisma.purchaseRequisition.create({
      data: {
        serialNumber,
        grantId: dto.grantId,
        activityId: dto.activityId,
        appItemId: dto.appItemId,
        budgetLineId: dto.budgetLineId,
        title: dto.title,
        description: dto.description,
        requestedById: user.id,
        departmentId: dto.departmentId,
        procurementMethodId: dto.procurementMethodId,
        totalEstimatedAmount: new Prisma.Decimal(dto.totalEstimatedAmount),
        currency: dto.currency || 'USD',
        requiredByDate: dto.requiredByDate ? new Date(dto.requiredByDate) : null,
        justification: dto.justification,
        status: DocumentStatus.DRAFT,
        items: dto.items
          ? {
              create: dto.items.map((item: any) => ({
                description: item.description,
                specification: item.specification,
                unit: item.unit,
                quantity: new Prisma.Decimal(item.quantity),
                estimatedUnitPrice: new Prisma.Decimal(item.estimatedUnitPrice),
                totalEstimated: new Prisma.Decimal(item.totalEstimated || Number(item.quantity) * Number(item.estimatedUnitPrice)),
                budgetLineId: item.budgetLineId,
              })),
            }
          : undefined,
      },
      include: { items: true, grant: true, requestedBy: { select: { firstName: true, lastName: true } } },
    });

    await this.auditSvc.log({
      userId: user.id,
      userEmail: user.email,
      action: 'CREATE',
      module: 'PROCUREMENT',
      resource: 'PurchaseRequisition',
      resourceId: pr.id,
      newValues: { serialNumber, title: pr.title, grantId: pr.grantId },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return pr;
  }

  async update(id: string, dto: any, user: UserPayload) {
    const pr = await this.findOne(id);
    if (pr.status !== DocumentStatus.DRAFT && pr.status !== DocumentStatus.RETURNED) {
      throw new BadRequestException('PR can only be edited in DRAFT or RETURNED status');
    }

    const updated = await this.prisma.purchaseRequisition.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.totalEstimatedAmount && { totalEstimatedAmount: new Prisma.Decimal(dto.totalEstimatedAmount) }),
        ...(dto.requiredByDate && { requiredByDate: new Date(dto.requiredByDate) }),
        ...(dto.justification !== undefined && { justification: dto.justification }),
        ...(dto.procurementMethodId && { procurementMethodId: dto.procurementMethodId }),
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'UPDATE',
      module: 'PROCUREMENT',
      resource: 'PurchaseRequisition',
      resourceId: id,
      newValues: updated,
    });

    return updated;
  }

  async submit(id: string, user: UserPayload) {
    const pr = await this.findOne(id);
    if (pr.status !== DocumentStatus.DRAFT && pr.status !== DocumentStatus.RETURNED) {
      throw new BadRequestException('Only DRAFT or RETURNED PRs can be submitted');
    }

    // Budget check before submission
    if (pr.budgetLineId) {
      await this.grantsSvc.checkBudgetAvailability(pr.budgetLineId, Number(pr.totalEstimatedAmount));
    }

    // Start workflow
    const workflowInstance = await this.workflowSvc.startWorkflow(
      'PURCHASE_REQUISITION',
      id,
      user.id,
    );

    const updated = await this.prisma.purchaseRequisition.update({
      where: { id },
      data: {
        status: DocumentStatus.SUBMITTED,
        workflowInstanceId: workflowInstance?.id,
      },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'SUBMIT',
      module: 'PROCUREMENT',
      resource: 'PurchaseRequisition',
      resourceId: id,
      newValues: { status: 'SUBMITTED' },
    });

    return updated;
  }

  async approve(id: string, comment: string | undefined, user: UserPayload) {
    return this.processWorkflowAction(id, 'APPROVE', comment, user);
  }

  async reject(id: string, comment: string, user: UserPayload) {
    return this.processWorkflowAction(id, 'REJECT', comment, user);
  }

  async return_(id: string, comment: string, user: UserPayload) {
    return this.processWorkflowAction(id, 'RETURN', comment, user);
  }

  private async processWorkflowAction(
    id: string,
    action: 'APPROVE' | 'REJECT' | 'RETURN',
    comment: string | undefined,
    user: UserPayload,
  ) {
    const pr = await this.findOne(id);
    if (!pr.workflowInstanceId) throw new BadRequestException('No active workflow for this PR');

    const instance = await this.workflowSvc.processAction(
      pr.workflowInstanceId,
      action as any,
      user.id,
      comment,
      { ipAddress: user.ipAddress, userAgent: user.userAgent },
    );

    // Update PR status based on workflow outcome
    let newStatus = pr.status as DocumentStatus;
    if (action === 'RETURN') {
      newStatus = DocumentStatus.RETURNED;
    } else if (instance.status === 'APPROVED') {
      newStatus = DocumentStatus.APPROVED;
      // Commit budget on final approval
      if (pr.budgetLineId) {
        await this.grantsSvc.commitBudget(pr.budgetLineId, Number(pr.totalEstimatedAmount));
      }
    } else if (instance.status === 'REJECTED') {
      newStatus = DocumentStatus.REJECTED;
    } else if (instance.status === 'RETURNED') {
      newStatus = DocumentStatus.RETURNED;
    }

    if (newStatus !== pr.status) {
      await this.prisma.purchaseRequisition.update({
        where: { id },
        data: { status: newStatus },
      });
    }

    await this.auditSvc.log({
      userId: user.id,
      action: action === 'APPROVE' ? 'APPROVE' : action === 'REJECT' ? 'REJECT' : 'RETURN',
      module: 'PROCUREMENT',
      resource: 'PurchaseRequisition',
      resourceId: id,
      newValues: { status: newStatus, workflowAction: action },
    });

    let procurementRoute: ProcurementRoute | undefined;
    let nextStep: { type: 'RFQ' | 'PO'; rfqId?: string; redirectUrl: string } | undefined;

    if (newStatus === DocumentStatus.APPROVED && action === 'APPROVE') {
      procurementRoute = resolveProcurementRoute(Number(pr.totalEstimatedAmount));
      if (procurementRoute === 'RFQ') {
        const rfq = await this.rfqSvc.createDraftFromPr(id, user);
        nextStep = {
          type: 'RFQ',
          rfqId: rfq.id,
          redirectUrl: `/procurement/rfq/${rfq.id}`,
        };
      } else {
        nextStep = {
          type: 'PO',
          redirectUrl: `/procurement/purchase-orders/new?prId=${id}`,
        };
      }
    }

    return { status: newStatus, workflowInstance: instance, procurementRoute, nextStep };
  }

  async softDelete(id: string, user: UserPayload) {
    const pr = await this.findOne(id);
    if (pr.status === DocumentStatus.APPROVED) {
      throw new BadRequestException('Cannot delete an approved PR');
    }
    await this.prisma.purchaseRequisition.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async getItems(prId: string) {
    return this.prisma.prItem.findMany({ where: { prId }, orderBy: { createdAt: 'asc' } });
  }

  async addItem(prId: string, dto: any) {
    const pr = await this.findOne(prId);
    if (pr.status !== DocumentStatus.DRAFT && pr.status !== DocumentStatus.RETURNED) {
      throw new BadRequestException('Items can only be added to DRAFT or RETURNED PRs');
    }
    return this.prisma.prItem.create({
      data: {
        prId,
        description: dto.description,
        specification: dto.specification,
        unit: dto.unit,
        quantity: new Prisma.Decimal(dto.quantity),
        estimatedUnitPrice: new Prisma.Decimal(dto.estimatedUnitPrice),
        totalEstimated: new Prisma.Decimal(Number(dto.quantity) * Number(dto.estimatedUnitPrice)),
        budgetLineId: dto.budgetLineId,
      },
    });
  }

  async uploadDocuments(
    prId: string,
    files: Express.Multer.File[],
    labels: string[],
    user: UserPayload,
  ) {
    const pr = await this.findOne(prId);
    if (pr.status !== DocumentStatus.DRAFT && pr.status !== DocumentStatus.RETURNED) {
      throw new BadRequestException('Documents can only be added to DRAFT or RETURNED PRs');
    }

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
      const storageKey = `requisitions/${prId}/${timestamp}-${safeName}`;

      await this.minioSvc.uploadFile(file.buffer, storageKey, file.mimetype);
      const fileUrl = this.minioSvc.buildPublicUrl(storageKey);

      const attachment = await this.prisma.documentAttachment.create({
        data: {
          documentType: 'PurchaseRequisition',
          documentId: prId,
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
      module: 'PROCUREMENT',
      resource: 'DocumentAttachment',
      resourceId: prId,
      newValues: { count: results.length },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return results;
  }

  async listDocuments(prId: string) {
    await this.findOne(prId);

    return this.prisma.documentAttachment.findMany({
      where: {
        documentType: 'PurchaseRequisition',
        documentId: prId,
        deletedAt: null,
      },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(prId: string, attachmentId: string, user: UserPayload) {
    const pr = await this.findOne(prId);
    if (pr.status !== DocumentStatus.DRAFT && pr.status !== DocumentStatus.RETURNED) {
      throw new BadRequestException('Documents can only be removed from DRAFT or RETURNED PRs');
    }

    const attachment = await this.prisma.documentAttachment.findFirst({
      where: {
        id: attachmentId,
        documentType: 'PurchaseRequisition',
        documentId: prId,
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
      module: 'PROCUREMENT',
      resource: 'DocumentAttachment',
      resourceId: attachmentId,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });
  }
}
