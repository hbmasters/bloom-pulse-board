import { Truck, Clock, MapPin, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockShell } from "../BlockShell";
import { DOMAIN_COLORS } from "../block-domain-colors";
import type { FloritrackLogisticsData } from "../block-types";

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  Aangekocht: { bg: "bg-amber-500/10", text: "text-amber-400" },
  Onderweg: { bg: "bg-blue-500/10", text: "text-blue-400" },
  Afgeleverd: { bg: "bg-emerald-500/10", text: "text-emerald-400" },
};

export const FloritrackLogisticsBlock = ({ data }: { data: FloritrackLogisticsData }) => {
  const colors = DOMAIN_COLORS.logistics;
  const sc = data.status_counts;

  return (
    <BlockShell
      domain="logistics"
      title={data.title}
      icon={<Truck className="w-3.5 h-3.5" />}
      badge={sc.totaal}
    >
      <p className="text-[11px] text-muted-foreground leading-relaxed">{data.summary}</p>

      {/* Status strip */}
      <div className="flex gap-2">
        {[
          { label: "Aangekocht", value: sc.aangekocht, color: "text-amber-400" },
          { label: "Onderweg", value: sc.onderweg, color: "text-blue-400" },
          { label: "Afgeleverd", value: sc.afgeleverd, color: "text-emerald-400" },
        ].map(s => (
          <div key={s.label} className={cn("rounded-md px-2 py-1 border", colors.bgMuted, colors.border)}>
            <div className="text-[9px] text-muted-foreground">{s.label}</div>
            <div className={cn("text-sm font-bold", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Transaction cards */}
      <div className="space-y-1.5">
        {data.transactions.map((tx, i) => {
          const style = STATUS_STYLE[tx.status] || STATUS_STYLE.Aangekocht;
          return (
            <div key={i} className={cn("rounded-md border p-2 space-y-1", colors.border, "bg-card/50")}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground">{tx.article}</span>
                <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded", style.bg, style.text)}>{tx.status}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>📦 {tx.supplier}</span>
                <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{tx.destination}</span>
              </div>
              {tx.eta && (
                <div className="flex items-center gap-1 text-[10px]">
                  <Clock className="w-2.5 h-2.5 text-blue-400" />
                  <span className="text-muted-foreground">ETA: {tx.eta}</span>
                  {tx.delay_minutes !== undefined && tx.delay_minutes > 0 && (
                    <span className="text-red-400 font-semibold">+{tx.delay_minutes}m</span>
                  )}
                </div>
              )}
              {tx.bouquets && tx.bouquets.length > 0 && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Flower2 className="w-2.5 h-2.5 text-primary/40" />
                  <span>→ {tx.bouquets.map(b => `${b.name} (${b.quantity}st${b.departure ? ` · ${b.departure}` : ""})`).join(", ")}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </BlockShell>
  );
};
