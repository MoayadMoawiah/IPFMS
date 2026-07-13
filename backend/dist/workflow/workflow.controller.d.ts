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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            conditions: import(".prisma/client/runtime/library").JsonValue | null;
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
        }[];
    } & {
        name: string;
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        createdById: string | null;
        isActive: boolean;
        documentType: string;
        version: number;
    })[]>;
    getPending(user: UserPayload): Promise<({
        instance: {
            id: string;
            documentType: string;
            documentId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        action: string | null;
        status: import(".prisma/client").$Enums.StepStatus;
        stepNumber: number;
        startedAt: Date | null;
        completedAt: Date | null;
        instanceId: string;
        stepName: string;
        assignedUserId: string | null;
        assignedRoleId: string | null;
        dueAt: Date | null;
        comment: string | null;
        digitalSignatureId: string | null;
    })[]>;
    getInstance(id: string): Promise<({
        template: {
            name: string;
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            createdById: string | null;
            isActive: boolean;
            documentType: string;
            version: number;
        };
        steps: ({
            digitalSignature: {
                userId: string;
                id: string;
                createdAt: Date;
                action: string;
                documentType: string;
                documentId: string;
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
            action: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            stepNumber: number;
            startedAt: Date | null;
            completedAt: Date | null;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            dueAt: Date | null;
            comment: string | null;
            digitalSignatureId: string | null;
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
            instanceId: string;
            comment: string | null;
            digitalSignatureId: string | null;
            actionAt: Date;
            instanceStepId: string | null;
            actorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        templateId: string;
        documentType: string;
        documentId: string;
        currentStepNumber: number;
        startedAt: Date;
        completedAt: Date | null;
    }) | null>;
    processAction(id: string, dto: WorkflowActionDto, user: UserPayload): Promise<{
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            action: string | null;
            status: import(".prisma/client").$Enums.StepStatus;
            stepNumber: number;
            startedAt: Date | null;
            completedAt: Date | null;
            instanceId: string;
            stepName: string;
            assignedUserId: string | null;
            assignedRoleId: string | null;
            dueAt: Date | null;
            comment: string | null;
            digitalSignatureId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.WorkflowStatus;
        templateId: string;
        documentType: string;
        documentId: string;
        currentStepNumber: number;
        startedAt: Date;
        completedAt: Date | null;
    }>;
}
export {};
