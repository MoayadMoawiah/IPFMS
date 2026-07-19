import Image from "next/image";
import { cn } from "@/lib/utils";

interface PrintDocumentShellProps {
  title: string;
  documentNumber?: string;
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
}

export function PrintDocumentShell({
  title,
  documentNumber,
  children,
  className,
  subtitle,
}: PrintDocumentShellProps) {
  return (
    <div className={cn("gaderon-print-doc bg-white text-black", className)}>
      <header className="print-doc-header mb-4 flex items-start justify-between gap-4 border-b-2 border-black pb-3">
        <div className="flex items-start gap-3">
          <Image
            src="/brand/gaderon-logo.png"
            alt="Gaderon"
            width={140}
            height={52}
            className="h-12 w-auto"
          />
          <div>
            <p className="text-base font-bold leading-tight">
              Gaderon Organization for Development
            </p>
            {subtitle && (
              <p className="text-xs text-neutral-600">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold uppercase tracking-wide">{title}</h1>
          {documentNumber && (
            <p className="mt-1 text-sm font-semibold">
              PO No / Doc No: <span className="font-mono">{documentNumber}</span>
            </p>
          )}
        </div>
      </header>
      {children}
      <footer className="print-doc-footer mt-6 border-t border-neutral-400 pt-2 text-center text-[10px] text-neutral-600">
        Gaderon Organization for Development — Integrated Procurement &amp; Finance Management System
      </footer>
    </div>
  );
}
