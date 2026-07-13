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
exports.PurchaseOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const purchase_orders_service_1 = require("./purchase-orders.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let PurchaseOrdersController = class PurchaseOrdersController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll(q) { return this.svc.findAll(q); }
    create(dto, user) { return this.svc.create(dto, user); }
    findOne(id) { return this.svc.findOne(id); }
    submit(id, user) { return this.svc.submit(id, user); }
    approve(id, body, user) { return this.svc.approve(id, body.comment, user); }
    issue(id, user) { return this.svc.issue(id, user); }
    paymentStatus(id) { return this.svc.getPaymentStatus(id); }
    remove(id, user) { return this.svc.softDelete(id, user); }
};
exports.PurchaseOrdersController = PurchaseOrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('PURCHASE_ORDERS:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('PURCHASE_ORDERS:CREATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('PURCHASE_ORDERS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.RequirePermissions)('PURCHASE_ORDERS:SUBMIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.RequirePermissions)('PURCHASE_ORDERS:APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/issue'),
    (0, permissions_decorator_1.RequirePermissions)('PURCHASE_ORDERS:ISSUE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "issue", null);
__decorate([
    (0, common_1.Get)(':id/payment-status'),
    (0, permissions_decorator_1.RequirePermissions)('PURCHASE_ORDERS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "paymentStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('PURCHASE_ORDERS:DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchaseOrdersController.prototype, "remove", null);
exports.PurchaseOrdersController = PurchaseOrdersController = __decorate([
    (0, swagger_1.ApiTags)('Purchase Orders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('procurement/purchase-orders'),
    __metadata("design:paramtypes", [purchase_orders_service_1.PurchaseOrdersService])
], PurchaseOrdersController);
//# sourceMappingURL=purchase-orders.controller.js.map