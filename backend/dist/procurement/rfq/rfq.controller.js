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
exports.RfqController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rfq_service_1 = require("./rfq.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let RfqController = class RfqController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll(q) { return this.svc.findAll(q); }
    create(dto, user) { return this.svc.create(dto, user); }
    findOne(id) { return this.svc.findOne(id); }
    issue(id, user) { return this.svc.issue(id, user); }
    invite(id, body, user) { return this.svc.inviteVendor(id, body.vendorId, user); }
    updateQuotation(id, rfqVendorId, dto) { return this.svc.updateVendorQuotation(id, rfqVendorId, dto); }
    award(id, rfqVendorId, user) { return this.svc.awardVendor(id, rfqVendorId, user); }
    comparison(id) { return this.svc.getComparison(id); }
};
exports.RfqController = RfqController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('RFQ:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('RFQ:CREATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('RFQ:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/issue'),
    (0, permissions_decorator_1.RequirePermissions)('RFQ:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "issue", null);
__decorate([
    (0, common_1.Post)(':id/vendors'),
    (0, permissions_decorator_1.RequirePermissions)('RFQ:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "invite", null);
__decorate([
    (0, common_1.Patch)(':id/vendors/:rfqVendorId'),
    (0, permissions_decorator_1.RequirePermissions)('RFQ:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('rfqVendorId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "updateQuotation", null);
__decorate([
    (0, common_1.Post)(':id/vendors/:rfqVendorId/award'),
    (0, permissions_decorator_1.RequirePermissions)('RFQ:APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('rfqVendorId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "award", null);
__decorate([
    (0, common_1.Get)(':id/comparison'),
    (0, permissions_decorator_1.RequirePermissions)('RFQ:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "comparison", null);
exports.RfqController = RfqController = __decorate([
    (0, swagger_1.ApiTags)('RFQ'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('procurement/rfq'),
    __metadata("design:paramtypes", [rfq_service_1.RfqService])
], RfqController);
//# sourceMappingURL=rfq.controller.js.map