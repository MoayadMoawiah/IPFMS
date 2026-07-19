import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowService } from '../../workflow/workflow.service';
import { SerialService } from '../../serial/serial.service';
import { AuditService } from '../../audit/audit.service';
import { GrantsService } from '../../grants/grants.service';
import { MinioService } from '../../uploads/minio.service';
import { Prisma } from '@prisma/client';
import { UserPayload } from '../../common/decorators/current-user.decorator';
import { ProcurementRoute } from '../../common/constants/procurement.constants';
import { RfqService } from '../rfq/rfq.service';
export declare class RequisitionsService {
    private readonly prisma;
    private readonly workflowSvc;
    private readonly serialSvc;
    private readonly auditSvc;
    private readonly grantsSvc;
    private readonly minioSvc;
    private readonly rfqSvc;
    constructor(prisma: PrismaService, workflowSvc: WorkflowService, serialSvc: SerialService, auditSvc: AuditService, grantsSvc: GrantsService, minioSvc: MinioService, rfqSvc: RfqService);
    findAll(query: any, user: UserPayload): Promise<{
        data: {
            approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
            grant: {
                id: string;
                name: string;
                code: string;
            };
            _count: {
                items: number;
            };
            procurementMethod: {
                id: string;
                name: string;
                code: string;
            } | null;
            requestedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            serialNumber: string;
            grantId: string;
            budgetLineId: string | null;
            title: string;
            currency: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            workflowInstanceId: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string | null;
            procurementMethodId: string | null;
            justification: string | null;
            appItemId: string | null;
            activityId: string | null;
            requestedById: string;
            departmentId: string | null;
            totalEstimatedAmount: Prisma.Decimal;
            requiredByDate: Date | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, user?: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        procurementRoute: ProcurementRoute;
        grant: {
            id: string;
            currency: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            startDate: Date;
            endDate: Date;
            signedDate: Date | null;
            description: string | null;
            objectives: string | null;
            conditions: string | null;
            coverageArea: string | null;
            targetBeneficiaries: number | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
        workflow: ({
            steps: ({
                digitalSignature: ({
                    user: {
                        id: string;
                        firstName: string;
                        lastName: string;
                        roles: ({
                            role: {
                                id: string;
                                name: string;
                            };
                        } & {
                            userId: string;
                            roleId: string;
                            grantedBy: string | null;
                            grantedAt: Date;
                        })[];
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    documentType: string;
                    userId: string;
                    documentId: string;
                    action: string;
                    ipAddress: string;
                    userAgent: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                }) | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
            })[];
            template: {
                id: string;
            };
            actions: ({
                actor: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    roles: ({
                        role: {
                            id: string;
                            name: string;
                        };
                    } & {
                        userId: string;
                        roleId: string;
                        grantedBy: string | null;
                        grantedAt: Date;
                    })[];
                };
            } & {
                id: string;
                actionAt: Date;
                instanceId: string;
                action: import(".prisma/client").$Enums.WorkflowAction;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceStepId: string | null;
                actorId: string;
            })[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            templateId: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        }) | null;
        items: {
            id: string;
            prId: string;
            budgetLineId: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            specification: string | null;
            unit: string;
            quantity: Prisma.Decimal;
            estimatedUnitPrice: Prisma.Decimal;
            totalEstimated: Prisma.Decimal;
        }[];
        purchaseOrders: {
            id: string;
            serialNumber: string;
            currency: string;
            totalAmount: Prisma.Decimal;
            status: import(".prisma/client").$Enums.DocumentStatus;
            vendor: {
                id: string;
                name: string;
            };
        }[];
        rfqs: {
            id: string;
            serialNumber: string;
            status: import(".prisma/client").$Enums.RfqStatus;
            createdAt: Date;
            submissionDeadline: Date;
        }[];
        procurementMethod: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            code: string;
            description: string | null;
            isActive: boolean;
            minThreshold: Prisma.Decimal;
            maxThreshold: Prisma.Decimal | null;
            minVendors: number;
            requiresCommittee: boolean;
        } | null;
        pafForms: {
            id: string;
            rfqId: string;
            totalAmount: Prisma.Decimal;
            status: import(".prisma/client").$Enums.DocumentStatus;
            recommendedVendorId: string | null;
        }[];
        activity: {
            id: string;
            status: import(".prisma/client").$Enums.ActivityStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            startDate: Date;
            endDate: Date;
            description: string | null;
            projectId: string;
            plannedBudget: Prisma.Decimal;
            actualSpent: Prisma.Decimal;
            progressPercent: Prisma.Decimal;
            responsibleUserId: string | null;
        } | null;
        requestedBy: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: ({
                role: {
                    id: string;
                    name: string;
                };
            } & {
                userId: string;
                roleId: string;
                grantedBy: string | null;
                grantedAt: Date;
            })[];
        };
        id: string;
        serialNumber: string;
        grantId: string;
        budgetLineId: string | null;
        title: string;
        currency: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstanceId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        procurementMethodId: string | null;
        justification: string | null;
        appItemId: string | null;
        activityId: string | null;
        requestedById: string;
        departmentId: string | null;
        totalEstimatedAmount: Prisma.Decimal;
        requiredByDate: Date | null;
    }>;
    create(dto: any, user: UserPayload): Promise<{
        grant: {
            id: string;
            currency: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            startDate: Date;
            endDate: Date;
            signedDate: Date | null;
            description: string | null;
            objectives: string | null;
            conditions: string | null;
            coverageArea: string | null;
            targetBeneficiaries: number | null;
            reportingRequirements: string | null;
            grantManagerId: string | null;
            projectCoordinatorId: string | null;
        };
        items: {
            id: string;
            prId: string;
            budgetLineId: string | null;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            specification: string | null;
            unit: string;
            quantity: Prisma.Decimal;
            estimatedUnitPrice: Prisma.Decimal;
            totalEstimated: Prisma.Decimal;
        }[];
        requestedBy: {
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        serialNumber: string;
        grantId: string;
        budgetLineId: string | null;
        title: string;
        currency: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstanceId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        procurementMethodId: string | null;
        justification: string | null;
        appItemId: string | null;
        activityId: string | null;
        requestedById: string;
        departmentId: string | null;
        totalEstimatedAmount: Prisma.Decimal;
        requiredByDate: Date | null;
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
        id: string;
        serialNumber: string;
        grantId: string;
        budgetLineId: string | null;
        title: string;
        currency: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstanceId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        procurementMethodId: string | null;
        justification: string | null;
        appItemId: string | null;
        activityId: string | null;
        requestedById: string;
        departmentId: string | null;
        totalEstimatedAmount: Prisma.Decimal;
        requiredByDate: Date | null;
    }>;
    submit(id: string, user: UserPayload): Promise<{
        id: string;
        serialNumber: string;
        grantId: string;
        budgetLineId: string | null;
        title: string;
        currency: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstanceId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        procurementMethodId: string | null;
        justification: string | null;
        appItemId: string | null;
        activityId: string | null;
        requestedById: string;
        departmentId: string | null;
        totalEstimatedAmount: Prisma.Decimal;
        requiredByDate: Date | null;
    }>;
    approve(id: string, comment: string | undefined, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            templateId: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
        procurementRoute: ProcurementRoute | undefined;
        nextStep: {
            type: "RFQ" | "PO";
            rfqId?: string;
            redirectUrl: string;
        } | undefined;
    }>;
    reject(id: string, comment: string, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            templateId: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
        procurementRoute: ProcurementRoute | undefined;
        nextStep: {
            type: "RFQ" | "PO";
            rfqId?: string;
            redirectUrl: string;
        } | undefined;
    }>;
    return_(id: string, comment: string, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                startedAt: Date | null;
                completedAt: Date | null;
                instanceId: string;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
            }[];
        } & {
            id: string;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            createdAt: Date;
            updatedAt: Date;
            documentType: string;
            templateId: string;
            documentId: string;
            currentStepNumber: number;
            startedAt: Date;
            completedAt: Date | null;
        };
        procurementRoute: ProcurementRoute | undefined;
        nextStep: {
            type: "RFQ" | "PO";
            rfqId?: string;
            redirectUrl: string;
        } | undefined;
    }>;
    private processWorkflowAction;
    softDelete(id: string, user: UserPayload): Promise<void>;
    getItems(prId: string): Promise<{
        id: string;
        prId: string;
        budgetLineId: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        specification: string | null;
        unit: string;
        quantity: Prisma.Decimal;
        estimatedUnitPrice: Prisma.Decimal;
        totalEstimated: Prisma.Decimal;
    }[]>;
    addItem(prId: string, dto: any): Promise<{
        id: string;
        prId: string;
        budgetLineId: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        specification: string | null;
        unit: string;
        quantity: Prisma.Decimal;
        estimatedUnitPrice: Prisma.Decimal;
        totalEstimated: Prisma.Decimal;
    }>;
    uploadDocuments(prId: string, files: Express.Multer.File[], labels: string[], user: UserPayload): Promise<any[]>;
    listDocuments(prId: string): Promise<({
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        documentType: string;
        fileUrl: string;
        documentId: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteDocument(prId: string, attachmentId: string, user: UserPayload): Promise<void>;
}
