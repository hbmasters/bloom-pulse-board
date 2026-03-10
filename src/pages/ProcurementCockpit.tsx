import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Filter, RotateCcw, ChevronDown, ChevronRight, ExternalLink,
  TrendingUp, TrendingDown, Minus, Bot, ShoppingCart, AlertTriangle,
  Clock, Package, Truck, DollarSign, CheckCircle2, X, User,
  Wifi, WifiOff, RefreshCw, Settings2, Shield, Zap,
  ArrowUpRight, ArrowDownRight, Info, Eye, Boxes
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { DataMaturityBadge, SourceLabel } from "@/components/intelligence-hub/DataMaturityBadge";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type ChangeDirection = "up" | "down" | "stable";
type CoverageStatus = "covered" | "partial" | "open" | "at-risk";
type SourceHealth = "connected" | "delayed" | "stale" | "unavailable" | "manual";

interface SupplierOption {
  supplier: string;
  channel: string;
  available: number;
  price: number;
  deliveryDays: number;
  confidence: number;
  sourceHealth: SourceHealth;
  isBestPrice?: boolean;
}

interface ProcurementRow {
  id: string;
  article: string;
  stemLength: string;
  buyer: string;
  program: string;
  customer: string;
  forecastDemand: number;
  currentStock: number;
  allocated: number;
  coveredVolume: number;
  remainingToBuy: number;
  offerPrice: number;
  expectedPrice: number;
  historicalPrice: number;
  supplierCount: number;
  aiRecommendation: string;
  deliveryDate: string;
  coverageStatus: CoverageStatus;
  demandChange: ChangeDirection;
  demandSource: string;
  sourceHealth: SourceHealth;
  forecastConfidence: number;        // 0-100
  forecastHorizonDays: number;
  suppliers: SupplierOption[];
  variants?: { length: string; demand: number; covered: number; stock: number }[];
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                          */
/* ------------------------------------------------------------------ */

const demoRows: ProcurementRow[] = [
  {
    id: "p1", article: "Roos Red Naomi", stemLength: "60cm", buyer: "Mark",
    program: "Week 12 — AH", customer: "Albert Heijn",
    forecastDemand: 12400, currentStock: 1800, allocated: 1200, coveredVolume: 8200, remainingToBuy: 4200,
    offerPrice: 0.22, expectedPrice: 0.24, historicalPrice: 0.21,
    supplierCount: 3, aiRecommendation: "Koop vandaag via Floriday — prijsvoordeel 7%",
    deliveryDate: "2026-03-16", coverageStatus: "partial", demandChange: "up",
    demandSource: "Axerrio forecast", sourceHealth: "connected", forecastConfidence: 88, forecastHorizonDays: 3,
    suppliers: [
      { supplier: "Van der Berg Roses", channel: "Floriday", available: 5000, price: 0.22, deliveryDays: 2, confidence: 92, sourceHealth: "connected", isBestPrice: true },
      { supplier: "Porta Nova", channel: "Contract", available: 3000, price: 0.26, deliveryDays: 1, confidence: 98, sourceHealth: "connected" },
      { supplier: "Marktplaats NL", channel: "Marketplace", available: 2000, price: 0.28, deliveryDays: 3, confidence: 75, sourceHealth: "delayed" },
    ],
    variants: [
      { length: "50cm", demand: 3200, covered: 3200, stock: 400 },
      { length: "60cm", demand: 6400, covered: 3800, stock: 1000 },
      { length: "70cm", demand: 2800, covered: 1200, stock: 400 },
    ],
  },
  {
    id: "p2", article: "Pistacia", stemLength: "50cm", buyer: "Sandra",
    program: "Week 12 — Jumbo", customer: "Jumbo",
    forecastDemand: 6800, currentStock: 2400, allocated: 2400, coveredVolume: 6800, remainingToBuy: 0,
    offerPrice: 0.14, expectedPrice: 0.14, historicalPrice: 0.15,
    supplierCount: 2, aiRecommendation: "Volledig gedekt via contractleverancier",
    deliveryDate: "2026-03-17", coverageStatus: "covered", demandChange: "stable",
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 96, forecastHorizonDays: 5,
    suppliers: [
      { supplier: "Green Team", channel: "Contract", available: 7000, price: 0.14, deliveryDays: 1, confidence: 99, sourceHealth: "connected", isBestPrice: true },
      { supplier: "Flora Direct", channel: "Webshop", available: 3000, price: 0.16, deliveryDays: 2, confidence: 88, sourceHealth: "connected" },
    ],
    variants: [
      { length: "40cm", demand: 1800, covered: 1800, stock: 600 },
      { length: "50cm", demand: 3200, covered: 3200, stock: 1200 },
      { length: "60cm", demand: 1800, covered: 1800, stock: 600 },
    ],
  },
  {
    id: "p3", article: "Germini Barca", stemLength: "45cm", buyer: "Mark",
    program: "Week 12 — Aldi", customer: "Aldi",
    forecastDemand: 9200, currentStock: 600, allocated: 0, coveredVolume: 2100, remainingToBuy: 7100,
    offerPrice: 0.10, expectedPrice: 0.11, historicalPrice: 0.09,
    supplierCount: 4, aiRecommendation: "Vraagpiek verwacht morgen — nu inkopen",
    deliveryDate: "2026-03-15", coverageStatus: "at-risk", demandChange: "up",
    demandSource: "Axerrio forecast", sourceHealth: "connected", forecastConfidence: 72, forecastHorizonDays: 1,
    suppliers: [
      { supplier: "Germini World", channel: "Floriday", available: 4000, price: 0.10, deliveryDays: 2, confidence: 85, sourceHealth: "connected", isBestPrice: true },
      { supplier: "FlowerLink", channel: "Marketplace", available: 2500, price: 0.12, deliveryDays: 2, confidence: 72, sourceHealth: "stale" },
      { supplier: "Direct Grower", channel: "Webshop", available: 3000, price: 0.11, deliveryDays: 3, confidence: 80, sourceHealth: "connected" },
      { supplier: "BloemenVeiling", channel: "Floriday", available: 1500, price: 0.13, deliveryDays: 1, confidence: 90, sourceHealth: "connected" },
    ],
  },
  {
    id: "p4", article: "Alstroemeria Virginia", stemLength: "55cm", buyer: "—",
    program: "Week 13 — Lidl", customer: "Lidl",
    forecastDemand: 4600, currentStock: 0, allocated: 0, coveredVolume: 0, remainingToBuy: 4600,
    offerPrice: 0, expectedPrice: 0, historicalPrice: 0,
    supplierCount: 0, aiRecommendation: "Recept ontbreekt — productidentiteit onbekend",
    deliveryDate: "2026-03-20", coverageStatus: "open", demandChange: "stable",
    demandSource: "Forecast (onopgelost)", sourceHealth: "unavailable", forecastConfidence: 35, forecastHorizonDays: 8,
    suppliers: [],
  },
  {
    id: "p5", article: "Dianthus Nobbio", stemLength: "60cm", buyer: "Sandra",
    program: "Week 12 — Dekamarkt", customer: "Dekamarkt",
    forecastDemand: 3200, currentStock: 400, allocated: 400, coveredVolume: 1600, remainingToBuy: 1600,
    offerPrice: 0.17, expectedPrice: 0.18, historicalPrice: 0.16,
    supplierCount: 2, aiRecommendation: "Contractleverancier goedkoper dan markt",
    deliveryDate: "2026-03-16", coverageStatus: "partial", demandChange: "down",
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 91, forecastHorizonDays: 4,
    suppliers: [
      { supplier: "Carnation BV", channel: "Contract", available: 2000, price: 0.17, deliveryDays: 1, confidence: 95, sourceHealth: "connected", isBestPrice: true },
      { supplier: "FloriTrade", channel: "Floriday", available: 1500, price: 0.20, deliveryDays: 2, confidence: 82, sourceHealth: "connected" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const coverageBadge = (s: CoverageStatus) => {
  const map: Record<CoverageStatus, { label: string; cls: string }> = {
    covered: { label: "Gedekt", cls: "bg-accent/15 text-accent border-accent/30" },
    partial: { label: "Gedeeltelijk", cls: "bg-primary/15 text-primary border-primary/30" },
    open: { label: "Open", cls: "bg-muted text-muted-foreground border-border" },
    "at-risk": { label: "At Risk", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  };
  const { label, cls } = map[s];
  return <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border", cls)}>{label}</span>;
};

const changeIcon = (d: ChangeDirection) => {
  if (d === "up") return <TrendingUp className="w-3 h-3 text-accent" />;
  if (d === "down") return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => n > 0 ? `€${n.toFixed(2)}` : "—";

/* Source health icon */
const SourceHealthIcon = ({ health }: { health: SourceHealth }) => {
  const config: Record<SourceHealth, { icon: typeof Wifi; cls: string; label: string }> = {
    connected: { icon: Wifi, cls: "text-accent", label: "Verbonden" },
    delayed: { icon: Clock, cls: "text-yellow-500", label: "Vertraagd" },
    stale: { icon: RefreshCw, cls: "text-orange-500", label: "Verouderd" },
    unavailable: { icon: WifiOff, cls: "text-muted-foreground/40", label: "Niet beschikbaar" },
    manual: { icon: User, cls: "text-primary/60", label: "Handmatig" },
  };
  const c = config[health];
  const Icon = c.icon;
  return (
    <span title={c.label} className="inline-flex">
      <Icon className={cn("w-3 h-3", c.cls)} />
    </span>
  );
};

/* Procurement uplift/downside delta */
const ProcurementDelta = ({ offer, expected }: { offer: number; expected: number }) => {
  if (offer <= 0 || expected <= 0) return <span className="text-[10px] text-muted-foreground/40">—</span>;
  const delta = expected - offer;
  const pct = ((delta / expected) * 100);
  const isPositive = delta > 0;
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[10px] font-mono font-bold",
      isPositive ? "text-accent" : delta < 0 ? "text-destructive" : "text-muted-foreground"
    )}>
      {isPositive ? <ArrowDownRight className="w-3 h-3" /> : delta < 0 ? <ArrowUpRight className="w-3 h-3" /> : null}
      {delta !== 0 ? `${isPositive ? "-" : "+"}€${Math.abs(delta).toFixed(2)}` : "€0.00"}
      <span className="text-[8px] text-muted-foreground/60 ml-0.5">({pct > 0 ? "-" : "+"}{Math.abs(pct).toFixed(0)}%)</span>
    </span>
  );
};

/* Forecast confidence bar */
const ConfidenceBar = ({ confidence, horizonDays }: { confidence: number; horizonDays: number }) => {
  const level = confidence >= 85 ? "high" : confidence >= 60 ? "medium" : "low";
  const colors = { high: "bg-accent", medium: "bg-yellow-500", low: "bg-destructive" };
  const labels = { high: "Hoog", medium: "Medium", low: "Laag" };
  return (
    <div className="flex items-center gap-1.5" title={`${confidence}% confidence · horizon ${horizonDays}d`}>
      <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", colors[level])} style={{ width: `${confidence}%` }} />
      </div>
      <span className={cn("text-[8px] font-mono font-bold", level === "high" ? "text-accent" : level === "medium" ? "text-yellow-500" : "text-destructive")}>
        {labels[level]}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  KPI CARDS                                                          */
/* ------------------------------------------------------------------ */

const KpiCard = ({ icon: Icon, label, value, sub, accent }: {
  icon: typeof Package;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 min-w-0">
    <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", accent || "bg-primary/10")}>
      <Icon className={cn("w-4 h-4", accent ? "text-foreground/70" : "text-primary")} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider truncate">{label}</p>
      <p className="text-sm font-black text-foreground">{value}</p>
      {sub && <p className="text-[9px] font-mono text-muted-foreground">{sub}</p>}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  SUPPLIER PANEL                                                     */
/* ------------------------------------------------------------------ */

const SupplierPanel = ({ suppliers }: { suppliers: SupplierOption[] }) => {
  if (suppliers.length === 0) {
    return (
      <div className="flex items-center gap-2 py-3 px-4 text-muted-foreground">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span className="text-xs">Geen leveranciers beschikbaar — recept of artikelkoppeling ontbreekt</span>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-3">
      {suppliers.map((s, i) => (
        <div key={i} className={cn(
          "rounded-lg border p-3 space-y-1.5",
          s.isBestPrice ? "border-accent/40 bg-accent/5" : "border-border bg-card/50"
        )}>
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-foreground truncate">{s.supplier}</span>
            <div className="flex items-center gap-1">
              <SourceHealthIcon health={s.sourceHealth} />
              <Badge variant="outline" className="text-[8px] font-mono">{s.channel}</Badge>
            </div>
          </div>
          {s.isBestPrice && (
            <span className="text-[8px] font-mono font-bold text-accent uppercase tracking-wider">Beste prijs</span>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] font-mono">
            <span className="text-muted-foreground">Beschikbaar</span>
            <span className="text-foreground text-right">{fmt(s.available)}</span>
            <span className="text-muted-foreground">Prijs</span>
            <span className={cn("text-right font-bold", s.isBestPrice ? "text-accent" : "text-foreground")}>{fmtPrice(s.price)}</span>
            <span className="text-muted-foreground">Levertijd</span>
            <span className="text-foreground text-right">{s.deliveryDays}d</span>
            <span className="text-muted-foreground">Confidence</span>
            <span className={cn("text-right", s.confidence >= 90 ? "text-accent" : s.confidence >= 75 ? "text-primary" : "text-muted-foreground")}>{s.confidence}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  EXPANDABLE ROW                                                     */
/* ------------------------------------------------------------------ */

const ProcurementTableRow = ({ row }: { row: ProcurementRow }) => {
  const [open, setOpen] = useState(false);
  const netOpen = row.forecastDemand - row.currentStock - row.allocated;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <TableRow className="group cursor-pointer hover:bg-secondary/30" onClick={() => setOpen(!open)}>
        {/* Expand */}
        <TableCell className="w-6 px-1">
          <CollapsibleTrigger asChild>
            <button className="p-0.5" onClick={e => e.stopPropagation()}>
              {open ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
            </button>
          </CollapsibleTrigger>
        </TableCell>
        {/* Article */}
        <TableCell className="font-bold text-[11px] text-foreground whitespace-nowrap">{row.article}</TableCell>
        {/* Length */}
        <TableCell className="text-[10px] font-mono text-muted-foreground">{row.stemLength}</TableCell>
        {/* Buyer */}
        <TableCell className="text-[10px] font-mono text-foreground/70">{row.buyer}</TableCell>
        {/* Program */}
        <TableCell className="text-[11px] text-foreground max-w-[120px] truncate">{row.program}</TableCell>
        {/* Demand */}
        <TableCell className="text-[11px] font-mono text-foreground text-right tabular-nums">{fmt(row.forecastDemand)}</TableCell>
        {/* Stock */}
        <TableCell className="text-[11px] font-mono text-muted-foreground text-right tabular-nums">{fmt(row.currentStock)}</TableCell>
        {/* Allocated */}
        <TableCell className="text-[11px] font-mono text-muted-foreground text-right tabular-nums">{fmt(row.allocated)}</TableCell>
        {/* Covered */}
        <TableCell className="text-[11px] font-mono text-foreground text-right tabular-nums">{fmt(row.coveredVolume)}</TableCell>
        {/* Remaining */}
        <TableCell className={cn(
          "text-[11px] font-mono font-bold text-right tabular-nums",
          row.remainingToBuy > 0 ? "text-primary" : "text-accent"
        )}>{fmt(row.remainingToBuy)}</TableCell>
        {/* Offer price */}
        <TableCell className={cn(
          "text-[11px] font-mono text-right tabular-nums",
          row.offerPrice > 0 && row.offerPrice < row.expectedPrice ? "text-accent font-bold" : "text-foreground"
        )}>{fmtPrice(row.offerPrice)}</TableCell>
        {/* Expected price */}
        <TableCell className="text-[11px] font-mono text-foreground text-right tabular-nums">{fmtPrice(row.expectedPrice)}</TableCell>
        {/* Uplift/downside */}
        <TableCell className="text-right"><ProcurementDelta offer={row.offerPrice} expected={row.expectedPrice} /></TableCell>
        {/* Source */}
        <TableCell className="text-center"><SourceHealthIcon health={row.sourceHealth} /></TableCell>
        {/* Confidence */}
        <TableCell><ConfidenceBar confidence={row.forecastConfidence} horizonDays={row.forecastHorizonDays} /></TableCell>
        {/* Status */}
        <TableCell className="text-center">{coverageBadge(row.coverageStatus)}</TableCell>
        {/* AI */}
        <TableCell>
          <div className="flex items-center gap-1 max-w-[160px]">
            <Bot className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[9px] text-muted-foreground truncate">{row.aiRecommendation}</span>
          </div>
        </TableCell>
        {/* Change */}
        <TableCell className="text-center">{changeIcon(row.demandChange)}</TableCell>
        {/* Action */}
        <TableCell>
          {row.supplierCount > 0 && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-mono text-primary hover:text-primary">
              <ShoppingCart className="w-3 h-3 mr-0.5" />Koop
            </Button>
          )}
        </TableCell>
      </TableRow>

      <CollapsibleContent asChild>
        <tr>
          <td colSpan={19} className="p-0">
            <div className="border-t border-border bg-secondary/20">
              {/* AI Advice banner */}
              <div className="flex items-start gap-2 px-4 py-2.5 border-b border-border bg-primary/5">
                <Bot className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">AI Inkoopadvies</p>
                  <p className="text-[11px] text-muted-foreground">{row.aiRecommendation}</p>
                </div>
                <ConfidenceBar confidence={row.forecastConfidence} horizonDays={row.forecastHorizonDays} />
              </div>

              {/* Demand breakdown meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 px-4 py-2.5 border-b border-border text-[10px] font-mono">
                <div>
                  <span className="text-muted-foreground block">Bruto vraag</span>
                  <span className="text-foreground font-bold">{fmt(row.forecastDemand)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Voorraad</span>
                  <span className="text-foreground font-bold">{fmt(row.currentStock)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Toegewezen</span>
                  <span className="text-foreground font-bold">{fmt(row.allocated)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Gedekt</span>
                  <span className="text-accent font-bold">{fmt(row.coveredVolume)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Netto open</span>
                  <span className={cn("font-bold", netOpen > 0 ? "text-primary" : "text-accent")}>{fmt(Math.max(0, netOpen))}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Historische prijs</span>
                  <span className="text-foreground font-bold">{fmtPrice(row.historicalPrice)}</span>
                </div>
              </div>

              {/* Price comparison bar */}
              {row.offerPrice > 0 && (
                <div className="flex items-center gap-4 px-4 py-2 border-b border-border text-[10px] font-mono">
                  <span className="text-muted-foreground">Prijsvergelijking:</span>
                  <span className="text-muted-foreground">Historisch <span className="text-foreground font-bold">{fmtPrice(row.historicalPrice)}</span></span>
                  <span className="text-muted-foreground">Aanbieding <span className={cn("font-bold", row.offerPrice <= row.historicalPrice ? "text-accent" : "text-destructive")}>{fmtPrice(row.offerPrice)}</span></span>
                  <span className="text-muted-foreground">Verwacht <span className="text-foreground font-bold">{fmtPrice(row.expectedPrice)}</span></span>
                  <ProcurementDelta offer={row.offerPrice} expected={row.expectedPrice} />
                </div>
              )}

              {/* Source + meta */}
              <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-border text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1"><SourceHealthIcon health={row.sourceHealth} /> Bron: <SourceLabel source={row.demandSource} maturity={row.coverageStatus === "open" ? "unresolved" : row.coverageStatus === "partial" ? "partial" : "live"} /></span>
                <span>Klant: <span className="text-foreground">{row.customer}</span></span>
                <span>Buyer: <span className="text-foreground">{row.buyer}</span></span>
                <span>Leverdatum: <span className="text-foreground">{row.deliveryDate}</span></span>
                <DataMaturityBadge maturity={row.coverageStatus === "open" ? "unresolved" : row.coverageStatus === "partial" ? "partial" : "live"} size="sm" />
              </div>

              {/* Stem length variants */}
              {row.variants && row.variants.length > 0 && (
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Steellengte verdeling</p>
                  <div className="flex flex-wrap gap-2">
                    {row.variants.map((v, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-1.5">
                        <span className="text-[10px] font-mono font-bold text-foreground">{v.length}</span>
                        <span className="text-[9px] font-mono text-muted-foreground">{fmt(v.demand)} vraag</span>
                        <span className="text-[9px] font-mono text-muted-foreground/60">{fmt(v.stock)} voorraad</span>
                        <span className="text-[9px] font-mono text-accent">{fmt(v.covered)} gedekt</span>
                        {v.demand - v.covered > 0 && (
                          <span className="text-[9px] font-mono text-primary font-bold">{fmt(v.demand - v.covered)} open</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suppliers */}
              <SupplierPanel suppliers={row.suppliers} />

              {/* Action buttons */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border">
                {row.supplierCount > 0 && (
                  <>
                    <Button size="sm" className="h-7 text-[10px] font-mono font-bold gap-1.5">
                      <Bot className="w-3 h-3" /> Volg AI advies
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Open leverancier
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Markeer als ingekocht
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-mono text-muted-foreground gap-1.5">
                  <X className="w-3 h-3" /> Negeer
                </Button>
              </div>
            </div>
          </td>
        </tr>
      </CollapsibleContent>
    </Collapsible>
  );
};

/* ------------------------------------------------------------------ */
/*  FORECAST CONFIDENCE SUMMARY                                        */
/* ------------------------------------------------------------------ */

const ForecastConfidenceSummary = () => (
  <div className="rounded-lg border border-border bg-card p-3 space-y-2">
    <div className="flex items-center gap-2">
      <Eye className="w-3.5 h-3.5 text-primary" />
      <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">Forecast Horizon</span>
    </div>
    <div className="flex items-center gap-3 text-[10px] font-mono">
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> 1–2 dagen <span className="text-muted-foreground">hoog</span></span>
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 3–5 dagen <span className="text-muted-foreground">medium</span></span>
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> 5+ dagen <span className="text-muted-foreground">laag / onvolledig</span></span>
      <span className="text-muted-foreground/60 ml-2">Ontbrekende recepten verlagen confidence</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  AUTOMATION SETTINGS                                                */
/* ------------------------------------------------------------------ */

const AutomationSettings = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => {
  if (!open) return null;
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Inkoop Automatisering</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px]" onClick={onToggle}><X className="w-3 h-3" /></Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-2.5">
          <div>
            <p className="text-[10px] font-mono font-bold text-foreground">Auto-order</p>
            <p className="text-[9px] font-mono text-muted-foreground">Volg AI advies automatisch</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-2.5">
          <div>
            <p className="text-[10px] font-mono font-bold text-foreground">Max afwijking</p>
            <p className="text-[9px] font-mono text-muted-foreground">Prijs tolerantie</p>
          </div>
          <span className="text-xs font-mono font-bold text-primary">20%</span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-2.5">
          <div>
            <p className="text-[10px] font-mono font-bold text-foreground">Min. confidence</p>
            <p className="text-[9px] font-mono text-muted-foreground">Forecast drempel</p>
          </div>
          <span className="text-xs font-mono font-bold text-primary">85%</span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border bg-card p-2.5">
          <div>
            <p className="text-[10px] font-mono font-bold text-foreground">Bronvertrouwen</p>
            <p className="text-[9px] font-mono text-muted-foreground">Alleen verbonden bronnen</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <p className="text-[9px] font-mono text-muted-foreground/60 flex items-center gap-1">
        <Shield className="w-3 h-3" />
        Automatisering werkt alleen voor regels die aan alle criteria voldoen. Handmatige bevestiging blijft beschikbaar.
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  FILTER BAR                                                         */
/* ------------------------------------------------------------------ */

const FilterBar = () => (
  <div className="flex items-center gap-2 flex-wrap">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Filter className="w-3.5 h-3.5" />
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Filters</span>
    </div>

    {[
      { placeholder: "Datum", items: ["Vandaag", "Deze week", "Volgende week", "Week 12", "Week 13"] },
      { placeholder: "Buyer", items: ["Alle buyers", "Mark", "Sandra", "Niet toegewezen"] },
      { placeholder: "Klant", items: ["Alle klanten", "Albert Heijn", "Jumbo", "Aldi", "Lidl"] },
      { placeholder: "Artikel", items: ["Alle artikelen", "Roos", "Pistacia", "Germini", "Dianthus"] },
      { placeholder: "Kanaal", items: ["Alle kanalen", "Floriday", "Contract", "Webshop", "Marketplace"] },
      { placeholder: "Dekking", items: ["Alle statussen", "Open", "Gedeeltelijk", "At Risk", "Gedekt"] },
    ].map(f => (
      <Select key={f.placeholder}>
        <SelectTrigger className="h-7 w-[120px] text-[10px] font-mono bg-card border-border">
          <SelectValue placeholder={f.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {f.items.map(item => (
            <SelectItem key={item} value={item.toLowerCase().replace(/\s/g, "-")}>{item}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    ))}

    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-mono text-muted-foreground gap-1">
      <RotateCcw className="w-3 h-3" /> Reset
    </Button>
  </div>
);

/* ------------------------------------------------------------------ */
/*  TABLE HEADER                                                       */
/* ------------------------------------------------------------------ */

const thCls = "text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground";

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

const ProcurementCockpit = () => {
  const [showAutomation, setShowAutomation] = useState(false);

  const totalDemand = demoRows.reduce((s, r) => s + r.forecastDemand, 0);
  const totalCovered = demoRows.reduce((s, r) => s + r.coveredVolume, 0);
  const totalOpen = demoRows.reduce((s, r) => s + r.remainingToBuy, 0);
  const totalStock = demoRows.reduce((s, r) => s + r.currentStock, 0);
  const totalValue = demoRows.reduce((s, r) => s + r.remainingToBuy * r.expectedPrice, 0);
  const uniqueSuppliers = new Set(demoRows.flatMap(r => r.suppliers.map(s => s.supplier))).size;
  const avgConfidence = Math.round(demoRows.reduce((s, r) => s + r.forecastConfidence, 0) / demoRows.length);

  return (
    <div className="relative flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-3 md:p-5 space-y-3 max-w-[1800px] mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-sm md:text-base font-black text-foreground uppercase tracking-wider">Procurement Cockpit</h1>
              <p className="text-[10px] font-mono text-muted-foreground">Operationeel inkoopoverzicht — vraag · voorraad · leveranciers · AI advies</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1.5" onClick={() => setShowAutomation(!showAutomation)}>
                <Settings2 className="w-3 h-3" /> Automatisering
              </Button>
              <DataMaturityBadge maturity="partial" size="sm" />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <KpiCard icon={Package} label="Totale vraag" value={fmt(totalDemand)} sub="stelen" />
            <KpiCard icon={Boxes} label="Voorraad" value={fmt(totalStock)} sub="beschikbaar" />
            <KpiCard icon={CheckCircle2} label="Gedekt" value={fmt(totalCovered)} sub={`${Math.round((totalCovered / totalDemand) * 100)}%`} accent="bg-accent/15" />
            <KpiCard icon={ShoppingCart} label="Open inkoop" value={fmt(totalOpen)} sub="nog te kopen" />
            <KpiCard icon={DollarSign} label="Verwachte waarde" value={`€${totalValue.toFixed(0)}`} sub="open volume" />
            <KpiCard icon={Truck} label="Leveranciers" value={String(uniqueSuppliers)} sub="beschikbaar" />
            <KpiCard icon={Bot} label="AI Confidence" value={`${avgConfidence}%`} sub="gemiddeld" accent="bg-primary/10" />
          </div>

          {/* Automation settings */}
          <AutomationSettings open={showAutomation} onToggle={() => setShowAutomation(false)} />

          {/* Forecast confidence summary */}
          <ForecastConfidenceSummary />

          {/* Filters */}
          <FilterBar />

          {/* Procurement Table */}
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="w-6 px-1" />
                  <TableHead className={thCls}>Artikel</TableHead>
                  <TableHead className={thCls}>Lengte</TableHead>
                  <TableHead className={thCls}>Buyer</TableHead>
                  <TableHead className={thCls}>Programma</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Vraag</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Voorraad</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Toegew.</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Gedekt</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Open</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Aanbieding</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Verw. prijs</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Δ Marge</TableHead>
                  <TableHead className={cn(thCls, "text-center")}>Bron</TableHead>
                  <TableHead className={thCls}>Confidence</TableHead>
                  <TableHead className={cn(thCls, "text-center")}>Status</TableHead>
                  <TableHead className={thCls}>AI Advies</TableHead>
                  <TableHead className={cn(thCls, "text-center")}>Δ</TableHead>
                  <TableHead className={thCls}>Actie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoRows.map(row => (
                  <ProcurementTableRow key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground pb-4">
            <span>Laatst bijgewerkt: vandaag 08:42 · Bron: Axerrio forecast + productieorders</span>
            <span>{demoRows.length} artikelen · {uniqueSuppliers} leveranciers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCockpit;
