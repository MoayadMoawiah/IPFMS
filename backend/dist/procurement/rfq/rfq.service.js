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
exports.RfqService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const serial_service_1 = require("../../serial/serial.service");
const audit_service_1 = require("../../audit/audit.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const client_1 = require("@prisma/client");
const procurement_constants_1 = require("../../common/constants/procurement.constants");
let RfqService = class RfqService {
    constructor(prisma, serialSvc, auditSvc) {
        this.prisma = prisma;
        this.serialSvc = serialSvc;
        this.auditSvc = auditSvc;
    }
    async findAll(query) {
        const { page, limit } = (0, pagination_dto_1.parsePagination)(query);
        const { search, status, grantId, prId } = query;
        const where = {
            deletedAt: null,
            ...(status && { status }),
            ...(grantId && { grantId }),
            ...(prId && { prId }),
            ...(search && {
                OR: [
                    { serialNumber: { contains: search, mode: 'insensitive' } },
                    { title: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [data, total] = await Promise.all([
            this.prisma.rfq.findMany({
                where,
                include: {
                    pr: { select: { id: true, serialNumber: true, title: true } },
                    grant: { select: { id: true, code: true, name: true } },
                    _count: { select: { vendors: true, pafForms: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.rfq.count({ where }),
        ]);
        return (0, pagination_dto_1.buildPaginationResponse)(data, total, page, limit);
    }
    async findOne(id) {
        const rfq = await this.prisma.rfq.findUnique({
            where: { id, deletedAt: null },
            include: {
                pr: { include: { items: true } },
                grant: true,
                vendors: {
                    include: {
                        vendor: { select: { id: true, name: true, email: true, rating: true } },
                    },
                },
                evaluations: true,
            },
        });
        if (!rfq)
            throw new common_1.NotFoundException(`RFQ ${id} not found`);
        return rfq;
    }
    resolveSubmissionDeadline(requiredByDate) {
        const now = new Date();
        if (requiredByDate && requiredByDate.getTime() > now.getTime()) {
            return requiredByDate;
        }
        const deadline = new Date(now);
        deadline.setDate(deadline.getDate() + 14);
        return deadline;
    }
    async createDraftFromPr(prId, user) {
        const pr = await this.prisma.purchaseRequisition.findUnique({
            where: { id: prId, deletedAt: null },
            include: { grant: true },
        });
        if (!pr)
            throw new common_1.NotFoundException('Purchase Requisition not found');
        if (pr.status !== 'APPROVED') {
            throw new common_1.BadRequestException('PR must be APPROVED to create RFQ');
        }
        if ((0, procurement_constants_1.resolveProcurementRoute)(Number(pr.totalEstimatedAmount)) === 'DIRECT_PO') {
            throw new common_1.BadRequestException('RFQ is only required for PRs over $1,001');
        }
        const existing = await this.prisma.rfq.findFirst({
            where: { prId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
        if (existing)
            return existing;
        const serialNumber = await this.serialSvc.next(pr.grant.code, 'RFQ');
        const submissionDeadline = this.resolveSubmissionDeadline(pr.requiredByDate);
        const rfq = await this.prisma.rfq.create({
            data: {
                serialNumber,
                prId,
                grantId: pr.grantId,
                title: pr.title,
                description: pr.description,
                submissionDeadline,
                openingDate: null,
                procurementMethodId: pr.procurementMethodId,
                status: 'DRAFT',
                createdById: user.id,
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'RFQ',
            resource: 'Rfq',
            resourceId: rfq.id,
            newValues: { serialNumber, title: rfq.title, autoCreatedFromPr: prId },
        });
        return rfq;
    }
    async create(dto, user) {
        const pr = await this.prisma.purchaseRequisition.findUnique({
            where: { id: dto.prId },
            include: { grant: true },
        });
        if (!pr)
            throw new common_1.NotFoundException('Purchase Requisition not found');
        if (pr.status !== 'APPROVED')
            throw new common_1.BadRequestException('PR must be APPROVED to create RFQ');
        if ((0, procurement_constants_1.resolveProcurementRoute)(Number(pr.totalEstimatedAmount)) === 'DIRECT_PO') {
            throw new common_1.BadRequestException('RFQ is only required for PRs over $1,001');
        }
        const serialNumber = await this.serialSvc.next(pr.grant.code, 'RFQ');
        const rfq = await this.prisma.rfq.create({
            data: {
                serialNumber,
                prId: dto.prId,
                grantId: pr.grantId,
                title: dto.title || pr.title,
                description: dto.description,
                submissionDeadline: new Date(dto.submissionDeadline),
                openingDate: dto.openingDate ? new Date(dto.openingDate) : null,
                procurementMethodId: dto.procurementMethodId || pr.procurementMethodId,
                status: 'DRAFT',
                createdById: user.id,
            },
        });
        await this.auditSvc.log({
            userId: user.id,
            action: 'CREATE',
            module: 'RFQ',
            resource: 'Rfq',
            resourceId: rfq.id,
            newValues: { serialNumber, title: rfq.title },
        });
        return rfq;
    }
    async issue(id, user) {
        const rfq = await this.findOne(id);
        if (rfq.status !== 'DRAFT')
            throw new common_1.BadRequestException('Only DRAFT RFQs can be issued');
        return this.prisma.rfq.update({
            where: { id },
            data: { status: 'ISSUED', issuedDate: new Date() },
        });
    }
    async inviteVendor(rfqId, vendorId, user) {
        const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
        if (!vendor)
            throw new common_1.NotFoundException('Vendor not found');
        if (vendor.isBlacklisted)
            throw new common_1.BadRequestException('Cannot invite blacklisted vendor');
        return this.prisma.rfqVendor.upsert({
            where: { rfqId_vendorId: { rfqId, vendorId } },
            update: {},
            create: { rfqId, vendorId, invitedAt: new Date() },
            include: { vendor: { select: { id: true, name: true, email: true } } },
        });
    }
    async updateVendorQuotation(rfqId, rfqVendorId, dto) {
        const existing = await this.prisma.rfqVendor.findFirst({
            where: { id: rfqVendorId, rfqId },
        });
        if (!existing)
            throw new common_1.NotFoundException('RFQ vendor not found');
        const technicalScore = dto.technicalScore !== undefined
            ? new client_1.Prisma.Decimal(dto.technicalScore)
            : existing.technicalScore;
        const committeeScore = dto.committeeScore !== undefined
            ? new client_1.Prisma.Decimal(dto.committeeScore)
            : existing.committeeScore;
        const financialScore = dto.financialScore !== undefined
            ? new client_1.Prisma.Decimal(dto.financialScore)
            : existing.financialScore;
        const totalScore = new client_1.Prisma.Decimal(Number(technicalScore) + Number(committeeScore) + Number(financialScore));
        return this.prisma.rfqVendor.update({
            where: { id: rfqVendorId, rfqId },
            data: {
                respondedAt: new Date(),
                quotedAmount: dto.quotedAmount ? new client_1.Prisma.Decimal(dto.quotedAmount) : undefined,
                currency: dto.currency,
                deliveryDays: dto.deliveryDays,
                warrantyTerms: dto.warrantyTerms,
                technicalScore,
                committeeScore,
                financialScore,
                totalScore,
                notes: dto.notes,
            },
            include: {
                vendor: { select: { id: true, name: true, email: true } },
            },
        });
    }
    async awardVendor(rfqId, rfqVendorId, user) {
        await this.prisma.rfqVendor.updateMany({
            where: { rfqId },
            data: { isWinner: false },
        });
        const winner = await this.prisma.rfqVendor.update({
            where: { id: rfqVendorId },
            data: { isWinner: true },
        });
        await this.prisma.rfq.update({ where: { id: rfqId }, data: { status: 'AWARDED' } });
        return winner;
    }
    async getComparison(id) {
        const rfq = await this.findOne(id);
        return {
            rfq: { id: rfq.id, serialNumber: rfq.serialNumber, title: rfq.title },
            vendors: rfq.vendors
                .filter((v) => v.respondedAt !== null)
                .sort((a, b) => Number(b.totalScore) - Number(a.totalScore)),
        };
    }
};
exports.RfqService = RfqService;
exports.RfqService = RfqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        serial_service_1.SerialService,
        audit_service_1.AuditService])
], RfqService);
//# sourceMappingURL=rfq.service.js.map