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
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let PaymentsController = class PaymentsController {
    constructor(svc) {
        this.svc = svc;
    }
    findVouchers(q) { return this.svc.findAllVouchers(q); }
    createVoucher(dto, user) { return this.svc.createVoucher(dto, user); }
    findOneVoucher(id) { return this.svc.findOneVoucher(id); }
    submitVoucher(id, user) { return this.svc.submitVoucher(id, user); }
    approveVoucher(id, body, user) { return this.svc.approveVoucher(id, body.comment, user); }
    markPaid(id, dto, user) { return this.svc.markPaid(id, dto, user); }
    findCheques(q) { return this.svc.findAllCheques(q); }
    updateCheque(id, body, user) { return this.svc.updateChequeStatus(id, body.status, user); }
    findTransfers(q) { return this.svc.findAllTransfers(q); }
};
exports.PaymentsController = PaymentsController;
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOneVoucher", null);
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
    (0, permissions_decorator_1.RequirePermissions)('PAYMENTS:EXECUTE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "markPaid", null);
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