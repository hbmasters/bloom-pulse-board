import { LayoutGrid, Gauge } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "utilization", title: "Bedbezetting", value: "86.4", unit: "%", target: "90%", change: "-3.6pp", changeDir: "down", status: "warning", sparkline: [88, 87, 88, 87, 86.4] },
  { id: "total-beds", title: "Totaal bedden", value: "48", status: "healthy" },
  { id: "active-beds", title: "Actieve bedden", value: "41.5", status: "warning" },
  { id: "bottleneck", title: "Knelpunten", value: "3", status: "critical", change: "Stijgend", changeDir: "up" },
];

const dayData = [
  { day: "Ma", utilization: 92, status: "healthy" as const },
  { day: "Di", utilization: 88, status: "warning" as const },
  { day: "Wo", utilization: 85, status: "warning" as const },
  { day: "Do", utilization: 82, status: "warning" as const },
  { day: "Vr", utilization: 84, status: "warning" as const },
];

const KPICapacity = ({ onBack }: { onBack: () => void }) => (
  <KPIDetailLayout title="Bedcapaciteit & Bezetting" subtitle="Capaciteitsbenutting en knelpunten" icon={LayoutGrid} onBack={onBack}>
    {(filter: PeriodFilterState) => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-4 h-4 text-primary/70" />
            <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Bezetting per dag</h3>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {dayData.map(d => (
              <div key={d.day} className="text-center">
                <div className="text-[12px] text-muted-foreground/50 mb-3">{d.day}</div>
                <div className="relative w-full aspect-square rounded-2xl border border-border/30 bg-card/30 flex items-center justify-center">
                  <svg className="absolute inset-2" viewBox="0 0 36 36">
                    <path className="stroke-border/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" />
                    <path
                      className={d.utilization >= 90 ? "stroke-accent" : d.utilization >= 85 ? "stroke-yellow-500" : "stroke-red-500"}
                      strokeDasharray={`${d.utilization}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" strokeWidth="3" strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-sm font-bold text-foreground">{d.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-4">Bezetting trend per periode</h3>
          <div className="flex items-end gap-1.5 h-24">
            {[89, 90, 88, 87, 88, 89, 87, 86, 87, 86.4, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${i < 10 ? (v >= 90 ? "bg-accent/50" : v >= 85 ? "bg-yellow-500/40" : "bg-red-500/40") : "bg-border/15"}`}
                  style={{ height: v > 0 ? `${((v - 80) / 15) * 100}%` : "4px" }}
                />
                <span className="text-[10px] text-muted-foreground/40">P{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 border-t border-dashed border-accent/20" />
            <span className="text-[10px] text-accent/50">norm 90%</span>
          </div>
        </div>
      </>
    )}
  </KPIDetailLayout>
);

export default KPICapacity;
