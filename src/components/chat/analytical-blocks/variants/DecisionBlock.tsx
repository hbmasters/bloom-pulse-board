import { Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockShell, SeverityBadge } from "../BlockShell";
import { DOMAIN_COLORS } from "../block-domain-colors";
import type { DecisionData } from "../block-types";

const URGENCY_CONFIG = {
  now: { label: "NU", bg: "bg-red-500/15", text: "text-red-400" },
  today: { label: "Vandaag", bg: "bg-amber-500/10", text: "text-amber-400" },
  this_week: { label: "Deze week", bg: "bg-blue-500/10", text: "text-blue-400" },
  later: { label: "Later", bg: "bg-muted", text: "text-muted-foreground" },
};

const EXEC_MODE: Record<string, string> = {
  auto: "⚡ Auto",
  "semi-auto": "🔄 Semi-auto",
  manual: "✋ Handmatig",
};

export const DecisionBlock = ({ data }: { data: DecisionData }) => {
  const colors = DOMAIN_COLORS.decision;

  return (
    <BlockShell
      domain="decision"
      title={data.title}
      icon={<Target className="w-3.5 h-3.5" />}
      badge={data.decisions.length}
    >
      <p className="text-[11px] text-muted-foreground leading-relaxed">{data.summary}</p>

      <div className="space-y-2">
        {data.decisions.map((d, i) => {
          const urg = URGENCY_CONFIG[d.urgency];
          return (
            <div key={i} className={cn(
              "rounded-md border p-2.5 space-y-1.5 bg-card/50",
              d.urgency === "now" ? "border-red-500/40" : colors.border
            )}>
              {/* Decision header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] font-semibold text-foreground leading-tight">{d.decision}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded", urg.bg, urg.text)}>{urg.label}</span>
                </div>
              </div>

              {/* Reason */}
              <div className="text-[10px] text-muted-foreground">{d.reason}</div>

              {/* Impact + Risk row */}
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-muted-foreground">Impact: <span className="text-foreground font-medium">{d.impact}</span></span>
                <span className="text-muted-foreground">Risico: </span>
                <SeverityBadge level={d.risk} />
                {d.execution_mode && (
                  <span className="text-[9px] text-muted-foreground font-mono">{EXEC_MODE[d.execution_mode]}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </BlockShell>
  );
};
