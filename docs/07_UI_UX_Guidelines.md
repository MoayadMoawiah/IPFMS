# 07 — UI/UX Guidelines

## G-GPFMS Design System & UI/UX Specification

---

## Brand Identity

| Element | Value |
|---|---|
| Organization | Gaderon Organization for Development |
| Primary Color | `#00AEEF` (Gaderon Sky Blue) |
| Secondary Color | `#0089C9` (Deep Blue) |
| Success | `#10B981` (Emerald) |
| Warning | `#F59E0B` (Amber) |
| Danger | `#EF4444` (Red) |
| Info | `#6366F1` (Indigo) |
| Card Radius | 16px (`rounded-2xl`) |
| Logo | `/public/brand/gaderon-logo.png` |
| Primary Font (EN) | Inter (Google Fonts) |
| Arabic Font | Cairo (Google Fonts) |

---

## CSS Design Tokens

```css
/* globals.css */
:root {
  --primary: #00AEEF;
  --primary-dark: #0089C9;
  --primary-light: #33BFEF;
  --secondary: #0089C9;
  --background: #F7FAFC;
  --card: #FFFFFF;
  --border: #E5E7EB;
  --muted: #F3F4F6;
  --muted-foreground: #6B7280;
  --foreground: #111827;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --info: #6366F1;
  --radius: 1rem;
}

.dark {
  --primary: #33BFEF;
  --background: #0F172A;
  --card: #1E293B;
  --border: #334155;
  --muted: #1E293B;
  --muted-foreground: #94A3B8;
  --foreground: #F8FAFC;
}
```

---

## Layout System

### App Shell
- **Sidebar:** Fixed 260px width, collapsible to 64px icon-only mode
- **Top Navigation:** Sticky 64px height; logo, search, grant/year selector, notifications, user menu
- **Content Area:** `max-w-[1600px]` centered, scrollable, 24px padding
- **Mobile:** Sidebar becomes Sheet (off-canvas drawer), breakpoint at `lg` (1024px)

### Page Structure
Every page uses:
```tsx
<PageHeader title="..." subtitle="..." actions={[...]} />
<div className="space-y-6">
  {/* KPI/summary row */}
  {/* Main content (tables, forms, charts) */}
</div>
```

---

## Component Library

### Shared Components (already built in prototype)

| Component | File | Usage |
|---|---|---|
| `PageHeader` | `components/layout/page-header.tsx` | Every page: title + breadcrumb + actions |
| `StatCard` | `components/shared/stat-card.tsx` | KPI cards on dashboards |
| `DataTable` | `components/shared/data-table.tsx` | TanStack Table wrapper: search, pagination |
| `StatusBadge` | `components/shared/status-badge.tsx` | Document status color map |
| `EmptyState` | `components/shared/empty-state.tsx` | Zero result states |
| `ConfirmDialog` | `components/shared/confirm-dialog.tsx` | Destructive action guard |
| `LoadingSkeleton` | `components/shared/loading-skeleton.tsx` | Loading states |

### Status Badge Colors

| Status | Color | Class |
|---|---|---|
| DRAFT | Gray | `bg-gray-100 text-gray-700` |
| SUBMITTED | Blue | `bg-blue-100 text-blue-700` |
| RETURNED | Orange | `bg-orange-100 text-orange-700` |
| APPROVED | Green | `bg-green-100 text-green-700` |
| REJECTED | Red | `bg-red-100 text-red-700` |
| CANCELLED | Gray | `bg-gray-100 text-gray-500` |
| CLOSED | Teal | `bg-teal-100 text-teal-700` |
| ARCHIVED | Purple | `bg-purple-100 text-purple-700` |
| ACTIVE | Green | `bg-green-100 text-green-700` |
| PENDING | Yellow | `bg-yellow-100 text-yellow-700` |
| ISSUED | Indigo | `bg-indigo-100 text-indigo-700` |
| PAID | Emerald | `bg-emerald-100 text-emerald-700` |

---

## Form Design Rules

1. **Layout:** 2-column grid on desktop, 1-column on mobile
2. **Labels:** Always above the input (not floating)
3. **Required indicator:** Red asterisk `*` after label
4. **Error messages:** Red text below field, with icon
5. **Helper text:** Muted gray below field
6. **Multi-step forms:** Step indicator at top; validate each step before Next
7. **Monetary inputs:** Always show currency symbol; right-aligned input
8. **Date inputs:** Use calendar picker component; format DD/MM/YYYY for display
9. **File uploads:** Drag-and-drop zone + browse button; show file list with remove option
10. **Submit buttons:** Primary brand color; disabled while loading; show spinner

---

## Data Table Rules

