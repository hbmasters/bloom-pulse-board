import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockShell, MiniBar } from "../BlockShell";
import { DOMAIN_COLORS } from "../block-domain-colors";
import type { ComparisonData } from "../block-types";

export const ComparisonBlock = ({ data }: { data: ComparisonData }) => {
  const colors = DOMAIN_COLORS.compare;
  
  // Compute max per metric for bar scaling
  const allMetrics = data.items.flatMap(item => item.metrics);
  const metricMaxes: Record<string, number> = {};
  allMetrics.forEach(m => {
    metricMaxes[m.label] = Math.max(metricMaxes[m.label] || 0, m.value);
  });

  return (
    <BlockShell
      domain="compare"
      title={data.title}
      icon={<ArrowLeftRight className="w-3.5 h-3.5" />}
      badge={`${data.items.length} ${data.dimension}`}
    >
      <p className="text-[11px] text-muted-foreground leading-relaxed">{data.summary}</p>

      {/* Comparison grid */}
      <div className="space-y-2">
        {data.items.map((item, i) => (
          <div key={i} className={cn("rounded-md border p-2 space-y-1.5", colors.border, "bg-card/50")}>
            <div className="text-[11px] font-semibold text-foreground">{item.name}</div>
            {item.metrics.map((m, j) => (
              <div key={j} className="flex items-center gap-2 text-[9px] font-mono">
                <span className="w-20 text-muted-foreground truncate">{m.label}</span>
                <div className="flex-1">
                  <MiniBar
                    value={m.value}
                    max={metricMaxes[m.label] * 1.1}
                    color={i === 0 ? colors.chartColor : colors.chartColorAlt}
                  />
                </div>
                <span className="w-14 text-right text-foreground font-semibold">
                  {m.value}{m.unit || ""}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {data.conclusion && (
        <div className="text-[11px] text-foreground font-medium border-t border-border/50 pt-2">
          💡 {data.conclusion}
        </div>
      )}
    </BlockShell>
  );
};
