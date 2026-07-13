import { ChartOfAccountsService } from './chart-of-accounts.service';
export declare class ChartOfAccountsController {
    private readonly svc;
    constructor(svc: ChartOfAccountsService);
    findAll(q: any): Promise<{
        data: ({
            parent: {
                name: string;
                id: string;
                code: string;
            } | null;
        } & {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            isActive: boolean;
            code: string;
            parentId: string | null;
            arabicName: string | null;
            accountType: import(".prisma/client").$Enums.AccountType;
            level: number;
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
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        code: string;
        parentId: string | null;
        arabicName: string | null;
        accountType: import(".prisma/client").$Enums.AccountType;
        level: number;
        isLeaf: boolean;
        normalBalance: import(".prisma/client").$Enums.NormalBalance;
    }>;
    findOne(id: string): Promise<{
        parent: {
            name: string;
            id: string;
            code: string;
        } | null;
        children: {
            name: string;
            id: string;
            code: string;
            isLeaf: boolean;
        }[];
    } & {
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        code: string;
        parentId: string | null;
        arabicName: string | null;
        accountType: import(".prisma/client").$Enums.AccountType;
        level: number;
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    update(id: string, dto: any): Promise<{
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        code: string;
        parentId: string | null;
        arabicName: string | null;
        accountType: import(".prisma/client").$Enums.AccountType;
        level: number;
        isLeaf: boolean;
        normalBalance: import(".prisma/client").$Enums.NormalBalance;
    }>;
    remove(id: string): Promise<void>;
}
