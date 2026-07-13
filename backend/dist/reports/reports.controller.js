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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../common/guards/rbac.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let ReportsController = class ReportsController {
    constructor(svc) {
        this.svc = svc;
    }
    executive() { return this.svc.getExecutiveDashboard(); }
    finance() { return this.svc.getFinanceDashboard(); }
    procurement() { return this.svc.getProcurementDashboard(); }
    budgetVsActual(grantId) { return this.svc.getBudgetVsActual(grantId); }
    grantStatement(grantId) { return this.svc.getGrantStatement(grantId); }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard/executive'),
    (0, permissions_decorator_1.RequirePermissions)('REPORTS:READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "executive", null);
__decorate([
    (0, common_1.Get)('dashboard/finance'),
    (0, permissions_decorator_1.RequirePermissions)('FINANCE:READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "finance", null);
__decorate([
    (0, common_1.Get)('dashboard/procurement'),
    (0, permissions_decorator_1.RequirePermissions)('PROCUREMENT:READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "procurement", null);
__decorate([
    (0, common_1.Get)('finance/reports/budget-vs-actual'),
    (0, permissions_decorator_1.RequirePermissions)('FINANCE:READ'),
    __param(0, (0, common_1.Query)('grantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "budgetVsActual", null);
__decorate([
    (0, common_1.Get)('finance/reports/grant-statement'),
    (0, permissions_decorator_1.RequirePermissions)('FINANCE:READ'),
    __param(0, (0, common_1.Query)('grantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "grantStatement", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map