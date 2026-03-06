import { Trash2, BarChart3 } from "lucide-react";
import KPIDetailLayout from "../KPIDetailLayout";
import KPIMetricCard, { MetricData } from "../KPIMetricCard";
import { PeriodFilterState } from "../KPIPeriodFilter";

const metrics: MetricData[] = [
  { id: "waste-pct", title: "Uitval %", value: "3.4", unit: "%", target: "3.0%", change: "+0.4pp", changeDir: "up", status: "warning", sparkline: [2.8, 2.9, 3.0, 3.2, 3.4] },
  { id: "waste-value", title: "Uitval waarde", value: "€48K", target: "€42K", change: "+14.3%", changeDir: "up", status: "critical" },
  { id: "waste-stems", title: "Stelen uitval", value: "124K", change: "+8.2%", changeDir: "up", status: "warning" },
  { id: "writeoff", title: "Afschrijvingen", value: "€12K", change: "-2.1%", changeDir: "down", status: "healthy" },
];

const statusBreakdown = [
  { status: "Ingekocht", pct: 100, color: "bg-primary/30" },
  { status: "Voorraad", pct: 94.2, color: "bg-bloom-sky/30" },
  { status: "Verdeeld", pct: 91.8, color: "bg-bloom-warm/30" },
  { status: "Verkocht", pct: 89.5, color: "bg-accent/30" },
  { status: "Gecorrigeerd", pct: 4.2, color: "bg-yellow-500/30" },
  { status: "Afgeboekt", pct: 2.8, color: "bg-red-500/30" },
  { status: "Retour", pct: 0.8, color: "bg-muted-foreground/15" },
];

const KPIWaste = ({ onBack }: { onBack: () => void }) => (
  <KPIDetailLayout title="Uitval & Afschrijvingen" subtitle="Waste-analyse per status en trend" icon={Trash2} onBack={onBack}>
    {(filter: PeriodFilterState) => (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map(m => <KPIMetricCard key={m.id} metric={m} />)}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary/70" />
            <h3 className="text-[13px] font-semibold text-foreground tracking-tight">Verdeling per status</h3>
          </div>
          <div className="space-y-3">
            {statusBreakdown.map(s => (
              <div key={s.status} className="flex items-center gap-3">
                <span className="text-[12px] text-muted-foreground/60 w-24">{s.status}</span>
                <div className="flex-1 h-5 bg-border/15 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-[12px] font-semibold text-foreground w-12 text-right">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5">
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-4">Uitval trend per periode</h3>
          <div className="flex items-end gap-1.5 h-24">
            {[2.5, 2.7, 2.8, 2.6, 2.9, 3.0, 3.1, 3.0, 3.2, 3.4, 0, 0, 0].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${i < 10 ? (v <= 3.0 ? "bg-accent/50" : v <= 3.5 ? "bg-yellow-500/40" : "bg-red-500/40") : "bg-border/15"}`}
                  style={{ height: v > 0 ? `${((v - 2.0) / 2.0) * 100}%` : "4px" }}
                />
                <span className="text-[10px] text-muted-foreground/40">P{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 border-t border-dashed border-red-500/20" />
            <span className="text-[10px] text-red-400/60">norm 3.0%</span>
          </div>
        </div>
      </>
    )}
  </KPIDetailLayout>
);

export default KPIWaste;
