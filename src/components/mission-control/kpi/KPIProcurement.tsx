import { useState } from "react";
import { ArrowLeft, Truck } from "lucide-react";
import KPIMetricCard, { MetricData } from "./KPIMetricCard";
import KPIPeriodFilter, { PeriodFilterState } from "./KPIPeriodFilter";

type SubView = "direct" | "indirect";

const directMetrics: MetricData[] = [
  { id: "p-price", title: "Inkoopprijs per steel", value: "€0.18", status: "warning", sparkline: [0.15, 0.15, 0.16, 0.16, 0.17, 0.17, 0.18], changeDir: "up", change: "+12%", target: "€0.16" },
  { id: "p-supp", title: "Leveranciersvergelijking", value: "8", unit: "actief", status: "healthy" },
  { id: "p-trend", title: "Prijstrend rozen", value: "+8.4%", status: "critical", sparkline: [2, 3, 4, 5, 6, 7, 8.4], changeDir: "up", change: "+8.4% MoM" },
  { id: "p-trendt", title: "Prijstrend tulpen", value: "-2.1%", status: "healthy", sparkline: [5, 4.5, 4, 3.5, 3, 2.5, 2.1], changeDir: "down", change: "-2.1% MoM" },
  { id: "p-qual", title: "Kwaliteitsscore leveranciers", value: "94.5", unit: "%", status: "healthy", target: "92%", sparkline: [91, 92, 92.5, 93, 93.5, 94, 94.5] },
  { id: "p-lead", title: "Levertijd gem.", value: "2.4", unit: "dagen", status: "healthy", target: "< 3 dagen" },
];

const indirectMetrics: MetricData[] = [
  { id: "pi-pack", title: "Verpakkingskosten", value: "€0.12", unit: "/bq", status: "healthy", target: "€0.14", sparkline: [0.15, 0.14, 0.14, 0.13, 0.13, 0.12, 0.12], changeDir: "down", change: "-8%" },
  { id: "pi-mat", title: "Materiaalkosten", value: "€0.08", unit: "/bq", status: "healthy", target: "€0.10" },
  { id: "pi-cost", title: "Totale kost per bouquet", value: "€0.20", status: "healthy", sparkline: [0.24, 0.23, 0.22, 0.21, 0.21, 0.20, 0.20], changeDir: "down", change: "-4.2%" },
  { id: "pi-waste", title: "Verpakkingsderving", value: "1.8", unit: "%", status: "warning", target: "< 1.5%", sparkline: [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8], changeDir: "up", change: "+0.6%" },
];

const KPIProcurement = ({ onBack }: { onBack: () => void }) => {
  const [filter, setFilter] = useState<PeriodFilterState>({
    year: new Date().getFullYear(),
    period: Math.ceil((new Date().getMonth() + 1) / (12 / 13)),
    comparison: "previous",
  });
  const [subView, setSubView] = useState<SubView>("direct");

  return (
    <div className="flex flex-col h-full p-3 md:p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> KPI Hub
        </button>
        <div className="h-4 w-px bg-border" />
        <Truck className="w-4 h-4 text-bloom-warm" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Procurement Dashboard</h2>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <button onClick={() => setSubView("direct")} className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${subView === "direct" ? "bg-primary/15 text-primary border-primary/30" : "bg-card text-muted-foreground border-border hover:border-primary/20"}`}>
          Directe Inkoop
        </button>
        <button onClick={() => setSubView("indirect")} className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${subView === "indirect" ? "bg-primary/15 text-primary border-primary/30" : "bg-card text-muted-foreground border-border hover:border-primary/20"}`}>
          Indirecte Inkoop
        </button>
      </div>

      <div className="mb-3">
        <KPIPeriodFilter value={filter} onChange={setFilter} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {(subView === "direct" ? directMetrics : indirectMetrics).map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>
      </div>
    </div>
  );
};

export default KPIProcurement;
