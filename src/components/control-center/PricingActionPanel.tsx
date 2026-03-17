import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react";
import {
  type PricingIntent, type PriceAction, priceActionConfig,
} from "./pricing-inventory-types";
import { pricingIntents } from "./pricing-inventory-data";
import { executionStatusConfig, riskLevelConfig } from "./execution-types";
import {
  StatusBadge, PriorityIndicator, ConfidenceBar, ApprovalActions,
  SourceTags, TraceabilityRow, FailureBlock, PayloadGrid,
} from "./execution-shared";

/* ── Price Action Badge ── */
const PriceActionBadge = ({ action }: { action: PriceAction }) => {
  const cfg = priceActionConfig[action];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", cfg.bg, cfg.text, cfg.border)}>
      <span className="text-xs">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
};

/* ── Price delta display ── */
const PriceDelta = ({ value, pct }: { value?: number; pct?: number }) => {
  if (!value && !pct) return null;
  const isPositive = (value || 0) > 0;
  const Icon = isPositive ? TrendingUp : (value || 0) < 0 ? TrendingDown : Minus;
  const color = isPositive ? "text-orange-500" : (value || 0) < 0 ? "text-blue-500" : "text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold font-mono", color)}>
      <Icon className="w-3 h-3" />
      {value !== undefined && `€${Math.abs(value).toFixed(2)}`}
      {pct !== undefined && <span className="text-[9px] text-muted-foreground/60">({pct > 0 ? "+" : ""}{pct.toFixed(1)}%)</span>}
    </span>
  );
};

/* ── Detail ── */
const PricingDetail = ({ item }: { item: PricingIntent }) => (
  <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
    <div>
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Onderbouwing</span>
      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.reason}</p>
    </div>
    <div>
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Aanbeveling</span>
      <p className="text-[11px] text-foreground/80 mt-0.5 leading-relaxed font-medium">{item.recommendation}</p>
    </div>
    <div className="flex items-center gap-4 flex-wrap">
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Risico</span>
        <p className={cn("text-[11px] font-bold", riskLevelConfig[item.risk_level].text)}>{riskLevelConfig[item.risk_level].label}</p>
      </div>
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Urgentie</span>
        <p className="text-[11px] font-mono text-foreground">{item.urgency_score}/100</p>
      </div>
    </div>
    <PayloadGrid payload={item.execution_payload} />
    <FailureBlock reason={item.failure_reason} />
    <TraceabilityRow source_type={item.source_type} source_context={item.source_context} related_task_ids={item.related_task_ids} />
    <ApprovalActions status={item.execution_status} mode={item.execution_mode} />
  </div>
);

/* ── Main Panel ── */
const PricingActionPanel = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const needsAction = pricingIntents.filter(i => ["proposed", "failed"].includes(i.execution_status)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono">
        <span className="text-foreground font-bold">{pricingIntents.length} prijsacties</span>
        {needsAction > 0 && <span className="text-orange-500">{needsAction} vereist actie</span>}
      </div>

      <div className="space-y-2">
        {pricingIntents.map(item => {
          const isExpanded = expandedId === item.id;
          const statusCfg = executionStatusConfig[item.execution_status];

          return (
            <div
              key={item.id}
              className={cn("rounded-lg border p-3 transition-colors", statusCfg.bg, statusCfg.border, isExpanded && "ring-1 ring-primary/10")}
            >
              {/* Header */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                <span className="text-[9px] font-mono text-muted-foreground/40 shrink-0">{item.id}</span>
                <span className="text-xs font-bold text-foreground truncate">{item.product_name}</span>
                <PriceActionBadge action={item.advised_price_action} />
                {item.current_price && (
                  <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">€{item.current_price.toFixed(2)}</span>
                )}
                <PriceDelta value={item.proposed_delta_value} pct={item.proposed_delta_pct} />
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  <PriorityIndicator priority={item.priority} />
                  <ConfidenceBar value={item.confidence} />
                  <StatusBadge status={item.execution_status} />
                </div>
              </div>

              {/* Summary */}
              <p className="text-[11px] text-muted-foreground mt-1.5 ml-5">{item.recommendation}</p>

              {/* Source tags */}
              <SourceTags source_type={item.source_type} execution_mode={item.execution_mode} rule_id={item.source_rule_id} />

              {/* Detail */}
              {isExpanded && <PricingDetail item={item} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingActionPanel;
