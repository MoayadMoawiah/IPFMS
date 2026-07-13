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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const serial_service_1 = require("../serial/serial.service");
const audit_service_1 = require("../audit/audit.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const client_1 = require("@prisma/client");
let AssetsService = class AssetsService {
    constructor(prisma, serialSvc, auditSvc) {
        this.prisma = prisma;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, categoryId, grantId } = query;
        const where = {
            deletedAt: null,
            ...(status && { status }),
            ...(categoryId && { categoryId }),
            ...(grantId && { grantId }),
            ...(search && { OR: [{ assetCode: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }] }),
        };
        const [data, total] = await Promise.all([
            this.prisma.fixedAsset.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, code: true } },
                    grant: { select: { id: true, code: true } },
                },
                skip: (page - 1) * limit, take: limit, orderBy: { assetCode: 'asc' },
            }),
            this.prisma.fixedAsset.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id) {
        const asset = await this.prisma.fixedAsset.findUnique({
            where: { id, deletedAt: null },
            include: {
                category: true,
                grant: true,
                assignments: { include: { assignedTo: { select: { firstName: true, lastName: true } } } },
                maintenance: { orderBy: { scheduledDate: 'desc' } },
                depSchedules: { orderBy: { period: 'asc' } },
                verifications: { orderBy: { verificationDate: 'desc' } },
            },
        });
        if (!asset)
            throw new common_1.NotFoundException(`Asset ${id} not found`);
        return asset;
    }
    async create(dto, user) {
        const category = await this.prisma.assetCategory.findUnique({ where: { id: dto.categoryId } });
        if (!category)
            throw new common_1.NotFoundException('Asset category not found');
        const grantCode = dto.grantId ? (await this.prisma.grant.findUnique({ where: { id: dto.grantId }, select: { code: true } }))?.code : 'SYS';
        const serialNumber = await this.serialSvc.next(grantCode || 'SYS', 'PR');
        const assetCode = `AST-${Date.now().toString(36).toUpperCase()}`;
        const asset = await this.prisma.fixedAsset.create({
            data: {
                serialNumber: assetCode,
                assetCode,
                name: dto.name,
                description: dto.description,
                categoryId: dto.categoryId,
                grantId: dto.grantId,
                purchaseDate: new Date(dto.purchaseDate),
                purchasePrice: new client_1.Prisma.Decimal(dto.purchasePrice),
                currency: dto.currency || 'USD',
                currentBookValue: new client_1.Prisma.Decimal(dto.purchasePrice),
                depreciationMethod: dto.depreciationMethod || client_1.DepreciationMethod.STRAIGHT_LINE,
                usefulLifeYears: dto.usefulLifeYears || category.usefulLifeYears,
                residualValue: new client_1.Prisma.Decimal(dto.residualValue || '0'),
                depreciationStartDate: new Date(dto.depreciationStartDate || dto.purchaseDate),
                warehouseId: dto.warehouseId,
                locationCode: dto.locationCode,
                status: 'ACTIVE',
                createdById: user.id,
            },
        });
        await this.generateDepreciationSchedule(asset.id);
        await this.auditSvc.log({
            userId: user.id, action: 'CREATE', module: 'ASSETS', resource: 'FixedAsset',
            resourceId: asset.id, newValues: { assetCode, name: asset.name },
        });
        return asset;
    }
    async assign(assetId, dto, user) {
        await this.findOne(assetId);
        return this.prisma.assetAssignment.create({
            data: {
                assetId,
                assignedToId: dto.assignedToId,
                departmentId: dto.departmentId,
                assignedDate: new Date(dto.assignedDate || Date.now()),
                condition: dto.condition || 'GOOD',
                notes: dto.notes,
                assignedById: user.id,
            },
        });
    }
    async depreciate(assetId, periodId, user) {
        const asset = await this.findOne(assetId);
        const schedule = await this.prisma.assetDepreciationSchedule.findFirst({
            where: { assetId, isPosted: false },
            orderBy: { period: 'asc' },
        });
        if (!schedule)
            throw new common_1.BadRequestException('No pending depreciation for this asset');
        await this.prisma.assetDepreciationSchedule.update({
            where: { id: schedule.id },
            data: { isPosted: true, postedAt: new Date() },
        });
        await this.prisma.fixedAsset.update({
            where: { id: assetId },
            data: {
                currentBookValue: new client_1.Prisma.Decimal(Number(schedule.bookValue)),
                lastDepreciationDate: schedule.period,
            },
        });
        return schedule;
    }
    async getCategories() {
        return this.prisma.assetCategory.findMany({ orderBy: { code: 'asc' } });
    }
    async createCategory(dto) {
        return this.prisma.assetCategory.create({
            data: {
                name: dto.name, code: dto.code, parentId: dto.parentId,
                depreciationMethod: dto.depreciationMethod || 'STRAIGHT_LINE',
                usefulLifeYears: dto.usefulLifeYears || 5,
                residualValuePercent: new client_1.Prisma.Decimal(dto.residualValuePercent || '0'),
            },
        });
    }
    async getDepreciationSchedule(assetId) {
        return this.prisma.assetDepreciationSchedule.findMany({
            where: { assetId },
            orderBy: { period: 'asc' },
        });
    }
    async generateDepreciationSchedule(assetId) {
        const asset = await this.prisma.fixedAsset.findUnique({ where: { id: assetId } });
        if (!asset)
            return;
        const purchasePrice = Number(asset.purchasePrice);
        const residualValue = Number(asset.residualValue);
        const usefulLife = asset.usefulLifeYears;
        const annualDepreciation = (purchasePrice - residualValue) / usefulLife;
        const monthlyDepreciation = annualDepreciation / 12;
        const schedules = [];
        let bookValue = purchasePrice;
        let accumulated = 0;
        const startDate = new Date(asset.depreciationStartDate);
        for (let i = 0; i < usefulLife * 12; i++) {
            const period = new Date(startDate);
            period.setMonth(period.getMonth() + i);
            if (bookValue <= residualValue)
                break;
            const depr = Math.min(monthlyDepreciation, bookValue - residualValue);
            accumulated += depr;
            bookValue -= depr;
            schedules.push({
                assetId,
                period,
                depreciationAmount: new client_1.Prisma.Decimal(depr.toFixed(4)),
                accumulatedDepreciation: new client_1.Prisma.Decimal(accumulated.toFixed(4)),
                bookValue: new client_1.Prisma.Decimal(bookValue.toFixed(4)),
                isPosted: false,
            });
        }
        if (schedules.length > 0) {
            await this.prisma.assetDepreciationSchedule.createMany({ data: schedules });
        }
    }
    async softDelete(id, user) {
        await this.findOne(id);
        await this.prisma.fixedAsset.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        serial_service_1.SerialService,
        audit_service_1.AuditService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map