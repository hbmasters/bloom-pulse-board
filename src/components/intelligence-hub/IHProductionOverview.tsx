import { Factory, ArrowRight } from "lucide-react";
import IHSectionShell from "./IHSectionShell";
import IHMetricCard, { IHMetric } from "./IHMetricCard";

/* ── Department KPI data ── */

interface DeptOverview {
  name: string;
  metrics: IHMetric[];
  status: "healthy" | "warning" | "critical";
  summary: string;
}

const departments: DeptOverview[] = [
  {
    name: "Hand Afdeling",
    status: "healthy",
    summary: "6 van 7 lijnen op norm • H3 onder verwachting",
    metrics: [
      { label: "Gem. st/p/u", value: "218", unit: "st", target: "220", status: "healthy", change: "+1.4%", changeDir: "up" },
      { label: "Actieve lijnen", value: "7/7", status: "healthy" },
      { label: "APU", value: "224", unit: "st/u", target: "220", status: "healthy", change: "+1.8%", changeDir: "up" },
    ],
  },
  {
    name: "Band Afdeling",
    status: "warning",
    summary: "3 van 5 lijnen op norm • B5 kritisch onder norm",
    metrics: [
      { label: "Gem. st/p/u", value: "323", unit: "st", target: "330", status: "warning", change: "−2.1%", changeDir: "down" },
      { label: "Actieve lijnen", value: "5/5", status: "healthy" },
      { label: "APU", value: "327", unit: "st/u", target: "330", status: "warning", change: "−0.9%", changeDir: "down" },
    ],
  },
  {
    name: "Koelcel",
    status: "healthy",
    summary: "Temperatuur stabiel • Capaciteit 78% bezet",
    metrics: [
      { label: "Temperatuur", value: "4.2", unit: "°C", target: "4°C", status: "healthy" },
      { label: "Bezetting", value: "78", unit: "%", status: "healthy", change: "+3%", changeDir: "up" },
      { label: "Uitval koeling", value: "0.4", unit: "%", status: "healthy", target: "<1%" },
    ],
  },
  {
    name: "Inpak",
    status: "warning",
    summary: "Snelheid op norm • Wachttijd boven acceptabel",
    metrics: [
      { label: "Ingepakt", value: "12.4K", unit: "boeketten", status: "healthy", change: "+3%", changeDir: "up" },
      { label: "Inpaksnelheid", value: "142", unit: "/uur", status: "healthy", target: "140" },
      { label: "Wachttijd", value: "8", unit: "min", status: "warning", change: "+2 min", changeDir: "up" },
    ],
  },
  {
    name: "Verdelen",
    status: "healthy",
    summary: "Verdeelnauwkeurigheid 99.2% • Doorlooptijd op norm",
    metrics: [
      { label: "Nauwkeurigheid", value: "99.2", unit: "%", status: "healthy", target: "99%" },
      { label: "Doorlooptijd", value: "14", unit: "min", status: "healthy", target: "15 min" },
      { label: "Orders verdeeld", value: "384", status: "healthy", change: "+12", changeDir: "up" },
    ],
  },
];

const statusDot = (s: string) =>
  s === "healthy" ? "bg-accent" : s === "warning" ? "bg-yellow-500" : "bg-red-500 animate-pulse";

const statusBorder = (s: string) =>
  s === "healthy" ? "border-accent/20" : s === "warning" ? "border-yellow-500/20" : "border-red-500/20";

const IHProductionOverview = () => (
  <IHSectionShell
    icon={Factory}
    title="Production Intelligence"
    subtitle="High-level overzicht per afdeling"
    badge="5 AFDELINGEN"
  >
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((dept) => (
        <div
          key={dept.name}
          className={`rounded-xl border ${statusBorder(dept.status)} bg-card/50 p-4 space-y-3`}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${statusDot(dept.status)}`} />
              <h3 className="text-sm font-bold text-foreground">{dept.name}</h3>
            </div>
          </div>

          {/* Summary */}
          <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
            {dept.summary}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2">
            {dept.metrics.map((m) => (
              <IHMetricCard key={m.label} metric={m} />
            ))}
          </div>
        </div>
      ))}

      {/* Link to detail */}
      <div className="rounded-xl border border-dashed border-border bg-muted/5 p-4 flex items-center justify-center">
        <div className="text-center space-y-1">
          <Factory className="w-5 h-5 text-muted-foreground/40 mx-auto" />
          <p className="text-[10px] font-mono text-muted-foreground">
            Gedetailleerde lijndata beschikbaar in
          </p>
          <p className="text-[11px] font-bold text-primary">Production Cockpit</p>
        </div>
      </div>
    </div>
  </IHSectionShell>
);

export default IHProductionOverview;
