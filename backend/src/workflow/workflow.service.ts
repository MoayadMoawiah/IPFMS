import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowStatus, StepStatus, WorkflowAction } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Start a workflow instance for a document.
   * Looks up the active template for the documentType, creates instance + steps.
   */
  async startWorkflow(documentType: string, documentId: string, initiatorId: string) {
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
        status: WorkflowStatus.IN_PROGRESS,
        startedAt: new Date(),
        steps: {
          create: template.steps.map((step) => ({
            stepNumber: step.stepNumber,
            stepName: step.name,
            assignedRoleId: step.approverRoleId,
            assignedUserId: step.approverUserId,
            status: step.stepNumber === 1 ? StepStatus.IN_PROGRESS : StepStatus.PENDING,
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

  /**
   * Process a workflow action (APPROVE, REJECT, RETURN).
   * Advances the workflow to the next step or completes it.
   */
  async processAction(
    instanceId: string,
    action: WorkflowAction,
    actorId: string,
    comment?: string,
  ) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        template: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
        steps: { orderBy: { stepNumber: 'asc' } },
      },
    });

    if (!instance) throw new NotFoundException('Workflow instance not found');
    if (instance.status !== WorkflowStatus.IN_PROGRESS) {
      throw new BadRequestException(`Workflow is already ${instance.status}`);
    }

    const currentStep = instance.steps.find(
      (s) => s.stepNumber === instance.currentStepNumber,
    );

    if (!currentStep) throw new NotFoundException('Current workflow step not found');
    if (currentStep.status !== StepStatus.IN_PROGRESS) {
      throw new BadRequestException('Current step is not in progress');
    }

    // Create digital signature
    const signature = await this.prisma.digitalSignature.create({
      data: {
        userId: actorId,
        documentType: instance.documentType,
        documentId: instance.documentId,
        action: action as string,
        ipAddress: '0.0.0.0', // Set from request in controller
        userAgent: 'API',
        signedAt: new Date(),
      },
    });

    // Complete the current step
    await this.prisma.workflowInstanceStep.update({
      where: { id: currentStep.id },
      data: {
        status: this.mapActionToStepStatus(action),
        completedAt: new Date(),
        action: action as string,
        comment,
        digitalSignatureId: signature.id,
      },
    });

    // Record the action
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

    // Determine next state
    let nextStatus: import('@prisma/client').WorkflowStatus = instance.status;
    let nextStepNumber = instance.currentStepNumber;

    if (action === WorkflowAction.APPROVE) {
      const nextStep = instance.steps.find(
        (s) => s.stepNumber === instance.currentStepNumber + 1,
      );

      if (nextStep) {
        // Advance to next step
        nextStepNumber = nextStep.stepNumber;
        const templateStep = instance.template.steps.find(
          (s) => s.stepNumber === nextStep.stepNumber,
        );
        const slaHours = templateStep?.slaHours ?? 48;

        await this.prisma.workflowInstanceStep.update({
          where: { id: nextStep.id },
          data: {
            status: StepStatus.IN_PROGRESS,
            startedAt: new Date(),
            dueAt: new Date(Date.now() + slaHours * 60 * 60 * 1000),
          },
        });
      } else {
        // Final step approved → workflow complete
        nextStatus = WorkflowStatus.APPROVED;
      }
    } else if (action === WorkflowAction.REJECT) {
      nextStatus = WorkflowStatus.REJECTED;
    } else if (action === WorkflowAction.RETURN) {
      // Return to step 1 (requester)
      nextStepNumber = 1;
      const firstStep = instance.steps.find((s) => s.stepNumber === 1);
      if (firstStep) {
        await this.prisma.workflowInstanceStep.update({
          where: { id: firstStep.id },
          data: {
            status: StepStatus.IN_PROGRESS,
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
        completedAt:
          nextStatus === WorkflowStatus.APPROVED || nextStatus === WorkflowStatus.REJECTED
            ? new Date()
            : null,
      },
      include: { steps: { orderBy: { stepNumber: 'asc' } } },
    });

    return updatedInstance;
  }

  async getInstance(instanceId: string) {
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

  async getInstanceByDocument(documentType: string, documentId: string) {
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

  async getPendingForUser(userId: string, roles: string[]) {
    // Find all IN_PROGRESS steps where user or their role is assigned
    const steps = await this.prisma.workflowInstanceStep.findMany({
      where: {
        status: StepStatus.IN_PROGRESS,
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

  private mapActionToStepStatus(action: WorkflowAction): StepStatus {
    switch (action) {
      case WorkflowAction.APPROVE:
        return StepStatus.APPROVED;
      case WorkflowAction.REJECT:
        return StepStatus.REJECTED;
      case WorkflowAction.RETURN:
        return StepStatus.RETURNED;
      default:
        return StepStatus.IN_PROGRESS;
    }
  }
}
