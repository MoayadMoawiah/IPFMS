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
    }) | null>;
    processAction(instanceId: string, action: WorkflowAction, actorId: string, comment?: string, meta?: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
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
    }>;
    getInstance(instanceId: string): Promise<({
        steps: ({
            digitalSignature: {
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
        template: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            documentType: string;
            version: number;
            createdById: string | null;
        };
        actions: ({
            actor: {
                email: string;
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
    }) | null>;
    getInstanceByDocument(documentType: string, documentId: string): Promise<({
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
        actions: ({
            actor: {
                email: string;
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
            title: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
        } | {
            title: string;
            label: string;
            href: string;
            id: string;
            status: import(".prisma/client").$Enums.DocumentStatus;
            serialNumber: string;
            payeeName: string;
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
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        documentType: string;
        version: number;
        createdById: string | null;
    })[]>;
    private mapActionToStepStatus;
}
export {};
