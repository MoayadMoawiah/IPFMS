import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
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

const GRN_DOC_EDITABLE_STATUSES: DocumentStatus[] = [
  DocumentStatus.DRAFT,
  DocumentStatus.RETURNED,
];

@Injectable()
export class GoodsReceiptService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowSvc: WorkflowService,
    private readonly serialSvc: SerialService,
    private readonly auditSvc: AuditService,
    private readonly minioSvc: MinioService,
  ) {}

  async findAll(query: any) {
    const { page, limit } = parsePagination(query);
    const { search, status } = query;
    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(search && {
        OR: [
          { serialNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.goodsReceipt.findMany({
        where,
        include: {
          po: { select: { id: true, serialNumber: true, title: true } },
          grant: { select: { id: true, code: true } },
          receivedBy: { select: { id: true, firstName: true, lastName: true } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.goodsReceipt.count({ where }),
    ]);

    return buildPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string, user?: UserPayload) {
    const userWithRoles = {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        roles: { include: { role: { select: { id: true, name: true } } } },
      },
    };

    const grn = await this.prisma.goodsReceipt.findUnique({
      where: { id, deletedAt: null },
      include: {
        po: { include: { items: true, vendor: { select: { id: true, name: true } } } },
        grant: true,
        warehouse: true,
        receivedBy: userWithRoles,
        items: { include: { poItem: true } },
        workflow: {
          include: {
            steps: {
              orderBy: { stepNumber: 'asc' },
              include: {
                digitalSignature: { include: { user: userWithRoles } },
              },
            },
            actions: {
              include: { actor: userWithRoles },
              orderBy: { actionAt: 'asc' },
            },
          },
        },
      },
    });
    if (!grn) throw new NotFoundException(`GRN ${id} not found`);

    const approvalContext = user
      ? await this.workflowSvc.buildApprovalContext(grn.workflow, user.id, user.roles)
      : await this.workflowSvc.buildApprovalContext(grn.workflow);

    return { ...grn, approvalContext };
  }

  async create(dto: any, user: UserPayload) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: dto.poId },
      include: { grant: true },
    });
    if (!po) throw new NotFoundException('Purchase Order not found');
    const grnAllowedStatuses = new Set(['APPROVED', 'ISSUED']);
    if (!grnAllowedStatuses.has(po.status)) {
      throw new BadRequestException(
        'PO must be APPROVED or ISSUED to create a goods receipt',
      );
    }

    const serialNumber = await this.serialSvc.next(po.grant.code, 'GRN');

    const grn = await this.prisma.goodsReceipt.create({
      data: {
        serialNumber,
        poId: dto.poId,
        grantId: po.grantId,
        warehouseId: dto.warehouseId,
        receiptDate: new Date(dto.receiptDate || Date.now()),
        deliveryNote: dto.deliveryNote,
        notes: dto.notes,
        status: DocumentStatus.DRAFT,
        receivedById: user.id,
        items: dto.items ? {
          create: dto.items.map((item: any) => ({
            poItemId: item.poItemId,
            description: item.description,
            orderedQuantity: new Prisma.Decimal(item.orderedQuantity),
            deliveredQuantity: new Prisma.Decimal(item.deliveredQuantity),
            acceptedQuantity: new Prisma.Decimal(item.acceptedQuantity),
            rejectedQuantity: new Prisma.Decimal(item.rejectedQuantity || '0'),
            damagedQuantity: new Prisma.Decimal(item.damagedQuantity || '0'),
            notes: item.notes,
          })),
        } : undefined,
      },
      include: { items: true },
    });

    await this.auditSvc.log({
      userId: user.id,
      action: 'CREATE',
      module: 'GOODS_RECEIPTS',
      resource: 'GoodsReceipt',
      resourceId: grn.id,
      newValues: { serialNumber, poId: grn.poId },
    });

    return grn;
  }

  async update(id: string, dto: any, user: UserPayload) {
    const grn = await this.findOne(id);
    if (
      grn.status !== DocumentStatus.DRAFT &&
      grn.status !== DocumentStatus.RETURNED
    ) {
      throw new BadRequestException(
        'Only DRAFT or RETURNED GRNs can be updated',
      );
    }

    const items = Array.isArray(dto.items) ? dto.items : [];
    for (const item of items) {
      const rejectedQty = Number(item.rejectedQuantity) || 0;
      if (rejectedQty > 0 && !String(item.notes ?? '').trim()) {
        throw new BadRequestException(
          'Rejection reason is required for rejected items',
        );
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.goodsReceipt.update({
        where: { id },
        data: {
          ...(dto.warehouseId !== undefined && {
            warehouseId: dto.warehouseId || null,
          }),
          ...(dto.receiptDate && {
            receiptDate: new Date(dto.receiptDate),
          }),
          ...(dto.deliveryNote !== undefined && {
            deliveryNote: dto.deliveryNote,
          }),
          ...(dto.notes !== undefined && { notes: dto.notes }),
        },
      });

      for (const item of items) {
        if (!item.id) continue;
        const existing = grn.items.find((i) => i.id === item.id);
        if (!existing) {
          throw new BadRequestException(`GRN item ${item.id} not found`);
        }

        await tx.grnItem.update({
          where: { id: item.id },
          data: {
            ...(item.description !== undefined && {
              description: item.description,
            }),
            ...(item.deliveredQuantity !== undefined && {
              deliveredQuantity: new Prisma.Decimal(item.deliveredQuantity),
            }),
            ...(item.acceptedQuantity !== undefined && {
              acceptedQuantity: new Prisma.Decimal(item.acceptedQuantity),
            }),
            ...(item.rejectedQuantity !== undefined && {
              rejectedQuantity: new Prisma.Decimal(item.rejectedQuantity || 0),
            }),
            ...(item.damagedQuantity !== undefined && {
              damagedQuantity: new Prisma.Decimal(item.damagedQuantity || 0),
            }),
            ...(item.notes !== undefined && { notes: item.notes || null }),
          },
        });
      }
    });

    await this.auditSvc.log({
      userId: user.id,
      userEmail: user.email,
      action: 'UPDATE',
      module: 'GOODS_RECEIPTS',
      resource: 'GoodsReceipt',
      resourceId: id,
      newValues: {
        warehouseId: dto.warehouseId,
        receiptDate: dto.receiptDate,
        itemCount: items.length,
      },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return this.findOne(id, user);
  }

  async submit(id: string, user: UserPayload) {
    const grn = await this.findOne(id);
    if (grn.status !== DocumentStatus.DRAFT && grn.status !== DocumentStatus.RETURNED) {
      throw new BadRequestException('Only DRAFT or RETURNED GRNs can be submitted');
    }

    const workflowInstance = await this.workflowSvc.startWorkflow('GOODS_RECEIPT', id, user.id);

    return this.prisma.goodsReceipt.update({
      where: { id },
      data: { status: DocumentStatus.SUBMITTED, workflowInstanceId: workflowInstance?.id },
    });
  }

  async approve(id: string, comment: string | undefined, user: UserPayload) {
    const grn = await this.findOne(id);
    if (!grn.workflowInstanceId) throw new BadRequestException('No active workflow');

    const instance = await this.workflowSvc.processAction(
      grn.workflowInstanceId,
      'APPROVE' as any,
      user.id,
      comment,
      { ipAddress: user.ipAddress, userAgent: user.userAgent },
    );

    if (instance.status === 'APPROVED') {
      for (const item of grn.items) {
        await this.prisma.poItem.update({
          where: { id: item.poItemId },
          data: { receivedQuantity: { increment: new Prisma.Decimal(Number(item.acceptedQuantity)) } },
        });
      }

      for (const item of grn.items) {
        if (item.acceptedQuantity && Number(item.acceptedQuantity) > 0) {
          // Stock movement would be added here linked to warehouse
        }
      }

      await this.prisma.goodsReceipt.update({
        where: { id },
        data: { status: DocumentStatus.APPROVED },
      });
    }

    return instance;
  }

  async reject(id: string, comment: string, user: UserPayload) {
    if (!comment?.trim()) {
      throw new BadRequestException('Rejection comment is required');
    }

    const grn = await this.findOne(id);
    if (!grn.workflowInstanceId) throw new BadRequestException('No active workflow');

    const instance = await this.workflowSvc.processAction(
      grn.workflowInstanceId,
      'REJECT' as any,
      user.id,
      comment.trim(),
      { ipAddress: user.ipAddress, userAgent: user.userAgent },
    );

    if (instance.status === 'REJECTED') {
      await this.prisma.goodsReceipt.update({
        where: { id },
        data: { status: DocumentStatus.REJECTED },
      });
    }

    return instance;
  }

  async return_(id: string, comment: string, user: UserPayload) {
    if (!comment?.trim()) {
      throw new BadRequestException('A comment is required when returning a GRN');
    }

    const grn = await this.findOne(id);
    if (!grn.workflowInstanceId) throw new BadRequestException('No active workflow');

    const instance = await this.workflowSvc.processAction(
      grn.workflowInstanceId,
      'RETURN' as any,
      user.id,
      comment.trim(),
      { ipAddress: user.ipAddress, userAgent: user.userAgent },
    );

    if (instance.status === 'RETURNED') {
      await this.prisma.goodsReceipt.update({
        where: { id },
        data: { status: DocumentStatus.RETURNED },
      });
    }

    await this.auditSvc.log({
      userId: user.id,
      userEmail: user.email,
      action: 'RETURN',
      module: 'GOODS_RECEIPTS',
      resource: 'GoodsReceipt',
      resourceId: id,
      newValues: { status: DocumentStatus.RETURNED, comment: comment.trim() },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return instance;
  }

  async uploadDocuments(
    grnId: string,
    files: Express.Multer.File[],
    labels: string[],
    user: UserPayload,
  ) {
    const grn = await this.findOne(grnId);
    if (!GRN_DOC_EDITABLE_STATUSES.includes(grn.status as DocumentStatus)) {
      throw new BadRequestException(
        'Documents can only be added to DRAFT or RETURNED goods receipts',
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
      const storageKey = `goods-receipts/${grnId}/${timestamp}-${safeName}`;

      await this.minioSvc.uploadFile(file.buffer, storageKey, file.mimetype);
      const fileUrl = this.minioSvc.buildPublicUrl(storageKey);

      const attachment = await this.prisma.documentAttachment.create({
        data: {
          documentType: 'GoodsReceipt',
          documentId: grnId,
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
      module: 'GOODS_RECEIPTS',
      resource: 'DocumentAttachment',
      resourceId: grnId,
      newValues: { count: results.length },
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });

    return results;
  }

  async listDocuments(grnId: string) {
    await this.findOne(grnId);

    return this.prisma.documentAttachment.findMany({
      where: {
        documentType: 'GoodsReceipt',
        documentId: grnId,
        deletedAt: null,
      },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(grnId: string, attachmentId: string, user: UserPayload) {
    const grn = await this.findOne(grnId);
    if (!GRN_DOC_EDITABLE_STATUSES.includes(grn.status as DocumentStatus)) {
      throw new BadRequestException(
        'Documents can only be removed from DRAFT or RETURNED goods receipts',
      );
    }

    const attachment = await this.prisma.documentAttachment.findFirst({
      where: {
        id: attachmentId,
        documentType: 'GoodsReceipt',
        documentId: grnId,
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
      module: 'GOODS_RECEIPTS',
      resource: 'DocumentAttachment',
      resourceId: attachmentId,
      ipAddress: user.ipAddress,
      userAgent: user.userAgent,
    });
  }

  async softDelete(id: string, user: UserPayload) {
    await this.findOne(id);
    await this.prisma.goodsReceipt.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
