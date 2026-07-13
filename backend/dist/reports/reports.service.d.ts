import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getExecutiveDashboard(): Promise<{
        data: {
            kpis: {
                activeGrants: number;
                totalBudget: number;
                totalSpent: number;
                pendingPRs: number;
                pendingPOs: number;
                pendingPayments: number;
            };
        };
    }>;
    getFinanceDashboard(): Promise<{
        data: {
            paymentVouchers: {
                currency: string;
                exchangeRate: import(".prisma/client/runtime/library").Decimal;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                description: string;
                createdById: string | null;
                status: import(".prisma/client").$Enums.DocumentStatus;
                grantId: string;
                workflowInstanceId: string | null;
                serialNumber: string;
                reference: string | null;
                payeeName: string;
                paymentRequestId: string | null;
                payeeType: import(".prisma/client").$Enums.PayeeType;
                payeeId: string | null;
                paymentDate: Date;
                amount: import(".prisma/client/runtime/library").Decimal;
                baseAmount: import(".prisma/client/runtime/library").Decimal;
            }[];
            draftJournalEntries: number;
            bankAccounts: {
                currency: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                notes: string | null;
                accountName: string;
                bankName: string;
                accountNumber: string;
                iban: string | null;
                swiftCode: string | null;
                currentBalance: import(".prisma/client/runtime/library").Decimal;
                glAccountId: string | null;
            }[];
        };
    }>;
    getProcurementDashboard(): Promise<{
        data: {
            prsByStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PurchaseRequisitionGroupByOutputType, "status"[]> & {
                _count: {
                    id: number;
                };
            })[];
            posByStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PurchaseOrderGroupByOutputType, "status"[]> & {
                _count: {
                    id: number;
                };
            })[];
            activeVendors: number;
        };
    }>;
    getGrantStatement(grantId: string): Promise<{
        data: null;
    } | {
        data: {
            grant: {
                id: string;
                code: string;
                name: string;
                donorId: string;
            };
            totalBudget: number;
            totalCommitted: number;
            totalSpent: number;
            available: number;
            budgetLines: any;
            utilizationPercent: number;
        };
    }>;
    getBudgetVsActual(grantId?: string): Promise<{
        data: {
            available: number;
            utilizationPercent: number;
            id: string;
            name: string;
            code: string;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
        }[];
    }>;
}
