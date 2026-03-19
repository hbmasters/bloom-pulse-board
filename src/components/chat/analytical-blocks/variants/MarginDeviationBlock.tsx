import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockShell, KPIStrip, DeviationIndicator, ComparisonBar } from "../BlockShell";
import { DOMAIN_COLORS } from "../block-domain-colors";
import type { MarginDeviationData } from "../block-types";

export const MarginDeviationBlock = ({ data }: { data: MarginDeviationData }) => {
  const colors = DOMAIN_COLORS.margin;

  return (
    <BlockShell
      domain="margin"
      title={data.title}
      icon={<TrendingUp className="w-3.5 h-3.5" />}
      badge={data.items.length}
      period={data.period}
    >
      <p className="text-[11px] text-muted-foreground leading-relaxed">{data.summary}</p>

      {data.kpis && data.kpis.length > 0 && <KPIStrip kpis={data.kpis} domain="margin" />}

      <div className="space-y-2">
        {data.items.map((item, i) => (
          <div key={i} className={cn("rounded-md border p-2 space-y-1.5", colors.border, "bg-card/50")}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground">{item.label}</span>
              <DeviationIndicator value={item.deviation_pct} />
            </div>

            <ComparisonBar
              value1={item.expected}
              value2={item.actual}
              label1="Verwacht"
              label2="Werkelijk"
              color1={colors.chartColor}
              color2={item.deviation_eur >= 0 ? "hsl(155, 55%, 42%)" : "hsl(0, 65%, 55%)"}
            />

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
              <span>€{item.expected.toFixed(2)} → €{item.actual.toFixed(2)}</span>
              <span className={cn("font-semibold", item.deviation_eur >= 0 ? "text-emerald-400" : "text-red-400")}>
                {item.deviation_eur >= 0 ? "+" : ""}€{item.deviation_eur.toFixed(2)}
              </span>
            </div>

            {item.cause && <div className="text-[10px] text-muted-foreground">Oorzaak: {item.cause}</div>}
            {item.action && <div className="text-[10px] text-foreground font-medium">→ {item.action}</div>}
          </div>
        ))}
      </div>
    </BlockShell>
  );
};
