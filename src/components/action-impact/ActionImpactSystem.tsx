import { Zap, BarChart3, Kanban } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { ActionImpactSummary } from "./ActionImpactSummary";
import { ActionPriorityBoard } from "./ActionPriorityBoard";
import { ActionPipeline } from "./ActionPipeline";
import { actionItems } from "./data";

export const ActionImpactSystem = () => {
  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <ScrollArea className="h-full relative z-10">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Page header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-primary" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">
                Action Impact System
              </h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                Data → Root Cause → Actie → Meetbare Impact
              </p>
            </div>
          </div>

          {/* Layer 1 — Impact Summary */}
          <IHSectionShell
            icon={Zap}
            title="Improvement Potential"
            subtitle="Executive overzicht van alle acties en hun verwachte impact"
            badge="SUMMARY"
            badgeVariant="success"
          >
            <ActionImpactSummary actions={actionItems} />
          </IHSectionShell>

          {/* Layer 2 — Priority Board */}
          <IHSectionShell
            icon={BarChart3}
            title="Action Priority Board"
            subtitle="Gesorteerd op priority score: financial_impact × probability / effort"
            badge={`${actionItems.length} ACTIES`}
            badgeVariant="warning"
          >
            <ActionPriorityBoard actions={actionItems} />
          </IHSectionShell>

          {/* Layer 3 — Pipeline */}
          <IHSectionShell
            icon={Kanban}
            title="Action Pipeline"
            subtitle="Uitvoeringsstatus per actie"
            badge="PIPELINE"
            badgeVariant="info"
          >
            <ActionPipeline actions={actionItems} />
          </IHSectionShell>
        </div>
      </ScrollArea>
    </div>
  );
};
