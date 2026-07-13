import { PrismaService } from '../prisma/prisma.service';
import { WorkflowAction } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
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
    processAction(instanceId: string, action: WorkflowAction, actorId: string, comment?: string): Promise<{
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
        template: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
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
    getPendingForUser(userId: string, roles: string[]): Promise<({
        instance: {
            id: string;
            documentType: string;
            documentId: string;
        };
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
    })[]>;
    getTemplates(): Promise<({
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        documentType: string;
        version: number;
        createdById: string | null;
    })[]>;
    private mapActionToStepStatus;
}
