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
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let VendorsService = class VendorsService {
    constructor(prisma, auditSvc) {
        this.prisma = prisma;
        this.auditSvc = auditSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, isBlacklisted } = query;
        const where = {
            deletedAt: null,
            ...(isBlacklisted !== undefined && { isBlacklisted: isBlacklisted === 'true' }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { registrationNumber: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.vendor.findMany({
                where,
                include: {
                    _count: { select: { documents: true, purchaseOrders: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { name: 'asc' },
            }),
            this.prisma.vendor.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id) {
        const vendor = await this.prisma.vendor.findUnique({
            where: { id, deletedAt: null },
            include: {
                documents: { orderBy: { documentType: 'asc' } },
                bankAccounts: true,
                _count: { select: { purchaseOrders: true, contracts: true } },
            },
        });
        if (!vendor)
            throw new common_1.NotFoundException(`Vendor ${id} not found`);
        return vendor;
    }
    async create(dto, user) {
        const vendor = await this.prisma.vendor.create({
            data: {
                registrationNumber: dto.registrationNumber,
                name: dto.name,
                arabicName: dto.arabicName,
                vendorType: dto.vendorType || 'SUPPLIER',
                country: dto.country,
                address: dto.address,
                city: dto.city,
                phone: dto.phone,
                email: dto.email,
                website: dto.website,
                taxNumber: dto.taxNumber,
                createdById: user.id,
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'VENDORS',
            resource: 'Vendor',
            resourceId: vendor.id,
            newValues: vendor,
        });
        return vendor;
    }
    async update(id, dto, user) {
        await this.findOne(id);
        const updated = await this.prisma.vendor.update({ where: { id }, data: dto });
        await this.auditSvc.log({
            userId: user.id,
            action: 'UPDATE',
            module: 'VENDORS',
            resource: 'Vendor',
            resourceId: id,
            newValues: updated,
        });
        return updated;
    }
    async softDelete(id, user) {
        await this.findOne(id);
        await this.prisma.vendor.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async blacklist(id, reason, user) {
        await this.findOne(id);
        const updated = await this.prisma.vendor.update({
            where: { id },
            data: { isBlacklisted: true, blacklistReason: reason, blacklistDate: new Date() },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'UPDATE',
            module: 'VENDORS',
            resource: 'Vendor',
            resourceId: id,
            newValues: { isBlacklisted: true, reason },
        });
        return updated;
    }
    async removeBlacklist(id, user) {
        await this.findOne(id);
        return this.prisma.vendor.update({
            where: { id },
            data: { isBlacklisted: false, blacklistReason: null, blacklistDate: null },
        });
    }
    async getDocuments(vendorId) {
        return this.prisma.vendorDocument.findMany({
            where: { vendorId },
            orderBy: { documentType: 'asc' },
        });
    }
    async addDocument(vendorId, dto, user) {
        await this.findOne(vendorId);
        return this.prisma.vendorDocument.create({
            data: {
                vendorId,
                documentType: dto.documentType,
                documentNumber: dto.documentNumber,
                issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
                expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
                fileUrl: dto.fileUrl,
                fileName: dto.fileName,
            },
        });
    }
    async getExpiringDocuments(days = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + days);
        return this.prisma.vendorDocument.findMany({
            where: {
                expiryDate: { lte: cutoff, gte: new Date() },
            },
            include: { vendor: { select: { id: true, name: true, email: true } } },
            orderBy: { expiryDate: 'asc' },
        });
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map