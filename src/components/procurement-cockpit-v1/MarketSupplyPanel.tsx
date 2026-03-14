import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  marketSupplyData,
  supplyPressureLabels,
} from "./procurement-extended-data";
import {
  supplierQualityData,
  supplierGradeLabels,
  effectivePriceData,
  type SupplierGrade,
} from "./procurement-intelligence-data";
import {
  reliabilityLabels,
  type ReliabilityClass,
} from "./supplier-intelligence-data";

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;

const MarketSupplyPanel = () => {
  const summary = {
    totalSupply: marketSupplyData.reduce((s, m) => s + m.available_supply, 0),
    critical: marketSupplyData.filter(m => m.supply_pressure === "critical").length,
    high: marketSupplyData.filter(m => m.supply_pressure === "high").length,
    avgTrend: +(marketSupplyData.reduce((s, m) => s + m.price_trend, 0) / marketSupplyData.length).toFixed(1),
    gradeA: supplierQualityData.reduce((s, sq) => s + sq.suppliers.filter(s => s.grade === "A").length, 0),
    gradeC: supplierQualityData.reduce((s, sq) => s + sq.suppliers.filter(s => s.grade === "C").length, 0),
  };

  const getBestGrade = (product: string): SupplierGrade | null => {
    const entry = supplierQualityData.find(s => s.product === product);
    if (!entry || entry.suppliers.length === 0) return null;
    if (entry.suppliers.some(s => s.grade === "A")) return "A";
    if (entry.suppliers.some(s => s.grade === "B")) return "B";
    return "C";
  };

  const getBestReliability = (product: string): ReliabilityClass | null => {
    const entry = supplierQualityData.find(s => s.product === product);
    if (!entry || entry.suppliers.length === 0) return null;
    const bestScore = Math.max(...entry.suppliers.map(s => s.delivery_reliability));
    if (bestScore >= 90) return "high";
    if (bestScore >= 80) return "medium";
    return "low";
  };

  const getEffective = (product: string) => effectivePriceData.find(e => e.product === product);

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Totaal aanbod", value: fmt(summary.totalSupply), sub: "stelen beschikbaar" },
          { label: "Kritiek aanbod", value: `${summary.critical}`, sub: "producten", variant: summary.critical > 0 ? "critical" as const : "ok" as const },
          { label: "Krap aanbod", value: `${summary.high}`, sub: "producten", variant: summary.high > 0 ? "warning" as const : "ok" as const },
          { label: "Gem. prijstrend", value: `${summary.avgTrend > 0 ? "+" : ""}${summary.avgTrend}%`, sub: "MoM", variant: summary.avgTrend > 3 ? "critical" as const : summary.avgTrend < -1 ? "ok" as const : "warning" as const },
          { label: "Grade A leveranciers", value: `${summary.gradeA}`, sub: "top kwaliteit", variant: "ok" as const },
          { label: "Grade C leveranciers", value: `${summary.gradeC}`, sub: "risico leveranciers", variant: summary.gradeC > 0 ? "critical" as const : "ok" as const },
        ].map(k => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-3 flex flex-col gap-0.5">
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{k.label}</span>
            <span className={cn("text-lg font-bold font-mono", k.variant === "critical" ? "text-destructive" : k.variant === "ok" ? "text-accent" : "text-foreground")}>{k.value}</span>
            <span className="text-[9px] text-muted-foreground">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Market supply table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Product", "Familie", "Aanbod", "Lev.", "Beste prijs", "Eff. prijs", "Δ Eff.", "Trend", "Druk", "Grade", "Betrouwb.", "Update"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {marketSupplyData.map(m => {
              const pLabel = supplyPressureLabels[m.supply_pressure];
              const bestGrade = getBestGrade(m.product);
              const bestReliability = getBestReliability(m.product);
              const eff = getEffective(m.product);
              const effDelta = eff ? ((eff.effective_price - eff.best_price) / eff.best_price * 100) : 0;

              return (
                <tr key={m.product} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{m.product}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{m.product_family}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground">{fmt(m.available_supply)}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">{m.supplier_count}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(m.best_price)}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground">
                    {eff ? fmtPrice(eff.effective_price) : "—"}
                  </td>
                  <td className={cn("px-3 py-2.5 font-mono text-[10px]", effDelta > 5 ? "text-destructive" : "text-muted-foreground")}>
                    {eff ? `+${effDelta.toFixed(1)}%` : "—"}
                  </td>
                  <td className={cn("px-3 py-2.5 font-mono flex items-center gap-1", m.price_trend > 3 ? "text-destructive" : m.price_trend < -1 ? "text-accent" : "text-muted-foreground")}>
                    {m.price_trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {m.price_trend > 0 ? "+" : ""}{m.price_trend.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", pLabel.color)}>{pLabel.label}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    {bestGrade && (
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", supplierGradeLabels[bestGrade].color)}>
                        {bestGrade}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {bestReliability && (
                      <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border", reliabilityLabels[bestReliability].color)}>
                        {reliabilityLabels[bestReliability].label}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-[9px] text-muted-foreground whitespace-nowrap">{m.last_updated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-[9px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Eff. prijs</span>
          <span>= Beste prijs + afvalrisico</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Grade</span>
          <span className={cn("font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels.A.color)}>A</span>
          <span>Top</span>
          <span className={cn("font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels.B.color)}>B</span>
          <span>OK</span>
          <span className={cn("font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels.C.color)}>C</span>
          <span>Risico</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Betrouwb.</span>
          <span className={cn("font-medium px-1.5 py-0.5 rounded-full border", reliabilityLabels.high.color)}>Hoog</span>
          <span className={cn("font-medium px-1.5 py-0.5 rounded-full border", reliabilityLabels.medium.color)}>Medium</span>
          <span className={cn("font-medium px-1.5 py-0.5 rounded-full border", reliabilityLabels.low.color)}>Laag</span>
        </div>
      </div>
    </div>
  );
};

export default MarketSupplyPanel;