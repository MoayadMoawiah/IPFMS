import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuditAction,
  DocumentStatus,
  InvoiceStatus,
  WorkflowStatus,
  StepStatus,
  WorkflowAction,
} from '@prisma/client';
import { AuditService } from '../audit/audit.service';

const ADMIN_BOARD_TYPES = [
  'PURCHASE_REQUISITION',
  'PURCHASE_ORDER',
  'GOODS_RECEIPT',
  'VENDOR_INVOICE',
  'PAYMENT_REQUEST',
  'PAYMENT_VOUCHER',
] as const;

type AdminBoardDocumentType = (typeof ADMIN_BOARD_TYPES)[number];

const MIN_OVERRIDE_COMMENT = 5;

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

  // ── Super Admin override (WORKFLOW:OVERRIDE) ─────────────────────────────

  private canReopenCard(
    documentType: string,
    workflowStatus: WorkflowStatus,
    documentStatus?: string,
  ) {
    if (
      workflowStatus !== WorkflowStatus.APPROVED &&
      workflowStatus !== WorkflowStatus.REJECTED &&
      workflowStatus !== WorkflowStatus.RETURNED
    ) {
      return false;
    }
    const status = String(documentStatus || '').toUpperCase();
    if (status === DocumentStatus.CANCELLED || status === DocumentStatus.ARCHIVED) {
      return false;
    }
    if (documentType === 'PAYMENT_VOUCHER' && status === DocumentStatus.CLOSED) {
      return false;
    }
    if (
      documentType === 'PURCHASE_ORDER' &&
      (status === DocumentStatus.ISSUED || status === DocumentStatus.CLOSED)
    ) {
      return false;
    }
    if (documentType === 'VENDOR_INVOICE' && status === 'PAID') {
      return false;
    }
    return true;
  }

  private requireOverrideComment(comment?: string) {
    const text = (comment || '').trim();
    if (text.length < MIN_OVERRIDE_COMMENT) {
      throw new BadRequestException(
        `Override comment is required (min ${MIN_OVERRIDE_COMMENT} characters)`,
      );
    }
    return text;
  }

  async getAdminBoard(documentType: string) {
    if (!ADMIN_BOARD_TYPES.includes(documentType as AdminBoardDocumentType)) {
      throw new BadRequestException(
        `documentType must be one of: ${ADMIN_BOARD_TYPES.join(', ')}`,
      );
    }

    const template = await this.prisma.workflowTemplate.findFirst({
      where: { documentType, isActive: true },
      include: { steps: { orderBy: { stepNumber: 'asc' } } },
    });
    if (!template) {
      throw new NotFoundException(`No active workflow template for ${documentType}`);
    }

    const instances = await this.prisma.workflowInstance.findMany({
      where: {
        documentType,
        status: {
          in: [
            WorkflowStatus.IN_PROGRESS,
            WorkflowStatus.APPROVED,
            WorkflowStatus.REJECTED,
            WorkflowStatus.RETURNED,
          ],
        },
      },
      include: {
        steps: { orderBy: { stepNumber: 'asc' } },
        template: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });

    // Prefer latest instance per document
    const latestByDoc = new Map<string, (typeof instances)[number]>();
    for (const inst of instances) {
      if (!latestByDoc.has(inst.documentId)) {
        latestByDoc.set(inst.documentId, inst);
      }
    }

    const roleIds = [
      ...new Set(
        [...latestByDoc.values()].flatMap((i) =>
          i.steps.map((s) => s.assignedRoleId).filter(Boolean) as string[],
        ),
      ),
    ];
    const roleNames = await this.resolveRoleNames(roleIds);

    const cards = await Promise.all(
      [...latestByDoc.values()].map(async (inst) => {
        const document = await this.resolveDocumentMetadata(
          inst.documentType,
          inst.documentId,
        );
        const currentStep = inst.steps.find(
          (s) => s.stepNumber === inst.currentStepNumber,
        );
        let columnKey: string;
        if (inst.status === WorkflowStatus.IN_PROGRESS) {
          columnKey = `step-${inst.currentStepNumber}`;
        } else if (inst.status === WorkflowStatus.RETURNED) {
          columnKey = 'returned';
        } else if (inst.status === WorkflowStatus.APPROVED) {
          columnKey = 'approved';
        } else {
          columnKey = 'rejected';
        }

        return {
          instanceId: inst.id,
          documentType: inst.documentType,
          documentId: inst.documentId,
          workflowStatus: inst.status,
          currentStepNumber: inst.currentStepNumber,
          currentStepName: currentStep?.stepName ?? null,
          waitingForRoleName: currentStep?.assignedRoleId
            ? roleNames.get(currentStep.assignedRoleId) ?? null
            : null,
          columnKey,
          canMoveForward:
            inst.status === WorkflowStatus.IN_PROGRESS &&
            inst.currentStepNumber <= template.steps.length,
          canMoveBack:
            inst.status === WorkflowStatus.IN_PROGRESS &&
            inst.currentStepNumber > 1,
          canReturnToRequester:
            inst.status === WorkflowStatus.IN_PROGRESS ||
            inst.status === WorkflowStatus.APPROVED,
          canReopen: this.canReopenCard(
            inst.documentType,
            inst.status,
            (document as { status?: string } | null)?.status,
          ),
          document,
          steps: inst.steps.map((s) => ({
            stepNumber: s.stepNumber,
            stepName: s.stepName,
            status: s.status,
          })),
        };
      }),
    );

    const columns = [
      ...template.steps.map((s) => ({
        key: `step-${s.stepNumber}`,
        type: 'step' as const,
        stepNumber: s.stepNumber,
        name: s.name,
      })),
      { key: 'returned', type: 'terminal' as const, stepNumber: null, name: 'Returned' },
      { key: 'approved', type: 'terminal' as const, stepNumber: null, name: 'Approved' },
      { key: 'rejected', type: 'terminal' as const, stepNumber: null, name: 'Rejected' },
    ];

    return {
      documentType,
      template: {
        id: template.id,
        name: template.name,
        steps: template.steps.map((s) => ({
          stepNumber: s.stepNumber,
          name: s.name,
          approverRoleId: s.approverRoleId,
        })),
      },
      columns,
      cards,
      documentTypes: [...ADMIN_BOARD_TYPES],
    };
  }

  async adminMove(
    instanceId: string,
    direction: 'FORWARD' | 'BACK',
    actorId: string,
    comment?: string,
  ) {
    const text = this.requireOverrideComment(comment);
    const instance = await this.loadInstanceForAdmin(instanceId);
    if (instance.status !== WorkflowStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Only IN_PROGRESS workflows can be moved; reopen first if finished',
      );
    }

    const maxStep = Math.max(...instance.steps.map((s) => s.stepNumber));
    let target = instance.currentStepNumber;
    if (direction === 'FORWARD') {
      if (instance.currentStepNumber >= maxStep) {
        // Completing final step
        return this.adminSetStep(instanceId, maxStep + 1, actorId, text, true);
      }
      target = instance.currentStepNumber + 1;
    } else {
      if (instance.currentStepNumber <= 1) {
        throw new BadRequestException('Already at the first step');
      }
      target = instance.currentStepNumber - 1;
    }

    return this.adminSetStep(instanceId, target, actorId, text, true);
  }

  async adminSetStep(
    instanceId: string,
    stepNumber: number,
    actorId: string,
    comment?: string,
    commentAlreadyValidated = false,
  ) {
    const text = commentAlreadyValidated
      ? (comment || '').trim()
      : this.requireOverrideComment(comment);
    const instance = await this.loadInstanceForAdmin(instanceId);
    const maxStep = Math.max(...instance.steps.map((s) => s.stepNumber));

    if (!Number.isFinite(stepNumber) || stepNumber < 1) {
      throw new BadRequestException('stepNumber must be >= 1');
    }

    // stepNumber > maxStep means force-complete as APPROVED
    const completing = stepNumber > maxStep;
    const targetStep = completing ? maxStep : stepNumber;

    await this.applyStepLayout(instance.id, instance.steps, targetStep, {
      completeAsApproved: completing,
      template: instance.template,
    });

    const nextStatus = completing
      ? WorkflowStatus.APPROVED
      : WorkflowStatus.IN_PROGRESS;

    const updated = await this.prisma.workflowInstance.update({
      where: { id: instance.id },
      data: {
        currentStepNumber: targetStep,
        status: nextStatus,
        completedAt: completing ? new Date() : null,
      },
      include: { steps: { orderBy: { stepNumber: 'asc' } } },
    });

    await this.syncDocumentStatus(
      instance.documentType,
      instance.documentId,
      completing ? DocumentStatus.APPROVED : DocumentStatus.SUBMITTED,
    );

    await this.logAdminOverride({
      instanceId: instance.id,
      actorId,
      comment: text,
      action: completing ? WorkflowAction.APPROVE : WorkflowAction.COMMENT,
      newValues: {
        override: 'SET_STEP',
        stepNumber: targetStep,
        completing,
        workflowStatus: nextStatus,
      },
    });

    return updated;
  }

  async adminReturnToRequester(instanceId: string, actorId: string, comment?: string) {
    const text = this.requireOverrideComment(comment);
    const instance = await this.loadInstanceForAdmin(instanceId);

    if (
      instance.status !== WorkflowStatus.IN_PROGRESS &&
      instance.status !== WorkflowStatus.APPROVED
    ) {
      throw new BadRequestException(
        'Return to requester is only allowed for IN_PROGRESS or APPROVED workflows',
      );
    }

    const firstStep = instance.steps.find((s) => s.stepNumber === 1);
    for (const step of instance.steps) {
      await this.prisma.workflowInstanceStep.update({
        where: { id: step.id },
        data: {
          status:
            step.stepNumber === 1 ? StepStatus.IN_PROGRESS : StepStatus.PENDING,
          startedAt: step.stepNumber === 1 ? new Date() : null,
          completedAt: null,
          action: null,
          comment: null,
          dueAt: null,
        },
      });
    }

    const updated = await this.prisma.workflowInstance.update({
      where: { id: instance.id },
      data: {
        status: WorkflowStatus.RETURNED,
        currentStepNumber: 1,
        completedAt: new Date(),
      },
      include: { steps: { orderBy: { stepNumber: 'asc' } } },
    });

    await this.syncDocumentStatus(
      instance.documentType,
      instance.documentId,
      DocumentStatus.RETURNED,
    );

    await this.logAdminOverride({
      instanceId: instance.id,
      instanceStepId: firstStep?.id,
      actorId,
      comment: text,
      action: WorkflowAction.RETURN,
      newValues: { override: 'RETURN_TO_REQUESTER' },
    });

    return updated;
  }

  async adminReopen(
    documentType: string,
    documentId: string,
    actorId: string,
    comment?: string,
    stepNumber = 1,
  ) {
    const text = this.requireOverrideComment(comment);
    if (!ADMIN_BOARD_TYPES.includes(documentType as AdminBoardDocumentType)) {
      throw new BadRequestException(`Unsupported documentType: ${documentType}`);
    }

    await this.assertDocumentCanReopen(documentType, documentId);

    let instance = await this.prisma.workflowInstance.findFirst({
      where: { documentType, documentId },
      include: {
        template: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
        steps: { orderBy: { stepNumber: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!instance) {
      const started = await this.startWorkflow(documentType, documentId, actorId);
      if (!started) {
        throw new BadRequestException(
          `No workflow template available for ${documentType}`,
        );
      }
      instance = await this.loadInstanceForAdmin(started.id);
    }

    const maxStep = Math.max(...instance.steps.map((s) => s.stepNumber));
    const target = Math.min(Math.max(1, stepNumber || 1), maxStep);

    await this.applyStepLayout(instance.id, instance.steps, target, {
      completeAsApproved: false,
      template: instance.template,
    });

    const updated = await this.prisma.workflowInstance.update({
      where: { id: instance.id },
      data: {
        status: WorkflowStatus.IN_PROGRESS,
        currentStepNumber: target,
        completedAt: null,
      },
      include: { steps: { orderBy: { stepNumber: 'asc' } } },
    });

    await this.linkDocumentWorkflow(documentType, documentId, updated.id);
    await this.syncDocumentStatus(
      documentType,
      documentId,
      DocumentStatus.SUBMITTED,
    );

    await this.logAdminOverride({
      instanceId: updated.id,
      actorId,
      comment: text,
      action: WorkflowAction.COMMENT,
      newValues: {
        override: 'REOPEN',
        stepNumber: target,
        note: 'Reopen does not reverse budget commits or journal entries',
      },
    });

    return updated;
  }

  private async loadInstanceForAdmin(instanceId: string) {
    const instance = await this.prisma.workflowInstance.findUnique({
      where: { id: instanceId },
      include: {
        template: { include: { steps: { orderBy: { stepNumber: 'asc' } } } },
        steps: { orderBy: { stepNumber: 'asc' } },
      },
    });
    if (!instance) throw new NotFoundException('Workflow instance not found');
    return instance;
  }

  private async applyStepLayout(
    instanceId: string,
    steps: Array<{ id: string; stepNumber: number }>,
    targetStep: number,
    opts: {
      completeAsApproved: boolean;
      template: { steps: Array<{ stepNumber: number; slaHours: number }> };
    },
  ) {
    for (const step of steps) {
      if (opts.completeAsApproved) {
        await this.prisma.workflowInstanceStep.update({
          where: { id: step.id },
          data: {
            status: StepStatus.APPROVED,
            completedAt: new Date(),
            startedAt: step.stepNumber === 1 ? new Date() : undefined,
          },
        });
        continue;
      }

      if (step.stepNumber < targetStep) {
        await this.prisma.workflowInstanceStep.update({
          where: { id: step.id },
          data: {
            status: StepStatus.APPROVED,
            completedAt: new Date(),
            startedAt: new Date(),
          },
        });
      } else if (step.stepNumber === targetStep) {
        const templateStep = opts.template.steps.find(
          (s) => s.stepNumber === step.stepNumber,
        );
        const slaHours = templateStep?.slaHours ?? 48;
        await this.prisma.workflowInstanceStep.update({
          where: { id: step.id },
          data: {
            status: StepStatus.IN_PROGRESS,
            startedAt: new Date(),
            completedAt: null,
            action: null,
            comment: null,
            dueAt: new Date(Date.now() + slaHours * 60 * 60 * 1000),
          },
        });
      } else {
        await this.prisma.workflowInstanceStep.update({
          where: { id: step.id },
          data: {
            status: StepStatus.PENDING,
            startedAt: null,
            completedAt: null,
            action: null,
            comment: null,
            dueAt: null,
          },
        });
      }
    }
  }

  private async assertDocumentCanReopen(documentType: string, documentId: string) {
    const meta = await this.resolveDocumentMetadata(documentType, documentId);
    if (!meta) throw new NotFoundException('Document not found');

    const status = String((meta as { status?: string }).status || '').toUpperCase();

    if (status === DocumentStatus.CANCELLED || status === DocumentStatus.ARCHIVED) {
      throw new BadRequestException(`Cannot reopen a ${status} document`);
    }

    if (documentType === 'PAYMENT_VOUCHER' && status === DocumentStatus.CLOSED) {
      throw new BadRequestException(
        'Cannot reopen a CLOSED (paid) payment voucher — accounting has already been posted',
      );
    }

    if (
      documentType === 'PURCHASE_ORDER' &&
      (status === DocumentStatus.ISSUED || status === DocumentStatus.CLOSED)
    ) {
      throw new BadRequestException(
        `Cannot reopen a ${status} purchase order without reversing procurement effects`,
      );
    }

    if (documentType === 'VENDOR_INVOICE' && status === 'PAID') {
      throw new BadRequestException(
        'Cannot reopen a PAID vendor invoice without reversing payment effects',
      );
    }
  }

  private async syncDocumentStatus(
    documentType: string,
    documentId: string,
    status: DocumentStatus,
  ) {
    switch (documentType) {
      case 'PURCHASE_REQUISITION':
        await this.prisma.purchaseRequisition.update({
          where: { id: documentId },
          data: { status },
        });
        break;
      case 'PURCHASE_ORDER':
        await this.prisma.purchaseOrder.update({
          where: { id: documentId },
          data: { status },
        });
        break;
      case 'GOODS_RECEIPT':
        await this.prisma.goodsReceipt.update({
          where: { id: documentId },
          data: { status },
        });
        break;
      case 'VENDOR_INVOICE': {
        const invoiceStatus =
          status === DocumentStatus.APPROVED
            ? InvoiceStatus.APPROVED
            : status === DocumentStatus.RETURNED || status === DocumentStatus.REJECTED
              ? InvoiceStatus.RECEIVED
              : InvoiceStatus.MATCHED;
        await this.prisma.vendorInvoice.update({
          where: { id: documentId },
          data: { status: invoiceStatus },
        });
        break;
      }
      case 'PAYMENT_REQUEST':
        await this.prisma.paymentRequest.update({
          where: { id: documentId },
          data: { status },
        });
        break;
      case 'PAYMENT_VOUCHER':
        await this.prisma.paymentVoucher.update({
          where: { id: documentId },
          data: { status },
        });
        break;
      default:
        this.logger.warn(`No document sync for type ${documentType}`);
    }
  }

  private async linkDocumentWorkflow(
    documentType: string,
    documentId: string,
    workflowInstanceId: string,
  ) {
    const data = { workflowInstanceId };
    switch (documentType) {
      case 'PURCHASE_REQUISITION':
        await this.prisma.purchaseRequisition.update({
          where: { id: documentId },
          data,
        });
        break;
      case 'PURCHASE_ORDER':
        await this.prisma.purchaseOrder.update({
          where: { id: documentId },
          data,
        });
        break;
      case 'GOODS_RECEIPT':
        await this.prisma.goodsReceipt.update({
          where: { id: documentId },
          data,
        });
        break;
      case 'VENDOR_INVOICE':
        await this.prisma.vendorInvoice.update({
          where: { id: documentId },
          data,
        });
        break;
      case 'PAYMENT_REQUEST':
        await this.prisma.paymentRequest.update({
          where: { id: documentId },
          data,
        });
        break;
      case 'PAYMENT_VOUCHER':
        await this.prisma.paymentVoucher.update({
          where: { id: documentId },
          data,
        });
        break;
      default:
        break;
    }
  }

  private async logAdminOverride(opts: {
    instanceId: string;
    instanceStepId?: string;
    actorId: string;
    comment: string;
    action: WorkflowAction;
    newValues: Record<string, unknown>;
  }) {
    await this.prisma.workflowActionLog.create({
      data: {
        instanceId: opts.instanceId,
        instanceStepId: opts.instanceStepId,
        actorId: opts.actorId,
        action: opts.action,
        comment: `[OVERRIDE] ${opts.comment}`,
        actionAt: new Date(),
      },
    });

    await this.auditService.log({
      userId: opts.actorId,
      action: AuditAction.UPDATE,
      module: 'WORKFLOW',
      resource: 'WorkflowInstance',
      resourceId: opts.instanceId,
      newValues: { ...opts.newValues, comment: opts.comment },
    });
  }
}
