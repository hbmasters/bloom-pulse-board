import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, HelpCircle, Loader2 } from "lucide-react";
import type { DataState } from "@/types/intelligence";

/* ══════════════════════════════════════════
   Data State Wrapper
   Renders loading / unknown / partial states
   around intelligence sections.
   ══════════════════════════════════════════ */

interface DataStateWrapperProps {
  state: DataState;
  children: ReactNode;
  /** Number of skeleton cards to show in loading state */
  skeletonCount?: number;
  /** Optional custom empty/unknown message */
  unknownMessage?: string;
}

export const DataStateWrapper = ({
  state,
  children,
  skeletonCount = 3,
  unknownMessage = "Data niet beschikbaar – wacht op backend verbinding",
}: DataStateWrapperProps) => {
  if (state === "loading") {
    return <DataSkeleton count={skeletonCount} />;
  }

  if (state === "unknown") {
    return <DataUnknown message={unknownMessage} />;
  }

  return (
    <>
      {state === "partial" && <PartialBadge />}
      {children}
    </>
  );
};

/* ── Loading Skeleton ── */

export const DataSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

/* ── Metric Card Skeleton ── */

export const MetricSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="rounded-xl border border-border p-3.5 space-y-2">
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-1.5 h-1.5 rounded-full" />
          <Skeleton className="h-2.5 w-16" />
        </div>
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-2 w-20" />
      </div>
    ))}
  </div>
);

/* ── Unknown Placeholder ── */

export const DataUnknown = ({ message }: { message?: string }) => (
  <div className="rounded-xl border border-border bg-muted/20 p-8 flex flex-col items-center justify-center text-center">
    <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mb-3">
      <HelpCircle className="w-5 h-5 text-muted-foreground" />
    </div>
    <p className="text-[11px] font-mono text-muted-foreground">
      {message || "Data niet beschikbaar"}
    </p>
  </div>
);

/* ── Partial Data Warning Badge ── */

export const PartialBadge = () => (
  <div className="flex items-center gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 mb-3">
    <AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0" />
    <span className="text-[10px] font-mono text-yellow-500">
      Gedeeltelijke data — sommige bronnen zijn nog niet beschikbaar
    </span>
  </div>
);

/* ── Signal Unknown Value ── */

export const SignalUnknown = () => (
  <span className="text-muted-foreground/50 font-mono">—</span>
);

/* ── Inline Loading Spinner ── */

export const InlineLoader = () => (
  <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
);
