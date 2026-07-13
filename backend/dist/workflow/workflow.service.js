"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WorkflowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_service_1 = require("../audit/audit.service");
let WorkflowService = WorkflowService_1 = class WorkflowService {
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
        this.logger = new common_1.Logger(WorkflowService_1.name);
    }
    async startWorkflow(documentType, documentId, initiatorId) {
        const template = await this.prisma.workflowTemplate.findFirst({
            where: { documentType, isActive: true },
            include: { steps: { orderBy: { stepNumber: 'asc' } } },
        });
        if (!template) {
            this.logger.warn(`No active workflow template for ${documentType}`);
            return null;
        }
        const instance = await this.prisma.workflowInstance.create({
            data: {
                templateId: template.id,
                documentType,
                documentId,
                currentStepNumber: 1,
                status: client_1.WorkflowStatus.IN_PROGRESS,
                startedAt: new Date(),
                steps: {
                    create: template.steps.map((step) => ({
                        stepNumber: step.stepNumber,
                        stepName: step.name,
                        assignedRoleId: step.approverRoleId,
                        assignedUserId: step.approverUserId,
                        status: step.stepNumber === 1 ? client_1.StepStatus.IN_PROGRESS : client_1.StepStatus.PENDING,
                        startedAt: step.stepNumber === 1 ? new Date() : null,
                        dueAt: step.stepNumber === 1
                            ? new Date(Date.now() + step.slaHours * 60 * 60 * 1000)
                            : null,
                    })),
                },
            },
            include: { steps: true },
        });
        await this.auditService.log({
            userId: initiatorId,
            action: 'SUBMIT',
            module: documentType,
            resource: documentType,
            resourceId: documentId,
            newValues: { workflowInstanceId: instance.id, status: 'IN_PROGRESS' },
        });
        return instance;
    }
    async processAction(instanceId, action, actorId, comment) {
        const instance = await this.prisma.workflowInstance.findUnique({
            where: { id: instanceId },
            include: {
                template: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
                steps: { orderBy: { stepNumber: 'asc' } },
            },
        });
        if (!instance)
            throw new common_1.NotFoundException('Workflow instance not found');
        if (instance.status !== client_1.WorkflowStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException(`Workflow is already ${instance.status}`);
        }
        const currentStep = instance.steps.find((s) => s.stepNumber === instance.currentStepNumber);
        if (!currentStep)
            throw new common_1.NotFoundException('Current workflow step not found');
        if (currentStep.status !== client_1.StepStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Current step is not in progress');
        }
        const signature = await this.prisma.digitalSignature.create({
            data: {
                userId: actorId,
                documentType: instance.documentType,
                documentId: instance.documentId,
                action: action,
                ipAddress: '0.0.0.0',
                userAgent: 'API',
                signedAt: new Date(),
            },
        });
        await this.prisma.workflowInstanceStep.update({
            where: { id: currentStep.id },
            data: {
                status: this.mapActionToStepStatus(action),
                completedAt: new Date(),
                action: action,
                comment,
                digitalSignatureId: signature.id,
            },
        });
        await this.prisma.workflowActionLog.create({
            data: {
                instanceId,
                instanceStepId: currentStep.id,
                actorId,
                action,
                comment,
                actionAt: new Date(),
                digitalSignatureId: signature.id,
            },
        });
        let nextStatus = instance.status;
        let nextStepNumber = instance.currentStepNumber;
        if (action === client_1.WorkflowAction.APPROVE) {
            const nextStep = instance.steps.find((s) => s.stepNumber === instance.currentStepNumber + 1);
            if (nextStep) {
                nextStepNumber = nextStep.stepNumber;
                const templateStep = instance.template.steps.find((s) => s.stepNumber === nextStep.stepNumber);
                const slaHours = templateStep?.slaHours ?? 48;
                await this.prisma.workflowInstanceStep.update({
                    where: { id: nextStep.id },
                    data: {
                        status: client_1.StepStatus.IN_PROGRESS,
                        startedAt: new Date(),
                        dueAt: new Date(Date.now() + slaHours * 60 * 60 * 1000),
                    },
                });
            }
            else {
                nextStatus = client_1.WorkflowStatus.APPROVED;
            }
        }
        else if (action === client_1.WorkflowAction.REJECT) {
            nextStatus = client_1.WorkflowStatus.REJECTED;
        }
        else if (action === client_1.WorkflowAction.RETURN) {
            nextStepNumber = 1;
            const firstStep = instance.steps.find((s) => s.stepNumber === 1);
            if (firstStep) {
                await this.prisma.workflowInstanceStep.update({
                    where: { id: firstStep.id },
                    data: {
                        status: client_1.StepStatus.IN_PROGRESS,
                        startedAt: new Date(),
                        completedAt: null,
                        action: null,
                        comment: null,
                    },
                });
            }
        }
        const updatedInstance = await this.prisma.workflowInstance.update({
            where: { id: instanceId },
            data: {
                currentStepNumber: nextStepNumber,
                status: nextStatus,
                completedAt: nextStatus === client_1.WorkflowStatus.APPROVED || nextStatus === client_1.WorkflowStatus.REJECTED
                    ? new Date()
                    : null,
            },
            include: { steps: { orderBy: { stepNumber: 'asc' } } },
        });
        return updatedInstance;
    }
    async getInstance(instanceId) {
        return this.prisma.workflowInstance.findUnique({
            where: { id: instanceId },
            include: {
                template: true,
                steps: {
                    include: {
                        digitalSignature: true,
                    },
                    orderBy: { stepNumber: 'asc' },
                },
                actions: {
                    include: { actor: { select: { firstName: true, lastName: true, email: true } } },
                    orderBy: { actionAt: 'asc' },
                },
            },
        });
    }
    async getInstanceByDocument(documentType, documentId) {
        return this.prisma.workflowInstance.findFirst({
            where: { documentType, documentId },
            include: {
                steps: { orderBy: { stepNumber: 'asc' } },
                actions: {
                    include: { actor: { select: { firstName: true, lastName: true, email: true } } },
                    orderBy: { actionAt: 'asc' },
                },
            },
        });
    }
    async getPendingForUser(userId, roles) {
        const steps = await this.prisma.workflowInstanceStep.findMany({
            where: {
                status: client_1.StepStatus.IN_PROGRESS,
                OR: [
                    { assignedUserId: userId },
                    {
                        assignedRoleId: {
                            in: roles,
                        },
                    },
                ],
            },
            include: {
                instance: { select: { documentType: true, documentId: true, id: true } },
            },
            orderBy: { dueAt: 'asc' },
        });
        return steps;
    }
    async getTemplates() {
        return this.prisma.workflowTemplate.findMany({
            include: { steps: { orderBy: { stepNumber: 'asc' } } },
            orderBy: { name: 'asc' },
        });
    }
    mapActionToStepStatus(action) {
        switch (action) {
            case client_1.WorkflowAction.APPROVE:
                return client_1.StepStatus.APPROVED;
            case client_1.WorkflowAction.REJECT:
                return client_1.StepStatus.REJECTED;
            case client_1.WorkflowAction.RETURN:
                return client_1.StepStatus.RETURNED;
            default:
                return client_1.StepStatus.IN_PROGRESS;
        }
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = WorkflowService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map