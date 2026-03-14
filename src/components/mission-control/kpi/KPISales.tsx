import { useState } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import KPIMetricCard, { MetricData } from "./KPIMetricCard";
import KPIPeriodFilter, { PeriodFilterState } from "./KPIPeriodFilter";

const salesMetrics: MetricData[] = [
  { id: "s-rev", title: "Omzet", value: "€2.4M", status: "healthy", sparkline: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4], changeDir: "up", change: "+8.3%", target: "€2.2M" },
  { id: "s-sold", title: "Boeketten verkocht", value: "184,200", status: "healthy", sparkline: [160000, 165000, 170000, 175000, 178000, 182000, 184200], changeDir: "up", change: "+5.1%" },
  { id: "s-size", title: "Gem. ordergrootte", value: "€3,420", status: "warning", sparkline: [3600, 3550, 3500, 3480, 3450, 3430, 3420], changeDir: "down", change: "-3.2%", target: "€3,500" },
  { id: "s-cust", title: "Klantprestatie Top 10", value: "68%", unit: "omzet", status: "healthy", target: "65%", sparkline: [62, 63, 64, 65, 66, 67, 68] },
  { id: "s-prod", title: "Product performance", value: "94.2", unit: "% fill rate", status: "healthy", target: "92%", sparkline: [90, 91, 92, 93, 93.5, 94, 94.2] },
  { id: "s-fc", title: "Forecast vs. Actueel", value: "103%", status: "healthy", sparkline: [96, 98, 100, 101, 102, 103, 103], changeDir: "up", change: "+3%" },
  { id: "s-new", title: "Nieuwe klanten", value: "12", status: "healthy", sparkline: [5, 7, 8, 9, 10, 11, 12], changeDir: "up", change: "+4" },
  { id: "s-churn", title: "Klantverloop", value: "2.1%", status: "warning", sparkline: [1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1], changeDir: "up", change: "+0.6%", target: "< 1.5%" },
];

const KPISales = ({ onBack }: { onBack: () => void }) => {
  const [filter, setFilter] = useState<PeriodFilterState>({
    year: new Date().getFullYear(),
    period: Math.ceil((new Date().getMonth() + 1) / (12 / 13)),
    comparison: "previous",
  });

  return (
    <div className="flex flex-col h-full p-3 md:p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> KPI Hub
        </button>
        <div className="h-4 w-px bg-border" />
        <ShoppingCart className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Sales Dashboard</h2>
      </div>

      <div className="mb-3">
        <KPIPeriodFilter value={filter} onChange={setFilter} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {salesMetrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>
      </div>
    </div>
  );
};

export default KPISales;
