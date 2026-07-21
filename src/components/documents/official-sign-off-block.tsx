import { formatSignOffDate, type OfficialSignOffSlots, type SignOffPerson } from "@/lib/documents/sign-off";
import { cn } from "@/lib/utils";

function SignOffRow({
  title,
  person,
  dateLabel = "Date",
}: {
  title: string;
  person: SignOffPerson;
  dateLabel?: string;
}) {
  return (
    <div className="print-sign-box border border-black p-3">
      <p className="mb-2 text-sm font-bold underline">{title}</p>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Name:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {person.name || "\u00a0"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">{dateLabel}:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {formatSignOffDate(person.date) || "\u00a0"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Position:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60">
            {person.position || "\u00a0"}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium">Signature:</span>
          <span className="min-h-[1.25rem] flex-1 border-b border-dotted border-black/60 italic">
            {person.signature || "\u00a0"}
          </span>
        </div>
      </div>
    </div>
  );
}

export type OfficialSignOffTitles = {
  requestedBy?: string;
  checkedBy?: string;
  approvedBy?: string;
};

interface OfficialSignOffBlockProps {
  slots: OfficialSignOffSlots;
  titles?: OfficialSignOffTitles;
  className?: string;
}

/** Requested by / Checked by / Approved by — matches Gaderon paper forms. */
export function OfficialSignOffBlock({
  slots,
  titles,
  className,
}: OfficialSignOffBlockProps) {
  return (
    <div className={cn("print-sign-off space-y-3", className)}>
      <SignOffRow
        title={titles?.requestedBy ?? "Requested by:"}
        person={slots.requestedBy}
        dateLabel="Dated"
      />
      <SignOffRow
        title={titles?.checkedBy ?? "Checked by:"}
        person={slots.checkedBy}
      />
      <SignOffRow
        title={titles?.approvedBy ?? "Approved by:"}
        person={slots.approvedBy}
      />
    </div>
  );
}
