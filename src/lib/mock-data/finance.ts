import type {
  PaymentVoucher,
  Cheque,
  BankTransfer,
  JournalEntry,
  GLAccount,
} from "@/types";

export const paymentVouchers: PaymentVoucher[] = [
  {
    id: "pv-001",
    number: "PV-2025-0312",
    payee: "Al-Nour Medical Supplies",
    grantId: "gr-003",
    grantName: "Primary Health Care Support",
    amount: 24500,
    currency: "USD",
    paymentMethod: "bank_transfer",
    status: "paid",
    requestDate: "2025-05-16",
    description: "Partial payment for PO-2025-0847 - First Aid Kits delivery",
    poReference: "PO-2025-0847",
    approvalSteps: [
      { stage: "Submitted", approver: "Dr. Omar Khalil", role: "Program Manager", date: "2025-05-16", status: "completed" },
      { stage: "Reviewed", approver: "Sarah Al-Hassan", role: "Finance Officer", date: "2025-05-17", status: "completed", comment: "Documents verified" },
      { stage: "Approved", approver: "Moayad M.", role: "Finance Manager", date: "2025-05-17", status: "completed" },
      { stage: "Paid", approver: "System", role: "Automated", date: "2025-05-18", status: "completed" },
    ],
  },
  {
    id: "pv-002",
    number: "PV-2025-0313",
    payee: "Damascus Water Tech",
    grantId: "gr-002",
    grantName: "Water & Sanitation Infrastructure",
    amount: 35600,
    currency: "USD",
    paymentMethod: "cheque",
    status: "approved",
    requestDate: "2025-05-18",
    description: "Full payment for PO-2025-0846 - WASH supplies",
    poReference: "PO-2025-0846",
    approvalSteps: [
      { stage: "Submitted", approver: "Hassan Mahmoud", role: "Program Manager", date: "2025-05-18", status: "completed" },
      { stage: "Reviewed", approver: "Sarah Al-Hassan", role: "Finance Officer", date: "2025-05-19", status: "completed" },
      { stage: "Approved", approver: "Moayad M.", role: "Finance Manager", date: "2025-05-19", status: "current" },
      { stage: "Paid", approver: "—", role: "Pending", status: "pending" },
    ],
  },
  {
    id: "pv-003",
    number: "PV-2025-0314",
    payee: "Field Staff - May Allowances",
    grantId: "gr-001",
    grantName: "Emergency Food Security Response",
    amount: 8200,
    currency: "USD",
    paymentMethod: "cash",
    status: "submitted",
    requestDate: "2025-05-19",
    description: "Monthly field staff allowances - May 2025",
    approvalSteps: [
      { stage: "Submitted", approver: "Sarah Al-Hassan", role: "HR Officer", date: "2025-05-19", status: "current" },
      { stage: "Reviewed", approver: "—", role: "Finance Officer", status: "pending" },
      { stage: "Approved", approver: "—", role: "Finance Manager", status: "pending" },
      { stage: "Paid", approver: "—", role: "Pending", status: "pending" },
    ],
  },
];

export const cheques: Cheque[] = [
  { id: "ch-001", number: "CHQ-4521", payee: "Damascus Water Tech", amount: 35600, currency: "USD", issueDate: "2025-05-20", status: "pending", bankAccount: "CBS - Operating Account" },
  { id: "ch-002", number: "CHQ-4520", payee: "Al-Nour Medical Supplies", amount: 24500, currency: "USD", issueDate: "2025-05-18", status: "cleared", bankAccount: "CBS - Operating Account" },
  { id: "ch-003", number: "CHQ-4519", payee: "Office Supplies Co.", amount: 3200, currency: "USD", issueDate: "2025-05-10", status: "cleared", bankAccount: "CBS - Operating Account" },
  { id: "ch-004", number: "CHQ-4518", payee: "Cancelled Vendor", amount: 1500, currency: "USD", issueDate: "2025-05-05", status: "cancelled", bankAccount: "CBS - Operating Account" },
];

export const bankTransfers: BankTransfer[] = [
  { id: "bt-001", reference: "TRF-2025-0892", beneficiary: "Al-Nour Medical Supplies", amount: 24500, currency: "USD", transferDate: "2025-05-18", status: "completed", bankName: "Commercial Bank of Syria" },
  { id: "bt-002", reference: "TRF-2025-0893", beneficiary: "MedTech International", amount: 12800, currency: "USD", transferDate: "2025-05-19", status: "processing", bankName: "Commercial Bank of Syria" },
  { id: "bt-003", reference: "TRF-2025-0894", beneficiary: "UN Agency Refund", amount: 5000, currency: "USD", transferDate: "2025-05-20", status: "pending", bankName: "Bank of Syria" },
];

export const journalEntries: JournalEntry[] = [
  { id: "je-001", date: "2025-05-18", reference: "PV-2025-0312", description: "Payment to Al-Nour Medical Supplies", debit: 24500, credit: 0, account: "5100 - Medical Supplies Expense" },
  { id: "je-002", date: "2025-05-18", reference: "PV-2025-0312", description: "Payment to Al-Nour Medical Supplies", debit: 0, credit: 24500, account: "1010 - Bank Operating Account" },
  { id: "je-003", date: "2025-05-20", reference: "GRN-2025-0198", description: "Goods receipt - Hygiene kits", debit: 14000, credit: 0, account: "1300 - Inventory" },
  { id: "je-004", date: "2025-05-20", reference: "GRN-2025-0198", description: "Goods receipt - Hygiene kits", debit: 0, credit: 14000, account: "2100 - Accounts Payable" },
];

export const generalLedger: GLAccount[] = [
  {
    id: "gl-1000",
    code: "1000",
    name: "Assets",
    type: "asset",
    balance: 1245800,
    children: [
      { id: "gl-1010", code: "1010", name: "Bank Operating Account", type: "asset", balance: 892400 },
      { id: "gl-1300", code: "1300", name: "Inventory", type: "asset", balance: 89400 },
      { id: "gl-1400", code: "1400", name: "Accounts Receivable", type: "asset", balance: 264000 },
    ],
  },
  {
    id: "gl-2000",
    code: "2000",
    name: "Liabilities",
    type: "liability",
    balance: 385200,
    children: [
      { id: "gl-2100", code: "2100", name: "Accounts Payable", type: "liability", balance: 245800 },
      { id: "gl-2200", code: "2200", name: "Accrued Expenses", type: "liability", balance: 139400 },
    ],
  },
  {
    id: "gl-5000",
    code: "5000",
    name: "Expenses",
    type: "expense",
    balance: 780500,
    children: [
      { id: "gl-5100", code: "5100", name: "Program Expenses", type: "expense", balance: 620000 },
      { id: "gl-5200", code: "5200", name: "Administrative Expenses", type: "expense", balance: 98500 },
      { id: "gl-5300", code: "5300", name: "Personnel Costs", type: "expense", balance: 62000 },
    ],
  },
];

export function getPaymentVoucherById(id: string) {
  return paymentVouchers.find((pv) => pv.id === id);
}
