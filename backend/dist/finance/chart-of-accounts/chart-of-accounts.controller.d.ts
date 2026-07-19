import { ChartOfAccountsService } from './chart-of-accounts.service';
export declare class ChartOfAccountsController {
    private readonly svc;
    constructor(svc: ChartOfAccountsService);
    findAll(q: any): Promise<{
        data: ({
            parent: {
                id: string;
                name: string;
                code: string;
            } | null;
        } & {
            level: number;
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            arabicName: string | null;
            isActive: boolean;
            deletedAt: Date | null;
            parentId: string | null;
            code: string;
            accountType: import(".prisma/client").$Enums.AccountType;
            isLeaf: boolean;
            normalBalance: import(".prisma/client").$Enums.NormalBalance;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTree(): Promise<{
        data: any[];
    }>;
    create(dto: any): Promise<{
        level: number;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        arabicName: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        parentId: string | null;
        code: string;
        accountType: import(".prisma/client").$Enums.AccountType;
        isLeaf: boolean;
        normalBalance: import(".prisma/client").$Enums.NormalBalance;
    }>;
    findOne(id: string): Promise<{
        parent: {
            id: string;
            name: string;
            code: string;
        } | null;
        children: {
            id: string;
            name: string;
            code: string;
            isLeaf: boolean;
        }[];
    } & {
        level: number;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        arabicName: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        parentId: string | null;
        code: string;
        accountType: import(".prisma/client").$Enums.AccountType;
        isLeaf: boolean;
        normalBalance: import(".prisma/client").$Enums.NormalBalance;
    }>;
    getLedger(id: string, q: any): Promise<{
        data: ({
            journalEntry: {
                description: string;
                serialNumber: string;
                entryDate: Date;
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(id: string, dto: any): Promise<{
        level: number;
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        arabicName: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        parentId: string | null;
        code: string;
        accountType: import(".prisma/client").$Enums.AccountType;
        isLeaf: boolean;
        normalBalance: import(".prisma/client").$Enums.NormalBalance;
    }>;
    remove(id: string): Promise<void>;
}
