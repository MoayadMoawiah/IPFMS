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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../common/guards/rbac.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let InventoryController = class InventoryController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll(q) { return this.svc.findAllItems(q); }
    create(dto) { return this.svc.createItem(dto); }
    lowStock() { return this.svc.getLowStock(); }
    findOne(id) { return this.svc.findOneItem(id); }
    movements(id, q) { return this.svc.getMovements(id, q); }
    issue(id, dto, user) { return this.svc.issue(id, dto, user.id); }
    warehouses(q) { return this.svc.findWarehouses(q); }
    createWarehouse(dto) { return this.svc.createWarehouse(dto); }
    warehouseStock(id) { return this.svc.getWarehouseStock(id); }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('items'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:CREATE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('items/low-stock'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "lowStock", null);
__decorate([
    (0, common_1.Get)('items/:id'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('items/:id/movements'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:READ'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "movements", null);
__decorate([
    (0, common_1.Post)('items/:id/issue'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "issue", null);
__decorate([
    (0, common_1.Get)('warehouses'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "warehouses", null);
__decorate([
    (0, common_1.Post)('warehouses'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:CREATE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createWarehouse", null);
__decorate([
    (0, common_1.Get)('warehouses/:id/stock'),
    (0, permissions_decorator_1.RequirePermissions)('INVENTORY:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "warehouseStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('Inventory'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map