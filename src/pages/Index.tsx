import { useState } from "react";
import ProductionHeader from "@/components/ProductionHeader";
import ActiveProduction from "@/components/ActiveProduction";
import CompletedProduction from "@/components/CompletedProduction";
import CrossLineHighlights from "@/components/CrossLineHighlights";
import CrossLinePopup from "@/components/CrossLinePopup";
import DayStartPopup from "@/components/DayStartPopup";
import HBMasterPanel from "@/components/HBMasterPanel";
import ScanOutPopup from "@/components/ScanOutPopup";
import { Star } from "lucide-react";
import { teamLeaders } from "@/data/mockData";

const Index = () => {
  const showDayStart = false;
  const [scanOutProduct, setScanOutProduct] = useState<null | {
    name: string;
    produced: number;
    target: number;
    piecesPerHour: number;
    plannedPiecesPerHour: number;
  }>(null);

  // Demo: click handler to simulate scan-out (can be wired to real scan event)
  const handleDemoScanOut = () => {
    setScanOutProduct({
      name: "BQ Field L",
      produced: 400,
      target: 400,
      piecesPerHour: 88,
      plannedPiecesPerHour: 80,
    });
  };

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

        {/* Right: Completed Today + Cross-line highlights + Team Leaders */}
        <div className="flex-[35] min-w-0 flex flex-col gap-3">
          <div className="flex-[5] min-h-0">
            <CompletedProduction />
          </div>
          <div className="flex-[3] min-h-0">
            <CrossLineHighlights />
          </div>
          {/* Team Leaders bottom-right */}
          <div className="shrink-0 flex items-center gap-2">
            {teamLeaders.map((leader) => (
              <div key={leader.name} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-primary/20 bg-primary/5 flex-1">
                <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-xs font-black text-primary-foreground">{leader.initials}</span>
                </div>
                <div className="leading-none min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">{leader.name}</div>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 text-bloom-warm fill-bloom-warm" />
                    <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-semibold">{leader.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CrossLinePopup />
      {showDayStart && <DayStartPopup />}
      {scanOutProduct && (
        <ScanOutPopup product={scanOutProduct} onClose={() => setScanOutProduct(null)} />
      )}
    </div>
  );
};

export default Index;
