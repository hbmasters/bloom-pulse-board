import { Truck, Package } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "price-stem", title: "Prijs per steel", value: "€0.18", target: "€0.17", change: "+5.9%", changeDir: "up", status: "warning", sparkline: [0.16, 0.165, 0.17, 0.175, 0.18] },
  { id: "total-procurement", title: "Totale inkoop", value: "€1.58M", change: "+4.2%", changeDir: "up", status: "warning" },
  { id: "pkg-cost", title: "Verpakking/boeket", value: "€0.32", target: "€0.30", change: "+6.7%", changeDir: "up", status: "warning" },
  { id: "material-cost", title: "Materiaal/boeket", value: "€0.14", target: "€0.15", change: "-3.3%", changeDir: "down", status: "healthy" },
];

const suppliers = [
  { name: "Flora Holland", priceStem: "€0.17", share: "42%", trend: "+3.2%", status: "healthy" as const },
  { name: "Colombia Direct", priceStem: "€0.21", share: "28%", trend: "+12.0%", status: "critical" as const },
  { name: "Kenya Farms", priceStem: "€0.15", share: "18%", trend: "+1.5%", status: "healthy" as const },
  { name: "Local Growers", priceStem: "€0.19", share: "12%", trend: "-2.1%", status: "healthy" as const },
];

const KPIProcurementDetail = ({ onBack }: { onBack: () => void }) => (
  <KPIDetailLayout title="Inkoop & Waardering" subtitle="Inkoopkosten, leveranciers en prijstrends" icon={Truck} onBack={onBack}>
    {(filter: PeriodFilterState) => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4 text-bloom-warm" />
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Directe inkoop — Leveranciers</h3>
            </div>
            <div className="space-y-1.5">
              <div className="grid grid-cols-5 text-[11px] text-muted-foreground/40 pb-2 border-b border-border/30">
                <span className="col-span-2">Leverancier</span><span>€/steel</span><span>Aandeel</span><span>Trend</span>
              </div>
              {suppliers.map(s => (
                <div key={s.name} className="grid grid-cols-5 items-center text-[13px] py-1">
                  <span className="col-span-2 text-muted-foreground/70 truncate">{s.name}</span>
                  <span className="font-semibold text-foreground">{s.priceStem}</span>
                  <span className="text-muted-foreground/60">{s.share}</span>
                  <span className={`font-semibold ${s.trend.startsWith("-") ? "text-accent" : "text-red-400"}`}>{s.trend}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-bloom-sky" />
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Indirecte inkoop</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Verpakkingsmateriaal", value: "€0.32/bq", pct: 72, color: "bg-bloom-warm/30" },
                { label: "Overig materiaal", value: "€0.14/bq", pct: 45, color: "bg-bloom-sky/30" },
                { label: "Transport intern", value: "€0.08/bq", pct: 28, color: "bg-primary/20" },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="text-muted-foreground/60">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                  <div className="h-2.5 bg-border/15 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-4">Inkoopprijs per steel — trend</h3>
          <div className="flex items-end gap-1.5 h-24">
            {[0.16, 0.165, 0.17, 0.168, 0.17, 0.172, 0.175, 0.178, 0.18, 0.18, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${i < 10 ? (v <= 0.17 ? "bg-accent/50" : v <= 0.18 ? "bg-yellow-500/40" : "bg-red-500/40") : "bg-border/15"}`}
                  style={{ height: v > 0 ? `${((v - 0.15) / 0.04) * 100}%` : "4px" }}
                />
                <span className="text-[10px] text-muted-foreground/40">P{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </KPIDetailLayout>
);

export default KPIProcurementDetail;
