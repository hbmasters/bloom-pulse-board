import { Factory } from "lucide-react";
import IHSectionShell from "./IHSectionShell";
import IHMetricCard, { IHMetric } from "./IHMetricCard";

const topMetrics: IHMetric[] = [
  { label: "W-APU", value: "224", unit: "st/u", target: "220", change: "+1.8%", changeDir: "up", status: "healthy", sparkline: [218, 220, 222, 219, 224] },
  { label: "O-APU", value: "210", unit: "st/u", target: "220", change: "−4.5%", changeDir: "down", status: "warning", sparkline: [215, 212, 208, 210, 210] },
  { label: "Stelen/pers/uur", value: "218", unit: "st", target: "220", change: "+1.4%", changeDir: "up", status: "healthy", sparkline: [210, 215, 212, 219, 218] },
  { label: "Lijn efficiëntie", value: "91.2", unit: "%", target: "95%", change: "−3.8pp", changeDir: "down", status: "warning", sparkline: [93, 92, 90, 91, 91] },
  { label: "Actieve lijnen", value: "10/12", status: "healthy", change: "2 offline", changeDir: "neutral" },
  { label: "Output vandaag", value: "48.2K", unit: "stelen", target: "52K", change: "+2.1%", changeDir: "up", status: "warning", sparkline: [44, 46, 45, 47, 48] },
];

interface LineData {
  id: string;
  stelenPP: number;
  wApu: number;
  oApu: number;
  eff: number;
  status: "healthy" | "warning" | "critical";
}

const handLines: LineData[] = [
  { id: "H1", stelenPP: 225, wApu: 228, oApu: 210, eff: 93, status: "healthy" },
  { id: "H2", stelenPP: 220, wApu: 224, oApu: 210, eff: 91, status: "healthy" },
  { id: "H3", stelenPP: 195, wApu: 198, oApu: 210, eff: 82, status: "critical" },
  { id: "H4", stelenPP: 230, wApu: 232, oApu: 210, eff: 95, status: "healthy" },
  { id: "H5", stelenPP: 218, wApu: 220, oApu: 210, eff: 90, status: "healthy" },
  { id: "H6", stelenPP: 205, wApu: 208, oApu: 210, eff: 86, status: "warning" },
  { id: "H7", stelenPP: 222, wApu: 226, oApu: 210, eff: 92, status: "healthy" },
];

const bandLines: LineData[] = [
  { id: "B1", stelenPP: 340, wApu: 345, oApu: 330, eff: 96, status: "healthy" },
  { id: "B2", stelenPP: 310, wApu: 315, oApu: 330, eff: 88, status: "warning" },
  { id: "B3", stelenPP: 350, wApu: 352, oApu: 330, eff: 97, status: "healthy" },
  { id: "B4", stelenPP: 325, wApu: 328, oApu: 330, eff: 91, status: "healthy" },
  { id: "B5", stelenPP: 290, wApu: 295, oApu: 330, eff: 82, status: "critical" },
];

const statusDotClass = (s: string) =>
  s === "healthy" ? "bg-accent" : s === "warning" ? "bg-yellow-500" : "bg-red-500 animate-pulse";

const stelenColor = (v: number, norm: number) =>
  v >= norm ? "text-accent" : v >= norm * 0.91 ? "text-yellow-500" : "text-red-500";

const DeptTable = ({ title, lines, norm }: { title: string; lines: LineData[]; norm: number }) => (
  <div>
    <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2">{title}</h3>
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-6 text-[10px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border">
        <span>Lijn</span><span>St/p/u</span><span>W-APU</span><span>O-APU</span><span>Eff%</span><span>Status</span>
      </div>
      {lines.map((l) => (
        <div key={l.id} className="grid grid-cols-6 text-[11px] px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/10 transition-colors">
          <span className="font-bold text-foreground">{l.id}</span>
          <span className={`font-semibold ${stelenColor(l.stelenPP, norm)}`}>{l.stelenPP}</span>
          <span className="text-foreground/70">{l.wApu}</span>
          <span className="text-foreground/70">{l.oApu}</span>
          <span className="text-foreground/70">{l.eff}%</span>
          <span><div className={`w-2 h-2 rounded-full ${statusDotClass(l.status)}`} /></span>
        </div>
      ))}
    </div>
  </div>
);

const IHProductionIntelligence = () => (
  <IHSectionShell icon={Factory} title="Production Intelligence" subtitle="Operationele productie performance • Hand / Band / Inpak" badge="HBM Production">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      {topMetrics.map((m) => (
        <IHMetricCard key={m.label} metric={m} />
      ))}
    </div>
    <div className="grid md:grid-cols-2 gap-5">
      <DeptTable title="Hand Afdeling (H1–H7)" lines={handLines} norm={220} />
      <DeptTable title="Band Afdeling (B1–B5)" lines={bandLines} norm={330} />
    </div>
    <div className="mt-4">
      <h3 className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider mb-2">Inpak Afdeling</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <IHMetricCard metric={{ label: "Ingepakt", value: "12.4K", unit: "boeketten", status: "healthy", change: "+3%", changeDir: "up" }} />
        <IHMetricCard metric={{ label: "Inpaksnelheid", value: "142", unit: "/uur", status: "healthy", target: "140" }} />
        <IHMetricCard metric={{ label: "Wachttijd", value: "8", unit: "min", status: "warning", change: "+2 min", changeDir: "up" }} />
        <IHMetricCard metric={{ label: "Foutpercentage", value: "1.2", unit: "%", status: "healthy", target: "<2%" }} />
      </div>
    </div>
  </IHSectionShell>
);

export default IHProductionIntelligence;
