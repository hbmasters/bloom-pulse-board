import { TrendingUp, TrendingDown, BarChart3, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  marketSupplyData,
  supplyPressureLabels,
  type MarketSupplyItem,
} from "./procurement-extended-data";

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;

const MarketSupplyPanel = () => {
  const summary = {
    totalSupply: marketSupplyData.reduce((s, m) => s + m.available_supply, 0),
    critical: marketSupplyData.filter(m => m.supply_pressure === "critical").length,
    high: marketSupplyData.filter(m => m.supply_pressure === "high").length,
    avgTrend: +(marketSupplyData.reduce((s, m) => s + m.price_trend, 0) / marketSupplyData.length).toFixed(1),
  };

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Totaal aanbod", value: fmt(summary.totalSupply), sub: "stelen beschikbaar" },
          { label: "Kritiek aanbod", value: `${summary.critical}`, sub: "producten", variant: summary.critical > 0 ? "critical" as const : "ok" as const },
          { label: "Krap aanbod", value: `${summary.high}`, sub: "producten", variant: summary.high > 0 ? "warning" as const : "ok" as const },
          { label: "Gem. prijstrend", value: `${summary.avgTrend > 0 ? "+" : ""}${summary.avgTrend}%`, sub: "MoM", variant: summary.avgTrend > 3 ? "critical" as const : summary.avgTrend < -1 ? "ok" as const : "warning" as const },
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
              {["Product", "Familie", "Aanbod", "Leveranciers", "Prijs laag", "Prijs hoog", "Beste prijs", "Trend", "Druk", "Update"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {marketSupplyData.map(m => {
              const pLabel = supplyPressureLabels[m.supply_pressure];
              return (
                <tr key={m.product} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{m.product}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{m.product_family}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground">{fmt(m.available_supply)}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">{m.supplier_count}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">{fmtPrice(m.price_low)}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">{fmtPrice(m.price_high)}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(m.best_price)}</td>
                  <td className={cn("px-3 py-2.5 font-mono flex items-center gap-1", m.price_trend > 3 ? "text-destructive" : m.price_trend < -1 ? "text-accent" : "text-muted-foreground")}>
                    {m.price_trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {m.price_trend > 0 ? "+" : ""}{m.price_trend.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", pLabel.color)}>{pLabel.label}</span>
                  </td>
                  <td className="px-3 py-2.5 text-[9px] text-muted-foreground whitespace-nowrap">{m.last_updated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketSupplyPanel;
