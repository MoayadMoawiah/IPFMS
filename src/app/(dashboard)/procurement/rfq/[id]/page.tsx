"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, Printer, Send, UserPlus, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PermissionGate } from "@/components/auth/permission-gate";
import {
  useRfq,
  useIssueRfq,
  useInviteRfqVendor,
  useUpdateRfqQuotation,
  useVendors,
} from "@/hooks/use-procurement";
import { getPaginatedItems } from "@/lib/api/pagination";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { extractApiError } from "@/lib/api-errors";
import { PrintDocumentShell } from "@/components/documents/print-document-shell";
import { formatDate as formatPrintDate } from "@/lib/formatters";

interface RfqVendor {
  id: string;
  vendorId: string;
  quotedAmount?: number | string | null;
  currency?: string | null;
  deliveryDays?: number | null;
  warrantyTerms?: string | null;
  technicalScore?: number | string;
  committeeScore?: number | string;
  totalScore?: number | string;
  respondedAt?: string | null;
  isWinner?: boolean;
  vendor?: { id: string; name: string; email?: string };
}

export default function RfqDetailPage() {
  const params = useParams();
  const rfqId = params.id as string;

  const { data, isLoading, isError } = useRfq(rfqId);
  const { data: vendorsData } = useVendors({ limit: 100 });
  const vendors = getPaginatedItems(vendorsData) as { id: string; name: string }[];

  const issueRfq = useIssueRfq();
  const inviteVendor = useInviteRfqVendor();
  const updateQuotation = useUpdateRfqQuotation();

  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingVendor, setEditingVendor] = useState<string | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    quotedAmount: "",
    deliveryDays: "",
    warrantyTerms: "",
    technicalScore: "",
    committeeScore: "",
    currency: "USD",
  });

  if (isLoading) return <LoadingSkeleton variant="cards" />;
  if (isError || !data) {
    return <div className="py-12 text-center text-muted-foreground">RFQ not found.</div>;
  }

  const rfq = data as {
    id: string;
    serialNumber: string;
    title: string;
    status: string;
    submissionDeadline: string;
    prId: string;
    pr?: { serialNumber: string; title: string };
    grant?: { code: string; name: string };
    vendors: RfqVendor[];
  };

  const hasResponded = rfq.vendors.some((v) => v.respondedAt);

  const handleIssue = () => {
    setActionError(null);
    issueRfq.mutate(rfqId, {
      onError: (err) => setActionError(extractApiError(err, "Failed to issue RFQ")),
    });
  };

  const handleInvite = () => {
    if (!selectedVendorId) return;
    setActionError(null);
    inviteVendor.mutate(
      { id: rfqId, vendorId: selectedVendorId },
      {
        onSuccess: () => setSelectedVendorId(""),
        onError: (err) => setActionError(extractApiError(err, "Failed to invite vendor")),
      },
    );
  };

  const startEditQuote = (v: RfqVendor) => {
    setEditingVendor(v.id);
    setQuoteForm({
      quotedAmount: v.quotedAmount != null ? String(v.quotedAmount) : "",
      deliveryDays: v.deliveryDays != null ? String(v.deliveryDays) : "",
      warrantyTerms: v.warrantyTerms ?? "",
      technicalScore: v.technicalScore != null ? String(v.technicalScore) : "",
      committeeScore: v.committeeScore != null ? String(v.committeeScore) : "",
      currency: v.currency ?? "USD",
    });
  };

  const saveQuote = (rfqVendorId: string) => {
    setActionError(null);
    updateQuotation.mutate(
      {
        id: rfqId,
        rfqVendorId,
        dto: {
          quotedAmount: quoteForm.quotedAmount ? Number(quoteForm.quotedAmount) : undefined,
          deliveryDays: quoteForm.deliveryDays ? Number(quoteForm.deliveryDays) : undefined,
          warrantyTerms: quoteForm.warrantyTerms || undefined,
          technicalScore: quoteForm.technicalScore ? Number(quoteForm.technicalScore) : undefined,
          committeeScore: quoteForm.committeeScore ? Number(quoteForm.committeeScore) : undefined,
          currency: quoteForm.currency,
        },
      },
      {
        onSuccess: () => setEditingVendor(null),
        onError: (err) => setActionError(extractApiError(err, "Failed to save quotation")),
      },
    );
  };

  const invitedVendorIds = new Set(rfq.vendors.map((v) => v.vendorId));
  const availableVendors = vendors.filter((v) => !invitedVendorIds.has(v.id));

  return (
    <div>
      <PageHeader
        className="no-print"
        title={rfq.serialNumber}
        description={rfq.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "RFQ", href: "/procurement/rfq" },
          { label: rfq.serialNumber },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            {hasResponded && (
              <Button variant="outline" asChild>
                <Link href={`/procurement/rfq/${rfqId}/compare`}>
                  <BarChart3 className="h-4 w-4" />
                  Compare
                </Link>
              </Button>
            )}
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print RFQ
            </Button>
            <Button variant="outline" asChild>
              <Link href="/procurement/rfq">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
        }
      />

      <div className="no-print">
      {actionError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={rfq.status.toLowerCase()} />
        <span className="text-sm text-muted-foreground">
          Deadline: {formatDate(rfq.submissionDeadline)}
        </span>
        {rfq.pr && (
          <Link
            href={`/procurement/requisitions/${rfq.prId}`}
            className="text-sm text-primary hover:underline"
          >
            PR: {rfq.pr.serialNumber}
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invited Vendors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Quoted</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfq.vendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No vendors invited yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    rfq.vendors.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">
                          {v.vendor?.name ?? "—"}
                          {v.isWinner && (
                            <Badge variant="success" className="ml-2 gap-1">
                              <Trophy className="h-3 w-3" />
                              Winner
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {v.quotedAmount != null
                            ? formatCurrency(Number(v.quotedAmount), v.currency ?? "USD")
                            : "—"}
                        </TableCell>
                        <TableCell>{v.totalScore != null ? Number(v.totalScore) : "—"}</TableCell>
                        <TableCell>
                          {v.respondedAt ? "Quoted" : "Invited"}
                        </TableCell>
                        <TableCell>
                          {editingVendor === v.id ? (
                            <div className="space-y-2 min-w-[280px]">
                              <Input
                                placeholder="Amount"
                                type="number"
                                value={quoteForm.quotedAmount}
                                onChange={(e) =>
                                  setQuoteForm({ ...quoteForm, quotedAmount: e.target.value })
                                }
                              />
                              <Input
                                placeholder="Delivery days"
                                type="number"
                                value={quoteForm.deliveryDays}
                                onChange={(e) =>
                                  setQuoteForm({ ...quoteForm, deliveryDays: e.target.value })
                                }
                              />
                              <Input
                                placeholder="Warranty"
                                value={quoteForm.warrantyTerms}
                                onChange={(e) =>
                                  setQuoteForm({ ...quoteForm, warrantyTerms: e.target.value })
                                }
                              />
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Technical"
                                  type="number"
                                  value={quoteForm.technicalScore}
                                  onChange={(e) =>
                                    setQuoteForm({ ...quoteForm, technicalScore: e.target.value })
                                  }
                                />
                                <Input
                                  placeholder="Committee"
                                  type="number"
                                  value={quoteForm.committeeScore}
                                  onChange={(e) =>
                                    setQuoteForm({ ...quoteForm, committeeScore: e.target.value })
                                  }
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => saveQuote(v.id)}>
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingVendor(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => startEditQuote(v)}>
                              {v.respondedAt ? "Edit Quote" : "Enter Quote"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {rfq.status === "DRAFT" && (
            <PermissionGate permission="RFQ:UPDATE">
              <Card>
                <CardHeader>
                  <CardTitle>Issue RFQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Issue the RFQ to begin inviting vendors and collecting quotations.
                  </p>
                  <Button onClick={handleIssue} disabled={issueRfq.isPending}>
                    <Send className="h-4 w-4" />
                    {issueRfq.isPending ? "Issuing…" : "Issue RFQ"}
                  </Button>
                </CardContent>
              </Card>
            </PermissionGate>
          )}

          {["ISSUED", "DRAFT", "AWARDED"].includes(rfq.status) && (
            <PermissionGate permission="RFQ:UPDATE">
              <Card>
                <CardHeader>
                  <CardTitle>Invite Vendor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVendors.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleInvite}
                    disabled={!selectedVendorId || inviteVendor.isPending}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite
                  </Button>
                </CardContent>
              </Card>
            </PermissionGate>
          )}

          {rfq.grant && (
            <Card>
              <CardHeader>
                <CardTitle>Grant</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium">{rfq.grant.code}</p>
                <p className="text-muted-foreground">{rfq.grant.name}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>

      <div className="hidden print:block">
        <PrintDocumentShell title="Request for Quotation – RFQ" documentNumber={rfq.serialNumber}>
          <div className="mb-4 grid gap-1 text-sm sm:grid-cols-2">
            <p>
              <span className="font-semibold">Title:</span> {rfq.title}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {rfq.status}
            </p>
            <p>
              <span className="font-semibold">Deadline:</span>{" "}
              {formatPrintDate(rfq.submissionDeadline)}
            </p>
            <p>
              <span className="font-semibold">Grant:</span>{" "}
              {rfq.grant ? `${rfq.grant.code} — ${rfq.grant.name}` : "—"}
            </p>
            <p>
              <span className="font-semibold">PR Ref:</span>{" "}
              {rfq.pr?.serialNumber ?? "—"}
            </p>
          </div>
          <table className="gaderon-print-table w-full text-sm">
            <thead>
              <tr className="bg-neutral-100">
                <th className="text-left">Vendor</th>
                <th className="text-right">Quoted Amount</th>
                <th className="text-left">Currency</th>
                <th className="text-right">Delivery (days)</th>
                <th className="text-right">Total Score</th>
                <th className="text-left">Winner</th>
              </tr>
            </thead>
            <tbody>
              {rfq.vendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No vendors invited
                  </td>
                </tr>
              ) : (
                rfq.vendors.map((v) => (
                  <tr key={v.id}>
                    <td>{v.vendor?.name ?? "—"}</td>
                    <td className="text-right">
                      {v.quotedAmount != null
                        ? formatCurrency(Number(v.quotedAmount), v.currency ?? "USD")
                        : "—"}
                    </td>
                    <td>{v.currency ?? "—"}</td>
                    <td className="text-right">{v.deliveryDays ?? "—"}</td>
                    <td className="text-right">
                      {v.totalScore != null ? Number(v.totalScore) : "—"}
                    </td>
                    <td>{v.isWinner ? "Yes" : ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {rfq.vendors.some((v) => v.isWinner) && (
            <p className="mt-4 text-sm font-semibold">
              Awarded vendor:{" "}
              {rfq.vendors.find((v) => v.isWinner)?.vendor?.name ?? "—"}
            </p>
          )}
        </PrintDocumentShell>
      </div>
    </div>
  );
}
