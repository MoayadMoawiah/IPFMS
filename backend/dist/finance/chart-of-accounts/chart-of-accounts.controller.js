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
exports.ChartOfAccountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chart_of_accounts_service_1 = require("./chart-of-accounts.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
let ChartOfAccountsController = class ChartOfAccountsController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll(q) { return this.svc.findAll(q); }
    getTree() { return this.svc.getTree(); }
    create(dto) { return this.svc.create(dto); }
    findOne(id) { return this.svc.findOne(id); }
    getLedger(id, q) { return this.svc.getLedger(id, q); }
    update(id, dto) { return this.svc.update(id, dto); }
    remove(id) { return this.svc.softDelete(id); }
};
exports.ChartOfAccountsController = ChartOfAccountsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('CHART_OF_ACCOUNTS:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tree'),
    (0, permissions_decorator_1.RequirePermissions)('CHART_OF_ACCOUNTS:READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "getTree", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('CHART_OF_ACCOUNTS:CREATE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('CHART_OF_ACCOUNTS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/ledger'),
    (0, permissions_decorator_1.RequirePermissions)('CHART_OF_ACCOUNTS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "getLedger", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('CHART_OF_ACCOUNTS:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('CHART_OF_ACCOUNTS:DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChartOfAccountsController.prototype, "remove", null);
exports.ChartOfAccountsController = ChartOfAccountsController = __decorate([
    (0, swagger_1.ApiTags)('Finance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('finance/accounts'),
    __metadata("design:paramtypes", [chart_of_accounts_service_1.ChartOfAccountsService])
], ChartOfAccountsController);
//# sourceMappingURL=chart-of-accounts.controller.js.map