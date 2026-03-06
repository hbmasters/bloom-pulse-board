import { PiggyBank, Users, Package, TrendingUp } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "desired-margin", title: "Gewenste marge", value: "38.0", unit: "%", target: "38%", status: "healthy", sparkline: [37, 37.5, 38, 38, 38.2] },
  { id: "achieved-margin", title: "Gerealiseerde marge", value: "36.2", unit: "%", target: "38%", change: "-1.8%", changeDir: "down", status: "warning", sparkline: [37.5, 36.8, 36.5, 36.0, 36.2] },
  { id: "margin-diff", title: "Marge verschil", value: "-1.8", unit: "pp", status: "warning", change: "Verslechtering", changeDir: "down" },
  { id: "margin-per-bouquet", title: "Marge per boeket", value: "€1.24", target: "€1.35", change: "-8.1%", changeDir: "down", status: "warning", sparkline: [1.32, 1.30, 1.28, 1.25, 1.24] },
];

const topCustomers = [
  { name: "Albert Heijn", margin: "34.5%", status: "warning" as const },
  { name: "Jumbo", margin: "39.2%", status: "healthy" as const },
  { name: "Aldi", margin: "37.1%", status: "healthy" as const },
  { name: "Lidl", margin: "32.8%", status: "critical" as const },
  { name: "Plus", margin: "41.0%", status: "healthy" as const },
];

const categories = [
  { name: "Gemengd boeket", margin: "38.5%", status: "healthy" as const },
  { name: "Monoboeket", margin: "35.2%", status: "warning" as const },
  { name: "Seizoensboeket", margin: "40.1%", status: "healthy" as const },
  { name: "Premium", margin: "33.8%", status: "critical" as const },
];

const KPIProductCost = ({ onBack }: { onBack: () => void }) => (
  <KPIDetailLayout title="Product Cost Control" subtitle="Marge-analyse per klant, product en categorie" icon={PiggyBank} onBack={onBack}>
    {(filter: PeriodFilterState) => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-primary/70" />
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Marge per klant</h3>
            </div>
            <div className="space-y-3">
              {topCustomers.map(c => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="text-[13px] text-muted-foreground/70">{c.name}</span>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${c.status === "healthy" ? "bg-accent" : c.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`} />
                    <span className="text-[13px] font-semibold text-foreground">{c.margin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-bloom-warm" />
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Marge per categorie</h3>
            </div>
            <div className="space-y-3">
              {categories.map(c => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="text-[13px] text-muted-foreground/70">{c.name}</span>
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${c.status === "healthy" ? "bg-accent" : c.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`} />
                    <span className="text-[13px] font-semibold text-foreground">{c.margin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Marge ontwikkeling per periode</h3>
          </div>
          <div className="flex items-end gap-1.5 h-28">
            {[36.5, 37.2, 37.8, 36.9, 37.5, 38.1, 37.0, 36.5, 36.8, 36.2, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all ${i < 10 ? (v >= 38 ? "bg-accent/50" : v >= 36 ? "bg-yellow-500/40" : "bg-red-500/40") : "bg-border/15"}`}
                  style={{ height: v > 0 ? `${((v - 34) / 6) * 100}%` : "4px" }}
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

export default KPIProductCost;
