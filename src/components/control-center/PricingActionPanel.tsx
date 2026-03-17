import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { priceActionConfig, type PriceAction } from "./pricing-inventory-types";
import { executionStatusConfig, riskLevelConfig } from "./execution-types";
import type { ExecutionStatus } from "./execution-types";
import {
  StatusBadge, PriorityIndicator, ConfidenceBar, ApprovalActions,
  SourceTags, TraceabilityRow, FailureBlock, PayloadGrid,
} from "./execution-shared";
import { useExecutionIntents, type ExecutionIntentRow } from "@/hooks/useExecutionIntents";
import {
  Play, CheckCircle2, XCircle, Shield, RotateCcw,
} from "lucide-react";

/* ── Action button ── */
const ActionBtn = ({ icon: Icon, label, className, onClick, disabled }: {
  icon: typeof Play; label: string; className: string; onClick?: () => void; disabled?: boolean;
}) => (
  <button onClick={(e) => { e.stopPropagation(); onClick?.(); }} disabled={disabled}
    className={cn("inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer disabled:opacity-50", className)}>
    <Icon className="w-3 h-3" />{label}
  </button>
);

/* ── Price Action Badge ── */
const PriceActionBadge = ({ action }: { action: string }) => {
  const cfg = priceActionConfig[action as PriceAction];
  if (!cfg) return null;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", cfg.bg, cfg.text, cfg.border)}>
      <span className="text-xs">{cfg.icon}</span>{cfg.label}
    </span>
  );
};

const PriceDelta = ({ value, pct }: { value?: number | null; pct?: number | null }) => {
  if (!value && !pct) return null;
  const v = value || 0;
  const Icon = v > 0 ? TrendingUp : v < 0 ? TrendingDown : Minus;
  const color = v > 0 ? "text-orange-500" : v < 0 ? "text-blue-500" : "text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-bold font-mono", color)}>
      <Icon className="w-3 h-3" />
      {value != null && `€${Math.abs(value).toFixed(2)}`}
      {pct != null && <span className="text-[9px] text-muted-foreground/60">({pct > 0 ? "+" : ""}{pct.toFixed(1)}%)</span>}
    </span>
  );
};

const PricingDetail = ({ item, actions, readOnly = false }: { item: ExecutionIntentRow; actions: ReturnType<typeof useExecutionIntents>; readOnly?: boolean }) => {
  const patching = actions.patchingId === item.id;
  const status = item.execution_status as ExecutionStatus;
  return (
    <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
      {item.reasoning && (
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Onderbouwing</span>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.reasoning}</p>
        </div>
      )}
      {item.recommendation && (
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Aanbeveling</span>
          <p className="text-[11px] text-foreground/80 mt-0.5 leading-relaxed font-medium">{item.recommendation}</p>
        </div>
      )}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Risico</span>
          <p className={cn("text-[11px] font-bold", riskLevelConfig[item.risk_level as keyof typeof riskLevelConfig]?.text)}>{riskLevelConfig[item.risk_level as keyof typeof riskLevelConfig]?.label}</p>
        </div>
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Urgentie</span>
          <p className="text-[11px] font-mono text-foreground">{item.urgency_score}/100</p>
        </div>
      </div>
      <PayloadGrid payload={item.execution_payload as Record<string, unknown> | undefined} />
      <FailureBlock reason={item.failure_reason || undefined} />
      <TraceabilityRow source_type={item.source_type} source_context={item.source_context || ""} related_task_ids={item.related_task_ids || undefined} />

      <div className="flex items-center gap-2 pt-1 flex-wrap">
        {patching && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
        {status === "proposed" && (
          <>
            <ActionBtn icon={CheckCircle2} label="Goedkeuren" disabled={patching} onClick={() => actions.approve(item.id)} className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" />
            <ActionBtn icon={XCircle} label="Afwijzen" disabled={patching} onClick={() => actions.reject(item.id)} className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" />
          </>
        )}
        {(status === "approved" || status === "prepared") && (
          <>
            <ActionBtn icon={Play} label="Bevestig" disabled={patching} onClick={() => actions.confirm(item.id)} className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" />
            <ActionBtn icon={XCircle} label="Annuleren" disabled={patching} onClick={() => actions.cancel(item.id)} className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30" />
          </>
        )}
        {status === "failed" && (
          <ActionBtn icon={RotateCcw} label="Opnieuw" disabled={patching} onClick={() => actions.retry(item.id)} className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20" />
        )}
        {item.execution_mode === "semi-auto" && ["proposed", "approved", "prepared"].includes(status) && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-cyan-500/5 border border-cyan-500/10 ml-auto">
            <Shield className="w-3 h-3 text-cyan-500" />
            <span className="text-[9px] font-mono text-cyan-500/80">Semi-auto</span>
          </div>
        )}
      </div>
    </div>
  );
};

const PricingActionPanel = () => {
  const actions = useExecutionIntents("pricing");
  const { intents, loading, patchingId } = actions;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const needsAction = intents.filter(i => ["proposed", "failed"].includes(i.execution_status)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /><span className="text-[11px] font-mono">Laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono">
        <span className="text-foreground font-bold">{intents.length} prijsacties</span>
        {needsAction > 0 && <span className="text-orange-500">{needsAction} vereist actie</span>}
      </div>
      <div className="space-y-2">
        {intents.map(item => {
          const isExpanded = expandedId === item.id;
          const statusCfg = executionStatusConfig[item.execution_status as ExecutionStatus];
          if (!statusCfg) return null;

          return (
            <div key={item.id} className={cn("rounded-lg border p-3 transition-colors", statusCfg.bg, statusCfg.border, isExpanded && "ring-1 ring-primary/10")}>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                <span className="text-[9px] font-mono text-muted-foreground/40 shrink-0">{item.id}</span>
                <span className="text-xs font-bold text-foreground truncate">{item.product_name}</span>
                {item.advised_price_action && <PriceActionBadge action={item.advised_price_action} />}
                {item.current_price && <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">€{Number(item.current_price).toFixed(2)}</span>}
                <PriceDelta value={item.proposed_delta_value ? Number(item.proposed_delta_value) : null} pct={item.proposed_delta_pct ? Number(item.proposed_delta_pct) : null} />
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  <PriorityIndicator priority={item.priority} />
                  <ConfidenceBar value={Number(item.confidence)} />
                  <StatusBadge status={item.execution_status as ExecutionStatus} />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 ml-5">{item.recommendation || item.recommended_action}</p>
              <SourceTags source_type={item.source_type} execution_mode={item.execution_mode} rule_id={item.source_rule_id || undefined} />
              {isExpanded && <PricingDetail item={item} actions={actions} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingActionPanel;
