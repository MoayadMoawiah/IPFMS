import { RfqService } from './rfq.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class RfqController {
    private readonly svc;
    constructor(svc: RfqService);
    findAll(q: any): Promise<{
        data: ({
            grant: {
                id: string;
                name: string;
                code: string;
            };
            _count: {
                pafForms: number;
                vendors: number;
            };
            pr: {
                id: string;
                title: string;
                serialNumber: string;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            deletedAt: Date | null;
            createdById: string | null;
            status: import(".prisma/client").$Enums.RfqStatus;
            serialNumber: string;
            grantId: string;
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
        title: string;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.RfqStatus;
        serialNumber: string;
        grantId: string;
        procurementMethodId: string | null;
        prId: string;
        issuedDate: Date | null;
        submissionDeadline: Date;
        openingDate: Date | null;
    }>;
    findOne(id: string): Promise<{
        grant: {
            currency: string;
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            startDate: Date;
            endDate: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.GrantStatus;
            conditions: string | null;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            signedDate: Date | null;
            objectives: string | null;
            reportingRequirements: string | null;
            targetBeneficiaries: number | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
            coverageArea: string | null;
        };
        pr: {
            items: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                budgetLineId: string | null;
                prId: string;
                specification: string | null;
                unit: string;
                quantity: import(".prisma/client/runtime/library").Decimal;
                estimatedUnitPrice: import(".prisma/client/runtime/library").Decimal;
                totalEstimated: import(".prisma/client/runtime/library").Decimal;
            }[];
        } & {
            currency: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            departmentId: string | null;
            deletedAt: Date | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            appItemId: string | null;
            grantId: string;
            activityId: string | null;
            budgetLineId: string | null;
            requestedById: string;
            procurementMethodId: string | null;
            totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
            requiredByDate: Date | null;
            justification: string | null;
            workflowInstanceId: string | null;
        };
        vendors: ({
            vendor: {
                id: string;
                name: string;
                email: string | null;
                rating: import(".prisma/client/runtime/library").Decimal;
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
        })[];
        evaluations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rfqId: string;
            notes: string | null;
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
        title: string;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.RfqStatus;
        serialNumber: string;
        grantId: string;
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
        title: string;
        deletedAt: Date | null;
        createdById: string | null;
        status: import(".prisma/client").$Enums.RfqStatus;
        serialNumber: string;
        grantId: string;
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
    }>;
    updateQuotation(id: string, rfqVendorId: string, dto: any): Promise<{
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
    }>;
    award(id: string, rfqVendorId: string, user: UserPayload): Promise<{
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
    }>;
    comparison(id: string): Promise<{
        rfq: {
            id: string;
            serialNumber: string;
            title: string;
        };
        vendors: ({
            vendor: {
                id: string;
                name: string;
                email: string | null;
                rating: import(".prisma/client/runtime/library").Decimal;
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
        })[];
    }>;
}
