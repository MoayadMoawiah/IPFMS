"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Package, Users, DollarSign, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGlobalSearch } from "@/hooks/use-search";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/lib/api/search";

const TYPE_ICONS: Record<string, React.ElementType> = {
  grant: FileText,
  project: FileText,
  vendor: Users,
  purchase_requisition: FileText,
  purchase_order: FileText,
  payment_voucher: DollarSign,
  fixed_asset: Package,
  user: Users,
};

const TYPE_LABELS: Record<string, string> = {
  grant: 'Grant',
  project: 'Project',
  vendor: 'Vendor',
  purchase_requisition: 'PR',
  purchase_order: 'PO',
  payment_voucher: 'PV',
  fixed_asset: 'Asset',
  user: 'User',
};

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGlobalSearch(query);
  const results = data?.results ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search grants, vendors, POs..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        className="pl-9"
      />

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-1 w-full rounded-lg border bg-card shadow-lg z-50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="max-h-80 overflow-auto py-1">
              {results.map((result) => {
                const Icon = TYPE_ICONS[result.type] ?? FileText;
                return (
                  <li key={`${result.type}-${result.id}`}>
                    <button
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium text-sm">{result.title}</p>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {TYPE_LABELS[result.type]}
                          </span>
                        </div>
                        {result.subtitle && (
                          <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
