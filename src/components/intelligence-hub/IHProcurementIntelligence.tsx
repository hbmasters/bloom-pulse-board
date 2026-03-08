import { ShoppingCart } from "lucide-react";
import IHSectionShell from "./IHSectionShell";
import IHMetricCard, { IHMetric } from "./IHMetricCard";

const metrics: IHMetric[] = [
  { label: "Partijprijs variance", value: "+4.2", unit: "%", status: "warning", change: "vs offerte", changeDir: "up", sparkline: [2, 3, 3.5, 4, 3.8, 4.2] },
  { label: "Offerte vs werkelijk", value: "€0.082", unit: "vs €0.075", status: "critical", change: "+9.3%", changeDir: "up" },
  { label: "Leveranciersprestatie", value: "94", unit: "%", target: "97%", change: "−2pp", changeDir: "down", status: "warning", sparkline: [96, 95, 94, 95, 94] },
  { label: "Afschrijvingen", value: "3.1", unit: "%", target: "<3%", status: "critical", change: "+0.4pp", changeDir: "up", sparkline: [2.5, 2.7, 2.8, 3.0, 3.1] },
  { label: "Inkoop risico", value: "Middel", status: "warning", change: "3 leveranciers", changeDir: "neutral" },
];

const supplierRows = [
  { name: "Van der Berg Flowers", score: 96, priceVar: "+2.1%", quality: "A", status: "healthy" as const },
  { name: "Kenya Direct BV", score: 91, priceVar: "+8.4%", quality: "B+", status: "warning" as const },
  { name: "Flora Holland Pool", score: 88, priceVar: "+5.2%", quality: "B", status: "warning" as const },
  { name: "Bloem & Blad NL", score: 97, priceVar: "−1.0%", quality: "A+", status: "healthy" as const },
];

const statusDot = (s: string) => s === "healthy" ? "bg-accent" : s === "warning" ? "bg-yellow-500" : "bg-red-500";

const IHProcurementIntelligence = () => (
  <IHSectionShell icon={ShoppingCart} title="Procurement Intelligence" subtitle="Inkoopprestaties & leveranciersanalyse" badge="Picklist">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
      {metrics.map((m) => (
        <IHMetricCard key={m.label} metric={m} />
      ))}
    </div>

    <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2">Top leveranciers</h3>
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-5 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
        <span>Leverancier</span><span>Score</span><span>Prijs var.</span><span>Kwaliteit</span><span>Status</span>
      </div>
      {supplierRows.map((r) => (
        <div key={r.name} className="grid grid-cols-5 text-[11px] px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
          <span className="font-medium text-foreground truncate">{r.name}</span>
          <span className="text-foreground/70">{r.score}%</span>
          <span className={r.priceVar.startsWith("-") ? "text-accent" : "text-yellow-500"}>{r.priceVar}</span>
          <span className="text-foreground/70">{r.quality}</span>
          <span><div className={`w-2 h-2 rounded-full ${statusDot(r.status)}`} /></span>
        </div>
      ))}
    </div>
  </IHSectionShell>
);

export default IHProcurementIntelligence;
