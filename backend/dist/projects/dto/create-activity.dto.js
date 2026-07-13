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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActivityProgressDto = exports.UpdateActivityDto = exports.CreateActivityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const POSITIVE_DECIMAL = /^(?:0*[1-9]\d*(?:\.\d{1,4})?|0+\.\d*[1-9]\d*)$/;
class CreateActivityDto {
}
exports.CreateActivityDto = CreateActivityDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'USAID-2026-001-ACT01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Beneficiary Registration' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Project ID (resolved from grantId if omitted)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Grant ID — used to resolve the linked project' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "grantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-03-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '80000.0000' }),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,4' }),
    (0, class_validator_1.Matches)(POSITIVE_DECIMAL, {
        message: 'plannedBudget must be a positive number',
    }),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "plannedBudget", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateActivityDto.prototype, "responsibleUserId", void 0);
class UpdateActivityDto {
}
exports.UpdateActivityDto = UpdateActivityDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateActivityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateActivityDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateActivityDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,4' }),
    (0, class_validator_1.Matches)(POSITIVE_DECIMAL, {
        message: 'plannedBudget must be a positive number',
    }),
    __metadata("design:type", String)
], UpdateActivityDto.prototype, "plannedBudget", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateActivityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateActivityDto.prototype, "responsibleUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateActivityDto.prototype, "status", void 0);
class UpdateActivityProgressDto {
}
exports.UpdateActivityProgressDto = UpdateActivityProgressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 75 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateActivityProgressDto.prototype, "progressPercent", void 0);
//# sourceMappingURL=create-activity.dto.js.map