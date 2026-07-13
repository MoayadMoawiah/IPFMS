import { PrismaService } from '../../prisma/prisma.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { Prisma } from '@prisma/client';
export declare class RfqService {
    private readonly prisma;
    private readonly serialSvc;
    private readonly auditSvc;
    constructor(prisma: PrismaService, serialSvc: SerialService, auditSvc: AuditService);
    findAll(query: any): Promise<{
        data: ({
            grant: {
                id: string;
                name: string;
                code: string;
            };
            _count: {
                vendors: number;
            };
            pr: {
                id: string;
                title: string;
                serialNumber: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.RfqStatus;
            title: string;
            grantId: string;
            serialNumber: string;
            procurementMethodId: string | null;
            prId: string;
            issuedDate: Date | null;
            submissionDeadline: Date;
            openingDate: Date | null;
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
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            description: string | null;
            code: string;
            startDate: Date;
            endDate: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.GrantStatus;
            conditions: string | null;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            signedDate: Date | null;
            objectives: string | null;
            coverageArea: string | null;
            targetBeneficiaries: number | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
        pr: {
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                budgetLineId: string | null;
                specification: string | null;
                unit: string;
                quantity: Prisma.Decimal;
                estimatedUnitPrice: Prisma.Decimal;
                totalEstimated: Prisma.Decimal;
                prId: string;
            }[];
        } & {
            currency: string;
            id: string;
            departmentId: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            title: string;
            grantId: string;
            activityId: string | null;
            workflowInstanceId: string | null;
            serialNumber: string;
            appItemId: string | null;
            budgetLineId: string | null;
            requestedById: string;
            procurementMethodId: string | null;
            totalEstimatedAmount: Prisma.Decimal;
            requiredByDate: Date | null;
            justification: string | null;
        };
        vendors: ({
            vendor: {
                id: string;
                email: string | null;
                name: string;
                rating: Prisma.Decimal;
            };
        } & {
            currency: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            fileUrl: string | null;
            vendorId: string;
            rfqId: string;
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
        })[];
        evaluations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            rfqId: string;
            rfqVendorId: string;
            evaluatorId: string;
            criteriaName: string;
            weight: Prisma.Decimal;
            score: Prisma.Decimal;
            weightedScore: Prisma.Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.RfqStatus;
        title: string;
        grantId: string;
        serialNumber: string;
        procurementMethodId: string | null;
        prId: string;
        issuedDate: Date | null;
        submissionDeadline: Date;
        openingDate: Date | null;
    }>;
    create(dto: any, user: UserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.RfqStatus;
        title: string;
        grantId: string;
        serialNumber: string;
        procurementMethodId: string | null;
        prId: string;
        issuedDate: Date | null;
        submissionDeadline: Date;
        openingDate: Date | null;
    }>;
    issue(id: string, user: UserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.RfqStatus;
        title: string;
        grantId: string;
        serialNumber: string;
        procurementMethodId: string | null;
        prId: string;
        issuedDate: Date | null;
        submissionDeadline: Date;
        openingDate: Date | null;
    }>;
    inviteVendor(rfqId: string, vendorId: string, user: UserPayload): Promise<{
        vendor: {
            id: string;
            email: string | null;
            name: string;
        };
    } & {
        currency: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        fileUrl: string | null;
        vendorId: string;
        rfqId: string;
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
    }>;
    updateVendorQuotation(rfqId: string, rfqVendorId: string, dto: any): Promise<{
        currency: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        fileUrl: string | null;
        vendorId: string;
        rfqId: string;
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
    }>;
    awardVendor(rfqId: string, rfqVendorId: string, user: UserPayload): Promise<{
        currency: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        fileUrl: string | null;
        vendorId: string;
        rfqId: string;
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
    }>;
    getComparison(id: string): Promise<{
        rfq: {
            id: string;
            serialNumber: string;
            title: string;
        };
        vendors: ({
            vendor: {
                id: string;
                email: string | null;
                name: string;
                rating: Prisma.Decimal;
            };
        } & {
            currency: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            fileUrl: string | null;
            vendorId: string;
            rfqId: string;
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
        })[];
    }>;
}
