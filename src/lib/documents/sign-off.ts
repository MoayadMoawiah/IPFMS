import { formatDate } from "@/lib/formatters";

export interface SignOffPerson {
  name?: string | null;
  position?: string | null;
  date?: string | Date | null;
  signature?: string | null;
}

export interface OfficialSignOffSlots {
  requestedBy: SignOffPerson;
  checkedBy: SignOffPerson;
  approvedBy: SignOffPerson;
}

export interface WorkflowActorLike {
  firstName?: string | null;
  lastName?: string | null;
  roles?: Array<{ role?: { name?: string | null } | null } | { name?: string | null }>;
}

export interface WorkflowActionLike {
  action?: string | null;
  actionAt?: string | Date | null;
  actor?: WorkflowActorLike | null;
}

export interface WorkflowStepLike {
  stepNumber: number;
  stepName?: string;
  status?: string;
  action?: string | null;
  completedAt?: string | Date | null;
  digitalSignature?: {
    signedAt?: string | Date | null;
    user?: WorkflowActorLike | null;
  } | null;
}

function personName(user?: WorkflowActorLike | null): string {
  if (!user) return "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
}

function personPosition(user?: WorkflowActorLike | null): string {
  if (!user?.roles?.length) return "";
  const first = user.roles[0] as { role?: { name?: string }; name?: string };
  return first?.role?.name ?? first?.name ?? "";
}

function toPerson(
  user?: WorkflowActorLike | null,
  date?: string | Date | null,
): SignOffPerson {
  const name = personName(user);
  return {
    name: name || null,
    position: personPosition(user) || null,
    date: date ?? null,
    signature: name || null,
  };
}

/** Map creator + completed APPROVE actions into Requested / Checked / Approved slots. */
export function buildOfficialSignOff(opts: {
  requestedByUser?: WorkflowActorLike | null;
  requestedAt?: string | Date | null;
  steps?: WorkflowStepLike[] | null;
  actions?: WorkflowActionLike[] | null;
}): OfficialSignOffSlots {
  const requestedBy = toPerson(opts.requestedByUser, opts.requestedAt);

  const approveActions = (opts.actions ?? []).filter(
    (a) => (a.action ?? "").toUpperCase() === "APPROVE" && a.actor,
  );

  // Prefer actions (have actor); fall back to steps with digitalSignature.user
  let checked: SignOffPerson = { name: null, position: null, date: null, signature: null };
  let approved: SignOffPerson = { name: null, position: null, date: null, signature: null };

  if (approveActions.length > 0) {
    const first = approveActions[0];
    const last = approveActions[approveActions.length - 1];
    checked = toPerson(first.actor, first.actionAt);
    approved =
      approveActions.length > 1
        ? toPerson(last.actor, last.actionAt)
        : { name: null, position: null, date: null, signature: null };
  } else {
    const approvedSteps = (opts.steps ?? [])
      .filter((s) => {
        const st = (s.status ?? "").toUpperCase();
        const act = (s.action ?? "").toUpperCase();
        return st === "APPROVED" || act === "APPROVE";
      })
      .sort((a, b) => a.stepNumber - b.stepNumber);

    if (approvedSteps.length > 0) {
      const first = approvedSteps[0];
      checked = toPerson(
        first.digitalSignature?.user,
        first.digitalSignature?.signedAt ?? first.completedAt,
      );
      if (approvedSteps.length > 1) {
        const last = approvedSteps[approvedSteps.length - 1];
        approved = toPerson(
          last.digitalSignature?.user,
          last.digitalSignature?.signedAt ?? last.completedAt,
        );
      }
    }
  }

  return { requestedBy, checkedBy: checked, approvedBy: approved };
}

export function formatSignOffDate(date?: string | Date | null): string {
  if (!date) return "";
  try {
    return formatDate(date);
  } catch {
    return "";
  }
}
