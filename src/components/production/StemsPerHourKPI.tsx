import { cn } from "@/lib/utils";
import { Flower2, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  lineStemsData,
  deptStemsSummary,
  complexityColor,
  type LineStemsData,
} from "./production-complexity-data";

const fmt = (n: number) => n.toLocaleString("nl-NL");

const DeviationBadge = ({ v }: { v: number }) => {
  const color = v >= 0 ? "text-accent border-accent/20 bg-accent/5" : v >= -5 ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" : "text-destructive border-destructive/20 bg-destructive/5";
  return (
    <span className={cn("text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border", color)}>
      {v > 0 ? "+" : ""}{v.toFixed(1)}%
    </span>
  );
};

interface StemsPerHourKPIProps {
  deptFilter: string;
}

const StemsPerHourKPI = ({ deptFilter }: StemsPerHourKPIProps) => {
  const filteredLines = lineStemsData.filter(
    l => deptFilter === "all" || l.dept.toLowerCase() === deptFilter || deptFilter === "totaal"
  );

  const filteredSummary = deptStemsSummary.filter(
    s => deptFilter === "all" || s.dept.toLowerCase() === deptFilter || s.dept === "Totaal"
  );

  return (
    <div className="space-y-4">
      {/* Summary KPI tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {filteredSummary.map(s => (
          <div key={s.dept} className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-foreground/60 uppercase tracking-wider">{s.dept}</span>
            <div className="grid grid-cols-1 gap-2">
              <KPISmall label="Stelen/uur" value={fmt(s.stemsPerHour)} status={s.dept === "Totaal" ? "primary" : "default"} />
              <KPISmall label="Stelen/p/u" value={fmt(s.stemsPerHourPerPerson)} />
              <KPISmall label="Vandaag" value={`${(s.stemsProcessedToday / 1000).toFixed(0)}K`} />
              <KPISmall label="Periode" value={`${(s.stemsProcessedPeriod / 1000).toFixed(0)}K`} />
            </div>
          </div>
        ))}
      </div>

      {/* Per line table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem_3rem_5rem_5rem_4rem] text-[9px] text-muted-foreground/50 font-mono px-3 py-2 bg-muted/20 border-b border-border gap-2">
          <span>Lijn</span>
          <span>Product</span>
          <span className="text-right">St/uur</span>
          <span className="text-right">St/p/u</span>
          <span className="text-right">BQ/uur</span>
          <span className="text-right">Pers</span>
          <span className="text-right">Vandaag</span>
          <span className="text-right">Verwacht</span>
          <span className="text-right">Afw.</span>
        </div>
        {filteredLines.map(l => {
          const cx = complexityColor(l.complexityLevel);
          return (
            <div key={l.line} className="grid grid-cols-[3rem_1fr_5rem_5rem_5rem_3rem_5rem_5rem_4rem] text-[11px] px-3 py-2 border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors gap-2 items-center">
              <span className="font-bold text-foreground">{l.line}</span>
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="truncate text-foreground/80">{l.currentProduct}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={cn("text-[8px] font-mono px-1 py-0.5 rounded border shrink-0", cx.bg, cx.border, cx.text)}>{cx.label}</span>
                    </TooltipTrigger>
                    <TooltipContent className="text-[11px]"><p>Complexiteit: {l.complexityLevel}</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-right font-mono font-semibold text-foreground">{fmt(l.stemsPerHour)}</span>
              <span className="text-right font-mono text-foreground/70">{fmt(l.stemsPerHourPerPerson)}</span>
              <span className="text-right font-mono text-foreground/70">{l.bouquetsPerHour}</span>
              <span className="text-right font-mono text-foreground/50">{l.persons}</span>
              <span className="text-right font-mono text-foreground/70">{(l.stemsProcessedToday / 1000).toFixed(1)}K</span>
              <span className="text-right font-mono text-foreground/50">{fmt(l.expectedStemsPerHour)}</span>
              <div className="text-right"><DeviationBadge v={l.deviationPct} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KPISmall = ({ label, value, status = "default" }: { label: string; value: string; status?: "default" | "primary" }) => (
  <div className={cn(
    "p-2 rounded-lg border transition-all",
    status === "primary" ? "border-primary/20 bg-primary/5" : "border-border bg-card/50"
  )}>
    <span className="text-[9px] font-mono text-muted-foreground/50 block">{label}</span>
    <span className={cn("text-[13px] font-extrabold font-mono", status === "primary" ? "text-primary" : "text-foreground")}>{value}</span>
  </div>
);

export default StemsPerHourKPI;
