import { PrismaService } from '../prisma/prisma.service';
import { ProcurementDocType } from '@prisma/client';
export declare class SerialService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    next(grantCode: string, docType: ProcurementDocType | string, padding?: number): Promise<string>;
    preview(grantCode: string, docType: string, padding?: number): Promise<string>;
    getGrantSequences(grantCode: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        grantCode: string;
        docType: import(".prisma/client").$Enums.ProcurementDocType;
        lastNumber: number;
        prefix: string | null;
        format: string;
    }[]>;
    getAllSequences(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        grantCode: string;
        docType: import(".prisma/client").$Enums.ProcurementDocType;
        lastNumber: number;
        prefix: string | null;
        format: string;
    }[]>;
    resetSequence(grantCode: string, docType: string): Promise<void>;
    private computeLockKey;
}
