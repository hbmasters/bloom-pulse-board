import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Loader2, Play, CheckCircle2, XCircle, Shield, RotateCcw } from "lucide-react";
import { inventoryRiskConfig, type InventoryRiskType } from "./pricing-inventory-types";
import { executionStatusConfig, riskLevelConfig } from "./execution-types";
import type { ExecutionStatus } from "./execution-types";
import {
  StatusBadge, PriorityIndicator, ConfidenceBar,
  SourceTags, TraceabilityRow, FailureBlock, PayloadGrid,
} from "./execution-shared";
import { useExecutionIntents, type ExecutionIntentRow } from "@/hooks/useExecutionIntents";

/* ── Action button ── */
const ActionBtn = ({ icon: Icon, label, className, onClick, disabled }: {
  icon: typeof Play; label: string; className: string; onClick?: () => void; disabled?: boolean;
}) => (
  <button onClick={(e) => { e.stopPropagation(); onClick?.(); }} disabled={disabled}
    className={cn("inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer disabled:opacity-50", className)}>
    <Icon className="w-3 h-3" />{label}
  </button>
);

/* ── Risk Type Badge ── */
const RiskTypeBadge = ({ riskType }: { riskType: string }) => {
  const cfg = inventoryRiskConfig[riskType as InventoryRiskType];
  if (!cfg) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", cfg.bg, cfg.text, cfg.border)}>
      {cfg.label}
    </span>
  );
};

/* ── Detail ── */
const InventoryDetail = ({ item, actions, readOnly = false }: { item: ExecutionIntentRow; actions: ReturnType<typeof useExecutionIntents>; readOnly?: boolean }) => {
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
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Risico</span>
          <p className={cn("text-[11px] font-bold", riskLevelConfig[item.risk_level as keyof typeof riskLevelConfig]?.text)}>{riskLevelConfig[item.risk_level as keyof typeof riskLevelConfig]?.label}</p>
        </div>
        {item.severity && (
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Ernst</span>
            <p className={cn("text-[11px] font-bold", riskLevelConfig[item.severity as keyof typeof riskLevelConfig]?.text)}>{riskLevelConfig[item.severity as keyof typeof riskLevelConfig]?.label}</p>
          </div>
        )}
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Urgentie</span>
          <p className="text-[11px] font-mono text-foreground">{item.urgency_score}/100</p>
        </div>
      </div>
      <PayloadGrid payload={item.execution_payload as Record<string, unknown> | undefined} />
      <FailureBlock reason={item.failure_reason || undefined} />
      <TraceabilityRow source_type={item.source_type} source_context={item.source_context || ""} related_task_ids={item.related_task_ids || undefined} />

      {!readOnly && (
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
          {status === "in_progress" && (
            <ActionBtn icon={XCircle} label="Annuleren" disabled={patching} onClick={() => actions.cancel(item.id)} className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" />
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
      )}
    </div>
  );
};

/* ── Main Panel ── */
const InventoryRiskPanel = ({ readOnly = false }: { readOnly?: boolean }) => {
  const actions = useExecutionIntents("inventory");
  const { intents, loading } = actions;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>("all");

  const filtered = filterRisk === "all" ? intents : intents.filter(i => i.inventory_risk_type === filterRisk);

  const counts: Record<string, number> = {};
  intents.forEach(i => { if (i.inventory_risk_type) counts[i.inventory_risk_type] = (counts[i.inventory_risk_type] || 0) + 1; });

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
        <span className="text-foreground font-bold">{intents.length} voorraadrisico's</span>
        {needsAction > 0 && <span className="text-orange-500">{needsAction} vereist actie</span>}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {["all", "undersupply", "oversupply", "stale_stock", "margin_pressure"].map(key => {
          const label = key === "all" ? "Alles" : (inventoryRiskConfig[key as InventoryRiskType]?.label || key);
          const count = key === "all" ? intents.length : (counts[key] || 0);
          const isActive = filterRisk === key;
          return (
            <button key={key} onClick={() => setFilterRisk(key)}
              className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors",
                isActive ? "bg-primary/15 border-primary/30 text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}>
              {label} <span className="text-muted-foreground/40 ml-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.map(item => {
          const isExpanded = expandedId === item.id;
          const statusCfg = executionStatusConfig[item.execution_status as ExecutionStatus];
          if (!statusCfg) return null;

          return (
            <div key={item.id} className={cn("rounded-lg border p-3 transition-colors", statusCfg.bg, statusCfg.border, isExpanded && "ring-1 ring-primary/10")}>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                <span className="text-[9px] font-mono text-muted-foreground/40 shrink-0">{item.id}</span>
                <span className="text-xs font-bold text-foreground truncate">{item.product_name}</span>
                {item.inventory_risk_type && <RiskTypeBadge riskType={item.inventory_risk_type} />}
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  <PriorityIndicator priority={item.priority} />
                  <ConfidenceBar value={Number(item.confidence)} />
                  <StatusBadge status={item.execution_status as ExecutionStatus} />
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 ml-5">{item.recommended_action}</p>
              <SourceTags source_type={item.source_type} execution_mode={item.execution_mode} rule_id={item.source_rule_id || undefined} />
              {isExpanded && <InventoryDetail item={item} actions={actions} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryRiskPanel;
