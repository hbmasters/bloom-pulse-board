import { ShoppingCart } from "lucide-react";
import IHSectionShell from "./IHSectionShell";
import IHMetricCard, { IHMetric } from "./IHMetricCard";

/* ── 3 key metrics ── */
const metrics: IHMetric[] = [
  { label: "% Klok vs Direct", value: "38 / 62", unit: "%", status: "healthy", change: "Direct dominant", changeDir: "neutral" },
  { label: "Leveranciersprestatie", value: "94", unit: "%", target: "97%", change: "−2pp", changeDir: "down", status: "warning", sparkline: [96, 95, 94, 95, 94] },
  { label: "Afschrijvingen", value: "3.1", unit: "%", target: "<3%", status: "critical", change: "+0.4pp", changeDir: "up", sparkline: [2.5, 2.7, 2.8, 3.0, 3.1] },
];

/* ── Price comparison data ── */
const priceRows = [
  { flower: "Chrysant Ringa Yellow", clock: 0.092, direct: 0.078, calculated: 0.075, variance: "+3.2%" },
  { flower: "Roos Red Naomi 50cm", clock: 0.142, direct: 0.128, calculated: 0.125, variance: "+2.4%" },
  { flower: "Tulp Strong Gold", clock: 0.068, direct: 0.058, calculated: 0.055, variance: "+5.5%" },
  { flower: "Gerbera Kimsey", clock: 0.054, direct: 0.048, calculated: 0.046, variance: "+4.3%" },
  { flower: "Lisianthus Rosita White", clock: 0.118, direct: 0.098, calculated: 0.095, variance: "+3.2%" },
];

/* ── Supplier performance ── */
const supplierRows = [
  { name: "Van der Berg Flowers", qualityAccepted: 98.2, rejected: 1.8, deliveryReliability: 96, priceStability: 94, status: "healthy" as const },
  { name: "Kenya Direct BV", qualityAccepted: 91.4, rejected: 8.6, deliveryReliability: 88, priceStability: 72, status: "warning" as const },
  { name: "Flora Holland Pool", qualityAccepted: 95.8, rejected: 4.2, deliveryReliability: 92, priceStability: 85, status: "warning" as const },
  { name: "Bloem & Blad NL", qualityAccepted: 99.1, rejected: 0.9, deliveryReliability: 97, priceStability: 96, status: "healthy" as const },
];

const statusDot = (s: string) => s === "healthy" ? "bg-accent" : s === "warning" ? "bg-yellow-500" : "bg-red-500";

const IHProcurementIntelligence = () => (
  <IHSectionShell icon={ShoppingCart} title="Procurement Intelligence" subtitle="Klok vs Direct • Prijsvergelijking • Leveranciersprestatie" badge="3 KEY METRICS">
    {/* 3 Key metric tiles */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {metrics.map((m) => (
        <IHMetricCard key={m.label} metric={m} />
      ))}
    </div>

    {/* Price comparison table */}
    <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2">Klok vs Direct vs Berekend</h3>
    <div className="rounded-xl border border-border overflow-hidden mb-6">
      <div className="grid grid-cols-5 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
        <span className="col-span-1">Bloem</span><span>Klok €</span><span>Direct €</span><span>Berekend €</span><span>Variance</span>
      </div>
      {priceRows.map((r) => (
        <div key={r.flower} className="grid grid-cols-5 text-[11px] px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
          <span className="font-medium text-foreground truncate">{r.flower}</span>
          <span className="text-foreground/70 font-mono">€{r.clock.toFixed(3)}</span>
          <span className="text-foreground/70 font-mono">€{r.direct.toFixed(3)}</span>
          <span className="text-foreground/70 font-mono">€{r.calculated.toFixed(3)}</span>
          <span className="text-yellow-500 font-mono font-semibold">{r.variance}</span>
        </div>
      ))}
    </div>

    {/* Supplier Performance */}
    <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2">Leveranciersprestatie</h3>
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-6 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
        <span className="col-span-2">Leverancier</span><span>% Geaccepteerd</span><span>% Afgekeurd</span><span>Levering %</span><span>Prijsstab. %</span>
      </div>
      {supplierRows.map((r) => (
        <div key={r.name} className="grid grid-cols-6 text-[11px] px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
          <span className="col-span-2 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusDot(r.status)}`} />
            <span className="font-medium text-foreground truncate">{r.name}</span>
          </span>
          <span className="text-accent font-mono font-semibold">{r.qualityAccepted}%</span>
          <span className={`font-mono font-semibold ${r.rejected > 5 ? "text-destructive" : r.rejected > 2 ? "text-yellow-500" : "text-foreground/70"}`}>{r.rejected}%</span>
          <span className={`font-mono ${r.deliveryReliability >= 95 ? "text-accent" : "text-yellow-500"}`}>{r.deliveryReliability}%</span>
          <span className={`font-mono ${r.priceStability >= 90 ? "text-accent" : r.priceStability >= 80 ? "text-yellow-500" : "text-destructive"}`}>{r.priceStability}%</span>
        </div>
      ))}
    </div>
  </IHSectionShell>
);

export default IHProcurementIntelligence;
