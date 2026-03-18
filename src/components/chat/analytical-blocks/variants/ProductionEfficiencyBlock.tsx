import { Factory, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockShell, KPIStrip, DeviationIndicator, MiniBar } from "../BlockShell";
import { DOMAIN_COLORS } from "../block-domain-colors";
import type { ProductionEfficiencyData } from "../block-types";

export const ProductionEfficiencyBlock = ({ data }: { data: ProductionEfficiencyData }) => {
  const colors = DOMAIN_COLORS.production;
  const maxApu = Math.max(...data.lines.map(l => Math.max(l.w_apu, l.o_apu)), 1);

  return (
    <BlockShell
      domain="production"
      title={data.title}
      icon={<Factory className="w-3.5 h-3.5" />}
      badge={`${data.lines.length} lijnen`}
    >
      <p className="text-[11px] text-muted-foreground leading-relaxed">{data.summary}</p>

      {data.kpis && data.kpis.length > 0 && <KPIStrip kpis={data.kpis} domain="production" />}

      {/* Line comparison */}
      <div className="space-y-2">
        {data.lines.map((line, i) => (
          <div key={i} className={cn("rounded-md border p-2 space-y-1", colors.border, "bg-card/50")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-foreground">{line.line}</span>
                {line.product && <span className="text-[10px] text-muted-foreground">· {line.product}</span>}
              </div>
              <DeviationIndicator value={line.deviation_pct} />
            </div>

            {/* APU bars */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[9px] font-mono">
                <span className="w-10 text-muted-foreground">W-APU</span>
                <div className="flex-1"><MiniBar value={line.w_apu} max={maxApu} color={colors.chartColor} /></div>
                <span className="w-8 text-right text-foreground font-semibold">{line.w_apu}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono">
                <span className="w-10 text-muted-foreground">O-APU</span>
                <div className="flex-1"><MiniBar value={line.o_apu} max={maxApu} color={colors.chartColorAlt} /></div>
                <span className="w-8 text-right text-foreground font-semibold">{line.o_apu}</span>
              </div>
              {line.p_apu !== undefined && (
                <div className="flex items-center gap-2 text-[9px] font-mono">
                  <span className="w-10 text-muted-foreground">P-APU</span>
                  <div className="flex-1"><MiniBar value={line.p_apu} max={maxApu} color="hsl(var(--muted-foreground))" /></div>
                  <span className="w-8 text-right text-foreground font-semibold">{line.p_apu}</span>
                </div>
              )}
            </div>

            {line.stems_per_person && (
              <div className="text-[9px] text-muted-foreground font-mono">
                Stelen/persoon/uur: <span className="text-foreground font-semibold">{line.stems_per_person}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Top losses */}
      {data.top_losses && data.top_losses.length > 0 && (
        <div className="space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">Top Verliezen</div>
          {data.top_losses.map((l, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[11px] text-red-400">
              <TrendingDown className="w-3 h-3 shrink-0 mt-0.5" />
              <span>{l}</span>
            </div>
          ))}
        </div>
      )}

      {data.action_advice && (
        <div className="flex items-start gap-1.5 text-[11px] text-foreground">
          <ArrowRight className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
          <span className="font-medium">{data.action_advice}</span>
        </div>
      )}
    </BlockShell>
  );
};
