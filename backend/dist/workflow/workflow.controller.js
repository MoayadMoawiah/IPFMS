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
exports.WorkflowController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const workflow_service_1 = require("./workflow.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../common/guards/rbac.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const workflow_admin_dto_1 = require("./dto/workflow-admin.dto");
class WorkflowActionDto {
}
let WorkflowController = class WorkflowController {
    constructor(workflowService) {
        this.workflowService = workflowService;
    }
    getTemplates() {
        return this.workflowService.getTemplates();
    }
    getPending(user) {
        return this.workflowService.getPendingForUser(user.id, user.roles);
    }
    getAdminBoard(documentType) {
        return this.workflowService.getAdminBoard(documentType);
    }
    adminMove(id, dto, user) {
        return this.workflowService.adminMove(id, dto.direction, user.id, dto.comment);
    }
    adminSetStep(id, dto, user) {
        return this.workflowService.adminSetStep(id, Number(dto.stepNumber), user.id, dto.comment);
    }
    adminReturn(id, dto, user) {
        return this.workflowService.adminReturnToRequester(id, user.id, dto.comment);
    }
    adminReopen(dto, user) {
        return this.workflowService.adminReopen(dto.documentType, dto.documentId, user.id, dto.comment, dto.stepNumber);
    }
    getInstance(id) {
        return this.workflowService.getInstance(id);
    }
    processAction(id, dto, user) {
        return this.workflowService.processAction(id, dto.action, user.id, dto.comment, {
            ipAddress: user.ipAddress,
            userAgent: user.userAgent,
        });
    }
};
exports.WorkflowController = WorkflowController;
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'List all workflow templates' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "getTemplates", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my pending approval tasks' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "getPending", null);
__decorate([
    (0, common_1.Get)('admin/board'),
    (0, permissions_decorator_1.RequirePermissions)('WORKFLOW:OVERRIDE'),
    (0, swagger_1.ApiOperation)({ summary: 'Super Admin Kanban board for a document type' }),
    __param(0, (0, common_1.Query)('documentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "getAdminBoard", null);
__decorate([
    (0, common_1.Post)('admin/instances/:id/move'),
    (0, permissions_decorator_1.RequirePermissions)('WORKFLOW:OVERRIDE'),
    (0, swagger_1.ApiOperation)({ summary: 'Force move workflow one step forward or back' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, workflow_admin_dto_1.AdminMoveDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "adminMove", null);
__decorate([
    (0, common_1.Post)('admin/instances/:id/set-step'),
    (0, permissions_decorator_1.RequirePermissions)('WORKFLOW:OVERRIDE'),
    (0, swagger_1.ApiOperation)({ summary: 'Force jump workflow to a specific step' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, workflow_admin_dto_1.AdminSetStepDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "adminSetStep", null);
__decorate([
    (0, common_1.Post)('admin/instances/:id/return-to-requester'),
    (0, permissions_decorator_1.RequirePermissions)('WORKFLOW:OVERRIDE'),
    (0, swagger_1.ApiOperation)({ summary: 'Force return document to requester' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, workflow_admin_dto_1.AdminCommentDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "adminReturn", null);
__decorate([
    (0, common_1.Post)('admin/reopen'),
    (0, permissions_decorator_1.RequirePermissions)('WORKFLOW:OVERRIDE'),
    (0, swagger_1.ApiOperation)({ summary: 'Reopen a finished workflow into IN_PROGRESS' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [workflow_admin_dto_1.AdminReopenDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "adminReopen", null);
__decorate([
    (0, common_1.Get)('instances/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get workflow instance details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "getInstance", null);
__decorate([
    (0, common_1.Post)('instances/:id/action'),
    (0, swagger_1.ApiOperation)({ summary: 'Process workflow action (approve/reject/return)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, WorkflowActionDto, Object]),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "processAction", null);
exports.WorkflowController = WorkflowController = __decorate([
    (0, swagger_1.ApiTags)('Workflow'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('workflow'),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService])
], WorkflowController);
//# sourceMappingURL=workflow.controller.js.map