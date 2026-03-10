import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter, RotateCcw, ChevronDown, ChevronRight, ExternalLink,
  TrendingUp, TrendingDown, Minus, Bot, ShoppingCart, AlertTriangle,
  Clock, Package, Truck, DollarSign, CheckCircle2, X, User,
  Wifi, WifiOff, RefreshCw, Settings2, Shield, Zap,
  ArrowUpRight, ArrowDownRight, Eye, Boxes, Loader2,
  Star, AlertCircle, Check
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
type PurchaseState = "open" | "buying" | "purchased";
type QualityGrade = "A1" | "A2" | "B1" | "B2" | "—";

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
  quality: QualityGrade;
  species: string;
  buyer: string;
  program: string;
  customer: string;
  forecastDemand: number;
  currentStock: number;
  allocated: number;
  coveredVolume: number;
  remainingToBuy: number;
  historicalPrice: number;
  offerPrice: number;
  advicePrice: number;
  expectedPrice: number;
  supplierCount: number;
  aiRecommendation: string;
  deliveryDate: string;
  coverageStatus: CoverageStatus;
  demandChange: ChangeDirection;
  demandChangePercent: number;
  demandSource: string;
  sourceHealth: SourceHealth;
  forecastConfidence: number;
  forecastHorizonDays: number;
  purchaseState: PurchaseState;
  purchasedQuantity: number;
  purchasedAt?: string;
  suppliers: SupplierOption[];
  variants?: { length: string; demand: number; covered: number; stock: number }[];
  section: "urgent" | "today" | "upcoming" | "completed";
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                          */
/* ------------------------------------------------------------------ */

