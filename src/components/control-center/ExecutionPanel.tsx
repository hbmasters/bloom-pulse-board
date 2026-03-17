import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Play, CheckCircle2, XCircle, Clock, AlertTriangle, ChevronDown, ChevronRight,
  User, Calendar, ArrowRight, Shield, RotateCcw, ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  type ExecutionIntent, type ExecutionStatus,
  executionStatusConfig, riskLevelConfig, sourceTypeConfig, executionModeConfig,
} from "./execution-types";
import { executionIntents } from "./execution-data";

/* ── Status badge ── */
const StatusBadge = ({ status }: { status: ExecutionStatus }) => {
  const s = executionStatusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", s.bg, s.text, s.border)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />
      {s.label}
    </span>
  );
};

/* ── Priority dot ── */
const PriorityIndicator = ({ priority }: { priority: string }) => {
  const colors: Record<string, string> = {
    critical: "bg-destructive",
    high: "text-orange-500",
    medium: "text-yellow-500",
    low: "text-muted-foreground",
  };
  const labels: Record<string, string> = { critical: "Kritiek", high: "Hoog", medium: "Medium", low: "Laag" };
  return (
    <span className={cn("text-[9px] font-mono font-bold uppercase", colors[priority])}>
      {labels[priority]}
    </span>
  );
};

/* ── Confidence bar ── */
const ConfidenceBar = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-12 h-1 rounded-full bg-muted/30 overflow-hidden">
      <div
        className={cn("h-full rounded-full", value > 0.8 ? "bg-accent" : value > 0.6 ? "bg-yellow-500" : "bg-orange-500")}
        style={{ width: `${value * 100}%` }}
      />
    </div>
    <span className="text-[9px] font-mono text-muted-foreground">{Math.round(value * 100)}%</span>
  </div>
);

