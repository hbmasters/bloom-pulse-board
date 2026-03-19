import { useState, useMemo, Fragment } from "react";
import { TrendingUp, TrendingDown, Search, ChevronDown, ChevronRight, Link2, Package, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import { procurementRows } from "./procurement-cockpit-v1-data";
import {
  marketSupplyData,
  supplyPressureLabels,
  tradeRegistry,
  seasonalityLabels,
  riskLabels,
  availabilityLabels,
} from "./procurement-extended-data";
import {
  supplierQualityData,
  supplierGradeLabels,
  effectivePriceData,
  getDesignStability,
  designStabilityLabels,
  type SupplierGrade,
} from "./procurement-intelligence-data";
import {
  reliabilityLabels,
  productSupplierStabilityData,
  supplierStabilityLabels,
  type ReliabilityClass,
} from "./supplier-intelligence-data";
import WeekYearFilter, { WeekYearFilterState } from "./WeekYearFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;

const MarketSupplyPanel = ({ familyFilter, onFamilyFilterChange, families }: {
  familyFilter?: string | null;
  onFamilyFilterChange?: (v: string | null) => void;
  families?: string[];
}) => {
  const [search, setSearch] = useState("");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [visibleWeeks, setVisibleWeeks] = useState(12);
  const [weekYearFilter, setWeekYearFilter] = useState<WeekYearFilterState>({
    year: new Date().getFullYear(),
    week: null,
  });

  const summary = {
    totalSupply: marketSupplyData.reduce((s, m) => s + m.available_supply, 0),
    critical: marketSupplyData.filter(m => m.supply_pressure === "critical").length,
    high: marketSupplyData.filter(m => m.supply_pressure === "high").length,
    avgTrend: +(marketSupplyData.reduce((s, m) => s + m.price_trend, 0) / marketSupplyData.length).toFixed(1),
    gradeA: supplierQualityData.reduce((s, sq) => s + sq.suppliers.filter(s => s.grade === "A").length, 0),
    gradeC: supplierQualityData.reduce((s, sq) => s + sq.suppliers.filter(s => s.grade === "C").length, 0),
  };

  const getBestGrade = (product: string): SupplierGrade | null => {
    const entry = supplierQualityData.find(s => s.product === product);
    if (!entry || entry.suppliers.length === 0) return null;
    if (entry.suppliers.some(s => s.grade === "A")) return "A";
    if (entry.suppliers.some(s => s.grade === "B")) return "B";
    return "C";
  };

  const getBestReliability = (product: string): ReliabilityClass | null => {
    const entry = supplierQualityData.find(s => s.product === product);
    if (!entry || entry.suppliers.length === 0) return null;
    const bestScore = Math.max(...entry.suppliers.map(s => s.delivery_reliability));
    if (bestScore >= 90) return "high";
    if (bestScore >= 80) return "medium";
    return "low";
  };

  const getEffective = (product: string) => effectivePriceData.find(e => e.product === product);

  const getTradeWeeks = (product: string) => {
    const entry = tradeRegistry.find(t => t.product === product);
    if (!entry) return [];
    const yearWeeks = entry.weeks.filter(w => w.year === weekYearFilter.year);
    if (weekYearFilter.week !== null) {
      const startIdx = yearWeeks.findIndex(w => w.week >= weekYearFilter.week!);
      return yearWeeks.slice(startIdx >= 0 ? startIdx : 0, (startIdx >= 0 ? startIdx : 0) + visibleWeeks);
    }
    return yearWeeks.slice(0, visibleWeeks);
  };

  const filteredData = marketSupplyData.filter(m => {
    if (search && !m.product.toLowerCase().includes(search.toLowerCase()) && !m.product_family.toLowerCase().includes(search.toLowerCase())) return false;
    if (familyFilter && m.product_family !== familyFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Totaal aanbod", value: fmt(summary.totalSupply), sub: "stelen beschikbaar" },
          { label: "Kritiek aanbod", value: `${summary.critical}`, sub: "producten", variant: summary.critical > 0 ? "critical" as const : "ok" as const },
          { label: "Krap aanbod", value: `${summary.high}`, sub: "producten", variant: summary.high > 0 ? "warning" as const : "ok" as const },
          { label: "Gem. prijstrend", value: `${summary.avgTrend > 0 ? "+" : ""}${summary.avgTrend}%`, sub: "MoM", variant: summary.avgTrend > 3 ? "critical" as const : summary.avgTrend < -1 ? "ok" as const : "warning" as const },
          { label: "Grade A leveranciers", value: `${summary.gradeA}`, sub: "top kwaliteit", variant: "ok" as const },
          { label: "Grade C leveranciers", value: `${summary.gradeC}`, sub: "risico leveranciers", variant: summary.gradeC > 0 ? "critical" as const : "ok" as const },
        ].map(k => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-3 flex flex-col gap-0.5">
            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{k.label}</span>
            <span className={cn("text-lg font-bold font-mono", k.variant === "critical" ? "text-destructive" : k.variant === "ok" ? "text-accent" : "text-foreground")}>{k.value}</span>
            <span className="text-[9px] text-muted-foreground">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek product of familie..." className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        {families && families.length > 0 && onFamilyFilterChange && (
          <select value={familyFilter || ""} onChange={e => onFamilyFilterChange(e.target.value || null)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer">
            <option value="">Alle families</option>
            {families.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        )}
      </div>

      {/* Market supply table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-2 py-2.5 w-6"></th>
              {["Product", "Familie", "Aanbod", "Lev.", "Beste prijs", "Eff. prijs", "Δ Eff.", "Trend", "Druk", "Grade", "Betrouwb.", "Update"].map(h => (
                <th key={h} className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map(m => {
              const pLabel = supplyPressureLabels[m.supply_pressure];
              const bestGrade = getBestGrade(m.product);
              const bestReliability = getBestReliability(m.product);
              const eff = getEffective(m.product);
              const effDelta = eff ? ((eff.effective_price - eff.best_price) / eff.best_price * 100) : 0;
              const isExpanded = expandedProduct === m.product;
              const weeks = isExpanded ? getTradeWeeks(m.product) : [];
              const stabilityEntry = productSupplierStabilityData.find(p => p.product === m.product);

              return (
                <Fragment key={m.product}>
                  <tr
                    className={cn("border-b border-border/30 transition-colors cursor-pointer", isExpanded ? "bg-primary/5" : "hover:bg-muted/10")}
                    onClick={() => setExpandedProduct(isExpanded ? null : m.product)}
                  >
                    <td className="px-2 py-2.5 text-muted-foreground">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{m.product}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{m.product_family}</td>
                    <td className="px-3 py-2.5 font-mono text-foreground">{fmt(m.available_supply)}</td>
                    <td className="px-3 py-2.5 font-mono text-muted-foreground">{m.supplier_count}</td>
                    <td className="px-3 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(m.best_price)}</td>
                    <td className="px-3 py-2.5 font-mono text-foreground">
                      {eff ? fmtPrice(eff.effective_price) : "—"}
                    </td>
                    <td className={cn("px-3 py-2.5 font-mono text-[10px]", effDelta > 5 ? "text-destructive" : "text-muted-foreground")}>
                      {eff ? `+${effDelta.toFixed(1)}%` : "—"}
                    </td>
                    <td className={cn("px-3 py-2.5 font-mono", m.price_trend > 3 ? "text-destructive" : m.price_trend < -1 ? "text-accent" : "text-muted-foreground")}>
                      <span className="flex items-center gap-1">
                        {m.price_trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {m.price_trend > 0 ? "+" : ""}{m.price_trend.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", pLabel.color)}>{pLabel.label}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      {bestGrade && (
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", supplierGradeLabels[bestGrade].color)}>
                          {bestGrade}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {bestReliability && (
                        <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border", reliabilityLabels[bestReliability].color)}>
                          {reliabilityLabels[bestReliability].label}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-[9px] text-muted-foreground whitespace-nowrap">{m.last_updated}</td>
                  </tr>

                  {/* Expanded: Trade Registry weeks */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={13} className="p-0">
                        <div className="bg-muted/20 border-t border-border px-4 py-3 space-y-3">
                          {/* Supplier stability + week controls */}
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                Historie & Forecast
                              </span>
                              <span className="flex items-center gap-1.5 text-[9px]">
                                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                <span className="text-muted-foreground">Historie</span>
                              </span>
                              <span className="flex items-center gap-1.5 text-[9px]">
                                <span className="w-2 h-2 rounded-full bg-primary/50" />
                                <span className="text-muted-foreground">Forecast</span>
                              </span>
                              {stabilityEntry && (() => {
                                const stabLabel = supplierStabilityLabels[stabilityEntry.stability];
                                return (
                                  <span className="flex items-center gap-2 text-[10px]">
                                    <span className={cn("font-medium px-2 py-0.5 rounded-full border", stabLabel.color)}>
                                      {stabLabel.label}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {stabilityEntry.supplier_count} lev. · Top {stabilityEntry.top_supplier_share}%
                                    </span>
                                  </span>
                                );
                              })()}
                            </div>
                            <div className="flex items-center gap-3">
                              <WeekYearFilter value={weekYearFilter} onChange={setWeekYearFilter} />
                              <Select value={visibleWeeks.toString()} onValueChange={(v) => setVisibleWeeks(Number(v))}>
                                <SelectTrigger className="w-[90px] h-7 text-[10px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[8, 12, 16, 20, 24, 52].map(n => (
                                    <SelectItem key={n} value={n.toString()}>{n} wkn</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Week range */}
                          <div className="text-center">
                            <span className="text-[9px] font-mono text-muted-foreground">
                              Week {weeks[0]?.week || "—"} – {weeks[weeks.length - 1]?.week || "—"} ({weekYearFilter.year})
                            </span>
                          </div>

                          {/* Weeks table */}
                          <div className="overflow-x-auto rounded-lg border border-border">
                            <table className="w-full text-[10px]">
                              <thead>
                                <tr className="border-b border-border bg-muted/30">
                                  {["Week", "Type", "Beschikbaarheid", "Prijs range", "Realisatie", "Volume", "Lev.", "Seizoen", "Risico", "Design"].map(h => (
                                    <th key={h} className="px-2 py-1.5 text-left font-medium text-muted-foreground">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {weeks.map((w, i) => {
                                  const avail = availabilityLabels[w.expected_availability];
                                  const season = seasonalityLabels[w.seasonality];
                                  const risk = riskLabels[w.risk_level];
                                  const stability = getDesignStability(w.expected_availability, w.risk_level);
                                  const stabilityLabel = designStabilityLabels[stability];
                                  const isCurrentWeek = !w.historical && i > 0 && weeks[i - 1]?.historical;
                                  const isHist = !!w.historical;
                                  return (
                                    <tr key={`${w.week}-${w.year}`} className={cn(
                                      "border-b border-border/30 transition-colors",
                                      isCurrentWeek ? "bg-primary/5 border-l-2 border-l-primary" : isHist ? "bg-muted/5 opacity-75" : "hover:bg-muted/10"
                                    )}>
                                      <td className="px-2 py-1.5 font-mono font-semibold text-foreground whitespace-nowrap">
                                        W{w.week}
                                        {isCurrentWeek && <span className="ml-1.5 text-[8px] text-primary font-medium">NU</span>}
                                      </td>
                                      <td className="px-2 py-1.5">
                                        <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border",
                                          isHist ? "text-muted-foreground bg-muted/30 border-border" : "text-primary bg-primary/10 border-primary/20"
                                        )}>
                                          {isHist ? "Historie" : "Forecast"}
                                        </span>
                                      </td>
                                      <td className="px-2 py-1.5">
                                        <div className="flex items-center gap-1.5">
                                          <div className={cn("w-2 h-2 rounded-full", avail.bg)} />
                                          <span className={cn("font-medium", avail.color)}>{avail.label}</span>
                                        </div>
                                      </td>
                                      <td className="px-2 py-1.5 font-mono text-muted-foreground">
                                        {fmtPrice(w.expected_price_low)} – {fmtPrice(w.expected_price_high)}
                                      </td>
                                      <td className="px-2 py-1.5 font-mono">
                                        {w.actual_price ? (
                                          <span className="font-semibold text-foreground">{fmtPrice(w.actual_price)}</span>
                                        ) : (
                                          <span className="text-muted-foreground/30">—</span>
                                        )}
                                      </td>
                                      <td className="px-2 py-1.5 font-mono">
                                        {w.actual_volume ? (
                                          <span className="text-foreground">{w.actual_volume.toLocaleString("nl-NL")}</span>
                                        ) : (
                                          <span className="text-muted-foreground/30">—</span>
                                        )}
                                      </td>
                                      <td className="px-2 py-1.5 font-mono text-muted-foreground">{w.supplier_count}</td>
                                      <td className="px-2 py-1.5">
                                        <span className={cn("font-medium", season.color)}>{season.label}</span>
                                      </td>
                                      <td className="px-2 py-1.5">
                                        <span className={cn("font-medium", risk.color)}>{risk.label}</span>
                                      </td>
                                      <td className="px-2 py-1.5">
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

                          {/* Koppelingen — linked procurement needs */}
                          {(() => {
                            const linkedRows = procurementRows.filter(
                              p => p.product === m.product || p.product_family === m.product_family
                            );
                            if (linkedRows.length === 0) return null;
                            const totalNeed = linkedRows.reduce((s, r) => s + r.required_volume, 0);
                            const totalOpen = linkedRows.reduce((s, r) => s + r.open_buy_need, 0);
                            return (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                    <Link2 className="w-3 h-3" /> Koppelingen inkooplijst
                                  </span>
                                  <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border text-primary bg-primary/10 border-primary/20">
                                    {linkedRows.length} product{linkedRows.length !== 1 ? "en" : ""}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground">
                                    Totaal behoefte: <strong className="text-foreground">{fmt(totalNeed)}</strong> · Open inkoop: <strong className={cn(totalOpen > 0 ? "text-destructive" : "text-accent")}>{fmt(totalOpen)}</strong>
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {linkedRows.map(r => {
                                    const dekkingPct = r.required_volume > 0 ? Math.min(100, Math.round((r.available_stock / r.required_volume) * 100)) : 100;
                                    return (
                                      <div key={r.id} className="flex items-center justify-between text-[10px] py-1.5 px-3 rounded-lg bg-background border border-border/30">
                                        <div className="flex items-center gap-2">
                                          <Package className="w-3 h-3 text-muted-foreground" />
                                          <span className="font-medium text-foreground">{r.product}</span>
                                          <span className="text-[9px] font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">{r.stem_length}</span>
                                          <span className="text-[9px] text-muted-foreground">{r.buyer}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] text-muted-foreground">Behoefte:</span>
                                            <span className="font-mono text-foreground">{fmt(r.required_volume)}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] text-muted-foreground">Open:</span>
                                            <span className={cn("font-mono font-semibold", r.open_buy_need > 0 ? "text-destructive" : "text-accent")}>{fmt(r.open_buy_need)}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <div className="w-12 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                              <div className={cn("h-full rounded-full", dekkingPct >= 100 ? "bg-accent" : dekkingPct >= 50 ? "bg-yellow-500" : "bg-destructive")} style={{ width: `${dekkingPct}%` }} />
                                            </div>
                                            <span className="text-[8px] font-mono text-muted-foreground">{dekkingPct}%</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-[9px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Druk:</span>
          {Object.entries(supplyPressureLabels).map(([k, v]) => (
            <span key={k} className={cn("font-medium px-1.5 py-0.5 rounded-full border", v.color)}>{v.label}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Grade</span>
          <span className={cn("font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels.A.color)}>A</span>
          <span className={cn("font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels.B.color)}>B</span>
          <span className={cn("font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels.C.color)}>C</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Betrouwb.</span>
          <span className={cn("font-medium px-1.5 py-0.5 rounded-full border", reliabilityLabels.high.color)}>Hoog</span>
          <span className={cn("font-medium px-1.5 py-0.5 rounded-full border", reliabilityLabels.medium.color)}>Medium</span>
          <span className={cn("font-medium px-1.5 py-0.5 rounded-full border", reliabilityLabels.low.color)}>Laag</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wide">Beschikb.:</span>
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

export default MarketSupplyPanel;