const demoRows: ProcurementRow[] = [
  // URGENT
  {
    id: "p3", article: "Germini Barca", stemLength: "45cm", quality: "A1", species: "Germini",
    buyer: "Mark", program: "Week 12 — Aldi", customer: "Aldi",
    forecastDemand: 9200, currentStock: 600, allocated: 0, coveredVolume: 2100, remainingToBuy: 7100,
    historicalPrice: 0.09, offerPrice: 0.10, advicePrice: 0.10, expectedPrice: 0.11,
    supplierCount: 4, aiRecommendation: "Vraagpiek verwacht morgen — nu inkopen via Floriday",
    deliveryDate: "2026-03-15", coverageStatus: "at-risk", demandChange: "up", demandChangePercent: 24,
    demandSource: "Axerrio forecast", sourceHealth: "connected", forecastConfidence: 72, forecastHorizonDays: 1,
    purchaseState: "open", purchasedQuantity: 0, section: "urgent",
    suppliers: [
      { supplier: "Germini World", channel: "Floriday", available: 4000, price: 0.10, deliveryDays: 2, confidence: 85, sourceHealth: "connected", isBestPrice: true },
      { supplier: "FlowerLink", channel: "Marketplace", available: 2500, price: 0.12, deliveryDays: 2, confidence: 72, sourceHealth: "stale" },
      { supplier: "Direct Grower", channel: "Webshop", available: 3000, price: 0.11, deliveryDays: 3, confidence: 80, sourceHealth: "connected" },
      { supplier: "BloemenVeiling", channel: "Floriday", available: 1500, price: 0.13, deliveryDays: 1, confidence: 90, sourceHealth: "connected" },
    ],
  },
  {
    id: "p4", article: "Alstroemeria Virginia", stemLength: "55cm", quality: "—", species: "Alstroemeria",
    buyer: "—", program: "Week 13 — Lidl", customer: "Lidl",
    forecastDemand: 4600, currentStock: 0, allocated: 0, coveredVolume: 0, remainingToBuy: 4600,
    historicalPrice: 0, offerPrice: 0, advicePrice: 0, expectedPrice: 0,
    supplierCount: 0, aiRecommendation: "Recept ontbreekt — productidentiteit onbekend",
    deliveryDate: "2026-03-20", coverageStatus: "open", demandChange: "stable", demandChangePercent: 0,
    demandSource: "Forecast (onopgelost)", sourceHealth: "unavailable", forecastConfidence: 35, forecastHorizonDays: 8,
    purchaseState: "open", purchasedQuantity: 0, section: "urgent",
    suppliers: [],
  },
  // TODAY
  {
    id: "p1", article: "Roos Red Naomi", stemLength: "60cm", quality: "A1", species: "Rosa",
    buyer: "Mark", program: "Week 12 — AH", customer: "Albert Heijn",
    forecastDemand: 12400, currentStock: 1800, allocated: 1200, coveredVolume: 8200, remainingToBuy: 4200,
    historicalPrice: 0.21, offerPrice: 0.22, advicePrice: 0.22, expectedPrice: 0.24,
    supplierCount: 3, aiRecommendation: "Koop vandaag via Floriday — prijsvoordeel 7%",
    deliveryDate: "2026-03-16", coverageStatus: "partial", demandChange: "up", demandChangePercent: 8,
    demandSource: "Axerrio forecast", sourceHealth: "connected", forecastConfidence: 88, forecastHorizonDays: 3,
    purchaseState: "open", purchasedQuantity: 0, section: "today",
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
    id: "p5", article: "Dianthus Nobbio", stemLength: "60cm", quality: "A2", species: "Dianthus",
    buyer: "Sandra", program: "Week 12 — Dekamarkt", customer: "Dekamarkt",
    forecastDemand: 3200, currentStock: 400, allocated: 400, coveredVolume: 1600, remainingToBuy: 1600,
    historicalPrice: 0.16, offerPrice: 0.17, advicePrice: 0.17, expectedPrice: 0.18,
    supplierCount: 2, aiRecommendation: "Contractleverancier goedkoper dan markt",
    deliveryDate: "2026-03-16", coverageStatus: "partial", demandChange: "down", demandChangePercent: -5,
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 91, forecastHorizonDays: 4,
    purchaseState: "open", purchasedQuantity: 0, section: "today",
    suppliers: [
      { supplier: "Carnation BV", channel: "Contract", available: 2000, price: 0.17, deliveryDays: 1, confidence: 95, sourceHealth: "connected", isBestPrice: true },
      { supplier: "FloriTrade", channel: "Floriday", available: 1500, price: 0.20, deliveryDays: 2, confidence: 82, sourceHealth: "connected" },
    ],
  },
  // UPCOMING
  {
    id: "p2", article: "Pistacia", stemLength: "50cm", quality: "A1", species: "Pistacia",
    buyer: "Sandra", program: "Week 12 — Jumbo", customer: "Jumbo",
    forecastDemand: 6800, currentStock: 2400, allocated: 2400, coveredVolume: 6800, remainingToBuy: 0,
    historicalPrice: 0.15, offerPrice: 0.14, advicePrice: 0.14, expectedPrice: 0.14,
    supplierCount: 2, aiRecommendation: "Volledig gedekt via contractleverancier",
    deliveryDate: "2026-03-17", coverageStatus: "covered", demandChange: "stable", demandChangePercent: 0,
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 96, forecastHorizonDays: 5,
    purchaseState: "open", purchasedQuantity: 0, section: "upcoming",
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
  // COMPLETED
  {
    id: "p6", article: "Chrysant Bacardi", stemLength: "65cm", quality: "A1", species: "Chrysant",
    buyer: "Mark", program: "Week 12 — AH", customer: "Albert Heijn",
    forecastDemand: 5400, currentStock: 800, allocated: 800, coveredVolume: 5400, remainingToBuy: 0,
    historicalPrice: 0.12, offerPrice: 0.11, advicePrice: 0.11, expectedPrice: 0.12,
    supplierCount: 2, aiRecommendation: "Ingekocht via Floriday — 8% onder verwachte prijs",
    deliveryDate: "2026-03-15", coverageStatus: "covered", demandChange: "stable", demandChangePercent: 0,
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 95, forecastHorizonDays: 2,
    purchaseState: "purchased", purchasedQuantity: 4600, purchasedAt: "08:12", section: "completed",
    suppliers: [
      { supplier: "ChrysantenKwekerij", channel: "Floriday", available: 6000, price: 0.11, deliveryDays: 1, confidence: 97, sourceHealth: "connected", isBestPrice: true },
    ],
  },
  {
    id: "p7", article: "Eucalyptus Parvifolia", stemLength: "60cm", quality: "A2", species: "Eucalyptus",
    buyer: "Sandra", program: "Week 12 — Jumbo", customer: "Jumbo",
    forecastDemand: 3800, currentStock: 200, allocated: 200, coveredVolume: 3800, remainingToBuy: 0,
    historicalPrice: 0.08, offerPrice: 0.07, advicePrice: 0.07, expectedPrice: 0.08,
    supplierCount: 1, aiRecommendation: "Ingekocht via contract — voorraad bevestigd",
    deliveryDate: "2026-03-15", coverageStatus: "covered", demandChange: "stable", demandChangePercent: 0,
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 98, forecastHorizonDays: 2,
    purchaseState: "purchased", purchasedQuantity: 3600, purchasedAt: "07:48", section: "completed",
    suppliers: [
      { supplier: "Green Direct", channel: "Contract", available: 5000, price: 0.07, deliveryDays: 1, confidence: 99, sourceHealth: "connected", isBestPrice: true },
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

const changeIcon = (d: ChangeDirection, pct: number) => {
  if (d === "up") return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-accent">
      <TrendingUp className="w-3 h-3" />+{Math.abs(pct)}%
    </span>
  );
  if (d === "down") return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-destructive">
      <TrendingDown className="w-3 h-3" />{pct}%
    </span>
  );
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const qualityBadge = (q: QualityGrade) => {
  if (q === "—") return <span className="text-[9px] text-muted-foreground/40">—</span>;
  const cls = q === "A1" ? "bg-accent/15 text-accent border-accent/30"
    : q === "A2" ? "bg-primary/15 text-primary border-primary/30"
    : "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border inline-flex items-center gap-0.5", cls)}>
      <Star className="w-2.5 h-2.5" />{q}
    </span>
  );
};

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => n > 0 ? `€${n.toFixed(2)}` : "—";

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
  return <span title={c.label} className="inline-flex"><Icon className={cn("w-3 h-3", c.cls)} /></span>;
};

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

