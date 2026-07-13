import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { GrantsService } from '../../grants/grants.service';
import { Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class RequisitionsService {
    private readonly prisma;
    private readonly workflowSvc;
    private readonly serialSvc;
    private readonly auditSvc;
    private readonly grantsSvc;
    constructor(prisma: PrismaService, workflowSvc: WorkflowService, serialSvc: SerialService, auditSvc: AuditService, grantsSvc: GrantsService);
    findAll(query: any, user: UserPayload): Promise<{
        data: ({
            grant: {
                id: string;
                name: string;
                code: string;
            };
            procurementMethod: {
                id: string;
                name: string;
                code: string;
            } | null;
            _count: {
                items: number;
            };
            requestedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
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
        activity: {
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
            status: import(".prisma/client").$Enums.ActivityStatus;
            progressPercent: Prisma.Decimal;
            projectId: string;
            plannedBudget: Prisma.Decimal;
            actualSpent: Prisma.Decimal;
            responsibleUserId: string | null;
        } | null;
        procurementMethod: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            code: string;
            minThreshold: Prisma.Decimal;
            maxThreshold: Prisma.Decimal | null;
            minVendors: number;
            requiresCommittee: boolean;
        } | null;
        workflow: ({
            steps: ({
                digitalSignature: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    ipAddress: string;
                    userAgent: string;
                    action: string;
                    documentType: string;
                    documentId: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                } | null;
            } & {
                comment: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                stepNumber: number;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                digitalSignatureId: string | null;
                instanceId: string;
            })[];
            actions: ({
                actor: {
                    firstName: string;
                    lastName: string;
                };
            } & {
                comment: string | null;
                id: string;
                action: import(".prisma/client").$Enums.WorkflowAction;
                digitalSignatureId: string | null;
                instanceId: string;
                actionAt: Date;
                instanceStepId: string | null;
                actorId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            templateId: string;
        }) | null;
        requestedBy: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
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
    }>;
    create(dto: any, user: UserPayload): Promise<{
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
        requestedBy: {
            firstName: string;
            lastName: string;
        };
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
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
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
    }>;
    submit(id: string, user: UserPayload): Promise<{
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
    }>;
    approve(id: string, comment: string | undefined, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                comment: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                stepNumber: number;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                digitalSignatureId: string | null;
                instanceId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            templateId: string;
        };
    }>;
    reject(id: string, comment: string, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                comment: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                stepNumber: number;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                digitalSignatureId: string | null;
                instanceId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            templateId: string;
        };
    }>;
    return_(id: string, comment: string, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                comment: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                action: string | null;
                stepNumber: number;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                digitalSignatureId: string | null;
                instanceId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            templateId: string;
        };
    }>;
    private processWorkflowAction;
    softDelete(id: string, user: UserPayload): Promise<void>;
    getItems(prId: string): Promise<{
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
    }[]>;
    addItem(prId: string, dto: any): Promise<{
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
    }>;
}
