import { Zap, BarChart3, Kanban } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { DataStateWrapper } from "@/components/intelligence-hub/DataStateWrapper";
import { ActionImpactSummary } from "./ActionImpactSummary";
import { ActionPriorityBoard } from "./ActionPriorityBoard";
import { ActionPipeline } from "./ActionPipeline";
import { actionItems as staticActionItems } from "./data";
import type { IntelligenceData, IntelligenceAction } from "@/types/intelligence";
import type { ActionItem } from "./types";

/** Map IntelligenceAction to ActionItem for existing components */
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

interface Props {
  intelligence?: IntelligenceData;
}

export const ActionImpactSystem = ({ intelligence }: Props) => {
  const actionsState = intelligence?.actions.state ?? "complete";
  const actions: ActionItem[] =
    intelligence?.actions.items && intelligence.actions.items.length > 0
      ? intelligence.actions.items.map(mapToActionItem)
      : staticActionItems;

  return (
    <div className="relative min-h-0 h-full overflow-y-auto">
      <div className="relative z-10">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto pb-8">
          {/* Page header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-primary" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">
                Action Impact System
              </h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                Data → Root Cause → Actie → Meetbare Impact
                {actionsState === "partial" && (
                  <span className="text-yellow-500 ml-2">⚠ partial</span>
                )}
              </p>
            </div>
          </div>

          {/* Layer 1 — Impact Summary (always visible) */}
          <DataStateWrapper state={actionsState} skeletonCount={1}>
            <IHSectionShell
              icon={Zap}
              title="Improvement Potential"
              subtitle="Executive overzicht van alle acties en hun verwachte impact"
              badge="SUMMARY"
              badgeVariant="success"
            >
              <ActionImpactSummary actions={actions} />
            </IHSectionShell>
          </DataStateWrapper>

          {/* Tabs for Priority Board & Pipeline */}
          <Tabs defaultValue="priority" className="w-full">
            <TabsList className="w-full justify-start bg-card/60 border border-border rounded-xl h-11 p-1 gap-1">
              <TabsTrigger
                value="priority"
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg px-4 text-xs font-bold uppercase tracking-wider"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Action Priority Board
              </TabsTrigger>
              <TabsTrigger
                value="pipeline"
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg px-4 text-xs font-bold uppercase tracking-wider"
              >
                <Kanban className="w-3.5 h-3.5" />
                Action Pipeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="priority" className="mt-4">
              <DataStateWrapper state={actionsState} skeletonCount={2}>
                <IHSectionShell
                  icon={BarChart3}
                  title="Action Priority Board"
                  subtitle="Gesorteerd op priority score: financial_impact × probability / effort"
                  badge={`${actions.length} ACTIES`}
                  badgeVariant="warning"
                >
                  <ActionPriorityBoard actions={actions} />
                </IHSectionShell>
              </DataStateWrapper>
            </TabsContent>

            <TabsContent value="pipeline" className="mt-4">
              <DataStateWrapper state={actionsState} skeletonCount={1}>
                <IHSectionShell
                  icon={Kanban}
                  title="Action Pipeline"
                  subtitle="Uitvoeringsstatus per actie"
                  badge="PIPELINE"
                  badgeVariant="default"
                >
                  <ActionPipeline actions={actions} />
                </IHSectionShell>
              </DataStateWrapper>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};