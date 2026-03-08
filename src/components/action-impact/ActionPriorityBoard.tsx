import { useState } from "react";
import { Zap, ArrowRight, Database, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DepartmentBadge, SubdepartmentChip, DepartmentFilter, type Department } from "@/components/department/DepartmentBadge";
import type { ActionItem } from "./types";
import { calcPriorityScore } from "./types";

const priorityStyle: Record<string, string> = {
  Critical: "text-red-500 bg-red-500/10 border-red-500/20",
  High: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  Low: "text-muted-foreground bg-muted/20 border-border",
};

const effortDots: Record<string, string> = {
  Low: "bg-accent",
  Medium: "bg-yellow-500",
  High: "bg-red-500",
};

const statusLabel: Record<string, { text: string; cls: string }> = {
  open: { text: "OPEN", cls: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  in_progress: { text: "IN PROGRESS", cls: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  completed: { text: "COMPLETED", cls: "text-accent bg-accent/10 border-accent/20" },
};

const allDepts: (Department | "All")[] = ["All", "Verkoop", "Inkoop", "Productie", "Administratie", "Financieel"];

interface Props {
  actions: ActionItem[];
}

export const ActionPriorityBoard = ({ actions }: Props) => {
  const [deptFilter, setDeptFilter] = useState<string>("All");

  const filtered = actions
    .filter((a) => deptFilter === "All" || a.department_owner === deptFilter)
    .sort((a, b) => calcPriorityScore(b) - calcPriorityScore(a));

  return (
    <div className="space-y-4">
      <DepartmentFilter departments={allDepts} active={deptFilter} onChange={setDeptFilter} />

      <div className="space-y-3">
        {filtered.map((action, idx) => {
          const score = calcPriorityScore(action);
          const st = statusLabel[action.status];

          return (
            <div
              key={action.id}
              className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                action.priority === "Critical" ? "border-red-500/30 bg-red-500/5" :
                action.priority === "High" ? "border-orange-400/20 bg-orange-400/5" :
                action.priority === "Medium" ? "border-yellow-500/20 bg-yellow-500/5" :
                "border-border bg-muted/10"
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-[10px] font-mono text-muted-foreground/50 tabular-nums">#{idx + 1}</span>
                  <Zap className={`w-3.5 h-3.5 shrink-0 ${action.priority === "Critical" || action.priority === "High" ? "text-red-500" : "text-primary"}`} />
                  <span className="text-sm font-bold text-foreground">{action.action_title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border ${priorityStyle[action.priority]}`}>
                    {action.priority.toUpperCase()}
                  </span>
                  <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border ${st.cls}`}>
                    {st.text}
                  </span>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-2 flex-wrap mb-3 text-[10px] font-mono text-muted-foreground">
                <DepartmentBadge department={action.department_owner} size="sm" />
                {action.sub_department && <SubdepartmentChip sub={action.sub_department} />}
                <span className="text-border">|</span>
                <span>Driver: <span className="text-foreground font-semibold">{action.driver.replace(/_/g, " ")}</span></span>
                {action.flower && (
                  <>
                    <span className="text-border">|</span>
                    <span>Bloem: <span className="text-foreground font-semibold">{action.flower}</span></span>
                  </>
                )}
              </div>

              {/* Content grid */}
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1">Aanbevolen actie</h4>
                  <div className="flex items-start gap-1.5 text-[11px]">
                    <ArrowRight className="w-3 h-3 mt-0.5 text-accent shrink-0" />
                    <span className="text-foreground/80">{action.recommended_action}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1">Impact</h4>
                  <div className="space-y-1">
                    {action.impact_financial != null && (
                      <div className="text-[11px] font-mono font-bold text-accent">
                        €{action.impact_financial.toLocaleString("nl-NL")} /jaar
                      </div>
                    )}
                    {action.impact_efficiency != null && (
                      <div className="text-[11px] font-mono text-primary">
                        +{action.impact_efficiency} W-APU
                      </div>
                    )}
                    {action.impact_supply_stability != null && (
                      <div className="text-[11px] font-mono text-blue-400">
                        +{action.impact_supply_stability}% supply stability
                      </div>
                    )}
                    {action.impact_risk_reduction && action.impact_risk_reduction !== "none" && (
                      <div className="flex items-center gap-1 text-[11px] font-mono text-yellow-500">
                        <AlertTriangle className="w-3 h-3" />
                        Risk reduction: {action.impact_risk_reduction}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mb-1">Effort & Score</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${effortDots[action.effort_level]}`} />
                    <span className="text-[11px] font-mono text-foreground/80">{action.effort_level} effort</span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    Priority score: <span className="text-foreground font-bold">{Math.round(score).toLocaleString("nl-NL")}</span>
                  </div>
                  {action.constraints && (
                    <div className="mt-1 text-[10px] text-muted-foreground">
                      <span className="text-foreground/50">Constraint:</span> {action.constraints}
                    </div>
                  )}
                </div>
              </div>

              {/* Data sources & signal */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Database className="w-3 h-3 text-muted-foreground/40" />
                {action.data_sources_used.map((ds) => (
                  <Badge key={ds} variant="outline" className="text-[8px] font-mono px-1.5 py-0 h-4">{ds}</Badge>
                ))}
                {action.source_signal && (
                  <>
                    <span className="text-border">|</span>
                    <span className="text-[9px] font-mono text-muted-foreground/60 italic">{action.source_signal}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