/* ── Detail expansion ── */
const ExecutionDetail = ({ intent }: { intent: ExecutionIntent }) => (
  <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
    {/* Reasoning */}
    {intent.reasoning && (
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Onderbouwing</span>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{intent.reasoning}</p>
      </div>
    )}

    {/* Risk */}
    <div className="flex items-center gap-4 flex-wrap">
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Risico</span>
        <p className={cn("text-[11px] font-bold", riskLevelConfig[intent.risk_level].text)}>
          {riskLevelConfig[intent.risk_level].label}
          {intent.risk_type && <span className="font-normal text-muted-foreground"> — {intent.risk_type}</span>}
        </p>
      </div>
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Urgentie</span>
        <p className="text-[11px] font-mono text-foreground">{intent.urgency_score}/100</p>
      </div>
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Modus</span>
        <p className={cn("text-[11px] font-bold", executionModeConfig[intent.execution_mode].text)}>
          {executionModeConfig[intent.execution_mode].label}
        </p>
      </div>
    </div>

    {/* Payload */}
    {intent.execution_payload && (
      <div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Execution Payload</span>
        <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
          {Object.entries(intent.execution_payload).map(([key, val]) => (
            <div key={key} className="flex items-baseline gap-1.5">
              <span className="text-[9px] font-mono text-muted-foreground/50">{key}:</span>
              <span className="text-[10px] font-mono text-foreground">
                {Array.isArray(val) ? val.join(", ") : String(val)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Failure */}
    {intent.failure_reason && (
      <div className="rounded-md border border-destructive/20 bg-destructive/5 p-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle className="w-3 h-3 text-destructive" />
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-destructive">Fout</span>
        </div>
        <p className="text-[11px] text-destructive/80">{intent.failure_reason}</p>
      </div>
    )}

    {/* Traceability */}
    <div className="flex items-center gap-3 flex-wrap pt-1">
      <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground/60">
        <ExternalLink className="w-3 h-3" />
        <span className={sourceTypeConfig[intent.source_type].text}>{sourceTypeConfig[intent.source_type].label}</span>
        <ArrowRight className="w-2.5 h-2.5" />
        <span className="text-muted-foreground/80 max-w-[200px] truncate">{intent.source_context}</span>
      </div>
      {intent.related_task_ids?.map(tid => (
        <span key={tid} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted/30 border border-border text-muted-foreground">{tid}</span>
      ))}
    </div>

    {/* Action buttons */}
    <div className="flex items-center gap-2 pt-1 flex-wrap">
      {(intent.execution_status === "proposed") && (
        <>
          <ActionButton icon={CheckCircle2} label="Goedkeuren" className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" />
          <ActionButton icon={XCircle} label="Afwijzen" className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" />
          <ActionButton icon={User} label="Toewijzen" className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30" />
        </>
      )}
      {(intent.execution_status === "approved" || intent.execution_status === "prepared") && (
        <>
          <ActionButton icon={Play} label="Bevestig Uitvoering" className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" />
          <ActionButton icon={XCircle} label="Annuleren" className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30" />
          <ActionButton icon={Calendar} label="Deadline" className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30" />
        </>
      )}
      {intent.execution_status === "in_progress" && (
        <ActionButton icon={XCircle} label="Annuleren" className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" />
      )}
      {intent.execution_status === "failed" && (
        <ActionButton icon={RotateCcw} label="Opnieuw Proberen" className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20" />
      )}
    </div>

    {/* Semi-auto notice */}
    {intent.execution_mode === "semi-auto" && (intent.execution_status === "proposed" || intent.execution_status === "approved" || intent.execution_status === "prepared") && (
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-cyan-500/5 border border-cyan-500/10">
        <Shield className="w-3 h-3 text-cyan-500" />
        <span className="text-[9px] font-mono text-cyan-500/80">Semi-auto — uitvoering vereist expliciete bevestiging</span>
      </div>
    )}
  </div>
);

/* ── Action button helper ── */
const ActionButton = ({ icon: Icon, label, className }: { icon: typeof Play; label: string; className: string }) => (
  <button className={cn("inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer", className)}>
    <Icon className="w-3 h-3" />
    {label}
  </button>
);

/* ── Status lane grouping ── */
const statusLaneOrder: ExecutionStatus[] = ["proposed", "approved", "prepared", "in_progress", "completed", "failed", "cancelled", "rejected"];

/* ── Main Panel ── */
const ExecutionPanel = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);

  const activeLanes: ExecutionStatus[] = showTerminal
    ? statusLaneOrder
    : ["proposed", "approved", "prepared", "in_progress", "failed"];

  const grouped = activeLanes.reduce((acc, status) => {
    acc[status] = executionIntents.filter(i => i.execution_status === status);
    return acc;
  }, {} as Record<ExecutionStatus, ExecutionIntent[]>);

  const activeCount = executionIntents.filter(i => !["completed", "cancelled", "rejected"].includes(i.execution_status)).length;
  const needsAttention = executionIntents.filter(i => ["proposed", "failed"].includes(i.execution_status)).length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono">
        <span className="text-foreground font-bold">{activeCount} actief</span>
        {needsAttention > 0 && <span className="text-orange-500">{needsAttention} vereist actie</span>}
        <span className="text-muted-foreground">{executionIntents.length} totaal</span>
        <button
          onClick={() => setShowTerminal(!showTerminal)}
          className="ml-auto text-[9px] font-mono text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          {showTerminal ? "Verberg afgerond" : "Toon alles"}
        </button>
      </div>

      {/* Lanes */}
      {activeLanes.map(status => {
        const items = grouped[status];
        if (!items || items.length === 0) return null;
        const cfg = executionStatusConfig[status];

        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
              <span className={cn("text-[10px] font-mono font-bold uppercase tracking-widest", cfg.text)}>
                {cfg.label}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground/40">{items.length}</span>
            </div>

            <div className="space-y-2">
              {items.map(intent => {
                const isExpanded = expandedId === intent.id;
                return (
                  <div
                    key={intent.id}
                    className={cn(
                      "rounded-lg border p-3 transition-colors",
                      cfg.bg, cfg.border,
                      isExpanded && "ring-1 ring-primary/10"
                    )}
                  >
                    {/* Header row */}
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : intent.id)}
                    >
                      {isExpanded
                        ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      }
                      <span className="text-[9px] font-mono text-muted-foreground/40 shrink-0">{intent.id}</span>
                      <span className="text-xs font-bold text-foreground truncate">{intent.action_type}</span>
                      <PriorityIndicator priority={intent.priority} />
                      <ConfidenceBar value={intent.confidence} />
                      <div className="ml-auto flex items-center gap-2 shrink-0">
                        {intent.owner && (
                          <span className="text-[9px] font-mono text-muted-foreground/50 hidden sm:inline">→ {intent.owner}</span>
                        )}
                        {intent.due_date && (
                          <span className="text-[9px] font-mono text-muted-foreground/40 hidden sm:inline">{intent.due_date}</span>
                        )}
                        <StatusBadge status={intent.execution_status} />
                      </div>
                    </div>

                    {/* Action summary */}
                    <p className="text-[11px] text-muted-foreground mt-1.5 ml-5">{intent.recommended_action}</p>

                    {/* Source tag */}
                    <div className="flex items-center gap-2 mt-1.5 ml-5">
                      <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                        `${sourceTypeConfig[intent.source_type].text} bg-muted/10 border-border/40`
                      )}>
                        {sourceTypeConfig[intent.source_type].label}
                      </span>
                      <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                        `${executionModeConfig[intent.execution_mode].text} bg-muted/10 border-border/40`
                      )}>
                        {executionModeConfig[intent.execution_mode].label}
                      </span>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && <ExecutionDetail intent={intent} />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExecutionPanel;
