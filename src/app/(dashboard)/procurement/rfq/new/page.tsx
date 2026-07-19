import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import NewRfqPageClient from "./new-rfq-client";

export default function NewRfqPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="cards" />}>
      <NewRfqPageClient />
    </Suspense>
  );
}
