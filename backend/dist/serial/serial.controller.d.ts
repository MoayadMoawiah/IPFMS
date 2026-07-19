import { SerialService } from './serial.service';
declare class NextSerialDto {
    grantCode: string;
    docType: string;
    padding?: number;
}
export declare class SerialController {
    private readonly serialService;
    constructor(serialService: SerialService);
    next(dto: NextSerialDto): Promise<{
        data: {
            serialNumber: string;
        };
    }>;
    preview(grantCode: string, docType: string, padding?: number): Promise<{
        data: {
            preview: string;
        };
    }>;
    getAllSequences(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        format: string;
        grantCode: string;
        docType: import(".prisma/client").$Enums.ProcurementDocType;
        lastNumber: number;
        prefix: string | null;
    }[]>;
    getGrantSequences(grantCode: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        format: string;
        grantCode: string;
        docType: import(".prisma/client").$Enums.ProcurementDocType;
        lastNumber: number;
        prefix: string | null;
    }[]>;
}
export {};
