import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockShell, KPIStrip, SeverityBadge, MiniBar } from "../BlockShell";
import { DOMAIN_COLORS } from "../block-domain-colors";
import type { ProcurementActionData } from "../block-types";

const PRIORITY_MAP = { critical: "critical", high: "high", medium: "medium", low: "low" } as const;

export const ProcurementActionBlock = ({ data }: { data: ProcurementActionData }) => {
  const colors = DOMAIN_COLORS.procurement;
  const maxNeed = Math.max(...data.items.map(i => i.behoefte), 1);

  return (
    <BlockShell
      domain="procurement"
      title={data.title}
      icon={<ShoppingCart className="w-3.5 h-3.5" />}
      badge={data.items.length}
    >
      <p className="text-[11px] text-muted-foreground leading-relaxed">{data.summary}</p>

      {data.kpis && data.kpis.length > 0 && <KPIStrip kpis={data.kpis} domain="procurement" />}

      {/* Items table */}
      <div className="space-y-1.5">
        {data.items.map((item, i) => (
          <div key={i} className={cn("rounded-md border p-2 space-y-1.5", colors.border, "bg-card/50")}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground">{item.product}</span>
              <SeverityBadge level={PRIORITY_MAP[item.priority]} />
            </div>
            
            {/* Shortage bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between text-[9px] text-muted-foreground font-mono">
                <span>Voorraad: {item.voorraad}</span>
                <span>Behoefte: {item.behoefte}</span>
                <span className={cn("font-semibold", item.nog_nodig > 0 ? "text-red-400" : "text-emerald-400")}>
                  Nog nodig: {item.nog_nodig}
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-border/40 overflow-hidden">
                <div
                  className="absolute h-full rounded-full bg-emerald-500/60"
                  style={{ width: `${(item.voorraad / item.behoefte) * 100}%` }}
                />
                <div
                  className="absolute h-full rounded-full border-r-2 border-dashed border-foreground/30"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              {item.supplier && <span>📦 {item.supplier}</span>}
              {item.price !== undefined && <span>💰 €{item.price.toFixed(2)}</span>}
            </div>
            <div className="text-[10px] text-foreground font-medium">→ {item.action}</div>
          </div>
        ))}
      </div>
    </BlockShell>
  );
};
