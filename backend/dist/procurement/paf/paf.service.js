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
exports.PafService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const client_1 = require("@prisma/client");
let PafService = class PafService {
    constructor(prisma, auditSvc) {
        this.prisma = prisma;
        this.auditSvc = auditSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const where = {
            ...(query.rfqId && { rfqId: query.rfqId }),
            ...(query.prId && { prId: query.prId }),
        };
        const [data, total] = await Promise.all([
            this.prisma.purchaseAnalysisForm.findMany({
                where,
                include: {
                    rfq: { select: { id: true, serialNumber: true, title: true, status: true } },
                    pr: { select: { id: true, serialNumber: true, title: true } },
                    rfqVendor: {
                        include: { vendor: { select: { id: true, name: true } } },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.purchaseAnalysisForm.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id) {
        const paf = await this.prisma.purchaseAnalysisForm.findUnique({
            where: { id },
            include: {
                rfq: { select: { id: true, serialNumber: true, title: true, status: true, prId: true } },
                pr: { select: { id: true, serialNumber: true, title: true } },
                rfqVendor: {
                    include: { vendor: { select: { id: true, name: true, email: true } } },
                },
            },
        });
        if (!paf)
            throw new common_1.NotFoundException(`PAF ${id} not found`);
        return paf;
    }
    async create(dto, user) {
        const rfq = await this.prisma.rfq.findUnique({
            where: { id: dto.rfqId, deletedAt: null },
            include: {
                vendors: { include: { vendor: true } },
            },
        });
        if (!rfq)
            throw new common_1.NotFoundException('RFQ not found');
        if (rfq.status !== 'AWARDED') {
            throw new common_1.BadRequestException('PAF can only be created for AWARDED RFQs');
        }
        const rfqVendor = rfq.vendors.find((v) => v.id === dto.rfqVendorId);
        if (!rfqVendor)
            throw new common_1.NotFoundException('RFQ vendor not found');
        if (!rfqVendor.isWinner) {
            throw new common_1.BadRequestException('PAF must reference the awarded vendor');
        }
        const existing = await this.prisma.purchaseAnalysisForm.findFirst({
            where: { rfqId: dto.rfqId },
        });
        if (existing) {
            throw new common_1.ConflictException('A PAF already exists for this RFQ');
        }
        if (!dto.justification?.trim()) {
            throw new common_1.BadRequestException('Justification is required');
        }
        const totalAmount = rfqVendor.quotedAmount ?? new client_1.Prisma.Decimal(0);
        const currency = rfqVendor.currency ?? 'USD';
        const paf = await this.prisma.purchaseAnalysisForm.create({
            data: {
                rfqId: dto.rfqId,
                prId: rfq.prId,
                rfqVendorId: dto.rfqVendorId,
                recommendedVendorId: rfqVendor.vendorId,
                totalAmount,
                currency,
                justification: dto.justification.trim(),
                committeeMembers: dto.committeeMembers ?? [],
                status: 'DRAFT',
                createdById: user.id,
            },
            include: {
                rfq: { select: { id: true, serialNumber: true, title: true } },
                rfqVendor: {
                    include: { vendor: { select: { id: true, name: true } } },
                },
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'RFQ',
            resource: 'PurchaseAnalysisForm',
            resourceId: paf.id,
            newValues: { rfqId: dto.rfqId, recommendedVendorId: rfqVendor.vendorId },
        });
        return paf;
    }
};
exports.PafService = PafService;
exports.PafService = PafService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PafService);
//# sourceMappingURL=paf.service.js.map