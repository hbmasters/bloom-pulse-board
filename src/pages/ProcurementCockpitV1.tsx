import { useState, useMemo } from "react";
import {
  ShoppingCart, FlaskConical, Package, AlertTriangle, CheckCircle2,
  TrendingDown, TrendingUp, BarChart3, ArrowUpDown, Search, ChevronDown,
  ChevronRight, Star, Shield, Clock, Zap, Eye, Users,
} from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import { cn } from "@/lib/utils";
import {
  procurementRows,
  supplierOffers,
  aiAdviceLabels,
  type ProcurementRow,
  type AIAdvice,
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

type SortKey = keyof ProcurementRow;
type SortDir = "asc" | "desc";

const ProcurementCockpitV1 = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("urgency");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [familyFilter, setFamilyFilter] = useState<string | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<string | null>(null);

  const families = useMemo(() => [...new Set(procurementRows.map(p => p.product_family))], []);

  const urgencyOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };

  const filtered = useMemo(() => {
    let list = procurementRows.filter(p => {
      if (search && !p.product.toLowerCase().includes(search.toLowerCase()) && !p.customer.toLowerCase().includes(search.toLowerCase())) return false;
      if (familyFilter && p.product_family !== familyFilter) return false;
      if (urgencyFilter && p.urgency !== urgencyFilter) return false;
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
  }, [search, sortKey, sortDir, familyFilter, urgencyFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  /* ── KPI totals ── */
  const totals = useMemo(() => {
    const rows = procurementRows;
    return {
      required: rows.reduce((s, p) => s + p.required_volume, 0),
      freeStock: rows.reduce((s, p) => s + p.free_stock, 0),
      reserved: rows.reduce((s, p) => s + p.reserved_stock, 0),
      openBuy: rows.reduce((s, p) => s + p.open_buy_need, 0),
      avgPressure: rows.reduce((s, p) => s + p.variance_vs_calculated, 0) / rows.length,
      actionNeeded: rows.filter(p => p.urgency === "high" || (p.open_buy_need > 0 && p.free_stock === 0)).length,
    };
  }, []);

  const expandedOffers = expandedId ? supplierOffers[expandedId] || [] : [];
  const expandedRow = procurementRows.find(p => p.id === expandedId);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground tracking-tight">Procurement Cockpit</h1>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <FlaskConical className="w-3 h-3" /> LABS · V1
        </span>
      </div>

      {/* ── SECTION 1 — KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Benodigd volume", value: fmt(totals.required), icon: Package },
          { label: "Vrije voorraad", value: fmt(totals.freeStock), icon: CheckCircle2 },
          { label: "Gereserveerd", value: fmt(totals.reserved), icon: Clock },
          { label: "Open inkoopbehoefte", value: fmt(totals.openBuy), icon: AlertTriangle, highlight: true },
          { label: "Gem. prijsdruk", value: `${totals.avgPressure > 0 ? "+" : ""}${totals.avgPressure.toFixed(1)}%`, icon: totals.avgPressure > 0 ? TrendingUp : TrendingDown, variant: totals.avgPressure > 0 ? "critical" as const : "success" as const },
          { label: "Actie nodig", value: `${totals.actionNeeded} producten`, icon: Zap, variant: "critical" as const },
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

      {/* ── SECTION 2 — Procurement List ── */}
      <IHSectionShell icon={ShoppingCart} title="Inkooplijst" subtitle="Klik op een rij voor leveranciersdetail" badge={`${filtered.length} PRODUCTEN`}>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Zoek product of klant..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setFamilyFilter(null)} className={cn("text-[10px] px-2 py-1 rounded-md border transition-colors", !familyFilter ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted")}>Alle</button>
            {families.map(f => (
              <button key={f} onClick={() => setFamilyFilter(f)} className={cn("text-[10px] px-2 py-1 rounded-md border transition-colors", familyFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted")}>{f}</button>
            ))}
          </div>
          <div className="flex gap-1">
            {(["high", "medium", "low"] as const).map(u => (
              <button key={u} onClick={() => setUrgencyFilter(urgencyFilter === u ? null : u)} className={cn("text-[10px] px-2 py-1 rounded-md border transition-colors", urgencyFilter === u ? urgencyBadge(u) : "border-border text-muted-foreground hover:bg-muted")}>
                {u === "high" ? "Urgent" : u === "medium" ? "Medium" : "Laag"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-2 py-2 w-6"></th>
                {([
                  ["product", "Product"],
                  ["customer", "Klant"],
                  ["program", "Programma"],
                  ["required_volume", "Benodigd"],
                  ["free_stock", "Vrij"],
                  ["open_buy_need", "Open Inkoop"],
                  ["calculated_price", "Berekend"],
                  ["best_price", "Beste Prijs"],
                  ["variance_vs_calculated", "Δ Berekend"],
                  ["preferred_supplier", "Voorkeur Lev."],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="px-3 py-2 text-left font-mono text-muted-foreground/50 font-semibold cursor-pointer hover:text-foreground select-none whitespace-nowrap" onClick={() => toggleSort(key)}>
                    <span className="inline-flex items-center gap-0.5">
                      {label}
                      {sortKey === key && <ArrowUpDown className="w-3 h-3" />}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2 text-left font-mono text-muted-foreground/50 font-semibold whitespace-nowrap">Lev. Score</th>
                <th className="px-3 py-2 text-left font-mono text-muted-foreground/50 font-semibold whitespace-nowrap">AI Advies</th>
                <th className="px-3 py-2 text-left font-mono text-muted-foreground/50 font-semibold cursor-pointer hover:text-foreground select-none whitespace-nowrap" onClick={() => toggleSort("urgency")}>
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

                return (
                  <>
                    <tr
                      key={p.id}
                      onClick={() => setExpandedId(isExpanded ? null : p.id)}
                      className={cn(
                        "border-b border-border/50 cursor-pointer transition-colors",
                        isExpanded ? "bg-primary/5" : "hover:bg-muted/10"
                      )}
                    >
                      <td className="px-2 py-2.5 text-muted-foreground">
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">
                        <div>{p.product}</div>
                        <div className="text-[9px] text-muted-foreground">{p.product_family}</div>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap text-[10px]">{p.customer}</td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap text-[10px]">{p.program}</td>
                      <td className="px-3 py-2.5 font-mono text-foreground/80">{fmt(p.required_volume)}</td>
                      <td className={cn("px-3 py-2.5 font-mono font-semibold", p.free_stock === 0 ? "text-destructive" : "text-accent")}>{fmt(p.free_stock)}</td>
                      <td className="px-3 py-2.5 font-mono font-bold text-foreground">{fmt(p.open_buy_need)}</td>
                      <td className="px-3 py-2.5 font-mono text-foreground/70">{fmtPrice(p.calculated_price)}</td>
                      <td className="px-3 py-2.5 font-mono font-semibold text-foreground">{fmtPrice(p.best_price)}</td>
                      <td className={cn("px-3 py-2.5 font-mono font-semibold", pctColor(p.variance_vs_calculated))}>{p.variance_vs_calculated > 0 ? "+" : ""}{p.variance_vs_calculated.toFixed(1)}%</td>
                      <td className="px-3 py-2.5 text-foreground/80 whitespace-nowrap text-[10px]">{p.preferred_supplier}</td>
                      <td className="px-3 py-2.5">
                        <span className={cn("inline-flex items-center gap-1 text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border", scoreBg(p.supplier_score), scoreColor(p.supplier_score))}>
                          <Star className="w-2.5 h-2.5" />{p.supplier_score}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn("text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border", adviceStyle.color)}>{adviceStyle.label}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={cn("text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full border", urgencyBadge(p.urgency))}>{p.urgency}</span>
                      </td>
                    </tr>

                    {/* ── SECTION 3 — Expanded Row Detail ── */}
                    {isExpanded && (
                      <tr key={`${p.id}-detail`} className="bg-muted/5">
                        <td colSpan={14} className="px-4 py-4">
                          <div className="space-y-4">
                            {/* Context cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                              <div className="rounded-lg border border-border p-2.5">
                                <span className="text-[8px] font-mono text-muted-foreground uppercase">Benodigd</span>
                                <div className="text-sm font-bold font-mono text-foreground">{fmt(p.required_volume)}</div>
                              </div>
                              <div className="rounded-lg border border-border p-2.5">
                                <span className="text-[8px] font-mono text-muted-foreground uppercase">Beschikbaar</span>
                                <div className="text-sm font-bold font-mono text-foreground">{fmt(p.available_stock)}</div>
                              </div>
                              <div className="rounded-lg border border-border p-2.5">
                                <span className="text-[8px] font-mono text-muted-foreground uppercase">Gereserveerd</span>
                                <div className="text-sm font-bold font-mono text-foreground">{fmt(p.reserved_stock)}</div>
                              </div>
                              <div className="rounded-lg border border-border p-2.5">
                                <span className="text-[8px] font-mono text-muted-foreground uppercase">Contract</span>
                                <div className="text-sm font-bold font-mono text-foreground">{fmt(p.contracted_volume)}</div>
                              </div>
                              <div className="rounded-lg border border-border p-2.5">
                                <span className="text-[8px] font-mono text-muted-foreground uppercase">Klokprijs</span>
                                <div className="text-sm font-bold font-mono text-foreground">{fmtPrice(p.clock_price)}</div>
                              </div>
                              <div className="rounded-lg border border-border p-2.5">
                                <span className="text-[8px] font-mono text-muted-foreground uppercase">Direct prijs</span>
                                <div className="text-sm font-bold font-mono text-foreground">{fmtPrice(p.direct_price)}</div>
                              </div>
                            </div>

                            {/* Supplier quality on row */}
                            <div className="flex flex-wrap gap-3">
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <Shield className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Kwaliteit:</span>
                                <span className={cn("font-mono font-semibold", scoreColor(p.supplier_quality))}>{p.supplier_quality}%</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Betrouwbaarheid:</span>
                                <span className={cn("font-mono font-semibold", scoreColor(p.supplier_reliability))}>{p.supplier_reliability}%</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <Users className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Klant:</span>
                                <span className="font-semibold text-foreground">{p.customer}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <BarChart3 className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Programma:</span>
                                <span className="font-semibold text-foreground">{p.program}</span>
                              </div>
                            </div>

                            {/* Supplier offers table */}
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-primary" />
                                Leveranciersaanbod ({offers.length} leveranciers)
                              </h4>
                              {offers.length === 0 ? (
                                <p className="text-[10px] text-muted-foreground italic">Geen leveranciersdata beschikbaar.</p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-[10px]">
                                    <thead>
                                      <tr className="border-b border-border bg-muted/20">
                                        {["Leverancier", "Prijs", "Aantal", "Levering", "Kwaliteit", "Betrouwb.", "Prijsstab.", "Δ Berekend", "Δ Klok", ""].map(h => (
                                          <th key={h} className="px-2.5 py-1.5 text-left font-mono text-muted-foreground/50 font-semibold whitespace-nowrap">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {offers.map(o => (
                                        <tr key={o.supplier_name} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                                          <td className="px-2.5 py-2 font-medium text-foreground whitespace-nowrap">{o.supplier_name}</td>
                                          <td className="px-2.5 py-2 font-mono font-semibold text-foreground">{fmtPrice(o.offer_price)}</td>
                                          <td className="px-2.5 py-2 font-mono text-foreground/70">{fmt(o.offer_quantity)}</td>
                                          <td className="px-2.5 py-2 text-muted-foreground">{o.delivery_timing}</td>
                                          <td className={cn("px-2.5 py-2 font-mono", scoreColor(o.supplier_quality_score))}>{o.supplier_quality_score}%</td>
                                          <td className={cn("px-2.5 py-2 font-mono", scoreColor(o.supplier_reliability_score))}>{o.supplier_reliability_score}%</td>
                                          <td className={cn("px-2.5 py-2 font-mono", o.price_stability_index >= 90 ? "text-accent" : o.price_stability_index >= 75 ? "text-yellow-500" : "text-destructive")}>{o.price_stability_index}%</td>
                                          <td className={cn("px-2.5 py-2 font-mono font-semibold", pctColor(o.variance_vs_calculated))}>{o.variance_vs_calculated > 0 ? "+" : ""}{o.variance_vs_calculated.toFixed(1)}%</td>
                                          <td className={cn("px-2.5 py-2 font-mono font-semibold", pctColor(o.variance_vs_clock))}>{o.variance_vs_clock > 0 ? "+" : ""}{o.variance_vs_clock.toFixed(1)}%</td>
                                          <td className="px-2.5 py-2">
                                            <button className="text-[9px] font-semibold text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 rounded px-2 py-0.5 transition-colors">Bekijk aanbod</button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>

                            {/* Price comparison mini-cards */}
                            <div>
                              <h4 className="text-xs font-semibold text-foreground mb-2">Prijsvergelijking</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  { label: "Klokprijs", value: p.clock_price },
                                  { label: "Directe prijs", value: p.direct_price },
                                  { label: "Berekende prijs", value: p.calculated_price, baseline: true },
                                  { label: "Beste prijs", value: p.best_price },
                                ].map(pc => {
                                  const diff = p.calculated_price > 0 ? ((pc.value - p.calculated_price) / p.calculated_price * 100) : 0;
                                  return (
                                    <div key={pc.label} className={cn("rounded-lg border border-border p-2.5 flex flex-col gap-0.5", pc.baseline && "ring-1 ring-primary/30")}>
                                      <span className="text-[8px] font-mono text-muted-foreground uppercase">{pc.label}</span>
                                      <span className="text-sm font-bold font-mono text-foreground">{fmtPrice(pc.value)}</span>
                                      {!pc.baseline && <span className={cn("text-[9px] font-mono font-semibold", pctColor(diff))}>{diff > 0 ? "+" : ""}{diff.toFixed(1)}%</span>}
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
                  </>
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
