import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Package, AlertTriangle, TrendingDown, Clock } from "lucide-react";
import {
  type InventoryRiskIntent, type InventoryRiskType, inventoryRiskConfig,
} from "./pricing-inventory-types";
import { inventoryRiskIntents } from "./pricing-inventory-data";
import { executionStatusConfig, riskLevelConfig } from "./execution-types";
import {
  StatusBadge, PriorityIndicator, ConfidenceBar, ApprovalActions,
  SourceTags, TraceabilityRow, FailureBlock, PayloadGrid,
} from "./execution-shared";

/* ── Risk Type Badge ── */
const RiskTypeBadge = ({ riskType }: { riskType: InventoryRiskType }) => {
  const cfg = inventoryRiskConfig[riskType];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", cfg.bg, cfg.text, cfg.border)}>
      {cfg.label}
    </span>
  );
};

/* ── Detail ── */
const InventoryDetail = ({ item }: { item: InventoryRiskIntent }) => (
  <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
    <div>
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Onderbouwing</span>
      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.reason}</p>
    </div>
    <div className="flex items-center gap-4 flex-wrap">
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Risico</span>
        <p className={cn("text-[11px] font-bold", riskLevelConfig[item.risk_level].text)}>{riskLevelConfig[item.risk_level].label}</p>
      </div>
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Ernst</span>
        <p className={cn("text-[11px] font-bold", riskLevelConfig[item.severity].text)}>{riskLevelConfig[item.severity].label}</p>
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
const InventoryRiskPanel = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState<InventoryRiskType | "all">("all");

  const filtered = filterRisk === "all"
    ? inventoryRiskIntents
    : inventoryRiskIntents.filter(i => i.risk_type === filterRisk);

  const counts: Record<string, number> = {};
  inventoryRiskIntents.forEach(i => { counts[i.risk_type] = (counts[i.risk_type] || 0) + 1; });

  const needsAction = inventoryRiskIntents.filter(i => ["proposed", "failed"].includes(i.execution_status)).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono">
        <span className="text-foreground font-bold">{inventoryRiskIntents.length} voorraadrisico's</span>
        {needsAction > 0 && <span className="text-orange-500">{needsAction} vereist actie</span>}
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {(["all", "undersupply", "oversupply", "stale_stock", "margin_pressure"] as const).map(key => {
          const label = key === "all" ? "Alles" : inventoryRiskConfig[key].label;
          const count = key === "all" ? inventoryRiskIntents.length : (counts[key] || 0);
          const isActive = filterRisk === key;
          return (
            <button
              key={key}
              onClick={() => setFilterRisk(key)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors",
                isActive
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              {label} <span className="text-muted-foreground/40 ml-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-2">
        {filtered.map(item => {
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
                <RiskTypeBadge riskType={item.risk_type} />
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  <PriorityIndicator priority={item.priority} />
                  <ConfidenceBar value={item.confidence} />
                  <StatusBadge status={item.execution_status} />
                </div>
              </div>

              {/* Action summary */}
              <p className="text-[11px] text-muted-foreground mt-1.5 ml-5">{item.recommended_action}</p>

              {/* Source tags */}
              <SourceTags source_type={item.source_type} execution_mode={item.execution_mode} rule_id={item.source_rule_id} />

              {/* Detail */}
              {isExpanded && <InventoryDetail item={item} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryRiskPanel;
