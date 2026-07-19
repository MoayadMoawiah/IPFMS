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
            totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
            requiredByDate: Date | null;
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
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            quantity: import(".prisma/client/runtime/library").Decimal;
            estimatedUnitPrice: import(".prisma/client/runtime/library").Decimal;
            totalEstimated: import(".prisma/client/runtime/library").Decimal;
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
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        requiredByDate: Date | null;
    }>;
    findOne(id: string, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        procurementRoute: import("../../common/constants/procurement.constants").ProcurementRoute;
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
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            quantity: import(".prisma/client/runtime/library").Decimal;
            estimatedUnitPrice: import(".prisma/client/runtime/library").Decimal;
            totalEstimated: import(".prisma/client/runtime/library").Decimal;
        }[];
        purchaseOrders: {
            id: string;
            serialNumber: string;
            currency: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
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
            minThreshold: import(".prisma/client/runtime/library").Decimal;
            maxThreshold: import(".prisma/client/runtime/library").Decimal | null;
            minVendors: number;
            requiresCommittee: boolean;
        } | null;
        pafForms: {
            id: string;
            rfqId: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
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
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
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
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
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
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        requiredByDate: Date | null;
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
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
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        requiredByDate: Date | null;
    }>;
    approve(id: string, body: {
        comment?: string;
    }, user: UserPayload): Promise<{
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
        procurementRoute: import("../../common/constants/procurement.constants").ProcurementRoute | undefined;
        nextStep: {
            type: "RFQ" | "PO";
            rfqId?: string;
            redirectUrl: string;
        } | undefined;
    }>;
    getItems(id: string): Promise<{
        id: string;
        prId: string;
        budgetLineId: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        specification: string | null;
        unit: string;
        quantity: import(".prisma/client/runtime/library").Decimal;
        estimatedUnitPrice: import(".prisma/client/runtime/library").Decimal;
        totalEstimated: import(".prisma/client/runtime/library").Decimal;
    }[]>;
    addItem(id: string, dto: any): Promise<{
        id: string;
        prId: string;
        budgetLineId: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string;
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
        fileUrl: string;
        documentId: string;
        fileName: string;
        originalName: string;
        fileSize: number;
        mimeType: string;
        storageKey: string;
        uploadedById: string;
    })[]>;
    deleteDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
}
