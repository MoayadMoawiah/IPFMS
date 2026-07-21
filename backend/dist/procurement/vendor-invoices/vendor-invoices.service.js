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
exports.VendorInvoicesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const workflow_service_1 = require("../../workflow/workflow.service");
const serial_service_1 = require("../../serial/serial.service");
const audit_service_1 = require("../../audit/audit.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const INVOICE_PO_STATUSES = new Set(['APPROVED', 'ISSUED']);
let VendorInvoicesService = class VendorInvoicesService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, poId } = query;
        const where = {
            deletedAt: null,
            ...(status && { status: status }),
            ...(poId && { poId }),
            ...(search && {
                OR: [
                    { serialNumber: { contains: search, mode: 'insensitive' } },
                    { invoiceNumber: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.vendorInvoice.findMany({
                where,
                include: {
                    po: { select: { id: true, serialNumber: true, title: true, status: true } },
                    grn: { select: { id: true, serialNumber: true, status: true } },
                    vendor: { select: { id: true, name: true } },
                    grant: { select: { id: true, code: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.vendorInvoice.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id, user) {
        const invoice = await this.prisma.vendorInvoice.findFirst({
            where: { id, deletedAt: null },
            include: {
                po: {
                    include: {
                        items: true,
                        goodsReceipts: {
                            where: { deletedAt: null },
                            select: { id: true, serialNumber: true, status: true, receiptDate: true },
                        },
                    },
                },
                grn: {
                    select: {
                        id: true,
                        serialNumber: true,
                        status: true,
                        receiptDate: true,
                    },
                },
                vendor: {
                    include: {
                        bankAccounts: { orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }] },
                    },
                },
                grant: { select: { id: true, code: true, name: true } },
                workflow: {
                    include: {
                        steps: { orderBy: { stepNumber: 'asc' } },
                        actions: {
                            include: {
                                actor: { select: { id: true, firstName: true, lastName: true } },
                            },
                            orderBy: { actionAt: 'asc' },
                        },
                    },
                },
            },
        });
        if (!invoice)
            throw new common_1.NotFoundException(`Vendor invoice ${id} not found`);
        const approvalContext = user
            ? await this.workflowSvc.buildApprovalContext(invoice.workflow, user.id, user.roles)
            : await this.workflowSvc.buildApprovalContext(invoice.workflow);
        return { ...invoice, approvalContext };
    }
    async create(dto, user) {
        let poId = dto.poId;
        let grnId = dto.grnId || undefined;
        let computedSubtotal = null;
        if (grnId) {
            const grn = await this.prisma.goodsReceipt.findFirst({
                where: { id: grnId, deletedAt: null },
                include: {
                    items: { include: { poItem: true } },
                    po: { include: { grant: true, vendor: true } },
                },
            });
            if (!grn)
                throw new common_1.NotFoundException('Goods Receipt not found');
            if (grn.status !== 'APPROVED') {
                throw new common_1.BadRequestException('Only APPROVED goods receipts can be used to create a vendor invoice');
            }
            const existingForGrn = await this.prisma.vendorInvoice.findFirst({
                where: { grnId, deletedAt: null },
                select: { id: true, serialNumber: true },
            });
            if (existingForGrn) {
                throw new common_1.BadRequestException(`A vendor invoice already exists for this GRN (${existingForGrn.serialNumber})`);
            }
            poId = grn.poId;
            let subtotalNum = 0;
            for (const item of grn.items) {
                const accepted = Number(item.acceptedQuantity) || 0;
                const unitPrice = Number(item.poItem?.unitPrice) || 0;
                subtotalNum += accepted * unitPrice;
            }
            computedSubtotal = new client_1.Prisma.Decimal(subtotalNum);
        }
        if (!poId)
            throw new common_1.BadRequestException('PO or GRN is required');
        const po = await this.prisma.purchaseOrder.findFirst({
            where: { id: poId, deletedAt: null },
            include: { grant: true, vendor: true },
        });
        if (!po)
            throw new common_1.NotFoundException('Purchase Order not found');
        if (!INVOICE_PO_STATUSES.has(po.status)) {
            throw new common_1.BadRequestException('PO must be APPROVED or ISSUED to create a vendor invoice');
        }
        const subtotal = new client_1.Prisma.Decimal(dto.subtotal ?? computedSubtotal ?? dto.totalAmount ?? 0);
        const taxAmount = new client_1.Prisma.Decimal(dto.taxAmount ?? 0);
        const totalAmount = new client_1.Prisma.Decimal(dto.totalAmount ?? subtotal.add(taxAmount));
        const serialNumber = await this.serialSvc.next(po.grant.code, 'INV');
        const invoice = await this.prisma.vendorInvoice.create({
            data: {
                serialNumber,
                poId: po.id,
                grnId: grnId || null,
                vendorId: dto.vendorId || po.vendorId,
                grantId: po.grantId,
                invoiceNumber: dto.invoiceNumber,
                invoiceDate: new Date(dto.invoiceDate || Date.now()),
                dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                currency: dto.currency || po.currency,
                subtotal,
                taxAmount,
                totalAmount,
                status: client_1.InvoiceStatus.RECEIVED,
                notes: dto.notes,
                fileUrl: dto.fileUrl,
                createdById: user.id,
            },
            include: {
                po: { select: { id: true, serialNumber: true } },
                grn: { select: { id: true, serialNumber: true } },
                vendor: { select: { id: true, name: true } },
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'INVOICES',
            resource: 'VendorInvoice',
            resourceId: invoice.id,
            newValues: {
                serialNumber,
                poId: po.id,
                grnId: grnId || null,
                invoiceNumber: invoice.invoiceNumber,
            },
        });
        return invoice;
    }
    async submit(id, user) {
        const invoice = await this.findOne(id);
        if (invoice.status !== client_1.InvoiceStatus.RECEIVED) {
            throw new common_1.BadRequestException('Only RECEIVED invoices can be submitted for matching');
        }
        const workflowInstance = await this.workflowSvc.startWorkflow('VENDOR_INVOICE', id, user.id);
        return this.prisma.vendorInvoice.update({
            where: { id },
            data: {
                status: client_1.InvoiceStatus.MATCHED,
                isThreeWayMatched: false,
                workflowInstanceId: workflowInstance?.id,
            },
        });
    }
    async approve(id, comment, user) {
        const invoice = await this.findOne(id);
        if (!invoice.workflowInstanceId) {
            throw new common_1.BadRequestException('No active workflow');
        }
        const instance = await this.workflowSvc.processAction(invoice.workflowInstanceId, 'APPROVE', user.id, comment, { ipAddress: user.ipAddress, userAgent: user.userAgent });
        if (instance.status === 'APPROVED') {
            await this.prisma.vendorInvoice.update({
                where: { id },
                data: {
                    status: client_1.InvoiceStatus.APPROVED,
                    isThreeWayMatched: true,
                    matchedAt: new Date(),
                    matchedById: user.id,
                },
            });
        }
        return instance;
    }
    async softDelete(id, user) {
        const invoice = await this.findOne(id);
        if (invoice.status === client_1.InvoiceStatus.APPROVED || invoice.status === client_1.InvoiceStatus.PAID) {
            throw new common_1.BadRequestException('Cannot delete an approved or paid invoice');
        }
        await this.prisma.vendorInvoice.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'DELETE',
            module: 'INVOICES',
            resource: 'VendorInvoice',
            resourceId: id,
        });
    }
};
exports.VendorInvoicesService = VendorInvoicesService;
exports.VendorInvoicesService = VendorInvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workflow_service_1.WorkflowService,
        serial_service_1.SerialService,
        audit_service_1.AuditService])
], VendorInvoicesService);
//# sourceMappingURL=vendor-invoices.service.js.map