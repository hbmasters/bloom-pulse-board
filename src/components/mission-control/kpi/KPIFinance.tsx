import { useState } from "react";
import { ArrowLeft, DollarSign } from "lucide-react";
import KPIMetricCard, { MetricData } from "./KPIMetricCard";
import KPIFilters, { TimeFilter } from "./KPIFilters";

const financeMetrics: MetricData[] = [
  { id: "f-rev", title: "Omzet", value: "€2.4M", status: "healthy", sparkline: [1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4], changeDir: "up", change: "+8.3%", target: "€2.2M" },
  { id: "f-margin", title: "Marge", value: "34.2%", status: "healthy", sparkline: [31, 31.5, 32, 32.5, 33, 33.8, 34.2], changeDir: "up", change: "+2.4%", target: "32%" },
  { id: "f-labor", title: "Arbeidskosten", value: "€1.02M", status: "warning", sparkline: [0.92, 0.94, 0.96, 0.98, 0.99, 1.01, 1.02], changeDir: "up", change: "+4.8%", target: "< €0.98M" },
  { id: "f-mpb", title: "Marge per bouquet", value: "€1.12", status: "healthy", sparkline: [0.98, 1.00, 1.02, 1.05, 1.08, 1.10, 1.12], changeDir: "up", change: "+6.2%", target: "€1.00" },
  { id: "f-cost", title: "Kostprijs per bouquet", value: "€2.16", status: "healthy", sparkline: [2.30, 2.28, 2.25, 2.22, 2.20, 2.18, 2.16], changeDir: "down", change: "-3.1%" },
  { id: "f-ebitda", title: "EBITDA", value: "€820K", status: "healthy", sparkline: [680, 700, 720, 740, 760, 790, 820], changeDir: "up", change: "+12.3%", target: "€750K" },
  { id: "f-ratio", title: "Arbeid / omzet ratio", value: "42.5%", status: "warning", sparkline: [40, 40.5, 41, 41.5, 42, 42.3, 42.5], changeDir: "up", change: "+2.5%", target: "< 40%" },
  { id: "f-cash", title: "Cash flow", value: "€340K", status: "healthy", sparkline: [250, 260, 280, 300, 310, 325, 340], changeDir: "up", change: "+8.1%" },
];

const KPIFinance = ({ onBack }: { onBack: () => void }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [comparison, setComparison] = useState(false);

  return (
    <div className="flex flex-col h-full p-3 md:p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> KPI Hub
        </button>
        <div className="h-4 w-px bg-border" />
        <DollarSign className="w-4 h-4 text-accent" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Finance Dashboard</h2>
      </div>

      <div className="mb-3">
        <KPIFilters selected={timeFilter} onSelect={setTimeFilter} comparison={comparison} onComparisonToggle={() => setComparison(!comparison)} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {financeMetrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>
      </div>
    </div>
  );
};

export default KPIFinance;
