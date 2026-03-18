import { useState, useMemo, Fragment } from "react";
import {
  ShoppingCart, Package, AlertTriangle, CheckCircle2,
  TrendingDown, TrendingUp, ArrowUpDown, Search, ChevronDown,
  ChevronRight, Star, Shield, Clock, Zap, Eye, Users, X,
  Wifi, WifiOff, AlertCircle, Settings2, RotateCcw,
  ShoppingBag, Ruler, Flower2,
  BarChart3, BookOpen, ShieldCheck, ArrowRight, Activity, ShieldAlert, Warehouse,
  Layers, Repeat, Shuffle, UserCheck, Loader2, Link2,
} from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { cn } from "@/lib/utils";
import DayFilter from "@/components/procurement-cockpit-v1/DayFilter";
import {
  statusLabels,
  shopStatuses,
  shopSyncStatusLabels,
  type ShopStatus,
} from "@/components/procurement-cockpit-v1/procurement-cockpit-v1-data";
import { useProcurementSnapshot, type ProcurementSnapshotRow, type SnapshotStatusLabel } from "@/hooks/useProcurementSnapshot";
import {
  designAdvisoryData,
  designAdviceLabels,
  markupAdviceLabels,
  priceCheckData,
  priceCheckStatusLabels,
  marketSupplyData,
} from "@/components/procurement-cockpit-v1/procurement-extended-data";
import {
  inventoryPressureData,
  inventoryPressureLabels,
  substituteSuggestions,
  substituteStatusLabels,
  purchaseMixSuggestions,
  supplierQualityData,
  supplierGradeLabels,
  effectivePriceData,
} from "@/components/procurement-cockpit-v1/procurement-intelligence-data";
import {
  supplierIntelligenceData,
  supplierAdviceLabels,
  reliabilityLabels,
  supplierMixProposals,
} from "@/components/procurement-cockpit-v1/supplier-intelligence-data";
// Upload functionality removed — dekking computed from static data
import MarketSupplyPanel from "@/components/procurement-cockpit-v1/MarketSupplyPanel";


import {
  tradeRegistry, seasonalityLabels, riskLabels, availabilityLabels,
} from "@/components/procurement-cockpit-v1/procurement-extended-data";

/* ── helpers ── */
const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;
const safe = (v: number | null | undefined, fallback = "—") => v != null ? v : fallback;

const signalSeverityColors = {
  info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};
const pctColor = (v: number) => v <= -3 ? "text-accent" : v >= 3 ? "text-destructive" : "text-foreground/70";
const urgencyBadge = (u: string) =>
  u === "high" ? "bg-destructive/10 text-destructive border-destructive/20"
  : u === "medium" ? "bg-muted text-muted-foreground border-border"
  : "bg-muted/50 text-muted-foreground/70 border-border/50";
const scoreColor = (s: number) => s >= 95 ? "text-accent" : s >= 85 ? "text-muted-foreground" : "text-destructive";
const scoreBg = (s: number) => s >= 95 ? "bg-accent/8 border-accent/15" : s >= 85 ? "bg-muted/50 border-border" : "bg-destructive/8 border-destructive/15";

const shopIcon = (status: ShopStatus["status"]) => {
  switch (status) {
    case "connected": return <Wifi className="w-3 h-3 text-accent" />;
    case "delayed": return <Clock className="w-3 h-3 text-muted-foreground" />;
    case "outdated": return <AlertCircle className="w-3 h-3 text-muted-foreground" />;
    case "error": return <WifiOff className="w-3 h-3 text-destructive" />;
    default: return <WifiOff className="w-3 h-3 text-muted-foreground" />;
  }
};

type SortKey = keyof ProcurementRow;
type SortDir = "asc" | "desc";
type CockpitTab = "inkooplijst" | "marktaanbod";

