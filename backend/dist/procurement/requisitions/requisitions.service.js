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
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let RequisitionsService = class RequisitionsService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc, grantsSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
        this.grantsSvc = grantsSvc;
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
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.purchaseRequisition.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id) {
        const pr = await this.prisma.purchaseRequisition.findUnique({
            where: { id, deletedAt: null },
            include: {
                grant: true,
                activity: true,
                requestedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
                procurementMethod: true,
                items: true,
                workflow: {
                    include: {
                        steps: { orderBy: { stepNumber: 'asc' }, include: { digitalSignature: true } },
                        actions: { include: { actor: { select: { firstName: true, lastName: true } } }, orderBy: { actionAt: 'asc' } },
                    },
                },
            },
        });
        if (!pr)
            throw new common_1.NotFoundException(`Purchase Requisition ${id} not found`);
        return pr;
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
        const instance = await this.workflowSvc.processAction(pr.workflowInstanceId, action, user.id, comment);
        let newStatus = pr.status;
        if (instance.status === 'APPROVED') {
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
        return { status: newStatus, workflowInstance: instance };
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
};
exports.RequisitionsService = RequisitionsService;
exports.RequisitionsService = RequisitionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workflow_service_1.WorkflowService,
        serial_service_1.SerialService,
        audit_service_1.AuditService,
        grants_service_1.GrantsService])
], RequisitionsService);
//# sourceMappingURL=requisitions.service.js.map