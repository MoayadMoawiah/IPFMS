import { JournalEntriesService } from './journal-entries.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class JournalEntriesController {
    private readonly svc;
    constructor(svc: JournalEntriesService);
    findAll(q: any): Promise<{
        data: ({
            _count: {
                lines: number;
            };
            grant: {
                id: string;
                code: string;
            } | null;
            period: {
                name: string;
                id: string;
            };
        } & {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.JournalStatus;
            serialNumber: string;
            grantId: string | null;
            currency: string;
            reference: string | null;
            createdById: string | null;
            isPosted: boolean;
            postedAt: Date | null;
            entryDate: Date;
            sourceType: import(".prisma/client").$Enums.JournalSource;
            sourceId: string | null;
            periodId: string;
            totalDebit: import(".prisma/client/runtime/library").Decimal;
            totalCredit: import(".prisma/client/runtime/library").Decimal;
            postedById: string | null;
            isReversed: boolean;
            reversedById: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: any, user: UserPayload): Promise<{
        lines: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            grantId: string | null;
            currency: string;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            activityId: string | null;
            budgetLineId: string | null;
            journalEntryId: string;
            debitAmount: import(".prisma/client/runtime/library").Decimal;
            creditAmount: import(".prisma/client/runtime/library").Decimal;
            baseDebit: import(".prisma/client/runtime/library").Decimal;
            baseCredit: import(".prisma/client/runtime/library").Decimal;
            lineNumber: number;
            accountId: string;
        }[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JournalStatus;
        serialNumber: string;
        grantId: string | null;
        currency: string;
        reference: string | null;
        createdById: string | null;
        isPosted: boolean;
        postedAt: Date | null;
        entryDate: Date;
        sourceType: import(".prisma/client").$Enums.JournalSource;
        sourceId: string | null;
        periodId: string;
        totalDebit: import(".prisma/client/runtime/library").Decimal;
        totalCredit: import(".prisma/client/runtime/library").Decimal;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
    trialBalance(periodId: string, grantId: string): Promise<{
        data: {
            accounts: any[];
            totals: {
                totalDebit: any;
                totalCredit: any;
                isBalanced: boolean;
            };
        };
    }>;
    findOne(id: string): Promise<{
        grant: {
            name: string;
            id: string;
            code: string;
        } | null;
        period: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PeriodStatus;
            fiscalYearId: string;
            startDate: Date;
            endDate: Date;
            periodNumber: number;
            closedById: string | null;
            closedAt: Date | null;
        };
        postedBy: {
            firstName: string;
            lastName: string;
        } | null;
        lines: ({
            account: {
                name: string;
                id: string;
                code: string;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            grantId: string | null;
            currency: string;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            activityId: string | null;
            budgetLineId: string | null;
            journalEntryId: string;
            debitAmount: import(".prisma/client/runtime/library").Decimal;
            creditAmount: import(".prisma/client/runtime/library").Decimal;
            baseDebit: import(".prisma/client/runtime/library").Decimal;
            baseCredit: import(".prisma/client/runtime/library").Decimal;
            lineNumber: number;
            accountId: string;
        })[];
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JournalStatus;
        serialNumber: string;
        grantId: string | null;
        currency: string;
        reference: string | null;
        createdById: string | null;
        isPosted: boolean;
        postedAt: Date | null;
        entryDate: Date;
        sourceType: import(".prisma/client").$Enums.JournalSource;
        sourceId: string | null;
        periodId: string;
        totalDebit: import(".prisma/client/runtime/library").Decimal;
        totalCredit: import(".prisma/client/runtime/library").Decimal;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
    post(id: string, user: UserPayload): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JournalStatus;
        serialNumber: string;
        grantId: string | null;
        currency: string;
        reference: string | null;
        createdById: string | null;
        isPosted: boolean;
        postedAt: Date | null;
        entryDate: Date;
        sourceType: import(".prisma/client").$Enums.JournalSource;
        sourceId: string | null;
        periodId: string;
        totalDebit: import(".prisma/client/runtime/library").Decimal;
        totalCredit: import(".prisma/client/runtime/library").Decimal;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
    reverse(id: string, user: UserPayload): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.JournalStatus;
        serialNumber: string;
        grantId: string | null;
        currency: string;
        reference: string | null;
        createdById: string | null;
        isPosted: boolean;
        postedAt: Date | null;
        entryDate: Date;
        sourceType: import(".prisma/client").$Enums.JournalSource;
        sourceId: string | null;
        periodId: string;
        totalDebit: import(".prisma/client/runtime/library").Decimal;
        totalCredit: import(".prisma/client/runtime/library").Decimal;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
}
