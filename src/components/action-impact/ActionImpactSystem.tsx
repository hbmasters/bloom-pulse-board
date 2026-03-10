import { useState } from "react";
import { Zap, BarChart3, Kanban } from "lucide-react";

import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { DataStateWrapper } from "@/components/intelligence-hub/DataStateWrapper";
import { ActionImpactSummary } from "./ActionImpactSummary";
import { ActionPriorityBoard } from "./ActionPriorityBoard";
import { ActionPipeline } from "./ActionPipeline";
import { actionItems as staticActionItems } from "./data";
import type { IntelligenceData, IntelligenceAction } from "@/types/intelligence";
import type { ActionItem } from "./types";

function mapToActionItem(a: IntelligenceAction): ActionItem {
  return {
    id: a.id,
    action_title: a.action_title,
    department_owner: a.department_owner,
    sub_department: a.sub_department,
    driver: a.driver,
    flower: a.flower,
    recommended_action: a.recommended_action,
    expected_impact: a.expected_impact,
    effort_level: a.effort_level,
    priority: a.priority,
    status: a.status,
    probability: a.probability,
    impact_financial: a.impact_financial,
    impact_efficiency: a.impact_efficiency,
    impact_risk_reduction: a.impact_risk_reduction,
    impact_supply_stability: a.impact_supply_stability,
    data_sources_used: a.data_sources_used,
    source_signal: a.source_signal,
    constraints: a.constraints,
  };
}

type TabId = "priority" | "pipeline";

const tabs: { id: TabId; label: string; icon: typeof BarChart3; shortLabel: string }[] = [
  { id: "priority", label: "Priority Board", icon: BarChart3, shortLabel: "Priority" },
  { id: "pipeline", label: "Action Kanban", icon: Kanban, shortLabel: "Kanban" },
];

interface Props {
  intelligence?: IntelligenceData;
}

export const ActionImpactSystem = ({ intelligence }: Props) => {
  const [activeTab, setActiveTab] = useState<TabId>("priority");

  const actionsState = intelligence?.actions.state ?? "complete";
  const actions: ActionItem[] =
    intelligence?.actions.items && intelligence.actions.items.length > 0
      ? intelligence.actions.items.map(mapToActionItem)
      : staticActionItems;

  return (
    <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
      <MCHologramBackground />

      {/* ── Header + Summary Bar ── */}
      <div className="relative z-10 border-b border-border bg-card/60 backdrop-blur-xl px-4 md:px-6 py-3 shrink-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 rounded-full bg-primary" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">
                Action Impact System
              </h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                Data → Root Cause → Actie → Meetbare Impact • {actions.length} acties
                {actionsState === "partial" && (
                  <span className="text-yellow-500 ml-2">⚠ partial</span>
                )}
              </p>
            </div>
          </div>

          {/* Inline summary */}
          <DataStateWrapper state={actionsState} skeletonCount={1}>
            <ActionImpactSummary actions={actions} />
          </DataStateWrapper>
        </div>
      </div>

      {/* ── Tab Navigation (same style as Command Radar) ── */}
      <div className="relative z-10 border-b border-border bg-card/40 backdrop-blur-sm px-4 md:px-6 shrink-0">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 min-h-0 relative z-10 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto pb-8">
          {activeTab === "priority" && (
            <DataStateWrapper state={actionsState} skeletonCount={2}>
              <ActionPriorityBoard actions={actions} />
            </DataStateWrapper>
          )}
          {activeTab === "pipeline" && (
            <DataStateWrapper state={actionsState} skeletonCount={1}>
              <ActionPipeline actions={actions} />
            </DataStateWrapper>
          )}
        </div>
      </div>
    </div>
  );
};
