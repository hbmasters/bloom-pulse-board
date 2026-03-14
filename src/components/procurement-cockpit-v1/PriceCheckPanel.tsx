import { ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  priceCheckData,
  priceCheckStatusLabels,
  designAdvisoryData,
  designAdviceLabels,
  markupAdviceLabels,
} from "./procurement-extended-data";

const fmtPrice = (n: number) => `€${n.toFixed(3)}`;

const PriceCheckPanel = () => {
  const okCount = priceCheckData.filter(p => p.price_check_status === "ok").length;
  const warningCount = priceCheckData.filter(p => p.price_check_status === "warning").length;
  const criticalCount = priceCheckData.filter(p => p.price_check_status === "critical").length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 flex flex-col gap-0.5">
          <span className="text-[9px] font-medium text-muted-foreground uppercase">Marge-veilig</span>
          <span className="text-lg font-bold font-mono text-accent">{okCount}</span>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 flex flex-col gap-0.5">
          <span className="text-[9px] font-medium text-muted-foreground uppercase">Let op</span>
          <span className="text-lg font-bold font-mono text-yellow-500">{warningCount}</span>
        </div>
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 flex flex-col gap-0.5">
          <span className="text-[9px] font-medium text-muted-foreground uppercase">Risico</span>
          <span className="text-lg font-bold font-mono text-destructive">{criticalCount}</span>
        </div>
      </div>

      {/* Price check table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Status", "Product", "Offerteprijs", "Marktprijs", "Recente inkoop", "Adviesprijs", "Δ Markt", "Design advies", "Markup/Markdown"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priceCheckData.map(p => {
              const statusLabel = priceCheckStatusLabels[p.price_check_status];
              const advisory = designAdvisoryData.find(d => d.product_id === p.product_id);
              const designLabel = advisory ? designAdviceLabels[advisory.design_advice] : null;
              const markupLabel = advisory ? markupAdviceLabels[advisory.markup_advice] : null;
              const deltaMarket = p.market_price > 0 ? ((p.offer_price - p.market_price) / p.market_price * 100) : 0;

              return (
                <tr key={p.product_id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2.5">
                    <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", statusLabel.color)}>{statusLabel.label}</span>
                  </td>
                  <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{p.product}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground">{fmtPrice(p.offer_price)}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">{fmtPrice(p.market_price)}</td>
                  <td className="px-3 py-2.5 font-mono text-muted-foreground">{fmtPrice(p.recent_purchase_price)}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(p.advised_price)}</td>
                  <td className={cn("px-3 py-2.5 font-mono", deltaMarket < -3 ? "text-accent" : deltaMarket > 3 ? "text-destructive" : "text-muted-foreground")}>
                    {deltaMarket > 0 ? "+" : ""}{deltaMarket.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5">
                    {designLabel && (
                      <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", designLabel.color)}>
                        {designLabel.icon} {designLabel.label}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {markupLabel && (
                      <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", markupLabel.color)}>
                        {markupLabel.label}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Design advisory detail cards */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3">Design & Pricing Advies</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {designAdvisoryData.filter(d => d.design_advice !== "good_choice" && d.design_advice !== "stable_option").map(d => {
            const designLabel = designAdviceLabels[d.design_advice];
            const markupLabel = markupAdviceLabels[d.markup_advice];
            return (
              <div key={d.product_id} className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-foreground">{d.product}</span>
                  <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", designLabel.color)}>
                    {designLabel.icon} {designLabel.label}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{d.advice_detail}</p>
                {d.substitute && (
                  <div className="flex items-center gap-1.5 text-[10px] text-primary">
                    <ArrowRight className="w-3 h-3" />
                    <span>Substituut: <strong>{d.substitute}</strong></span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                  <span className="text-[9px] text-muted-foreground">Marktprijs: <strong className="text-foreground">{fmtPrice(d.market_price)}</strong></span>
                  <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", markupLabel.color)}>
                    {markupLabel.label}
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground italic">{d.markup_detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceCheckPanel;
