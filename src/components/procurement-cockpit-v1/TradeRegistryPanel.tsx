import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import WeekYearFilter, { WeekYearFilterState } from "./WeekYearFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  tradeRegistry,
  seasonalityLabels,
  riskLabels,
  availabilityLabels,
} from "./procurement-extended-data";
import {
  getDesignStability,
  designStabilityLabels,
} from "./procurement-intelligence-data";
import {
  productSupplierStabilityData,
  supplierStabilityLabels,
} from "./supplier-intelligence-data";

const fmtPrice = (n: number) => `€${n.toFixed(3)}`;

const TradeRegistryPanel = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>(tradeRegistry[0]?.product || "");
  const [visibleWeeks, setVisibleWeeks] = useState(12);
  const [weekYearFilter, setWeekYearFilter] = useState<WeekYearFilterState>({
    year: new Date().getFullYear(),
    week: null,
  });

  const entry = useMemo(() => tradeRegistry.find(t => t.product === selectedProduct), [selectedProduct]);
  
  const weeks = useMemo(() => {
    const yearWeeks = entry?.weeks.filter(w => w.year === weekYearFilter.year) || [];
    if (weekYearFilter.week !== null) {
      const startIdx = yearWeeks.findIndex(w => w.week >= weekYearFilter.week!);
      return yearWeeks.slice(startIdx >= 0 ? startIdx : 0, (startIdx >= 0 ? startIdx : 0) + visibleWeeks);
    }
    return yearWeeks.slice(0, visibleWeeks);
  }, [entry, visibleWeeks, weekYearFilter]);

  return (
    <div className="space-y-4">
      {/* Week/Year filter */}
      <WeekYearFilter value={weekYearFilter} onChange={setWeekYearFilter} />

      {/* Product & visible weeks selectors */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Product:</span>
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer"
          >
            {tradeRegistry.map(t => (
              <option key={t.product} value={t.product}>{t.product} ({t.product_family})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Weken tonen:</span>
          <Select value={visibleWeeks.toString()} onValueChange={(v) => setVisibleWeeks(Number(v))}>
            <SelectTrigger className="w-[100px] h-8 text-[11px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8 weken</SelectItem>
              <SelectItem value="12">12 weken</SelectItem>
              <SelectItem value="16">16 weken</SelectItem>
              <SelectItem value="20">20 weken</SelectItem>
              <SelectItem value="24">24 weken</SelectItem>
              <SelectItem value="52">52 weken</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Week range display */}
      <div className="text-center">
        <span className="text-[10px] font-mono text-muted-foreground">
          Week {weeks[0]?.week || "—"} – {weeks[weeks.length - 1]?.week || "—"} ({weekYearFilter.year})
        </span>
      </div>

      {/* Week grid */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">Week</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">Beschikbaarheid</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">Prijs range</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">Leveranciers</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">Seizoen</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">Risico</th>
              <th className="px-2 py-2 text-left font-medium text-muted-foreground">Design</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, i) => {
              const avail = availabilityLabels[w.expected_availability];
              const season = seasonalityLabels[w.seasonality];
              const risk = riskLabels[w.risk_level];
              const stability = getDesignStability(w.expected_availability, w.risk_level);
              const stabilityLabel = designStabilityLabels[stability];
              const isCurrentWeek = i === 0 && weekYearFilter.week === null;
              return (
                <tr key={`${w.week}-${w.year}`} className={cn("border-b border-border/30 transition-colors", isCurrentWeek ? "bg-primary/5" : "hover:bg-muted/10")}>
                  <td className="px-2 py-2 font-mono font-semibold text-foreground whitespace-nowrap">
                    W{w.week}
                    {isCurrentWeek && <span className="ml-1.5 text-[8px] text-primary font-medium">NU</span>}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-2 h-2 rounded-full", avail.bg)} />
                      <span className={cn("font-medium", avail.color)}>{avail.label}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">
                    {fmtPrice(w.expected_price_low)} – {fmtPrice(w.expected_price_high)}
                  </td>
                  <td className="px-2 py-2 font-mono text-muted-foreground">{w.supplier_count}</td>
                  <td className="px-2 py-2">
                    <span className={cn("font-medium", season.color)}>{season.label}</span>
                  </td>
                  <td className="px-2 py-2">
                    <span className={cn("font-medium", risk.color)}>{risk.label}</span>
                  </td>
                  <td className="px-2 py-2">
                    <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border whitespace-nowrap", stabilityLabel.color)}>
                      {stabilityLabel.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[9px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Beschikbaarheid:</span>
          {Object.entries(availabilityLabels).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1">
              <span className={cn("w-2 h-2 rounded-full", v.bg)} /> {v.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Design:</span>
          {Object.entries(designStabilityLabels).map(([k, v]) => (
            <span key={k} className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border", v.color)}>
              {v.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeRegistryPanel;
