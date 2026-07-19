import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { Prisma } from '@prisma/client';
export declare class PafService {
    private readonly prisma;
    private readonly auditSvc;
    constructor(prisma: PrismaService, auditSvc: AuditService);
    findAll(query: {
        rfqId?: string;
        prId?: string;
    }): Promise<{
        data: ({
            rfq: {
                id: string;
                title: string;
                status: import(".prisma/client").$Enums.RfqStatus;
                serialNumber: string;
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
                quotedAmount: Prisma.Decimal | null;
                deliveryDays: number | null;
                warrantyTerms: string | null;
                technicalScore: Prisma.Decimal;
                financialScore: Prisma.Decimal;
                committeeScore: Prisma.Decimal;
                totalScore: Prisma.Decimal;
                isShortlisted: boolean;
                isWinner: boolean;
            }) | null;
            pr: {
                id: string;
                title: string;
                serialNumber: string;
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
            totalAmount: Prisma.Decimal;
            rfqVendorId: string | null;
            recommendedVendorId: string | null;
            committeeMembers: Prisma.JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        rfq: {
            id: string;
            title: string;
            status: import(".prisma/client").$Enums.RfqStatus;
            serialNumber: string;
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
            quotedAmount: Prisma.Decimal | null;
            deliveryDays: number | null;
            warrantyTerms: string | null;
            technicalScore: Prisma.Decimal;
            financialScore: Prisma.Decimal;
            committeeScore: Prisma.Decimal;
            totalScore: Prisma.Decimal;
            isShortlisted: boolean;
            isWinner: boolean;
        }) | null;
        pr: {
            id: string;
            title: string;
            serialNumber: string;
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
        totalAmount: Prisma.Decimal;
        rfqVendorId: string | null;
        recommendedVendorId: string | null;
        committeeMembers: Prisma.JsonValue | null;
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
            title: string;
            serialNumber: string;
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
            quotedAmount: Prisma.Decimal | null;
            deliveryDays: number | null;
            warrantyTerms: string | null;
            technicalScore: Prisma.Decimal;
            financialScore: Prisma.Decimal;
            committeeScore: Prisma.Decimal;
            totalScore: Prisma.Decimal;
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
        totalAmount: Prisma.Decimal;
        rfqVendorId: string | null;
        recommendedVendorId: string | null;
        committeeMembers: Prisma.JsonValue | null;
    }>;
}
