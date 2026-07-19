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
                currency: string;
                exchangeRate: import(".prisma/client/runtime/library").Decimal;
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                createdById: string | null;
                status: import(".prisma/client").$Enums.DocumentStatus;
                serialNumber: string;
                grantId: string;
                workflowInstanceId: string | null;
                paymentRequestId: string | null;
                payeeType: import(".prisma/client").$Enums.PayeeType;
                payeeId: string | null;
                payeeName: string;
                paymentDate: Date;
                amount: import(".prisma/client/runtime/library").Decimal;
                baseAmount: import(".prisma/client/runtime/library").Decimal;
                reference: string | null;
            }[];
            draftJournalEntries: number;
            bankAccounts: {
                currency: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                notes: string | null;
                bankName: string;
                accountName: string;
                accountNumber: string;
                iban: string | null;
                swiftCode: string | null;
                currentBalance: import(".prisma/client/runtime/library").Decimal;
                glAccountId: string | null;
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
            id: string;
            name: string;
            code: string;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
