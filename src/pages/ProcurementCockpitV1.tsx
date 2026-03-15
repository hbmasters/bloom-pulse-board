import { useState, useMemo, Fragment } from "react";
import {
  ShoppingCart, Package, AlertTriangle, CheckCircle2,
  TrendingDown, TrendingUp, ArrowUpDown, Search, ChevronDown,
  ChevronRight, Star, Shield, Clock, Zap, Eye, Users, X,
  Wifi, WifiOff, AlertCircle, Settings2, RotateCcw,
  ShoppingBag, Ruler, Flower2,
  BarChart3, BookOpen, ShieldCheck, ArrowRight, Activity, ShieldAlert, Warehouse,
  Layers, Repeat, Shuffle, UserCheck,
} from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { cn } from "@/lib/utils";
import DayFilter from "@/components/procurement-cockpit-v1/DayFilter";
import {
  procurementRows,
  supplierOffers,
  statusLabels,
  shopStatuses,
  shopSyncStatusLabels,
  type ProcurementRow,
  type ShopStatus,
} from "@/components/procurement-cockpit-v1/procurement-cockpit-v1-data";
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
  mockDecisionRows, computeKPIs, actionLabels, actionColors,
  type ProcurementDecisionRow, type ProcurementAction,
} from "@/components/procurement-decision/procurement-decision-data";
import {
  tradeRegistry, seasonalityLabels, riskLabels, availabilityLabels,
} from "@/components/procurement-cockpit-v1/procurement-extended-data";

/* ── helpers ── */
const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;

