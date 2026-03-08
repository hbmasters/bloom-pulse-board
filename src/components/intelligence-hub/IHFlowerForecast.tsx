import { Flower2 } from "lucide-react";
import IHSectionShell from "./IHSectionShell";

interface ForecastRow {
  flower: string;
  required: number;
  contracted: number;
  gap: number;
  status: "healthy" | "warning" | "critical";
}

const forecastData: ForecastRow[] = [
  { flower: "Chrysant Ringa Yellow", required: 120000, contracted: 90000, gap: -30000, status: "critical" },
  { flower: "Roos Red Naomi 50cm", required: 85000, contracted: 88000, gap: 3000, status: "healthy" },
  { flower: "Tulp Strong Gold", required: 60000, contracted: 58000, gap: -2000, status: "warning" },
  { flower: "Gerbera Kimsey", required: 45000, contracted: 45000, gap: 0, status: "healthy" },
  { flower: "Lisianthus Rosita White", required: 32000, contracted: 25000, gap: -7000, status: "critical" },
  { flower: "Alstroemeria Virginia", required: 28000, contracted: 30000, gap: 2000, status: "healthy" },
  { flower: "Chrysant Baltica", required: 55000, contracted: 50000, gap: -5000, status: "warning" },
  { flower: "Roos Avalanche 60cm", required: 70000, contracted: 72000, gap: 2000, status: "healthy" },
];

const fmt = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
};

const gapColor = (gap: number) =>
  gap >= 0 ? "text-accent" : gap >= -5000 ? "text-yellow-500" : "text-red-500 font-bold";

const statusDot = (s: string) => s === "healthy" ? "bg-accent" : s === "warning" ? "bg-yellow-500" : "bg-red-500 animate-pulse";

const totalRequired = forecastData.reduce((a, r) => a + r.required, 0);
const totalContracted = forecastData.reduce((a, r) => a + r.contracted, 0);
const totalGap = totalContracted - totalRequired;

const IHFlowerForecast = () => (
  <IHSectionShell icon={Flower2} title="Flower Forecast" subtitle="forecast_products × stems_per_product • Supply gap analyse" badge={`Gap: ${fmt(totalGap)}`} badgeVariant={totalGap >= 0 ? "success" : "critical"}>
    {/* Summary */}
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
        <div className="text-[10px] font-mono text-muted-foreground mb-1">Benodigd</div>
        <div className="text-lg font-extrabold text-foreground">{fmt(totalRequired)}</div>
      </div>
      <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 text-center">
        <div className="text-[10px] font-mono text-muted-foreground mb-1">Gecontracteerd</div>
        <div className="text-lg font-extrabold text-foreground">{fmt(totalContracted)}</div>
      </div>
      <div className={`p-3 rounded-xl text-center ${totalGap >= 0 ? "bg-accent/5 border border-accent/20" : "bg-red-500/5 border border-red-500/20"}`}>
        <div className="text-[10px] font-mono text-muted-foreground mb-1">Supply Gap</div>
        <div className={`text-lg font-extrabold ${totalGap >= 0 ? "text-accent" : "text-red-500"}`}>{totalGap >= 0 ? "+" : ""}{fmt(totalGap)}</div>
      </div>
    </div>

    {/* Table */}
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-5 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
        <span className="col-span-2">Bloem</span><span>Benodigd</span><span>Contract</span><span>Gap</span>
      </div>
      {forecastData.map((r) => (
        <div key={r.flower} className="grid grid-cols-5 text-[11px] px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors items-center">
          <span className="col-span-2 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${statusDot(r.status)}`} />
            <span className="font-medium text-foreground truncate">{r.flower}</span>
          </span>
          <span className="text-foreground/70 font-mono">{r.required.toLocaleString()}</span>
          <span className="text-foreground/70 font-mono">{r.contracted.toLocaleString()}</span>
          <span className={`font-mono ${gapColor(r.gap)}`}>{r.gap >= 0 ? "+" : ""}{r.gap.toLocaleString()}</span>
        </div>
      ))}
    </div>
  </IHSectionShell>
);

export default IHFlowerForecast;
