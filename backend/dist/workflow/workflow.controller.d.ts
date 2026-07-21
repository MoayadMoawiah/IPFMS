import { WorkflowService } from './workflow.service';
import { UserPayload } from '../common/decorators/current-user.decorator';
import { WorkflowAction } from '@prisma/client';
import { AdminCommentDto, AdminMoveDto, AdminReopenDto, AdminSetStepDto } from './dto/workflow-admin.dto';
declare class WorkflowActionDto {
    action: WorkflowAction;
    comment?: string;
}
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    getTemplates(): Promise<({
        steps: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            templateId: string;
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
        name: string;
        documentType: string;
        description: string | null;
        isActive: boolean;
        version: number;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getPending(user: UserPayload): Promise<{
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
    adminMove(id: string, dto: AdminMoveDto, user: UserPayload): Promise<{
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
        }[];
    } & {
        id: string;
        documentType: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        documentId: string;
        currentStepNumber: number;
    }>;
    adminSetStep(id: string, dto: AdminSetStepDto, user: UserPayload): Promise<{
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
        }[];
    } & {
        id: string;
        documentType: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        documentId: string;
        currentStepNumber: number;
    }>;
    adminReturn(id: string, dto: AdminCommentDto, user: UserPayload): Promise<{
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
        }[];
    } & {
        id: string;
        documentType: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        documentId: string;
        currentStepNumber: number;
    }>;
    adminReopen(dto: AdminReopenDto, user: UserPayload): Promise<{
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
        }[];
    } & {
        id: string;
        documentType: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        documentId: string;
        currentStepNumber: number;
    }>;
    getInstance(id: string): Promise<({
        steps: ({
            digitalSignature: {
                id: string;
                documentType: string;
                createdAt: Date;
                action: string;
                documentId: string;
                userId: string;
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
            stepNumber: number;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
        })[];
        template: {
            id: string;
            name: string;
            documentType: string;
            description: string | null;
            isActive: boolean;
            version: number;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        actions: ({
            actor: {
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            instanceId: string;
            action: import(".prisma/client").$Enums.WorkflowAction;
            comment: string | null;
            digitalSignatureId: string | null;
            actionAt: Date;
            instanceStepId: string | null;
            actorId: string;
        })[];
    } & {
        id: string;
        documentType: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        documentId: string;
        currentStepNumber: number;
    }) | null>;
    processAction(id: string, dto: WorkflowActionDto, user: UserPayload): Promise<{
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            stepNumber: number;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            startedAt: Date | null;
            completedAt: Date | null;
            dueAt: Date | null;
            action: string | null;
            comment: string | null;
            digitalSignatureId: string | null;
        }[];
    } & {
        id: string;
        documentType: string;
        createdAt: Date;
        updatedAt: Date;
        templateId: string;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        startedAt: Date;
        completedAt: Date | null;
        documentId: string;
        currentStepNumber: number;
    }>;
}
export {};
