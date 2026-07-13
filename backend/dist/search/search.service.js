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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async globalSearch(query, limit = 20) {
        if (!query || query.length < 2)
            return { results: [], total: 0, query };
        const q = query;
        const [grants, vendors, prs, pos, pvs, assets] = await Promise.all([
            this.prisma.grant.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { code: { contains: q, mode: 'insensitive' } },
                        { name: { contains: q, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, code: true, name: true, status: true },
                take: Math.ceil(limit / 3),
            }),
            this.prisma.vendor.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { registrationNumber: { contains: q, mode: 'insensitive' } },
                        { name: { contains: q, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, registrationNumber: true, name: true },
                take: Math.ceil(limit / 6),
            }),
            this.prisma.purchaseRequisition.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { serialNumber: { contains: q, mode: 'insensitive' } },
                        { title: { contains: q, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, serialNumber: true, title: true, status: true },
                take: Math.ceil(limit / 6),
            }),
            this.prisma.purchaseOrder.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { serialNumber: { contains: q, mode: 'insensitive' } },
                        { title: { contains: q, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, serialNumber: true, title: true, status: true },
                take: Math.ceil(limit / 6),
            }),
            this.prisma.paymentVoucher.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { serialNumber: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, serialNumber: true, description: true, status: true },
                take: Math.ceil(limit / 6),
            }),
            this.prisma.fixedAsset.findMany({
                where: {
                    deletedAt: null,
                    OR: [
                        { assetCode: { contains: q, mode: 'insensitive' } },
                        { name: { contains: q, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, assetCode: true, name: true, status: true },
                take: Math.ceil(limit / 6),
            }),
        ]);
        const results = [
            ...grants.map((g) => ({
                id: g.id, type: 'grant', title: g.name,
                subtitle: g.code, status: g.status.toLowerCase(),
                href: `/grants/${g.id}`,
            })),
            ...vendors.map((v) => ({
                id: v.id, type: 'vendor', title: v.name,
                subtitle: v.registrationNumber, status: 'active',
                href: `/procurement/vendors/${v.id}`,
            })),
            ...prs.map((pr) => ({
                id: pr.id, type: 'purchase_requisition', title: pr.title,
                subtitle: pr.serialNumber, status: pr.status.toLowerCase(),
                href: `/procurement/requisitions/${pr.id}`,
            })),
            ...pos.map((po) => ({
                id: po.id, type: 'purchase_order', title: po.title,
                subtitle: po.serialNumber, status: po.status.toLowerCase(),
                href: `/procurement/purchase-orders/${po.id}`,
            })),
            ...pvs.map((pv) => ({
                id: pv.id, type: 'payment_voucher', title: pv.serialNumber,
                subtitle: pv.description, status: pv.status.toLowerCase(),
                href: `/finance/payment-vouchers/${pv.id}`,
            })),
            ...assets.map((a) => ({
                id: a.id, type: 'fixed_asset', title: a.name,
                subtitle: a.assetCode, status: a.status.toLowerCase(),
                href: `/assets/${a.id}`,
            })),
        ].slice(0, limit);
        return { results, total: results.length, query };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map