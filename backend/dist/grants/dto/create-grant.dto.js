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
exports.CreateGrantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateGrantDto {
    constructor() {
        this.currency = 'USD';
    }
}
exports.CreateGrantDto = CreateGrantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USAID-2026' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Health Systems Strengthening Project' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Donor ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "donorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', default: 'USD' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '500000.0000', description: 'Total budget in grant currency' }),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '0,4' }),
    (0, class_validator_1.Matches)(/^(?:0*[1-9]\d*(?:\.\d{1,4})?|0+\.\d*[1-9]\d*)$/, {
        message: 'totalBudget must be a positive number',
    }),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "totalBudget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-12-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "signedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "objectives", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "reportingRequirements", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateGrantDto.prototype, "targetBeneficiaries", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "grantManagerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGrantDto.prototype, "projectCoordinatorId", void 0);
//# sourceMappingURL=create-grant.dto.js.map