import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Package, Warehouse, TrendingDown, TrendingUp, AlertTriangle, ShoppingCart,
  ChevronDown, ChevronRight, ArrowUpDown, Beaker, BarChart3, Activity,
  Clock, Zap, ShieldAlert, ArrowRight, ChevronLeft,
} from "lucide-react";
import {
  mockDecisionRows, computeKPIs, actionLabels, actionColors,
  type ProcurementDecisionRow, type ProcurementAction,
} from "@/components/procurement-decision/procurement-decision-data";
import {
  tradeRegistry, seasonalityLabels, riskLabels, availabilityLabels,
} from "@/components/procurement-cockpit-v1/procurement-extended-data";
import { cn } from "@/lib/utils";

/* ─── Helpers ─── */
const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => `€${n.toFixed(2)}`;
const devColor = (d: number) => d > 5 ? "text-rose-400" : d < -5 ? "text-emerald-400" : "text-muted-foreground";

/* ─── Supply Radar Signals ─── */
const computeRadarSignals = (rows: ProcurementDecisionRow[]) => {
  const signals: { label: string; severity: "info" | "warning" | "critical"; detail: string }[] = [];
  const highPressure = rows.filter(r => r.inventory_pressure_score > 70);
  if (highPressure.length > 0) signals.push({ label: "Stock ageing", severity: "critical", detail: `${highPressure.length} producten met hoge voorraaddruk` });
  const priceUp = rows.filter(r => r.price_deviation_pct > 10);
  if (priceUp.length > 0) signals.push({ label: "Price above expected", severity: "warning", detail: `${priceUp.length} producten boven verwachte prijs` });
  const lowReliability = rows.filter(r => r.supplier_reliability_score < 65);
  if (lowReliability.length > 0) signals.push({ label: "Supplier instability", severity: "warning", detail: `${lowReliability.length} leveranciers met lage betrouwbaarheid` });
  const substitutes = rows.filter(r => r.substitute_candidates.length > 0 && r.procurement_action === "consider_substitute");
  if (substitutes.length > 0) signals.push({ label: "Substitute recommended", severity: "info", detail: `${substitutes.length} producten met substituut-advies` });
  const markdown = rows.filter(r => r.markdown_advice);
  if (markdown.length > 0) signals.push({ label: "Markdown candidates", severity: "critical", detail: `${markdown.length} producten met markdown-advies` });
  const priceDown = rows.filter(r => r.price_deviation_pct < -10);
  if (priceDown.length > 0) signals.push({ label: "Forecast spike", severity: "info", detail: `${priceDown.length} producten met prijsdaling — inkoopkans` });
  return signals;
};

const signalColors = {
  info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

/* ─── KPI Card ─── */
const KPI = ({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; accent?: string;
}) => (
  <Card className="bg-card/60 backdrop-blur border-border/50 p-3 flex items-start gap-3">
    <div className={cn("rounded-lg p-2 shrink-0", accent || "bg-muted")}>
      <Icon className="h-4 w-4 text-foreground/80" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">{label}</p>
      <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  </Card>
);

/* ─── Action Badge ─── */
const ActionBadge = ({ action }: { action: ProcurementAction }) => (
  <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap", actionColors[action])}>
    {actionLabels[action]}
  </span>
);

/* ─── Score Bar ─── */
const ScoreBar = ({ value, max = 100 }: { value: number; max?: number }) => {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground w-7 text-right">{value}</span>
    </div>
  );
};

