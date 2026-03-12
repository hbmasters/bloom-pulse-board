import { useState, useMemo, Fragment } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  ShoppingCart, Package, AlertTriangle, CheckCircle2,
  TrendingDown, TrendingUp, ArrowUpDown, Search, ChevronDown,
  ChevronRight, Star, Shield, Clock, Zap, Eye, Users, X,
  Wifi, WifiOff, AlertCircle, Settings2, RotateCcw,
  ShoppingBag, Ruler, CalendarIcon, Flower2,
} from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  procurementRows,
  supplierOffers,
  statusLabels,
  shopStatuses,
  shopSyncStatusLabels,
  type ProcurementRow,
  type ShopStatus,
} from "@/components/procurement-cockpit-v1/procurement-cockpit-v1-data";

/* ── helpers ── */
const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;
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

const ProcurementCockpitV1 = () => {
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
    const now = new Date();
    setDateFrom(now);
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

  const DatePicker = ({ value, onChange, label }: { value: Date | undefined; onChange: (d: Date | undefined) => void; label: string }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("h-8 text-[11px] font-medium gap-1.5 px-3 border-border bg-background", !value && "text-muted-foreground")}>
          <CalendarIcon className="w-3.5 h-3.5" />
          {value ? format(value, "d MMM yyyy", { locale: nl }) : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className="p-3 pointer-events-auto" />
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground tracking-tight">Purchasing List</h1>
          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border">
            LABS · V0.5
          </span>
        </div>
        <div className="flex items-center gap-2">
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

      {/* ── Period filter (date range) ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[11px] font-medium text-muted-foreground">Periode:</span>
        <DatePicker value={dateFrom} onChange={setDateFrom} label="Van" />
        <span className="text-[11px] text-muted-foreground">t/m</span>
        <DatePicker value={dateTo} onChange={setDateTo} label="Tot" />
      </div>

      {/* ── KPI Cards (tied to period) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Benodigd volume", value: fmt(totals.required), icon: Package },
          { label: "Vrije voorraad", value: fmt(totals.freeStock), icon: CheckCircle2 },
          { label: "Open inkoopbehoefte", value: fmt(totals.openBuy), icon: AlertTriangle, highlight: true },
          { label: "Offerteprijs vs Inkoopprijs", value: `${totals.offerVsHistorical > 0 ? "+" : ""}${totals.offerVsHistorical.toFixed(1)}%`, icon: totals.offerVsHistorical > 0 ? TrendingUp : TrendingDown, sub: `Offerte ${fmtPrice(totals.avgOfferPrice)} · Inkoop ${fmtPrice(totals.avgHistoricalPrice)}`, variant: totals.offerVsHistorical <= 0 ? "success" as const : "critical" as const },
          { label: "Actie nodig", value: `${totals.actionNeeded}`, icon: Zap },
        ].map(k => (
          <div key={k.label} className={cn(
            "rounded-xl border border-border bg-card p-3.5 flex flex-col gap-1",
            k.highlight && "ring-1 ring-destructive/20"
          )}>
            <div className="flex items-center gap-1.5">
              <k.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{k.label}</span>
            </div>
            <span className={cn("text-lg font-bold font-mono", k.variant === "critical" ? "text-destructive" : k.variant === "success" ? "text-accent" : "text-foreground")}>{k.value}</span>
            {"sub" in k && k.sub && <span className="text-[9px] text-muted-foreground font-mono">{k.sub}</span>}
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
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

      {/* ── Procurement List ── */}
      <IHSectionShell icon={ShoppingCart} title="Inkooplijst" subtitle="Klik op een rij voor detail" badge={`${filtered.length}`}>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2.5 w-6"></th>
                <th className="px-2 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">Status</th>
                {([
                  ["product", "Product"],
                  ["buyer", "Inkoper"],
                  ["required_volume", "Benodigd"],
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
                const sLabel = statusLabels[p.status];
                const rowPy = compactView ? "py-2" : "py-3";

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
                        <span className={cn("text-[9px] font-medium px-2 py-0.5 rounded-full border", sLabel.color)}>{sLabel.label}</span>
                      </td>
                      <td className={cn("px-3", rowPy)}>
                        <div className="font-medium text-foreground text-[12px]">{p.product}</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                          <Ruler className="w-2.5 h-2.5" />{p.stem_length} · {p.product_family}
                        </div>
                      </td>
                      <td className={cn("px-3", rowPy, "text-[10px] text-muted-foreground whitespace-nowrap")}>{p.buyer}</td>
                      <td className={cn("px-3", rowPy, "font-mono text-foreground")}>{fmt(p.required_volume)}</td>
                      <td className={cn("px-3", rowPy, "font-mono text-muted-foreground")}>{fmtPrice(p.historical_price)}</td>
                      <td className={cn("px-3", rowPy, "font-mono text-foreground")}>{fmtPrice(p.offer_price)}</td>
                      <td className={cn("px-3", rowPy, "font-mono text-muted-foreground")}>{fmtPrice(p.advised_price)}</td>
                      <td className={cn("px-3", rowPy, "font-mono", pctColor(p.variance_vs_calculated))}>{p.variance_vs_calculated > 0 ? "+" : ""}{p.variance_vs_calculated.toFixed(1)}%</td>
                      <td className={cn("px-3", rowPy, "text-muted-foreground whitespace-nowrap text-[10px]")}>{p.preferred_supplier}</td>
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
                        <td colSpan={16} className="px-5 py-5">
                          <div className="space-y-5">
                            {/* Context cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { label: "Benodigd", value: fmt(p.required_volume) },
                              ].map(c => (
                                <div key={c.label} className="rounded-lg border border-border bg-background p-3">
                                  <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">{c.label}</span>
                                  <div className="text-sm font-bold font-mono mt-0.5 text-foreground">{c.value}</div>
                                </div>
                              ))}
                            </div>

                            {/* Klanten & Producten gecombineerd */}
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
                                    <div key={pc.label} className={cn("rounded-lg border border-border bg-background p-3 flex flex-col gap-0.5", pc.baseline && "ring-1 ring-primary/20")}>
                                      <span className="text-[9px] font-medium text-muted-foreground uppercase">{pc.label}</span>
                                      <span className="text-sm font-bold font-mono text-foreground">{fmtPrice(pc.value)}</span>
                                      {!pc.baseline && <span className={cn("text-[9px] font-mono", pctColor(diff))}>{diff > 0 ? "+" : ""}{diff.toFixed(1)}%</span>}
                                      {pc.baseline && <span className="text-[9px] font-mono text-muted-foreground">referentie</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Supplier offers table */}
                            <div>
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
                            </div>
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
    </div>
  );
};

export default ProcurementCockpitV1;
