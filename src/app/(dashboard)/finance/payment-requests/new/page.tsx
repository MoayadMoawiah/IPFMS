"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useVendorInvoice, useVendorInvoices } from "@/hooks/use-procurement";
import { useCreatePaymentRequest } from "@/hooks/use-finance";
import { getPaginatedItems } from "@/lib/api/pagination";
import { extractApiError } from "@/lib/api-errors";
import { formatCurrency } from "@/lib/formatters";

const PAYMENT_METHODS = [
  { value: "CHEQUE", label: "Cheque" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
] as const;

type VendorBankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban?: string | null;
  swiftCode?: string | null;
  currency?: string;
  isPrimary?: boolean;
};

function NewPaymentRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedInvoiceId = searchParams.get("invoiceId") ?? "";

  const { data: invoicesData } = useVendorInvoices({ limit: 100 });
  const { data: invoiceData, isLoading: loadingInvoice } = useVendorInvoice(
    preselectedInvoiceId,
  );
  const createRequest = useCreatePaymentRequest();

  const eligibleInvoices = useMemo(() => {
    return (
      getPaginatedItems(invoicesData) as Array<{
        id: string;
        serialNumber: string;
        invoiceNumber: string;
        status: string;
        isThreeWayMatched?: boolean;
        totalAmount: number | string;
        paidAmount?: number | string;
        currency: string;
        vendor?: { name?: string };
      }>
    ).filter((inv) => {
      const status = inv.status.toUpperCase();
      return status === "APPROVED" && inv.isThreeWayMatched;
    });
  }, [invoicesData]);

  const prefilledInvoice = invoiceData as
    | {
        id: string;
        serialNumber: string;
        invoiceNumber: string;
        status: string;
        isThreeWayMatched?: boolean;
        totalAmount: number | string;
        paidAmount?: number | string;
        currency: string;
        vendor?: { name?: string; bankAccounts?: VendorBankAccount[] };
        grant?: { code?: string; name?: string };
      }
    | undefined;

  const [invoiceId, setInvoiceId] = useState(preselectedInvoiceId);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CHEQUE");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Cheque fields
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeDate, setChequeDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [payeeName, setPayeeName] = useState("");
  const [memo, setMemo] = useState("");

  // Bank transfer fields
  const [btBankName, setBtBankName] = useState("");
  const [btBankBranch, setBtBankBranch] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [iban, setIban] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  const selected =
    prefilledInvoice && prefilledInvoice.id === invoiceId
      ? prefilledInvoice
      : eligibleInvoices.find((i) => i.id === invoiceId);

  const vendorName = selected?.vendor?.name ?? "";
  const bankAccounts =
    (prefilledInvoice && prefilledInvoice.id === invoiceId
      ? prefilledInvoice.vendor?.bankAccounts
      : undefined) ?? [];

  const remaining = selected
    ? Number(selected.totalAmount) - Number(selected.paidAmount || 0)
    : 0;
  const currency = selected?.currency || "USD";
  const invoiceEligible =
    selected &&
    selected.status.toUpperCase() === "APPROVED" &&
    Boolean(selected.isThreeWayMatched);

  useEffect(() => {
    if (!vendorName) return;
    setPayeeName((prev) => prev || vendorName);
    setAccountName((prev) => prev || vendorName);
  }, [vendorName]);

  useEffect(() => {
    if (paymentMethod !== "BANK_TRANSFER" || bankAccounts.length === 0) return;
    const primary = bankAccounts.find((a) => a.isPrimary) ?? bankAccounts[0];
    setBtBankName((prev) => prev || primary.bankName || "");
    setAccountNumber((prev) => prev || primary.accountNumber || "");
    setAccountName((prev) => prev || primary.accountName || vendorName);
    setIban((prev) => prev || primary.iban || "");
    setSwiftCode((prev) => prev || primary.swiftCode || "");
  }, [paymentMethod, bankAccounts, vendorName]);

  const buildMethodDetails = (): Record<string, unknown> | null => {
    if (paymentMethod === "CHEQUE") {
      if (!bankName.trim() || !bankBranch.trim() || !chequeNumber.trim()) {
        setError("Cheque requires bank name, bank branch, and cheque serial number");
        return null;
      }
      return {
        bankName: bankName.trim(),
        bankBranch: bankBranch.trim(),
        chequeNumber: chequeNumber.trim(),
        chequeDate: chequeDate || null,
        payeeName: payeeName.trim() || vendorName,
        memo: memo.trim() || null,
      };
    }
    if (paymentMethod === "BANK_TRANSFER") {
      if (!btBankName.trim() || !btBankBranch.trim() || !accountNumber.trim()) {
        setError(
          "Bank transfer requires bank name, bank branch, and account number",
        );
        return null;
      }
      return {
        bankName: btBankName.trim(),
        bankBranch: btBankBranch.trim(),
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim() || vendorName,
        iban: iban.trim() || null,
        swiftCode: swiftCode.trim() || null,
        currency,
      };
    }
    return {
      paidToName: vendorName || null,
      notes: notes.trim() || null,
    };
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!invoiceId) {
      setError("Invoice is required");
      return;
    }
    if (!invoiceEligible) {
      setError("Only APPROVED, three-way-matched invoices can be used");
      return;
    }

    const requested = amount.trim() === "" ? remaining : Number(amount);
    if (!Number.isFinite(requested) || requested <= 0) {
      setError("Amount must be a positive number");
      return;
    }
    if (requested > remaining) {
      setError(`Amount cannot exceed remaining balance (${remaining})`);
      return;
    }

    const methodDetails = buildMethodDetails();
    if (!methodDetails) return;

    createRequest.mutate(
      {
        invoiceId,
        amount: requested,
        paymentMethod,
        methodDetails,
        notes: notes || undefined,
      },
      {
        onSuccess: (req: { id: string }) => {
          router.push(`/finance/payment-requests/${req.id}`);
        },
        onError: (err) =>
          setError(extractApiError(err, "Failed to create payment request")),
      },
    );
  };

  if (preselectedInvoiceId && loadingInvoice) {
    return <LoadingSkeleton variant="cards" />;
  }

  if (preselectedInvoiceId && (!prefilledInvoice || !invoiceEligible)) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-destructive">
        <p className="text-sm">
          Invoice not found or not eligible. Only approved, three-way-matched
          invoices can create a payment request.
        </p>
        <Button variant="outline" asChild>
          <Link href="/procurement/vendor-invoices">Back to Vendor Invoices</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="New Payment Request"
        description={
          selected
            ? `Request payment for invoice ${selected.serialNumber}`
            : "Create a payment request from an approved invoice"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Payment Requests", href: "/finance/payment-requests" },
          { label: "New" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link
              href={
                preselectedInvoiceId
                  ? `/procurement/vendor-invoices/${preselectedInvoiceId}`
                  : "/finance/payment-requests"
              }
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
        {error && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {preselectedInvoiceId ? (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Invoice:</span>{" "}
                  {selected?.serialNumber} ({selected?.invoiceNumber})
                </p>
                <p>
                  <span className="text-muted-foreground">Vendor:</span>{" "}
                  {selected?.vendor?.name ?? "—"}
                </p>
                <p>
                  <span className="text-muted-foreground">Remaining:</span>{" "}
                  {formatCurrency(remaining, currency)}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Approved invoice</Label>
                <Select value={invoiceId} onValueChange={setInvoiceId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleInvoices.map((inv) => (
                      <SelectItem key={inv.id} value={inv.id}>
                        {inv.serialNumber} — {inv.vendor?.name ?? inv.invoiceNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selected && (
                  <p className="text-sm text-muted-foreground">
                    Remaining: {formatCurrency(remaining, currency)}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (blank = full remaining)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={remaining > 0 ? String(remaining) : ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {paymentMethod === "CHEQUE" && (
          <Card>
            <CardHeader>
              <CardTitle>Cheque details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank name *</Label>
                <Input
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankBranch">Bank branch *</Label>
                <Input
                  id="bankBranch"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chequeNumber">Cheque serial No *</Label>
                <Input
                  id="chequeNumber"
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chequeDate">Cheque date</Label>
                <Input
                  id="chequeDate"
                  type="date"
                  value={chequeDate}
                  onChange={(e) => setChequeDate(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="payeeName">Payee name</Label>
                <Input
                  id="payeeName"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="memo">Memo / purpose</Label>
                <Input
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod === "BANK_TRANSFER" && (
          <Card>
            <CardHeader>
              <CardTitle>Vendor bank transfer details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {bankAccounts.length > 1 && (
                <div className="space-y-2 sm:col-span-2">
                  <Label>Prefill from vendor account</Label>
                  <Select
                    onValueChange={(id) => {
                      const acc = bankAccounts.find((a) => a.id === id);
                      if (!acc) return;
                      setBtBankName(acc.bankName || "");
                      setAccountNumber(acc.accountNumber || "");
                      setAccountName(acc.accountName || vendorName);
                      setIban(acc.iban || "");
                      setSwiftCode(acc.swiftCode || "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select saved bank account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.bankName} — {a.accountNumber}
                          {a.isPrimary ? " (primary)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="btBankName">Bank name *</Label>
                <Input
                  id="btBankName"
                  value={btBankName}
                  onChange={(e) => setBtBankName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="btBankBranch">Bank branch *</Label>
                <Input
                  id="btBankBranch"
                  value={btBankBranch}
                  onChange={(e) => setBtBankBranch(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account No *</Label>
                <Input
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account holder name</Label>
                <Input
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="swiftCode">SWIFT / BIC</Label>
                <Input
                  id="swiftCode"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {paymentMethod === "CASH" && (
          <Card>
            <CardHeader>
              <CardTitle>Cash payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Create this request as a draft, then on the detail page:
              </p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>Download the cash receipt</li>
                <li>Have the supplier / vendor sign it</li>
                <li>Upload the signed receipt (required before Submit)</li>
              </ol>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" asChild>
            <Link href="/finance/payment-requests">Cancel</Link>
          </Button>
          <Button type="submit" disabled={createRequest.isPending || !invoiceId}>
            {createRequest.isPending
              ? "Creating…"
              : paymentMethod === "CASH"
                ? "Create draft"
                : "Create Payment Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewPaymentRequestPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="cards" />}>
      <NewPaymentRequestForm />
    </Suspense>
  );
}
