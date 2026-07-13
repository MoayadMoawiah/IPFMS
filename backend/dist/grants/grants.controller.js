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
exports.GrantsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const grants_service_1 = require("./grants.service");
const create_grant_dto_1 = require("./dto/create-grant.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../common/guards/rbac.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let GrantsController = class GrantsController {
    constructor(grantsService) {
        this.grantsService = grantsService;
    }
    findAll(query, user) {
        return this.grantsService.findAll(query, user);
    }
    create(dto, user) {
        return this.grantsService.create(dto, user);
    }
    findOne(id) {
        return this.grantsService.findOne(id);
    }
    update(id, dto, user) {
        return this.grantsService.update(id, dto, user);
    }
    remove(id, user) {
        return this.grantsService.softDelete(id, user);
    }
    activate(id, user) {
        return this.grantsService.activate(id, user);
    }
    close(id, user) {
        return this.grantsService.close(id, user);
    }
    getBudget(id) {
        return this.grantsService.getBudgetSummary(id);
    }
    getBudgetLines(id) {
        return this.grantsService.getBudgetSummary(id);
    }
    addBudgetLine(id, dto, user) {
        return this.grantsService.addBudgetLine(id, dto, user);
    }
    uploadDocuments(id, files, labelsJson, user) {
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
        return this.grantsService.uploadDocuments(id, files, labels, user);
    }
    listDocuments(id) {
        return this.grantsService.listDocuments(id);
    }
    deleteDocument(id, attachmentId, user) {
        return this.grantsService.deleteDocument(id, attachmentId, user);
    }
};
exports.GrantsController = GrantsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List all grants' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:CREATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new grant' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_grant_dto_1.CreateGrantDto, Object]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'Get grant detail' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Update grant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete grant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/activate'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:APPROVE'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate grant (DRAFT → ACTIVE)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)(':id/close'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:APPROVE'),
    (0, swagger_1.ApiOperation)({ summary: 'Close grant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "close", null);
__decorate([
    (0, common_1.Get)(':id/budget'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'Get grant budget summary' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "getBudget", null);
__decorate([
    (0, common_1.Get)(':id/budget/lines'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'Get grant budget lines' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "getBudgetLines", null);
__decorate([
    (0, common_1.Post)(':id/budget/lines'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Add budget line to grant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "addBudgetLine", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload documents to a grant' }),
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
], GrantsController.prototype, "uploadDocuments", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List documents attached to a grant' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "listDocuments", null);
__decorate([
    (0, common_1.Delete)(':id/documents/:attachmentId'),
    (0, permissions_decorator_1.RequirePermissions)('GRANTS:UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a document from a grant' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('attachmentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], GrantsController.prototype, "deleteDocument", null);
exports.GrantsController = GrantsController = __decorate([
    (0, swagger_1.ApiTags)('Grants'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('grants'),
    __metadata("design:paramtypes", [grants_service_1.GrantsService])
], GrantsController);
//# sourceMappingURL=grants.controller.js.map