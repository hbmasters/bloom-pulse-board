import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import IHBusinessHealth from "@/components/intelligence-hub/IHBusinessHealth";
import IHProductionIntelligence from "@/components/intelligence-hub/IHProductionIntelligence";
import IHMarginIntelligence from "@/components/intelligence-hub/IHMarginIntelligence";
import IHProcurementIntelligence from "@/components/intelligence-hub/IHProcurementIntelligence";
import IHFlowerForecast from "@/components/intelligence-hub/IHFlowerForecast";
import IHActionCenter from "@/components/intelligence-hub/IHActionCenter";
import { ScrollArea } from "@/components/ui/scroll-area";

const IntelligenceHub = () => {
  return (
    <div className="relative flex-1 min-h-0 overflow-hidden">
      <MCHologramBackground />
      <ScrollArea className="h-full relative z-10">
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 rounded-full bg-gradient-brand" />
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">
                Intelligence Hub
              </h1>
              <p className="text-[11px] font-mono text-muted-foreground">
                Unified operational intelligence • Data → Validation → Root Cause → Action
              </p>
            </div>
          </div>

          {/* 1. Business Health – Executive Overview */}
          <IHBusinessHealth />

          {/* 2. Production Intelligence */}
          <IHProductionIntelligence />

          {/* 3. Margin Intelligence */}
          <IHMarginIntelligence />

          {/* 4. Procurement Intelligence */}
          <IHProcurementIntelligence />

          {/* 5. Flower Forecast */}
          <IHFlowerForecast />

          {/* 6. AI Action Center */}
          <IHActionCenter />
        </div>
      </ScrollArea>
    </div>
  );
};

export default IntelligenceHub;
