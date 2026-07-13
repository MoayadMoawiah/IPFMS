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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const workflow_service_1 = require("../../workflow/workflow.service");
const serial_service_1 = require("../../serial/serial.service");
const audit_service_1 = require("../../audit/audit.service");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let PaymentsService = class PaymentsService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
    }
    async findAllVouchers(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, grantId } = query;
        const where = {
            deletedAt: null,
            ...(status && { status }),
            ...(grantId && { grantId }),
            ...(search && {
                OR: [
                    { serialNumber: { contains: search, mode: 'insensitive' } },
                    { payeeName: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.paymentVoucher.findMany({
                where,
                include: { grant: { select: { id: true, code: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.paymentVoucher.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOneVoucher(id) {
        const voucher = await this.prisma.paymentVoucher.findUnique({
            where: { id, deletedAt: null },
            include: {
                paymentRequest: { include: { invoice: true } },
                grant: true,
                payments: {
                    include: {
                        cheques: true,
                        bankTransfers: true,
                    },
                },
                workflow: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
            },
        });
        if (!voucher)
            throw new common_1.NotFoundException(`Payment Voucher ${id} not found`);
        return voucher;
    }
    async createVoucher(dto, user) {
        const grant = await this.prisma.grant.findUnique({ where: { id: dto.grantId } });
        if (!grant)
            throw new common_1.NotFoundException('Grant not found');
        const serialNumber = await this.serialSvc.next(grant.code, 'PV');
        const voucher = await this.prisma.paymentVoucher.create({
            data: {
                serialNumber,
                paymentRequestId: dto.paymentRequestId,
                grantId: dto.grantId,
                payeeType: dto.payeeType || 'VENDOR',
                payeeId: dto.payeeId,
                payeeName: dto.payeeName,
                paymentDate: new Date(dto.paymentDate),
                currency: dto.currency || 'USD',
                amount: new client_1.Prisma.Decimal(dto.amount),
                exchangeRate: new client_1.Prisma.Decimal(dto.exchangeRate || '1'),
                baseAmount: new client_1.Prisma.Decimal(Number(dto.amount) * Number(dto.exchangeRate || 1)),
                description: dto.description,
                reference: dto.reference,
                status: client_1.DocumentStatus.DRAFT,
                createdById: user.id,
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'PAYMENTS',
            resource: 'PaymentVoucher',
            resourceId: voucher.id,
            newValues: { serialNumber, amount: voucher.amount, payeeName: voucher.payeeName },
        });
        return voucher;
    }
    async submitVoucher(id, user) {
        const voucher = await this.findOneVoucher(id);
        if (voucher.status !== client_1.DocumentStatus.DRAFT)
            throw new common_1.BadRequestException('Only DRAFT vouchers can be submitted');
        const workflowInstance = await this.workflowSvc.startWorkflow('PAYMENT_VOUCHER', id, user.id);
        return this.prisma.paymentVoucher.update({
            where: { id },
            data: { status: client_1.DocumentStatus.SUBMITTED, workflowInstanceId: workflowInstance?.id },
        });
    }
    async approveVoucher(id, comment, user) {
        const voucher = await this.findOneVoucher(id);
        if (!voucher.workflowInstanceId)
            throw new common_1.BadRequestException('No active workflow');
        const instance = await this.workflowSvc.processAction(voucher.workflowInstanceId, 'APPROVE', user.id, comment);
        if (instance.status === 'APPROVED') {
            await this.prisma.paymentVoucher.update({ where: { id }, data: { status: client_1.DocumentStatus.APPROVED } });
        }
        return instance;
    }
    async markPaid(id, dto, user) {
        const voucher = await this.findOneVoucher(id);
        if (voucher.status !== client_1.DocumentStatus.APPROVED)
            throw new common_1.BadRequestException('Voucher must be APPROVED to mark as paid');
        const payment = await this.prisma.payment.create({
            data: {
                paymentVoucherId: id,
                paymentMethod: dto.paymentMethod,
                paymentDate: new Date(dto.paymentDate),
                amount: voucher.amount,
                currency: voucher.currency,
                exchangeRate: voucher.exchangeRate,
                baseAmount: voucher.baseAmount,
                reference: dto.reference,
                bankAccountId: dto.bankAccountId,
                status: 'COMPLETED',
                createdById: user.id,
            },
        });
        if (dto.paymentMethod === 'CHEQUE' && dto.chequeData) {
            const chequeSerial = await this.serialSvc.next(voucher.grant?.code || 'SYS', 'CHQ');
            await this.prisma.cheque.create({
                data: {
                    paymentId: payment.id,
                    serialNumber: chequeSerial,
                    chequeNumber: dto.chequeData.chequeNumber,
                    bankAccountId: dto.chequeData.bankAccountId,
                    payeeName: voucher.payeeName,
                    amount: voucher.amount,
                    currency: voucher.currency,
                    chequeDate: new Date(dto.chequeData.chequeDate || dto.paymentDate),
                    status: 'ISSUED',
                    issuedAt: new Date(),
                },
            });
        }
        else if (dto.paymentMethod === 'BANK_TRANSFER' && dto.transferData) {
            const transferSerial = await this.serialSvc.next(voucher.grant?.code || 'SYS', 'BT');
            await this.prisma.bankTransfer.create({
                data: {
                    paymentId: payment.id,
                    serialNumber: transferSerial,
                    fromBankAccountId: dto.transferData.fromBankAccountId,
                    toBankAccount: dto.transferData.toBankAccount,
                    toBankName: dto.transferData.toBankName,
                    toAccountName: voucher.payeeName,
                    currency: voucher.currency,
                    amount: voucher.amount,
                    exchangeRate: voucher.exchangeRate,
                    baseAmount: voucher.baseAmount,
                    transferDate: new Date(dto.paymentDate),
                    reference: dto.reference,
                    status: 'COMPLETED',
                    completedAt: new Date(),
                },
            });
        }
        await this.prisma.paymentVoucher.update({ where: { id }, data: { status: 'PAID' } });
        await this.auditSvc.log({
            userId: user.id,
            action: 'UPDATE',
            module: 'PAYMENTS',
            resource: 'PaymentVoucher',
            resourceId: id,
            newValues: { status: 'PAID', paymentMethod: dto.paymentMethod },
        });
        return payment;
    }
    async findAllCheques(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { status } = query;
        const where = { ...(status && { status }) };
        const [data, total] = await Promise.all([
            this.prisma.cheque.findMany({
                where,
                include: { bankAccount: { select: { id: true, accountName: true, bankName: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.cheque.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findAllTransfers(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { status } = query;
        const where = { ...(status && { status }) };
        const [data, total] = await Promise.all([
            this.prisma.bankTransfer.findMany({
                where,
                include: { fromBankAccount: { select: { id: true, accountName: true, bankName: true } } },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.bankTransfer.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async updateChequeStatus(id, status, user) {
        return this.prisma.cheque.update({
            where: { id },
            data: { status: status, ...(status === 'CLEARED' && { clearedAt: new Date() }) },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        workflow_service_1.WorkflowService,
        serial_service_1.SerialService,
        audit_service_1.AuditService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map