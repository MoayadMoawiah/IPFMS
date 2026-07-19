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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fs_1 = require("fs");
const path = require("path");
const minio_service_1 = require("./minio.service");
const MIME_BY_EXT = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
};
let UploadsController = class UploadsController {
    constructor(minioSvc) {
        this.minioSvc = minioSvc;
    }
    serveLocalFile(req, res) {
        if (!this.minioSvc.isLocalStorage()) {
            throw new common_1.NotFoundException('Local file serving is not enabled');
        }
        const marker = '/uploads/files/';
        const fullUrl = req.originalUrl || req.url || '';
        const idx = fullUrl.indexOf(marker);
        const raw = idx >= 0
            ? fullUrl.slice(idx + marker.length).split('?')[0]
            : String(req.params['0'] ?? '');
        const storageKey = raw
            .split('/')
            .filter(Boolean)
            .map((segment) => decodeURIComponent(segment))
            .join('/');
        if (!storageKey) {
            throw new common_1.NotFoundException('File not found');
        }
        let fullPath;
        try {
            fullPath = this.minioSvc.getLocalFilePath(storageKey);
        }
        catch {
            throw new common_1.NotFoundException('File not found');
        }
        if (!(0, fs_1.existsSync)(fullPath)) {
            throw new common_1.NotFoundException('File not found');
        }
        const ext = path.extname(fullPath).toLowerCase();
        const mimeType = MIME_BY_EXT[ext] || 'application/octet-stream';
        const fileName = storageKey.split('/').pop() || 'file';
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        return new common_1.StreamableFile((0, fs_1.createReadStream)(fullPath));
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Get)('files/*'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", common_1.StreamableFile)
], UploadsController.prototype, "serveLocalFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [minio_service_1.MinioService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map