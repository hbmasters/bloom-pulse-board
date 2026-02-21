import ProductionHeader from "@/components/ProductionHeader";
import ActiveProduction from "@/components/ActiveProduction";
import CompletedProduction from "@/components/CompletedProduction";
import CrossLinePopup from "@/components/CrossLinePopup";
import DayStartPopup from "@/components/DayStartPopup";
import HBMasterPanel from "@/components/HBMasterPanel";

const Index = () => {
  const showDayStart = false;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col floral-watermark">
      <ProductionHeader />

      <main className="flex-1 min-h-0 p-3 flex gap-3 relative z-10">
        {/* Left: Active Production + HBMASTER bottom */}
        <div className="flex-[65] min-w-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <ActiveProduction />
          </div>
          <div className="shrink-0">
            <HBMasterPanel />
          </div>
        </div>

        {/* Right: Completed Today */}
        <div className="flex-[35] min-w-0">
          <CompletedProduction />
        </div>
      </main>

      <CrossLinePopup />
      {showDayStart && <DayStartPopup />}
    </div>
  );
};

export default Index;
