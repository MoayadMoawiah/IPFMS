import { JournalEntriesService } from './journal-entries.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class JournalEntriesController {
    private readonly svc;
    constructor(svc: JournalEntriesService);
    findAll(q: any): Promise<{
        data: ({
            grant: {
                id: string;
                code: string;
            } | null;
            _count: {
                lines: number;
            };
            period: {
                id: string;
                name: string;
            };
        } & {
            currency: string;
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.JournalStatus;
            serialNumber: string;
            grantId: string | null;
            reference: string | null;
            entryDate: Date;
            sourceType: import(".prisma/client").$Enums.JournalSource;
            sourceId: string | null;
            periodId: string;
            totalDebit: import(".prisma/client/runtime/library").Decimal;
            totalCredit: import(".prisma/client/runtime/library").Decimal;
            isPosted: boolean;
            postedAt: Date | null;
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
            currency: string;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            grantId: string | null;
            activityId: string | null;
            budgetLineId: string | null;
            journalEntryId: string;
            accountId: string;
            debitAmount: import(".prisma/client/runtime/library").Decimal;
            creditAmount: import(".prisma/client/runtime/library").Decimal;
            baseDebit: import(".prisma/client/runtime/library").Decimal;
            baseCredit: import(".prisma/client/runtime/library").Decimal;
            lineNumber: number;
        }[];
    } & {
        currency: string;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.JournalStatus;
        serialNumber: string;
        grantId: string | null;
        reference: string | null;
        entryDate: Date;
        sourceType: import(".prisma/client").$Enums.JournalSource;
        sourceId: string | null;
        periodId: string;
        totalDebit: import(".prisma/client/runtime/library").Decimal;
        totalCredit: import(".prisma/client/runtime/library").Decimal;
        isPosted: boolean;
        postedAt: Date | null;
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
            id: string;
            name: string;
            code: string;
        } | null;
        period: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            startDate: Date;
            endDate: Date;
            status: import(".prisma/client").$Enums.PeriodStatus;
            fiscalYearId: string;
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
                id: string;
                name: string;
                code: string;
            };
        } & {
            currency: string;
            exchangeRate: import(".prisma/client/runtime/library").Decimal;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            grantId: string | null;
            activityId: string | null;
            budgetLineId: string | null;
            journalEntryId: string;
            accountId: string;
            debitAmount: import(".prisma/client/runtime/library").Decimal;
            creditAmount: import(".prisma/client/runtime/library").Decimal;
            baseDebit: import(".prisma/client/runtime/library").Decimal;
            baseCredit: import(".prisma/client/runtime/library").Decimal;
            lineNumber: number;
        })[];
    } & {
        currency: string;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.JournalStatus;
        serialNumber: string;
        grantId: string | null;
        reference: string | null;
        entryDate: Date;
        sourceType: import(".prisma/client").$Enums.JournalSource;
        sourceId: string | null;
        periodId: string;
        totalDebit: import(".prisma/client/runtime/library").Decimal;
        totalCredit: import(".prisma/client/runtime/library").Decimal;
        isPosted: boolean;
        postedAt: Date | null;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
    post(id: string, user: UserPayload): Promise<{
        currency: string;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.JournalStatus;
        serialNumber: string;
        grantId: string | null;
        reference: string | null;
        entryDate: Date;
        sourceType: import(".prisma/client").$Enums.JournalSource;
        sourceId: string | null;
        periodId: string;
        totalDebit: import(".prisma/client/runtime/library").Decimal;
        totalCredit: import(".prisma/client/runtime/library").Decimal;
        isPosted: boolean;
        postedAt: Date | null;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
    reverse(id: string, user: UserPayload): Promise<{
        currency: string;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.JournalStatus;
        serialNumber: string;
        grantId: string | null;
        reference: string | null;
        entryDate: Date;
        sourceType: import(".prisma/client").$Enums.JournalSource;
        sourceId: string | null;
        periodId: string;
        totalDebit: import(".prisma/client/runtime/library").Decimal;
        totalCredit: import(".prisma/client/runtime/library").Decimal;
        isPosted: boolean;
        postedAt: Date | null;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
}
