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
exports.SerialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const serial_service_1 = require("./serial.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const rbac_guard_1 = require("../common/guards/rbac.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
class NextSerialDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NextSerialDto.prototype, "grantCode", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NextSerialDto.prototype, "docType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], NextSerialDto.prototype, "padding", void 0);
let SerialController = class SerialController {
    constructor(serialService) {
        this.serialService = serialService;
    }
    async next(dto) {
        const serialNumber = await this.serialService.next(dto.grantCode, dto.docType, dto.padding);
        return { data: { serialNumber } };
    }
    async preview(grantCode, docType, padding) {
        const preview = await this.serialService.preview(grantCode, docType, padding);
        return { data: { preview } };
    }
    getAllSequences() {
        return this.serialService.getAllSequences();
    }
    getGrantSequences(grantCode) {
        return this.serialService.getGrantSequences(grantCode);
    }
};
exports.SerialController = SerialController;
__decorate([
    (0, common_1.Post)('next'),
    (0, permissions_decorator_1.RequirePermissions)('SERIAL:CREATE'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate next serial number (atomic)' }),
    (0, swagger_1.ApiBody)({ type: NextSerialDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NextSerialDto]),
    __metadata("design:returntype", Promise)
], SerialController.prototype, "next", null);
__decorate([
    (0, common_1.Get)('preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview next serial number without incrementing' }),
    __param(0, (0, common_1.Query)('grantCode')),
    __param(1, (0, common_1.Query)('docType')),
    __param(2, (0, common_1.Query)('padding')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], SerialController.prototype, "preview", null);
__decorate([
    (0, common_1.Get)('sequences'),
    (0, permissions_decorator_1.RequirePermissions)('SERIAL:READ'),
    (0, swagger_1.ApiOperation)({ summary: 'List all serial sequences' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SerialController.prototype, "getAllSequences", null);
__decorate([
    (0, common_1.Get)('sequences/grant'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sequences for a specific grant' }),
    __param(0, (0, common_1.Query)('grantCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SerialController.prototype, "getGrantSequences", null);
exports.SerialController = SerialController = __decorate([
    (0, swagger_1.ApiTags)('Serial'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, common_1.Controller)('serial'),
    __metadata("design:paramtypes", [serial_service_1.SerialService])
], SerialController);
//# sourceMappingURL=serial.controller.js.map