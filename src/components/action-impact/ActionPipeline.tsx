import { Zap, AlertTriangle } from "lucide-react";
import { DepartmentBadge, SubdepartmentChip } from "@/components/department/DepartmentBadge";
import type { ActionItem, ActionStatus } from "./types";

const columns: { id: ActionStatus; label: string; accent: string; bg: string }[] = [
  { id: "open", label: "Open", accent: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { id: "in_progress", label: "In Progress", accent: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { id: "completed", label: "Completed", accent: "text-accent", bg: "bg-accent/10 border-accent/20" },
];

const priorityDot: Record<string, string> = {
  Critical: "bg-red-500",
  High: "bg-orange-400",
  Medium: "bg-yellow-500",
  Low: "bg-muted-foreground",
};

interface Props {
  actions: ActionItem[];
}

export const ActionPipeline = ({ actions }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => {
        const items = actions.filter((a) => a.status === col.id);
        return (
          <div key={col.id}>
            {/* Column header */}
            <div className={`rounded-t-xl border px-4 py-2.5 ${col.bg} flex items-center justify-between`}>
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${col.accent}`}>
                {col.label}
              </span>
              <span className={`text-[10px] font-mono font-bold ${col.accent}`}>{items.length}</span>
            </div>

            {/* Cards */}
            <div className="border border-t-0 rounded-b-xl bg-card/30 p-2 space-y-2 min-h-[120px]">
              {items.length === 0 && (
                <div className="text-[10px] font-mono text-muted-foreground/40 text-center py-6">
                  Geen acties
                </div>
              )}
              {items.map((action) => (
                <div
                  key={action.id}
                  className="rounded-lg border border-border bg-card/60 p-3 hover:shadow-sm transition-all cursor-default"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[action.priority]}`} />
                    <span className="text-[11px] font-bold text-foreground truncate">{action.action_title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <DepartmentBadge department={action.department_owner} size="sm" />
                    {action.sub_department && <SubdepartmentChip sub={action.sub_department} />}
                  </div>

                  {/* Impact summary */}
                  <div className="space-y-0.5">
                    {action.impact_financial != null && (
                      <div className="text-[10px] font-mono font-bold text-accent">
                        €{action.impact_financial.toLocaleString("nl-NL")}
                      </div>
                    )}
                    {action.impact_efficiency != null && (
                      <div className="text-[10px] font-mono text-primary">
                        +{action.impact_efficiency} W-APU
                      </div>
                    )}
                    {action.impact_risk_reduction && action.impact_risk_reduction !== "none" && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-yellow-500">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {action.impact_risk_reduction}
                      </div>
                    )}
                  </div>

                  {/* Source signal */}
                  {action.source_signal && (
                    <div className="mt-2 text-[9px] font-mono text-muted-foreground/50 italic truncate">
                      {action.source_signal}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
