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
const minio_service_1 = require("../../uploads/minio.service");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const OPEN_PR_STATUSES = [
    client_1.DocumentStatus.DRAFT,
    client_1.DocumentStatus.SUBMITTED,
    client_1.DocumentStatus.RETURNED,
    client_1.DocumentStatus.APPROVED,
];
const PR_EDITABLE_STATUSES = [
    client_1.DocumentStatus.DRAFT,
    client_1.DocumentStatus.RETURNED,
];
const ALLOWED_PR_METHODS = new Set([
    client_1.PaymentMethod.CHEQUE,
    client_1.PaymentMethod.BANK_TRANSFER,
    client_1.PaymentMethod.CASH,
]);
const SIGNED_CASH_RECEIPT_LABEL = 'SIGNED_CASH_RECEIPT';
const PR_DOCUMENT_TYPE = 'PAYMENT_REQUEST';
const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
]);
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
let PaymentsService = class PaymentsService {
    constructor(prisma, workflowSvc, serialSvc, auditSvc, minioSvc) {
        this.prisma = prisma;
        this.workflowSvc = workflowSvc;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
        this.minioSvc = minioSvc;
    }
    requireText(value, field) {
        const text = typeof value === 'string' ? value.trim() : '';
        if (!text)
            throw new common_1.BadRequestException(`${field} is required`);
        return text;
    }
    normalizeMethodDetails(paymentMethod, details, vendorName) {
        if (!ALLOWED_PR_METHODS.has(paymentMethod)) {
            throw new common_1.BadRequestException('Payment method must be CHEQUE, BANK_TRANSFER, or CASH');
        }
        const raw = details && typeof details === 'object' ? details : {};
        if (paymentMethod === client_1.PaymentMethod.CHEQUE) {
            return {
                bankName: this.requireText(raw.bankName, 'Bank name'),
                bankBranch: this.requireText(raw.bankBranch, 'Bank branch'),
                chequeNumber: this.requireText(raw.chequeNumber, 'Cheque serial number'),
                chequeDate: raw.chequeDate ? String(raw.chequeDate).trim() : null,
                payeeName: String(raw.payeeName || vendorName || '').trim() || vendorName || null,
                memo: raw.memo ? String(raw.memo).trim() : null,
            };
        }
        if (paymentMethod === client_1.PaymentMethod.BANK_TRANSFER) {
            return {
                bankName: this.requireText(raw.bankName, 'Bank name'),
                bankBranch: this.requireText(raw.bankBranch, 'Bank branch'),
                accountNumber: this.requireText(raw.accountNumber, 'Account number'),
                accountName: String(raw.accountName || vendorName || '').trim() || vendorName || null,
                iban: raw.iban ? String(raw.iban).trim() : null,
                swiftCode: raw.swiftCode ? String(raw.swiftCode).trim() : null,
                currency: raw.currency ? String(raw.currency).trim() : null,
            };
        }
        return {
            paidToName: String(raw.paidToName || vendorName || '').trim() || vendorName || null,
            receivedByName: raw.receivedByName ? String(raw.receivedByName).trim() : null,
            notes: raw.notes ? String(raw.notes).trim() : null,
        };
    }
    async hasSignedCashReceipt(requestId) {
        const count = await this.prisma.documentAttachment.count({
            where: {
                documentType: PR_DOCUMENT_TYPE,
                documentId: requestId,
                deletedAt: null,
                fileName: SIGNED_CASH_RECEIPT_LABEL,
            },
        });
        return count > 0;
    }
    async findAllPaymentRequests(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, grantId } = query;
        const where = {
            deletedAt: null,
            ...(status && { status }),
            ...(grantId && { grantId }),
            ...(search && {
                OR: [
                    { serialNumber: { contains: search, mode: 'insensitive' } },
                    { notes: { contains: search, mode: 'insensitive' } },
                    { invoice: { invoiceNumber: { contains: search, mode: 'insensitive' } } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.paymentRequest.findMany({
                where,
                include: {
                    grant: { select: { id: true, code: true, name: true } },
                    invoice: {
                        select: {
                            id: true,
                            serialNumber: true,
                            invoiceNumber: true,
                            status: true,
                            vendor: { select: { id: true, name: true } },
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.paymentRequest.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOnePaymentRequest(id, user) {
        const request = await this.prisma.paymentRequest.findFirst({
            where: { id, deletedAt: null },
            include: {
                grant: { select: { id: true, code: true, name: true } },
                bankAccount: { select: { id: true, accountName: true, bankName: true } },
                invoice: {
                    include: {
                        vendor: {
                            select: {
                                id: true,
                                name: true,
                                bankAccounts: {
                                    orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
                                },
                            },
                        },
                        po: { select: { id: true, serialNumber: true } },
                        grn: { select: { id: true, serialNumber: true } },
                    },
                },
                paymentVouchers: {
                    where: { deletedAt: null },
                    select: { id: true, serialNumber: true, status: true, amount: true },
                    orderBy: { createdAt: 'desc' },
                },
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
        if (!request)
            throw new common_1.NotFoundException(`Payment request ${id} not found`);
        const approvalContext = user
            ? await this.workflowSvc.buildApprovalContext(request.workflow, user.id, user.roles)
            : await this.workflowSvc.buildApprovalContext(request.workflow);
        const hasSignedCashReceipt = request.paymentMethod === client_1.PaymentMethod.CASH
            ? await this.hasSignedCashReceipt(id)
            : false;
        return { ...request, approvalContext, hasSignedCashReceipt };
    }
    async createPaymentRequest(dto, user) {
        if (!dto.invoiceId) {
            throw new common_1.BadRequestException('invoiceId is required');
        }
        const invoice = await this.prisma.vendorInvoice.findFirst({
            where: { id: dto.invoiceId, deletedAt: null },
            include: {
                grant: { select: { id: true, code: true } },
                vendor: { select: { id: true, name: true } },
            },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Vendor invoice not found');
        if (invoice.status !== client_1.InvoiceStatus.APPROVED || !invoice.isThreeWayMatched) {
            throw new common_1.BadRequestException('Only APPROVED, three-way-matched invoices can create a payment request');
        }
        const openRequests = await this.prisma.paymentRequest.findMany({
            where: {
                invoiceId: invoice.id,
                deletedAt: null,
                status: { in: OPEN_PR_STATUSES },
            },
            select: { totalAmount: true },
        });
        const reserved = openRequests.reduce((sum, r) => sum + Number(r.totalAmount), 0);
        const remaining = Number(invoice.totalAmount) - Number(invoice.paidAmount) - reserved;
        if (remaining <= 0) {
            throw new common_1.BadRequestException('No remaining amount available for payment on this invoice');
        }
        const requestedAmount = dto.amount !== undefined && dto.amount !== null && dto.amount !== ''
            ? Number(dto.amount)
            : remaining;
        if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
            throw new common_1.BadRequestException('Amount must be a positive number');
        }
        if (requestedAmount > remaining + 1e-9) {
            throw new common_1.BadRequestException(`Amount exceeds remaining invoice balance (${remaining})`);
        }
        const paymentMethod = (dto.paymentMethod || client_1.PaymentMethod.CHEQUE);
        const methodDetails = this.normalizeMethodDetails(paymentMethod, dto.methodDetails, invoice.vendor?.name);
        const serialNumber = await this.serialSvc.next(invoice.grant.code, 'PREQ');
        const request = await this.prisma.paymentRequest.create({
            data: {
                serialNumber,
                invoiceId: invoice.id,
                grantId: invoice.grantId,
                requestDate: dto.requestDate ? new Date(dto.requestDate) : new Date(),
                totalAmount: new client_1.Prisma.Decimal(requestedAmount),
                currency: invoice.currency || 'USD',
                paymentMethod: paymentMethod,
                methodDetails,
                bankAccountId: dto.bankAccountId || null,
                notes: dto.notes || null,
                status: client_1.DocumentStatus.DRAFT,
                createdById: user.id,
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'PAYMENTS',
            resource: 'PaymentRequest',
            resourceId: request.id,
            newValues: {
                serialNumber,
                invoiceId: invoice.id,
                amount: requestedAmount,
                paymentMethod,
            },
        });
        return this.findOnePaymentRequest(request.id, user);
    }
    async updatePaymentRequest(id, dto, user) {
        const existing = await this.findOnePaymentRequest(id);
        if (!PR_EDITABLE_STATUSES.includes(existing.status)) {
            throw new common_1.BadRequestException('Only DRAFT or RETURNED payment requests can be updated');
        }
        const paymentMethod = (dto.paymentMethod || existing.paymentMethod);
        const methodDetails = dto.methodDetails !== undefined || dto.paymentMethod
            ? this.normalizeMethodDetails(paymentMethod, dto.methodDetails !== undefined ? dto.methodDetails : existing.methodDetails, existing.invoice?.vendor?.name)
            : undefined;
        let totalAmount;
        if (dto.amount !== undefined && dto.amount !== null && dto.amount !== '') {
            const amount = Number(dto.amount);
            if (!Number.isFinite(amount) || amount <= 0) {
                throw new common_1.BadRequestException('Amount must be a positive number');
            }
            totalAmount = new client_1.Prisma.Decimal(amount);
        }
        await this.prisma.paymentRequest.update({
            where: { id },
            data: {
                ...(totalAmount && { totalAmount }),
                ...(dto.notes !== undefined && { notes: dto.notes || null }),
                ...(dto.paymentMethod && { paymentMethod: paymentMethod }),
                ...(methodDetails !== undefined && { methodDetails }),
                ...(dto.bankAccountId !== undefined && {
                    bankAccountId: dto.bankAccountId || null,
                }),
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'UPDATE',
            module: 'PAYMENTS',
            resource: 'PaymentRequest',
            resourceId: id,
            newValues: {
                paymentMethod,
                amount: dto.amount,
            },
        });
        return this.findOnePaymentRequest(id, user);
    }
    async submitPaymentRequest(id, user) {
        const request = await this.findOnePaymentRequest(id);
        if (request.status !== client_1.DocumentStatus.DRAFT && request.status !== client_1.DocumentStatus.RETURNED) {
            throw new common_1.BadRequestException('Only DRAFT or RETURNED payment requests can be submitted');
        }
        if (request.paymentMethod === client_1.PaymentMethod.CASH) {
            const hasReceipt = await this.hasSignedCashReceipt(id);
            if (!hasReceipt) {
                throw new common_1.BadRequestException('Signed cash receipt attachment is required before submitting a cash payment request');
            }
        }
        const workflowInstance = await this.workflowSvc.startWorkflow('PAYMENT_REQUEST', id, user.id);
        await this.prisma.paymentRequest.update({
            where: { id },
            data: {
                status: client_1.DocumentStatus.SUBMITTED,
                workflowInstanceId: workflowInstance?.id,
            },
        });
        return this.findOnePaymentRequest(id, user);
    }
    async approvePaymentRequest(id, comment, user) {
        const request = await this.findOnePaymentRequest(id);
        if (!request.workflowInstanceId) {
            throw new common_1.BadRequestException('No active workflow');
        }
        const instance = await this.workflowSvc.processAction(request.workflowInstanceId, 'APPROVE', user.id, comment, { ipAddress: user.ipAddress, userAgent: user.userAgent });
        if (instance.status === 'APPROVED') {
            await this.prisma.paymentRequest.update({
                where: { id },
                data: { status: client_1.DocumentStatus.APPROVED },
            });
        }
        return this.findOnePaymentRequest(id, user);
    }
    async getCashReceipt(id) {
        const request = await this.findOnePaymentRequest(id);
        const org = await this.prisma.organization.findFirst({
            orderBy: { createdAt: 'asc' },
        });
        return {
            title: 'Cash Payment Receipt',
            organizationName: org?.name ?? 'Organization',
            organizationShortName: org?.shortName ?? null,
            requestSerial: request.serialNumber,
            requestDate: request.requestDate,
            amount: request.totalAmount,
            currency: request.currency,
            paymentMethod: request.paymentMethod,
            vendorName: request.invoice?.vendor?.name ?? null,
            invoiceNumber: request.invoice?.invoiceNumber ?? null,
            invoiceSerial: request.invoice?.serialNumber ?? null,
            grantCode: request.grant?.code ?? null,
            grantName: request.grant?.name ?? null,
            paidToName: request.methodDetails?.paidToName ||
                request.invoice?.vendor?.name ||
                null,
            notes: request.notes,
            signatureLines: {
                recipient: 'Recipient / Supplier signature',
                cashier: 'Cashier / Paying officer signature',
                date: 'Date',
            },
        };
    }
    async uploadPaymentRequestDocuments(requestId, files, labels, user) {
        const request = await this.findOnePaymentRequest(requestId);
        if (!PR_EDITABLE_STATUSES.includes(request.status)) {
            throw new common_1.BadRequestException('Documents can only be added to DRAFT or RETURNED payment requests');
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
            const storageKey = `payment-requests/${requestId}/${timestamp}-${safeName}`;
            await this.minioSvc.uploadFile(file.buffer, storageKey, file.mimetype);
            const fileUrl = this.minioSvc.buildPublicUrl(storageKey);
            const attachment = await this.prisma.documentAttachment.create({
                data: {
                    documentType: PR_DOCUMENT_TYPE,
                    documentId: requestId,
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
            action: 'CREATE',
            module: 'PAYMENTS',
            resource: 'DocumentAttachment',
            resourceId: requestId,
            newValues: { count: results.length },
        });
        return results;
    }
    async listPaymentRequestDocuments(requestId) {
        await this.findOnePaymentRequest(requestId);
        return this.prisma.documentAttachment.findMany({
            where: {
                documentType: PR_DOCUMENT_TYPE,
                documentId: requestId,
                deletedAt: null,
            },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deletePaymentRequestDocument(requestId, attachmentId, user) {
        const request = await this.findOnePaymentRequest(requestId);
        if (!PR_EDITABLE_STATUSES.includes(request.status)) {
            throw new common_1.BadRequestException('Documents can only be removed from DRAFT or RETURNED payment requests');
        }
        const attachment = await this.prisma.documentAttachment.findFirst({
            where: {
                id: attachmentId,
                documentType: PR_DOCUMENT_TYPE,
                documentId: requestId,
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
            action: 'SOFT_DELETE',
            module: 'PAYMENTS',
            resource: 'DocumentAttachment',
            resourceId: attachmentId,
        });
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
    async findOneVoucher(id, user) {
        const userWithRoles = {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: { include: { role: { select: { id: true, name: true } } } },
            },
        };
        const voucher = await this.prisma.paymentVoucher.findFirst({
            where: { id, deletedAt: null },
            include: {
                paymentRequest: {
                    include: {
                        invoice: {
                            include: { vendor: { select: { id: true, name: true } } },
                        },
                    },
                },
                grant: true,
                payments: {
                    include: {
                        cheques: true,
                        bankTransfers: true,
                    },
                },
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
        if (!voucher)
            throw new common_1.NotFoundException(`Payment Voucher ${id} not found`);
        let createdBy = null;
        if (voucher.createdById) {
            createdBy = await this.prisma.user.findUnique({
                where: { id: voucher.createdById },
                ...userWithRoles,
            });
        }
        const approvalContext = user
            ? await this.workflowSvc.buildApprovalContext(voucher.workflow, user.id, user.roles)
            : await this.workflowSvc.buildApprovalContext(voucher.workflow);
        return { ...voucher, createdBy, approvalContext };
    }
    async createVoucher(dto, user) {
        let grantId = dto.grantId;
        let payeeType = dto.payeeType || 'VENDOR';
        let payeeId = dto.payeeId;
        let payeeName = dto.payeeName;
        let currency = dto.currency || 'USD';
        let amount = dto.amount !== undefined ? Number(dto.amount) : undefined;
        let paymentRequestId = dto.paymentRequestId;
        let description = dto.description;
        let reference = dto.reference;
        if (paymentRequestId) {
            const pr = await this.prisma.paymentRequest.findFirst({
                where: { id: paymentRequestId, deletedAt: null },
                include: {
                    invoice: { include: { vendor: true } },
                    grant: true,
                    paymentVouchers: {
                        where: { deletedAt: null, NOT: { status: 'PAID' } },
                        select: { id: true, serialNumber: true, status: true },
                    },
                },
            });
            if (!pr)
                throw new common_1.NotFoundException('Payment request not found');
            if (pr.status !== client_1.DocumentStatus.APPROVED) {
                throw new common_1.BadRequestException('Payment request must be APPROVED to create a voucher');
            }
            if (pr.paymentVouchers.length > 0) {
                throw new common_1.BadRequestException(`An open payment voucher already exists for this request (${pr.paymentVouchers[0].serialNumber})`);
            }
            grantId = pr.grantId;
            payeeType = 'VENDOR';
            payeeId = pr.invoice.vendorId;
            payeeName = pr.invoice.vendor?.name || payeeName;
            currency = pr.currency;
            const prAmount = Number(pr.totalAmount);
            if (amount === undefined || Number.isNaN(amount)) {
                amount = prAmount;
            }
            else if (amount <= 0) {
                throw new common_1.BadRequestException('Amount must be a positive number');
            }
            else if (amount > prAmount + 1e-9) {
                throw new common_1.BadRequestException(`Amount cannot exceed payment request total (${prAmount})`);
            }
            description =
                description ||
                    `Payment for invoice ${pr.invoice.invoiceNumber} (${pr.invoice.serialNumber})`;
            reference = reference || pr.serialNumber;
        }
        if (!grantId)
            throw new common_1.BadRequestException('grantId is required');
        if (!payeeName)
            throw new common_1.BadRequestException('payeeName is required');
        if (amount === undefined || !Number.isFinite(amount) || amount <= 0) {
            throw new common_1.BadRequestException('amount must be a positive number');
        }
        if (!dto.paymentDate)
            throw new common_1.BadRequestException('paymentDate is required');
        if (!description?.trim())
            throw new common_1.BadRequestException('description is required');
        const grant = await this.prisma.grant.findUnique({ where: { id: grantId } });
        if (!grant)
            throw new common_1.NotFoundException('Grant not found');
        const serialNumber = await this.serialSvc.next(grant.code, 'PV');
        const exchangeRate = Number(dto.exchangeRate || 1);
        const voucher = await this.prisma.paymentVoucher.create({
            data: {
                serialNumber,
                paymentRequestId: paymentRequestId || null,
                grantId,
                payeeType,
                payeeId: payeeId || null,
                payeeName,
                paymentDate: new Date(dto.paymentDate),
                currency,
                amount: new client_1.Prisma.Decimal(amount),
                exchangeRate: new client_1.Prisma.Decimal(exchangeRate),
                baseAmount: new client_1.Prisma.Decimal(amount * exchangeRate),
                description: description.trim(),
                reference: reference || null,
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
        const instance = await this.workflowSvc.processAction(voucher.workflowInstanceId, 'APPROVE', user.id, comment, { ipAddress: user.ipAddress, userAgent: user.userAgent });
        if (instance.status === 'APPROVED') {
            await this.prisma.paymentVoucher.update({ where: { id }, data: { status: client_1.DocumentStatus.APPROVED } });
        }
        return instance;
    }
    async markPaid(id, dto, user) {
        const voucher = await this.findOneVoucher(id);
        if (voucher.status !== client_1.DocumentStatus.APPROVED)
            throw new common_1.BadRequestException('Voucher must be APPROVED to mark as paid');
        if (!dto.paymentMethod)
            throw new common_1.BadRequestException('paymentMethod is required');
        if (!dto.paymentDate)
            throw new common_1.BadRequestException('paymentDate is required');
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
        const invoiceId = voucher.paymentRequest?.invoiceId ?? voucher.paymentRequest?.invoice?.id;
        if (invoiceId) {
            const invoice = await this.prisma.vendorInvoice.findUnique({ where: { id: invoiceId } });
            if (invoice) {
                const newPaid = Number(invoice.paidAmount) + Number(voucher.amount);
                const fullyPaid = newPaid >= Number(invoice.totalAmount) - 1e-9;
                await this.prisma.vendorInvoice.update({
                    where: { id: invoiceId },
                    data: {
                        paidAmount: new client_1.Prisma.Decimal(newPaid),
                        ...(fullyPaid ? { status: client_1.InvoiceStatus.PAID } : {}),
                    },
                });
            }
        }
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
        audit_service_1.AuditService,
        minio_service_1.MinioService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map