import { LayoutDashboard, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockShell, KPIStrip, SeverityBadge } from "../BlockShell";
import type { ExecutiveSummaryData } from "../block-types";

export const ExecutiveSummaryBlock = ({ data }: { data: ExecutiveSummaryData }) => (
  <BlockShell domain="executive" title={data.title} icon={<LayoutDashboard className="w-3.5 h-3.5" />}>
    {/* Summary */}
    <p className="text-[11px] text-muted-foreground leading-relaxed">{data.summary}</p>

    {/* KPIs */}
    {data.kpis && data.kpis.length > 0 && <KPIStrip kpis={data.kpis} domain="executive" />}

    {/* Key findings */}
    {data.key_findings && data.key_findings.length > 0 && (
      <div className="space-y-1">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">Bevindingen</div>
        {data.key_findings.map((f, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[11px] text-foreground">
            <CheckCircle2 className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
            <span>{f}</span>
          </div>
        ))}
      </div>
    )}

    {/* Top risks */}
    {data.top_risks && data.top_risks.length > 0 && (
      <div className="space-y-1">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">Risico's</div>
        {data.top_risks.map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="text-foreground flex-1">{r.issue}</span>
            <SeverityBadge level={r.severity} />
          </div>
        ))}
      </div>
    )}

    {/* Top actions */}
    {data.top_actions && data.top_actions.length > 0 && (
      <div className="space-y-1">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">Acties</div>
        {data.top_actions.map((a, i) => (
          <div key={i} className="flex items-start gap-1.5 text-[11px] text-foreground">
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
            <span>{a}</span>
          </div>
        ))}
      </div>
    )}

    {/* Confidence */}
    {data.confidence !== undefined && (
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
        <span>Confidence</span>
        <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full bg-slate-400/60" style={{ width: `${data.confidence * 100}%` }} />
        </div>
        <span>{Math.round(data.confidence * 100)}%</span>
      </div>
    )}
  </BlockShell>
);
