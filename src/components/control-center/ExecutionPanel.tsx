import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Play, CheckCircle2, XCircle, Clock, AlertTriangle, ChevronDown, ChevronRight,
  User, Calendar, ArrowRight, Shield, RotateCcw, ExternalLink, Loader2,
} from "lucide-react";
import {
  type ExecutionStatus,
  executionStatusConfig, riskLevelConfig, sourceTypeConfig, executionModeConfig,
} from "./execution-types";
import {
  StatusBadge, PriorityIndicator, ConfidenceBar, SourceTags, TraceabilityRow, FailureBlock, PayloadGrid,
} from "./execution-shared";
import { useExecutionIntents, type ExecutionIntentRow } from "@/hooks/useExecutionIntents";

/* ── Action button helper ── */
const ActionButton = ({ icon: Icon, label, className, onClick, disabled }: {
  icon: typeof Play; label: string; className: string; onClick?: () => void; disabled?: boolean;
}) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    disabled={disabled}
    className={cn("inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", className)}
  >
    <Icon className="w-3 h-3" />
    {label}
  </button>
);

/* ── Owner input ── */
const OwnerInput = ({ current, onSave, disabled }: { current?: string | null; onSave: (v: string) => void; disabled?: boolean }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(current || "");

  if (!editing) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setEditing(true); setValue(current || ""); }}
        className="text-[9px] font-mono text-muted-foreground/50 hover:text-foreground transition-colors"
        disabled={disabled}
      >
        {current ? `→ ${current}` : "Toewijzen"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
      <input
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter" && value.trim()) { onSave(value.trim()); setEditing(false); }
          if (e.key === "Escape") setEditing(false);
        }}
        className="h-5 w-20 px-1 text-[9px] font-mono rounded border border-border bg-background text-foreground"
        placeholder="Eigenaar..."
      />
      <button onClick={() => { if (value.trim()) { onSave(value.trim()); setEditing(false); } }} className="text-[9px] text-accent font-bold">✓</button>
    </div>
  );
};

/* ── Due date input ── */
const DueDateInput = ({ current, onSave, disabled }: { current?: string | null; onSave: (v: string) => void; disabled?: boolean }) => {
  const [editing, setEditing] = useState(false);

  if (!editing) {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        className="text-[9px] font-mono text-muted-foreground/40 hover:text-foreground transition-colors"
        disabled={disabled}
      >
        {current || "Deadline"}
      </button>
    );
  }

  return (
    <div onClick={e => e.stopPropagation()}>
      <input
        autoFocus
        type="date"
        defaultValue={current || ""}
        onChange={e => { if (e.target.value) { onSave(e.target.value); setEditing(false); } }}
        onBlur={() => setEditing(false)}
        className="h-5 px-1 text-[9px] font-mono rounded border border-border bg-background text-foreground"
      />
    </div>
  );
};

