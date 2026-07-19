"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/page-header";
import { FormErrorBanner, FormField, FormSection } from "@/components/forms/form-layout";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useCreateRfq, usePurchaseRequisition } from "@/hooks/use-procurement";
import { extractApiError } from "@/lib/api-errors";
import { RFQ_MIN_AMOUNT_USD } from "@/lib/constants/procurement";

export default function NewRfqPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prId = searchParams.get("prId") ?? "";

  const { data: pr, isLoading, isError } = usePurchaseRequisition(prId);
  const createRfq = useCreateRfq();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (pr) {
      setTitle((pr as { title: string }).title);
      setDescription(((pr as { description?: string }).description) ?? "");
    }
  }, [pr]);

  if (!prId) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Missing purchase requisition.{" "}
        <Link href="/procurement/requisitions" className="text-primary hover:underline">
          Go to requisitions
        </Link>
      </div>
    );
  }

  if (isLoading) return <LoadingSkeleton variant="cards" />;

  if (isError || !pr) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Purchase requisition not found.
      </div>
    );
  }

  const prDetail = pr as {
    id: string;
    serialNumber: string;
    title: string;
    status: string;
    procurementRoute?: string;
    grant?: { id: string; code: string; name: string };
    totalEstimatedAmount: number | string;
    currency: string;
  };

  if (prDetail.status !== "APPROVED") {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          RFQ can only be created from an approved purchase requisition.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/procurement/requisitions/${prId}`}>Back to PR</Link>
        </Button>
      </div>
    );
  }

  if (prDetail.procurementRoute === "DIRECT_PO") {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          This PR is at or below ${RFQ_MIN_AMOUNT_USD.toLocaleString()} — RFQ is not required.
          Create a Purchase Order directly instead.
        </p>
        <Button className="mt-4" asChild>
          <Link href={`/procurement/purchase-orders/new?prId=${prId}`}>Create PO</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!submissionDeadline) {
      setSubmitError("Submission deadline is required");
      return;
    }
    createRfq.mutate(
      {
        prId,
        title: title || prDetail.title,
        description: description || undefined,
        submissionDeadline,
        openingDate: openingDate || undefined,
      },
      {
        onSuccess: (rfq) => router.push(`/procurement/rfq/${rfq.id}`),
        onError: (err) => setSubmitError(extractApiError(err, "Failed to create RFQ")),
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Create RFQ"
        description={`From PR ${prDetail.serialNumber}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "RFQ", href: "/procurement/rfq" },
          { label: "New RFQ" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href={`/procurement/requisitions/${prId}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to PR
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {submitError && <FormErrorBanner message={submitError} />}

        <FormSection title="RFQ Details">
          <FormField label="Linked PR" className="sm:col-span-2">
            <Input value={prDetail.serialNumber} disabled />
          </FormField>
          <FormField label="Grant" className="sm:col-span-2">
            <Input value={prDetail.grant ? `${prDetail.grant.code} — ${prDetail.grant.name}` : "—"} disabled />
          </FormField>
          <FormField label="Title" required className="sm:col-span-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>
          <FormField label="Description" className="sm:col-span-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </FormField>
          <FormField label="Submission Deadline" required>
            <Input
              type="datetime-local"
              value={submissionDeadline}
              onChange={(e) => setSubmissionDeadline(e.target.value)}
            />
          </FormField>
          <FormField label="Opening Date">
            <Input
              type="datetime-local"
              value={openingDate}
              onChange={(e) => setOpeningDate(e.target.value)}
            />
          </FormField>
        </FormSection>

        <div className="flex gap-2">
          <Button type="submit" disabled={createRfq.isPending}>
            {createRfq.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create RFQ
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/procurement/requisitions/${prId}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
