import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, TrendingDown, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  lineComplexityImpacts,
  complexityColor,
  type LineComplexityImpact,
} from "./production-complexity-data";

const riskColor = (r: "low" | "medium" | "high") =>
  r === "low" ? { text: "text-accent", bg: "bg-accent/10", border: "border-accent/20", label: "Laag" }
  : r === "medium" ? { text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Medium" }
  : { text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Hoog" };

interface LineOperationImpactProps {
  deptFilter: string;
}

const LineOperationImpact = ({ deptFilter }: LineOperationImpactProps) => {
  const sorted = [...lineComplexityImpacts]
    .filter(l => deptFilter === "all" || l.dept.toLowerCase() === deptFilter || deptFilter === "totaal")
    .sort((a, b) => b.avgComplexity - a.avgComplexity);

  const highRiskLines = sorted.filter(l => l.delayRiskLevel === "high");
  const avgEffLoss = sorted.length > 0 ? sorted.reduce((s, l) => s + l.efficiencyLossPct, 0) / sorted.length : 0;

  return (
    <div className="space-y-4">
      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <SummaryTile label="Hoog risico lijnen" value={String(highRiskLines.length)} sub={`van ${sorted.length}`} status={highRiskLines.length >= 3 ? "critical" : highRiskLines.length >= 1 ? "warning" : "healthy"} />
        <SummaryTile label="Gem. efficiency verlies" value={`${avgEffLoss.toFixed(1)}%`} status={avgEffLoss >= 8 ? "critical" : avgEffLoss >= 4 ? "warning" : "healthy"} />
        <SummaryTile label="Lijnen > 90% cap." value={String(sorted.filter(l => l.capacityUsagePct >= 90).length)} status={sorted.filter(l => l.capacityUsagePct >= 90).length >= 3 ? "critical" : "warning"} />
        <SummaryTile label="Gem. complexiteit" value={(sorted.reduce((s, l) => s + l.avgComplexity, 0) / (sorted.length || 1)).toFixed(1)} status="default" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left text-[9px] font-mono text-muted-foreground/50 px-3 py-2">Lijn</th>
                <th className="text-left text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Product(en)</th>
                <th className="text-center text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Complexity</th>
                <th className="text-right text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Snelheid</th>
                <th className="text-right text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Checks/u</th>
                <th className="text-center text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Vertraging</th>
                <th className="text-right text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Capaciteit</th>
                <th className="text-right text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Eff. verlies</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(l => {
                const cx = complexityColor(l.complexityLevel);
                const risk = riskColor(l.delayRiskLevel);
                const speedColor = l.lineSpeedImpact > 0 ? "text-accent" : l.lineSpeedImpact >= -5 ? "text-yellow-500" : "text-destructive";
                const capColor = l.capacityUsagePct >= 95 ? "text-destructive" : l.capacityUsagePct >= 88 ? "text-yellow-500" : "text-foreground/70";
                const effColor = l.efficiencyLossPct >= 10 ? "text-destructive" : l.efficiencyLossPct >= 5 ? "text-yellow-500" : "text-accent";

                return (
                  <tr key={l.line} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <td className="px-3 py-2.5">
                      <span className="font-bold text-foreground">{l.line}</span>
                      <span className="text-[9px] text-muted-foreground/40 ml-1">{l.dept}</span>
                    </td>
                    <td className="px-2 text-foreground/70">{l.currentProducts.join(", ")}</td>
                    <td className="text-center px-2">
                      <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border", cx.bg, cx.border, cx.text)}>
                        {l.avgComplexity.toFixed(1)}
                      </span>
                    </td>
                    <td className={cn("text-right px-2 font-mono font-semibold", speedColor)}>
                      {l.lineSpeedImpact > 0 ? "+" : ""}{l.lineSpeedImpact}%
                    </td>
                    <td className="text-right px-2 font-mono text-foreground/70">{l.checksFrequency.toFixed(1)}</td>
                    <td className="text-center px-2">
                      <span className={cn("text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border", risk.bg, risk.border, risk.text)}>
                        {risk.label}
                      </span>
                    </td>
                    <td className={cn("text-right px-2 font-mono font-semibold", capColor)}>{l.capacityUsagePct}%</td>
                    <td className={cn("text-right px-2 font-mono font-bold", effColor)}>{l.efficiencyLossPct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Management insights */}
      <div className="space-y-2">
        {[
          { severity: "critical" as const, icon: AlertTriangle, text: `Lijnen H6, B5 draaien complexe recepten (De Luxe, CI 8.8) met efficiency verlies van 12-14%. Overweeg extra personeel of spreiding over meerdere shifts.` },
          { severity: "warning" as const, icon: TrendingDown, text: `H3 heeft lage check-frequentie (0.5/u) bij hoge complexiteit (7.2). Dit verhoogt het kwaliteitsrisico — bandleider moet hier meer sturen.` },
          { severity: "info" as const, icon: Gauge, text: `Lijnen B1, B3, H4 draaien lage complexiteit met efficiency verlies < 2%. Geschikt voor opschaling of verschuiving van extra volume.` },
        ].map((a, i) => {
          const colors = {
            critical: "bg-destructive/5 border-destructive/25 text-destructive",
            warning: "bg-yellow-500/5 border-yellow-500/25 text-yellow-500",
            info: "bg-primary/5 border-primary/25 text-primary",
          };
          const [bgBorder, , textC] = colors[a.severity].split(" ");
          return (
            <div key={i} className={cn("flex items-start gap-3 p-3 rounded-xl border", colors[a.severity].split(" ").slice(0, 2).join(" "))}>
              <a.icon className={cn("w-4 h-4 shrink-0 mt-0.5", colors[a.severity].split(" ")[2])} />
              <p className="text-[11px] text-foreground/80 leading-relaxed">{a.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SummaryTile = ({ label, value, sub, status = "default" }: { label: string; value: string; sub?: string; status?: "healthy" | "warning" | "critical" | "default" }) => {
  const styles = {
    healthy: "border-accent/20 bg-accent/5",
    warning: "border-yellow-500/20 bg-yellow-500/5",
    critical: "border-destructive/20 bg-destructive/5",
    default: "border-border bg-card/50",
  };
  return (
    <div className={cn("p-3 rounded-xl border", styles[status])}>
      <span className="text-[9px] font-mono text-muted-foreground/50 block">{label}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-lg font-extrabold text-foreground">{value}</span>
        {sub && <span className="text-[9px] text-muted-foreground/40">{sub}</span>}
      </div>
    </div>
  );
};

export default LineOperationImpact;
