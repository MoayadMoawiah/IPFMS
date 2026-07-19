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
exports.RequisitionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const workflow_service_1 = require("../../workflow/workflow.service");
const serial_service_1 = require("../../serial/serial.service");
const audit_service_1 = require("../../audit/audit.service");
const grants_service_1 = require("../../grants/grants.service");
const minio_service_1 = require("../../uploads/minio.service");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const procurement_constants_1 = require("../../common/constants/procurement.constants");
const rfq_service_1 = require("../rfq/rfq.service");
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
let RequisitionsService = class RequisitionsService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc, grantsSvc, minioSvc, rfqSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
        this.grantsSvc = grantsSvc;
        this.minioSvc = minioSvc;
        this.rfqSvc = rfqSvc;
    }
    async findAll(query, user) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, grantId } = query;
        const where = {
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
        const enriched = await Promise.all(data.map(async (pr) => {
            const approvalContext = await this.workflowSvc.buildApprovalContext(pr.workflow);
            const { workflow, ...rest } = pr;
            return { ...rest, approvalContext };
        }));
        return (0, pagination_dto_1.buildPaginationResponse)(enriched, total, page, limit);
    }
    async findOne(id, user) {
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
        if (!pr)
            throw new common_1.NotFoundException(`Purchase Requisition ${id} not found`);
        const approvalContext = user
            ? await this.workflowSvc.buildApprovalContext(pr.workflow, user.id, user.roles)
            : await this.workflowSvc.buildApprovalContext(pr.workflow);
        const procurementRoute = (0, procurement_constants_1.resolveProcurementRoute)(Number(pr.totalEstimatedAmount));
        return { ...pr, approvalContext, procurementRoute };
    }
    async create(dto, user) {
        const grant = await this.prisma.grant.findUnique({
            where: { id: dto.grantId, deletedAt: null },
        });
        if (!grant)
            throw new common_1.NotFoundException('Grant not found');
        if (grant.status !== 'ACTIVE')
            throw new common_1.BadRequestException('Grant is not active');
        if (dto.budgetLineId && dto.totalEstimatedAmount) {
            await this.grantsSvc.checkBudgetAvailability(dto.budgetLineId, Number(dto.totalEstimatedAmount));
        }
        const serialNumber = await this.serialSvc.next(grant.code, 'PR');
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
                totalEstimatedAmount: new client_1.Prisma.Decimal(dto.totalEstimatedAmount),
                currency: dto.currency || 'USD',
                requiredByDate: dto.requiredByDate ? new Date(dto.requiredByDate) : null,
                justification: dto.justification,
                status: client_1.DocumentStatus.DRAFT,
                items: dto.items
                    ? {
                        create: dto.items.map((item) => ({
                            description: item.description,
                            specification: item.specification,
                            unit: item.unit,
                            quantity: new client_1.Prisma.Decimal(item.quantity),
                            estimatedUnitPrice: new client_1.Prisma.Decimal(item.estimatedUnitPrice),
                            totalEstimated: new client_1.Prisma.Decimal(item.totalEstimated || Number(item.quantity) * Number(item.estimatedUnitPrice)),
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
    async update(id, dto, user) {
        const pr = await this.findOne(id);
        if (pr.status !== client_1.DocumentStatus.DRAFT && pr.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('PR can only be edited in DRAFT or RETURNED status');
        }
        const updated = await this.prisma.purchaseRequisition.update({
            where: { id },
            data: {
                ...(dto.title && { title: dto.title }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.totalEstimatedAmount && { totalEstimatedAmount: new client_1.Prisma.Decimal(dto.totalEstimatedAmount) }),
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
    async submit(id, user) {
        const pr = await this.findOne(id);
        if (pr.status !== client_1.DocumentStatus.DRAFT && pr.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('Only DRAFT or RETURNED PRs can be submitted');
        }
        if (pr.budgetLineId) {
            await this.grantsSvc.checkBudgetAvailability(pr.budgetLineId, Number(pr.totalEstimatedAmount));
        }
        const workflowInstance = await this.workflowSvc.startWorkflow('PURCHASE_REQUISITION', id, user.id);
        const updated = await this.prisma.purchaseRequisition.update({
            where: { id },
            data: {
                status: client_1.DocumentStatus.SUBMITTED,
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
    async approve(id, comment, user) {
        return this.processWorkflowAction(id, 'APPROVE', comment, user);
    }
    async reject(id, comment, user) {
        return this.processWorkflowAction(id, 'REJECT', comment, user);
    }
    async return_(id, comment, user) {
        return this.processWorkflowAction(id, 'RETURN', comment, user);
    }
    async processWorkflowAction(id, action, comment, user) {
        const pr = await this.findOne(id);
        if (!pr.workflowInstanceId)
            throw new common_1.BadRequestException('No active workflow for this PR');
        const instance = await this.workflowSvc.processAction(pr.workflowInstanceId, action, user.id, comment, { ipAddress: user.ipAddress, userAgent: user.userAgent });
        let newStatus = pr.status;
        if (action === 'RETURN') {
            newStatus = client_1.DocumentStatus.RETURNED;
        }
        else if (instance.status === 'APPROVED') {
            newStatus = client_1.DocumentStatus.APPROVED;
            if (pr.budgetLineId) {
                await this.grantsSvc.commitBudget(pr.budgetLineId, Number(pr.totalEstimatedAmount));
            }
        }
        else if (instance.status === 'REJECTED') {
            newStatus = client_1.DocumentStatus.REJECTED;
        }
        else if (instance.status === 'RETURNED') {
            newStatus = client_1.DocumentStatus.RETURNED;
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
        let procurementRoute;
        let nextStep;
        if (newStatus === client_1.DocumentStatus.APPROVED && action === 'APPROVE') {
            procurementRoute = (0, procurement_constants_1.resolveProcurementRoute)(Number(pr.totalEstimatedAmount));
            if (procurementRoute === 'RFQ') {
                const rfq = await this.rfqSvc.createDraftFromPr(id, user);
                nextStep = {
                    type: 'RFQ',
                    rfqId: rfq.id,
                    redirectUrl: `/procurement/rfq/${rfq.id}`,
                };
            }
            else {
                nextStep = {
                    type: 'PO',
                    redirectUrl: `/procurement/purchase-orders/new?prId=${id}`,
                };
            }
        }
        return { status: newStatus, workflowInstance: instance, procurementRoute, nextStep };
    }
    async softDelete(id, user) {
        const pr = await this.findOne(id);
        if (pr.status === client_1.DocumentStatus.APPROVED) {
            throw new common_1.BadRequestException('Cannot delete an approved PR');
        }
        await this.prisma.purchaseRequisition.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async getItems(prId) {
        return this.prisma.prItem.findMany({ where: { prId }, orderBy: { createdAt: 'asc' } });
    }
    async addItem(prId, dto) {
        const pr = await this.findOne(prId);
        if (pr.status !== client_1.DocumentStatus.DRAFT && pr.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('Items can only be added to DRAFT or RETURNED PRs');
        }
        return this.prisma.prItem.create({
            data: {
                prId,
                description: dto.description,
                specification: dto.specification,
                unit: dto.unit,
                quantity: new client_1.Prisma.Decimal(dto.quantity),
                estimatedUnitPrice: new client_1.Prisma.Decimal(dto.estimatedUnitPrice),
                totalEstimated: new client_1.Prisma.Decimal(Number(dto.quantity) * Number(dto.estimatedUnitPrice)),
                budgetLineId: dto.budgetLineId,
            },
        });
    }
    async uploadDocuments(prId, files, labels, user) {
        const pr = await this.findOne(prId);
        if (pr.status !== client_1.DocumentStatus.DRAFT && pr.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('Documents can only be added to DRAFT or RETURNED PRs');
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
    async listDocuments(prId) {
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
    async deleteDocument(prId, attachmentId, user) {
        const pr = await this.findOne(prId);
        if (pr.status !== client_1.DocumentStatus.DRAFT && pr.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('Documents can only be removed from DRAFT or RETURNED PRs');
        }
        const attachment = await this.prisma.documentAttachment.findFirst({
            where: {
                id: attachmentId,
                documentType: 'PurchaseRequisition',
                documentId: prId,
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
exports.RequisitionsService = RequisitionsService;
exports.RequisitionsService = RequisitionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workflow_service_1.WorkflowService,
        serial_service_1.SerialService,
        audit_service_1.AuditService,
        grants_service_1.GrantsService,
        minio_service_1.MinioService,
        rfq_service_1.RfqService])
], RequisitionsService);
//# sourceMappingURL=requisitions.service.js.map