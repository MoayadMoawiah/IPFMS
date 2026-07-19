"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreatePaf } from "@/hooks/use-procurement";

interface CommitteeMember {
  name: string;
  role: string;
}

interface PafCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfqId: string;
  rfqVendorId: string;
  vendorName?: string;
  onSuccess?: (pafId: string) => void;
}

export function PafCreateDialog({
  open,
  onOpenChange,
  rfqId,
  rfqVendorId,
  vendorName,
  onSuccess,
}: PafCreateDialogProps) {
  const createPaf = useCreatePaf();
  const [justification, setJustification] = useState("");
  const [members, setMembers] = useState<CommitteeMember[]>([{ name: "", role: "" }]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (!justification.trim()) {
      setError("Justification is required");
      return;
    }
    const committeeMembers = members.filter((m) => m.name.trim() && m.role.trim());
    createPaf.mutate(
      {
        rfqId,
        rfqVendorId,
        justification: justification.trim(),
        committeeMembers: committeeMembers.length > 0 ? committeeMembers : undefined,
      },
      {
        onSuccess: (paf) => {
          onOpenChange(false);
          setJustification("");
          setMembers([{ name: "", role: "" }]);
          onSuccess?.(paf.id as string);
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string } }; message?: string };
          setError(e?.response?.data?.message ?? e?.message ?? "Failed to create PAF");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Purchase Analysis Form</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {vendorName && (
            <p className="text-sm text-muted-foreground">
              Recommended vendor: <span className="font-medium text-foreground">{vendorName}</span>
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="paf-justification">Justification *</Label>
            <Textarea
              id="paf-justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why this vendor was selected…"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Committee Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMembers([...members, { name: "", role: "" }])}
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
            {members.map((member, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => {
                    const next = [...members];
                    next[index] = { ...next[index], name: e.target.value };
                    setMembers(next);
                  }}
                />
                <Input
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) => {
                    const next = [...members];
                    next[index] = { ...next[index], role: e.target.value };
                    setMembers(next);
                  }}
                />
                {members.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setMembers(members.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createPaf.isPending}>
            {createPaf.isPending ? "Saving…" : "Save Draft PAF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
