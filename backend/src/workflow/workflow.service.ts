import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
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
    meta?: { ipAddress?: string; userAgent?: string },
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

    await this.assertUserCanActOnCurrentStep(currentStep, actorId);

    // Create digital signature (immutable audit e-sign)
    const signature = await this.prisma.digitalSignature.create({
      data: {
        userId: actorId,
        documentType: instance.documentType,
        documentId: instance.documentId,
        action: action as string,
        ipAddress: meta?.ipAddress || '0.0.0.0',
        userAgent: meta?.userAgent || 'API',
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
      nextStatus = WorkflowStatus.RETURNED;
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

  async getPendingForUser(userId: string, roleNames: string[]) {
    const userRoles = await this.prisma.role.findMany({
      where: { name: { in: roleNames } },
      select: { id: true },
    });
    const roleIds = userRoles.map((r) => r.id);

    const steps = await this.prisma.workflowInstanceStep.findMany({
      where: {
        status: StepStatus.IN_PROGRESS,
        instance: { status: WorkflowStatus.IN_PROGRESS },
        OR: [
          { assignedUserId: userId },
          ...(roleIds.length ? [{ assignedRoleId: { in: roleIds } }] : []),
        ],
      },
      include: {
        instance: {
          include: {
            template: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
          },
        },
      },
      orderBy: { dueAt: 'asc' },
    });

    return Promise.all(
      steps.map(async (step) => {
        const { instance } = step;
        const templateStep = instance.template.steps.find(
          (s) => s.stepNumber === step.stepNumber,
        );
        const document = await this.resolveDocumentMetadata(
          instance.documentType,
          instance.documentId,
        );

        const roleNameMap = await this.resolveRoleNames(
          step.assignedRoleId ? [step.assignedRoleId] : [],
        );

        return {
          id: step.id,
          stepNumber: step.stepNumber,
          stepName: step.stepName,
          dueAt: step.dueAt,
          startedAt: step.startedAt,
          instanceId: instance.id,
          documentType: instance.documentType,
          documentId: instance.documentId,
          allowReject: templateStep?.allowReject ?? true,
          allowReturn: templateStep?.allowReturn ?? true,
          waitingForRoleName: step.assignedRoleId
            ? roleNameMap.get(step.assignedRoleId) ?? null
            : null,
          document,
        };
      }),
    );
  }

  async resolveRoleNames(roleIds: string[]): Promise<Map<string, string>> {
    const uniqueIds = [...new Set(roleIds.filter(Boolean))];
    if (!uniqueIds.length) return new Map();

    const roles = await this.prisma.role.findMany({
      where: { id: { in: uniqueIds } },
      select: { id: true, name: true },
    });

    return new Map(roles.map((r) => [r.id, r.name]));
  }

  async buildApprovalContext(
    workflow: WorkflowWithSteps | null | undefined,
    userId?: string,
    roleNames?: string[],
  ): Promise<ApprovalContext | null> {
    if (!workflow || workflow.status !== WorkflowStatus.IN_PROGRESS) {
      return null;
    }

    const currentStep = workflow.steps.find((s) => s.status === StepStatus.IN_PROGRESS);
    if (!currentStep) return null;

    const roleNameMap = await this.resolveRoleNames(
      currentStep.assignedRoleId ? [currentStep.assignedRoleId] : [],
    );

    const templateStep = await this.prisma.workflowStep.findUnique({
      where: {
        templateId_stepNumber: {
          templateId: workflow.templateId,
          stepNumber: currentStep.stepNumber,
        },
      },
      select: { allowReject: true, allowReturn: true },
    });

    let canAct = false;
    if (userId !== undefined && roleNames !== undefined) {
      canAct = await this.userCanActOnStep(currentStep, userId, roleNames);
    }

    return {
      waitingForRoleName: currentStep.assignedRoleId
        ? roleNameMap.get(currentStep.assignedRoleId) ?? null
        : null,
      waitingForStepName: currentStep.stepName,
      dueAt: currentStep.dueAt,
      canAct,
      allowReject: templateStep?.allowReject ?? true,
      allowReturn: templateStep?.allowReturn ?? true,
    };
  }

  async userCanActOnStep(
    step: { assignedUserId: string | null; assignedRoleId: string | null },
    userId: string,
    roleNames: string[],
  ): Promise<boolean> {
    if (step.assignedUserId && step.assignedUserId === userId) {
      return true;
    }

    if (!step.assignedRoleId) return false;

    const userRoles = await this.prisma.role.findMany({
      where: { name: { in: roleNames } },
      select: { id: true },
    });

    return userRoles.some((r) => r.id === step.assignedRoleId);
  }

  private async assertUserCanActOnCurrentStep(
    currentStep: { assignedUserId: string | null; assignedRoleId: string | null },
    actorId: string,
  ) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: actorId },
      select: { role: { select: { name: true } } },
    });
    const roleNames = userRoles.map((ur) => ur.role.name);

    const canAct = await this.userCanActOnStep(currentStep, actorId, roleNames);
    if (!canAct) {
      throw new ForbiddenException('You are not assigned to approve the current workflow step');
    }
  }

  private async resolveDocumentMetadata(documentType: string, documentId: string) {
    switch (documentType) {
      case 'PURCHASE_REQUISITION': {
        const doc = await this.prisma.purchaseRequisition.findUnique({
          where: { id: documentId },
          select: { id: true, serialNumber: true, title: true, status: true },
        });
        if (!doc) return null;
        return {
          ...doc,
          label: 'Purchase Requisition',
          href: `/procurement/requisitions/${doc.id}`,
        };
      }
      case 'PURCHASE_ORDER': {
        const doc = await this.prisma.purchaseOrder.findUnique({
          where: { id: documentId },
          select: { id: true, serialNumber: true, title: true, status: true },
        });
        if (!doc) return null;
        return {
          ...doc,
          label: 'Purchase Order',
          href: `/procurement/purchase-orders/${doc.id}`,
        };
      }
      case 'GOODS_RECEIPT': {
        const doc = await this.prisma.goodsReceipt.findUnique({
          where: { id: documentId },
          select: { id: true, serialNumber: true, status: true },
        });
        if (!doc) return null;
        return {
          ...doc,
          title: doc.serialNumber,
          label: 'Goods Receipt',
          href: `/procurement/goods-receipt/${doc.id}`,
        };
      }
      case 'PAYMENT_VOUCHER': {
        const doc = await this.prisma.paymentVoucher.findUnique({
          where: { id: documentId },
          select: { id: true, serialNumber: true, payeeName: true, status: true },
        });
        if (!doc) return null;
        return {
          ...doc,
          title: doc.payeeName,
          label: 'Payment Voucher',
          href: `/finance/payment-vouchers/${doc.id}`,
        };
      }
      case 'PAYMENT_REQUEST': {
        const doc = await this.prisma.paymentRequest.findUnique({
          where: { id: documentId },
          select: { id: true, serialNumber: true, status: true },
        });
        if (!doc) return null;
        return {
          ...doc,
          title: doc.serialNumber,
          label: 'Payment Request',
          href: `/finance/payment-requests/${doc.id}`,
        };
      }
      case 'VENDOR_INVOICE': {
        const doc = await this.prisma.vendorInvoice.findUnique({
          where: { id: documentId },
          select: { id: true, serialNumber: true, invoiceNumber: true, status: true },
        });
        if (!doc) return null;
        return {
          ...doc,
          title: doc.invoiceNumber || doc.serialNumber,
          label: 'Vendor Invoice',
          href: `/procurement/vendor-invoices/${doc.id}`,
        };
      }
      default:
        return null;
    }
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
