import { useState, useMemo } from "react";
import { ShoppingCart, Radar, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Info, Package, BarChart3, ArrowUpDown, Search, X, FlaskConical } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { cn } from "@/lib/utils";
import {
  marketProducts,
  supplierOffers,
  supplierPerformance,
  signals,
  type MarketProduct,
} from "@/components/procurement-radar/procurement-radar-data";

/* ── helpers ── */
const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(3)}`;
const pctColor = (v: number) => v <= -3 ? "text-accent" : v >= 3 ? "text-destructive" : "text-yellow-500";
const urgencyBadge = (u: string) =>
  u === "high" ? "bg-destructive/10 text-destructive border-destructive/20"
  : u === "medium" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  : "bg-accent/10 text-accent border-accent/20";

type SortKey = keyof MarketProduct;
type SortDir = "asc" | "desc";

const ProcurementMarketRadar = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("open_buy_need");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [familyFilter, setFamilyFilter] = useState<string | null>(null);

  const families = useMemo(() => [...new Set(marketProducts.map(p => p.product_family))], []);

  const filtered = useMemo(() => {
    let list = marketProducts.filter(p => {
      if (search && !p.product.toLowerCase().includes(search.toLowerCase())) return false;
      if (familyFilter && p.product_family !== familyFilter) return false;
      return true;
    });
    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [search, sortKey, sortDir, familyFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  /* ── KPI totals ── */
  const totals = useMemo(() => ({
    required: marketProducts.reduce((s, p) => s + p.required_volume, 0),
    stock: marketProducts.reduce((s, p) => s + p.available_stock, 0),
    contracted: marketProducts.reduce((s, p) => s + p.contracted_volume, 0),
    openBuy: marketProducts.reduce((s, p) => s + p.open_buy_need, 0),
    avgMarketPrice: marketProducts.reduce((s, p) => s + p.best_market_price, 0) / marketProducts.length,
    avgPressure: marketProducts.reduce((s, p) => s + p.variance_vs_calculated, 0) / marketProducts.length,
  }), []);

  const selectedOffers = selectedId ? supplierOffers[selectedId] || [] : [];
  const selectedProduct = marketProducts.find(p => p.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Radar className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground tracking-tight">Procurement Market Radar</h1>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <FlaskConical className="w-3 h-3" /> LABS · BETA
        </span>
      </div>

      {/* ── SECTION 1 — KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Benodigd volume", value: fmt(totals.required), icon: Package },
          { label: "Beschikbare voorraad", value: fmt(totals.stock), icon: CheckCircle2 },
          { label: "Gecontracteerd", value: fmt(totals.contracted), icon: ShoppingCart },
          { label: "Open inkoopbehoefte", value: fmt(totals.openBuy), icon: AlertTriangle, highlight: true },
          { label: "Gem. marktprijs", value: fmtPrice(totals.avgMarketPrice), icon: BarChart3 },
          { label: "Prijsdruk vs berekend", value: `${totals.avgPressure > 0 ? "+" : ""}${totals.avgPressure.toFixed(1)}%`, icon: totals.avgPressure > 0 ? TrendingUp : TrendingDown, variant: totals.avgPressure > 0 ? "critical" as const : "success" as const },
        ].map(k => (
          <div key={k.label} className={cn(
            "rounded-xl border border-border bg-card/70 backdrop-blur-sm p-3 flex flex-col gap-1",
            k.highlight && "ring-1 ring-yellow-500/30"
          )}>
            <div className="flex items-center gap-1.5">
              <k.icon className={cn("w-3.5 h-3.5", k.variant === "critical" ? "text-destructive" : k.variant === "success" ? "text-accent" : "text-muted-foreground")} />
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{k.label}</span>
            </div>
            <span className={cn("text-lg font-bold font-mono", k.variant === "critical" ? "text-destructive" : k.variant === "success" ? "text-accent" : "text-foreground")}>{k.value}</span>
          </div>
        ))}
      </div>

      {/* ── SECTION 2 — Market Table ── */}
      <IHSectionShell icon={ShoppingCart} title="Procurement Market Overzicht" subtitle="Klik op een product voor leveranciersdetail" badge={`${filtered.length} PRODUCTEN`}>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Zoek product..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setFamilyFilter(null)} className={cn("text-[10px] px-2 py-1 rounded-md border transition-colors", !familyFilter ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted")}>Alle</button>
            {families.map(f => (
              <button key={f} onClick={() => setFamilyFilter(f)} className={cn("text-[10px] px-2 py-1 rounded-md border transition-colors", familyFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted")}>{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {([
                  ["product", "Product"],
                  ["product_family", "Familie"],
                  ["required_volume", "Benodigd"],
                  ["free_stock", "Vrij"],
                  ["contracted_volume", "Contract"],
                  ["open_buy_need", "Open Inkoop"],
                  ["calculated_price", "Berekend"],
                  ["clock_price", "Klok"],
                  ["direct_price", "Direct"],
                  ["best_market_price", "Beste Markt"],
                  ["variance_vs_calculated", "Δ Berekend"],
                  ["supplier_count", "# Lev."],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="px-3 py-2 text-left font-mono text-muted-foreground/50 font-semibold cursor-pointer hover:text-foreground select-none whitespace-nowrap" onClick={() => toggleSort(key)}>
                    <span className="inline-flex items-center gap-0.5">
                      {label}
                      {sortKey === key && <ArrowUpDown className="w-3 h-3" />}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2 text-left font-mono text-muted-foreground/50 font-semibold">Urgentie</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                  className={cn(
                    "border-b border-border/50 cursor-pointer transition-colors",
                    selectedId === p.id ? "bg-primary/5" : "hover:bg-muted/10"
                  )}
                >
                  <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{p.product}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{p.product_family}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground/80">{fmt(p.required_volume)}</td>
                  <td className={cn("px-3 py-2.5 font-mono font-semibold", p.free_stock === 0 ? "text-destructive" : "text-accent")}>{fmt(p.free_stock)}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground/70">{fmt(p.contracted_volume)}</td>
                  <td className="px-3 py-2.5 font-mono font-bold text-foreground">{fmt(p.open_buy_need)}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground/70">{fmtPrice(p.calculated_price)}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground/70">{fmtPrice(p.clock_price)}</td>
                  <td className="px-3 py-2.5 font-mono text-foreground/70">{fmtPrice(p.direct_price)}</td>
                  <td className="px-3 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(p.best_market_price)}</td>
                  <td className={cn("px-3 py-2.5 font-mono font-semibold", pctColor(p.variance_vs_calculated))}>{p.variance_vs_calculated > 0 ? "+" : ""}{p.variance_vs_calculated.toFixed(1)}%</td>
                  <td className="px-3 py-2.5 font-mono text-foreground/70">{p.supplier_count}</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border", urgencyBadge(p.urgency))}>{p.urgency}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </IHSectionShell>

      {/* ── SECTION 3 — Supplier Offer Panel ── */}
      {selectedProduct && (
        <IHSectionShell icon={ShoppingCart} title={`Leveranciersaanbod — ${selectedProduct.product}`} subtitle="Vergelijk aanbiedingen per leverancier" badge={`${selectedOffers.length} LEVERANCIERS`}>
          {selectedOffers.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Geen leveranciersdata beschikbaar voor dit product.</p>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    {["Leverancier", "Prijs", "Aantal", "Levering", "Kwaliteit", "Betrouwb.", "Prijsstab.", "Δ Berekend", "Δ Klok"].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-mono text-muted-foreground/50 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedOffers.map(o => (
                    <tr key={o.supplier_name} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{o.supplier_name}</td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(o.offer_price)}</td>
                      <td className="px-3 py-2.5 font-mono text-foreground/70">{fmt(o.offer_quantity)}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{o.delivery_timing}</td>
                      <td className={cn("px-3 py-2.5 font-mono", o.supplier_quality_score >= 95 ? "text-accent" : o.supplier_quality_score >= 90 ? "text-yellow-500" : "text-destructive")}>{o.supplier_quality_score}%</td>
                      <td className={cn("px-3 py-2.5 font-mono", o.supplier_reliability_score >= 95 ? "text-accent" : o.supplier_reliability_score >= 85 ? "text-yellow-500" : "text-destructive")}>{o.supplier_reliability_score}%</td>
                      <td className={cn("px-3 py-2.5 font-mono", o.price_stability_index >= 90 ? "text-accent" : o.price_stability_index >= 75 ? "text-yellow-500" : "text-destructive")}>{o.price_stability_index}%</td>
                      <td className={cn("px-3 py-2.5 font-mono font-semibold", pctColor(o.variance_vs_calculated))}>{o.variance_vs_calculated > 0 ? "+" : ""}{o.variance_vs_calculated.toFixed(1)}%</td>
                      <td className={cn("px-3 py-2.5 font-mono font-semibold", pctColor(o.variance_vs_clock))}>{o.variance_vs_clock > 0 ? "+" : ""}{o.variance_vs_clock.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </IHSectionShell>
      )}

      {/* ── SECTION 4 — Price Comparison ── */}
      {selectedProduct && (
        <IHSectionShell icon={BarChart3} title={`Prijsvergelijking — ${selectedProduct.product}`} subtitle="Klok vs Direct vs Berekend vs Markt">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Klokprijs", value: selectedProduct.clock_price, baseline: false },
              { label: "Directe prijs", value: selectedProduct.direct_price, baseline: false },
              { label: "Berekende prijs", value: selectedProduct.calculated_price, baseline: true },
              { label: "Beste marktprijs", value: selectedProduct.best_market_price, baseline: false },
            ].map(p => {
              const diff = selectedProduct.calculated_price > 0
                ? ((p.value - selectedProduct.calculated_price) / selectedProduct.calculated_price * 100)
                : 0;
              return (
                <div key={p.label} className={cn("rounded-xl border border-border p-3 flex flex-col gap-1", p.baseline && "ring-1 ring-primary/30")}>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase">{p.label}</span>
                  <span className="text-lg font-bold font-mono text-foreground">{fmtPrice(p.value)}</span>
                  {!p.baseline && (
                    <span className={cn("text-[10px] font-mono font-semibold", pctColor(diff))}>
                      {diff > 0 ? "+" : ""}{diff.toFixed(1)}% vs berekend
                    </span>
                  )}
                  {p.baseline && <span className="text-[10px] font-mono text-primary">referentieprijs</span>}
                </div>
              );
            })}
          </div>
        </IHSectionShell>
      )}

      {/* ── SECTION 5 — Signals ── */}
      <IHSectionShell icon={Radar} title="Opportunity & Risk Signals" subtitle="Inkoopsignalen op basis van marktdata" badge={`${signals.length} SIGNALEN`}>
        <div className="space-y-2">
          {signals.map((s, i) => (
            <div key={i} className={cn(
              "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-[11px]",
              s.type === "opportunity" ? "border-accent/20 bg-accent/5" : s.type === "risk" ? "border-destructive/20 bg-destructive/5" : "border-border bg-muted/10"
            )}>
              {s.type === "opportunity" ? <TrendingDown className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
              : s.type === "risk" ? <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
              : <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />}
              <div>
                <span className="font-semibold text-foreground">{s.product}</span>
                <span className="text-muted-foreground ml-1.5">{s.message}</span>
              </div>
            </div>
          ))}
        </div>
      </IHSectionShell>

      {/* ── SECTION 6 — Supplier Performance ── */}
      <IHSectionShell icon={ShoppingCart} title="Leveranciersprestatie" subtitle="Kwaliteit • Betrouwbaarheid • Prijsstabiliteit" badge={`${supplierPerformance.length} LEVERANCIERS`}>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {["Leverancier", "% Geaccepteerd", "% Afgekeurd", "Leverbetrouwb.", "Prijsstabiliteit"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-mono text-muted-foreground/50 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {supplierPerformance.map(s => (
                <tr key={s.name} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{s.name}</td>
                  <td className={cn("px-3 py-2.5 font-mono font-semibold", s.quality_accepted >= 95 ? "text-accent" : s.quality_accepted >= 90 ? "text-yellow-500" : "text-destructive")}>{s.quality_accepted}%</td>
                  <td className={cn("px-3 py-2.5 font-mono font-semibold", s.rejection_pct <= 3 ? "text-accent" : s.rejection_pct <= 7 ? "text-yellow-500" : "text-destructive")}>{s.rejection_pct}%</td>
                  <td className={cn("px-3 py-2.5 font-mono", s.delivery_reliability >= 95 ? "text-accent" : s.delivery_reliability >= 85 ? "text-yellow-500" : "text-destructive")}>{s.delivery_reliability}%</td>
                  <td className={cn("px-3 py-2.5 font-mono", s.price_stability >= 90 ? "text-accent" : s.price_stability >= 75 ? "text-yellow-500" : "text-destructive")}>{s.price_stability}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </IHSectionShell>
    </div>
  );
};

export default ProcurementMarketRadar;
