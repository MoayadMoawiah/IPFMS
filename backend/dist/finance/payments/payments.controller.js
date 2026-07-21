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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let PaymentsController = class PaymentsController {
    constructor(svc) {
        this.svc = svc;
    }
    findPaymentRequests(q) {
        return this.svc.findAllPaymentRequests(q);
    }
    createPaymentRequest(dto, user) {
        return this.svc.createPaymentRequest(dto, user);
    }
    findOnePaymentRequest(id, user) {
        return this.svc.findOnePaymentRequest(id, user);
    }
    updatePaymentRequest(id, dto, user) {
        return this.svc.updatePaymentRequest(id, dto, user);
    }
    getCashReceipt(id) {
        return this.svc.getCashReceipt(id);
    }
    uploadPaymentRequestDocuments(id, files, labelsJson, user) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        let labels = [];
        try {
            labels = labelsJson ? JSON.parse(labelsJson) : [];
        }
        catch {
            labels = [];
        }
        return this.svc.uploadPaymentRequestDocuments(id, files, labels, user);
    }
    listPaymentRequestDocuments(id) {
        return this.svc.listPaymentRequestDocuments(id);
    }
    listPaymentRequestSupportingDocuments(id) {
        return this.svc.listPaymentRequestSupportingDocuments(id);
    }
    deletePaymentRequestDocument(id, attachmentId, user) {
        return this.svc.deletePaymentRequestDocument(id, attachmentId, user);
    }
    submitPaymentRequest(id, user) {
        return this.svc.submitPaymentRequest(id, user);
    }
    approvePaymentRequest(id, body, user) {
        return this.svc.approvePaymentRequest(id, body.comment, user);
    }
    findVouchers(q) {
        return this.svc.findAllVouchers(q);
    }
    createVoucher(dto, user) {
        return this.svc.createVoucher(dto, user);
    }
    findOneVoucher(id, user) {
        return this.svc.findOneVoucher(id, user);
    }
    listPaymentVoucherSupportingDocuments(id) {
        return this.svc.listPaymentVoucherSupportingDocuments(id);
    }
    listPaymentVoucherDocuments(id) {
        return this.svc.listPaymentVoucherDocuments(id);
    }
    uploadPaymentVoucherDocuments(id, files, labelsJson, user) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        let labels = [];
        try {
            labels = labelsJson ? JSON.parse(labelsJson) : [];
        }
        catch {
            labels = [];
        }
        return this.svc.uploadPaymentVoucherDocuments(id, files, labels, user);
    }
    deletePaymentVoucherDocument(id, attachmentId, user) {
        return this.svc.deletePaymentVoucherDocument(id, attachmentId, user);
    }
    submitVoucher(id, user) {
        return this.svc.submitVoucher(id, user);
    }
    approveVoucher(id, body, user) {
        return this.svc.approveVoucher(id, body.comment, user);
    }
    markPaid(id, dto, user) {
        return this.svc.markPaid(id, dto, user);
    }
    findBankAccounts() {
        return this.svc.findActiveBankAccounts();
    }
    findCheques(q) {
        return this.svc.findAllCheques(q);
    }
    updateCheque(id, body, user) {
        return this.svc.updateChequeStatus(id, body.status, user);
    }
    findTransfers(q) {
        return this.svc.findAllTransfers(q);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('payment-requests'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List payment requests' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findPaymentRequests", null);
__decorate([
    (0, common_1.Post)('payment-requests'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:CREATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Create payment request from approved invoice' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createPaymentRequest", null);
__decorate([
    (0, common_1.Get)('payment-requests/:id'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOnePaymentRequest", null);
__decorate([
    (0, common_1.Patch)('payment-requests/:id'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Update DRAFT/RETURNED payment request' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updatePaymentRequest", null);
__decorate([
    (0, common_1.Get)('payment-requests/:id/cash-receipt'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'Cash receipt data for print/download' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getCashReceipt", null);
__decorate([
    (0, common_1.Post)('payment-requests/:id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload documents to a payment request' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 20 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)('labels')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "uploadPaymentRequestDocuments", null);
__decorate([
    (0, common_1.Get)('payment-requests/:id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List payment request documents' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "listPaymentRequestDocuments", null);
__decorate([
    (0, common_1.Get)('payment-requests/:id/supporting-documents'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    (0, swagger_1.ApiOperation)({
        summary: 'List chain supporting documents (PR, PO, GRN, invoice, payment request) for finance approval',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "listPaymentRequestSupportingDocuments", null);
__decorate([
    (0, common_1.Delete)('payment-requests/:id/documents/:attachmentId'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a payment request document' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('attachmentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "deletePaymentRequestDocument", null);
__decorate([
    (0, common_1.Post)('payment-requests/:id/submit'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:SUBMIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "submitPaymentRequest", null);
__decorate([
    (0, common_1.Post)('payment-requests/:id/approve'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "approvePaymentRequest", null);
__decorate([
    (0, common_1.Get)('payment-vouchers'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findVouchers", null);
__decorate([
    (0, common_1.Post)('payment-vouchers'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:CREATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "createVoucher", null);
__decorate([
    (0, common_1.Get)('payment-vouchers/:id'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOneVoucher", null);
__decorate([
    (0, common_1.Get)('payment-vouchers/:id/supporting-documents'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    (0, swagger_1.ApiOperation)({
        summary: 'List chain supporting documents for a payment voucher (via linked payment request)',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "listPaymentVoucherSupportingDocuments", null);
__decorate([
    (0, common_1.Get)('payment-vouchers/:id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List payment voucher own documents' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "listPaymentVoucherDocuments", null);
__decorate([
    (0, common_1.Post)('payment-vouchers/:id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload documents to a payment voucher' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 20 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)('labels')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "uploadPaymentVoucherDocuments", null);
__decorate([
    (0, common_1.Delete)('payment-vouchers/:id/documents/:attachmentId'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a payment voucher document' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('attachmentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "deletePaymentVoucherDocument", null);
__decorate([
    (0, common_1.Post)('payment-vouchers/:id/submit'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:SUBMIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "submitVoucher", null);
__decorate([
    (0, common_1.Post)('payment-vouchers/:id/approve'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "approveVoucher", null);
__decorate([
    (0, common_1.Post)('payment-vouchers/:id/mark-paid'),
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:PAY'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "markPaid", null);
__decorate([
    (0, common_1.Get)('bank-accounts'),
    (0, permissions_decorator_1.RequirePermissions)('BANK_ACCOUNTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List active organisation bank accounts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findBankAccounts", null);
__decorate([
    (0, common_1.Get)('cheques'),
    (0, permissions_decorator_1.RequirePermissions)('CHEQUES:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findCheques", null);
__decorate([
    (0, common_1.Patch)('cheques/:id/status'),
    (0, permissions_decorator_1.RequirePermissions)('CHEQUES:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "updateCheque", null);
__decorate([
    (0, common_1.Get)('bank-transfers'),
    (0, permissions_decorator_1.RequirePermissions)('BANK_TRANSFERS:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findTransfers", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('finance'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map