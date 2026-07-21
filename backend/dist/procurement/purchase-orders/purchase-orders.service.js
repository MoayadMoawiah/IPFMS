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
exports.PurchaseOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const workflow_service_1 = require("../../workflow/workflow.service");
const serial_service_1 = require("../../serial/serial.service");
const audit_service_1 = require("../../audit/audit.service");
const grants_service_1 = require("../../grants/grants.service");
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
const PO_DOC_EDITABLE_STATUSES = [
    client_1.DocumentStatus.DRAFT,
    client_1.DocumentStatus.RETURNED,
    client_1.DocumentStatus.SUBMITTED,
];
let PurchaseOrdersService = class PurchaseOrdersService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc, grantsSvc, minioSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
        this.grantsSvc = grantsSvc;
        this.minioSvc = minioSvc;
        this.userWithRoles = {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: { include: { role: { select: { id: true, name: true } } } },
            },
        };
        this.poDetailInclude = {
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
        };
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, grantId, vendorId } = query;
        const where = {
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
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async resolvePurchaseOrderId(idOrPrefix) {
        const exact = await this.prisma.purchaseOrder.findFirst({
            where: { id: idOrPrefix, deletedAt: null },
            select: { id: true },
        });
        if (exact)
            return exact.id;
        if (idOrPrefix.length >= 10 && idOrPrefix.length < 25) {
            const prefixMatches = await this.prisma.purchaseOrder.findMany({
                where: { id: { startsWith: idOrPrefix }, deletedAt: null },
                select: { id: true },
                take: 2,
            });
            if (prefixMatches.length === 1)
                return prefixMatches[0].id;
        }
        const bySerial = await this.prisma.purchaseOrder.findFirst({
            where: { serialNumber: idOrPrefix, deletedAt: null },
            select: { id: true },
        });
        return bySerial?.id ?? null;
    }
    async findOne(id, user) {
        const resolvedId = await this.resolvePurchaseOrderId(id);
        if (!resolvedId) {
            throw new common_1.NotFoundException(`Purchase Order ${id} not found`);
        }
        const po = await this.prisma.purchaseOrder.findFirst({
            where: { id: resolvedId, deletedAt: null },
            include: this.poDetailInclude,
        });
        if (!po)
            throw new common_1.NotFoundException(`Purchase Order ${id} not found`);
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
    async create(dto, user) {
        const grant = await this.prisma.grant.findUnique({ where: { id: dto.grantId } });
        if (!grant)
            throw new common_1.NotFoundException('Grant not found');
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
                subtotal: new client_1.Prisma.Decimal(dto.subtotal),
                taxAmount: new client_1.Prisma.Decimal(dto.taxAmount || '0'),
                totalAmount: new client_1.Prisma.Decimal(dto.totalAmount),
                terms: dto.terms,
                notes: dto.notes,
                status: client_1.DocumentStatus.DRAFT,
                createdById: user.id,
                items: dto.items ? {
                    create: dto.items.map((item) => ({
                        description: item.description,
                        specification: item.specification,
                        unit: item.unit,
                        orderedQuantity: new client_1.Prisma.Decimal(item.orderedQuantity),
                        unitPrice: new client_1.Prisma.Decimal(item.unitPrice),
                        totalPrice: new client_1.Prisma.Decimal(Number(item.orderedQuantity) * Number(item.unitPrice)),
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
    async submit(id, user) {
        const po = await this.findOne(id);
        if (po.status !== client_1.DocumentStatus.DRAFT && po.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('Only DRAFT or RETURNED POs can be submitted');
        }
        const workflowInstance = await this.workflowSvc.startWorkflow('PURCHASE_ORDER', id, user.id);
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: { status: client_1.DocumentStatus.SUBMITTED, workflowInstanceId: workflowInstance?.id },
        });
    }
    async approve(id, comment, user) {
        return this.processWorkflowAction(id, 'APPROVE', comment, user);
    }
    async reject(id, comment, user) {
        if (!comment?.trim()) {
            throw new common_1.BadRequestException('A comment is required when rejecting');
        }
        return this.processWorkflowAction(id, 'REJECT', comment, user);
    }
    async return_(id, comment, user) {
        if (!comment?.trim()) {
            throw new common_1.BadRequestException('A comment is required when returning');
        }
        return this.processWorkflowAction(id, 'RETURN', comment, user);
    }
    async processWorkflowAction(id, action, comment, user) {
        const po = await this.findOne(id);
        if (!po.workflowInstanceId)
            throw new common_1.BadRequestException('No active workflow');
        const instance = await this.workflowSvc.processAction(po.workflowInstanceId, action, user.id, comment, { ipAddress: user.ipAddress, userAgent: user.userAgent });
        let newStatus = po.status;
        if (action === 'RETURN') {
            newStatus = client_1.DocumentStatus.RETURNED;
        }
        else if (instance.status === 'APPROVED') {
            newStatus = client_1.DocumentStatus.APPROVED;
        }
        else if (instance.status === 'REJECTED') {
            newStatus = client_1.DocumentStatus.REJECTED;
        }
        else if (instance.status === 'RETURNED') {
            newStatus = client_1.DocumentStatus.RETURNED;
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
    async issue(id, user) {
        const po = await this.findOne(id);
        if (po.status !== client_1.DocumentStatus.APPROVED) {
            throw new common_1.BadRequestException('Only APPROVED POs can be issued');
        }
        return this.prisma.purchaseOrder.update({
            where: { id: po.id },
            data: {
                status: client_1.DocumentStatus.ISSUED,
                issuedById: user.id,
                issuedAt: new Date(),
            },
        });
    }
    async getPaymentStatus(id) {
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
    async softDelete(id, user) {
        const po = await this.findOne(id);
        if (po.status === client_1.DocumentStatus.APPROVED || po.status === client_1.DocumentStatus.ISSUED) {
            throw new common_1.BadRequestException('Cannot delete an approved or issued PO');
        }
        await this.prisma.purchaseOrder.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async uploadDocuments(poId, files, labels, user) {
        const po = await this.findOne(poId);
        if (!PO_DOC_EDITABLE_STATUSES.includes(po.status)) {
            throw new common_1.BadRequestException('Documents can only be added to DRAFT, RETURNED, or SUBMITTED purchase orders');
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
    async listDocuments(poId) {
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
    async deleteDocument(poId, attachmentId, user) {
        const po = await this.findOne(poId);
        if (!PO_DOC_EDITABLE_STATUSES.includes(po.status)) {
            throw new common_1.BadRequestException('Documents can only be removed from DRAFT, RETURNED, or SUBMITTED purchase orders');
        }
        const attachment = await this.prisma.documentAttachment.findFirst({
            where: {
                id: attachmentId,
                documentType: 'PurchaseOrder',
                documentId: poId,
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
            module: 'PROCUREMENT',
            resource: 'DocumentAttachment',
            resourceId: attachmentId,
            ipAddress: user.ipAddress,
            userAgent: user.userAgent,
        });
    }
};
exports.PurchaseOrdersService = PurchaseOrdersService;
exports.PurchaseOrdersService = PurchaseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workflow_service_1.WorkflowService,
        serial_service_1.SerialService,
        audit_service_1.AuditService,
        grants_service_1.GrantsService,
        minio_service_1.MinioService])
], PurchaseOrdersService);
//# sourceMappingURL=purchase-orders.service.js.map