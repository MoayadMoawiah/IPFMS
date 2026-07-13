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
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let PurchaseOrdersService = class PurchaseOrdersService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc, grantsSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
        this.grantsSvc = grantsSvc;
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
    async findOne(id) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id, deletedAt: null },
            include: {
                vendor: true,
                grant: true,
                pr: { select: { id: true, serialNumber: true, title: true } },
                items: true,
                workflow: {
                    include: {
                        steps: { orderBy: { stepNumber: 'asc' } },
                        actions: { include: { actor: { select: { firstName: true, lastName: true } } }, orderBy: { actionAt: 'asc' } },
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
        if (!po)
            throw new common_1.NotFoundException(`Purchase Order ${id} not found`);
        return po;
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
        const po = await this.findOne(id);
        if (!po.workflowInstanceId)
            throw new common_1.BadRequestException('No active workflow');
        const instance = await this.workflowSvc.processAction(po.workflowInstanceId, 'APPROVE', user.id, comment);
        let newStatus = po.status;
        if (instance.status === 'APPROVED') {
            newStatus = client_1.DocumentStatus.APPROVED;
        }
        return this.prisma.purchaseOrder.update({ where: { id }, data: { status: newStatus } });
    }
    async issue(id, user) {
        const po = await this.findOne(id);
        if (po.status !== client_1.DocumentStatus.APPROVED) {
            throw new common_1.BadRequestException('Only APPROVED POs can be issued');
        }
        return this.prisma.purchaseOrder.update({
            where: { id },
            data: { status: 'ISSUED', issuedById: user.id, issuedAt: new Date() },
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
        if (po.status === client_1.DocumentStatus.APPROVED || po.status === 'ISSUED') {
            throw new common_1.BadRequestException('Cannot delete an approved or issued PO');
        }
        await this.prisma.purchaseOrder.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.PurchaseOrdersService = PurchaseOrdersService;
exports.PurchaseOrdersService = PurchaseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workflow_service_1.WorkflowService,
        serial_service_1.SerialService,
        audit_service_1.AuditService,
        grants_service_1.GrantsService])
], PurchaseOrdersService);
//# sourceMappingURL=purchase-orders.service.js.map