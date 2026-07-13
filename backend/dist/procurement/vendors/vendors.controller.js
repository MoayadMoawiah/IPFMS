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
exports.VendorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vendors_service_1 = require("./vendors.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let VendorsController = class VendorsController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll(q) { return this.svc.findAll(q); }
    create(dto, user) { return this.svc.create(dto, user); }
    getExpiring(days) { return this.svc.getExpiringDocuments(Number(days) || 30); }
    findOne(id) { return this.svc.findOne(id); }
    update(id, dto, user) { return this.svc.update(id, dto, user); }
    remove(id, user) { return this.svc.softDelete(id, user); }
    blacklist(id, body, user) { return this.svc.blacklist(id, body.reason, user); }
    removeBlacklist(id, user) { return this.svc.removeBlacklist(id, user); }
    getDocs(id) { return this.svc.getDocuments(id); }
    addDoc(id, dto, user) { return this.svc.addDocument(id, dto, user); }
};
exports.VendorsController = VendorsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:CREATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('expiring-documents'),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:READ'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getExpiring", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/blacklist'),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:BLACKLIST'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "blacklist", null);
__decorate([
    (0, common_1.Post)(':id/remove-blacklist'),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:BLACKLIST'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "removeBlacklist", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "getDocs", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('VENDORS:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], VendorsController.prototype, "addDoc", null);
exports.VendorsController = VendorsController = __decorate([
    (0, swagger_1.ApiTags)('Vendors'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('procurement/vendors'),
    __metadata("design:paramtypes", [vendors_service_1.VendorsService])
], VendorsController);
//# sourceMappingURL=vendors.controller.js.map