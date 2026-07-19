/** Map API list records to UI-friendly shapes used by DataTable columns. */

export function mapPaymentVoucherRow(pv: Record<string, unknown>) {
  const grant = pv.grant as { code?: string } | undefined;
  return {
    id: pv.id as string,
    pvNumber: (pv.serialNumber as string) ?? (pv.pvNumber as string) ?? "—",
    payee: (pv.payeeName as string) ?? (pv.payee as string),
    description: pv.description as string | undefined,
    amount: Number(pv.amount) || 0,
    currency: (pv.currency as string) ?? "USD",
    status: pv.status as string,
    grantCode: grant?.code,
    createdAt: pv.createdAt as string,
  };
}

export function mapPurchaseOrderRow(po: Record<string, unknown>) {
  const vendor = po.vendor as { name?: string } | undefined;
  const grant = po.grant as { code?: string } | undefined;
  return {
    id: po.id as string,
    poNumber: (po.serialNumber as string) ?? (po.poNumber as string) ?? "—",
    vendorName: vendor?.name ?? (po.vendorName as string),
    grantCode: grant?.code ?? (po.grantCode as string),
    totalAmount: Number(po.totalAmount) || 0,
    currency: (po.currency as string) ?? "USD",
    status: po.status as string,
    deliveryDate: po.deliveryDate as string | undefined,
    createdAt: po.createdAt as string,
  };
}

export function mapRfqRow(rfq: Record<string, unknown>) {
  const grant = rfq.grant as { code?: string; name?: string } | undefined;
  const pr = rfq.pr as { serialNumber?: string } | undefined;
  const count = rfq._count as { vendors?: number; pafForms?: number } | undefined;
  return {
    id: rfq.id as string,
    number: (rfq.serialNumber as string) ?? "—",
    title: rfq.title as string,
    grantName: grant?.code ?? grant?.name ?? "—",
    prNumber: pr?.serialNumber,
    deadline: rfq.submissionDeadline as string,
    status: (rfq.status as string).toLowerCase(),
    vendorCount: count?.vendors ?? 0,
    pafCount: count?.pafForms ?? 0,
    createdAt: rfq.createdAt as string,
  };
}

export function mapPurchaseRequisitionRow(pr: Record<string, unknown>) {
  const grant = pr.grant as { code?: string } | undefined;
  const requestedBy = pr.requestedBy as
    | { firstName?: string; lastName?: string }
    | undefined;
  const approvalContext = pr.approvalContext as
    | { waitingForRoleName?: string | null; waitingForStepName?: string | null }
    | null
    | undefined;
  return {
    id: pr.id as string,
    prNumber: (pr.serialNumber as string) ?? (pr.prNumber as string) ?? "—",
    title: pr.title as string,
    grantCode: grant?.code ?? (pr.grantCode as string),
    departmentName: (pr.departmentName as string) ?? "—",
    totalAmount: Number(pr.totalEstimatedAmount ?? pr.totalAmount) || 0,
    currency: (pr.currency as string) ?? "USD",
    status: pr.status as string,
    createdAt: pr.createdAt as string,
    waitingForRoleName: approvalContext?.waitingForRoleName ?? null,
    requester: requestedBy
      ? { firstName: requestedBy.firstName ?? "", lastName: requestedBy.lastName ?? "" }
      : undefined,
  };
}

export function mapInventoryItemRow(item: Record<string, unknown>) {
  const category = item.category as { name?: string } | undefined;
  const warehouse = item.warehouse as { name?: string } | undefined;
  return {
    id: item.id as string,
    sku: item.sku as string | undefined,
    name: item.name as string,
    category: category?.name ? { name: category.name } : undefined,
    warehouseName: warehouse?.name ?? (item.warehouseName as string),
    currentStock: Number(item.currentStock) || 0,
    unit: item.unit as string,
    unitCost: Number(item.unitCost) || 0,
    currency: (item.currency as string) ?? "USD",
    reorderPoint: Number(item.reorderLevel ?? item.reorderPoint) || 0,
    status: item.status as string | undefined,
  };
}

export function mapJournalEntryRow(je: Record<string, unknown>) {
  const grant = je.grant as { code?: string } | undefined;
  return {
    id: je.id as string,
    jeNumber: (je.serialNumber as string) ?? (je.jeNumber as string) ?? "—",
    postingDate: (je.entryDate as string) ?? (je.postingDate as string),
    createdAt: je.createdAt as string,
    description: je.description as string,
    grant,
    totalDebit: Number(je.totalDebit) || 0,
    totalCredit: Number(je.totalCredit) || 0,
    currency: (je.currency as string) ?? "USD",
    status: je.status as string,
  };
}

export function mapAuditLogRow(log: Record<string, unknown>) {
  const user = log.user as
    | { firstName?: string; lastName?: string; email?: string }
    | undefined;
  return {
    id: log.id as string,
    createdAt: log.createdAt as string,
    user: user
      ? {
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.email ?? "",
        }
      : undefined,
    action: log.action as string,
    module: log.module as string,
    entityId: (log.resourceId as string) ?? (log.entityId as string),
    description: (log.description as string) ?? (log.resource as string),
    ipAddress: log.ipAddress as string | undefined,
    userAgent: log.userAgent as string | undefined,
  };
}

export function mapUserRow(user: Record<string, unknown>) {
  const roles = (user.roles as Array<{ id?: string; name?: string; displayName?: string; role?: { name?: string } }>) ?? [];
  return {
    id: user.id as string,
    firstName: user.firstName as string,
    lastName: user.lastName as string,
    email: user.email as string,
    username: user.username as string | undefined,
    isActive: user.isActive as boolean,
    department: user.department as { name: string } | undefined,
    roles: roles.map((r) => ({
      role: { name: r.role?.name ?? r.displayName ?? r.name ?? "—" },
    })),
    createdAt: user.createdAt as string,
  };
}
