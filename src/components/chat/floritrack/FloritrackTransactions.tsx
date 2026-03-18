import { useState } from "react";
import { Package, Truck, CheckCircle2, HelpCircle, RefreshCw, ChevronDown, ChevronUp, MapPin, Clock, User, Hash, ArrowRight, Box, Timer, Flower2, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FloritrackData, FloritrackTransaction, FloritrackTimelineEvent } from "./floritrack-types";
import { FLORITRACK_MOCK } from "./floritrack-mock-data";
import { Skeleton } from "@/components/ui/skeleton";

/* ───── status helpers ───── */
const STATUS_CONFIG = {
  Aangekocht: { icon: Package, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
  Onderweg:   { icon: Truck,   color: "text-blue-500",  bg: "bg-blue-500/10 border-blue-500/20",  dot: "bg-blue-500" },
  Afgeleverd: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  Onbekend:   { icon: HelpCircle,   color: "text-muted-foreground", bg: "bg-muted/40 border-border", dot: "bg-muted-foreground" },
} as const;

function statusCfg(s: string) {
  return STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.Onbekend;
}

/** Extract license plate from timeline vehicle strings like "Vrachtwagen BT-412-X" */
function extractPlate(tx: FloritrackTransaction): string | null {
  for (const ev of tx.timeline) {
    if (ev.vehicle) {
      const parts = ev.vehicle.split(" ");
      if (parts.length > 1) return parts.slice(1).join(" ");
      return ev.vehicle;
    }
  }
  return null;
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

function formatDeliveryInfo(tx: FloritrackTransaction): { label: string; accent: string } | null {
  if (!tx.expectedDeliveryTime) return null;
  const expected = new Date(tx.expectedDeliveryTime);
  const time = expected.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  if (tx.status === "Afgeleverd") {
    const delivered = tx.timeline.find(e => e.status === "Afgeleverd");
    if (delivered) {
      const actual = new Date(`${delivered.date}T${delivered.time}`);
      const diffMin = Math.round((actual.getTime() - expected.getTime()) / 60000);
      if (diffMin <= 0) return { label: `✓ ${time}`, accent: "text-emerald-500" };
      return { label: `+${diffMin}m · ${time}`, accent: "text-amber-500" };
    }
    return { label: time, accent: "text-muted-foreground" };
  }
  return { label: time, accent: "text-blue-500" };
}

/* ───── KPI strip ───── */
const KPIChip = ({ label, value, icon: Icon, accent }: { label: string; value: number; icon: typeof Package; accent: string }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border min-w-[100px]">
    <Icon className={cn("w-4 h-4 shrink-0", accent)} />
    <div className="min-w-0">
      <div className="text-lg font-semibold leading-tight text-foreground">{value}</div>
      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate">{label}</div>
    </div>
  </div>
);

/* ───── Timeline ───── */
const Timeline = ({ events }: { events: FloritrackTimelineEvent[] }) => {
  const steps = ["Aangekocht", "Onderweg", "Afgeleverd"];
  const reached = events.map(e => e.status);
  let lastReached = -1;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (reached.includes(steps[i])) { lastReached = i; break; }
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const active = i <= lastReached;
          const cfg = statusCfg(step);
          const Icon = cfg.icon;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                active ? `${cfg.bg} border-current ${cfg.color}` : "bg-muted/20 border-border text-muted-foreground/30"
              )}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-1">
                  <div className={cn("h-full rounded-full", i < lastReached ? "bg-emerald-400" : "bg-border")} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between px-0">
        {steps.map((step, i) => (
          <span key={step} className={cn(
            "text-[10px] font-medium",
            i <= lastReached ? "text-foreground" : "text-muted-foreground/40",
            i === 1 && "text-center flex-1",
            i === 2 && "text-right"
          )}>{step}</span>
        ))}
      </div>

      {/* Event list */}
      <div className="relative pl-4 space-y-3 border-l-2 border-border ml-1">
        {events.map((ev, i) => {
          const cfg = statusCfg(ev.status);
          return (
            <div key={i} className="relative">
              <div className={cn("absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-card", cfg.dot)} />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-semibold", cfg.color)}>{ev.status}</span>
                  <span className="text-[10px] text-muted-foreground">{ev.date} · {ev.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">{ev.location}</p>
                {(ev.unit || ev.vehicle) && (
                  <div className="flex items-center gap-3 mt-0.5">
                    {ev.unit && <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1"><Box className="w-3 h-3" />{ev.unit}</span>}
                    {ev.vehicle && <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1"><Truck className="w-3 h-3" />{ev.vehicle}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ───── Detail panel ───── */
const DetailField = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-baseline py-1.5 border-b border-border/50 last:border-0">
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
    <span className="text-xs text-foreground font-medium text-right max-w-[60%] truncate">{value || "—"}</span>
  </div>
);

const TransactionDetail = ({ tx }: { tx: FloritrackTransaction }) => {
  const delivery = formatDeliveryInfo(tx);
  return (
  <div className="animate-fade-in space-y-4 pt-3 border-t border-border/50">
    {/* Delivery time highlight */}
    {delivery && (
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        tx.status === "Afgeleverd"
          ? "bg-emerald-500/5 border-emerald-500/20"
          : "bg-blue-500/5 border-blue-500/20"
      )}>
        <Timer className={cn("w-4 h-4 shrink-0", delivery.accent)} />
        <div>
          <span className={cn("text-xs font-semibold", delivery.accent)}>{delivery.label}</span>
          {tx.expectedDeliveryTime && (
            <span className="text-[10px] text-muted-foreground ml-2">
              Bestemming: {tx.destination}
            </span>
          )}
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <div>
        <DetailField label="Artikel" value={tx.article} />
        <DetailField label="Artikelcode" value={tx.articleCode} />
        <DetailField label="Transactie" value={tx.transactionNumber} />
        <DetailField label="Partijvolgnr." value={tx.batchSequenceNumber} />
        <DetailField label="Inhoud" value={tx.content} />
        <DetailField label="Aantal" value={`${tx.quantity.delivered} / ${tx.quantity.total}`} />
        <DetailField label="Fust" value={tx.packaging} />
      </div>
      <div>
        <DetailField label="Leverancier" value={tx.supplier} />
        <DetailField label="Koper" value={tx.buyer} />
        <DetailField label="Afleveradres" value={tx.destination} />
        <DetailField label="Herkomst" value={tx.location} />
        <DetailField label="Plaats" value={tx.place} />
        <DetailField label="Zetel" value={tx.seat} />
        <DetailField label="Klok" value={tx.clock} />
        {tx.remark && <DetailField label="Opmerking" value={tx.remark} />}
      </div>
    </div>

    {/* Track & Trace */}
    <div>
      <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        Track & Trace
      </h4>
      <Timeline events={tx.timeline} />
    </div>
  </div>
  );
};

/* ───── Transaction row ───── */
const TransactionRow = ({ tx, isOpen, onToggle }: { tx: FloritrackTransaction; isOpen: boolean; onToggle: () => void }) => {
  const cfg = statusCfg(tx.status);
  const Icon = cfg.icon;
  const delivery = formatDeliveryInfo(tx);

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-200",
      isOpen ? "border-primary/20 bg-card shadow-sm" : "border-border bg-card/60 hover:bg-card hover:border-border"
    )}>
      <button onClick={onToggle} className="w-full text-left px-3 py-3 flex items-center gap-3">
        {/* Status icon */}
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", cfg.bg)}>
          <Icon className={cn("w-4 h-4", cfg.color)} />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Flower2 className="w-3.5 h-3.5 text-primary/60 shrink-0" />
            <span className="text-sm font-semibold text-foreground truncate">{tx.article}</span>
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0", cfg.bg, cfg.color)}>{tx.status}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[11px] text-muted-foreground truncate flex items-center gap-1"><User className="w-3 h-3 shrink-0" />{tx.supplier.split(" (")[0]}</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0"><Clock className="w-3 h-3" />{tx.purchaseTime}</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 shrink-0"><Hash className="w-3 h-3" />{tx.quantity.total}</span>
          </div>
        </div>

        {/* Destination + expected delivery */}
        <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-[10px] font-medium text-foreground/70 bg-muted/50 px-2 py-0.5 rounded flex items-center gap-1 border border-border/50">
            <Building2 className="w-3 h-3" />
            {tx.destination.includes("Rozenburg") ? "HBM Rozenburg" : tx.destination.includes("Amstelveen") ? "HBM Amstelveen" : tx.destination.split("/").pop()?.trim() || tx.destination}
          </span>
          {delivery && (
            <span className={cn("text-[10px] flex items-center gap-1 font-medium", delivery.accent)}>
              <Timer className="w-3 h-3" />{delivery.label}
            </span>
          )}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="px-3 pb-3">
          <TransactionDetail tx={tx} />
        </div>
      )}
    </div>
  );
};

/* ───── Loading skeleton ───── */
const LoadingSkeleton = () => (
  <div className="space-y-3 p-4">
    <div className="flex gap-2">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 flex-1 rounded-lg" />)}
    </div>
    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
  </div>
);

/* ───── Main component ───── */
type ViewState = "loading" | "empty" | "error" | "success";

interface FloritrackTransactionsProps {
  data?: FloritrackData;
  state?: ViewState;
  onRefresh?: () => void;
}

const FloritrackTransactions = ({ data, state = "success", onRefresh }: FloritrackTransactionsProps) => {
  const [openTxId, setOpenTxId] = useState<string | null>(null);
  const resolved = data ?? FLORITRACK_MOCK;

  if (state === "loading") return <LoadingSkeleton />;

  if (state === "empty") return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <Package className="w-8 h-8 text-muted-foreground/30 mb-2" />
      <p className="text-sm text-muted-foreground">Er zijn momenteel geen transacties beschikbaar vanuit de API.</p>
    </div>
  );

  if (state === "error") return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
        <span className="text-destructive text-lg">!</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">De transacties konden niet worden opgehaald vanuit Floritrack.</p>
      {onRefresh && (
        <button onClick={onRefresh} className="text-xs text-primary hover:underline flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Opnieuw proberen
        </button>
      )}
    </div>
  );

  const { summary, transactions } = resolved;

  return (
    <div className="space-y-3">
      {/* KPI strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <KPIChip label="Totaal" value={summary.total} icon={Package} accent="text-foreground" />
        <KPIChip label="Aangekocht" value={summary.purchased} icon={Package} accent="text-amber-500" />
        <KPIChip label="Onderweg" value={summary.inTransit} icon={Truck} accent="text-blue-500" />
        <KPIChip label="Afgeleverd" value={summary.delivered} icon={CheckCircle2} accent="text-emerald-500" />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-muted-foreground font-mono">
          Laatste update: {formatTime(summary.lastUpdated)}
        </span>
        {onRefresh && (
          <button onClick={onRefresh} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            <RefreshCw className="w-3 h-3" /> Vernieuwen
          </button>
        )}
      </div>

      {/* Transaction list */}
      <div className="space-y-2">
        {transactions.map(tx => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            isOpen={openTxId === tx.id}
            onToggle={() => setOpenTxId(openTxId === tx.id ? null : tx.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FloritrackTransactions;
