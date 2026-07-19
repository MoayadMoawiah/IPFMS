import { PrismaService } from '../../prisma/prisma.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { Prisma } from '@prisma/client';
export declare class JournalEntriesService {
    private readonly prisma;
    private readonly serialSvc;
    private readonly auditSvc;
    constructor(prisma: PrismaService, serialSvc: SerialService, auditSvc: AuditService);
    findAll(query: any): Promise<{
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
            totalDebit: Prisma.Decimal;
            totalCredit: Prisma.Decimal;
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
            exchangeRate: Prisma.Decimal;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            grantId: string | null;
            activityId: string | null;
            budgetLineId: string | null;
            journalEntryId: string;
            accountId: string;
            debitAmount: Prisma.Decimal;
            creditAmount: Prisma.Decimal;
            baseDebit: Prisma.Decimal;
            baseCredit: Prisma.Decimal;
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
        totalDebit: Prisma.Decimal;
        totalCredit: Prisma.Decimal;
        isPosted: boolean;
        postedAt: Date | null;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
    create(dto: any, user: UserPayload): Promise<{
        lines: {
            currency: string;
            exchangeRate: Prisma.Decimal;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            grantId: string | null;
            activityId: string | null;
            budgetLineId: string | null;
            journalEntryId: string;
            accountId: string;
            debitAmount: Prisma.Decimal;
            creditAmount: Prisma.Decimal;
            baseDebit: Prisma.Decimal;
            baseCredit: Prisma.Decimal;
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
        totalDebit: Prisma.Decimal;
        totalCredit: Prisma.Decimal;
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
        totalDebit: Prisma.Decimal;
        totalCredit: Prisma.Decimal;
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
        totalDebit: Prisma.Decimal;
        totalCredit: Prisma.Decimal;
        isPosted: boolean;
        postedAt: Date | null;
        postedById: string | null;
        isReversed: boolean;
        reversedById: string | null;
    }>;
    getTrialBalance(periodId?: string, grantId?: string): Promise<{
        data: {
            accounts: any[];
            totals: {
                totalDebit: any;
                totalCredit: any;
                isBalanced: boolean;
            };
        };
    }>;
}
