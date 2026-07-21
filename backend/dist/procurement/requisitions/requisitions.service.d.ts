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
            _count: {
                items: number;
            };
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
            requestedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            departmentId: string | null;
            deletedAt: Date | null;
            serialNumber: string;
            appItemId: string | null;
            grantId: string;
            activityId: string | null;
            budgetLineId: string | null;
            title: string;
            requestedById: string;
            procurementMethodId: string | null;
            totalEstimatedAmount: Prisma.Decimal;
            currency: string;
            requiredByDate: Date | null;
            justification: string | null;
            workflowInstanceId: string | null;
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
        purchaseOrders: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            currency: string;
            totalAmount: Prisma.Decimal;
            vendor: {
                id: string;
                name: string;
            };
        }[];
        pafForms: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            rfqId: string;
            totalAmount: Prisma.Decimal;
            recommendedVendorId: string | null;
        }[];
        grant: {
            id: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            createdById: string | null;
            conditions: string | null;
            deletedAt: Date | null;
            currency: string;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            startDate: Date;
            endDate: Date;
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
            status: import(".prisma/client").$Enums.ActivityStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            createdById: string | null;
            deletedAt: Date | null;
            code: string;
            startDate: Date;
            endDate: Date;
            projectId: string;
            plannedBudget: Prisma.Decimal;
            actualSpent: Prisma.Decimal;
            progressPercent: Prisma.Decimal;
            responsibleUserId: string | null;
        } | null;
        procurementMethod: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            code: string;
            minThreshold: Prisma.Decimal;
            maxThreshold: Prisma.Decimal | null;
            minVendors: number;
            requiresCommittee: boolean;
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
        workflow: ({
            template: {
                id: string;
            };
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
                    documentType: string;
                    documentId: string;
                    createdAt: Date;
                    action: string;
                    userId: string;
                    ipAddress: string;
                    userAgent: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                }) | null;
            } & {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceId: string;
            })[];
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
                action: import(".prisma/client").$Enums.WorkflowAction;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceId: string;
                actionAt: Date;
                instanceStepId: string | null;
                actorId: string;
            })[];
        } & {
            id: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
        }) | null;
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            budgetLineId: string | null;
            prId: string;
            specification: string | null;
            unit: string;
            quantity: Prisma.Decimal;
            estimatedUnitPrice: Prisma.Decimal;
            totalEstimated: Prisma.Decimal;
        }[];
        rfqs: {
            id: string;
            status: import(".prisma/client").$Enums.RfqStatus;
            createdAt: Date;
            serialNumber: string;
            submissionDeadline: Date;
        }[];
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        departmentId: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        appItemId: string | null;
        grantId: string;
        activityId: string | null;
        budgetLineId: string | null;
        title: string;
        requestedById: string;
        procurementMethodId: string | null;
        totalEstimatedAmount: Prisma.Decimal;
        currency: string;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    create(dto: any, user: UserPayload): Promise<{
        grant: {
            id: string;
            status: import(".prisma/client").$Enums.GrantStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            createdById: string | null;
            conditions: string | null;
            deletedAt: Date | null;
            currency: string;
            code: string;
            donorId: string;
            fiscalYearId: string | null;
            totalBudget: Prisma.Decimal;
            committedAmount: Prisma.Decimal;
            spentAmount: Prisma.Decimal;
            startDate: Date;
            endDate: Date;
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
            prId: string;
            specification: string | null;
            unit: string;
            quantity: Prisma.Decimal;
            estimatedUnitPrice: Prisma.Decimal;
            totalEstimated: Prisma.Decimal;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        departmentId: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        appItemId: string | null;
        grantId: string;
        activityId: string | null;
        budgetLineId: string | null;
        title: string;
        requestedById: string;
        procurementMethodId: string | null;
        totalEstimatedAmount: Prisma.Decimal;
        currency: string;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        departmentId: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        appItemId: string | null;
        grantId: string;
        activityId: string | null;
        budgetLineId: string | null;
        title: string;
        requestedById: string;
        procurementMethodId: string | null;
        totalEstimatedAmount: Prisma.Decimal;
        currency: string;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    submit(id: string, user: UserPayload): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.DocumentStatus;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        departmentId: string | null;
        deletedAt: Date | null;
        serialNumber: string;
        appItemId: string | null;
        grantId: string;
        activityId: string | null;
        budgetLineId: string | null;
        title: string;
        requestedById: string;
        procurementMethodId: string | null;
        totalEstimatedAmount: Prisma.Decimal;
        currency: string;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    approve(id: string, comment: string | undefined, user: UserPayload): Promise<{
        status: import(".prisma/client").$Enums.DocumentStatus;
        workflowInstance: {
            steps: {
                id: string;
                status: import(".prisma/client").$Enums.StepStatus;
                startedAt: Date | null;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceId: string;
            }[];
        } & {
            id: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
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
                startedAt: Date | null;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceId: string;
            }[];
        } & {
            id: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
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
                startedAt: Date | null;
                completedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                stepNumber: number;
                stepName: string;
                assignedUserId: string | null;
                assignedRoleId: string | null;
                dueAt: Date | null;
                action: string | null;
                comment: string | null;
                digitalSignatureId: string | null;
                instanceId: string;
            }[];
        } & {
            id: string;
            documentType: string;
            documentId: string;
            currentStepNumber: number;
            status: import(".prisma/client").$Enums.WorkflowStatus;
            startedAt: Date;
            completedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
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
        createdAt: Date;
        updatedAt: Date;
        description: string;
        budgetLineId: string | null;
        prId: string;
        specification: string | null;
        unit: string;
        quantity: Prisma.Decimal;
        estimatedUnitPrice: Prisma.Decimal;
        totalEstimated: Prisma.Decimal;
    }[]>;
    addItem(prId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        budgetLineId: string | null;
        prId: string;
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
        documentType: string;
        documentId: string;
        createdAt: Date;
        deletedAt: Date | null;
        fileUrl: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteDocument(prId: string, attachmentId: string, user: UserPayload): Promise<void>;
}
