import { DollarSign } from "lucide-react";
import IHSectionShell from "./IHSectionShell";
import IHMetricCard, { IHMetric } from "./IHMetricCard";

const metrics: IHMetric[] = [
  { label: "Werkelijke marge", value: "32.4", unit: "%", change: "−2.6pp vs target", changeDir: "down", status: "warning", sparkline: [34, 33, 35, 32, 33, 31, 32] },
  { label: "Target marge", value: "35.0", unit: "%", status: "neutral" },
  { label: "Marge gap", value: "−2.6", unit: "pp", status: "warning", change: "Verbreding", changeDir: "down" },
  { label: "Bloemkosten", value: "€0.082", unit: "/steel", target: "€0.075", change: "+9.3%", changeDir: "up", status: "critical", sparkline: [72, 74, 76, 78, 80, 82] },
  { label: "Arbeidskosten", value: "€0.034", unit: "/steel", target: "€0.030", status: "warning", change: "+13%", changeDir: "up" },
  { label: "Factuurprijs variance", value: "−1.8", unit: "%", status: "warning", change: "vs offerte", changeDir: "down" },
];

const costBreakdown = [
  { label: "Bloemen", pct: 48, color: "bg-primary" },
  { label: "Arbeid", pct: 22, color: "bg-accent" },
  { label: "Verpakking", pct: 12, color: "bg-yellow-500" },
  { label: "Transport", pct: 10, color: "bg-muted-foreground" },
  { label: "Overhead", pct: 8, color: "bg-red-400" },
];

const IHMarginIntelligence = () => (
  <IHSectionShell icon={DollarSign} title="Margin Performance" subtitle="Werkelijke marge vs target • Financiële performance" badge="Axerrio DW" badgeVariant="warning">
    {/* Combined margin tile */}
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 mb-5">
      <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-3">Marge Overzicht</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-[10px] text-muted-foreground/60 mb-1">Werkelijke marge</div>
          <div className="text-2xl font-extrabold text-foreground">32.4<span className="text-sm font-normal text-muted-foreground/50">%</span></div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground/60 mb-1">Target marge</div>
          <div className="text-2xl font-extrabold text-foreground">35.0<span className="text-sm font-normal text-muted-foreground/50">%</span></div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground/60 mb-1">Marge gap</div>
          <div className="text-2xl font-extrabold text-destructive">−2.6<span className="text-sm font-normal text-muted-foreground/50">pp</span></div>
        </div>
      </div>
      {/* Visual bar */}
      <div className="mt-3 h-3 rounded-full bg-border/30 overflow-visible relative">
        <div className="h-full rounded-full bg-yellow-500/60" style={{ width: "92.6%" }} />
        <div className="absolute top-0 h-full w-0.5 bg-foreground/40" style={{ left: "100%" }} title="Target 35%" />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] font-mono text-muted-foreground/40">0%</span>
        <span className="text-[9px] font-mono text-yellow-500">32.4% werkelijk</span>
        <span className="text-[9px] font-mono text-muted-foreground/40">35% target</span>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
      {metrics.slice(3).map((m) => (
        <IHMetricCard key={m.label} metric={m} />
      ))}
    </div>

    {/* Cost breakdown bar */}
    <div>
      <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-3">Kostenverdeling per steel</h3>
      <div className="flex h-4 rounded-full overflow-hidden mb-2">
        {costBreakdown.map((c) => (
          <div key={c.label} className={`${c.color} transition-all`} style={{ width: `${c.pct}%` }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {costBreakdown.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${c.color}`} />
            <span className="text-[10px] text-muted-foreground">{c.label} {c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  </IHSectionShell>
);

export default IHMarginIntelligence;
