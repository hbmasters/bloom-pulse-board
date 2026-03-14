import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
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
  type TradeRegistryEntry,
} from "./procurement-extended-data";

const fmtPrice = (n: number) => `€${n.toFixed(3)}`;

const TradeRegistryPanel = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>(tradeRegistry[0]?.product || "");
  const [weekOffset, setWeekOffset] = useState(0);
  const [visibleWeeks, setVisibleWeeks] = useState(12);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const entry = useMemo(() => tradeRegistry.find(t => t.product === selectedProduct), [selectedProduct]);
  const weeks = useMemo(() => {
    const yearWeeks = entry?.weeks.filter(w => w.year === selectedYear) || [];
    return yearWeeks.slice(weekOffset, weekOffset + visibleWeeks);
  }, [entry, weekOffset, visibleWeeks, selectedYear]);

  const availableYears = useMemo(() => {
    if (!entry) return [2025];
    return [...new Set(entry.weeks.map(w => w.year))].sort((a, b) => a - b);
  }, [entry]);

  return (
    <div className="space-y-4">
      {/* Product, Year & Week selectors */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Product:</span>
          <select
            value={selectedProduct}
            onChange={e => { setSelectedProduct(e.target.value); setWeekOffset(0); }}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer"
          >
            {tradeRegistry.map(t => (
              <option key={t.product} value={t.product}>{t.product} ({t.product_family})</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Jaar:</span>
          <Select value={selectedYear.toString()} onValueChange={(v) => { setSelectedYear(Number(v)); setWeekOffset(0); }}>
            <SelectTrigger className="w-[100px] h-8 text-[11px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          Week {weeks[0]?.week || "—"} – {weeks[weeks.length - 1]?.week || "—"} ({weeks[0]?.year || ""})
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
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, i) => {
              const avail = availabilityLabels[w.expected_availability];
              const season = seasonalityLabels[w.seasonality];
              const risk = riskLabels[w.risk_level];
              const isCurrentWeek = i === 0 && weekOffset === 0;
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[9px] text-muted-foreground">
        <span className="font-medium uppercase tracking-wide">Beschikbaarheid:</span>
        {Object.entries(availabilityLabels).map(([k, v]) => (
          <span key={k} className="flex items-center gap-1">
            <span className={cn("w-2 h-2 rounded-full", v.bg)} /> {v.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TradeRegistryPanel;
