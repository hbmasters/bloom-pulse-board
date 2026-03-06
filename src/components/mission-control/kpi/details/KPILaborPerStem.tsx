import { Users } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "labor-customer", title: "Arbeid/steel (klant)", value: "€0.042", target: "€0.045", change: "+2.1%", changeDir: "up", status: "healthy", sparkline: [0.041, 0.042, 0.043, 0.042, 0.042] },
  { id: "labor-internal", title: "Arbeid/steel (intern)", value: "€0.038", target: "< klant", change: "+4.8%", changeDir: "up", status: "warning", sparkline: [0.035, 0.036, 0.037, 0.038, 0.038] },
  { id: "labor-diff", title: "Verschil", value: "€0.004", status: "warning", change: "Marge krimpt", changeDir: "down" },
  { id: "labor-trend", title: "Trend", value: "+4.8%", status: "warning", change: "Stijgend", changeDir: "up" },
];

const byCustomer = [
  { name: "Albert Heijn", customer: "€0.044", internal: "€0.039", status: "healthy" as const },
  { name: "Jumbo", customer: "€0.041", internal: "€0.040", status: "warning" as const },
  { name: "Aldi", customer: "€0.039", internal: "€0.037", status: "healthy" as const },
  { name: "Lidl", customer: "€0.038", internal: "€0.039", status: "critical" as const },
];

const KPILaborPerStem = ({ onBack }: { onBack: () => void }) => (
  <KPIDetailLayout title="Arbeid per Steel" subtitle="Vergelijking klant- vs interne arbeidskosten" icon={Users} onBack={onBack}>
    {(filter: PeriodFilterState) => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-4">Arbeid per steel per klant</h3>
          <div className="space-y-2.5">
            <div className="grid grid-cols-4 text-[11px] text-muted-foreground/40 pb-2 border-b border-border/30">
              <span>Klant</span><span>Klantprijs</span><span>Intern</span><span>Status</span>
            </div>
            {byCustomer.map(c => (
              <div key={c.name} className="grid grid-cols-4 items-center text-[13px]">
                <span className="text-muted-foreground/70">{c.name}</span>
                <span className="font-semibold text-foreground">{c.customer}</span>
                <span className="font-semibold text-foreground">{c.internal}</span>
                <span className={`w-2 h-2 rounded-full ${c.status === "healthy" ? "bg-accent" : c.status === "warning" ? "bg-yellow-500" : "bg-red-500"}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-4">Trend per periode</h3>
          <div className="flex items-end gap-1.5 h-24">
            {[0.035, 0.036, 0.035, 0.037, 0.036, 0.037, 0.038, 0.037, 0.038, 0.038, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${i < 10 ? (v <= 0.036 ? "bg-accent/50" : v <= 0.038 ? "bg-yellow-500/40" : "bg-red-500/40") : "bg-border/15"}`}
                  style={{ height: v > 0 ? `${((v - 0.033) / 0.008) * 100}%` : "4px" }}
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

export default KPILaborPerStem;
