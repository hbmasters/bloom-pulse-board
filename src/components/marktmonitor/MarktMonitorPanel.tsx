import { useState, useMemo } from "react";
import {
  Search, TrendingUp, TrendingDown, Minus, ChevronRight, Filter,
  Package, AlertTriangle, Target, BarChart3, ShieldAlert, ArrowDown, ArrowUp,
  Flower2, SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  marktMonitorData,
  trendLabels,
  confidenceLabels,
  buyAdviceLabels,
  productFamilies,
  DEFAULT_WEIGHTS,
  type MarktMonitorProduct,
  type PriceTrend,
  type Confidence,
  type BuyAdvice,
} from "./marktmonitor-data";
import MarktMonitorDetailDrawer from "./MarktMonitorDetailDrawer";

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;
const fmtPct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

type SortKey = "product" | "current_price" | "price_vs_last_week" | "weighted_advice" | "delta_vs_advice" | "availability";
type SortDir = "asc" | "desc";

const TrendIcon = ({ trend }: { trend: PriceTrend }) => {
  if (trend === "rising") return <TrendingUp className="w-3 h-3" />;
  if (trend === "falling") return <TrendingDown className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
};

const MarktMonitorPanel = () => {
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState<string | null>(null);
  const [trendFilter, setTrendFilter] = useState<PriceTrend | null>(null);
  const [adviceFilter, setAdviceFilter] = useState<BuyAdvice | null>(null);
  const [shortageOnly, setShortageOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("delta_vs_advice");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedProduct, setSelectedProduct] = useState<MarktMonitorProduct | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = marktMonitorData.filter(m => {
      if (search && !m.product.toLowerCase().includes(search.toLowerCase()) && !m.product_family.toLowerCase().includes(search.toLowerCase())) return false;
      if (familyFilter && m.product_family !== familyFilter) return false;
      if (trendFilter && m.market_trend !== trendFilter) return false;
      if (adviceFilter && m.buy_advice !== adviceFilter) return false;
      if (shortageOnly && m.delta_vs_advice <= 0) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [search, familyFilter, trendFilter, adviceFilter, shortageOnly, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  /* Dashboard KPIs */
  const kpis = useMemo(() => {
    const data = marktMonitorData;
    return {
      totalProducts: data.length,
      totalShortage: data.reduce((s, m) => s + Math.max(0, m.delta_vs_advice), 0),
      avgPriceTrend: +(data.reduce((s, m) => s + m.price_vs_last_week, 0) / data.length).toFixed(1),
      criticalCount: data.filter(m => m.buy_advice === "risk_shortage" || m.buy_advice === "risk_expensive").length,
      buyNowCount: data.filter(m => m.buy_advice === "buy_now").length,
      chanceCount: data.filter(m => m.buy_advice === "chance_drop").length,
      totalAdvised: data.reduce((s, m) => s + m.weighted_advice, 0),
      totalPurchased: data.reduce((s, m) => s + m.current_purchased, 0),
    };
  }, []);

  const hasActiveFilters = search || familyFilter || trendFilter || adviceFilter || shortageOnly;

  return (
    <div className="space-y-4">
      {/* Dashboard KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Producten", value: `${kpis.totalProducts}`, sub: "in monitor", variant: "default" as const },
          { label: "Totaal advies", value: fmt(kpis.totalAdvised), sub: "stelen", variant: "default" as const },
          { label: "Ingekocht", value: fmt(kpis.totalPurchased), sub: "stelen", variant: "default" as const },
          { label: "Tekort", value: fmt(kpis.totalShortage), sub: "stelen", variant: kpis.totalShortage > 0 ? "critical" as const : "ok" as const },
          { label: "Gem. trend", value: fmtPct(kpis.avgPriceTrend), sub: "WoW", variant: kpis.avgPriceTrend > 3 ? "critical" as const : kpis.avgPriceTrend < -1 ? "ok" as const : "warning" as const },
          { label: "Risico", value: `${kpis.criticalCount}`, sub: "producten", variant: kpis.criticalCount > 0 ? "critical" as const : "ok" as const },
          { label: "Koop nu", value: `${kpis.buyNowCount}`, sub: "producten", variant: kpis.buyNowCount > 0 ? "critical" as const : "default" as const },
          { label: "Kans", value: `${kpis.chanceCount}`, sub: "prijsdaling", variant: kpis.chanceCount > 0 ? "ok" as const : "default" as const },
        ].map(k => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-3 flex flex-col gap-0.5">
            <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-wide">{k.label}</span>
            <span className={cn("text-base font-bold font-mono",
              k.variant === "critical" ? "text-destructive" : k.variant === "ok" ? "text-accent" : k.variant === "warning" ? "text-yellow-500" : "text-foreground"
            )}>{k.value}</span>
            <span className="text-[8px] text-muted-foreground">{k.sub}</span>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek product..." className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        <select value={familyFilter || ""} onChange={e => setFamilyFilter(e.target.value || null)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer">
          <option value="">Alle families</option>
          {productFamilies.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <button onClick={() => setShowFilters(!showFilters)} className={cn(
          "flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors",
          showFilters ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:text-foreground"
        )}>
          <SlidersHorizontal className="w-3 h-3" /> Filters
        </button>

        {hasActiveFilters && (
          <button onClick={() => { setSearch(""); setFamilyFilter(null); setTrendFilter(null); setAdviceFilter(null); setShortageOnly(false); }}
            className="text-[10px] font-medium px-2 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground">
            Reset
          </button>
        )}
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-muted/20">
          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide mr-1">Trend:</span>
          {(["rising", "stable", "falling"] as PriceTrend[]).map(t => (
            <button key={t} onClick={() => setTrendFilter(trendFilter === t ? null : t)}
              className={cn("text-[10px] font-medium px-2 py-1 rounded-full border transition-colors",
                trendFilter === t ? trendLabels[t].color + " bg-muted border-current" : "text-muted-foreground border-border hover:text-foreground"
              )}>
              {trendLabels[t].label}
            </button>
          ))}

          <div className="w-px h-4 bg-border mx-1" />

          <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide mr-1">Advies:</span>
          {(["buy_now", "risk_shortage", "risk_expensive", "chance_drop", "wait", "buy_phased"] as BuyAdvice[]).map(a => (
            <button key={a} onClick={() => setAdviceFilter(adviceFilter === a ? null : a)}
              className={cn("text-[10px] font-medium px-2 py-1 rounded-full border transition-colors",
                adviceFilter === a ? buyAdviceLabels[a].color : "text-muted-foreground border-border hover:text-foreground"
              )}>
              {buyAdviceLabels[a].label}
            </button>
          ))}

          <div className="w-px h-4 bg-border mx-1" />

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={shortageOnly} onChange={e => setShortageOnly(e.target.checked)} className="rounded border-border w-3 h-3" />
            <span className="text-[10px] font-medium text-muted-foreground">Alleen tekorten</span>
          </label>
        </div>
      )}

      {/* Main table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {[
                { key: "product" as SortKey, label: "Product", w: "" },
                { key: "current_price" as SortKey, label: "Prijs", w: "" },
                { key: null, label: "Δ dag", w: "" },
                { key: "price_vs_last_week" as SortKey, label: "Δ week", w: "" },
                { key: null, label: "7d gem.", w: "" },
                { key: null, label: "30d gem.", w: "" },
                { key: null, label: "Trend", w: "" },
                { key: null, label: "Hist. stelen", w: "" },
                { key: null, label: "Progn. stelen", w: "" },
                { key: null, label: "Markt stelen", w: "" },
                { key: "weighted_advice" as SortKey, label: "Advies", w: "" },
                { key: null, label: "Ingekocht", w: "" },
                { key: "delta_vs_advice" as SortKey, label: "Δ Advies", w: "" },
                { key: null, label: "Confidence", w: "" },
                
                { key: null, label: "", w: "w-6" },
              ].map((h, i) => (
                <th key={i} className={cn("px-2 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap", h.w)}
                  onClick={h.key ? () => toggleSort(h.key!) : undefined}
                  style={h.key ? { cursor: "pointer" } : undefined}>
                  <span className="flex items-center gap-1">
                    {h.label}
                    {h.key && sortKey === h.key && (sortDir === "asc" ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const trend = trendLabels[m.market_trend];
              const conf = confidenceLabels[m.confidence];
              const advice = buyAdviceLabels[m.buy_advice];
              const isShortage = m.delta_vs_advice > 0;
              const isOverstock = m.delta_vs_advice < 0;

              return (
                <tr key={m.id}
                  className="border-b border-border/30 hover:bg-muted/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedProduct(m)}>
                  {/* Product */}
                  <td className="px-2 py-2.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground whitespace-nowrap">{m.product}</span>
                      <span className="text-[9px] text-muted-foreground">{m.product_family}{m.quality ? ` · ${m.quality}` : ""}</span>
                    </div>
                  </td>
                  {/* Current price */}
                  <td className="px-2 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(m.current_price)}</td>
                  {/* Δ day */}
                  <td className={cn("px-2 py-2.5 font-mono text-[10px]", m.price_vs_yesterday > 1 ? "text-destructive" : m.price_vs_yesterday < -1 ? "text-accent" : "text-muted-foreground")}>
                    {fmtPct(m.price_vs_yesterday)}
                  </td>
                  {/* Δ week */}
                  <td className={cn("px-2 py-2.5 font-mono text-[10px]", m.price_vs_last_week > 3 ? "text-destructive" : m.price_vs_last_week < -1 ? "text-accent" : "text-muted-foreground")}>
                    {fmtPct(m.price_vs_last_week)}
                  </td>
                  {/* 7d avg */}
                  <td className="px-2 py-2.5 font-mono text-muted-foreground">{fmtPrice(m.avg_price_7d)}</td>
                  {/* 30d avg */}
                  <td className="px-2 py-2.5 font-mono text-muted-foreground">{fmtPrice(m.avg_price_30d)}</td>
                  {/* Trend */}
                  <td className="px-2 py-2.5">
                    <span className={cn("flex items-center gap-1 font-medium", trend.color)}>
                      <TrendIcon trend={m.market_trend} />
                      <span className="text-[9px]">{trend.label}</span>
                    </span>
                  </td>
                  {/* History stems */}
                  <td className="px-2 py-2.5 font-mono text-foreground/80">{fmt(m.expected_history)}</td>
                  {/* Forecast stems */}
                  <td className="px-2 py-2.5 font-mono text-foreground/80">{fmt(m.expected_forecast)}</td>
                  {/* Market stems */}
                  <td className="px-2 py-2.5 font-mono text-foreground/80">{fmt(m.expected_market)}</td>
                  {/* Weighted advice */}
                  <td className="px-2 py-2.5 font-mono font-bold text-foreground">{fmt(m.weighted_advice)}</td>
                  {/* Current purchased */}
                  <td className="px-2 py-2.5 font-mono text-muted-foreground">{fmt(m.current_purchased)}</td>
                  {/* Delta */}
                  <td className="px-2 py-2.5">
                    <span className={cn("font-mono font-semibold text-[10px]",
                      isShortage ? "text-destructive" : isOverstock ? "text-accent" : "text-foreground"
                    )}>
                      {isShortage ? `+${fmt(m.delta_vs_advice)}` : isOverstock ? fmt(m.delta_vs_advice) : "0"}
                    </span>
                    {isShortage && <span className="text-[8px] text-destructive ml-1">tekort</span>}
                  </td>
                  {/* Confidence */}
                  <td className="px-2 py-2.5">
                    <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border", conf.color)}>{conf.label}</span>
                  </td>


                  {/* Arrow */}
                  <td className="px-2 py-2.5">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={14} className="px-4 py-8 text-center text-muted-foreground text-[11px]">Geen producten gevonden</td></tr>
            )}
          </tbody>
        </table>
      </div>



      {/* Weights info */}
      <div className="flex items-center gap-4 text-[9px] text-muted-foreground px-1">
        <span className="uppercase font-semibold tracking-wide">Weging:</span>
        <span>Historie {DEFAULT_WEIGHTS.history * 100}%</span>
        <span>·</span>
        <span>Prognose {DEFAULT_WEIGHTS.forecast * 100}%</span>
        <span>·</span>
        <span>Markt {DEFAULT_WEIGHTS.market * 100}%</span>
      </div>

      {/* Detail drawer */}
      {selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedProduct(null)} />
          <MarktMonitorDetailDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </>
      )}
    </div>
  );
};

export default MarktMonitorPanel;
