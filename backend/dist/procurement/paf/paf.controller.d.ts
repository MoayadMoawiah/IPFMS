import { PafService } from './paf.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class PafController {
    private readonly svc;
    constructor(svc: PafService);
    findAll(q: {
        rfqId?: string;
        prId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            rfq: {
                id: string;
                status: import(".prisma/client").$Enums.RfqStatus;
                serialNumber: string;
                title: string;
            };
            rfqVendor: ({
                vendor: {
                    id: string;
                    name: string;
                };
            } & {
                currency: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                rfqId: string;
                vendorId: string;
                notes: string | null;
                fileUrl: string | null;
                invitedAt: Date;
                respondedAt: Date | null;
                quotedAmount: import(".prisma/client/runtime/library").Decimal | null;
                deliveryDays: number | null;
                warrantyTerms: string | null;
                technicalScore: import(".prisma/client/runtime/library").Decimal;
                financialScore: import(".prisma/client/runtime/library").Decimal;
                committeeScore: import(".prisma/client/runtime/library").Decimal;
                totalScore: import(".prisma/client/runtime/library").Decimal;
                isShortlisted: boolean;
                isWinner: boolean;
            }) | null;
            pr: {
                id: string;
                serialNumber: string;
                title: string;
            };
        } & {
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            justification: string;
            workflowInstanceId: string | null;
            prId: string;
            rfqId: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            rfqVendorId: string | null;
            recommendedVendorId: string | null;
            committeeMembers: import(".prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: {
        rfqId: string;
        rfqVendorId: string;
        justification: string;
        committeeMembers?: {
            name: string;
            role: string;
        }[];
    }, user: UserPayload): Promise<{
        rfq: {
            id: string;
            serialNumber: string;
            title: string;
        };
        rfqVendor: ({
            vendor: {
                id: string;
                name: string;
            };
        } & {
            currency: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rfqId: string;
            vendorId: string;
            notes: string | null;
            fileUrl: string | null;
            invitedAt: Date;
            respondedAt: Date | null;
            quotedAmount: import(".prisma/client/runtime/library").Decimal | null;
            deliveryDays: number | null;
            warrantyTerms: string | null;
            technicalScore: import(".prisma/client/runtime/library").Decimal;
            financialScore: import(".prisma/client/runtime/library").Decimal;
            committeeScore: import(".prisma/client/runtime/library").Decimal;
            totalScore: import(".prisma/client/runtime/library").Decimal;
            isShortlisted: boolean;
            isWinner: boolean;
        }) | null;
    } & {
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        justification: string;
        workflowInstanceId: string | null;
        prId: string;
        rfqId: string;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        rfqVendorId: string | null;
        recommendedVendorId: string | null;
        committeeMembers: import(".prisma/client/runtime/library").JsonValue | null;
    }>;
    findOne(id: string): Promise<{
        rfq: {
            id: string;
            status: import(".prisma/client").$Enums.RfqStatus;
            serialNumber: string;
            title: string;
            prId: string;
        };
        rfqVendor: ({
            vendor: {
                id: string;
                name: string;
                email: string | null;
            };
        } & {
            currency: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rfqId: string;
            vendorId: string;
            notes: string | null;
            fileUrl: string | null;
            invitedAt: Date;
            respondedAt: Date | null;
            quotedAmount: import(".prisma/client/runtime/library").Decimal | null;
            deliveryDays: number | null;
            warrantyTerms: string | null;
            technicalScore: import(".prisma/client/runtime/library").Decimal;
            financialScore: import(".prisma/client/runtime/library").Decimal;
            committeeScore: import(".prisma/client/runtime/library").Decimal;
            totalScore: import(".prisma/client/runtime/library").Decimal;
            isShortlisted: boolean;
            isWinner: boolean;
        }) | null;
        pr: {
            id: string;
            serialNumber: string;
            title: string;
        };
    } & {
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        justification: string;
        workflowInstanceId: string | null;
        prId: string;
        rfqId: string;
        totalAmount: import(".prisma/client/runtime/library").Decimal;
        rfqVendorId: string | null;
        recommendedVendorId: string | null;
        committeeMembers: import(".prisma/client/runtime/library").JsonValue | null;
    }>;
}