/* ── Detail expansion ── */
const ExecutionDetail = ({ intent, actions, readOnly = false }: { intent: ExecutionIntentRow; actions: ReturnType<typeof useExecutionIntents>; readOnly?: boolean }) => {
  const patching = actions.patchingId === intent.id;
  const status = intent.execution_status as ExecutionStatus;

  return (
    <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
      {intent.reasoning && (
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Onderbouwing</span>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{intent.reasoning}</p>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Risico</span>
          <p className={cn("text-[11px] font-bold", riskLevelConfig[intent.risk_level as keyof typeof riskLevelConfig]?.text || "text-muted-foreground")}>
            {riskLevelConfig[intent.risk_level as keyof typeof riskLevelConfig]?.label || intent.risk_level}
            {intent.risk_type && <span className="font-normal text-muted-foreground"> — {intent.risk_type}</span>}
          </p>
        </div>
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Urgentie</span>
          <p className="text-[11px] font-mono text-foreground">{intent.urgency_score}/100</p>
        </div>
        <div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Modus</span>
          <p className={cn("text-[11px] font-bold", executionModeConfig[intent.execution_mode as keyof typeof executionModeConfig]?.text || "text-muted-foreground")}>
            {executionModeConfig[intent.execution_mode as keyof typeof executionModeConfig]?.label || intent.execution_mode}
          </p>
        </div>
      </div>

      <PayloadGrid payload={intent.execution_payload as Record<string, unknown> | undefined} />
      <FailureBlock reason={intent.failure_reason || undefined} />
      <TraceabilityRow
        source_type={intent.source_type}
        source_context={intent.source_context || ""}
        related_task_ids={intent.related_task_ids || undefined}
      />

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        {patching && <Loader2 className="w-3 h-3 animate-spin text-primary" />}

        {status === "proposed" && (
          <>
            <ActionButton icon={CheckCircle2} label="Goedkeuren" disabled={patching} onClick={() => actions.approve(intent.id)} className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" />
            <ActionButton icon={XCircle} label="Afwijzen" disabled={patching} onClick={() => actions.reject(intent.id)} className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" />
          </>
        )}
        {(status === "approved" || status === "prepared") && (
          <>
            <ActionButton icon={Play} label="Bevestig Uitvoering" disabled={patching} onClick={() => actions.confirm(intent.id)} className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" />
            <ActionButton icon={XCircle} label="Annuleren" disabled={patching} onClick={() => actions.cancel(intent.id)} className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30" />
          </>
        )}
        {status === "in_progress" && (
          <ActionButton icon={XCircle} label="Annuleren" disabled={patching} onClick={() => actions.cancel(intent.id)} className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" />
        )}
        {status === "failed" && (
          <ActionButton icon={RotateCcw} label="Opnieuw Proberen" disabled={patching} onClick={() => actions.retry(intent.id)} className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20" />
        )}
      </div>

      {intent.execution_mode === "semi-auto" && ["proposed", "approved", "prepared"].includes(status) && (
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-cyan-500/5 border border-cyan-500/10">
          <Shield className="w-3 h-3 text-cyan-500" />
          <span className="text-[9px] font-mono text-cyan-500/80">Semi-auto — uitvoering vereist expliciete bevestiging</span>
        </div>
      )}
    </div>
  );
};

/* ── Status lane grouping ── */
const statusLaneOrder: ExecutionStatus[] = ["proposed", "approved", "prepared", "in_progress", "completed", "failed", "cancelled", "rejected"];

/* ── Main Panel ── */
const ExecutionPanel = () => {
  const actions = useExecutionIntents("operations");
  const { intents, loading, patchingId } = actions;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);

  const activeLanes: ExecutionStatus[] = showTerminal
    ? statusLaneOrder
    : ["proposed", "approved", "prepared", "in_progress", "failed"];

  const grouped = activeLanes.reduce((acc, status) => {
    acc[status] = intents.filter(i => i.execution_status === status);
    return acc;
  }, {} as Record<ExecutionStatus, ExecutionIntentRow[]>);

  const activeCount = intents.filter(i => !["completed", "cancelled", "rejected"].includes(i.execution_status)).length;
  const needsAttention = intents.filter(i => ["proposed", "failed"].includes(i.execution_status)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-[11px] font-mono">Laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono">
        <span className="text-foreground font-bold">{activeCount} actief</span>
        {needsAttention > 0 && <span className="text-orange-500">{needsAttention} vereist actie</span>}
        <span className="text-muted-foreground">{intents.length} totaal</span>
        <button onClick={() => setShowTerminal(!showTerminal)} className="ml-auto text-[9px] font-mono text-muted-foreground/60 hover:text-muted-foreground transition-colors">
          {showTerminal ? "Verberg afgerond" : "Toon alles"}
        </button>
      </div>

      {activeLanes.map(status => {
        const items = grouped[status];
        if (!items || items.length === 0) return null;
        const cfg = executionStatusConfig[status];

        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
              <span className={cn("text-[10px] font-mono font-bold uppercase tracking-widest", cfg.text)}>{cfg.label}</span>
              <span className="text-[9px] font-mono text-muted-foreground/40">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map(intent => {
                const isExpanded = expandedId === intent.id;
                return (
                  <div key={intent.id} className={cn("rounded-lg border p-3 transition-colors", cfg.bg, cfg.border, isExpanded && "ring-1 ring-primary/10")}>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : intent.id)}>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                      <span className="text-[9px] font-mono text-muted-foreground/40 shrink-0">{intent.id}</span>
                      <span className="text-xs font-bold text-foreground truncate">{intent.action_type}</span>
                      <PriorityIndicator priority={intent.priority} />
                      <ConfidenceBar value={Number(intent.confidence)} />
                      <div className="ml-auto flex items-center gap-2 shrink-0">
                        <OwnerInput current={intent.owner} onSave={(v) => actions.setOwner(intent.id, v)} disabled={patchingId === intent.id} />
                        <DueDateInput current={intent.due_date} onSave={(v) => actions.setDueDate(intent.id, v)} disabled={patchingId === intent.id} />
                        <StatusBadge status={intent.execution_status as ExecutionStatus} />
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 ml-5">{intent.recommended_action}</p>
                    <SourceTags source_type={intent.source_type} execution_mode={intent.execution_mode} rule_id={intent.source_rule_id || undefined} />
                    {isExpanded && <ExecutionDetail intent={intent} actions={actions} />}
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
