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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExecutiveDashboard() {
        const [activeGrants, totalBudget, totalSpent, pendingPRs, pendingPOs, pendingPayments,] = await Promise.all([
            this.prisma.grant.count({ where: { status: client_1.GrantStatus.ACTIVE, deletedAt: null } }),
            this.prisma.grant.aggregate({ _sum: { totalBudget: true }, where: { status: client_1.GrantStatus.ACTIVE, deletedAt: null } }),
            this.prisma.grant.aggregate({ _sum: { spentAmount: true }, where: { deletedAt: null } }),
            this.prisma.purchaseRequisition.count({ where: { status: 'SUBMITTED', deletedAt: null } }),
            this.prisma.purchaseOrder.count({ where: { status: 'SUBMITTED', deletedAt: null } }),
            this.prisma.paymentVoucher.count({ where: { status: 'SUBMITTED', deletedAt: null } }),
        ]);
        return {
            data: {
                kpis: {
                    activeGrants,
                    totalBudget: Number(totalBudget._sum.totalBudget || 0),
                    totalSpent: Number(totalSpent._sum.spentAmount || 0),
                    pendingPRs,
                    pendingPOs,
                    pendingPayments,
                },
            },
        };
    }
    async getFinanceDashboard() {
        const [paymentVouchers, journalEntries, bankAccounts] = await Promise.all([
            this.prisma.paymentVoucher.findMany({
                where: { status: 'APPROVED', deletedAt: null },
                take: 10,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.journalEntry.count({ where: { status: 'DRAFT' } }),
            this.prisma.bankAccount.findMany({ where: { isActive: true } }),
        ]);
        return { data: { paymentVouchers, draftJournalEntries: journalEntries, bankAccounts } };
    }
    async getProcurementDashboard() {
        const [prs, pos, vendors] = await Promise.all([
            this.prisma.purchaseRequisition.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { id: true } }),
            this.prisma.purchaseOrder.groupBy({ by: ['status'], where: { deletedAt: null }, _count: { id: true } }),
            this.prisma.vendor.count({ where: { isBlacklisted: false, deletedAt: null } }),
        ]);
        return { data: { prsByStatus: prs, posByStatus: pos, activeVendors: vendors } };
    }
    async getGrantStatement(grantId) {
        const grant = await this.prisma.grant.findUnique({
            where: { id: grantId },
            include: {
                donor: true,
                budgetLines: { where: { deletedAt: null } },
                purchaseOrders: { where: { deletedAt: null, status: { in: ['APPROVED', 'CLOSED'] } } },
                paymentVouchers: { where: { deletedAt: null, status: 'PAID' } },
            },
        });
        if (!grant)
            return { data: null };
        return {
            data: {
                grant: { id: grant.id, code: grant.code, name: grant.name, donorId: grant.donorId },
                totalBudget: Number(grant.totalBudget),
                totalCommitted: Number(grant.committedAmount),
                totalSpent: Number(grant.spentAmount),
                available: Number(grant.totalBudget) - Number(grant.committedAmount) - Number(grant.spentAmount),
                budgetLines: grant.budgetLines ?? [],
                utilizationPercent: Number(grant.totalBudget) > 0
                    ? ((Number(grant.committedAmount) + Number(grant.spentAmount)) / Number(grant.totalBudget)) * 100
                    : 0,
            },
        };
    }
    async getBudgetVsActual(grantId) {
        const where = { deletedAt: null, ...(grantId && { id: grantId }) };
        const grants = await this.prisma.grant.findMany({
            where,
            select: {
                id: true, code: true, name: true,
                totalBudget: true, committedAmount: true, spentAmount: true,
            },
        });
        return {
            data: grants.map((g) => ({
                ...g,
                available: Number(g.totalBudget) - Number(g.committedAmount) - Number(g.spentAmount),
                utilizationPercent: Number(g.totalBudget) > 0
                    ? ((Number(g.committedAmount) + Number(g.spentAmount)) / Number(g.totalBudget)) * 100
                    : 0,
            })),
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map