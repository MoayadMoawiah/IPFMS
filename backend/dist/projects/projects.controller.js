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
exports.ProjectsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const projects_service_1 = require("./projects.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../common/guards/rbac.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const create_activity_dto_1 = require("./dto/create-activity.dto");
let ProjectsController = class ProjectsController {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    findActivities(query) {
        return this.projectsService.findActivities(query);
    }
    createActivity(dto, user) {
        return this.projectsService.createActivity(dto, user);
    }
    findActivity(id) {
        return this.projectsService.findActivity(id);
    }
    updateActivity(id, dto, user) {
        return this.projectsService.updateActivity(id, dto, user);
    }
    updateActivityProgress(id, dto, user) {
        return this.projectsService.updateProgress(id, dto.progressPercent, user);
    }
    removeActivity(id, user) {
        return this.projectsService.softDeleteActivity(id, user);
    }
    uploadActivityDocuments(id, files, labelsJson, user) {
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
        return this.projectsService.uploadActivityDocuments(id, files, labels, user);
    }
    listActivityDocuments(id) {
        return this.projectsService.listActivityDocuments(id);
    }
    deleteActivityDocument(id, attachmentId, user) {
        return this.projectsService.deleteActivityDocument(id, attachmentId, user);
    }
    findAll(query) { return this.projectsService.findAll(query); }
    create(dto, user) { return this.projectsService.create(dto, user); }
    findOne(id) { return this.projectsService.findOne(id); }
    update(id, dto, user) {
        return this.projectsService.update(id, dto, user);
    }
    remove(id, user) {
        return this.projectsService.softDelete(id, user);
    }
    getMilestones(id) { return this.projectsService.getMilestones(id); }
    addMilestone(id, dto, user) {
        return this.projectsService.addMilestone(id, dto, user);
    }
    completeMilestone(id, mid, user) {
        return this.projectsService.completeMilestone(id, mid, user);
    }
};
exports.ProjectsController = ProjectsController;
__decorate([
    (0, common_1.Get)('activities'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List activities across projects/grants' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findActivities", null);
__decorate([
    (0, common_1.Post)('activities'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:CREATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Create activity under a grant/project' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_activity_dto_1.CreateActivityDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Get)('activities/:id'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'Get activity detail' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findActivity", null);
__decorate([
    (0, common_1.Patch)('activities/:id'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Update activity' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_activity_dto_1.UpdateActivityDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateActivity", null);
__decorate([
    (0, common_1.Patch)('activities/:id/progress'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Update activity progress percentage' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_activity_dto_1.UpdateActivityProgressDto, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "updateActivityProgress", null);
__decorate([
    (0, common_1.Delete)('activities/:id'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete activity' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "removeActivity", null);
__decorate([
    (0, common_1.Post)('activities/:id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload documents to an activity' }),
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
], ProjectsController.prototype, "uploadActivityDocuments", null);
__decorate([
    (0, common_1.Get)('activities/:id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List documents attached to an activity' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "listActivityDocuments", null);
__decorate([
    (0, common_1.Delete)('activities/:id/documents/:attachmentId'),
    (0, permissions_decorator_1.RequirePermissions)('ACTIVITIES:UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a document from an activity' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('attachmentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "deleteActivityDocument", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('PROJECTS:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('PROJECTS:CREATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('PROJECTS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('PROJECTS:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('PROJECTS:DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/milestones'),
    (0, permissions_decorator_1.RequirePermissions)('PROJECTS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "getMilestones", null);
__decorate([
    (0, common_1.Post)(':id/milestones'),
    (0, permissions_decorator_1.RequirePermissions)('PROJECTS:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "addMilestone", null);
__decorate([
    (0, common_1.Post)(':id/milestones/:mid/complete'),
    (0, permissions_decorator_1.RequirePermissions)('PROJECTS:UPDATE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('mid')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProjectsController.prototype, "completeMilestone", null);
exports.ProjectsController = ProjectsController = __decorate([
    (0, swagger_1.ApiTags)('Projects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('projects'),
    __metadata("design:paramtypes", [projects_service_1.ProjectsService])
], ProjectsController);
//# sourceMappingURL=projects.controller.js.map