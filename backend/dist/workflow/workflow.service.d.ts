import { PrismaService } from '../prisma/prisma.service';
import { WorkflowStatus, StepStatus, WorkflowAction } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
export interface ApprovalContext {
    waitingForRoleName: string | null;
    waitingForStepName: string | null;
    dueAt: Date | null;
    canAct: boolean;
    allowReject: boolean;
    allowReturn: boolean;
}
type WorkflowWithSteps = {
    id: string;
    status: WorkflowStatus;
    templateId: string;
    currentStepNumber: number;
    steps: Array<{
        stepNumber: number;
        stepName: string;
        assignedRoleId: string | null;
        assignedUserId: string | null;
        status: StepStatus;
        dueAt: Date | null;
    }>;
};
export declare class WorkflowService {
    private readonly prisma;
    private readonly auditService;
    private readonly logger;
    constructor(prisma: PrismaService, auditService: AuditService);
    startWorkflow(documentType: string, documentId: string, initiatorId: string): Promise<({
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
    }) | null>;
    processAction(instanceId: string, action: WorkflowAction, actorId: string, comment?: string, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
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
    }>;
    getInstance(instanceId: string): Promise<({
        template: {
            id: string;
            documentType: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isActive: boolean;
            version: number;
            createdById: string | null;
        };
        steps: ({
            digitalSignature: {
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
            } | null;
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
                email: string;
                firstName: string;
                lastName: string;
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
    }) | null>;
    getInstanceByDocument(documentType: string, documentId: string): Promise<({
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
        actions: ({
            actor: {
                email: string;
                firstName: string;
                lastName: string;
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
    }) | null>;
    getPendingForUser(userId: string, roleNames: string[]): Promise<{
        id: string;
        stepNumber: number;
        stepName: string;
        dueAt: Date | null;
        startedAt: Date | null;
        instanceId: string;
        documentType: string;
        documentId: string;
        allowReject: boolean;
        allowReturn: boolean;
        waitingForRoleName: string | null;
        document: {
            label: string;
            href: string;
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            title: string;
        } | {
            title: string;
            label: string;
            href: string;
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            payeeName: string;
        } | {
            title: string;
            label: string;
            href: string;
            id: string;
            status: import(".prisma/client").$Enums.InvoiceStatus;
            serialNumber: string;
            invoiceNumber: string;
        } | null;
    }[]>;
    resolveRoleNames(roleIds: string[]): Promise<Map<string, string>>;
    buildApprovalContext(workflow: WorkflowWithSteps | null | undefined, userId?: string, roleNames?: string[]): Promise<ApprovalContext | null>;
    userCanActOnStep(step: {
        assignedUserId: string | null;
        assignedRoleId: string | null;
    }, userId: string, roleNames: string[]): Promise<boolean>;
    private assertUserCanActOnCurrentStep;
    private resolveDocumentMetadata;
    getTemplates(): Promise<({
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            templateId: string;
            name: string;
            stepNumber: number;
            approverRoleId: string | null;
            approverUserId: string | null;
            isParallel: boolean;
            isMandatory: boolean;
            slaHours: number;
            escalationHours: number | null;
            escalationRoleId: string | null;
            allowDelegate: boolean;
            allowReturn: boolean;
            allowReject: boolean;
            conditions: import(".prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        documentType: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isActive: boolean;
        version: number;
        createdById: string | null;
    })[]>;
    private mapActionToStepStatus;
    private canReopenCard;
    private requireOverrideComment;
    getAdminBoard(documentType: string): Promise<{
        documentType: string;
        template: {
            id: string;
            name: string;
            steps: {
                stepNumber: number;
                name: string;
                approverRoleId: string | null;
            }[];
        };
        columns: ({
            key: string;
            type: "step";
            stepNumber: number;
            name: string;
        } | {
            key: string;
            type: "terminal";
            stepNumber: null;
            name: string;
        })[];
        cards: {
            instanceId: string;
            documentType: string;
            documentId: string;
            workflowStatus: import(".prisma/client").$Enums.WorkflowStatus;
            currentStepNumber: number;
            currentStepName: string | null;
            waitingForRoleName: string | null;
            columnKey: string;
            canMoveForward: boolean;
            canMoveBack: boolean;
            canReturnToRequester: boolean;
            canReopen: boolean;
            document: {
                label: string;
                href: string;
                id: string;
                status: import(".prisma/client").$Enums.DocumentStatus;
                serialNumber: string;
                title: string;
            } | {
                title: string;
                label: string;
                href: string;
                id: string;
                status: import(".prisma/client").$Enums.DocumentStatus;
                serialNumber: string;
                payeeName: string;
            } | {
                title: string;
                label: string;
                href: string;
                id: string;
                status: import(".prisma/client").$Enums.InvoiceStatus;
                serialNumber: string;
                invoiceNumber: string;
            } | null;
            steps: {
                stepNumber: number;
                stepName: string;
                status: import(".prisma/client").$Enums.StepStatus;
            }[];
        }[];
        documentTypes: ("PURCHASE_REQUISITION" | "PURCHASE_ORDER" | "GOODS_RECEIPT" | "VENDOR_INVOICE" | "PAYMENT_REQUEST" | "PAYMENT_VOUCHER")[];
    }>;
    adminMove(instanceId: string, direction: 'FORWARD' | 'BACK', actorId: string, comment?: string): Promise<{
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
    }>;
    adminSetStep(instanceId: string, stepNumber: number, actorId: string, comment?: string, commentAlreadyValidated?: boolean): Promise<{
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
    }>;
    adminReturnToRequester(instanceId: string, actorId: string, comment?: string): Promise<{
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
    }>;
    adminReopen(documentType: string, documentId: string, actorId: string, comment?: string, stepNumber?: number): Promise<{
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
    }>;
    private loadInstanceForAdmin;
    private applyStepLayout;
    private assertDocumentCanReopen;
    private syncDocumentStatus;
    private linkDocumentWorkflow;
    private logAdminOverride;
}
export {};