/* ─── Detail Panel ─── */
const DetailPanel = ({ row }: { row: ProcurementDecisionRow }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/30 border-t border-border/50">
    {/* Stock & Pressure */}
    <div className="space-y-2">
      <h4 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Inventory & Pressure</h4>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Stock days</span><span className="font-medium">{row.stock_days}d</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Turnover risk</span>
          <span className={cn("font-medium", row.turnover_risk === "high" ? "text-rose-400" : row.turnover_risk === "medium" ? "text-amber-400" : "text-emerald-400")}>
            {row.turnover_risk}
          </span>
        </div>
        <div className="flex justify-between"><span className="text-muted-foreground">Pressure score</span><span className="font-medium">{row.inventory_pressure_score}/100</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Waste-adj. price</span><span className="font-medium">{fmtPrice(row.waste_risk_adjusted_price)}</span></div>
        {row.markdown_advice && (
          <p className="text-[11px] text-rose-400 bg-rose-500/10 rounded p-2 mt-1">{row.markdown_advice}</p>
        )}
        {row.markup_advice && (
          <p className="text-[11px] text-teal-400 bg-teal-500/10 rounded p-2 mt-1">{row.markup_advice}</p>
        )}
        {row.sales_push_advice && (
          <p className="text-[11px] text-orange-400 bg-orange-500/10 rounded p-2 mt-1">{row.sales_push_advice}</p>
        )}
      </div>
    </div>

    {/* Supplier Quality */}
    <div className="space-y-2">
      <h4 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Supplier Intelligence</h4>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-muted-foreground">Supplier</span><span className="font-medium">{row.supplier}</span></div>
        <div><span className="text-muted-foreground">Quality</span><ScoreBar value={row.supplier_quality_score} /></div>
        <div><span className="text-muted-foreground">Reliability</span><ScoreBar value={row.supplier_reliability_score} /></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Price stability</span><span className="font-medium">{row.price_stability_index}/100</span></div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Hist. vorige maand</span>
          <span className="font-mono">{fmtPrice(row.historical_price_last_month)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Hist. vorig jaar</span>
          <span className="font-mono">{fmtPrice(row.historical_price_last_year)}</span>
        </div>
      </div>
    </div>

    {/* Substitutes & Mix */}
    <div className="space-y-2">
      <h4 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Substitute & Purchase Mix</h4>
      {row.substitute_candidates.length > 0 ? (
        <div className="space-y-1.5">
          {row.substitute_candidates.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-card/50 rounded p-1.5 border border-border/30">
              <span className="truncate flex-1">{s.name}</span>
              <span className={cn("text-[10px] px-1 rounded", s.availability === "high" ? "text-emerald-400" : s.availability === "medium" ? "text-amber-400" : "text-rose-400")}>
                {s.availability}
              </span>
              <span className="font-mono ml-2">{fmtPrice(s.price)}</span>
              <span className="text-muted-foreground ml-1 text-[10px]">{s.confidence}%</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic">No substitutes available</p>
      )}
      {row.purchase_mix_proposal.length > 1 && (
        <div className="mt-2 space-y-1">
          <p className="text-[10px] font-mono text-muted-foreground uppercase">Mix proposal</p>
          {row.purchase_mix_proposal.map((m, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="truncate flex-1">
                {m.type === "substitute" && <span className="text-amber-400 mr-1">↳</span>}
                {m.product}
              </span>
              <span className="font-mono">{m.units.toLocaleString()}</span>
              <span className="font-mono ml-2 text-muted-foreground">{fmtPrice(m.price)}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs font-medium border-t border-border/30 pt-1">
            <span>Weighted price</span>
            <span className="font-mono">{fmtPrice(row.weighted_purchase_price)}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

/* ─── Trade Registry Preview ─── */
const TradeRegistryPreview = () => {
  const [selectedProduct, setSelectedProduct] = useState(tradeRegistry[0]?.product || "");
  const entry = useMemo(() => tradeRegistry.find(t => t.product === selectedProduct), [selectedProduct]);
  const weeks = useMemo(() => entry?.weeks.slice(0, 8) || [], [entry]);
  const fmtP = (n: number) => `€${n.toFixed(3)}`;

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50 p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          Trade Registry — 8 weken vooruit
        </h3>
        <select
          value={selectedProduct}
          onChange={e => setSelectedProduct(e.target.value)}
          className="text-[10px] font-medium px-2 py-1 rounded-lg border border-border bg-background text-foreground cursor-pointer"
        >
          {tradeRegistry.map(t => (
            <option key={t.product} value={t.product}>{t.product}</option>
          ))}
        </select>
      </div>
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
                  <td className="px-2 py-1.5 font-mono font-semibold text-foreground">
                    W{w.week}{i === 0 && <span className="ml-1 text-[8px] text-primary">NU</span>}
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={cn("font-medium", avail.color)}>{avail.label}</span>
                  </td>
                  <td className="px-2 py-1.5 font-mono text-muted-foreground">{fmtP(w.expected_price_low)} – {fmtP(w.expected_price_high)}</td>
                  <td className="px-2 py-1.5"><span className={cn("font-medium", season.color)}>{season.label}</span></td>
                  <td className="px-2 py-1.5"><span className={cn("font-medium", risk.color)}>{risk.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

/* ─── Inventory Intelligence ─── */
const InventoryIntelligence = ({ rows }: { rows: ProcurementDecisionRow[] }) => {
  const highPressure = rows.filter(r => r.inventory_pressure_score > 60).sort((a, b) => b.inventory_pressure_score - a.inventory_pressure_score);
  const highTurnover = rows.filter(r => r.turnover_risk === "high");
  const markdownRows = rows.filter(r => r.markdown_advice);
  const useStockRows = rows.filter(r => r.procurement_action === "use_stock");

  return (
    <Card className="bg-card/60 backdrop-blur border-border/50 p-4 space-y-3">
      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
        Inventory Intelligence
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-muted/20 p-2.5">
          <p className="text-[9px] font-mono uppercase text-muted-foreground">High pressure</p>
          <p className="text-base font-bold text-foreground">{highPressure.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-2.5">
          <p className="text-[9px] font-mono uppercase text-muted-foreground">Turnover risk</p>
          <p className="text-base font-bold text-rose-400">{highTurnover.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-2.5">
          <p className="text-[9px] font-mono uppercase text-muted-foreground">Markdown advies</p>
          <p className="text-base font-bold text-amber-400">{markdownRows.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/20 p-2.5">
          <p className="text-[9px] font-mono uppercase text-muted-foreground">Use stock first</p>
          <p className="text-base font-bold text-sky-400">{useStockRows.length}</p>
        </div>
      </div>
      {highPressure.length > 0 && (
        <div className="space-y-1.5">
          {highPressure.slice(0, 4).map(r => (
            <div key={r.id} className="flex items-center justify-between text-xs bg-muted/20 rounded-lg p-2 border border-border/30">
              <span className="font-medium text-foreground truncate flex-1">{r.product}</span>
              <span className="text-muted-foreground font-mono mr-3">{r.stock_days}d</span>
              <span className={cn("text-[10px] font-medium", r.turnover_risk === "high" ? "text-rose-400" : r.turnover_risk === "medium" ? "text-amber-400" : "text-emerald-400")}>
                {r.turnover_risk} risk
              </span>
              <span className="font-mono ml-3 text-muted-foreground">{r.inventory_pressure_score}/100</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
const PurchasingListV1 = () => {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [sortCol, setSortCol] = useState<string>("product");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const kpis = useMemo(() => computeKPIs(mockDecisionRows), []);
  const radarSignals = useMemo(() => computeRadarSignals(mockDecisionRows), []);

  const filtered = useMemo(() => {
    let rows = [...mockDecisionRows];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r => r.product.toLowerCase().includes(q) || r.substitute_bundle.toLowerCase().includes(q) || r.supplier.toLowerCase().includes(q));
    }
    if (actionFilter !== "all") rows = rows.filter(r => r.procurement_action === actionFilter);
    rows.sort((a, b) => {
      const av = (a as any)[sortCol];
      const bv = (b as any)[sortCol];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return rows;
  }, [search, actionFilter, sortCol, sortDir]);

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortHead = ({ col, children, className }: { col: string; children: React.ReactNode; className?: string }) => (
    <TableHead className={cn("cursor-pointer select-none hover:text-foreground transition-colors", className)} onClick={() => toggleSort(col)}>
      <div className="flex items-center gap-1">{children}<ArrowUpDown className="h-3 w-3 opacity-40" /></div>
    </TableHead>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-5">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Purchasing List</h1>
          </div>
          
          <Badge variant="outline" className="text-[9px] font-mono border-amber-500/50 text-amber-400">LABS / BETA</Badge>
        </div>

        {/* ── SECTION 1: Supply Radar ── */}
        <div className="space-y-3">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2">
            <KPI label="Required" value={fmt(kpis.totalRequired)} icon={Package} accent="bg-primary/20" />
            <KPI label="Current stock" value={fmt(kpis.totalStock)} icon={Warehouse} accent="bg-sky-500/20" />
            <KPI label="Free stock" value={fmt(kpis.totalFree)} icon={Warehouse} accent="bg-emerald-500/20" />
            <KPI label="Order units" value={fmt(kpis.totalOrder)} icon={ShoppingCart} accent="bg-violet-500/20" />
            <KPI label="Avg pressure" value={`${kpis.avgPressure}/100`} icon={BarChart3} accent={kpis.avgPressure > 60 ? "bg-rose-500/20" : "bg-muted"} />
            <KPI label="Avg price dev" value={`${kpis.avgDeviation > 0 ? "+" : ""}${kpis.avgDeviation}%`} icon={kpis.avgDeviation > 0 ? TrendingUp : TrendingDown} accent={Math.abs(kpis.avgDeviation) > 10 ? "bg-amber-500/20" : "bg-muted"} />
            <KPI label="Action needed" value={kpis.actionNeeded} icon={AlertTriangle} accent="bg-amber-500/20" />
            <KPI label="Markdown" value={kpis.markdownCandidates} icon={TrendingDown} accent="bg-rose-500/20" />
            <KPI label="Markup" value={kpis.markupOpportunities} icon={TrendingUp} accent="bg-teal-500/20" />
          </div>

          {/* Radar Signals */}
          {radarSignals.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {radarSignals.map((s, i) => (
                <div key={i} className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold", signalColors[s.severity])}>
                  {s.severity === "critical" ? <ShieldAlert className="h-3 w-3" /> : s.severity === "warning" ? <AlertTriangle className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                  {s.label}
                  <span className="font-normal opacity-80 hidden sm:inline">— {s.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search product / bundle / supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 h-8 text-xs bg-card/60"
          />
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48 h-8 text-xs bg-card/60">
              <SelectValue placeholder="Filter action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {Object.entries(actionLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-[10px] text-muted-foreground font-mono ml-auto">{filtered.length} rows</span>
        </div>

        {/* ── SECTION 2: Purchasing Decision Table ── */}
        <Card className="bg-card/60 backdrop-blur border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="w-8" />
                  <SortHead col="product">Product</SortHead>
                  <SortHead col="substitute_bundle" className="hidden lg:table-cell">Bundle</SortHead>
                  <SortHead col="required_units" className="text-right">Required</SortHead>
                  <SortHead col="current_stock" className="text-right hidden md:table-cell">Stock</SortHead>
                  <SortHead col="free_stock" className="text-right hidden md:table-cell">Free</SortHead>
                  <SortHead col="order_units" className="text-right">Order</SortHead>
                  <SortHead col="market_price" className="text-right hidden lg:table-cell">Market €</SortHead>
                  <SortHead col="historical_price_last_month" className="text-right hidden xl:table-cell">Hist. MoM</SortHead>
                  <SortHead col="historical_price_last_year" className="text-right hidden xl:table-cell">Hist. YoY</SortHead>
                  <SortHead col="supplier" className="hidden lg:table-cell">Supplier</SortHead>
                  <SortHead col="price_deviation_pct" className="text-right hidden lg:table-cell">Δ Price</SortHead>
                  <SortHead col="supplier_quality_score" className="text-right hidden xl:table-cell">Quality</SortHead>
                  <SortHead col="inventory_pressure_score" className="text-right hidden xl:table-cell">Pressure</SortHead>
                  <SortHead col="procurement_action">Action</SortHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(row => {
                  const open = expandedId === row.id;
                  return (
                    <>
                      <TableRow key={row.id} className="border-border/30 cursor-pointer group" onClick={() => setExpandedId(open ? null : row.id)}>
                        <TableCell className="w-8 pr-0">
                          {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="font-medium text-xs">{row.product}</TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{row.substitute_bundle}</TableCell>
                        <TableCell className="text-right text-xs font-mono">{fmt(row.required_units)}</TableCell>
                        <TableCell className="text-right text-xs font-mono hidden md:table-cell">{fmt(row.current_stock)}</TableCell>
                        <TableCell className="text-right text-xs font-mono hidden md:table-cell">{fmt(row.free_stock)}</TableCell>
                        <TableCell className="text-right text-xs font-mono font-medium">{fmt(row.order_units)}</TableCell>
                        <TableCell className="text-right text-xs font-mono hidden lg:table-cell">{fmtPrice(row.market_price)}</TableCell>
                        <TableCell className="text-right text-xs font-mono hidden xl:table-cell text-muted-foreground">{fmtPrice(row.historical_price_last_month)}</TableCell>
                        <TableCell className="text-right text-xs font-mono hidden xl:table-cell text-muted-foreground">{fmtPrice(row.historical_price_last_year)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{row.supplier}</TableCell>
                        <TableCell className={cn("text-right text-xs font-mono hidden lg:table-cell", devColor(row.price_deviation_pct))}>
                          {row.price_deviation_pct > 0 ? "+" : ""}{row.price_deviation_pct.toFixed(1)}%
                        </TableCell>
                        <TableCell className="text-right hidden xl:table-cell"><ScoreBar value={row.supplier_quality_score} /></TableCell>
                        <TableCell className="text-right hidden xl:table-cell"><ScoreBar value={row.inventory_pressure_score} /></TableCell>
                        <TableCell><ActionBadge action={row.procurement_action} /></TableCell>
                      </TableRow>
                      {open && (
                        <TableRow key={`${row.id}-detail`} className="border-border/30 hover:bg-transparent">
                          <TableCell colSpan={15} className="p-0">
                            <DetailPanel row={row} />
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* ── SECTION 3 & 4: Inventory Intelligence + Trade Registry ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <InventoryIntelligence rows={mockDecisionRows} />
          <TradeRegistryPreview />
        </div>
      </div>
    </div>
  );
};

export default PurchasingListV1;