/* ── Supply Radar signals (from V1.0) ── */
const computeRadarSignals = (rows: ProcurementDecisionRow[]) => {
  const signals: { label: string; severity: "info" | "warning" | "critical"; detail: string }[] = [];
  const highPressure = rows.filter(r => r.inventory_pressure_score > 70);
  if (highPressure.length > 0) signals.push({ label: "Voorraadveroudering", severity: "critical", detail: `${highPressure.length} producten met hoge voorraaddruk` });
  const priceUp = rows.filter(r => r.price_deviation_pct > 10);
  if (priceUp.length > 0) signals.push({ label: "Prijs boven verwacht", severity: "warning", detail: `${priceUp.length} producten boven verwachte prijs` });
  const lowReliability = rows.filter(r => r.supplier_reliability_score < 65);
  if (lowReliability.length > 0) signals.push({ label: "Leverancier instabiel", severity: "warning", detail: `${lowReliability.length} leveranciers met lage betrouwbaarheid` });
  const substitutes = rows.filter(r => r.substitute_candidates.length > 0 && r.procurement_action === "consider_substitute");
  if (substitutes.length > 0) signals.push({ label: "Substituut aanbevolen", severity: "info", detail: `${substitutes.length} producten met substituut-advies` });
  const markdown = rows.filter(r => r.markdown_advice);
  if (markdown.length > 0) signals.push({ label: "Markdown kandidaten", severity: "critical", detail: `${markdown.length} producten met markdown-advies` });
  const priceDown = rows.filter(r => r.price_deviation_pct < -10);
  if (priceDown.length > 0) signals.push({ label: "Inkoopkans", severity: "info", detail: `${priceDown.length} producten met prijsdaling` });
  return signals;
};

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
    gedekt: { label: "Gedekt", color: "text-accent bg-accent/10 border-accent/20" },
    deels_gedekt: { label: "Deels", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
    niet_gedekt: { label: "Niet gedekt", color: "text-destructive bg-destructive/10 border-destructive/20" },
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
    { key: "substitute", label: "Substituut" },
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
            LABS · V1.5
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

      {/* ── Tab navigation ── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
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

      {/* ── TAB: Inkooplijst ── */}
      {activeTab === "inkooplijst" && (
        <>
          {/* Day filter */}
          <DayFilter dateFrom={dateFrom} dateTo={dateTo} onDateFromChange={setDateFrom} onDateToChange={setDateTo} />

          {/* KPI Cards — Dekking + Procurement */}
          {showKPIs && (() => {
            const gedektCount = procurementRows.filter(p => getDekkingStatus(p) === "gedekt").length;
            const deelsCount = procurementRows.filter(p => getDekkingStatus(p) === "deels_gedekt").length;
            const nietCount = procurementRows.filter(p => getDekkingStatus(p) === "niet_gedekt").length;
            const overschotCount = procurementRows.filter(p => getDekkingStatus(p) === "overschot").length;
            return (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                  { label: "Totaal behoefte", value: fmt(totals.required + totals.freeStock), icon: Package },
                  { label: "Vrije voorraad", value: fmt(totals.freeStock), icon: CheckCircle2 },
                  { label: "Open inkoop", value: fmt(totals.openBuy), icon: AlertTriangle, highlight: true },
                  { label: "Δ Offerte/Inkoop", value: `${totals.offerVsHistorical > 0 ? "+" : ""}${totals.offerVsHistorical.toFixed(1)}%`, icon: totals.offerVsHistorical > 0 ? TrendingUp : TrendingDown, variant: totals.offerVsHistorical <= 0 ? "success" as const : "critical" as const },
                  { label: "Gedekt", value: `${gedektCount}`, icon: CheckCircle2, variant: "success" as const },
                  { label: "Deels gedekt", value: `${deelsCount}`, icon: AlertTriangle, variant: "warning" as const },
                  { label: "Niet gedekt", value: `${nietCount}`, icon: AlertTriangle, variant: "critical" as const },
                  { label: "Overschot", value: `${overschotCount}`, icon: Package },
                ].map(k => (
                  <div key={k.label} className={cn(
                    "rounded-xl border border-border bg-card p-3 flex flex-col gap-1",
                    k.highlight && "ring-1 ring-destructive/20"
                  )}>
                    <div className="flex items-center gap-1.5">
                      <k.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{k.label}</span>
                    </div>
                    <span className={cn("text-lg font-bold font-mono", k.variant === "critical" ? "text-destructive" : k.variant === "success" ? "text-accent" : k.variant === "warning" ? "text-yellow-500" : "text-foreground")}>{k.value}</span>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Supply Radar Signals */}
          {(() => {
            const radarSignals = computeRadarSignals(mockDecisionRows);
            const decisionKpis = computeKPIs(mockDecisionRows);
            return radarSignals.length > 0 ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {radarSignals.map((s, i) => (
                    <div key={i} className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold", signalSeverityColors[s.severity])}>
                      {s.severity === "critical" ? <ShieldAlert className="h-3 w-3" /> : s.severity === "warning" ? <AlertTriangle className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                      {s.label}
                      <span className="font-normal opacity-80 hidden sm:inline">— {s.detail}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="rounded-xl border border-border bg-card p-2.5 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-muted-foreground" /><span className="text-[9px] font-medium text-muted-foreground uppercase">Gem. druk</span></div>
                    <span className={cn("text-base font-bold font-mono", decisionKpis.avgPressure > 60 ? "text-destructive" : "text-foreground")}>{decisionKpis.avgPressure}/100</span>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-2.5 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-muted-foreground" /><span className="text-[9px] font-medium text-muted-foreground uppercase">Markdown</span></div>
                    <span className="text-base font-bold font-mono text-destructive">{decisionKpis.markdownCandidates}</span>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-2.5 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-muted-foreground" /><span className="text-[9px] font-medium text-muted-foreground uppercase">Markup</span></div>
                    <span className="text-base font-bold font-mono text-accent">{decisionKpis.markupOpportunities}</span>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-2.5 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-muted-foreground" /><span className="text-[9px] font-medium text-muted-foreground uppercase">Gem. Δ prijs</span></div>
                    <span className={cn("text-base font-bold font-mono", Math.abs(decisionKpis.avgDeviation) > 10 ? "text-destructive" : "text-foreground")}>{decisionKpis.avgDeviation > 0 ? "+" : ""}{decisionKpis.avgDeviation}%</span>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

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
                      ["substitute", "Substituut"],
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
                          
                          {visibleColumns.has("substitute") && (
                            <td className={cn("px-3", rowPy)}>
                              {subSuggestion && subSuggestion.status !== "none" && (
                                <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border whitespace-nowrap", substituteStatusLabels[subSuggestion.status].color)}>
                                  {subSuggestion.status === "recommended" ? <Repeat className="w-2.5 h-2.5 inline mr-0.5" /> : null}
                                  {subSuggestion.status === "recommended" ? "Aanbev." : "Beschikb."}
                                </span>
                              )}
                            </td>
                          )}
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

                                {/* Context cards — Demand & Inventory Pressure */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                                  {invPressure && (
                                    <div className="rounded-lg border border-border bg-background p-3">
                                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Voorraaddruk</span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", inventoryPressureLabels[invPressure.status].color)}>
                                          {inventoryPressureLabels[invPressure.status].label}
                                        </span>
                                        <span className="text-[10px] font-mono text-muted-foreground">{invPressure.stock_days}d</span>
                                      </div>
                                      <div className="text-[9px] text-muted-foreground mt-1">{invPressure.explanation}</div>
                                    </div>
                                  )}
                                  {subSuggestion && subSuggestion.status !== "none" && (
                                    <div className="rounded-lg border border-border bg-background p-3">
                                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Substituut advies</span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", substituteStatusLabels[subSuggestion.status].color)}>
                                          {substituteStatusLabels[subSuggestion.status].label}
                                        </span>
                                      </div>
                                      <div className="text-[9px] text-muted-foreground mt-1">{subSuggestion.candidates.length} kandidaten beschikbaar</div>
                                    </div>
                                  )}
                                  {purchaseMix && purchaseMix.has_mix && (
                                    <div className="rounded-lg border border-border bg-background p-3">
                                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Inkoopmix</span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border text-primary bg-primary/10 border-primary/20">
                                          Mix beschikbaar
                                        </span>
                                      </div>
                                      {purchaseMix.savings_vs_single > 0 && (
                                        <div className="text-[9px] text-accent mt-1">Besparing: {purchaseMix.savings_vs_single.toFixed(1)}%</div>
                                      )}
                                    </div>
                                  )}
                                </div>


                                {/* Leverancier Intelligence — unified panel */}
                                {supplierIntel && (
                                  <div className="rounded-lg border border-border bg-background p-4 space-y-4">
                                    <h4 className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                                      <UserCheck className="w-3.5 h-3.5 text-primary" />
                                      Leverancier Intelligence
                                    </h4>

                                    {/* Supplier summary cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                      <div className="rounded-lg border border-border bg-muted/10 p-2.5">
                                        <span className="text-[9px] font-medium text-muted-foreground uppercase">Leverancier</span>
                                        <div className="text-[11px] font-semibold text-foreground mt-0.5">{supplierIntel.supplier_name}</div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                          <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels[supplierIntel.supplier_class].color)}>{supplierIntel.supplier_class}</span>
                                          <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border", supplierAdviceLabels[supplierIntel.advice].color)}>{supplierAdviceLabels[supplierIntel.advice].label}</span>
                                        </div>
                                      </div>
                                      <div className="rounded-lg border border-border bg-muted/10 p-2.5">
                                        <span className="text-[9px] font-medium text-muted-foreground uppercase">Scores</span>
                                        <div className="space-y-1 mt-1">
                                          <div className="flex justify-between text-[9px]"><span className="text-muted-foreground">Kwaliteit</span><strong className="text-foreground">{supplierIntel.supplier_quality_score}%</strong></div>
                                          <div className="flex justify-between text-[9px]"><span className="text-muted-foreground">Betrouwbaarheid</span><strong className="text-foreground">{supplierIntel.supplier_reliability_score}%</strong></div>
                                          <div className="flex justify-between text-[9px]"><span className="text-muted-foreground">Totaal</span><strong className="text-foreground">{supplierIntel.supplier_total_score}/100</strong></div>
                                        </div>
                                      </div>
                                      <div className="rounded-lg border border-border bg-muted/10 p-2.5">
                                        <span className="text-[9px] font-medium text-muted-foreground uppercase">Effectieve prijs</span>
                                        <div className="text-sm font-bold font-mono mt-0.5 text-foreground">{fmtPrice(supplierIntel.effective_price)}</div>
                                        <div className="text-[9px] text-muted-foreground mt-0.5">Nominaal: {fmtPrice(supplierIntel.purchase_price)}</div>
                                        <div className="text-[9px] text-muted-foreground">Afval-gecorrigeerd: {fmtPrice(supplierIntel.waste_risk_adjusted_price)}</div>
                                      </div>
                                      <div className="rounded-lg border border-border bg-muted/10 p-2.5">
                                        <span className="text-[9px] font-medium text-muted-foreground uppercase">Voorkeur reden</span>
                                        <div className="text-[9px] text-foreground mt-1 leading-relaxed">{supplierIntel.preferred_supplier_reason}</div>
                                      </div>
                                    </div>

                                    {/* Effective price explanation */}
                                    <div className="rounded-lg border border-border/50 bg-muted/5 p-3">
                                      <span className="text-[9px] font-medium text-muted-foreground uppercase">Effectieve prijs toelichting</span>
                                      <div className="text-[10px] text-foreground mt-1 leading-relaxed">{supplierIntel.effective_price_explanation}</div>
                                    </div>

                                    {/* Alternatieve leveranciers (kwaliteit + alternatieven samengevoegd) */}
                                    {(supplierQuality?.suppliers?.length > 0 || supplierIntel.alternative_suppliers.length > 0) && (
                                      <div className="space-y-1.5">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Alternatieve leveranciers</span>
                                        {supplierQuality && supplierQuality.suppliers.map((s, i) => (
                                          <div key={`qual-${i}`} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-muted/20 border border-border/30">
                                            <div className="flex items-center gap-2">
                                              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels[s.grade].color)}>{s.grade}</span>
                                              <span className="font-medium text-foreground">{s.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                                              <span>Kwaliteit: <strong className="text-foreground">{s.quality_consistency}%</strong></span>
                                              <span>Betrouwb.: <strong className="text-foreground">{s.delivery_reliability}%</strong></span>
                                              <span>Afval: <strong className={cn(s.waste_risk > 5 ? "text-destructive" : "text-foreground")}>{s.waste_risk}%</strong></span>
                                            </div>
                                          </div>
                                        ))}
                                        {supplierIntel.alternative_suppliers.map((alt, i) => (
                                          <div key={`alt-${i}`} className="flex items-center justify-between text-[10px] py-2 px-3 rounded-lg bg-muted/20 border border-border/30">
                                            <div className="flex items-center gap-2">
                                              <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels[alt.class].color)}>{alt.class}</span>
                                              <span className="font-medium text-foreground">{alt.name}</span>
                                              <span className={cn("text-[8px] font-medium px-1.5 py-0.5 rounded-full border", supplierAdviceLabels[alt.advice].color)}>{supplierAdviceLabels[alt.advice].label}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                                              <span>Nom: <strong className="text-foreground">{fmtPrice(alt.purchase_price)}</strong></span>
                                              <span>Eff: <strong className="text-foreground">{fmtPrice(alt.effective_price)}</strong></span>
                                              <span>Kwal: <strong className="text-foreground">{alt.quality_score}%</strong></span>
                                            </div>
                                          </div>
                                        ))}
                                        {supplierIntel.alternative_suppliers.map((alt, i) => (
                                          <div key={`note-${i}`} className="text-[9px] text-muted-foreground pl-3 -mt-0.5">{alt.note}</div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Aanbevolen leveranciersmix */}
                                    {supplierMix && supplierMix.has_mix && (
                                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
                                        <span className="text-[10px] font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                                          <Shuffle className="w-3 h-3 text-primary" />
                                          Aanbevolen leveranciersmix
                                          <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full border text-primary bg-primary/10 border-primary/20">
                                            {supplierMix.suppliers.length} leveranciers
                                          </span>
                                        </span>
                                        <div className="space-y-1">
                                          {supplierMix.suppliers.map((s, i) => (
                                            <div key={i} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-background border border-border/30">
                                              <div className="flex items-center gap-2">
                                                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", supplierGradeLabels[s.class].color)}>{s.class}</span>
                                                <span className="font-medium text-foreground">{s.name}</span>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <span className="font-mono text-foreground">{fmt(s.volume)} st</span>
                                                <span className="font-mono text-muted-foreground">Nom: {fmtPrice(s.price)}</span>
                                                <span className="font-mono text-muted-foreground">Eff: {fmtPrice(s.effective_price)}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[10px]">
                                          <span className="text-muted-foreground">Gewogen inkooprijs (nominaal / effectief)</span>
                                          <span className="font-mono font-bold text-foreground">{fmtPrice(supplierMix.weighted_price)} / {fmtPrice(supplierMix.weighted_effective_price)}</span>
                                        </div>
                                        <div className="text-[9px] text-muted-foreground">{supplierMix.rationale}</div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Market & Design context block */}
                                {showMarketContext && (advisory || priceCheck || market) && (
                                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                                    <h4 className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                      Markt & Design Context
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                      {market && (
                                        <div className="rounded-lg border border-border bg-background p-2.5">
                                          <span className="text-[9px] font-medium text-muted-foreground uppercase">Marktprijs</span>
                                          <div className="text-sm font-bold font-mono mt-0.5 text-foreground">{fmtPrice(market.best_price)}</div>
                                          <div className="text-[9px] text-muted-foreground">{fmtPrice(market.price_low)} – {fmtPrice(market.price_high)}</div>
                                          {effectivePrice && (
                                            <div className="text-[9px] text-muted-foreground mt-1">
                                              Eff. prijs: <strong className="text-foreground">{fmtPrice(effectivePrice.effective_price)}</strong>
                                              <span className="text-[8px] ml-1">(+{effectivePrice.waste_risk_pct}% afval)</span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      {priceCheck && (
                                        <div className="rounded-lg border border-border bg-background p-2.5">
                                          <span className="text-[9px] font-medium text-muted-foreground uppercase">Prijscheck</span>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", priceCheckStatusLabels[priceCheck.price_check_status].color)}>
                                              {priceCheckStatusLabels[priceCheck.price_check_status].label}
                                            </span>
                                          </div>
                                          <div className="text-[9px] text-muted-foreground mt-1">{priceCheck.advice_text}</div>
                                        </div>
                                      )}
                                      {advisory && (
                                        <div className="rounded-lg border border-border bg-background p-2.5">
                                          <span className="text-[9px] font-medium text-muted-foreground uppercase">Design advies</span>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", designAdviceLabels[advisory.design_advice].color)}>
                                              {designAdviceLabels[advisory.design_advice].icon} {designAdviceLabels[advisory.design_advice].label}
                                            </span>
                                          </div>
                                          <div className="text-[9px] text-muted-foreground mt-1">{advisory.advice_detail}</div>
                                          {advisory.substitute && (
                                            <div className="flex items-center gap-1 text-[9px] text-primary mt-1">
                                              <ArrowRight className="w-2.5 h-2.5" /> Substituut: {advisory.substitute}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      {advisory && advisory.markup_advice !== "none" && (
                                        <div className="rounded-lg border border-border bg-background p-2.5">
                                          <span className="text-[9px] font-medium text-muted-foreground uppercase">Markup/Markdown</span>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", markupAdviceLabels[advisory.markup_advice].color)}>
                                              {markupAdviceLabels[advisory.markup_advice].label}
                                            </span>
                                          </div>
                                          <div className="text-[9px] text-muted-foreground mt-1">{advisory.markup_detail}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

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

                                {/* Price comparison */}
                                {showPriceComparison && <div>
                                  <h4 className="text-xs font-semibold text-foreground mb-2.5">Prijsvergelijking</h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                      { label: "Historische prijs", value: p.historical_price, baseline: true },
                                      { label: "Offerteprijs", value: p.offer_price },
                                      { label: "Adviesprijs", value: p.advised_price },
                                      ...(market ? [{ label: "Marktprijs", value: market.best_price }] : []),
                                    ].map(pc => {
                                      const diff = p.historical_price > 0 ? ((pc.value - p.historical_price) / p.historical_price * 100) : 0;
                                      return (
                                        <div key={pc.label} className={cn("rounded-lg border border-border bg-background p-3 flex flex-col gap-0.5", pc.baseline && "ring-1 ring-primary/20")}>
                                          <span className="text-[9px] font-medium text-muted-foreground uppercase">{pc.label}</span>
                                          <span className="text-sm font-bold font-mono text-foreground">{fmtPrice(pc.value)}</span>
                                          {!pc.baseline && <span className={cn("text-[9px] font-mono", pctColor(diff))}>{diff > 0 ? "+" : ""}{diff.toFixed(1)}%</span>}
                                          {pc.baseline && <span className="text-[9px] font-mono text-muted-foreground">referentie</span>}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>}

                                {/* Substituut bloemsoorten */}
                                {subSuggestion && subSuggestion.candidates.length > 0 && (
                                  <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                                    <h4 className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                                      <Repeat className="w-3.5 h-3.5 text-primary" />
                                      Substituut bloemsoorten
                                    </h4>
                                    <div className="space-y-1.5">
                                      {subSuggestion.candidates.map((c, i) => (
                                        <div key={i} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-muted/20 border border-border/30">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground">{c.name}</span>
                                            <div className="flex gap-1">
                                              {c.family_match && <span className="text-[8px] px-1 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Familie ✓</span>}
                                              {c.color_compatible && <span className="text-[8px] px-1 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Kleur ✓</span>}
                                              {c.length_compatible && <span className="text-[8px] px-1 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">Lengte ✓</span>}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <span className="font-mono text-muted-foreground">{fmtPrice(c.price)}</span>
                                            <span className={cn("text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full",
                                              c.confidence >= 80 ? "bg-accent/10 text-accent" : c.confidence >= 60 ? "bg-yellow-500/10 text-yellow-500" : "bg-muted text-muted-foreground"
                                            )}>{c.confidence}%</span>
                                            <span className={cn("text-[8px] font-medium",
                                              c.availability === "high" ? "text-accent" : c.availability === "medium" ? "text-yellow-500" : "text-destructive"
                                            )}>{c.availability === "high" ? "Hoog" : c.availability === "medium" ? "Medium" : "Laag"}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Inkoopmix voorstel */}
                                {purchaseMix && purchaseMix.has_mix && (
                                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
                                    <h4 className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                                      <Shuffle className="w-3.5 h-3.5 text-primary" />
                                      Inkoopmix voorstel
                                    </h4>
                                    <div className="space-y-1">
                                      {purchaseMix.lines.map((l, i) => (
                                        <div key={i} className="flex items-center justify-between text-[10px] py-1.5 px-2 rounded-lg bg-background border border-border/30">
                                          <div className="flex items-center gap-2">
                                            {l.type === "main" ? <Package className="w-3 h-3 text-foreground" /> : <Repeat className="w-3 h-3 text-primary" />}
                                            <span className="font-medium text-foreground">{l.product}</span>
                                            <span className={cn("text-[8px] px-1 py-0.5 rounded border",
                                              l.type === "main" ? "bg-muted text-muted-foreground border-border" : "bg-primary/10 text-primary border-primary/20"
                                            )}>{l.type === "main" ? "Hoofd" : "Substituut"}</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <span className="font-mono text-foreground">{fmt(l.units)} st</span>
                                            <span className="font-mono text-muted-foreground">{fmtPrice(l.price)}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[10px]">
                                      <span className="text-muted-foreground">Gewogen inkooprijs</span>
                                      <span className="font-mono font-bold text-foreground">{fmtPrice(purchaseMix.total_cost)}</span>
                                    </div>
                                  </div>
                                )}

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
                                          {offers.map(o => (
                                            <tr key={o.supplier_name} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                                              <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{o.supplier_name}</td>
                                              <td className="px-3 py-2.5 font-mono text-foreground">{fmtPrice(o.offer_price)}</td>
                                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{fmt(o.offer_quantity)}</td>
                                              <td className="px-3 py-2.5 text-muted-foreground">{o.delivery_timing}</td>
                                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{o.supplier_quality_score}%</td>
                                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{o.supplier_reliability_score}%</td>
                                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{o.price_stability_index}%</td>
                                              <td className={cn("px-3 py-2.5 font-mono", pctColor(o.variance_vs_historical))}>{o.variance_vs_historical > 0 ? "+" : ""}{o.variance_vs_historical.toFixed(1)}%</td>
                                              <td className={cn("px-3 py-2.5 font-mono", pctColor(o.variance_vs_offer))}>{o.variance_vs_offer > 0 ? "+" : ""}{o.variance_vs_offer.toFixed(1)}%</td>
                                              <td className="px-3 py-2.5">
                                                <button className="text-[10px] font-medium text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/50 rounded-lg px-2.5 py-1 transition-colors">Bekijk</button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                Inventory Intelligence
              </h3>
              {(() => {
                const highPressure = mockDecisionRows.filter(r => r.inventory_pressure_score > 60).sort((a, b) => b.inventory_pressure_score - a.inventory_pressure_score);
                const highTurnover = mockDecisionRows.filter(r => r.turnover_risk === "high");
                const markdownRows = mockDecisionRows.filter(r => r.markdown_advice);
                const useStockRows = mockDecisionRows.filter(r => r.procurement_action === "use_stock");
                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-lg border border-border bg-background p-2.5">
                        <p className="text-[9px] font-mono uppercase text-muted-foreground">Hoge druk</p>
                        <p className="text-base font-bold text-foreground">{highPressure.length}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background p-2.5">
                        <p className="text-[9px] font-mono uppercase text-muted-foreground">Omlooprisico</p>
                        <p className="text-base font-bold text-destructive">{highTurnover.length}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background p-2.5">
                        <p className="text-[9px] font-mono uppercase text-muted-foreground">Markdown advies</p>
                        <p className="text-base font-bold text-amber-400">{markdownRows.length}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background p-2.5">
                        <p className="text-[9px] font-mono uppercase text-muted-foreground">Voorraad eerst</p>
                        <p className="text-base font-bold text-sky-400">{useStockRows.length}</p>
                      </div>
                    </div>
                    {highPressure.length > 0 && (
                      <div className="space-y-1.5">
                        {highPressure.slice(0, 4).map(r => (
                          <div key={r.id} className="flex items-center justify-between text-xs bg-muted/20 rounded-lg p-2 border border-border/30">
                            <span className="font-medium text-foreground truncate flex-1">{r.product}</span>
                            <span className="text-muted-foreground font-mono mr-3">{r.stock_days}d</span>
                            <span className={cn("text-[10px] font-medium", r.turnover_risk === "high" ? "text-destructive" : r.turnover_risk === "medium" ? "text-amber-400" : "text-accent")}>
                              {r.turnover_risk} risk
                            </span>
                            <span className="font-mono ml-3 text-muted-foreground">{r.inventory_pressure_score}/100</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* ── Trade Registry preview (compact 8 weken) ── */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Trade Registry — 8 weken vooruit
              </h3>
              {(() => {
                const entry = tradeRegistry[0];
                if (!entry) return <p className="text-xs text-muted-foreground">Geen data</p>;
                const weeks = entry.weeks.slice(0, 8);
                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Week</th>
                          <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Beschikbaar</th>
                          <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Prijsrange</th>
                          <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Seizoen</th>
                          <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Risico</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weeks.map((w, i) => {
                          const avail = availabilityLabels[w.expected_availability];
                          const season = seasonalityLabels[w.seasonality];
                          const risk = riskLabels[w.risk_level];
                          return (
                            <tr key={`${w.week}-${w.year}`} className={cn("border-b border-border/30", i === 0 ? "bg-primary/5" : "hover:bg-muted/10")}>
                              <td className="px-2 py-1.5 font-mono font-semibold text-foreground">W{w.week}{i === 0 && <span className="ml-1 text-[8px] text-primary">NU</span>}</td>
                              <td className="px-2 py-1.5"><span className={cn("font-medium", avail.color)}>{avail.label}</span></td>
                              <td className="px-2 py-1.5 font-mono text-muted-foreground">€{w.expected_price_low.toFixed(3)} – €{w.expected_price_high.toFixed(3)}</td>
                              <td className="px-2 py-1.5"><span className={cn("font-medium", season.color)}>{season.label}</span></td>
                              <td className="px-2 py-1.5"><span className={cn("font-medium", risk.color)}>{risk.label}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      {/* ── TAB: Marktaanbod ── */}
      {activeTab === "marktaanbod" && (
        <IHSectionShell icon={BarChart3} title="Marktaanbod Monitor" subtitle="Actueel marktaanbod, prijzen, aanbodsdruk en 52-weken overzicht per product" badge={`${marketSupplyData.length} producten`}>
          <MarketSupplyPanel />
        </IHSectionShell>
      )}

    </div>
  );
};

export default ProcurementCockpitV1;