1. **Columns:** Max 8 visible columns; remaining in expandable row or detail view
2. **Sorting:** Click column header to sort; chevron icon shows direction
3. **Filtering:** Filter bar above table; active filters shown as removable chips
4. **Search:** Debounced (300ms) server-side search
5. **Pagination:** Show "Showing X–Y of Z results"; 20 per page default; 50/100 options
6. **Row actions:** Three-dot menu with: View, Edit, Submit, Approve, Reject, Export PDF, Delete
7. **Bulk actions:** Checkbox column; bulk export, bulk approve where applicable
8. **Empty state:** Centered illustration + "No records found" + Create button
9. **Loading:** Skeleton rows (5 rows) while fetching

---

## Document Detail Page Layout

```
┌─────────────────────────────────────────────────┐
│  PageHeader: Document Number + Status Badge      │
│  Actions: Edit | Submit | Approve | Export PDF   │
├─────────────────┬───────────────────────────────┤
│  Main Content   │  Right Panel (sidebar)          │
│  - Summary card │  - Workflow/Approval Timeline   │
│  - Items table  │  - Digital Signatures           │
│  - Notes        │  - Budget Impact                │
│                 │  - Related Documents            │
│                 │  - Comments                     │
├─────────────────┴───────────────────────────────┤
│  Tabs: Details | History | Audit | Attachments   │
└─────────────────────────────────────────────────┘
```

---

## Approval Timeline Component

Displays workflow progress vertically:
```
✅ Step 1: Submitted by Ahmed Ali    [2026-01-15 09:30]
   "Initial submission for office supplies"

✅ Step 2: Reviewed by Dept. Head   [2026-01-16 11:00]
   "Approved, budget is available"
   🔏 Digital Signature: 197.x.x.x | Chrome 120

⏳ Step 3: Finance Review           [Pending - Due 2026-01-18]
   Assigned to: Finance Manager

⬜ Step 4: Country Director         [Waiting]
```

---

## Dashboard Layouts

### Executive Dashboard
- Row 1: 4 KPI cards (Active Grants, Total Budget, Spent, Available)
- Row 2: 4 KPI cards (Open PRs, Pending POs, Pending Payments, Inventory Value)
- Row 3: Budget vs Actual bar chart (L) + Grant Utilization donut (R)
- Row 4: Monthly Spending line + Procurement Status bar
- Row 5: Recent Activities timeline + Quick Actions grid
- Row 6: Pending Approvals list

### Finance Dashboard
- Budget utilization per grant
- AP aging chart
- Cash position by bank account
- Monthly journal entry count
- Pending payment vouchers

### Procurement Dashboard
- PR status funnel chart
- PO value by vendor (top 10)
- Procurement method distribution
- Pending approvals queue
- Vendor performance radar

---

## Animation Guidelines (Framer Motion)

Use ONLY these presets from `src/lib/motion.ts`:
```typescript
fadeIn: { opacity: 0 → 1, duration: 0.3 }
slideUp: { y: 20 → 0, opacity: 0 → 1, duration: 0.4 }
scaleIn: { scale: 0.95 → 1, opacity: 0 → 1, duration: 0.2 }
staggerContainer: { staggerChildren: 0.1 }
```

**Apply to:** Page mount, card entrance, sidebar collapse/expand, dialog open.  
**Do NOT animate:** Table rows individually, form fields, status changes.

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|---|---|---|
| `sm` | 640px | Single column; mobile nav sheet |
| `md` | 768px | 2-column KPI grid |
| `lg` | 1024px | Sidebar visible; 3–4 column KPI |
| `xl` | 1280px | Full desktop layout |
| `2xl` | 1536px | Max content width applied |

---

## Accessibility (WCAG 2.1 AA)

- All interactive elements keyboard-navigable
- Focus rings visible (not hidden with `outline: none`)
- Color contrast ≥ 4.5:1 for body text
- Form errors associated with inputs via `aria-describedby`
- Tables have `<caption>` and `scope` headers
- Icons paired with visible text or `aria-label`
- Modal dialogs trap focus; Escape closes
- Skip navigation link at page top

---

## Print Styles

PO, Payment Voucher, Cheque, GRN pages have print-specific CSS:
- Sidebar and top nav hidden (`@media print { .no-print { display: none } }`)
- White background, black text
- Page breaks before signature section
- QR code prominent
- Organization logo full-size at top
- Footer with page numbers

---

## RTL / Arabic Support (Ready, Not Activated)

- Cairo font loaded globally in root layout
- Language switcher in top nav (disabled, placeholder)
- `next-intl` to be added in Phase 6
- All layout uses CSS logical properties (`ms-`, `me-`, `ps-`, `pe-`) where possible
- Recharts charts are direction-agnostic
- `dir="rtl"` applied to `<html>` when Arabic is selected
