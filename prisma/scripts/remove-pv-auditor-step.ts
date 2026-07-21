/**
 * One-off: remove Internal Auditor step from Payment Voucher workflow template
 * and migrate open PAYMENT_VOUCHER instances to Finance → Country Director.
 *
 * Run from backend: npx tsx ../prisma/scripts/remove-pv-auditor-step.ts
 */
import { PrismaClient, StepStatus, WorkflowStatus } from '@prisma/client';

const prisma = new PrismaClient();

const TEMPLATE_ID = 'wf-pv';
const AUDITOR_STEP_NAME = 'Internal Auditor Compliance Check';
const CD_STEP_NAME = 'Country Director Authorize Payment';
const CD_ROLE_ID = 'role-country-director';

async function updateTemplate() {
  await prisma.workflowStep.upsert({
    where: {
      templateId_stepNumber: { templateId: TEMPLATE_ID, stepNumber: 2 },
    },
    update: {
      name: CD_STEP_NAME,
      approverRoleId: CD_ROLE_ID,
      slaHours: 48,
      escalationHours: 72,
      allowReturn: true,
      allowReject: true,
    },
    create: {
      templateId: TEMPLATE_ID,
      stepNumber: 2,
      name: CD_STEP_NAME,
      approverRoleId: CD_ROLE_ID,
      slaHours: 48,
      escalationHours: 72,
      allowReturn: true,
      allowReject: true,
      isParallel: false,
      isMandatory: true,
      allowDelegate: true,
    },
  });

  const deleted = await prisma.workflowStep.deleteMany({
    where: {
      templateId: TEMPLATE_ID,
      stepNumber: { gt: 2 },
    },
  });

  console.log(`Template wf-pv: step 2 → Country Director; deleted ${deleted.count} extra step(s)`);
}

async function migrateInstances() {
  const instances = await prisma.workflowInstance.findMany({
    where: {
      documentType: 'PAYMENT_VOUCHER',
      status: { in: [WorkflowStatus.IN_PROGRESS, WorkflowStatus.PENDING] },
    },
    include: { steps: { orderBy: { stepNumber: 'asc' } } },
  });

  let migrated = 0;

  for (const instance of instances) {
    const auditorStep = instance.steps.find(
      (s) =>
        s.stepName === AUDITOR_STEP_NAME ||
        (s.stepNumber === 2 && s.assignedRoleId === 'role-auditor'),
    );
    if (!auditorStep && instance.steps.length <= 2) continue;

    const wasOnAuditor =
      instance.currentStepNumber === auditorStep?.stepNumber &&
      auditorStep?.status === StepStatus.IN_PROGRESS;

    if (auditorStep) {
      await prisma.workflowInstanceStep.delete({ where: { id: auditorStep.id } });
    }

    // Renumber any step > auditor step number down by 1 (typically CD was 3 → 2).
    const remaining = await prisma.workflowInstanceStep.findMany({
      where: { instanceId: instance.id },
      orderBy: { stepNumber: 'asc' },
    });

    for (const step of remaining) {
      if (auditorStep && step.stepNumber > auditorStep.stepNumber) {
        await prisma.workflowInstanceStep.update({
          where: { id: step.id },
          data: {
            stepNumber: step.stepNumber - 1,
            ...(step.stepName.includes('Country Director')
              ? { assignedRoleId: CD_ROLE_ID, stepName: CD_STEP_NAME }
              : {}),
          },
        });
      }
    }

    const stepsAfter = await prisma.workflowInstanceStep.findMany({
      where: { instanceId: instance.id },
      orderBy: { stepNumber: 'asc' },
    });

    let nextCurrent = instance.currentStepNumber;
    if (wasOnAuditor) {
      // Jump to Country Director (now step 2).
      nextCurrent = 2;
      const cd = stepsAfter.find((s) => s.stepNumber === 2);
      if (cd) {
        await prisma.workflowInstanceStep.update({
          where: { id: cd.id },
          data: {
            status: StepStatus.IN_PROGRESS,
            startedAt: cd.startedAt ?? new Date(),
            dueAt: cd.dueAt ?? new Date(Date.now() + 48 * 60 * 60 * 1000),
          },
        });
      }
    } else if (auditorStep && instance.currentStepNumber > auditorStep.stepNumber) {
      nextCurrent = instance.currentStepNumber - 1;
    }

    if (nextCurrent !== instance.currentStepNumber) {
      await prisma.workflowInstance.update({
        where: { id: instance.id },
        data: { currentStepNumber: nextCurrent },
      });
    }

    migrated += 1;
  }

  console.log(`Migrated ${migrated} open Payment Voucher workflow instance(s)`);
}

async function main() {
  const template = await prisma.workflowTemplate.findUnique({
    where: { id: TEMPLATE_ID },
    include: { steps: { orderBy: { stepNumber: 'asc' } } },
  });
  if (!template) {
    console.error('Template wf-pv not found — run seed first or check template id.');
    process.exit(1);
  }

  console.log(
    'Before:',
    template.steps.map((s) => `${s.stepNumber}. ${s.name}`).join(' → '),
  );

  await updateTemplate();
  await migrateInstances();

  const after = await prisma.workflowTemplate.findUnique({
    where: { id: TEMPLATE_ID },
    include: { steps: { orderBy: { stepNumber: 'asc' } } },
  });
  console.log(
    'After:',
    after?.steps.map((s) => `${s.stepNumber}. ${s.name}`).join(' → '),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
