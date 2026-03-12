import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  operationalComplexityRows,
  complexityColor,
  type OperationalComplexityRow,
} from "./production-complexity-data";

const fmt = (n: number) => n.toLocaleString("nl-NL");

const OperationalComplexityView = () => {
  const sorted = [...operationalComplexityRows].sort((a, b) => b.complexityIndex - a.complexityIndex);

  return (
    <div className="space-y-4">
      {/* Summary insight */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
        <Info className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          Boeketten met dezelfde bouquets/uur kunnen sterk verschillen in operationele zwaarte.
          De <span className="font-bold text-foreground/70">Complexity Index</span> maakt dit verschil zichtbaar door stelen, componentenmix, variatie en handling te combineren.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left text-[9px] font-mono text-muted-foreground/50 px-3 py-2">Product</th>
                <th className="text-right text-[9px] font-mono text-muted-foreground/50 px-2 py-2">St/BQ</th>
                <th className="text-right text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Types</th>
                <th className="text-center text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Complexity</th>
                <th className="text-right text-[9px] font-mono text-muted-foreground/50 px-2 py-2">St/uur</th>
                <th className="text-center text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Druk</th>
                <th className="text-right text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Perf.</th>
                <th className="text-left text-[9px] font-mono text-muted-foreground/50 px-2 py-2">Lijn</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(row => {
                const cx = complexityColor(row.complexityLevel);
                const px = complexityColor(row.expectedOperationalPressure);
                const perfColor = row.actualPerformance === 0 ? "text-muted-foreground/40"
                  : row.actualPerformance >= 100 ? "text-accent"
                  : row.actualPerformance >= 93 ? "text-yellow-500"
                  : "text-destructive";
                return (
                  <tr key={row.product} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <td className="px-3 py-2.5">
                      <span className="font-semibold text-foreground">{row.product}</span>
                      <span className="text-[9px] text-muted-foreground/40 ml-1.5">{row.productFamily}</span>
                    </td>
                    <td className="text-right px-2 font-mono font-bold text-foreground">{row.stemsPerBouquet}</td>
                    <td className="text-right px-2 font-mono text-foreground/70">{row.flowerTypes}</td>
                    <td className="text-center px-2">
                      <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border inline-block", cx.bg, cx.border, cx.text)}>
                        {row.complexityIndex.toFixed(1)} — {cx.label}
                      </span>
                    </td>
                    <td className="text-right px-2 font-mono font-semibold text-foreground">
                      {row.stemsPerHour > 0 ? fmt(row.stemsPerHour) : "—"}
                    </td>
                    <td className="text-center px-2">
                      <span className={cn("text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border", px.bg, px.border, px.text)}>
                        {px.label}
                      </span>
                    </td>
                    <td className={cn("text-right px-2 font-mono font-bold", perfColor)}>
                      {row.actualPerformance > 0 ? `${row.actualPerformance}%` : "—"}
                    </td>
                    <td className="px-2 text-[10px] font-mono text-foreground/60">{row.line}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key insight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[11px] font-bold text-foreground">Verborgen zwaarte</span>
          </div>
          <p className="text-[10px] text-foreground/70 leading-relaxed">
            BQ De Luxe en BQ Charme XL lijken qua bouquets/uur vergelijkbaar met lichtere producten, maar verwerken 50-100% meer stelen per uur. Dit vertaalt zich in hogere fysieke belasting en meer handelingen.
          </p>
        </div>
        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-1.5">
            <Info className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold text-foreground">Planning inzicht</span>
          </div>
          <p className="text-[10px] text-foreground/70 leading-relaxed">
            Producten met een Complexity Index boven 7.0 vereisen meer personeel, meer checks, en hebben een hoger vertragingsrisico. Plan deze bij voorkeur op ervaren lijnen met voldoende buffer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OperationalComplexityView;
