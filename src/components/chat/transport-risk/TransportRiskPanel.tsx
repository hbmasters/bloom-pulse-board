import { useState } from "react";
import { AlertTriangle, Truck, Flower2, Clock, ChevronDown, ChevronUp, ArrowRight, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransportRiskData, TransportRiskItem, RiskLevel } from "./transport-risk-types";

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; dot: string; border: string }> = {
  high:   { label: "Hoog risico",   color: "text-red-500",     bg: "bg-red-500/10",     dot: "bg-red-500",     border: "border-red-500/30" },
  medium: { label: "Middel risico", color: "text-amber-500",   bg: "bg-amber-500/10",   dot: "bg-amber-500",   border: "border-amber-500/30" },
  low:    { label: "Laag risico",   color: "text-emerald-500", bg: "bg-emerald-500/10", dot: "bg-emerald-500", border: "border-emerald-500/30" },
};

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  const cfg = RISK_CONFIG[level];
  return (
    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded border flex items-center gap-1 shrink-0", cfg.bg, cfg.border, cfg.color)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
};

const SummaryBar = ({ summary }: { summary: TransportRiskData["summary"] }) => (
  <div className="flex items-center gap-3 flex-wrap">
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
      <span className="text-xs font-semibold text-red-500">{summary.high}</span>
      <span className="text-[10px] text-red-500/70">hoog</span>
    </div>
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
      <Shield className="w-3.5 h-3.5 text-amber-500" />
      <span className="text-xs font-semibold text-amber-500">{summary.medium}</span>
      <span className="text-[10px] text-amber-500/70">middel</span>
    </div>
    {summary.low > 0 && (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <span className="text-xs font-semibold text-emerald-500">{summary.low}</span>
        <span className="text-[10px] text-emerald-500/70">laag</span>
      </div>
    )}
    <div className="ml-auto flex items-center gap-1.5 text-muted-foreground">
      <Flower2 className="w-3.5 h-3.5 text-primary/60" />
      <span className="text-[11px] font-medium">{summary.bouquets_impacted} boeketten geraakt</span>
    </div>
  </div>
);

const RiskCard = ({ risk }: { risk: TransportRiskItem }) => {
  const [open, setOpen] = useState(false);
  const cfg = RISK_CONFIG[risk.risk_level];

  return (
    <div className={cn("rounded-lg border transition-all", cfg.border, open ? "bg-card shadow-sm" : "bg-card/60")}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-3 py-2.5 flex items-center gap-3">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border", cfg.bg, cfg.border)}>
          <AlertTriangle className={cn("w-3.5 h-3.5", cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground truncate">{risk.article}</span>
            <RiskBadge level={risk.risk_level} />
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Truck className="w-3 h-3" />{risk.shipment_id}</span>
            <span>·</span>
            <span>{risk.supplier}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />ETA {risk.expected_arrival}</span>
            {risk.delay_minutes && risk.delay_minutes > 0 && (
              <span className={cn("font-semibold", cfg.color)}>+{risk.delay_minutes}m</span>
            )}
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-border/50 animate-fade-in space-y-2.5">
          {/* Risk message */}
          <div className={cn("text-[11px] px-2.5 py-2 rounded-lg border flex items-start gap-2", cfg.bg, cfg.border)}>
            <Zap className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", cfg.color)} />
            <span className="text-foreground">{risk.risk_message}</span>
          </div>

          {/* Affected bouquets */}
          {risk.bouquets_affected.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5 flex items-center gap-1">
                <Flower2 className="w-3 h-3 text-primary/50" />
                Boeketten geraakt
              </div>
              <div className="space-y-1">
                {risk.bouquets_affected.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] px-2 py-1.5 rounded bg-muted/30 border border-border/50">
                    <Flower2 className="w-3 h-3 text-primary/60 shrink-0" />
                    <span className="font-medium text-foreground">{b.name}</span>
                    <span className="text-muted-foreground">{b.quantity}st</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />vertrek {b.departure}
                    </span>
                    {b.customer && <span className="ml-auto text-muted-foreground/70 truncate">{b.customer}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Escalation */}
          {risk.escalation_target && risk.risk_level !== "low" && (
            <button className="w-full text-[11px] font-semibold px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Escaleer naar {risk.escalation_target}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const TransportRiskPanel = ({ data }: { data: TransportRiskData }) => {
  const sorted = [...data.risks].sort((a, b) => {
    const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
    return order[a.risk_level] - order[b.risk_level];
  });

  return (
    <div className="space-y-3">
      <SummaryBar summary={data.summary} />
      <div className="space-y-2">
        {sorted.map((risk, i) => (
          <RiskCard key={i} risk={risk} />
        ))}
      </div>
    </div>
  );
};

export default TransportRiskPanel;
