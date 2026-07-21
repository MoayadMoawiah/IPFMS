import { RequisitionsService } from './requisitions.service';
import { UserPayload } from '../../common/decorators/current-user.decorator';
export declare class RequisitionsController {
    private readonly svc;
    constructor(svc: RequisitionsService);
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
            totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
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
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            quantity: import(".prisma/client/runtime/library").Decimal;
            estimatedUnitPrice: import(".prisma/client/runtime/library").Decimal;
            totalEstimated: import(".prisma/client/runtime/library").Decimal;
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
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    findOne(id: string, user: UserPayload): Promise<{
        approvalContext: import("../../workflow/workflow.service").ApprovalContext | null;
        procurementRoute: import("../../common/constants/procurement.constants").ProcurementRoute;
        purchaseOrders: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            currency: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
            vendor: {
                id: string;
                name: string;
            };
        }[];
        pafForms: {
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            rfqId: string;
            totalAmount: import(".prisma/client/runtime/library").Decimal;
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
            totalBudget: import(".prisma/client/runtime/library").Decimal;
            committedAmount: import(".prisma/client/runtime/library").Decimal;
            spentAmount: import(".prisma/client/runtime/library").Decimal;
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
            plannedBudget: import(".prisma/client/runtime/library").Decimal;
            actualSpent: import(".prisma/client/runtime/library").Decimal;
            progressPercent: import(".prisma/client/runtime/library").Decimal;
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
            quantity: import(".prisma/client/runtime/library").Decimal;
            estimatedUnitPrice: import(".prisma/client/runtime/library").Decimal;
            totalEstimated: import(".prisma/client/runtime/library").Decimal;
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
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
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
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
        requiredByDate: Date | null;
        justification: string | null;
        workflowInstanceId: string | null;
    }>;
    remove(id: string, user: UserPayload): Promise<void>;
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
        totalEstimatedAmount: import(".prisma/client/runtime/library").Decimal;
        currency: string;
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
        procurementRoute: import("../../common/constants/procurement.constants").ProcurementRoute | undefined;
        nextStep: {
            type: "RFQ" | "PO";
            rfqId?: string;
            redirectUrl: string;
        } | undefined;
    }>;
    getItems(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
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
        createdAt: Date;
        updatedAt: Date;
        description: string;
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
    deleteDocument(id: string, attachmentId: string, user: UserPayload): Promise<void>;
}
