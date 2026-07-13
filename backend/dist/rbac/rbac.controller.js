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
exports.RbacController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rbac_service_1 = require("./rbac.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../common/guards/rbac.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let RbacController = class RbacController {
    constructor(rbacService) {
        this.rbacService = rbacService;
    }
    getAllRoles() {
        return this.rbacService.getAllRoles();
    }
    createRole(data) {
        return this.rbacService.createRole(data);
    }
    setRolePermissions(roleId, data) {
        return this.rbacService.setRolePermissions(roleId, data.permissionIds);
    }
    getAllPermissions() {
        return this.rbacService.getAllPermissions();
    }
};
exports.RbacController = RbacController;
__decorate([
    (0, common_1.Get)('roles'),
    (0, permissions_decorator_1.RequirePermissions)('ROLES:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List all roles with permissions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "getAllRoles", null);
__decorate([
    (0, common_1.Post)('roles'),
    (0, permissions_decorator_1.RequirePermissions)('ROLES:CONFIGURE'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new role' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "createRole", null);
__decorate([
    (0, common_1.Post)('roles/:roleId/permissions'),
    (0, permissions_decorator_1.RequirePermissions)('ROLES:CONFIGURE'),
    (0, swagger_1.ApiOperation)({ summary: 'Set permissions for a role' }),
    __param(0, (0, common_1.Param)('roleId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "setRolePermissions", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, permissions_decorator_1.RequirePermissions)('ROLES:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List all available permissions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "getAllPermissions", null);
exports.RbacController = RbacController = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [rbac_service_1.RbacService])
], RbacController);
//# sourceMappingURL=rbac.controller.js.map