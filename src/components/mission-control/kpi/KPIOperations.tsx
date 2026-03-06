import { useState } from "react";
import { Factory, Wrench, Package, ArrowLeft, Users, Clock, AlertTriangle, Gauge } from "lucide-react";
import KPIMetricCard, { MetricData } from "./KPIMetricCard";
import KPIFilters, { TimeFilter } from "./KPIFilters";
import KPIAIMonitor from "./KPIAIMonitor";

type SubDept = "hand" | "conveyor" | "packing";

const handLines = ["H1", "H2", "H3", "H4", "H5", "H6", "H7"];
const conveyorLines = ["B1", "B2", "B3", "B4", "B5"];

const handMetrics: Record<string, MetricData[]> = {};
handLines.forEach((line, i) => {
  const eff = 78 + Math.random() * 18;
  const status = eff > 90 ? "healthy" : eff > 80 ? "warning" : "critical";
  handMetrics[line] = [
    { id: `${line}-bq`, title: "Boeketten geproduceerd", value: `${Math.floor(1200 + Math.random() * 800)}`, status, sparkline: Array.from({length:7}, () => 1200 + Math.random() * 800), changeDir: "up", change: `+${(Math.random()*5).toFixed(1)}%` },
    { id: `${line}-spe`, title: "Stelen per medewerker", value: `${Math.floor(180 + Math.random() * 60)}`, status, target: "220", sparkline: Array.from({length:7}, () => 180 + Math.random() * 60) },
    { id: `${line}-wp`, title: "WP-APU", value: `${(0.35 + Math.random() * 0.15).toFixed(2)}`, unit: "€", status: eff > 85 ? "healthy" : "warning", target: "€0.38" },
    { id: `${line}-oapu`, title: "O-APU", value: `${(0.40 + Math.random() * 0.12).toFixed(2)}`, unit: "€", status: eff > 85 ? "healthy" : "warning", target: "€0.42" },
    { id: `${line}-prod`, title: "Productiviteit / uur", value: `${Math.floor(140 + Math.random() * 40)}`, unit: "bq/u", status, sparkline: Array.from({length:7}, () => 140 + Math.random() * 40) },
    { id: `${line}-eff`, title: "Operator efficiency", value: `${eff.toFixed(1)}`, unit: "%", status, target: "90%", sparkline: Array.from({length:7}, () => 78 + Math.random() * 18), changeDir: eff > 88 ? "up" : "down", change: `${eff > 88 ? "+" : ""}${(Math.random()*3-1).toFixed(1)}%` },
    { id: `${line}-dt`, title: "Downtime", value: `${Math.floor(5 + Math.random() * 25)}`, unit: "min", status: Math.random() > 0.7 ? "critical" : "healthy", target: "< 15 min" },
    { id: `${line}-co`, title: "Order wisselsnelheid", value: `${(3 + Math.random() * 5).toFixed(1)}`, unit: "min", status: Math.random() > 0.6 ? "warning" : "healthy", target: "< 5 min" },
  ];
});

const conveyorMetrics: Record<string, MetricData[]> = {};
conveyorLines.forEach((line) => {
  const util = 70 + Math.random() * 25;
  const status = util > 85 ? "healthy" : util > 75 ? "warning" : "critical";
  conveyorMetrics[line] = [
    { id: `${line}-bph`, title: "Boeketten per uur", value: `${Math.floor(300 + Math.random() * 200)}`, unit: "bq/u", status, sparkline: Array.from({length:7}, () => 300 + Math.random() * 200), changeDir: "up", change: `+${(Math.random()*4).toFixed(1)}%` },
    { id: `${line}-util`, title: "Lijnbenutting", value: `${util.toFixed(1)}`, unit: "%", status, target: "85%", sparkline: Array.from({length:7}, () => 70 + Math.random() * 25) },
    { id: `${line}-stop`, title: "Storingen", value: `${Math.floor(Math.random() * 8)}`, unit: "x", status: Math.random() > 0.7 ? "critical" : "healthy" },
    { id: `${line}-through`, title: "Doorvoer", value: `${Math.floor(2500 + Math.random() * 1500)}`, unit: "stelen", status, sparkline: Array.from({length:7}, () => 2500 + Math.random() * 1500) },
    { id: `${line}-prodv`, title: "Productiviteit", value: `${(85 + Math.random() * 12).toFixed(1)}`, unit: "%", status, target: "90%" },
  ];
});

const packingMetrics: MetricData[] = [
  { id: "pk-bq", title: "Boeketten ingepakt", value: "8,420", status: "healthy", sparkline: [7800, 8000, 8100, 8200, 8300, 8400, 8420], changeDir: "up", change: "+3.2%" },
  { id: "pk-speed", title: "Inpaksnelheid", value: "142", unit: "bq/u", status: "healthy", target: "135 bq/u", sparkline: [130, 132, 135, 138, 140, 141, 142] },
  { id: "pk-wait", title: "Wachttijd productie", value: "4.2", unit: "min", status: "warning", target: "< 3 min", sparkline: [3.0, 3.2, 3.5, 3.8, 4.0, 4.1, 4.2], changeDir: "up", change: "+0.5 min" },
  { id: "pk-err", title: "Foutpercentage", value: "2.8", unit: "%", status: "critical", target: "< 1.5%", sparkline: [1.2, 1.4, 1.6, 1.9, 2.2, 2.5, 2.8], changeDir: "up", change: "+1.6%" },
];

