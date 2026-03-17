import { cn } from "@/lib/utils";
import {
  Play, CheckCircle2, XCircle, Clock, AlertTriangle, ChevronDown, ChevronRight,
  User, Calendar, ArrowRight, Shield, RotateCcw, ExternalLink,
} from "lucide-react";
import {
  type ExecutionIntent, type ExecutionStatus,
  executionStatusConfig, riskLevelConfig, sourceTypeConfig, executionModeConfig,
} from "./execution-types";

/* ── Status badge ── */
export const StatusBadge = ({ status }: { status: ExecutionStatus }) => {
  const s = executionStatusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", s.bg, s.text, s.border)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.dot)} />
      {s.label}
    </span>
  );
};

/* ── Priority indicator ── */
export const PriorityIndicator = ({ priority }: { priority: string }) => {
  const colors: Record<string, string> = {
    critical: "text-destructive",
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
export const ConfidenceBar = ({ value }: { value: number }) => (
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

/* ── Action button ── */
export const ActionButton = ({ icon: Icon, label, className }: { icon: typeof Play; label: string; className: string }) => (
  <button className={cn("inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer", className)}>
    <Icon className="w-3 h-3" />
    {label}
  </button>
);

/* ── Approval actions row ── */
export const ApprovalActions = ({ status, mode }: { status: ExecutionStatus; mode: string }) => (
  <div className="flex items-center gap-2 pt-1 flex-wrap">
    {status === "proposed" && (
      <>
        <ActionButton icon={CheckCircle2} label="Goedkeuren" className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" />
        <ActionButton icon={XCircle} label="Afwijzen" className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" />
        <ActionButton icon={User} label="Toewijzen" className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30" />
      </>
    )}
    {(status === "approved" || status === "prepared") && (
      <>
        <ActionButton icon={Play} label="Bevestig Uitvoering" className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20" />
        <ActionButton icon={XCircle} label="Annuleren" className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30" />
        <ActionButton icon={Calendar} label="Deadline" className="bg-muted/20 text-muted-foreground border-border hover:bg-muted/30" />
      </>
    )}
    {status === "in_progress" && (
      <ActionButton icon={XCircle} label="Annuleren" className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" />
    )}
    {status === "failed" && (
      <ActionButton icon={RotateCcw} label="Opnieuw Proberen" className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20" />
    )}

    {/* Semi-auto notice */}
    {mode === "semi-auto" && ["proposed", "approved", "prepared"].includes(status) && (
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-cyan-500/5 border border-cyan-500/10 ml-auto">
        <Shield className="w-3 h-3 text-cyan-500" />
        <span className="text-[9px] font-mono text-cyan-500/80">Semi-auto — bevestiging vereist</span>
      </div>
    )}
  </div>
);

/* ── Source tags ── */
export const SourceTags = ({ source_type, execution_mode, rule_id }: { source_type: string; execution_mode: string; rule_id?: string }) => (
  <div className="flex items-center gap-2 mt-1.5 ml-5 flex-wrap">
    <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
      `${(sourceTypeConfig as any)[source_type]?.text || "text-muted-foreground"} bg-muted/10 border-border/40`
    )}>
      {(sourceTypeConfig as any)[source_type]?.label || source_type}
    </span>
    <span className={cn("text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
      `${(executionModeConfig as any)[execution_mode]?.text || "text-muted-foreground"} bg-muted/10 border-border/40`
    )}>
      {(executionModeConfig as any)[execution_mode]?.label || execution_mode}
    </span>
    {rule_id && (
      <span className="text-[8px] font-mono text-muted-foreground/40 px-1.5 py-0.5 rounded border border-border/30 bg-muted/5">
        {rule_id}
      </span>
    )}
  </div>
);

/* ── Traceability row ── */
export const TraceabilityRow = ({ source_type, source_context, related_task_ids }: {
  source_type: string; source_context: string; related_task_ids?: string[];
}) => (
  <div className="flex items-center gap-3 flex-wrap pt-1">
    <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground/60">
      <ExternalLink className="w-3 h-3" />
      <span className={(sourceTypeConfig as any)[source_type]?.text || "text-muted-foreground"}>
        {(sourceTypeConfig as any)[source_type]?.label || source_type}
      </span>
      <ArrowRight className="w-2.5 h-2.5" />
      <span className="text-muted-foreground/80 max-w-[200px] truncate">{source_context}</span>
    </div>
    {related_task_ids?.map(tid => (
      <span key={tid} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted/30 border border-border text-muted-foreground">{tid}</span>
    ))}
  </div>
);

/* ── Failure block ── */
export const FailureBlock = ({ reason }: { reason?: string }) => {
  if (!reason) return null;
  return (
    <div className="rounded-md border border-destructive/20 bg-destructive/5 p-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <AlertTriangle className="w-3 h-3 text-destructive" />
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-destructive">Fout</span>
      </div>
      <p className="text-[11px] text-destructive/80">{reason}</p>
    </div>
  );
};

/* ── Payload grid ── */
export const PayloadGrid = ({ payload }: { payload?: Record<string, unknown> }) => {
  if (!payload) return null;
  return (
    <div>
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Execution Payload</span>
      <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
        {Object.entries(payload).map(([key, val]) => (
          <div key={key} className="flex items-baseline gap-1.5">
            <span className="text-[9px] font-mono text-muted-foreground/50">{key}:</span>
            <span className="text-[10px] font-mono text-foreground">
              {Array.isArray(val) ? val.join(", ") : String(val)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
