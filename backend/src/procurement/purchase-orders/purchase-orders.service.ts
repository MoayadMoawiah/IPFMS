import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { GrantsService } from '../../grants/grants.service';
import { MinioService } from '../../uploads/minio.service';
import { DocumentStatus, Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { buildPaginationResponse, parsePagination } from '../../common/dto/pagination.dto';

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

const PO_DOC_EDITABLE_STATUSES: DocumentStatus[] = [
  DocumentStatus.DRAFT,
  DocumentStatus.RETURNED,
  DocumentStatus.SUBMITTED,
];

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowSvc: WorkflowService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
    private readonly grantsSvc: GrantsService,
    private readonly minioSvc: MinioService,
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
      this.prisma.purchaseOrder.findMany({
        where,
        include: {
          vendor: { select: { id: true, name: true } },
          grant: { select: { id: true, code: true, name: true } },
          _count: { select: { items: true, goodsReceipts: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  private readonly userWithRoles = {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      roles: { include: { role: { select: { id: true, name: true } } } },
    },
  };

  async findOne(id: string, user?: UserPayload) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id, deletedAt: null },
      include: {
        vendor: {
          include: {
            bankAccounts: { orderBy: { isPrimary: 'desc' } },
          },
        },
        grant: true,
        rfq: { select: { id: true, serialNumber: true, title: true, status: true } },
        paf: { select: { id: true, status: true, recommendedVendorId: true } },
        pr: {
          select: {
            id: true,
            serialNumber: true,
            title: true,
            requestedBy: this.userWithRoles,
          },
        },
        items: true,
        workflow: {
          include: {
            template: { select: { id: true } },
            steps: {
              orderBy: { stepNumber: 'asc' },
              include: {
                digitalSignature: {
                  include: { user: this.userWithRoles },
                },
              },
            },
            actions: {
              include: { actor: this.userWithRoles },
              orderBy: { actionAt: 'asc' },
            },
          },
        },
        goodsReceipts: {
          select: { id: true, serialNumber: true, status: true, receiptDate: true },
        },
        invoices: {
          select: { id: true, serialNumber: true, status: true, totalAmount: true, currency: true },
        },
      },
    });
    if (!po) throw new NotFoundException(`Purchase Order ${id} not found`);

    let createdBy = null;
    if (po.createdById) {
      createdBy = await this.prisma.user.findUnique({
        where: { id: po.createdById },
        ...this.userWithRoles,
      });
    }

    const approvalContext = user
      ? await this.workflowSvc.buildApprovalContext(po.workflow, user.id, user.roles)
      : await this.workflowSvc.buildApprovalContext(po.workflow);

    return { ...po, createdBy, approvalContext };
  }

  async create(dto: any, user: UserPayload) {
    const grant = await this.prisma.grant.findUnique({ where: { id: dto.grantId } });
    if (!grant) throw new NotFoundException('Grant not found');

    const serialNumber = await this.serialSvc.next(grant.code, 'PO');

    const po = await this.prisma.purchaseOrder.create({
      data: {
        serialNumber,
        prId: dto.prId,
        rfqId: dto.rfqId,
        pafId: dto.pafId,
        vendorId: dto.vendorId,
        grantId: dto.grantId,
        budgetLineId: dto.budgetLineId,
        contractId: dto.contractId,
        title: dto.title,
        deliveryAddress: dto.deliveryAddress,
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : null,
        currency: dto.currency || 'USD',
        subtotal: new Prisma.Decimal(dto.subtotal),
        taxAmount: new Prisma.Decimal(dto.taxAmount || '0'),
        totalAmount: new Prisma.Decimal(dto.totalAmount),
        terms: dto.terms,
        notes: dto.notes,
        status: DocumentStatus.DRAFT,
        createdById: user.id,
        items: dto.items ? {
          create: dto.items.map((item: any) => ({
            description: item.description,
            specification: item.specification,
            unit: item.unit,
            orderedQuantity: new Prisma.Decimal(item.orderedQuantity),
            unitPrice: new Prisma.Decimal(item.unitPrice),
            totalPrice: new Prisma.Decimal(Number(item.orderedQuantity) * Number(item.unitPrice)),
            budgetLineId: item.budgetLineId,
          })),
        } : undefined,
      },
      include: { items: true, vendor: true, grant: true },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'PURCHASE_ORDERS',
      resource: 'PurchaseOrder',
      resourceId: po.id,
      newValues: { serialNumber, vendorId: po.vendorId, totalAmount: po.totalAmount },
    });

    return po;
  }

  async submit(id: string, user: UserPayload) {
    const po = await this.findOne(id);
    if (po.status !== DocumentStatus.DRAFT && po.status !== DocumentStatus.RETURNED) {
      throw new BadRequestException('Only DRAFT or RETURNED POs can be submitted');
    }

    const workflowInstance = await this.workflowSvc.startWorkflow('PURCHASE_ORDER', id, user.id);

    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: DocumentStatus.SUBMITTED, workflowInstanceId: workflowInstance?.id },
    });
  }

  async approve(id: string, comment: string | undefined, user: UserPayload) {
    return this.processWorkflowAction(id, 'APPROVE', comment, user);
  }

  async reject(id: string, comment: string, user: UserPayload) {
    if (!comment?.trim()) {
      throw new BadRequestException('A comment is required when rejecting');
    }
    return this.processWorkflowAction(id, 'REJECT', comment, user);
  }

  async return_(id: string, comment: string, user: UserPayload) {
    if (!comment?.trim()) {
      throw new BadRequestException('A comment is required when returning');
    }
    return this.processWorkflowAction(id, 'RETURN', comment, user);
  }

  private async processWorkflowAction(
    id: string,
    action: 'APPROVE' | 'REJECT' | 'RETURN',
    comment: string | undefined,
    user: UserPayload,
  ) {
    const po = await this.findOne(id);
    if (!po.workflowInstanceId) throw new BadRequestException('No active workflow');

    const instance = await this.workflowSvc.processAction(
      po.workflowInstanceId,
      action as any,
      user.id,
      comment,
      { ipAddress: user.ipAddress, userAgent: user.userAgent },
    );

    let newStatus = po.status as DocumentStatus;
    if (action === 'RETURN') {
      newStatus = DocumentStatus.RETURNED;
    } else if (instance.status === 'APPROVED') {
      newStatus = DocumentStatus.APPROVED;
    } else if (instance.status === 'REJECTED') {
      newStatus = DocumentStatus.REJECTED;
    } else if (instance.status === 'RETURNED') {
      newStatus = DocumentStatus.RETURNED;
    }

    if (newStatus !== po.status) {
      await this.prisma.purchaseOrder.update({
        where: { id },
        data: { status: newStatus },
      });
    }

    await this.auditSvc.log({
      userId: user.id,
      userEmail: user.email,
      action: action === 'APPROVE' ? 'APPROVE' : action === 'REJECT' ? 'REJECT' : 'RETURN',
      module: 'PROCUREMENT',
      resource: 'PurchaseOrder',
      resourceId: id,
      newValues: { status: newStatus, workflowAction: action },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return { status: newStatus, workflowInstance: instance };
  }

  async issue(id: string, user: UserPayload) {
    const po = await this.findOne(id);
    if (po.status !== DocumentStatus.APPROVED) {
      throw new BadRequestException('Only APPROVED POs can be issued');
    }
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: 'ISSUED' as any, issuedById: user.id, issuedAt: new Date() },
    });
  }

  async getPaymentStatus(id: string) {
    const po = await this.findOne(id);
    return {
      totalAmount: Number(po.totalAmount),
      paidAmount: Number(po.paidAmount),
      remainingAmount: Number(po.totalAmount) - Number(po.paidAmount),
      paymentPercent: Number(po.totalAmount) > 0
        ? (Number(po.paidAmount) / Number(po.totalAmount)) * 100
        : 0,
    };
  }

  async softDelete(id: string, user: UserPayload) {
    const po = await this.findOne(id);
    if (po.status === DocumentStatus.APPROVED || po.status === 'ISSUED' as any) {
      throw new BadRequestException('Cannot delete an approved or issued PO');
    }
    await this.prisma.purchaseOrder.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async uploadDocuments(
    poId: string,
    files: Express.Multer.File[],
    labels: string[],
    user: UserPayload,
  ) {
    const po = await this.findOne(poId);
    if (!PO_DOC_EDITABLE_STATUSES.includes(po.status as DocumentStatus)) {
      throw new BadRequestException(
        'Documents can only be added to DRAFT, RETURNED, or SUBMITTED purchase orders',
      );
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
      const storageKey = `purchase-orders/${poId}/${timestamp}-${safeName}`;

      await this.minioSvc.uploadFile(file.buffer, storageKey, file.mimetype);
      const fileUrl = this.minioSvc.buildPublicUrl(storageKey);

      const attachment = await this.prisma.documentAttachment.create({
        data: {
          documentType: 'PurchaseOrder',
          documentId: poId,
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
      resourceId: poId,
      newValues: { count: results.length },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return results;
  }

  async listDocuments(poId: string) {
    await this.findOne(poId);

    return this.prisma.documentAttachment.findMany({
      where: {
        documentType: 'PurchaseOrder',
        documentId: poId,
        deletedAt: null,
      },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(poId: string, attachmentId: string, user: UserPayload) {
    const po = await this.findOne(poId);
    if (!PO_DOC_EDITABLE_STATUSES.includes(po.status as DocumentStatus)) {
      throw new BadRequestException(
        'Documents can only be removed from DRAFT, RETURNED, or SUBMITTED purchase orders',
      );
    }

    const attachment = await this.prisma.documentAttachment.findFirst({
      where: {
        id: attachmentId,
        documentType: 'PurchaseOrder',
        documentId: poId,
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
