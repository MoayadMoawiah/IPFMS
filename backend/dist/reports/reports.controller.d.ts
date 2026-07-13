import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly svc;
    constructor(svc: ReportsService);
    executive(): Promise<{
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
    finance(): Promise<{
        data: {
            paymentVouchers: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.DocumentStatus;
                deletedAt: Date | null;
                serialNumber: string;
                paymentRequestId: string | null;
                grantId: string;
                payeeType: import(".prisma/client").$Enums.PayeeType;
                payeeId: string | null;
                payeeName: string;
                paymentDate: Date;
                currency: string;
                amount: import(".prisma/client/runtime/library").Decimal;
                exchangeRate: import(".prisma/client/runtime/library").Decimal;
                baseAmount: import(".prisma/client/runtime/library").Decimal;
                reference: string | null;
                workflowInstanceId: string | null;
                createdById: string | null;
            }[];
            draftJournalEntries: number;
            bankAccounts: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                currency: string;
                accountName: string;
                bankName: string;
                accountNumber: string;
                iban: string | null;
                swiftCode: string | null;
                currentBalance: import(".prisma/client/runtime/library").Decimal;
                glAccountId: string | null;
                isActive: boolean;
                notes: string | null;
            }[];
        };
    }>;
    procurement(): Promise<{
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
    budgetVsActual(grantId: string): Promise<{
        data: {
            available: number;
            utilizationPercent: number;
            name: string;
            id: string;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            code: string;
        }[];
    }>;
    grantStatement(grantId: string): Promise<{
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
}
