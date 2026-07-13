import { RequisitionsService } from './requisitions.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class RequisitionsController {
    private readonly svc;
    constructor(svc: RequisitionsService);
    findAll(query: any, user: UserPayload): Promise<{
        data: ({
            _count: {
                items: number;
            };
            grant: {
                name: string;
                id: string;
                code: string;
            };
            procurementMethod: {
                name: string;
                id: string;
                code: string;
            } | null;
            requestedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    create(dto: any, user: UserPayload): Promise<{
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
        requestedBy: {
            firstName: string;
            lastName: string;
        };
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
        workflow: ({
            steps: ({
                digitalSignature: {
                    userId: string;
                    id: string;
                    createdAt: Date;
                    action: string;
                    documentType: string;
                    documentId: string;
                    ipAddress: string;
                    userAgent: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                status: import(".prisma/client").$Enums.StepStatus;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                comment: string | null;
                digitalSignatureId: string | null;
            })[];
            actions: ({
                actor: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                id: string;
                action: import(".prisma/client").$Enums.WorkflowAction;
                instanceId: string;
                comment: string | null;
                digitalSignatureId: string | null;
                actionAt: Date;
                instanceStepId: string | null;
                actorId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            templateId: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        }) | null;
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
        activity: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ActivityStatus;
            deletedAt: Date | null;
            createdById: string | null;
            code: string;
            startDate: Date;
            endDate: Date;
            projectId: string;
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            responsibleUserId: string | null;
        } | null;
        procurementMethod: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            code: string;
            minThreshold: import(".prisma/client/runtime/library").Decimal;
            maxThreshold: import(".prisma/client/runtime/library").Decimal | null;
            minVendors: number;
            requiresCommittee: boolean;
        } | null;
        requestedBy: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
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
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
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
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
    submit(id: string, user: UserPayload): Promise<{
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
    }>;
    approve(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                status: import(".prisma/client").$Enums.StepStatus;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            templateId: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
    }>;
    reject(id: string, body: {
        comment: string;
    }, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                status: import(".prisma/client").$Enums.StepStatus;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            templateId: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
    }>;
    return_(id: string, body: {
        comment: string;
    }, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                status: import(".prisma/client").$Enums.StepStatus;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            templateId: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
    }>;
    getItems(id: string): Promise<{
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
    }[]>;
    addItem(id: string, dto: any): Promise<{
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
    }>;
}
