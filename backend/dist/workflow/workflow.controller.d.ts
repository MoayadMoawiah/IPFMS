import { WorkflowService } from './workflow.service';
import { UserPayload } from '../common/decorators/current-user.decorator';
import { WorkflowAction } from '@prisma/client';
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
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        documentType: string;
        version: number;
        createdById: string | null;
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
    getInstance(id: string): Promise<({
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
    processAction(id: string, dto: WorkflowActionDto, user: UserPayload): Promise<{
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
}
export {};
