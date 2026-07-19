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
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let GoodsReceiptService = class GoodsReceiptService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
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
    async findOne(id) {
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
        return grn;
    }
    async create(dto, user) {
        const po = await this.prisma.purchaseOrder.findUnique({
            where: { id: dto.poId },
            include: { grant: true },
        });
        if (!po)
            throw new common_1.NotFoundException('Purchase Order not found');
        if (po.status !== 'APPROVED' && po.status !== 'SUBMITTED') {
            throw new common_1.BadRequestException('PO must be APPROVED or SUBMITTED to create GRN');
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
    async submit(id, user) {
        const grn = await this.findOne(id);
        if (grn.status !== client_1.DocumentStatus.DRAFT)
            throw new common_1.BadRequestException('Only DRAFT GRNs can be submitted');
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
        audit_service_1.AuditService])
], GoodsReceiptService);
//# sourceMappingURL=goods-receipt.service.js.map