export type GrantStatus = "active" | "closed" | "pending" | "suspended";

export interface Grant {
  id: string;
  name: string;
  code: string;
  donor: string;
  startDate: string;
  endDate: string;
  currency: string;
  totalBudget: number;
  committed: number;
  spent: number;
  available: number;
  utilizationPercent: number;
  status: GrantStatus;
  activitiesCount: number;
  description?: string;
}

export type PRStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "cancelled";

export interface PurchaseRequisition {
  id: string;
  number: string;
  title: string;
  grantId: string;
  grantName: string;
  department: string;
  requestedBy: string;
  requestDate: string;
  totalAmount: number;
  currency: string;
  status: PRStatus;
  itemsCount: number;
}

export type POStatus = "draft" | "issued" | "partial" | "completed" | "cancelled";

export interface PurchaseOrder {
  id: string;
  number: string;
  vendor: string;
  vendorEmail: string;
  vendorPhone: string;
  grantId: string;
  grantName: string;
  issueDate: string;
  deliveryDate: string;
  totalAmount: number;
  currency: string;
  status: POStatus;
  items: POItem[];
  shippingAddress: string;
  bankDetails: string;
  terms: string;
}

export interface POItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface RFQVendor {
  id: string;
  name: string;
  price: number;
  deliveryDays: number;
  warranty: string;
  technicalScore: number;
  committeeScore: number;
  totalScore: number;
  isWinner?: boolean;
  documents: string[];
}

export interface RFQ {
  id: string;
  number: string;
  title: string;
  grantName: string;
  deadline: string;
  status: "open" | "evaluating" | "awarded" | "closed";
  vendors: RFQVendor[];
}

export interface GoodsReceiptItem {
  id: string;
  poNumber: string;
  itemName: string;
  orderedQty: number;
  deliveredQty: number;
  acceptedQty: number;
  rejectedQty: number;
  damagedQty: number;
  unit: string;
  receiptDate: string;
  receivedBy: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  location: string;
  lastUpdated: string;
}

export type PaymentStatus =
  | "draft"
  | "submitted"
  | "reviewed"
  | "approved"
  | "paid"
  | "rejected";

export interface PaymentVoucher {
  id: string;
  number: string;
  payee: string;
  grantId: string;
  grantName: string;
  amount: number;
  currency: string;
  paymentMethod: "cheque" | "bank_transfer" | "cash";
  status: PaymentStatus;
  requestDate: string;
  description: string;
  poReference?: string;
  approvalSteps: ApprovalStep[];
}

export interface ApprovalStep {
  stage: string;
  approver: string;
  role: string;
  date?: string;
  status: "completed" | "current" | "pending";
  comment?: string;
}

export interface Cheque {
  id: string;
  number: string;
  payee: string;
  amount: number;
  currency: string;
  issueDate: string;
  status: "pending" | "issued" | "cleared" | "cancelled";
  bankAccount: string;
}

export interface BankTransfer {
  id: string;
  reference: string;
  beneficiary: string;
  amount: number;
  currency: string;
  transferDate: string;
  status: "pending" | "processing" | "completed" | "failed";
  bankName: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  debit: number;
  credit: number;
  account: string;
}

export interface GLAccount {
  id: string;
  code: string;
  name: string;
  type: "asset" | "liability" | "equity" | "revenue" | "expense";
  balance: number;
  children?: GLAccount[];
}

export interface ProjectActivity {
  id: string;
  title: string;
  grantId: string;
  grantName: string;
  status: "planning" | "in_progress" | "review" | "completed";
  milestone: string;
  budgetAllocated: number;
  budgetSpent: number;
  progress: number;
  responsibleStaff: string;
  startDate: string;
  endDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export interface RecentActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "purchase_order" | "invoice" | "payment" | "goods" | "requisition";
}

export interface DashboardKPI {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  href?: string;
  trend?: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  name: string;
  budget?: number;
  actual?: number;
  spent?: number;
  value?: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: string;
  avatar: string;
}
