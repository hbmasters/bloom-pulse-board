import IHProductionIntelligence from "@/components/intelligence-hub/IHProductionIntelligence";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";

const ProductionCockpit = () => (
  <div className="relative min-h-0">
    <MCHologramBackground />
    <div className="relative z-10">
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full bg-gradient-brand" />
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-foreground uppercase">
              Production Cockpit
            </h1>
            <p className="text-[11px] font-mono text-muted-foreground">
              Gedetailleerde productie performance • Hand / Band / Inpak
            </p>
          </div>
        </div>
        <IHProductionIntelligence />
      </div>
    </div>
  </div>
);

export default ProductionCockpit;
