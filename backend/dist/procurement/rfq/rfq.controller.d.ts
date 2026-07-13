import { RfqService } from './rfq.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class RfqController {
    private readonly svc;
    constructor(svc: RfqService);
    findAll(q: any): Promise<{
        data: ({
            _count: {
                vendors: number;
            };
            grant: {
                name: string;
                id: string;
                code: string;
            };
            pr: {
                id: string;
                serialNumber: string;
                title: string;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.RfqStatus;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            createdById: string | null;
            title: string;
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
    create(dto: any, user: UserPayload): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RfqStatus;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        createdById: string | null;
        title: string;
        procurementMethodId: string | null;
        prId: string;
        issuedDate: Date | null;
        submissionDeadline: Date;
        openingDate: Date | null;
    }>;
    findOne(id: string): Promise<{
        grant: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.GrantStatus;
            deletedAt: Date | null;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            targetBeneficiaries: number | null;
            currency: string;
            createdById: string | null;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            startDate: Date;
            endDate: Date;
            signedDate: Date | null;
            objectives: string | null;
            conditions: string | null;
            coverageArea: string | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
        pr: {
            items: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                budgetLineId: string | null;
                prId: string;
                unit: string;
                quantity: import(".prisma/client/runtime/library").Decimal;
                specification: string | null;
                estimatedUnitPrice: import(".prisma/client/runtime/library").Decimal;
                totalEstimated: import(".prisma/client/runtime/library").Decimal;
            }[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.DocumentStatus;
            deletedAt: Date | null;
            serialNumber: string;
            grantId: string;
            currency: string;
            workflowInstanceId: string | null;
            appItemId: string | null;
            activityId: string | null;
            budgetLineId: string | null;
            title: string;
            requestedById: string;
            departmentId: string | null;
            procurementMethodId: string | null;
            totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
            requiredByDate: Date | null;
            justification: string | null;
        };
        vendors: ({
            vendor: {
                name: string;
                id: string;
                email: string | null;
                rating: import(".prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string | null;
            notes: string | null;
            rfqId: string;
            vendorId: string;
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
            weight: import(".prisma/client/runtime/library").Decimal;
            score: import(".prisma/client/runtime/library").Decimal;
            weightedScore: import(".prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RfqStatus;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        createdById: string | null;
        title: string;
        procurementMethodId: string | null;
        prId: string;
        issuedDate: Date | null;
        submissionDeadline: Date;
        openingDate: Date | null;
    }>;
    issue(id: string, user: UserPayload): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.RfqStatus;
        deletedAt: Date | null;
        serialNumber: string;
        grantId: string;
        createdById: string | null;
        title: string;
        procurementMethodId: string | null;
        prId: string;
        issuedDate: Date | null;
        submissionDeadline: Date;
        openingDate: Date | null;
    }>;
    invite(id: string, body: {
        vendorId: string;
    }, user: UserPayload): Promise<{
        vendor: {
            name: string;
            id: string;
            email: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string | null;
        notes: string | null;
        rfqId: string;
        vendorId: string;
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
    }>;
    updateQuotation(id: string, rfqVendorId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string | null;
        notes: string | null;
        rfqId: string;
        vendorId: string;
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
    }>;
    award(id: string, rfqVendorId: string, user: UserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string | null;
        notes: string | null;
        rfqId: string;
        vendorId: string;
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
    }>;
    comparison(id: string): Promise<{
        rfq: {
            id: string;
            serialNumber: string;
            title: string;
        };
        vendors: ({
            vendor: {
                name: string;
                id: string;
                email: string | null;
                rating: import(".prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string | null;
            notes: string | null;
            rfqId: string;
            vendorId: string;
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
        })[];
    }>;
}
