"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoodsReceiptService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const workflow_service_1 = require("../../workflow/workflow.service");
const serial_service_1 = require("../../serial/serial.service");
const audit_service_1 = require("../../audit/audit.service");
const minio_service_1 = require("../../uploads/minio.service");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
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
const GRN_DOC_EDITABLE_STATUSES = [
    client_1.DocumentStatus.DRAFT,
    client_1.DocumentStatus.RETURNED,
];
let GoodsReceiptService = class GoodsReceiptService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc, minioSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
        this.minioSvc = minioSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status } = query;
        const where = {
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
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id, user) {
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
        if (!grn)
            throw new common_1.NotFoundException(`GRN ${id} not found`);
        const approvalContext = user
            ? await this.workflowSvc.buildApprovalContext(grn.workflow, user.id, user.roles)
            : await this.workflowSvc.buildApprovalContext(grn.workflow);
        return { ...grn, approvalContext };
    }
    async create(dto, user) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id: dto.poId },
            include: { grant: true },
        });
        if (!po)
            throw new common_1.NotFoundException('Purchase Order not found');
        const grnAllowedStatuses = new Set(['APPROVED', 'ISSUED']);
        if (!grnAllowedStatuses.has(po.status)) {
            throw new common_1.BadRequestException('PO must be APPROVED or ISSUED to create a goods receipt');
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
                status: client_1.DocumentStatus.DRAFT,
                receivedById: user.id,
                items: dto.items ? {
                    create: dto.items.map((item) => ({
                        poItemId: item.poItemId,
                        description: item.description,
                        orderedQuantity: new client_1.Prisma.Decimal(item.orderedQuantity),
                        deliveredQuantity: new client_1.Prisma.Decimal(item.deliveredQuantity),
                        acceptedQuantity: new client_1.Prisma.Decimal(item.acceptedQuantity),
                        rejectedQuantity: new client_1.Prisma.Decimal(item.rejectedQuantity || '0'),
                        damagedQuantity: new client_1.Prisma.Decimal(item.damagedQuantity || '0'),
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
    async update(id, dto, user) {
        const grn = await this.findOne(id);
        if (grn.status !== client_1.DocumentStatus.DRAFT &&
            grn.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('Only DRAFT or RETURNED GRNs can be updated');
        }
        const items = Array.isArray(dto.items) ? dto.items : [];
        for (const item of items) {
            const rejectedQty = Number(item.rejectedQuantity) || 0;
            if (rejectedQty > 0 && !String(item.notes ?? '').trim()) {
                throw new common_1.BadRequestException('Rejection reason is required for rejected items');
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
                if (!item.id)
                    continue;
                const existing = grn.items.find((i) => i.id === item.id);
                if (!existing) {
                    throw new common_1.BadRequestException(`GRN item ${item.id} not found`);
                }
                await tx.grnItem.update({
                    where: { id: item.id },
                    data: {
                        ...(item.description !== undefined && {
                            description: item.description,
                        }),
                        ...(item.deliveredQuantity !== undefined && {
                            deliveredQuantity: new client_1.Prisma.Decimal(item.deliveredQuantity),
                        }),
                        ...(item.acceptedQuantity !== undefined && {
                            acceptedQuantity: new client_1.Prisma.Decimal(item.acceptedQuantity),
                        }),
                        ...(item.rejectedQuantity !== undefined && {
                            rejectedQuantity: new client_1.Prisma.Decimal(item.rejectedQuantity || 0),
                        }),
                        ...(item.damagedQuantity !== undefined && {
                            damagedQuantity: new client_1.Prisma.Decimal(item.damagedQuantity || 0),
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
    async submit(id, user) {
        const grn = await this.findOne(id);
        if (grn.status !== client_1.DocumentStatus.DRAFT && grn.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('Only DRAFT or RETURNED GRNs can be submitted');
        }
        const workflowInstance = await this.workflowSvc.startWorkflow('GOODS_RECEIPT', id, user.id);
        return this.prisma.goodsReceipt.update({
            where: { id },
            data: { status: client_1.DocumentStatus.SUBMITTED, workflowInstanceId: workflowInstance?.id },
        });
    }
    async approve(id, comment, user) {
        const grn = await this.findOne(id);
        if (!grn.workflowInstanceId)
            throw new common_1.BadRequestException('No active workflow');
        const instance = await this.workflowSvc.processAction(grn.workflowInstanceId, 'APPROVE', user.id, comment, { ipAddress: user.ipAddress, userAgent: user.userAgent });
        if (instance.status === 'APPROVED') {
            for (const item of grn.items) {
                await this.prisma.poItem.update({
                    where: { id: item.poItemId },
                    data: { receivedQuantity: { increment: new client_1.Prisma.Decimal(Number(item.acceptedQuantity)) } },
                });
            }
            for (const item of grn.items) {
                if (item.acceptedQuantity && Number(item.acceptedQuantity) > 0) {
                }
            }
            await this.prisma.goodsReceipt.update({
                where: { id },
                data: { status: client_1.DocumentStatus.APPROVED },
            });
        }
        return instance;
    }
    async reject(id, comment, user) {
        if (!comment?.trim()) {
            throw new common_1.BadRequestException('Rejection comment is required');
        }
        const grn = await this.findOne(id);
        if (!grn.workflowInstanceId)
            throw new common_1.BadRequestException('No active workflow');
        const instance = await this.workflowSvc.processAction(grn.workflowInstanceId, 'REJECT', user.id, comment.trim(), { ipAddress: user.ipAddress, userAgent: user.userAgent });
        if (instance.status === 'REJECTED') {
            await this.prisma.goodsReceipt.update({
                where: { id },
                data: { status: client_1.DocumentStatus.REJECTED },
            });
        }
        return instance;
    }
    async return_(id, comment, user) {
        if (!comment?.trim()) {
            throw new common_1.BadRequestException('A comment is required when returning a GRN');
        }
        const grn = await this.findOne(id);
        if (!grn.workflowInstanceId)
            throw new common_1.BadRequestException('No active workflow');
        const instance = await this.workflowSvc.processAction(grn.workflowInstanceId, 'RETURN', user.id, comment.trim(), { ipAddress: user.ipAddress, userAgent: user.userAgent });
        if (instance.status === 'RETURNED') {
            await this.prisma.goodsReceipt.update({
                where: { id },
                data: { status: client_1.DocumentStatus.RETURNED },
            });
        }
        await this.auditSvc.log({
            userId: user.id,
            userEmail: user.email,
            action: 'RETURN',
            module: 'GOODS_RECEIPTS',
            resource: 'GoodsReceipt',
            resourceId: id,
            newValues: { status: client_1.DocumentStatus.RETURNED, comment: comment.trim() },
            ipAddress: user.ipAddress,
            userAgent: user.userAgent,
        });
        return instance;
    }
    async uploadDocuments(grnId, files, labels, user) {
        const grn = await this.findOne(grnId);
        if (!GRN_DOC_EDITABLE_STATUSES.includes(grn.status)) {
            throw new common_1.BadRequestException('Documents can only be added to DRAFT or RETURNED goods receipts');
        }
        const results = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const label = labels[i] ?? 'Other';
            if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
                throw new common_1.BadRequestException(`File type '${file.mimetype}' is not allowed for '${file.originalname}'`);
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                throw new common_1.BadRequestException(`File '${file.originalname}' exceeds the 20 MB size limit`);
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
    async listDocuments(grnId) {
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
    async deleteDocument(grnId, attachmentId, user) {
        const grn = await this.findOne(grnId);
        if (!GRN_DOC_EDITABLE_STATUSES.includes(grn.status)) {
            throw new common_1.BadRequestException('Documents can only be removed from DRAFT or RETURNED goods receipts');
        }
        const attachment = await this.prisma.documentAttachment.findFirst({
            where: {
                id: attachmentId,
                documentType: 'GoodsReceipt',
                documentId: grnId,
                deletedAt: null,
            },
        });
        if (!attachment)
            throw new common_1.NotFoundException('Document not found');
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
    async softDelete(id, user) {
        await this.findOne(id);
        await this.prisma.goodsReceipt.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.GoodsReceiptService = GoodsReceiptService;
exports.GoodsReceiptService = GoodsReceiptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workflow_service_1.WorkflowService,
        serial_service_1.SerialService,
        audit_service_1.AuditService,
        minio_service_1.MinioService])
], GoodsReceiptService);
//# sourceMappingURL=goods-receipt.service.js.map