import { Factory, Gauge, Users } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "stelen-pp", title: "Stelen per persoon per uur", value: "208", unit: "st/pers/uur", target: "220", change: "-5.5%", changeDir: "down", status: "warning", sparkline: [215, 212, 210, 209, 208] },
  { id: "efficiency", title: "Huidige efficiëntie", value: "94.5", unit: "%", target: "100%", change: "-2.1%", changeDir: "down", status: "warning", sparkline: [96, 95.5, 95, 94.8, 94.5] },
  { id: "w-apu", title: "W-APU", value: "195", unit: "bq/uur", target: "210", status: "warning" },
  { id: "o-apu", title: "O-APU", value: "210", unit: "bq/uur", status: "healthy" },
  { id: "p-apu", title: "P-APU (3m gem.)", value: "202", unit: "bq/uur", status: "warning" },
  { id: "c-apu", title: "C-APU", value: "215", unit: "bq/uur", status: "healthy" },
  { id: "output", title: "Totale output", value: "12,400", unit: "bq", change: "+3.1%", changeDir: "up", status: "healthy" },
];

const handLines = [
  { name: "H1", wapu: 210, oapu: 210, eff: 100, status: "healthy" as const },
  { name: "H2", wapu: 205, oapu: 210, eff: 97.6, status: "healthy" as const },
  { name: "H3", wapu: 162, oapu: 210, eff: 77.1, status: "critical" as const },
  { name: "H4", wapu: 198, oapu: 210, eff: 94.3, status: "healthy" as const },
  { name: "H5", wapu: 195, oapu: 210, eff: 92.9, status: "warning" as const },
  { name: "H6", wapu: 212, oapu: 210, eff: 101, status: "healthy" as const },
  { name: "H7", wapu: 188, oapu: 210, eff: 89.5, status: "warning" as const },
];

const bandLines = [
  { name: "B1", wapu: 320, oapu: 330, eff: 97, status: "healthy" as const },
  { name: "B2", wapu: 310, oapu: 330, eff: 93.9, status: "healthy" as const },
  { name: "B3", wapu: 295, oapu: 330, eff: 89.4, status: "warning" as const },
  { name: "B4", wapu: 330, oapu: 330, eff: 100, status: "healthy" as const },
  { name: "B5", wapu: 305, oapu: 330, eff: 92.4, status: "warning" as const },
];

const dot = { healthy: "bg-accent", warning: "bg-yellow-500", critical: "bg-red-500 animate-pulse" };

const KPIProductionEfficiency = ({ onBack }: { onBack: () => void }) => (
  <KPIDetailLayout title="Productie Efficiëntie" subtitle="W-APU, O-APU, P-APU, C-APU en lijnprestaties" icon={Factory} onBack={onBack}>
    {(filter: PeriodFilterState) => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        {[{ title: "Hand Afdeling", icon: Users, data: handLines }, { title: "Band Afdeling", icon: Gauge, data: bandLines }].map(section => (
          <div key={section.title} className="rounded-2xl border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <section.icon className="w-4 h-4 text-primary/70" />
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">{section.title}</h3>
            </div>
            <div className="space-y-1.5">
              <div className="grid grid-cols-5 text-[11px] text-muted-foreground/40 pb-2 border-b border-border/30">
                <span>Lijn</span><span>W-APU</span><span>O-APU</span><span>Eff %</span><span>Status</span>
              </div>
              {section.data.map(l => (
                <div key={l.name} className="grid grid-cols-5 items-center text-[13px] py-1">
                  <span className="font-semibold text-foreground">{l.name}</span>
                  <span className="text-muted-foreground/70">{l.wapu}</span>
                  <span className="text-muted-foreground/70">{l.oapu}</span>
                  <span className={`font-semibold ${l.status === "healthy" ? "text-accent" : l.status === "warning" ? "text-yellow-500" : "text-red-500"}`}>{l.eff}%</span>
                  <span className={`w-2 h-2 rounded-full ${dot[l.status]}`} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-4">Efficiëntie trend per periode</h3>
          <div className="flex items-end gap-1.5 h-24">
            {[218, 215, 212, 214, 210, 211, 209, 210, 208, 208, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${i < 10 ? (v >= 220 ? "bg-accent/50" : v >= 200 ? "bg-yellow-500/40" : "bg-red-500/40") : "bg-border/15"}`}
                  style={{ height: v > 0 ? `${((v - 180) / 50) * 100}%` : "4px" }}
                />
                <span className="text-[10px] text-muted-foreground/40">P{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 border-t border-dashed border-accent/20" />
            <span className="text-[10px] text-accent/50">norm 220</span>
          </div>
        </div>
      </>
    )}
  </KPIDetailLayout>
);

export default KPIProductionEfficiency;
