import type { User, AuditLog } from "@/types";

export const systemUsers: User[] = [
  { id: "u-1", name: "Moayad M.", email: "moayad@gaderon.org", role: "Finance Manager", department: "Finance", status: "active", lastLogin: "2025-05-19 09:15" },
  { id: "u-2", name: "Sarah Al-Hassan", email: "sarah@gaderon.org", role: "Finance Officer", department: "Finance", status: "active", lastLogin: "2025-05-19 08:45" },
  { id: "u-3", name: "Dr. Omar Khalil", email: "omar@gaderon.org", role: "Program Manager", department: "Health", status: "active", lastLogin: "2025-05-18 16:30" },
  { id: "u-4", name: "Hassan Mahmoud", email: "hassan@gaderon.org", role: "Program Manager", department: "WASH", status: "active", lastLogin: "2025-05-19 07:20" },
  { id: "u-5", name: "Layla Ahmad", email: "layla@gaderon.org", role: "Program Officer", department: "Education", status: "active", lastLogin: "2025-05-17 14:00" },
  { id: "u-6", name: "Ahmed Saleh", email: "ahmed@gaderon.org", role: "Procurement Officer", department: "Procurement", status: "active", lastLogin: "2025-05-19 10:00" },
  { id: "u-7", name: "Khalid Nasser", email: "khalid@gaderon.org", role: "Logistics Manager", department: "Logistics", status: "active", lastLogin: "2025-05-16 11:30" },
  { id: "u-8", name: "Nadia Farouk", email: "nadia@gaderon.org", role: "Program Officer", department: "Protection", status: "inactive", lastLogin: "2025-04-20 09:00" },
];

export const auditLogs: AuditLog[] = [
  { id: "al-001", timestamp: "2025-05-19 10:32", user: "Moayad M.", action: "Approved", module: "Payment Voucher", details: "Approved PV-2025-0313 for $35,600", ipAddress: "192.168.1.45" },
  { id: "al-002", timestamp: "2025-05-19 09:15", user: "Ahmed Saleh", action: "Created", module: "Purchase Requisition", details: "Created PR-2025-0156 for office equipment", ipAddress: "192.168.1.52" },
  { id: "al-003", timestamp: "2025-05-18 16:45", user: "Sarah Al-Hassan", action: "Reviewed", module: "Payment Voucher", details: "Reviewed PV-2025-0312 - documents verified", ipAddress: "192.168.1.48" },
  { id: "al-004", timestamp: "2025-05-18 14:20", user: "Hassan Mahmoud", action: "Submitted", module: "Goods Receipt", details: "Submitted GRN-2025-0198 for PO-2025-0846", ipAddress: "192.168.1.61" },
  { id: "al-005", timestamp: "2025-05-17 11:00", user: "Moayad M.", action: "Login", module: "Authentication", details: "Successful login from desktop", ipAddress: "192.168.1.45" },
  { id: "al-006", timestamp: "2025-05-17 10:30", user: "Dr. Omar Khalil", action: "Approved", module: "Purchase Requisition", details: "Approved PR-2025-0155 for medical supplies", ipAddress: "192.168.1.55" },
  { id: "al-007", timestamp: "2025-05-16 15:45", user: "System", action: "Export", module: "Reports", details: "Generated Q1 Financial Report (PDF)", ipAddress: "System" },
  { id: "al-008", timestamp: "2025-05-16 09:00", user: "Layla Ahmad", action: "Updated", module: "Project Activity", details: "Updated progress for Temporary Learning Spaces to 18%", ipAddress: "192.168.1.58" },
];
