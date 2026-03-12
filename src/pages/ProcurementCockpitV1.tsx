import { useState, useMemo } from "react";
import {
  ShoppingCart, FlaskConical, Package, AlertTriangle, CheckCircle2,
  TrendingDown, TrendingUp, ArrowUpDown, Search, ChevronDown,
  ChevronRight, Star, Shield, Clock, Zap, Eye, Users, X,
  Wifi, WifiOff, AlertCircle, Settings2, RotateCcw, Filter,
  Bot, ShoppingBag, Ruler,
} from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { cn } from "@/lib/utils";
import {
  procurementRows,
  supplierOffers,
  aiAdviceLabels,
  statusLabels,
  shopStatuses,
  shopSyncStatusLabels,
  type ProcurementRow,
  type AIAdvice,
  type ShopStatus,
} from "@/components/procurement-cockpit-v1/procurement-cockpit-v1-data";

/* ── helpers ── */
const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;
const pctColor = (v: number) => v <= -3 ? "text-accent" : v >= 3 ? "text-destructive" : "text-yellow-500";
const urgencyBadge = (u: string) =>
  u === "high" ? "bg-destructive/10 text-destructive border-destructive/20"
  : u === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  : "bg-accent/10 text-accent border-accent/20";
const scoreColor = (s: number) => s >= 95 ? "text-accent" : s >= 85 ? "text-yellow-500" : "text-destructive";
const scoreBg = (s: number) => s >= 95 ? "bg-accent/10 border-accent/20" : s >= 85 ? "bg-yellow-500/10 border-yellow-500/20" : "bg-destructive/10 border-destructive/20";

const shopIcon = (status: ShopStatus["status"]) => {
  switch (status) {
    case "connected": return <Wifi className="w-3 h-3 text-accent" />;
    case "delayed": return <Clock className="w-3 h-3 text-yellow-500" />;
    case "outdated": return <AlertCircle className="w-3 h-3 text-yellow-500" />;
    case "error": return <WifiOff className="w-3 h-3 text-destructive" />;
    default: return <WifiOff className="w-3 h-3 text-muted-foreground" />;
  }
};

type SortKey = keyof ProcurementRow;
type SortDir = "asc" | "desc";
type PeriodFilter = "today" | "tomorrow" | "this_week" | "next_week" | "all";

const periodOptions: { key: PeriodFilter; label: string }[] = [
  { key: "today", label: "Vandaag" },
  { key: "tomorrow", label: "Morgen" },
  { key: "this_week", label: "Deze week" },
  { key: "next_week", label: "Volgende week" },
  { key: "all", label: "Alle periodes" },
];

