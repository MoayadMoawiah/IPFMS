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
exports.GoodsReceiptController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const goods_receipt_service_1 = require("./goods-receipt.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let GoodsReceiptController = class GoodsReceiptController {
    constructor(svc) {
        this.svc = svc;
    }
    findAll(q) {
        return this.svc.findAll(q);
    }
    create(dto, user) {
        return this.svc.create(dto, user);
    }
    findOne(id, user) {
        return this.svc.findOne(id, user);
    }
    update(id, dto, user) {
        return this.svc.update(id, dto, user);
    }
    submit(id, user) {
        return this.svc.submit(id, user);
    }
    approve(id, body, user) {
        return this.svc.approve(id, body.comment, user);
    }
    reject(id, body, user) {
        return this.svc.reject(id, body.comment, user);
    }
    return_(id, body, user) {
        return this.svc.return_(id, body.comment, user);
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
        return this.svc.uploadDocuments(id, files, labels, user);
    }
    listDocuments(id) {
        return this.svc.listDocuments(id);
    }
    deleteDocument(id, attachmentId, user) {
        return this.svc.deleteDocument(id, attachmentId, user);
    }
    remove(id, user) {
        return this.svc.softDelete(id, user);
    }
};
exports.GoodsReceiptController = GoodsReceiptController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:READ'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:CREATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:READ'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a DRAFT or RETURNED goods receipt' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:SUBMIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/return'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "return_", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:UPDATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload documents to a goods receipt' }),
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
], GoodsReceiptController.prototype, "uploadDocuments", null);
__decorate([
    (0, common_1.Get)(':id/documents'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List documents attached to a goods receipt' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "listDocuments", null);
__decorate([
    (0, common_1.Delete)(':id/documents/:attachmentId'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:UPDATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a document from a goods receipt' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('attachmentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "deleteDocument", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('GOODS_RECEIPTS:DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GoodsReceiptController.prototype, "remove", null);
exports.GoodsReceiptController = GoodsReceiptController = __decorate([
    (0, swagger_1.ApiTags)('Goods Receipts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('procurement/goods-receipts'),
    __metadata("design:paramtypes", [goods_receipt_service_1.GoodsReceiptService])
], GoodsReceiptController);
//# sourceMappingURL=goods-receipt.controller.js.map