const ConfidenceBar = ({ confidence, horizonDays }: { confidence: number; horizonDays: number }) => {
  const level = confidence >= 85 ? "high" : confidence >= 60 ? "medium" : "low";
  const colors = { high: "bg-accent", medium: "bg-yellow-500", low: "bg-destructive" };
  return (
    <div className="flex items-center gap-1.5" title={`${confidence}% · ${horizonDays}d`}>
      <div className="w-10 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full", colors[level])} style={{ width: `${confidence}%` }} />
      </div>
      <span className={cn("text-[8px] font-mono font-bold", level === "high" ? "text-accent" : level === "medium" ? "text-yellow-500" : "text-destructive")}>
        {confidence}%
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  BUY BUTTON WITH LOADER                                             */
/* ------------------------------------------------------------------ */

const BuyButton = ({ row, onBuy }: { row: ProcurementRow; onBuy: (id: string) => void }) => {
  if (row.purchaseState === "purchased") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-accent">
        <Check className="w-3 h-3" /> Gekocht
      </span>
    );
  }
  if (row.purchaseState === "buying") {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-primary animate-pulse">
        <Loader2 className="w-3 h-3 animate-spin" /> Bestellen…
      </span>
    );
  }
  if (row.supplierCount === 0) return null;
  return (
    <Button
      variant="ghost" size="sm"
      className="h-6 px-2 text-[9px] font-mono text-primary hover:text-primary hover:bg-primary/10"
      onClick={e => { e.stopPropagation(); onBuy(row.id); }}
    >
      <ShoppingCart className="w-3 h-3 mr-0.5" />Koop
    </Button>
  );
};

/* ------------------------------------------------------------------ */
/*  SECTION HEADER IN TABLE                                            */
/* ------------------------------------------------------------------ */

const SectionHeader = ({ label, count, icon: Icon, accent }: {
  label: string; count: number; icon: typeof AlertTriangle; accent: string;
}) => (
  <TableRow className="bg-secondary/10 border-t-2 border-border">
    <TableCell colSpan={20} className="py-2 px-3">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-3.5 h-3.5", accent)} />
        <span className={cn("text-[10px] font-mono font-black uppercase tracking-widest", accent)}>{label}</span>
        <span className="text-[9px] font-mono text-muted-foreground">({count})</span>
      </div>
    </TableCell>
  </TableRow>
);

