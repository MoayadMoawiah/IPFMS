import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GrantStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getExecutiveDashboard() {
    const [
      activeGrants, totalBudget, totalSpent, pendingPRs,
      pendingPOs, pendingPayments,
    ] = await Promise.all([
      this.prisma.grant.count({ where: { status: GrantStatus.ACTIVE, deletedAt: null } }),
      this.prisma.grant.aggregate({ _sum: { totalBudget: true }, where: { status: GrantStatus.ACTIVE, deletedAt: null } }),
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

  async getGrantStatement(grantId: string) {
    const grant = await this.prisma.grant.findUnique({
      where: { id: grantId },
      include: {
        donor: true,
        budgetLines: { where: { deletedAt: null } },
        purchaseOrders: { where: { deletedAt: null, status: { in: ['APPROVED', 'CLOSED'] as any[] } } },
        paymentVouchers: { where: { deletedAt: null, status: 'CLOSED' } },
      },
    });

    if (!grant) return { data: null };

    return {
      data: {
        grant: { id: grant.id, code: grant.code, name: grant.name, donorId: grant.donorId },
        totalBudget: Number(grant.totalBudget),
        totalCommitted: Number(grant.committedAmount),
        totalSpent: Number(grant.spentAmount),
        available: Number(grant.totalBudget) - Number(grant.committedAmount) - Number(grant.spentAmount),
        budgetLines: (grant as any).budgetLines ?? [],
        utilizationPercent: Number(grant.totalBudget) > 0
          ? ((Number(grant.committedAmount) + Number(grant.spentAmount)) / Number(grant.totalBudget)) * 100
          : 0,
      },
    };
  }

  async getBudgetVsActual(grantId?: string) {
    const where: any = { deletedAt: null, ...(grantId && { id: grantId }) };
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
}
