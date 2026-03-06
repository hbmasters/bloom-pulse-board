import { Factory, Gauge, TrendingUp } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "efficiency", title: "Huidige efficiëntie", value: "208", unit: "st/pers/uur", target: "220", change: "-5.5%", changeDir: "down", status: "warning", sparkline: [215, 212, 210, 209, 208] },
  { id: "w-apu", title: "W-APU", value: "195", unit: "bq/uur", target: "210", status: "warning" },
  { id: "o-apu", title: "O-APU", value: "210", unit: "bq/uur", status: "healthy" },
  { id: "p-apu", title: "P-APU (3m gem.)", value: "202", unit: "bq/uur", status: "warning" },
  { id: "c-apu", title: "C-APU", value: "215", unit: "bq/uur", status: "healthy" },
  { id: "output", title: "Totale output", value: "12,400", unit: "bq", change: "+3.1%", changeDir: "up", status: "healthy" },
];

const lines = [
  { name: "H1", wapu: 210, oapu: 210, eff: 100, status: "healthy" as const },
  { name: "H2", wapu: 205, oapu: 210, eff: 97.6, status: "healthy" as const },
  { name: "H3", wapu: 162, oapu: 210, eff: 77.1, status: "critical" as const },
  { name: "H4", wapu: 198, oapu: 210, eff: 94.3, status: "healthy" as const },
  { name: "H5", wapu: 195, oapu: 210, eff: 92.9, status: "warning" as const },
  { name: "H6", wapu: 212, oapu: 210, eff: 101, status: "healthy" as const },
  { name: "H7", wapu: 188, oapu: 210, eff: 89.5, status: "warning" as const },
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">Lijn prestaties</h3>
          </div>
          <div className="space-y-1">
            <div className="grid grid-cols-5 text-[8px] font-mono text-muted-foreground/50 uppercase pb-1 border-b border-border/50">
              <span>Lijn</span><span>W-APU</span><span>O-APU</span><span>Eff %</span><span>Status</span>
            </div>
            {lines.map(l => (
              <div key={l.name} className="grid grid-cols-5 items-center text-[10px] font-mono py-0.5">
                <span className="font-bold text-foreground">{l.name}</span>
                <span className="text-muted-foreground">{l.wapu}</span>
                <span className="text-muted-foreground">{l.oapu}</span>
                <span className={`font-bold ${l.status === "healthy" ? "text-accent" : l.status === "warning" ? "text-yellow-500" : "text-red-500"}`}>{l.eff}%</span>
                <span className={`w-2 h-2 rounded-full ${dot[l.status]}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/50 p-4">
          <h3 className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider mb-3">Efficiëntie trend per periode</h3>
          <div className="flex items-end gap-1 h-20">
            {[218, 215, 212, 214, 210, 211, 209, 210, 208, 208, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-sm ${i < 10 ? (v >= 220 ? "bg-accent/60" : v >= 200 ? "bg-yellow-500/50" : "bg-red-500/50") : "bg-border/20"}`}
                  style={{ height: v > 0 ? `${((v - 180) / 50) * 100}%` : "4px" }}
                />
                <span className="text-[7px] font-mono text-muted-foreground/50">P{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <div className="flex-1 border-t border-dashed border-accent/30" />
            <span className="text-[7px] font-mono text-accent/60">norm 220</span>
          </div>
        </div>
      </>
    )}
  </KPIDetailLayout>
);

export default KPIProductionEfficiency;
