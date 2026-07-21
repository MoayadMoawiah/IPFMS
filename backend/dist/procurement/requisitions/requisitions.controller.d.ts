import { RequisitionsService } from './requisitions.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class RequisitionsController {
    private readonly svc;
    constructor(svc: RequisitionsService);
    findAll(query: any, user: UserPayload): Promise<{
        data: {
            approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
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
            currency: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            deletedAt: Date | null;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            appItemId: string | null;
            grantId: string;
            activityId: string | null;
            budgetLineId: string | null;
            title: string;
            requestedById: string;
            procurementMethodId: string | null;
            totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
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
    create(dto: any, user: UserPayload): Promise<{
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
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
        departmentId: string | null;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        appItemId: string | null;
        grantId: string;
        activityId: string | null;
        budgetLineId: string | null;
        title: string;
        requestedById: string;
        procurementMethodId: string | null;
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    findOne(id: string, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        procurementRoute: import("../../common/constants/procurement.constants").ProcurementRoute;
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
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            startDate: Date;
            endDate: Date;
            createdById: string | null;
            status: import(".prisma/client").$Enums.ActivityStatus;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
            projectId: string;
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
            responsibleUserId: string | null;
        } | null;
        procurementMethod: {
            id: string;
            name: string;
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
        purchaseOrders: {
            currency: string;
            vendor: {
                id: string;
                name: string;
            };
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
        }[];
        pafForms: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            rfqId: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            recommendedVendorId: string | null;
        }[];
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
                    userId: string;
                    id: string;
                    createdAt: Date;
                    action: string;
                    ipAddress: string;
                    userAgent: string;
                    documentType: string;
                    documentId: string;
                    deviceFingerprint: string | null;
                    signedAt: Date;
                    certificate: string | null;
                }) | null;
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
        rfqs: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.RfqStatus;
            serialNumber: string;
            submissionDeadline: Date;
        }[];
        currency: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        appItemId: string | null;
        grantId: string;
        activityId: string | null;
        budgetLineId: string | null;
        title: string;
        requestedById: string;
        procurementMethodId: string | null;
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    update(id: string, dto: any, user: UserPayload): Promise<{
        currency: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        appItemId: string | null;
        grantId: string;
        activityId: string | null;
        budgetLineId: string | null;
        title: string;
        requestedById: string;
        procurementMethodId: string | null;
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
    submit(id: string, user: UserPayload): Promise<{
        currency: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        departmentId: string | null;
        deletedAt: Date | null;
        status: import(".prisma/client").$Enums.DocumentStatus;
        serialNumber: string;
        appItemId: string | null;
        grantId: string;
        activityId: string | null;
        budgetLineId: string | null;
        title: string;
        requestedById: string;
        procurementMethodId: string | null;
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    approve(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
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
        procurementRoute: import("../../common/constants/procurement.constants").ProcurementRoute | undefined;
        nextStep: {
            type: "RFQ" | "PO";
            rfqId?: string;
            redirectUrl: string;
        } | undefined;
    }>;
    reject(id: string, body: {
        comment: string;
    }, user: UserPayload): Promise<{
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
        procurementRoute: import("../../common/constants/procurement.constants").ProcurementRoute | undefined;
        nextStep: {
            type: "RFQ" | "PO";
            rfqId?: string;
            redirectUrl: string;
        } | undefined;
    }>;
    return_(id: string, body: {
        comment: string;
    }, user: UserPayload): Promise<{
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
        procurementRoute: import("../../common/constants/procurement.constants").ProcurementRoute | undefined;
        nextStep: {
            type: "RFQ" | "PO";
            rfqId?: string;
            redirectUrl: string;
        } | undefined;
    }>;
    getItems(id: string): Promise<{
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
    }[]>;
    addItem(id: string, dto: any): Promise<{
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
    }>;
    uploadDocuments(id: string, files: Express.Multer.File[], labelsJson: string, user: UserPayload): Promise<any[]>;
    listDocuments(id: string): Promise<({
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
        documentId: string;
        fileUrl: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
}