/* ------------------------------------------------------------------ */
/*  FORECAST DEVIATION ALERT                                           */
/* ------------------------------------------------------------------ */

const ForecastDeviationAlert = ({ rows }: { rows: ProcurementRow[] }) => {
  const deviations = rows.filter(r => Math.abs(r.demandChangePercent) >= 10 && r.section !== "completed");
  if (deviations.length === 0) return null;
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-destructive" />
        <span className="text-xs font-bold text-destructive">Prognose Afwijkingen</span>
        <Badge variant="outline" className="text-[8px] font-mono border-destructive/30 text-destructive">{deviations.length} alert{deviations.length > 1 ? "s" : ""}</Badge>
      </div>
      <div className="space-y-1">
        {deviations.map(d => (
          <div key={d.id} className="flex items-center gap-3 text-[10px] font-mono">
            <span className="font-bold text-foreground min-w-[140px]">{d.article}</span>
            <span className={cn(
              "font-bold",
              d.demandChangePercent > 0 ? "text-accent" : "text-destructive"
            )}>
              {d.demandChangePercent > 0 ? "+" : ""}{d.demandChangePercent}% vraag
            </span>
            <span className="text-muted-foreground">{d.program}</span>
            <span className="text-muted-foreground/60">→ {d.aiRecommendation}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  HIGH-LEVEL AI ADVICE BANNER                                        */
/* ------------------------------------------------------------------ */

const AIAdviceBanner = ({ rows }: { rows: ProcurementRow[] }) => {
  const urgent = rows.filter(r => r.section === "urgent").length;
  const atRisk = rows.filter(r => r.coverageStatus === "at-risk").length;
  const totalOpenValue = rows.filter(r => r.remainingToBuy > 0).reduce((s, r) => s + r.remainingToBuy * (r.advicePrice || r.expectedPrice), 0);
  const purchased = rows.filter(r => r.purchaseState === "purchased").length;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/15 shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground mb-1">AI Inkoopadvies — Hoogover</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-muted-foreground">
            {urgent > 0 && <span className="text-destructive font-bold">{urgent} urgente items — direct actie vereist</span>}
            {atRisk > 0 && <span className="text-destructive">{atRisk} at-risk posities</span>}
            <span>Open waarde: <span className="text-foreground font-bold">€{totalOpenValue.toFixed(0)}</span></span>
            <span className="text-accent">{purchased} regels vandaag afgerond</span>
          </div>
          {urgent > 0 && (
            <p className="text-[10px] font-mono text-primary mt-1">
              Advies: focus op urgente items — Germini Barca vraagpiek +24%, Alstroemeria recept ontbreekt
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  KPI CARDS                                                          */
/* ------------------------------------------------------------------ */

const KpiCard = ({ icon: Icon, label, value, sub, accent }: {
  icon: typeof Package; label: string; value: string; sub?: string; accent?: string;
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
          {s.isBestPrice && <span className="text-[8px] font-mono font-bold text-accent uppercase tracking-wider">Beste prijs</span>}
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] font-mono">
            <span className="text-muted-foreground">Beschikbaar</span>
            <span className="text-foreground text-right">{fmt(s.available)}</span>
            <span className="text-muted-foreground">Prijs</span>
            <span className={cn("text-right font-bold", s.isBestPrice ? "text-accent" : "text-foreground")}>{fmtPrice(s.price)}</span>
            <span className="text-muted-foreground">Levertijd</span>
            <span className="text-foreground text-right">{s.deliveryDays}d</span>
            <span className="text-muted-foreground">Confidence</span>
            <span className={cn("text-right", s.confidence >= 90 ? "text-accent" : "text-foreground")}>{s.confidence}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  EXPANDABLE ROW                                                     */
/* ------------------------------------------------------------------ */

const ProcurementTableRow = ({ row, onBuy }: { row: ProcurementRow; onBuy: (id: string) => void }) => {
  const [open, setOpen] = useState(false);
  const isPurchased = row.purchaseState === "purchased";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <TableRow
        className={cn(
          "group cursor-pointer hover:bg-secondary/30",
          isPurchased && "opacity-60 bg-accent/5"
        )}
        onClick={() => setOpen(!open)}
      >
        <TableCell className="w-6 px-1">
          <CollapsibleTrigger asChild>
            <button className="p-0.5" onClick={e => e.stopPropagation()}>
              {open ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
            </button>
          </CollapsibleTrigger>
        </TableCell>
        {/* Article */}
        <TableCell className="font-bold text-[11px] text-foreground whitespace-nowrap">
          {row.article}
          {isPurchased && <span className="ml-1.5 text-[8px] font-mono text-accent">✓ {row.purchasedAt}</span>}
        </TableCell>
        {/* Species */}
        <TableCell className="text-[10px] font-mono text-muted-foreground">{row.species}</TableCell>
        {/* Quality */}
        <TableCell>{qualityBadge(row.quality)}</TableCell>
        {/* Length */}
        <TableCell className="text-[10px] font-mono text-muted-foreground">{row.stemLength}</TableCell>
        {/* Buyer */}
        <TableCell className="text-[10px] font-mono text-foreground/70">{row.buyer}</TableCell>
        {/* Program */}
        <TableCell className="text-[11px] text-foreground max-w-[120px] truncate">{row.program}</TableCell>
        {/* Demand + change */}
        <TableCell className="text-right">
          <span className="text-[11px] font-mono text-foreground tabular-nums">{fmt(row.forecastDemand)}</span>
        </TableCell>
        {/* Change */}
        <TableCell className="text-center">{changeIcon(row.demandChange, row.demandChangePercent)}</TableCell>
        {/* Stock */}
        <TableCell className="text-[11px] font-mono text-muted-foreground text-right tabular-nums">{fmt(row.currentStock)}</TableCell>
        {/* Remaining */}
        <TableCell className={cn(
          "text-[11px] font-mono font-bold text-right tabular-nums",
          row.remainingToBuy > 0 ? "text-primary" : "text-accent"
        )}>{fmt(row.remainingToBuy)}</TableCell>
        {/* Historical */}
        <TableCell className="text-[10px] font-mono text-muted-foreground/60 text-right tabular-nums">{fmtPrice(row.historicalPrice)}</TableCell>
        {/* Offer */}
        <TableCell className={cn(
          "text-[11px] font-mono text-right tabular-nums font-bold",
          row.offerPrice > 0 && row.offerPrice <= row.historicalPrice ? "text-accent" : row.offerPrice > row.historicalPrice ? "text-destructive" : "text-foreground"
        )}>{fmtPrice(row.offerPrice)}</TableCell>
        {/* Advice price */}
        <TableCell className="text-[11px] font-mono text-primary text-right tabular-nums font-bold">{fmtPrice(row.advicePrice)}</TableCell>
        {/* Δ Marge */}
        <TableCell className="text-right"><ProcurementDelta offer={row.offerPrice} expected={row.expectedPrice} /></TableCell>
        {/* Status */}
        <TableCell className="text-center">{coverageBadge(row.coverageStatus)}</TableCell>
        {/* Source */}
        <TableCell className="text-center"><SourceHealthIcon health={row.sourceHealth} /></TableCell>
        {/* AI */}
        <TableCell>
          <div className="flex items-center gap-1 max-w-[160px]">
            <Bot className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[9px] text-muted-foreground truncate">{row.aiRecommendation}</span>
          </div>
        </TableCell>
        {/* Action */}
        <TableCell><BuyButton row={row} onBuy={onBuy} /></TableCell>
      </TableRow>

      <CollapsibleContent asChild>
        <tr>
          <td colSpan={20} className="p-0">
            <div className="border-t border-border bg-secondary/20">
              {/* AI Advice banner with buy button */}
              <div className="flex items-start gap-2 px-4 py-2.5 border-b border-border bg-primary/5">
                <Bot className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">AI Inkoopadvies</p>
                  <p className="text-[11px] text-muted-foreground">{row.aiRecommendation}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ConfidenceBar confidence={row.forecastConfidence} horizonDays={row.forecastHorizonDays} />
                  {row.supplierCount > 0 && row.purchaseState === "open" && (
                    <Button size="sm" className="h-7 text-[10px] font-mono font-bold gap-1.5" onClick={e => { e.stopPropagation(); onBuy(row.id); }}>
                      <ShoppingCart className="w-3 h-3" /> Koop nu
                    </Button>
                  )}
                </div>
              </div>

              {/* Price comparison */}
              <div className="flex items-center gap-6 px-4 py-2 border-b border-border text-[10px] font-mono">
                <span className="text-muted-foreground font-bold uppercase tracking-wider text-[9px]">Prijzen:</span>
                <span className="text-muted-foreground">Historisch <span className="text-foreground font-bold">{fmtPrice(row.historicalPrice)}</span></span>
                <span className="text-muted-foreground">Offerte <span className={cn("font-bold", row.offerPrice <= row.historicalPrice && row.offerPrice > 0 ? "text-accent" : "text-foreground")}>{fmtPrice(row.offerPrice)}</span></span>
                <span className="text-muted-foreground">AI advies <span className="text-primary font-bold">{fmtPrice(row.advicePrice)}</span></span>
                <span className="text-muted-foreground">Verwacht <span className="text-foreground font-bold">{fmtPrice(row.expectedPrice)}</span></span>
                <ProcurementDelta offer={row.offerPrice} expected={row.expectedPrice} />
              </div>

              {/* Demand breakdown */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 px-4 py-2.5 border-b border-border text-[10px] font-mono">
                <div><span className="text-muted-foreground block">Bruto vraag</span><span className="text-foreground font-bold">{fmt(row.forecastDemand)}</span></div>
                <div><span className="text-muted-foreground block">Voorraad</span><span className="text-foreground font-bold">{fmt(row.currentStock)}</span></div>
                <div><span className="text-muted-foreground block">Toegewezen</span><span className="text-foreground font-bold">{fmt(row.allocated)}</span></div>
                <div><span className="text-muted-foreground block">Gedekt</span><span className="text-accent font-bold">{fmt(row.coveredVolume)}</span></div>
                <div><span className="text-muted-foreground block">Open</span><span className={cn("font-bold", row.remainingToBuy > 0 ? "text-primary" : "text-accent")}>{fmt(row.remainingToBuy)}</span></div>
                {isPurchased && (
                  <div><span className="text-muted-foreground block">Gekocht</span><span className="text-accent font-bold">{fmt(row.purchasedQuantity)} ✓</span></div>
                )}
              </div>

              {/* Source + meta */}
              <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-b border-border text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1"><SourceHealthIcon health={row.sourceHealth} /> Bron: <SourceLabel source={row.demandSource} maturity={row.coverageStatus === "open" ? "unresolved" : row.coverageStatus === "partial" ? "partial" : "live"} /></span>
                <span>Klant: <span className="text-foreground">{row.customer}</span></span>
                <span>Buyer: <span className="text-foreground">{row.buyer}</span></span>
                <span>Kwaliteit: <span className="text-foreground">{row.quality}</span></span>
                <span>Leverdatum: <span className="text-foreground">{row.deliveryDate}</span></span>
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
                        <span className="text-[9px] font-mono text-accent">{fmt(v.covered)} gedekt</span>
                        {v.demand - v.covered > 0 && (
                          <span className="text-[9px] font-mono text-primary font-bold">{fmt(v.demand - v.covered)} open</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <SupplierPanel suppliers={row.suppliers} />

              {/* Action buttons */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border">
                {row.supplierCount > 0 && row.purchaseState === "open" && (
                  <>
                    <Button size="sm" className="h-7 text-[10px] font-mono font-bold gap-1.5" onClick={e => { e.stopPropagation(); onBuy(row.id); }}>
                      <ShoppingCart className="w-3 h-3" /> Koop — volg AI advies
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1.5">
                      <ExternalLink className="w-3 h-3" /> Open leverancier
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1.5">
                      <CheckCircle2 className="w-3 h-3" /> Markeer als ingekocht
                    </Button>
                  </>
                )}
                {isPurchased && (
                  <span className="text-[10px] font-mono text-accent font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ingekocht om {row.purchasedAt} — {fmt(row.purchasedQuantity)} stelen
                  </span>
                )}
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-mono text-muted-foreground gap-1.5 ml-auto">
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
        Automatisering werkt alleen voor regels die aan alle criteria voldoen.
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
/*  TABLE                                                              */
/* ------------------------------------------------------------------ */

const thCls = "text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground";

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

type ProcurementTab = "all" | "urgent" | "today" | "upcoming" | "completed";

const ProcurementCockpit = () => {
  const [showAutomation, setShowAutomation] = useState(false);
  const [rows, setRows] = useState(demoRows);
  const [activeTab, setActiveTab] = useState<ProcurementTab>("all");

  const handleBuy = (id: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, purchaseState: "buying" as PurchaseState } : r));
    setTimeout(() => {
      setRows(prev => prev.map(r => r.id === id ? {
        ...r,
        purchaseState: "purchased" as PurchaseState,
        purchasedQuantity: r.remainingToBuy,
        purchasedAt: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
        remainingToBuy: 0,
        coveredVolume: r.forecastDemand,
        coverageStatus: "covered" as CoverageStatus,
        section: "completed" as const,
      } : r));
    }, 2200);
  };

  const completedRows = rows.filter(r => r.section === "completed");
  const urgentRows = rows.filter(r => r.section === "urgent");
  const todayRows = rows.filter(r => r.section === "today");
  const upcomingRows = rows.filter(r => r.section === "upcoming");
  const allActiveRows = [...urgentRows, ...todayRows, ...upcomingRows];

  const visibleRows = activeTab === "all" ? allActiveRows
    : activeTab === "urgent" ? urgentRows
    : activeTab === "today" ? todayRows
    : activeTab === "upcoming" ? upcomingRows
    : completedRows;

  const totalDemand = rows.reduce((s, r) => s + r.forecastDemand, 0);
  const totalCovered = rows.reduce((s, r) => s + r.coveredVolume, 0);
  const totalOpen = rows.reduce((s, r) => s + r.remainingToBuy, 0);
  const totalStock = rows.reduce((s, r) => s + r.currentStock, 0);
  const totalValue = rows.reduce((s, r) => s + r.remainingToBuy * (r.advicePrice || r.expectedPrice), 0);
  const uniqueSuppliers = new Set(rows.flatMap(r => r.suppliers.map(s => s.supplier))).size;
  const avgConfidence = Math.round(rows.reduce((s, r) => s + r.forecastConfidence, 0) / rows.length);
  const purchasedToday = completedRows.length;

  return (
    <div className="relative flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-3 md:p-5 space-y-3 max-w-[1800px] mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-sm md:text-base font-black text-foreground uppercase tracking-wider">Procurement Cockpit</h1>
              <p className="text-[10px] font-mono text-muted-foreground">Operationeel inkoopoverzicht — vraag · kwaliteit · prijzen · AI advies · actie</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1.5" onClick={() => setShowAutomation(!showAutomation)}>
                <Zap className="w-3 h-3" /> Inkoop Automatisering
              </Button>
              <DataMaturityBadge maturity="partial" size="sm" />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            <KpiCard icon={Package} label="Totale vraag" value={fmt(totalDemand)} sub="stelen" />
            <KpiCard icon={Boxes} label="Voorraad" value={fmt(totalStock)} sub="beschikbaar" />
            <KpiCard icon={CheckCircle2} label="Gedekt" value={fmt(totalCovered)} sub={`${Math.round((totalCovered / totalDemand) * 100)}%`} accent="bg-accent/15" />
            <KpiCard icon={ShoppingCart} label="Open inkoop" value={fmt(totalOpen)} sub="nog te kopen" />
            <KpiCard icon={DollarSign} label="Open waarde" value={`€${totalValue.toFixed(0)}`} sub="adviesprijzen" />
            <KpiCard icon={Truck} label="Leveranciers" value={String(uniqueSuppliers)} sub="beschikbaar" />
            <KpiCard icon={Bot} label="AI Confidence" value={`${avgConfidence}%`} sub="gemiddeld" accent="bg-primary/10" />
            <KpiCard icon={Check} label="Vandaag gekocht" value={String(purchasedToday)} sub="regels afgerond" accent="bg-accent/15" />
          </div>

          {/* AI Advice banner */}
          <AIAdviceBanner rows={rows} />

          {/* Forecast deviation alerts */}
          <ForecastDeviationAlert rows={rows} />

          {/* Automation settings */}
          <AutomationSettings open={showAutomation} onToggle={() => setShowAutomation(false)} />

          {/* Filters */}
          <FilterBar />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProcurementTab)} className="w-full">
            <TabsList className="bg-secondary/30 h-8">
              <TabsTrigger value="all" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                <ShoppingCart className="w-3 h-3" /> Inkooplijst
                <span className="text-[8px] text-muted-foreground ml-0.5">({allActiveRows.length})</span>
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                <AlertTriangle className="w-3 h-3" /> Urgent
                {urgentRows.length > 0 && <span className="text-[8px] text-destructive font-bold ml-0.5">({urgentRows.length})</span>}
              </TabsTrigger>
              <TabsTrigger value="today" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                <Package className="w-3 h-3" /> Vandaag
                <span className="text-[8px] text-muted-foreground ml-0.5">({todayRows.length})</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                <Clock className="w-3 h-3" /> Komende dagen
                <span className="text-[8px] text-muted-foreground ml-0.5">({upcomingRows.length})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                <CheckCircle2 className="w-3 h-3" /> Afgerond
                <span className="text-[8px] text-accent ml-0.5">({completedRows.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Procurement Table */}
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <Table className="border-collapse">
              <TableHeader>
                {/* Column group headers */}
                <TableRow className="bg-secondary/50 border-b-2 border-border">
                  <TableHead className="w-6 px-1" rowSpan={2} />
                  <TableHead colSpan={4} className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-foreground/50 text-center border-r border-border py-1">Product</TableHead>
                  <TableHead colSpan={2} className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-foreground/50 text-center border-r border-border py-1">Toewijzing</TableHead>
                  <TableHead colSpan={4} className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-foreground/50 text-center border-r border-border py-1">Volume</TableHead>
                  <TableHead colSpan={4} className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-foreground/50 text-center border-r border-border py-1">Prijzen</TableHead>
                  <TableHead colSpan={2} className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-foreground/50 text-center border-r border-border py-1">Status</TableHead>
                  <TableHead colSpan={2} className="text-[8px] font-mono font-black uppercase tracking-[0.15em] text-foreground/50 text-center py-1">Actie</TableHead>
                </TableRow>
                <TableRow className="bg-secondary/30 border-b border-border">
                  {/* Product group */}
                  <TableHead className={cn(thCls, "border-r-0")}>Artikel</TableHead>
                  <TableHead className={thCls}>Soort</TableHead>
                  <TableHead className={thCls}>Kwal.</TableHead>
                  <TableHead className={cn(thCls, "border-r border-border")}>Lengte</TableHead>
                  {/* Toewijzing group */}
                  <TableHead className={thCls}>Buyer</TableHead>
                  <TableHead className={cn(thCls, "border-r border-border")}>Programma</TableHead>
                  {/* Volume group */}
                  <TableHead className={cn(thCls, "text-right")}>Vraag</TableHead>
                  <TableHead className={cn(thCls, "text-center")}>Δ</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Voorraad</TableHead>
                  <TableHead className={cn(thCls, "text-right border-r border-border")}>Open</TableHead>
                  {/* Prijzen group */}
                  <TableHead className={cn(thCls, "text-right")}>Hist.</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Offerte</TableHead>
                  <TableHead className={cn(thCls, "text-right")}>Advies</TableHead>
                  <TableHead className={cn(thCls, "text-right border-r border-border")}>Δ Marge</TableHead>
                  {/* Status group */}
                  <TableHead className={cn(thCls, "text-center")}>Dekking</TableHead>
                  <TableHead className={cn(thCls, "text-center border-r border-border")}>Bron</TableHead>
                  {/* Actie group */}
                  <TableHead className={thCls}>AI Advies</TableHead>
                  <TableHead className={thCls}>Actie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={19} className="text-center py-8 text-[11px] font-mono text-muted-foreground">
                      Geen items in deze categorie
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleRows.map(row => <ProcurementTableRow key={row.id} row={row} onBuy={handleBuy} />)
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground pb-4">
            <span>Laatst bijgewerkt: vandaag 08:42 · Bron: Axerrio forecast + productieorders</span>
            <span>{rows.length} artikelen · {uniqueSuppliers} leveranciers · {purchasedToday} afgerond</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCockpit;