const ProcurementCockpitV1 = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("urgency");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [familyFilter, setFamilyFilter] = useState<string | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("this_week");
  const [customerFilter, setCustomerFilter] = useState<string | null>(null);
  const [shopPopup, setShopPopup] = useState(false);
  const [showViewSettings, setShowViewSettings] = useState(false);
  const [compactView, setCompactView] = useState(false);

  const families = useMemo(() => [...new Set(procurementRows.map(p => p.product_family))].sort(), []);
  const allCustomers = useMemo(() => [...new Set(procurementRows.flatMap(p => p.customers))].sort(), []);

  const urgencyOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };

  const filtered = useMemo(() => {
    let list = procurementRows.filter(p => {
      if (search && !p.product.toLowerCase().includes(search.toLowerCase()) && !p.product_family.toLowerCase().includes(search.toLowerCase())) return false;
      if (familyFilter && p.product_family !== familyFilter) return false;
      if (urgencyFilter && p.urgency !== urgencyFilter) return false;
      if (customerFilter && !p.customers.includes(customerFilter)) return false;
      return true;
    });
    list.sort((a, b) => {
      if (sortKey === "urgency") {
        const av = urgencyOrder[a.urgency] ?? 0;
        const bv = urgencyOrder[b.urgency] ?? 0;
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [search, sortKey, sortDir, familyFilter, urgencyFilter, customerFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const resetFilters = () => {
    setSearch("");
    setFamilyFilter(null);
    setUrgencyFilter(null);
    setCustomerFilter(null);
    setPeriodFilter("this_week");
  };

  const hasActiveFilters = search || familyFilter || urgencyFilter || customerFilter || periodFilter !== "this_week";

  /* ── KPI totals ── */
  const totals = useMemo(() => {
    const rows = procurementRows;
    const avgOffer = rows.reduce((s, p) => s + p.offer_price, 0) / rows.length;
    const avgHistorical = rows.reduce((s, p) => s + p.historical_price, 0) / rows.length;
    return {
      required: rows.reduce((s, p) => s + p.required_volume, 0),
      freeStock: rows.reduce((s, p) => s + p.free_stock, 0),
      reserved: rows.reduce((s, p) => s + p.reserved_stock, 0),
      openBuy: rows.reduce((s, p) => s + p.open_buy_need, 0),
      avgOfferPrice: avgOffer,
      avgHistoricalPrice: avgHistorical,
      offerVsHistorical: ((avgOffer - avgHistorical) / avgHistorical * 100),
      actionNeeded: rows.filter(p => p.urgency === "high" || (p.open_buy_need > 0 && p.free_stock === 0)).length,
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground tracking-tight">Procurement Cockpit</h1>
          <span className="flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <FlaskConical className="w-3 h-3" /> LABS · V1
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Shop status button */}
          <div className="relative">
            <button
              onClick={() => setShopPopup(!shopPopup)}
              className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              <Wifi className="w-3.5 h-3.5 text-accent" />
              Shops ({shopStatuses.filter(s => s.status === "connected").length}/{shopStatuses.length})
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
            <button
              onClick={() => setShowViewSettings(!showViewSettings)}
              className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
              Weergave
            </button>
            {showViewSettings && (
              <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border border-border bg-card shadow-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">Weergave</span>
                  <button onClick={() => setShowViewSettings(false)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={compactView} onChange={e => setCompactView(e.target.checked)} className="rounded border-border" />
                  <span className="text-[11px] text-foreground">Compacte weergave</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION 1 — KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Benodigd volume", value: fmt(totals.required), icon: Package },
          { label: "Vrije voorraad", value: fmt(totals.freeStock), icon: CheckCircle2 },
          { label: "Gereserveerd", value: fmt(totals.reserved), icon: Clock },
          { label: "Open inkoopbehoefte", value: fmt(totals.openBuy), icon: AlertTriangle, highlight: true },
          { label: "Gem. offerteprijs", value: fmtPrice(totals.avgOfferPrice), icon: TrendingDown, sub: `vs hist. ${fmtPrice(totals.avgHistoricalPrice)}`, variant: totals.offerVsHistorical <= 0 ? "success" as const : "critical" as const },
          { label: "Actie nodig", value: `${totals.actionNeeded} producten`, icon: Zap, variant: "critical" as const },
        ].map(k => (
          <div key={k.label} className={cn(
            "rounded-xl border border-border bg-card/70 backdrop-blur-sm p-3.5 flex flex-col gap-1",
            k.highlight && "ring-1 ring-yellow-500/30"
          )}>
            <div className="flex items-center gap-1.5">
              <k.icon className={cn("w-3.5 h-3.5", k.variant === "critical" ? "text-destructive" : k.variant === "success" ? "text-accent" : "text-muted-foreground")} />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{k.label}</span>
            </div>
            <span className={cn("text-lg font-bold font-mono", k.variant === "critical" ? "text-destructive" : k.variant === "success" ? "text-accent" : "text-foreground")}>{k.value}</span>
            {"sub" in k && k.sub && <span className="text-[9px] text-muted-foreground font-mono">{k.sub}</span>}
          </div>
        ))}
      </div>

      {/* ── SECTION 2 — Filters ── */}
      <div className="rounded-xl border border-border bg-card/50 p-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period */}
          <div className="flex items-center gap-1 border-r border-border pr-2.5 mr-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            {periodOptions.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriodFilter(p.key)}
                className={cn(
                  "text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-colors",
                  periodFilter === p.key ? "bg-primary/15 text-primary border-primary/30 font-semibold" : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >{p.label}</button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Zoek product..."
              className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Product family */}
          <select
            value={familyFilter || ""}
            onChange={e => setFamilyFilter(e.target.value || null)}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer"
          >
            <option value="">Alle families</option>
            {families.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {/* Customer */}
          <select
            value={customerFilter || ""}
            onChange={e => setCustomerFilter(e.target.value || null)}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground cursor-pointer"
          >
            <option value="">Alle klanten</option>
            {allCustomers.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Urgency */}
          <div className="flex gap-1">
            {(["high", "medium", "low"] as const).map(u => (
              <button key={u} onClick={() => setUrgencyFilter(urgencyFilter === u ? null : u)} className={cn("text-[11px] px-2.5 py-1.5 rounded-lg border transition-colors font-medium", urgencyFilter === u ? urgencyBadge(u) : "border-border text-muted-foreground hover:bg-muted")}>
                {u === "high" ? "Urgent" : u === "medium" ? "Medium" : "Laag"}
              </button>
            ))}
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* ── SECTION 3 — Procurement List ── */}
      <IHSectionShell icon={ShoppingCart} title="Inkooplijst" subtitle="Klik op een rij voor detail" badge={`${filtered.length} PRODUCTEN`}>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-2 py-2.5 w-6"></th>
                <th className="px-2 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Status</th>
                {([
                  ["product", "Product"],
                  ["required_volume", "Benodigd"],
                  ["available_stock", "Voorraad"],
                  ["free_stock", "Vrij"],
                  ["open_buy_need", "Open Inkoop"],
                  ["historical_price", "Hist. Prijs"],
                  ["offer_price", "Offerteprijs"],
                  ["advised_price", "Adviesprijs"],
                  ["variance_vs_calculated", "Δ Hist."],
                  ["preferred_supplier", "Lev. Voorkeur"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="px-3 py-2.5 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap" onClick={() => toggleSort(key)}>
                    <span className="inline-flex items-center gap-0.5">
                      {label}
                      {sortKey === key && <ArrowUpDown className="w-3 h-3" />}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Kwaliteit</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Lev. Score</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">AI Advies</th>
                <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Koop nu</th>
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
                const adviceStyle = aiAdviceLabels[p.ai_advice];
                const sLabel = statusLabels[p.status];
                const rowH = compactView ? "py-2" : "py-3";

                return (
                  <tbody key={p.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      className={cn(
                        "border-b border-border/40 cursor-pointer transition-colors",
                        isExpanded ? "bg-primary/5" : "hover:bg-muted/20"
                      )}
                    >
                      <td className={cn("px-2", rowH, "text-muted-foreground")}>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </td>
                      {/* Status */}
                      <td className={cn("px-2", rowH)}>
                        <span className={cn("text-[9px] font-semibold px-2 py-0.5 rounded-full border", sLabel.color)}>{sLabel.label}</span>
                      </td>
                      {/* Product */}
                      <td className={cn("px-3", rowH)}>
                        <div className="font-semibold text-foreground text-[12px]">{p.product}</div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-0.5"><Ruler className="w-2.5 h-2.5" />{p.stem_length}</span>
                          <span>·</span>
                          <span>{p.product_family}</span>
                        </div>
                      </td>
                      {/* Volume */}
                      <td className={cn("px-3", rowH, "font-mono text-foreground")}>{fmt(p.required_volume)}</td>
                      <td className={cn("px-3", rowH, "font-mono text-foreground/70")}>{fmt(p.available_stock)}</td>
                      <td className={cn("px-3", rowH, "font-mono font-semibold", p.free_stock === 0 ? "text-destructive" : "text-accent")}>{fmt(p.free_stock)}</td>
                      <td className={cn("px-3", rowH, "font-mono font-bold text-foreground")}>{fmt(p.open_buy_need)}</td>
                      {/* Prices */}
                      <td className={cn("px-3", rowH, "font-mono text-foreground/60")}>{fmtPrice(p.historical_price)}</td>
                      <td className={cn("px-3", rowH, "font-mono font-semibold text-foreground")}>{fmtPrice(p.offer_price)}</td>
                      <td className={cn("px-3", rowH, "font-mono text-primary")}>{fmtPrice(p.advised_price)}</td>
                      <td className={cn("px-3", rowH, "font-mono font-semibold", pctColor(p.variance_vs_calculated))}>{p.variance_vs_calculated > 0 ? "+" : ""}{p.variance_vs_calculated.toFixed(1)}%</td>
                      {/* Supplier */}
                      <td className={cn("px-3", rowH, "text-foreground/80 whitespace-nowrap text-[10px]")}>{p.preferred_supplier}</td>
                      {/* Quality */}
                      <td className={cn("px-3", rowH)}>
                        <div className="flex items-center gap-1.5">
                          <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded border", p.external_quality === "A1" ? "bg-accent/10 text-accent border-accent/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20")}>{p.external_quality}</span>
                          <span className={cn("text-[10px] font-mono", scoreColor(p.internal_quality))}>{p.internal_quality}%</span>
                        </div>
                      </td>
                      {/* Supplier score */}
                      <td className={cn("px-3", rowH)}>
                        <span className={cn("inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full border", scoreBg(p.supplier_score), scoreColor(p.supplier_score))}>
                          <Star className="w-2.5 h-2.5" />{p.supplier_score}
                        </span>
                      </td>
                      {/* AI Advice - disabled */}
                      <td className={cn("px-3", rowH)}>
                        <span className={cn("text-[9px] font-semibold px-2 py-0.5 rounded-full border opacity-50 cursor-not-allowed", adviceStyle.color)}>
                          <span className="flex items-center gap-1"><Bot className="w-2.5 h-2.5" />{adviceStyle.label}</span>
                        </span>
                      </td>
                      {/* Buy now - disabled */}
                      <td className={cn("px-3", rowH)}>
                        <button disabled className="text-[9px] font-semibold px-2.5 py-1 rounded-lg border border-border text-muted-foreground/40 bg-muted/30 cursor-not-allowed flex items-center gap-1">
                          <ShoppingBag className="w-2.5 h-2.5" /> Koop
                        </button>
                      </td>
                      {/* Urgency */}
                      <td className={cn("px-3", rowH)}>
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", urgencyBadge(p.urgency))}>
                          {p.urgency === "high" ? "Hoog" : p.urgency === "medium" ? "Medium" : "Laag"}
                        </span>
                      </td>
                    </tr>

                    {/* ── Expanded Row Detail ── */}
                    {isExpanded && (
                      <tr className="bg-muted/5">
                        <td colSpan={17} className="px-5 py-5">
                          <div className="space-y-5">
                            {/* Context row: stock + customer + program */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                              {[
                                { label: "Benodigd", value: fmt(p.required_volume) },
                                { label: "Beschikbaar", value: fmt(p.available_stock) },
                                { label: "Gereserveerd", value: fmt(p.reserved_stock) },
                                { label: "Vrije voorraad", value: fmt(p.free_stock), color: p.free_stock === 0 ? "text-destructive" : "text-accent" },
                                { label: "Open inkoop", value: fmt(p.open_buy_need), color: "text-foreground" },
                                { label: "Offerteprijs", value: fmtPrice(p.offer_price) },
                              ].map(c => (
                                <div key={c.label} className="rounded-lg border border-border bg-background p-3">
                                  <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{c.label}</span>
                                  <div className={cn("text-sm font-bold font-mono mt-0.5", c.color || "text-foreground")}>{c.value}</div>
                                </div>
                              ))}
                            </div>

                            {/* Customer + Program + Supplier quality */}
                            <div className="flex flex-wrap gap-4 text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">Klanten:</span>
                                <span className="font-semibold text-foreground">{p.customers.join(", ")}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">Programma:</span>
                                <span className="font-semibold text-foreground">{p.programs.join(", ")}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">Kwaliteit lev.:</span>
                                <span className={cn("font-mono font-semibold", scoreColor(p.supplier_quality))}>{p.supplier_quality}%</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">Betrouwb.:</span>
                                <span className={cn("font-mono font-semibold", scoreColor(p.supplier_reliability))}>{p.supplier_reliability}%</span>
                              </div>
                            </div>

                            {/* Supplier offers table */}
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-primary" />
                                Leveranciersaanbod ({offers.length} leveranciers)
                              </h4>
                              {offers.length === 0 ? (
                                <p className="text-[11px] text-muted-foreground italic">Geen leveranciersdata beschikbaar.</p>
                              ) : (
                                <div className="overflow-x-auto rounded-lg border border-border">
                                  <table className="w-full text-[11px]">
                                    <thead>
                                      <tr className="border-b border-border bg-muted/30">
                                        {["Leverancier", "Prijs", "Aantal", "Levering", "Kwaliteit", "Betrouwb.", "Prijsstab.", "Δ Hist.", "Δ Offerte", ""].map(h => (
                                          <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {offers.map(o => (
                                        <tr key={o.supplier_name} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                                          <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{o.supplier_name}</td>
                                          <td className="px-3 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(o.offer_price)}</td>
                                          <td className="px-3 py-2.5 font-mono text-foreground/70">{fmt(o.offer_quantity)}</td>
                                          <td className="px-3 py-2.5 text-muted-foreground">{o.delivery_timing}</td>
                                          <td className={cn("px-3 py-2.5 font-mono", scoreColor(o.supplier_quality_score))}>{o.supplier_quality_score}%</td>
                                          <td className={cn("px-3 py-2.5 font-mono", scoreColor(o.supplier_reliability_score))}>{o.supplier_reliability_score}%</td>
                                          <td className={cn("px-3 py-2.5 font-mono", o.price_stability_index >= 90 ? "text-accent" : o.price_stability_index >= 75 ? "text-yellow-500" : "text-destructive")}>{o.price_stability_index}%</td>
                                          <td className={cn("px-3 py-2.5 font-mono font-semibold", pctColor(o.variance_vs_historical))}>{o.variance_vs_historical > 0 ? "+" : ""}{o.variance_vs_historical.toFixed(1)}%</td>
                                          <td className={cn("px-3 py-2.5 font-mono font-semibold", pctColor(o.variance_vs_offer))}>{o.variance_vs_offer > 0 ? "+" : ""}{o.variance_vs_offer.toFixed(1)}%</td>
                                          <td className="px-3 py-2.5">
                                            <button className="text-[10px] font-semibold text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 rounded-lg px-2.5 py-1 transition-colors">Bekijk</button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>

                            {/* Price comparison */}
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2.5">Prijsvergelijking</h4>
                              <div className="grid grid-cols-3 gap-3">
                                {[
                                  { label: "Historische prijs", value: p.historical_price, baseline: true },
                                  { label: "Offerteprijs", value: p.offer_price },
                                  { label: "Adviesprijs", value: p.advised_price },
                                ].map(pc => {
                                  const diff = p.historical_price > 0 ? ((pc.value - p.historical_price) / p.historical_price * 100) : 0;
                                  return (
                                    <div key={pc.label} className={cn("rounded-lg border border-border bg-background p-3 flex flex-col gap-0.5", pc.baseline && "ring-1 ring-primary/30")}>
                                      <span className="text-[9px] font-medium text-muted-foreground uppercase">{pc.label}</span>
                                      <span className="text-sm font-bold font-mono text-foreground">{fmtPrice(pc.value)}</span>
                                      {!pc.baseline && <span className={cn("text-[9px] font-mono font-semibold", pctColor(diff))}>{diff > 0 ? "+" : ""}{diff.toFixed(1)}% vs hist.</span>}
                                      {pc.baseline && <span className="text-[9px] font-mono text-primary">referentie</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                );
              })}
            </tbody>
          </table>
        </div>
      </IHSectionShell>
    </div>
  );
};

export default ProcurementCockpitV1;
