import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import IHBusinessHealth from "@/components/intelligence-hub/IHBusinessHealth";
import IHProductionIntelligence from "@/components/intelligence-hub/IHProductionIntelligence";
import IHMarginIntelligence from "@/components/intelligence-hub/IHMarginIntelligence";
import IHProcurementIntelligence from "@/components/intelligence-hub/IHProcurementIntelligence";
import IHFlowerForecast from "@/components/intelligence-hub/IHFlowerForecast";
import IHActionCenter from "@/components/intelligence-hub/IHActionCenter";
import IHForecastIntelligence from "@/components/intelligence-hub/IHForecastIntelligence";

import { DataStateWrapper } from "@/components/intelligence-hub/DataStateWrapper";
import type { IntelligenceData } from "@/types/intelligence";
import { filterBySignalType } from "@/types/intelligence";

interface Props {
  intelligence?: IntelligenceData;
}

const IntelligenceHub = ({ intelligence }: Props) => {
  const objectsState = intelligence?.objects.state ?? "complete";
  const objects = intelligence?.objects.items ?? [];

  const productionObjects = filterBySignalType(objects, ["production"]);
  const financialObjects = filterBySignalType(objects, ["financial", "margin"]);
  const procurementObjects = filterBySignalType(objects, ["procurement"]);
  const forecastObjects = filterBySignalType(objects, ["forecast"]);

  return (
    <div className="relative min-h-0">
      <MCHologramBackground />
      <div className="relative z-10">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto pb-8">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-brand" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">
                Intelligence Hub
              </h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                Unified operational intelligence • Data → Validation → Root Cause → Action
                {objectsState === "partial" && (
                  <span className="text-yellow-500 ml-2">⚠ partial</span>
                )}
              </p>
            </div>
          </div>

          {/* 1. Business Health – Executive Overview */}
          <DataStateWrapper state={objectsState} skeletonCount={1}>
            <IHBusinessHealth />
          </DataStateWrapper>

          {/* 2. Production Intelligence */}
          <DataStateWrapper state={objectsState} skeletonCount={1}>
            <IHProductionIntelligence />
          </DataStateWrapper>

          {/* 3. Margin Intelligence */}
          <DataStateWrapper state={objectsState} skeletonCount={1}>
            <IHMarginIntelligence />
          </DataStateWrapper>

          {/* 4. Procurement Intelligence */}
          <DataStateWrapper state={objectsState} skeletonCount={1}>
            <IHProcurementIntelligence />
          </DataStateWrapper>

          {/* 5. Flower Forecast */}
          <DataStateWrapper state={objectsState} skeletonCount={1}>
            <IHFlowerForecast />
          </DataStateWrapper>

          {/* 6. Forecast Intelligence — Procurement Forecast Readiness */}
          <IHForecastIntelligence />

          {/* 7. AI Action Center */}
          <DataStateWrapper state={objectsState} skeletonCount={1}>
            <IHActionCenter />
          </DataStateWrapper>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;
