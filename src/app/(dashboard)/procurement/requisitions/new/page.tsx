"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { grants } from "@/lib/mock-data/grants";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const steps = [
  "General Information",
  "Items",
  "Budget",
  "Attachments",
  "Approval Preview",
];

const generalSchema = z.object({
  title: z.string().min(3, "Title is required"),
  grantId: z.string().min(1, "Grant is required"),
  department: z.string().min(1, "Department is required"),
  description: z.string().optional(),
});

type GeneralForm = z.infer<typeof generalSchema>;

export default function NewPRPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<GeneralForm>>({});

  const form = useForm<GeneralForm>({
    resolver: zodResolver(generalSchema),
    defaultValues: { title: "", grantId: "", department: "", description: "" },
  });

  const nextStep = async () => {
    if (step === 0) {
      const valid = await form.trigger();
      if (!valid) {
        toast({ title: "Validation Error", description: "Please fill required fields.", variant: "destructive" });
        return;
      }
      setFormData(form.getValues());
    }
    if (step < steps.length - 1) setStep(step + 1);
    else {
      toast({ title: "PR Submitted", description: "Purchase requisition submitted for approval." });
      router.push("/procurement/requisitions");
    }
  };

  const grant = grants.find((g) => g.id === formData.grantId);

  return (
    <div>
      <PageHeader
        title="Create Purchase Requisition"
        description="Multi-step wizard to create a new purchase requisition"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Requisitions", href: "/procurement/requisitions" },
          { label: "New PR" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/procurement/requisitions">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Link>
          </Button>
        }
      />

      <div className="mb-8 flex items-center justify-between overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("ml-2 hidden text-sm sm:inline", i <= step ? "font-medium" : "text-muted-foreground")}>
              {s}
            </span>
            {i < steps.length - 1 && (
              <div className={cn("mx-4 h-px w-8 sm:w-16", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title *</Label>
                <Input {...form.register("title")} placeholder="PR title" />
              </div>
              <div className="space-y-2">
                <Label>Grant *</Label>
                <Select onValueChange={(v) => form.setValue("grantId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grant" />
                  </SelectTrigger>
                  <SelectContent>
                    {grants.filter((g) => g.status === "active").map((g) => (
                      <SelectItem key={g.id} value={g.id}>{g.code} — {g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select onValueChange={(v) => form.setValue("department", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Administration", "Health", "WASH", "Education", "Logistics", "Finance"].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} placeholder="Purpose and justification" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid gap-4 rounded-xl border p-4 sm:grid-cols-4">
                  <Input placeholder="Item description" defaultValue={i === 1 ? "Office Desk" : ""} />
                  <Input type="number" placeholder="Qty" defaultValue={i === 1 ? "5" : ""} />
                  <Input placeholder="Unit" defaultValue={i === 1 ? "Unit" : ""} />
                  <Input type="number" placeholder="Est. price" defaultValue={i === 1 ? "250" : ""} />
                </div>
              ))}
              <Button variant="outline" size="sm">Add Item</Button>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Estimated Total</p>
                <p className="text-2xl font-bold">$12,500</p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">Available Budget</p>
                <p className="text-2xl font-bold text-success">
                  {grant ? `$${grant.available.toLocaleString()}` : "—"}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">Drag and drop files here or click to browse</p>
              <Button variant="outline" className="mt-4">Upload Attachments</Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4">
                <h4 className="font-semibold">Summary</h4>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><dt>Title</dt><dd className="font-medium">{formData.title || "—"}</dd></div>
                  <div className="flex justify-between"><dt>Grant</dt><dd className="font-medium">{grant?.code || "—"}</dd></div>
                  <div className="flex justify-between"><dt>Department</dt><dd className="font-medium">{formData.department || "—"}</dd></div>
                  <div className="flex justify-between"><dt>Total Amount</dt><dd className="font-medium">$12,500</dd></div>
                </dl>
              </div>
              <p className="text-sm text-muted-foreground">
                Upon submission, this PR will be routed to the Program Manager and Finance Officer for approval.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              Previous
            </Button>
            <Button onClick={nextStep}>
              {step === steps.length - 1 ? "Submit for Approval" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
