import { useState } from "react";
import ProductionHeader from "@/components/ProductionHeader";
import ActiveProduction from "@/components/ActiveProduction";
import CompletedProduction from "@/components/CompletedProduction";
import CrossLineHighlights from "@/components/CrossLineHighlights";
import CrossLinePopup from "@/components/CrossLinePopup";
import DayStartPopup from "@/components/DayStartPopup";
import HBMasterPanel from "@/components/HBMasterPanel";
import ScanOutPopup from "@/components/ScanOutPopup";
import { Star, ScanLine } from "lucide-react";
import { teamLeaders, activeProducts } from "@/data/mockData";

const Index = () => {
  const showDayStart = false;
  const [scanOutProduct, setScanOutProduct] = useState<null | {
    name: string;
    image?: string;
    customer?: string;
    produced: number;
    target: number;
    piecesPerHour: number;
    plannedPiecesPerHour: number;
  }>(null);

  const handleScanOut = () => {
    const product = activeProducts[0];
    setScanOutProduct({
      name: product.name,
      image: product.image,
      customer: product.customer,
      produced: product.target,
      target: product.target,
      piecesPerHour: product.piecesPerHour,
      plannedPiecesPerHour: product.plannedPiecesPerHour,
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
          <div className="shrink-0 flex items-center gap-3">
            <div className="flex-1">
              <HBMasterPanel />
            </div>
            <button
              onClick={handleScanOut}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-brand text-primary-foreground font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
            >
              <ScanLine className="w-5 h-5" />
              Scan Uit
            </button>
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
          <div className="shrink-0 flex items-center gap-3">
            {teamLeaders.map((leader) => (
              <div key={leader.name} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 flex-1">
                <div className="w-11 h-11 rounded-full bg-gradient-brand flex items-center justify-center shadow-sm shrink-0">
                  <span className="text-sm font-black text-primary-foreground">{leader.initials}</span>
                </div>
                <div className="leading-none min-w-0">
                  <div className="text-base font-bold text-foreground truncate">{leader.name}</div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star className="w-3 h-3 text-bloom-warm fill-bloom-warm" />
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">{leader.role}</span>
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
