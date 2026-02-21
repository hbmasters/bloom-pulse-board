import ProductionHeader from "@/components/ProductionHeader";
import ActiveProduction from "@/components/ActiveProduction";
import CompletedProduction from "@/components/CompletedProduction";
import CrossLinePopup from "@/components/CrossLinePopup";

const Index = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col floral-watermark">
      <ProductionHeader />
      <main className="flex-1 min-h-0 p-4 flex gap-4 relative z-10">
        {/* Left: Active Production (~70%) */}
        <div className="flex-[7] min-w-0">
          <ActiveProduction />
        </div>

        {/* Right: Completed Today (~30%) */}
        <div className="flex-[3] min-w-0">
          <CompletedProduction />
        </div>
      </main>
      <CrossLinePopup />
    </div>
  );
};

export default Index;
