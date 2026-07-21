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
const DEFAULT_AP_ACCOUNT_CODE = '2101';
const DEFAULT_BANK_ACCOUNT_CODE = '1102';
const DEFAULT_CASH_ACCOUNT_CODE = '1101';
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
const PV_DOCUMENT_TYPE = 'PAYMENT_VOUCHER';
const PV_EDITABLE_STATUSES = [
    client_1.DocumentStatus.DRAFT,
    client_1.DocumentStatus.RETURNED,
];
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
        const { search, status, grantId, availableForVoucher } = query;
        const forVoucher = availableForVoucher === true ||
            availableForVoucher === 'true' ||
            availableForVoucher === '1';
        const where = {
            deletedAt: null,
            ...(forVoucher
                ? {
                    status: client_1.DocumentStatus.APPROVED,
                    paymentVouchers: {
                        none: { deletedAt: null },
                    },
                }
                : {
                    ...(status && { status }),
                }),
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
                    paymentVouchers: {
                        where: { deletedAt: null },
                        select: { id: true, serialNumber: true, status: true },
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
                        po: { select: { id: true, serialNumber: true, prId: true } },
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
    async listPaymentRequestSupportingDocuments(requestId) {
        const request = await this.prisma.paymentRequest.findFirst({
            where: { id: requestId, deletedAt: null },
            select: {
                id: true,
                invoice: {
                    select: {
                        id: true,
                        serialNumber: true,
                        invoiceNumber: true,
                        fileUrl: true,
                        poId: true,
                        grnId: true,
                        po: { select: { id: true, prId: true } },
                    },
                },
            },
        });
        if (!request)
            throw new common_1.NotFoundException(`Payment request ${requestId} not found`);
        const orFilters = [
            { documentType: PR_DOCUMENT_TYPE, documentId: requestId },
        ];
        const poId = request.invoice?.poId ?? request.invoice?.po?.id ?? null;
        const prId = request.invoice?.po?.prId ?? null;
        const grnId = request.invoice?.grnId ?? null;
        if (prId)
            orFilters.push({ documentType: 'PurchaseRequisition', documentId: prId });
        if (poId)
            orFilters.push({ documentType: 'PurchaseOrder', documentId: poId });
        if (grnId)
            orFilters.push({ documentType: 'GoodsReceipt', documentId: grnId });
        const attachments = await this.prisma.documentAttachment.findMany({
            where: {
                deletedAt: null,
                OR: orFilters,
            },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        const sourceFor = (documentType) => {
            if (documentType === 'PurchaseRequisition')
                return 'pr';
            if (documentType === 'PurchaseOrder')
                return 'po';
            if (documentType === 'GoodsReceipt')
                return 'grn';
            return 'payment_request';
        };
        const rows = attachments.map((a) => ({
            id: a.id,
            documentType: a.documentType,
            documentId: a.documentId,
            fileName: a.fileName,
            originalName: a.originalName,
            fileSize: a.fileSize,
            mimeType: a.mimeType,
            fileUrl: a.fileUrl,
            storageKey: a.storageKey,
            uploadedById: a.uploadedById,
            createdAt: a.createdAt,
            deletedAt: a.deletedAt,
            uploadedBy: a.uploadedBy,
            source: sourceFor(a.documentType),
        }));
        const invoice = request.invoice;
        if (invoice?.fileUrl) {
            rows.push({
                id: `invoice-file:${invoice.id}`,
                documentType: 'VendorInvoice',
                documentId: invoice.id,
                fileName: 'Final invoice',
                originalName: invoice.invoiceNumber || invoice.serialNumber || 'Vendor invoice',
                fileSize: 0,
                mimeType: 'application/pdf',
                fileUrl: invoice.fileUrl,
                storageKey: '',
                uploadedById: '',
                createdAt: new Date(0),
                deletedAt: null,
                uploadedBy: null,
                source: 'invoice',
            });
        }
        const sourceOrder = {
            pr: 0,
            po: 1,
            grn: 2,
            invoice: 3,
            payment_request: 4,
            payment_voucher: 5,
        };
        rows.sort((a, b) => sourceOrder[a.source] - sourceOrder[b.source]);
        return rows;
    }
    async listPaymentVoucherDocuments(voucherId) {
        await this.findOneVoucher(voucherId);
        return this.prisma.documentAttachment.findMany({
            where: {
                documentType: PV_DOCUMENT_TYPE,
                documentId: voucherId,
                deletedAt: null,
            },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async uploadPaymentVoucherDocuments(voucherId, files, labels, user) {
        const voucher = await this.findOneVoucher(voucherId);
        if (!PV_EDITABLE_STATUSES.includes(voucher.status)) {
            throw new common_1.BadRequestException('Documents can only be added to DRAFT or RETURNED payment vouchers');
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
            const storageKey = `payment-vouchers/${voucherId}/${timestamp}-${safeName}`;
            await this.minioSvc.uploadFile(file.buffer, storageKey, file.mimetype);
            const fileUrl = this.minioSvc.buildPublicUrl(storageKey);
            const attachment = await this.prisma.documentAttachment.create({
                data: {
                    documentType: PV_DOCUMENT_TYPE,
                    documentId: voucherId,
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
            resourceId: voucherId,
            newValues: { count: results.length, documentType: PV_DOCUMENT_TYPE },
        });
        return results;
    }
    async deletePaymentVoucherDocument(voucherId, attachmentId, user) {
        const voucher = await this.findOneVoucher(voucherId);
        if (!PV_EDITABLE_STATUSES.includes(voucher.status)) {
            throw new common_1.BadRequestException('Documents can only be removed from DRAFT or RETURNED payment vouchers');
        }
        const attachment = await this.prisma.documentAttachment.findFirst({
            where: {
                id: attachmentId,
                documentType: PV_DOCUMENT_TYPE,
                documentId: voucherId,
                deletedAt: null,
            },
        });
        if (!attachment)
            throw new common_1.NotFoundException('Document not found');
        await this.prisma.documentAttachment.update({
            where: { id: attachmentId },
            data: { deletedAt: new Date() },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'DELETE',
            module: 'PAYMENTS',
            resource: 'DocumentAttachment',
            resourceId: attachmentId,
            oldValues: { voucherId, fileName: attachment.fileName },
        });
    }
    async listPaymentVoucherSupportingDocuments(voucherId) {
        const voucher = await this.prisma.paymentVoucher.findFirst({
            where: { id: voucherId, deletedAt: null },
            select: { id: true, paymentRequestId: true },
        });
        if (!voucher)
            throw new common_1.NotFoundException(`Payment Voucher ${voucherId} not found`);
        const chain = voucher.paymentRequestId
            ? await this.listPaymentRequestSupportingDocuments(voucher.paymentRequestId)
            : [];
        const voucherDocs = await this.prisma.documentAttachment.findMany({
            where: {
                documentType: PV_DOCUMENT_TYPE,
                documentId: voucherId,
                deletedAt: null,
            },
            include: {
                uploadedBy: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        const pvRows = voucherDocs.map((a) => ({
            id: a.id,
            documentType: a.documentType,
            documentId: a.documentId,
            fileName: a.fileName,
            originalName: a.originalName,
            fileSize: a.fileSize,
            mimeType: a.mimeType,
            fileUrl: a.fileUrl,
            storageKey: a.storageKey,
            uploadedById: a.uploadedById,
            createdAt: a.createdAt,
            deletedAt: a.deletedAt,
            uploadedBy: a.uploadedBy,
            source: 'payment_voucher',
        }));
        return [...chain, ...pvRows];
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
                    select: {
                        id: true,
                        serialNumber: true,
                        invoiceId: true,
                        paymentMethod: true,
                        methodDetails: true,
                        bankAccountId: true,
                        totalAmount: true,
                        currency: true,
                        bankAccount: {
                            select: {
                                id: true,
                                accountName: true,
                                bankName: true,
                                accountNumber: true,
                            },
                        },
                        invoice: {
                            select: {
                                id: true,
                                serialNumber: true,
                                invoiceNumber: true,
                                vendor: { select: { id: true, name: true } },
                                po: { select: { id: true, serialNumber: true } },
                                grn: { select: { id: true, serialNumber: true } },
                            },
                        },
                    },
                },
                grant: { select: { id: true, code: true, name: true } },
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
        const jeIds = voucher.payments
            .map((p) => p.journalEntryId)
            .filter((jid) => !!jid);
        const journalEntries = jeIds.length > 0
            ? await this.prisma.journalEntry.findMany({
                where: { id: { in: jeIds } },
                select: { id: true, serialNumber: true, status: true, isPosted: true },
            })
            : [];
        const jeById = new Map(journalEntries.map((je) => [je.id, je]));
        const payments = voucher.payments.map((p) => ({
            ...p,
            journalEntry: p.journalEntryId ? jeById.get(p.journalEntryId) ?? null : null,
        }));
        return { ...voucher, payments, createdBy, approvalContext };
    }
    async createVoucher(dto, user) {
        const paymentRequestId = dto.paymentRequestId?.trim();
        if (!paymentRequestId) {
            throw new common_1.BadRequestException('paymentRequestId is required — every payment voucher must reference a payment request');
        }
        let amount = dto.amount !== undefined ? Number(dto.amount) : undefined;
        let description = dto.description;
        let reference = dto.reference;
        const pr = await this.prisma.paymentRequest.findFirst({
            where: { id: paymentRequestId, deletedAt: null },
            include: {
                invoice: { include: { vendor: true } },
                grant: true,
                paymentVouchers: {
                    where: { deletedAt: null },
                    select: { id: true, serialNumber: true, status: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!pr)
            throw new common_1.NotFoundException('Payment request not found');
        if (pr.status !== client_1.DocumentStatus.APPROVED) {
            throw new common_1.BadRequestException('Payment request must be APPROVED to create a voucher');
        }
        if (pr.paymentVouchers.length > 0) {
            throw new common_1.BadRequestException(`A payment voucher already exists for this request (${pr.paymentVouchers[0].serialNumber}). Only one voucher is allowed per payment request.`);
        }
        const grantId = pr.grantId;
        const payeeType = 'VENDOR';
        const payeeId = pr.invoice.vendorId;
        const payeeName = pr.invoice.vendor?.name || dto.payeeName;
        const currency = pr.currency;
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
                paymentRequestId,
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
    async findActiveBankAccounts() {
        return this.prisma.bankAccount.findMany({
            where: { isActive: true },
            select: {
                id: true,
                accountName: true,
                bankName: true,
                accountNumber: true,
                currency: true,
                currentBalance: true,
            },
            orderBy: [{ bankName: 'asc' }, { accountName: 'asc' }],
        });
    }
    async markPaid(id, dto, user) {
        const voucher = await this.findOneVoucher(id);
        if (voucher.status !== client_1.DocumentStatus.APPROVED) {
            throw new common_1.BadRequestException('Voucher must be APPROVED to mark as paid');
        }
        if (voucher.payments?.some((p) => p.status === 'COMPLETED')) {
            throw new common_1.BadRequestException('Voucher already has a completed payment');
        }
        if (!dto.paymentDate)
            throw new common_1.BadRequestException('paymentDate is required');
        const pr = voucher.paymentRequest;
        const paymentMethod = String(dto.paymentMethod || pr?.paymentMethod || '').toUpperCase();
        if (!paymentMethod) {
            throw new common_1.BadRequestException('paymentMethod is required');
        }
        const methodDetails = pr?.methodDetails && typeof pr.methodDetails === 'object'
            ? pr.methodDetails
            : {};
        const paymentDate = new Date(dto.paymentDate);
        let chequeData = dto.chequeData;
        let transferData = dto.transferData;
        if (paymentMethod === client_1.PaymentMethod.CHEQUE && !chequeData) {
            const chequeNumber = String(methodDetails.chequeNumber || '').trim();
            if (chequeNumber) {
                chequeData = {
                    chequeNumber,
                    chequeDate: methodDetails.chequeDate || dto.paymentDate,
                    bankAccountId: dto.bankAccountId || pr?.bankAccountId || null,
                };
            }
        }
        if (paymentMethod === client_1.PaymentMethod.BANK_TRANSFER && !transferData) {
            const toBankAccount = String(methodDetails.accountNumber || methodDetails.iban || '').trim();
            const toBankName = String(methodDetails.bankName || '').trim();
            if (toBankAccount || toBankName) {
                transferData = {
                    fromBankAccountId: dto.bankAccountId || pr?.bankAccountId || null,
                    toBankAccount: toBankAccount || '—',
                    toBankName: toBankName || '—',
                };
            }
        }
        const bankAccountId = dto.bankAccountId ||
            chequeData?.bankAccountId ||
            transferData?.fromBankAccountId ||
            pr?.bankAccountId ||
            null;
        const needsOrgBank = paymentMethod === client_1.PaymentMethod.CHEQUE ||
            paymentMethod === client_1.PaymentMethod.BANK_TRANSFER;
        if (needsOrgBank && !bankAccountId) {
            throw new common_1.BadRequestException('Select the organisation bank account to pay from');
        }
        await this.resolveLeafAccountByCode(DEFAULT_AP_ACCOUNT_CODE);
        await this.resolveCreditGlAccountId(paymentMethod, bankAccountId);
        await this.resolveOpenPeriod(paymentDate);
        const payment = await this.prisma.payment.create({
            data: {
                paymentVoucherId: id,
                paymentMethod: paymentMethod,
                paymentDate,
                amount: voucher.amount,
                currency: voucher.currency,
                exchangeRate: voucher.exchangeRate,
                baseAmount: voucher.baseAmount,
                reference: dto.reference,
                bankAccountId,
                status: 'COMPLETED',
                createdById: user.id,
            },
        });
        try {
            if (paymentMethod === client_1.PaymentMethod.CHEQUE && chequeData) {
                if (!chequeData.bankAccountId && !bankAccountId) {
                    throw new common_1.BadRequestException('bankAccountId is required when recording a cheque payment');
                }
                const chequeSerial = await this.serialSvc.next(voucher.grant?.code || 'SYS', 'CHQ');
                await this.prisma.cheque.create({
                    data: {
                        paymentId: payment.id,
                        serialNumber: chequeSerial,
                        chequeNumber: String(chequeData.chequeNumber),
                        bankAccountId: String(chequeData.bankAccountId || bankAccountId),
                        payeeName: voucher.payeeName,
                        amount: voucher.amount,
                        currency: voucher.currency,
                        chequeDate: new Date(String(chequeData.chequeDate || dto.paymentDate)),
                        status: 'ISSUED',
                        issuedAt: new Date(),
                    },
                });
            }
            else if (paymentMethod === client_1.PaymentMethod.BANK_TRANSFER && transferData) {
                if (!transferData.fromBankAccountId && !bankAccountId) {
                    throw new common_1.BadRequestException('fromBankAccountId is required when recording a bank transfer');
                }
                const transferSerial = await this.serialSvc.next(voucher.grant?.code || 'SYS', 'BT');
                await this.prisma.bankTransfer.create({
                    data: {
                        paymentId: payment.id,
                        serialNumber: transferSerial,
                        fromBankAccountId: String(transferData.fromBankAccountId || bankAccountId),
                        toBankAccount: String(transferData.toBankAccount || '—'),
                        toBankName: String(transferData.toBankName || '—'),
                        toAccountName: voucher.payeeName,
                        currency: voucher.currency,
                        amount: voucher.amount,
                        exchangeRate: voucher.exchangeRate,
                        baseAmount: voucher.baseAmount,
                        transferDate: paymentDate,
                        reference: dto.reference,
                        status: 'COMPLETED',
                        completedAt: new Date(),
                    },
                });
            }
            const journalEntry = await this.createAndPostPaymentJournal({
                paymentId: payment.id,
                voucher,
                paymentMethod,
                paymentDate,
                bankAccountId,
                user,
            });
            if (bankAccountId) {
                await this.prisma.bankAccount.update({
                    where: { id: bankAccountId },
                    data: {
                        currentBalance: {
                            decrement: new client_1.Prisma.Decimal(Number(voucher.amount)),
                        },
                    },
                });
            }
            await this.prisma.paymentVoucher.update({
                where: { id },
                data: { status: client_1.DocumentStatus.CLOSED },
            });
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
                newValues: {
                    status: client_1.DocumentStatus.CLOSED,
                    paymentMethod,
                    journalEntryId: journalEntry.id,
                    journalSerial: journalEntry.serialNumber,
                },
            });
            return {
                ...payment,
                journalEntryId: journalEntry.id,
                journalEntry: {
                    id: journalEntry.id,
                    serialNumber: journalEntry.serialNumber,
                    status: journalEntry.status,
                },
            };
        }
        catch (err) {
            await this.prisma.bankTransfer.deleteMany({ where: { paymentId: payment.id } });
            await this.prisma.cheque.deleteMany({ where: { paymentId: payment.id } });
            await this.prisma.journalEntry.deleteMany({
                where: { sourceType: client_1.JournalSource.PAYMENT, sourceId: payment.id },
            });
            await this.prisma.payment.delete({ where: { id: payment.id } });
            throw err;
        }
    }
    async resolveLeafAccountByCode(code) {
        const account = await this.prisma.chartOfAccount.findFirst({
            where: { code, isLeaf: true, isActive: true, deletedAt: null },
        });
        if (!account) {
            throw new common_1.BadRequestException(`Chart of account '${code}' not found. Seed the COA or configure GL accounts.`);
        }
        return account;
    }
    async resolveCreditGlAccountId(paymentMethod, bankAccountId) {
        if (bankAccountId) {
            const bank = await this.prisma.bankAccount.findUnique({
                where: { id: bankAccountId },
                select: { id: true, glAccountId: true, accountName: true },
            });
            if (bank?.glAccountId)
                return bank.glAccountId;
        }
        const isCash = paymentMethod === client_1.PaymentMethod.CASH ||
            paymentMethod === client_1.PaymentMethod.PETTY_CASH;
        const code = isCash ? DEFAULT_CASH_ACCOUNT_CODE : DEFAULT_BANK_ACCOUNT_CODE;
        const account = await this.resolveLeafAccountByCode(code);
        return account.id;
    }
    async resolveOpenPeriod(paymentDate) {
        const period = await this.prisma.accountingPeriod.findFirst({
            where: {
                status: 'OPEN',
                startDate: { lte: paymentDate },
                endDate: { gte: paymentDate },
            },
            orderBy: { startDate: 'desc' },
        });
        if (!period) {
            throw new common_1.BadRequestException(`No open accounting period covers ${paymentDate.toISOString().slice(0, 10)}. Open a fiscal period before marking paid.`);
        }
        return period;
    }
    async createAndPostPaymentJournal(opts) {
        const amount = Number(opts.voucher.amount);
        const exchangeRate = Number(opts.voucher.exchangeRate || 1);
        if (!(amount > 0)) {
            throw new common_1.BadRequestException('Payment amount must be positive for journal posting');
        }
        const apAccount = await this.resolveLeafAccountByCode(DEFAULT_AP_ACCOUNT_CODE);
        const creditAccountId = await this.resolveCreditGlAccountId(opts.paymentMethod, opts.bankAccountId);
        if (creditAccountId === apAccount.id) {
            throw new common_1.BadRequestException('AP and bank/cash GL accounts resolve to the same account; check COA configuration.');
        }
        const period = await this.resolveOpenPeriod(opts.paymentDate);
        const grantCode = opts.voucher.grant?.code || 'SYS';
        const serialNumber = await this.serialSvc.next(grantCode, 'JE');
        const description = `Payment for ${opts.voucher.serialNumber} — ${opts.voucher.payeeName}`;
        const lineDesc = opts.voucher.paymentRequest?.serialNumber ||
            opts.voucher.description ||
            opts.voucher.serialNumber;
        const entry = await this.prisma.journalEntry.create({
            data: {
                serialNumber,
                entryDate: opts.paymentDate,
                description,
                reference: opts.voucher.serialNumber,
                sourceType: client_1.JournalSource.PAYMENT,
                sourceId: opts.paymentId,
                grantId: opts.voucher.grantId,
                periodId: period.id,
                currency: opts.voucher.currency || 'USD',
                totalDebit: new client_1.Prisma.Decimal(amount),
                totalCredit: new client_1.Prisma.Decimal(amount),
                status: client_1.JournalStatus.POSTED,
                isPosted: true,
                postedAt: new Date(),
                postedById: opts.user.id,
                createdById: opts.user.id,
                lines: {
                    create: [
                        {
                            accountId: apAccount.id,
                            description: `Clear AP — ${lineDesc}`,
                            debitAmount: new client_1.Prisma.Decimal(amount),
                            creditAmount: new client_1.Prisma.Decimal(0),
                            currency: opts.voucher.currency || 'USD',
                            exchangeRate: new client_1.Prisma.Decimal(exchangeRate),
                            baseDebit: new client_1.Prisma.Decimal(amount * exchangeRate),
                            baseCredit: new client_1.Prisma.Decimal(0),
                            grantId: opts.voucher.grantId,
                            lineNumber: 1,
                        },
                        {
                            accountId: creditAccountId,
                            description: `Payment — ${opts.paymentMethod.replace(/_/g, ' ')}`,
                            debitAmount: new client_1.Prisma.Decimal(0),
                            creditAmount: new client_1.Prisma.Decimal(amount),
                            currency: opts.voucher.currency || 'USD',
                            exchangeRate: new client_1.Prisma.Decimal(exchangeRate),
                            baseDebit: new client_1.Prisma.Decimal(0),
                            baseCredit: new client_1.Prisma.Decimal(amount * exchangeRate),
                            grantId: opts.voucher.grantId,
                            lineNumber: 2,
                        },
                    ],
                },
            },
            include: { lines: true },
        });
        await this.prisma.payment.update({
            where: { id: opts.paymentId },
            data: { journalEntryId: entry.id },
        });
        await this.auditSvc.log({
            userId: opts.user.id,
            action: 'CREATE',
            module: 'JOURNAL_ENTRIES',
            resource: 'JournalEntry',
            resourceId: entry.id,
            newValues: {
                serialNumber: entry.serialNumber,
                sourceType: client_1.JournalSource.PAYMENT,
                sourceId: opts.paymentId,
                status: client_1.JournalStatus.POSTED,
                totalDebit: amount,
                totalCredit: amount,
            },
        });
        return entry;
    }
    async findAllCheques(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { status, search } = query;
        const where = {
            ...(status && { status: status }),
            ...(search && {
                OR: [
                    { chequeNumber: { contains: search, mode: 'insensitive' } },
                    { serialNumber: { contains: search, mode: 'insensitive' } },
                    { payeeName: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.cheque.findMany({
                where,
                include: {
                    bankAccount: {
                        select: { id: true, accountName: true, bankName: true, accountNumber: true },
                    },
                    payment: {
                        select: {
                            id: true,
                            paymentDate: true,
                            paymentVoucher: {
                                select: { id: true, serialNumber: true, status: true },
                            },
                        },
                    },
                },
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