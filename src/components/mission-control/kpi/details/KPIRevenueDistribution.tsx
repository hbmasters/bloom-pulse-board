import { PieChart, AlertTriangle } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "top-customer", title: "Grootste klant aandeel", value: "27.4", unit: "%", target: "< 25%", change: "+1.2pp", changeDir: "up", status: "critical" },
  { id: "top5-share", title: "Top 5 klanten", value: "68.3", unit: "%", status: "warning", sparkline: [65, 66, 67, 67.5, 68.3] },
  { id: "total-revenue", title: "Totale omzet", value: "€2.4M", change: "+6.2%", changeDir: "up", status: "healthy" },
  { id: "customer-count", title: "Actieve klanten", value: "142", change: "+3", changeDir: "up", status: "healthy" },
];

const customers = [
  { name: "Albert Heijn", share: 27.4, revenue: "€658K", growth: "+3.2%", status: "critical" as const },
  { name: "Jumbo", share: 15.2, revenue: "€365K", growth: "+8.1%", status: "healthy" as const },
  { name: "Aldi", share: 10.8, revenue: "€259K", growth: "+1.5%", status: "healthy" as const },
  { name: "Lidl", share: 8.4, revenue: "€202K", growth: "-2.3%", status: "warning" as const },
  { name: "Plus", share: 6.5, revenue: "€156K", growth: "+12.4%", status: "healthy" as const },
  { name: "Overige", share: 31.7, revenue: "€761K", growth: "+5.8%", status: "healthy" as const },
];

const KPIRevenueDistribution = ({ onBack }: { onBack: () => void }) => (
  <KPIDetailLayout title="Omzetverdeling & Groei" subtitle="Klantconcentratie en groeiontwikkeling" icon={PieChart} onBack={onBack}>
    {(filter: PeriodFilterState) => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-[13px] text-red-400/80">
            <strong>Let op:</strong> Albert Heijn overschrijdt de 25% omzetgrens (27.4%). Risico op klantafhankelijkheid.
          </span>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-4">Omzetverdeling per klant</h3>
          <div className="space-y-3">
            {customers.map(c => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-[12px] text-muted-foreground/70 w-24 truncate">{c.name}</span>
                <div className="flex-1 h-5 bg-border/15 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.status === "critical" ? "bg-red-500/30" : c.status === "warning" ? "bg-yellow-500/30" : "bg-primary/20"}`}
                    style={{ width: `${c.share}%` }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-foreground w-12 text-right">{c.share}%</span>
                <span className="text-[12px] text-muted-foreground/50 w-16 text-right">{c.revenue}</span>
                <span className={`text-[12px] font-semibold w-14 text-right ${c.growth.startsWith("+") ? "text-accent" : "text-red-400"}`}>{c.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </KPIDetailLayout>
);

export default KPIRevenueDistribution;
