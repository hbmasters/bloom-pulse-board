import ProductionHeader from "@/components/ProductionHeader";
import ActiveProduction from "@/components/ActiveProduction";
import CompletedProduction from "@/components/CompletedProduction";
import CrossLineHighlights from "@/components/CrossLineHighlights";
import CrossLinePopup from "@/components/CrossLinePopup";
import DayStartPopup from "@/components/DayStartPopup";

const Index = () => {
  // Set to true to show day-start overlay (when totalPieces = 0)
  const showDayStart = false;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col floral-watermark">
      <ProductionHeader />

      {/* Main content: Active Production (left ~65%) + Today's Achievements (right ~35%) */}
      <main className="flex-1 min-h-0 p-3 flex gap-3 relative z-10">
        {/* Active Production — dominant section */}
        <div className="flex-[65] min-w-0">
          <ActiveProduction />
        </div>

        {/* Today's Achievements — split into Completed + Cross-line */}
        <div className="flex-[35] min-w-0 flex flex-col gap-3">
          <div className="flex-[6] min-h-0">
            <CompletedProduction />
          </div>
          <div className="flex-[4] min-h-0">
            <CrossLineHighlights />
          </div>
        </div>
      </main>

      <CrossLinePopup />
      {showDayStart && <DayStartPopup />}
    </div>
  );
};

export default Index;
