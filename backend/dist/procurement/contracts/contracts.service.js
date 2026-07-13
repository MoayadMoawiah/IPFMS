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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const serial_service_1 = require("../../serial/serial.service");
const audit_service_1 = require("../../audit/audit.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const client_1 = require("@prisma/client");
let ContractsService = class ContractsService {
    constructor(prisma, serialSvc, auditSvc) {
        this.prisma = prisma;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, grantId, vendorId } = query;
        const where = {
            deletedAt: null,
            ...(status && { status }),
            ...(grantId && { grantId }),
            ...(vendorId && { vendorId }),
            ...(search && {
                OR: [
                    { serialNumber: { contains: search, mode: 'insensitive' } },
                    { title: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.contract.findMany({
                where,
                include: {
                    vendor: { select: { id: true, name: true } },
                    grant: { select: { id: true, code: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contract.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id) {
        const contract = await this.prisma.contract.findUnique({
            where: { id, deletedAt: null },
            include: {
                vendor: true,
                grant: true,
                purchaseOrders: { select: { id: true, serialNumber: true, status: true, totalAmount: true } },
            },
        });
        if (!contract)
            throw new common_1.NotFoundException(`Contract ${id} not found`);
        return contract;
    }
    async create(dto, user) {
        const grant = await this.prisma.grant.findUnique({ where: { id: dto.grantId } });
        if (!grant)
            throw new common_1.NotFoundException('Grant not found');
        const serialNumber = await this.serialSvc.next(grant.code, 'CNT');
        const contract = await this.prisma.contract.create({
            data: {
                serialNumber,
                vendorId: dto.vendorId,
                grantId: dto.grantId,
                contractType: dto.contractType || 'SERVICE_CONTRACT',
                title: dto.title,
                description: dto.description,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                totalValue: new client_1.Prisma.Decimal(dto.totalValue),
                currency: dto.currency || 'USD',
                paymentTerms: dto.paymentTerms,
                deliverables: dto.deliverables,
                status: 'DRAFT',
                createdById: user.id,
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'CONTRACTS',
            resource: 'Contract',
            resourceId: contract.id,
            newValues: { serialNumber },
        });
        return contract;
    }
    async activate(id, user) {
        return this.prisma.contract.update({ where: { id }, data: { status: 'ACTIVE' } });
    }
    async terminate(id, reason, user) {
        return this.prisma.contract.update({ where: { id }, data: { status: 'TERMINATED' } });
    }
    async getExpiring(days = 30) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() + days);
        return this.prisma.contract.findMany({
            where: {
                status: 'ACTIVE',
                endDate: { lte: cutoff, gte: new Date() },
                deletedAt: null,
            },
            include: { vendor: { select: { id: true, name: true, email: true } } },
            orderBy: { endDate: 'asc' },
        });
    }
    async update(id, dto, user) {
        await this.findOne(id);
        return this.prisma.contract.update({ where: { id }, data: dto });
    }
    async softDelete(id, user) {
        await this.findOne(id);
        await this.prisma.contract.update({ where: { id }, data: { deletedAt: new Date() } });
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        serial_service_1.SerialService,
        audit_service_1.AuditService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map