const tabItems: { id: CockpitTab; label: string; icon: React.ReactNode }[] = [
  { id: "inkooplijst", label: "Inkooplijst", icon: <ShoppingCart className="w-3.5 h-3.5" /> },
  { id: "marktaanbod", label: "Marktaanbod", icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

const ProcurementCockpitV1 = () => {
  const [activeTab, setActiveTab] = useState<CockpitTab>("inkooplijst");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("urgency");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [familyFilter, setFamilyFilter] = useState<string | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<string | null>(null);
  const [buyerFilter, setBuyerFilter] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date());
  const [dateTo, setDateTo] = useState<Date | undefined>(() => { const d = new Date(); d.setDate(d.getDate() + 6); return d; });
  const [shopPopup, setShopPopup] = useState(false);
  const [showViewSettings, setShowViewSettings] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [largeView, setLargeView] = useState(false);
  const [showKPIs, setShowKPIs] = useState(true);
  const [showPriceComparison, setShowPriceComparison] = useState(true);
  const [showSupplierOffers, setShowSupplierOffers] = useState(true);
  const [showMarketContext, setShowMarketContext] = useState(true);

  // Compute dekking status per row
  type DekkingStatus = "gedekt" | "deels_gedekt" | "niet_gedekt" | "overschot";
  const getDekkingStatus = (p: ProcurementRow): DekkingStatus => {
    if (p.available_stock >= p.required_volume && p.open_buy_need === 0) return p.free_stock > p.required_volume ? "overschot" : "gedekt";
    if (p.free_stock > 0 && p.open_buy_need > 0) return "deels_gedekt";
    return "niet_gedekt";
  };
  const dekkingConfig: Record<DekkingStatus, { label: string; color: string }> = {
    gedekt: { label: "Volledig", color: "text-accent bg-accent/10 border-accent/20" },
    deels_gedekt: { label: "Deels", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
    niet_gedekt: { label: "Gedekt", color: "text-destructive bg-destructive/10 border-destructive/20" },
    overschot: { label: "Overschot", color: "text-muted-foreground bg-muted/50 border-border" },
  };

  const allColumns = [
    { key: "required_volume", label: "Benodigd" },
    { key: "quality_class", label: "Kwaliteit" },
    { key: "effective_price_col", label: "Eff. Prijs" },
    { key: "historical_price", label: "Hist. Prijs" },
    { key: "offer_price", label: "Offerteprijs" },
    { key: "advised_price", label: "Adviesprijs" },
    { key: "market_price", label: "Marktprijs" },
    { key: "variance_vs_calculated", label: "Δ Hist." },
    
    { key: "markup_advice", label: "Markup/Down" },
  ] as const;
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(allColumns.map(c => c.key)));

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const families = useMemo(() => [...new Set(procurementRows.map(p => p.product_family))].sort(), []);
  const allBuyers = useMemo(() => [...new Set(procurementRows.map(p => p.buyer))].sort(), []);

  const urgencyOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };

  const filtered = useMemo(() => {
    let list = procurementRows.filter(p => {
      if (search && !p.product.toLowerCase().includes(search.toLowerCase()) && !p.product_family.toLowerCase().includes(search.toLowerCase())) return false;
      if (familyFilter && p.product_family !== familyFilter) return false;
      if (urgencyFilter && p.urgency !== urgencyFilter) return false;
      if (buyerFilter && p.buyer !== buyerFilter) return false;
      return true;
    });
    list.sort((a, b) => {
      if (sortKey === "urgency") {
        return sortDir === "asc" ? (urgencyOrder[a.urgency] ?? 0) - (urgencyOrder[b.urgency] ?? 0) : (urgencyOrder[b.urgency] ?? 0) - (urgencyOrder[a.urgency] ?? 0);
      }
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [search, sortKey, sortDir, familyFilter, urgencyFilter, buyerFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const resetFilters = () => {
    setSearch("");
    setFamilyFilter(null);
    setUrgencyFilter(null);
    setBuyerFilter(null);
    setDateFrom(new Date());
    const end = new Date(); end.setDate(end.getDate() + 6);
    setDateTo(end);
  };

  const hasActiveFilters = search || familyFilter || urgencyFilter || buyerFilter;

  /* ── KPI totals ── */
  const totals = useMemo(() => {
    const rows = procurementRows;
    const avgOffer = rows.reduce((s, p) => s + p.offer_price, 0) / rows.length;
    const avgHistorical = rows.reduce((s, p) => s + p.historical_price, 0) / rows.length;
    return {
      required: rows.reduce((s, p) => s + (p.required_volume - p.available_stock), 0),
      freeStock: rows.reduce((s, p) => s + p.free_stock, 0),
      reserved: rows.reduce((s, p) => s + p.reserved_stock, 0),
      openBuy: rows.reduce((s, p) => s + p.open_buy_need, 0),
      avgOfferPrice: avgOffer,
      avgHistoricalPrice: avgHistorical,
      offerVsHistorical: ((avgOffer - avgHistorical) / avgHistorical * 100),
      actionNeeded: rows.filter(p => p.urgency === "high" || (p.open_buy_need > 0 && p.free_stock === 0)).length,
    };
  }, []);


  /* ── Helpers for extended row data ── */
  const getDesignAdvice = (productId: string) => designAdvisoryData.find(d => d.product_id === productId);
  const getPriceCheck = (productId: string) => priceCheckData.find(p => p.product_id === productId);
  const getMarketSupply = (productFamily: string, product: string) => marketSupplyData.find(m => m.product === product || m.product_family === productFamily);
  const getInventoryPressure = (productId: string) => inventoryPressureData.find(ip => ip.product_id === productId);
  const getSubstitute = (productId: string) => substituteSuggestions.find(s => s.product_id === productId);
  const getPurchaseMix = (productId: string) => purchaseMixSuggestions.find(pm => pm.product_id === productId);
  const getSupplierQuality = (product: string) => supplierQualityData.find(sq => sq.product === product);
  const getEffectivePrice = (product: string) => effectivePriceData.find(ep => ep.product === product);
  const getSupplierIntel = (productId: string) => supplierIntelligenceData.find(si => si.product_id === productId);
  const getSupplierMix = (productId: string) => supplierMixProposals.find(sm => sm.product_id === productId);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground tracking-tight">Procurement Cockpit</h1>
          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border">
            V0.5
          </span>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            BETA
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-4 w-px bg-border" />
          {/* Shop status */}
          <div className="relative">
            <button onClick={() => setShopPopup(!shopPopup)} className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
              <Wifi className="w-3.5 h-3.5 text-accent" />
              Koppelingen ({shopStatuses.filter(s => s.status === "connected").length}/{shopStatuses.length})
            </button>
            {shopPopup && (
              <div className="absolute right-0 top-full mt-1 z-50 w-80 rounded-xl border border-border bg-card shadow-lg p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">Shop Sync Status</span>
                  <button onClick={() => setShopPopup(false)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                </div>
                {shopStatuses.map(s => (
                  <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg border border-border/50 bg-background">
                    {shopIcon(s.status)}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-foreground truncate">{s.name}</div>
                      <div className="text-[9px] text-muted-foreground">{s.sync_message}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={cn("text-[9px] font-mono font-semibold", shopSyncStatusLabels[s.status].color)}>{shopSyncStatusLabels[s.status].label}</div>
                      <div className="text-[8px] text-muted-foreground">{s.offers_count} aanbiedingen</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* View settings */}
          <div className="relative">
            <button onClick={() => setShowViewSettings(!showViewSettings)} className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors">
              <Settings2 className="w-3.5 h-3.5" /> Weergave
            </button>
            {showViewSettings && (
              <div className="absolute right-0 top-full mt-1 z-50 w-64 rounded-xl border border-border bg-card shadow-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Weergave</span>
                  <button onClick={() => setShowViewSettings(false)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={compactView} onChange={e => setCompactView(e.target.checked)} className="rounded border-border" />
                  <span className="text-[11px] text-foreground">Compacte weergave</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={largeView} onChange={e => setLargeView(e.target.checked)} className="rounded border-border" />
                  <span className="text-[11px] text-foreground">Grote weergave</span>
                </label>
                <div className="border-t border-border pt-2 space-y-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Secties</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showKPIs} onChange={e => setShowKPIs(e.target.checked)} className="rounded border-border" />
                    <span className="text-[11px] text-foreground">Kop informatie (KPI's)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showPriceComparison} onChange={e => setShowPriceComparison(e.target.checked)} className="rounded border-border" />
                    <span className="text-[11px] text-foreground">Prijsvergelijking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showSupplierOffers} onChange={e => setShowSupplierOffers(e.target.checked)} className="rounded border-border" />
                    <span className="text-[11px] text-foreground">Leveranciersaanbod</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showMarketContext} onChange={e => setShowMarketContext(e.target.checked)} className="rounded border-border" />
                    <span className="text-[11px] text-foreground">Markt & Design context</span>
                  </label>
                </div>
                <div className="border-t border-border pt-2 space-y-1.5">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Kolommen</span>
                  {allColumns.map(c => (
                    <label key={c.key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={visibleColumns.has(c.key)} onChange={() => toggleColumn(c.key)} className="rounded border-border" />
                      <span className="text-[11px] text-foreground">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tab navigation + Date filter on one line ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {tabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-semibold px-4 py-2 rounded-lg border transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-card text-muted-foreground border-border hover:border-primary/20 hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <DayFilter dateFrom={dateFrom} dateTo={dateTo} onDateFromChange={setDateFrom} onDateToChange={setDateTo} />
        </div>
      </div>

      {/* ── TAB: Inkooplijst ── */}
      {activeTab === "inkooplijst" && (
        <>





          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek product..." className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <select value={familyFilter || ""} onChange={e => setFamilyFilter(e.target.value || null)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer">
              <option value="">Alle families</option>
              {families.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <select value={buyerFilter || ""} onChange={e => setBuyerFilter(e.target.value || null)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer">
              <option value="">Alle inkopers</option>
              {allBuyers.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <div className="flex gap-1">
              {(["high", "medium", "low"] as const).map(u => (
                <button key={u} onClick={() => setUrgencyFilter(urgencyFilter === u ? null : u)} className={cn("text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors font-medium", urgencyFilter === u ? urgencyBadge(u) : "border-border text-muted-foreground hover:bg-muted")}>
                  {u === "high" ? "Urgent" : u === "medium" ? "Medium" : "Laag"}
                </button>
              ))}
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Procurement List */}
          <IHSectionShell icon={ShoppingCart} title="Inkooplijst" subtitle="Behoefte vs voorraad · Klik op een rij voor detail" badge={`${filtered.length}`}>
            <div className="overflow-x-auto -mx-5">
              <table className={cn("w-full", largeView ? "text-[14px]" : "text-[11px]")}>
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-2 py-2.5 w-6"></th>
                    <th className="px-2 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Dekking</th>
                    {([
                      ["product", "Product"],
                      ["required_volume", "Benodigd"],
                      ["quality_class", "Kwal."],
                      ["effective_price_col", "Eff. Prijs"],
                      ["historical_price", "Hist. Prijs"],
                      ["offer_price", "Offerteprijs"],
                      ["advised_price", "Adviesprijs"],
                      ["market_price", "Marktprijs"],
                      ["variance_vs_calculated", "Δ Hist."],
                      
                      ["markup_advice", "Markup/Down"],
                    ] as [string, string][]).filter(([key]) => key === "product" || visibleColumns.has(key)).map(([key, label]) => (
                      <th key={key} className="px-3 py-2.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap" onClick={() => key !== "design_advice" && key !== "markup_advice" && key !== "market_price" && toggleSort(key as SortKey)}>
                        <span className="inline-flex items-center gap-0.5">
                          {label}
                          {sortKey === key && <ArrowUpDown className="w-3 h-3" />}
                        </span>
                      </th>
                    ))}
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Actie</th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap" onClick={() => toggleSort("urgency")}>
                      <span className="inline-flex items-center gap-0.5">
                        Urgentie
                        {sortKey === "urgency" && <ArrowUpDown className="w-3 h-3" />}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const isExpanded = expandedId === p.id;
                    const offers = supplierOffers[p.id] || [];
                    
                    const rowPy = compactView ? "py-2" : largeView ? "py-4" : "py-3";
                    const advisory = getDesignAdvice(p.id);
                    const priceCheck = getPriceCheck(p.id);
                    const market = getMarketSupply(p.product_family, p.product);
                    const invPressure = getInventoryPressure(p.id);
                    const subSuggestion = getSubstitute(p.id);
                    const purchaseMix = getPurchaseMix(p.id);
                    const supplierQuality = getSupplierQuality(p.product);
                    const effectivePrice = getEffectivePrice(p.product);
                    const supplierIntel = getSupplierIntel(p.id);
                    const supplierMix = getSupplierMix(p.id);

                    return (
                      <Fragment key={p.id}>
                        <tr
                          onClick={() => setExpandedId(isExpanded ? null : p.id)}
                          className={cn(
                            "border-b border-border/40 cursor-pointer transition-colors",
                            isExpanded ? "bg-muted/30" : "hover:bg-muted/10"
                          )}
                        >
                          <td className={cn("px-2", rowPy, "text-muted-foreground")}>
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </td>
                          <td className={cn("px-2", rowPy)}>
                            {(() => {
                              const dekking = getDekkingStatus(p);
                              const dc = dekkingConfig[dekking];
                              const dekkingPct = p.required_volume > 0 ? Math.min(100, Math.round((p.available_stock / p.required_volume) * 100)) : 100;
                              return (
                                <div className="flex items-center gap-1.5">
                                  <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap", dc.color)}>{dc.label}</span>
                                  <div className="w-10 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                                    <div className={cn("h-full rounded-full", dekkingPct >= 100 ? "bg-accent" : dekkingPct >= 50 ? "bg-yellow-500" : "bg-destructive")} style={{ width: `${dekkingPct}%` }} />
                                  </div>
                                  <span className="text-[8px] font-mono text-muted-foreground">{dekkingPct}%</span>
                                </div>
                              );
                            })()}
                          </td>
                          <td className={cn("px-3", rowPy)}>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground text-[12px]">{p.product}</span>
                              <span className="text-[10px] font-mono font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">{p.stem_length}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{p.product_family}</div>
                          </td>
                          
                          {visibleColumns.has("required_volume") && <td className={cn("px-3", rowPy, "font-mono text-foreground")}>{fmt(p.required_volume - p.available_stock)}</td>}
                          {visibleColumns.has("quality_class") && (
                            <td className={cn("px-3", rowPy)}>
                              {supplierIntel && (
                                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels[supplierIntel.supplier_class].color)}>
                                  {supplierIntel.supplier_class}
                                </span>
                              )}
                            </td>
                          )}
                          {visibleColumns.has("effective_price_col") && (
                            <td className={cn("px-3", rowPy, "font-mono text-foreground")}>
                              {supplierIntel ? fmtPrice(supplierIntel.effective_price) : "—"}
                            </td>
                          )}
                          {visibleColumns.has("historical_price") && <td className={cn("px-3", rowPy, "font-mono text-muted-foreground")}>{fmtPrice(p.historical_price)}</td>}
                          {visibleColumns.has("offer_price") && <td className={cn("px-3", rowPy, "font-mono text-foreground")}>{fmtPrice(p.offer_price)}</td>}
                          {visibleColumns.has("advised_price") && <td className={cn("px-3", rowPy, "font-mono text-muted-foreground")}>{fmtPrice(p.advised_price)}</td>}
                          {visibleColumns.has("market_price") && (
                            <td className={cn("px-3", rowPy, "font-mono text-muted-foreground")}>
                              {market ? fmtPrice(market.best_price) : "—"}
                            </td>
                          )}
                          {visibleColumns.has("variance_vs_calculated") && <td className={cn("px-3", rowPy, "font-mono", pctColor(p.variance_vs_calculated))}>{p.variance_vs_calculated > 0 ? "+" : ""}{p.variance_vs_calculated.toFixed(1)}%</td>}
                          
                          {visibleColumns.has("markup_advice") && (
                            <td className={cn("px-3", rowPy)}>
                              {advisory && advisory.markup_advice !== "none" && (
                                <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border", markupAdviceLabels[advisory.markup_advice].color)}>
                                  {markupAdviceLabels[advisory.markup_advice].label}
                                </span>
                              )}
                            </td>
                          )}
                          <td className={cn("px-3", rowPy)}>
                            <button disabled className="text-[9px] font-medium px-2.5 py-1 rounded-lg border border-border text-muted-foreground/40 bg-muted/20 cursor-not-allowed flex items-center gap-1">
                              <ShoppingBag className="w-2.5 h-2.5" /> Koop
                            </button>
                          </td>
                          <td className={cn("px-3", rowPy)}>
                            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", urgencyBadge(p.urgency))}>
                              {p.urgency === "high" ? "Hoog" : p.urgency === "medium" ? "Medium" : "Laag"}
                            </span>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-b border-border/40 bg-muted/10">
                            <td colSpan={20} className="px-5 py-5">
                              <div className="space-y-5">
                                {/* Dekking bar */}
                                {(() => {
                                  const dekkingPct = p.required_volume > 0 ? Math.min(100, Math.round((p.available_stock / p.required_volume) * 100)) : 100;
                                  const dekking = getDekkingStatus(p);
                                  const dc = dekkingConfig[dekking];
                                  return (
                                    <div className="flex items-center gap-3">
                                      <span className="text-[10px] font-medium text-muted-foreground w-14">Dekking</span>
                                      <div className="flex-1 max-w-xs bg-muted rounded-full h-2 overflow-hidden">
                                        <div className={cn("h-full rounded-full transition-all", dekkingPct >= 100 ? "bg-accent" : dekkingPct >= 50 ? "bg-yellow-500" : "bg-destructive")} style={{ width: `${dekkingPct}%` }} />
                                      </div>
                                      <span className={cn("text-[11px] font-mono font-bold", dekkingPct >= 100 ? "text-accent" : dekkingPct >= 50 ? "text-yellow-500" : "text-destructive")}>{dekkingPct}%</span>
                                      <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", dc.color)}>{dc.label}</span>
                                    </div>
                                  );
                                })()}

                                {/* Context cards — Demand & Price */}
                                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                                  <div className="rounded-lg border border-border bg-background p-3">
                                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Behoefte</span>
                                    <div className="text-sm font-bold font-mono mt-0.5 text-foreground">{fmt(p.required_volume)}</div>
                                  </div>
                                  <div className="rounded-lg border border-border bg-background p-3">
                                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Voorraad</span>
                                    <div className="text-sm font-bold font-mono mt-0.5 text-foreground">{fmt(p.available_stock)}</div>
                                    <div className="text-[9px] text-muted-foreground">Vrij: {fmt(p.free_stock)} · Gereserv: {fmt(p.reserved_stock)}</div>
                                  </div>
                                  <div className={cn("rounded-lg border bg-background p-3", p.open_buy_need > 0 ? "border-destructive/30" : "border-border")}>
                                    <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Nog nodig</span>
                                    <div className={cn("text-sm font-bold font-mono mt-0.5", p.open_buy_need > 0 ? "text-destructive" : "text-accent")}>{fmt(p.open_buy_need)}</div>
                                  </div>
                                  {/* Price comparison cards inline */}
                                  {showPriceComparison && [
                                    { label: "Hist. prijs", value: p.historical_price, baseline: true },
                                    { label: "Offerteprijs", value: p.offer_price },
                                    { label: "Adviesprijs", value: p.advised_price },
                                    ...(market ? [{ label: "Marktprijs", value: market.best_price }] : []),
                                  ].map(pc => {
                                    const diff = p.historical_price > 0 ? ((pc.value - p.historical_price) / p.historical_price * 100) : 0;
                                    return (
                                      <div key={pc.label} className={cn("rounded-lg border border-border bg-background p-3", pc.baseline && "ring-1 ring-primary/20")}>
                                        <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{pc.label}</span>
                                        <div className="text-sm font-bold font-mono mt-0.5 text-foreground">{fmtPrice(pc.value)}</div>
                                        {!pc.baseline && <div className={cn("text-[9px] font-mono", pctColor(diff))}>{diff > 0 ? "+" : ""}{diff.toFixed(1)}%</div>}
                                        {pc.baseline && <div className="text-[9px] font-mono text-muted-foreground">referentie</div>}
                                      </div>
                                    );
                                  })}
                                </div>


                                {/* Klanten & Producten */}
                                <div className="rounded-lg border border-border bg-background p-4">
                                  <h4 className="text-[11px] font-semibold text-foreground flex items-center gap-1.5 mb-3">
                                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                    Klanten & Producten ({p.customer_product_lines.length})
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                    {p.customer_product_lines.map((cpl, i) => (
                                      <div key={i} className="flex items-center justify-between text-[10px] py-1.5 border-b border-border/30 last:border-0">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <span className="font-semibold text-foreground">{cpl.customer}</span>
                                          <span className="text-muted-foreground">–</span>
                                          <span className="text-foreground">{cpl.product_name}</span>
                                          <span className="font-mono text-muted-foreground">{cpl.stem_length}</span>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                                          <span className="font-mono text-muted-foreground">{fmt(cpl.quantity)} st</span>
                                          <span className="font-mono text-muted-foreground/70 text-[9px]">{cpl.departure_date}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Leveranciersaanbod */}
                                {showSupplierOffers && <div>
                                  <h4 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5 text-primary" />
                                    Leveranciersaanbod ({offers.length})
                                  </h4>
                                  {offers.length === 0 ? (
                                    <p className="text-[11px] text-muted-foreground italic">Geen leveranciersdata beschikbaar.</p>
                                  ) : (
                                    <div className="overflow-x-auto rounded-lg border border-border">
                                      <table className="w-full text-[11px]">
                                        <thead>
                                          <tr className="border-b border-border">
                                            {["Leverancier", "Prijs", "Aantal", "Levering", "Kwaliteit", "Betrouwb.", "Prijsstab.", "Δ Hist.", "Δ Offerte", ""].map(h => (
                                              <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {offers.map(o => {
                                            const isPreferred = o.supplier_name === p.preferred_supplier;
                                            return (
                                            <tr key={o.supplier_name} className={cn("border-b border-border/30 transition-colors", isPreferred ? "bg-accent/5 ring-1 ring-inset ring-accent/20" : "hover:bg-muted/10")}>
                                              <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                                                <span className="flex items-center gap-1.5">
                                                  {o.supplier_name}
                                                  {isPreferred && <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">Voorkeur</span>}
                                                </span>
                                              </td>
                                              <td className="px-3 py-2.5 font-mono text-foreground">{fmtPrice(o.offer_price)}</td>
                                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{fmt(o.offer_quantity)}</td>
                                              <td className="px-3 py-2.5 text-muted-foreground">{o.delivery_timing}</td>
                                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{o.supplier_quality_score}%</td>
                                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{o.supplier_reliability_score}%</td>
                                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{o.price_stability_index}%</td>
                                              <td className={cn("px-3 py-2.5 font-mono", pctColor(o.variance_vs_historical))}>{o.variance_vs_historical > 0 ? "+" : ""}{o.variance_vs_historical.toFixed(1)}%</td>
                                              <td className={cn("px-3 py-2.5 font-mono", pctColor(o.variance_vs_offer))}>{o.variance_vs_offer > 0 ? "+" : ""}{o.variance_vs_offer.toFixed(1)}%</td>
                                              <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-1.5">
                                                  <button className="text-[10px] font-medium text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/50 rounded-lg px-2.5 py-1 transition-colors">Bekijk</button>
                                                  <button disabled className="text-[10px] font-medium text-muted-foreground/40 border border-border rounded-lg px-2.5 py-1 cursor-not-allowed bg-muted/20">Koop</button>
                                                </div>
                                              </td>
                                            </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>}








                                {/* Substituut opties (kandidaten + mix samengevoegd) */}
                                {((subSuggestion && subSuggestion.candidates.length > 0) || (purchaseMix && purchaseMix.has_mix)) && <div>
                                  <h4 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
                                    <Repeat className="w-3.5 h-3.5 text-primary" />
                                    Substituut opties ({subSuggestion ? subSuggestion.candidates.length : 0})
                                  </h4>

                                    {subSuggestion && subSuggestion.candidates.length > 0 && (
                                      <div className="space-y-1">
                                        {subSuggestion.candidates.map((c, i) => (
                                          <div key={i} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-muted/10 border border-border/30">
                                            <div className="flex items-center gap-2">
                                              <span className="font-medium text-foreground">{c.name}</span>
                                              <div className="flex gap-0.5">
                                                {c.family_match && <span className="text-[7px] px-1 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Fam</span>}
                                                {c.color_compatible && <span className="text-[7px] px-1 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Klr</span>}
                                                {c.length_compatible && <span className="text-[7px] px-1 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Len</span>}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="font-mono text-muted-foreground">{fmtPrice(c.price)}</span>
                                              <span className={cn("text-[8px] font-mono font-bold", c.confidence >= 80 ? "text-accent" : c.confidence >= 60 ? "text-yellow-500" : "text-muted-foreground")}>{c.confidence}%</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                </div>}

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
           </IHSectionShell>



        </>
      )}

      {/* ── TAB: Marktaanbod ── */}
      {activeTab === "marktaanbod" && (
        <>
          <IHSectionShell icon={BarChart3} title="Marktaanbod Monitor" subtitle="Actueel marktaanbod, prijzen, aanbodsdruk en 52-weken overzicht per product" badge={`${marketSupplyData.length} producten`}>
            <MarketSupplyPanel familyFilter={familyFilter} onFamilyFilterChange={setFamilyFilter} families={families} />
          </IHSectionShell>
        </>
      )}

    </div>
  );
};

export default ProcurementCockpitV1;