const KPIOperations = ({ onBack }: { onBack: () => void }) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [comparison, setComparison] = useState(false);
  const [subDept, setSubDept] = useState<SubDept>("hand");
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  const lines = subDept === "hand" ? handLines : subDept === "conveyor" ? conveyorLines : [];
  const lineMetrics = subDept === "hand" ? handMetrics : subDept === "conveyor" ? conveyorMetrics : {};

  return (
    <div className="flex flex-col h-full p-3 md:p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> KPI Hub
        </button>
        <div className="h-4 w-px bg-border" />
        <Factory className="w-4 h-4 text-accent" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Operations Command Center</h2>
      </div>

      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          {([
            { key: "hand" as SubDept, label: "Hand Afdeling", icon: Users, lines: "H1–H7" },
            { key: "conveyor" as SubDept, label: "Band Afdeling", icon: Gauge, lines: "B1–B5" },
            { key: "packing" as SubDept, label: "Inpak Afdeling", icon: Package, lines: "" },
          ]).map(d => (
            <button
              key={d.key}
              onClick={() => { setSubDept(d.key); setSelectedLine(null); }}
              className={`flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-2 rounded-lg border transition-all ${
                subDept === d.key
                  ? "bg-primary/15 text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border hover:border-primary/20"
              }`}
            >
              <d.icon className="w-3.5 h-3.5" />
              {d.label}
              {d.lines && <span className="text-[8px] text-muted-foreground/50 ml-0.5">{d.lines}</span>}
            </button>
          ))}
        </div>
        <KPIFilters selected={timeFilter} onSelect={setTimeFilter} comparison={comparison} onComparisonToggle={() => setComparison(!comparison)} />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {subDept !== "packing" && (
          <>
            {/* Line selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-mono text-muted-foreground/50 mr-1">Lijnen:</span>
              {lines.map(line => {
                const metrics = lineMetrics[line] || [];
                const hasCritical = metrics.some(m => m.status === "critical");
                const hasWarning = metrics.some(m => m.status === "warning");
                return (
                  <button
                    key={line}
                    onClick={() => setSelectedLine(selectedLine === line ? null : line)}
                    className={`relative text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
                      selectedLine === line
                        ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:border-primary/20"
                    }`}
                  >
                    {line}
                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-background ${
                      hasCritical ? "bg-red-500 animate-pulse" : hasWarning ? "bg-yellow-500" : "bg-accent"
                    }`} />
                  </button>
                );
              })}
              {!selectedLine && <span className="text-[8px] font-mono text-muted-foreground/40 ml-2">← Selecteer een lijn voor detail</span>}
            </div>

            {/* All lines overview or selected line detail */}
            {selectedLine ? (
              <div>
                <h3 className="text-[11px] font-black text-foreground uppercase tracking-wider mb-2">
                  Lijn {selectedLine} — Detail Metrics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {(lineMetrics[selectedLine] || []).map(m => (
                    <KPIMetricCard key={m.id} metric={m} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-[11px] font-black text-foreground uppercase tracking-wider mb-2">
                  Overzicht alle lijnen
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {lines.map(line => {
                    const metrics = lineMetrics[line] || [];
                    const effMetric = metrics.find(m => m.title.includes("efficiency") || m.title.includes("Lijnbenutting") || m.title.includes("Operator"));
                    const prodMetric = metrics[0];
                    const hasCritical = metrics.some(m => m.status === "critical");
                    return (
                      <button
                        key={line}
                        onClick={() => setSelectedLine(line)}
                        className={`text-left p-3 rounded-xl border transition-all hover:shadow-md ${
                          hasCritical ? "border-red-500/30 bg-red-500/5" : "border-border bg-card/60 hover:border-primary/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-black text-foreground">{line}</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${hasCritical ? "bg-red-500 animate-pulse" : metrics.some(m => m.status === "warning") ? "bg-yellow-500" : "bg-accent"}`} />
                        </div>
                        {prodMetric && <div className="text-lg font-black text-foreground">{prodMetric.value} <span className="text-[9px] font-normal text-muted-foreground">{prodMetric.unit || "bq"}</span></div>}
                        {effMetric && <div className="text-[9px] font-mono text-muted-foreground mt-0.5">Eff: {effMetric.value}{effMetric.unit}</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {subDept === "packing" && (
          <div>
            <h3 className="text-[11px] font-black text-foreground uppercase tracking-wider mb-2">Inpak Afdeling</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {packingMetrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIOperations;
