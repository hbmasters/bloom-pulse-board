import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter, RotateCcw, ChevronDown, ChevronRight, ExternalLink,
  TrendingUp, TrendingDown, Minus, Bot, ShoppingCart, AlertTriangle,
  Clock, Package, Truck, DollarSign, CheckCircle2, X,
  Wifi, WifiOff, RefreshCw, Shield, Zap,
  ArrowUpRight, ArrowDownRight, Boxes, Loader2,
  Star, AlertCircle, Check, User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
type ChangeDirection = "up" | "down" | "stable";
type CoverageStatus = "covered" | "partial" | "open" | "at-risk";
type SourceHealth = "connected" | "delayed" | "stale" | "unavailable" | "manual";
type PurchaseState = "open" | "buying" | "purchased";
type QualityGrade = "A1" | "A2" | "B1" | "B2" | "—";
type ProcurementTab = "all" | "urgent" | "today" | "upcoming" | "completed";

interface SupplierOption {
  supplier: string; channel: string; available: number; price: number;
  deliveryDays: number; confidence: number; sourceHealth: SourceHealth; isBestPrice?: boolean;
  url?: string;
}

interface ProcurementRow {
  id: string; article: string; stemLength: string; quality: QualityGrade; species: string;
  buyer: string; program: string; customer: string;
  forecastDemand: number; currentStock: number; allocated: number; coveredVolume: number; remainingToBuy: number;
  historicalPrice: number; offerPrice: number; advicePrice: number; expectedPrice: number;
  supplierCount: number; aiRecommendation: string; deliveryDate: string;
  coverageStatus: CoverageStatus; demandChange: ChangeDirection; demandChangePercent: number;
  demandSource: string; sourceHealth: SourceHealth; forecastConfidence: number; forecastHorizonDays: number;
  purchaseState: PurchaseState; purchasedQuantity: number; purchasedAt?: string;
  suppliers: SupplierOption[];
  variants?: { length: string; demand: number; covered: number; stock: number }[];
  section: "urgent" | "today" | "upcoming" | "completed";
  bestHistoricalSupplier?: string;
  trackTrace?: { status: string; location: string; eta: string };
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                          */
/* ------------------------------------------------------------------ */
const demoRows: ProcurementRow[] = [
  {
    id: "p3", article: "Germini Barca", stemLength: "45cm", quality: "A1", species: "Germini",
    buyer: "Mark", program: "Wk12 — Aldi", customer: "Aldi",
    forecastDemand: 9200, currentStock: 600, allocated: 0, coveredVolume: 2100, remainingToBuy: 7100,
    historicalPrice: 0.09, offerPrice: 0.10, advicePrice: 0.10, expectedPrice: 0.11,
    supplierCount: 4, aiRecommendation: "Vraagpiek morgen — nu inkopen via Floriday",
    deliveryDate: "2026-03-15", coverageStatus: "at-risk", demandChange: "up", demandChangePercent: 24,
    demandSource: "Axerrio forecast", sourceHealth: "connected", forecastConfidence: 72, forecastHorizonDays: 1,
    purchaseState: "open", purchasedQuantity: 0, section: "urgent",
    bestHistoricalSupplier: "Germini World",
    suppliers: [
      { supplier: "Germini World", channel: "Floriday", available: 4000, price: 0.10, deliveryDays: 2, confidence: 85, sourceHealth: "connected", isBestPrice: true, url: "https://floriday.io/supplier/germini-world" },
      { supplier: "FlowerLink", channel: "Marketplace", available: 2500, price: 0.12, deliveryDays: 2, confidence: 72, sourceHealth: "stale", url: "https://flowerlink.nl" },
      { supplier: "Direct Grower", channel: "Webshop", available: 3000, price: 0.11, deliveryDays: 3, confidence: 80, sourceHealth: "connected", url: "https://directgrower.nl" },
      { supplier: "BloemenVeiling", channel: "Floriday", available: 1500, price: 0.13, deliveryDays: 1, confidence: 90, sourceHealth: "connected", url: "https://floriday.io/supplier/bloemenveiling" },
    ],
  },
  {
    id: "p4", article: "Alstroemeria Virginia", stemLength: "55cm", quality: "—", species: "Alstroemeria",
    buyer: "—", program: "Wk13 — Lidl", customer: "Lidl",
    forecastDemand: 4600, currentStock: 0, allocated: 0, coveredVolume: 0, remainingToBuy: 4600,
    historicalPrice: 0, offerPrice: 0, advicePrice: 0, expectedPrice: 0,
    supplierCount: 0, aiRecommendation: "Recept ontbreekt — identiteit onbekend",
    deliveryDate: "2026-03-20", coverageStatus: "open", demandChange: "stable", demandChangePercent: 0,
    demandSource: "Forecast (onopgelost)", sourceHealth: "unavailable", forecastConfidence: 35, forecastHorizonDays: 8,
    purchaseState: "open", purchasedQuantity: 0, section: "urgent",
    suppliers: [],
  },
  {
    id: "p1", article: "Roos Red Naomi", stemLength: "60cm", quality: "A1", species: "Rosa",
    buyer: "Mark", program: "Wk12 — AH", customer: "Albert Heijn",
    forecastDemand: 12400, currentStock: 1800, allocated: 1200, coveredVolume: 8200, remainingToBuy: 4200,
    historicalPrice: 0.21, offerPrice: 0.22, advicePrice: 0.22, expectedPrice: 0.24,
    supplierCount: 3, aiRecommendation: "Koop vandaag via Floriday — 7% voordeel",
    deliveryDate: "2026-03-16", coverageStatus: "partial", demandChange: "up", demandChangePercent: 8,
    demandSource: "Axerrio forecast", sourceHealth: "connected", forecastConfidence: 88, forecastHorizonDays: 3,
    purchaseState: "open", purchasedQuantity: 0, section: "today",
    bestHistoricalSupplier: "Van der Berg Roses",
    suppliers: [
      { supplier: "Van der Berg Roses", channel: "Floriday", available: 5000, price: 0.22, deliveryDays: 2, confidence: 92, sourceHealth: "connected", isBestPrice: true, url: "https://floriday.io/supplier/vdberg" },
      { supplier: "Porta Nova", channel: "Contract", available: 3000, price: 0.26, deliveryDays: 1, confidence: 98, sourceHealth: "connected", url: "https://portanova.nl" },
      { supplier: "Marktplaats NL", channel: "Marketplace", available: 2000, price: 0.28, deliveryDays: 3, confidence: 75, sourceHealth: "delayed", url: "https://marktplaats.nl" },
    ],
    variants: [
      { length: "50cm", demand: 3200, covered: 3200, stock: 400 },
      { length: "60cm", demand: 6400, covered: 3800, stock: 1000 },
      { length: "70cm", demand: 2800, covered: 1200, stock: 400 },
    ],
  },
  {
    id: "p5", article: "Dianthus Nobbio", stemLength: "60cm", quality: "A2", species: "Dianthus",
    buyer: "Sandra", program: "Wk12 — Dekamarkt", customer: "Dekamarkt",
    forecastDemand: 3200, currentStock: 400, allocated: 400, coveredVolume: 1600, remainingToBuy: 1600,
    historicalPrice: 0.16, offerPrice: 0.17, advicePrice: 0.17, expectedPrice: 0.18,
    supplierCount: 2, aiRecommendation: "Contract goedkoper dan markt",
    deliveryDate: "2026-03-16", coverageStatus: "partial", demandChange: "down", demandChangePercent: -5,
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 91, forecastHorizonDays: 4,
    purchaseState: "open", purchasedQuantity: 0, section: "today",
    bestHistoricalSupplier: "Carnation BV",
    suppliers: [
      { supplier: "Carnation BV", channel: "Contract", available: 2000, price: 0.17, deliveryDays: 1, confidence: 95, sourceHealth: "connected", isBestPrice: true, url: "https://carnationbv.nl" },
      { supplier: "FloriTrade", channel: "Floriday", available: 1500, price: 0.20, deliveryDays: 2, confidence: 82, sourceHealth: "connected", url: "https://floriday.io/supplier/floritrade" },
    ],
  },
  {
    id: "p2", article: "Pistacia", stemLength: "50cm", quality: "A1", species: "Pistacia",
    buyer: "Sandra", program: "Wk12 — Jumbo", customer: "Jumbo",
    forecastDemand: 6800, currentStock: 2400, allocated: 2400, coveredVolume: 6800, remainingToBuy: 0,
    historicalPrice: 0.15, offerPrice: 0.14, advicePrice: 0.14, expectedPrice: 0.14,
    supplierCount: 2, aiRecommendation: "Volledig gedekt via contract",
    deliveryDate: "2026-03-17", coverageStatus: "covered", demandChange: "stable", demandChangePercent: 0,
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 96, forecastHorizonDays: 5,
    purchaseState: "open", purchasedQuantity: 0, section: "upcoming",
    bestHistoricalSupplier: "Green Team",
    suppliers: [
      { supplier: "Green Team", channel: "Contract", available: 7000, price: 0.14, deliveryDays: 1, confidence: 99, sourceHealth: "connected", isBestPrice: true, url: "https://greenteam.nl" },
      { supplier: "Flora Direct", channel: "Webshop", available: 3000, price: 0.16, deliveryDays: 2, confidence: 88, sourceHealth: "connected", url: "https://floradirect.nl" },
    ],
    variants: [
      { length: "40cm", demand: 1800, covered: 1800, stock: 600 },
      { length: "50cm", demand: 3200, covered: 3200, stock: 1200 },
      { length: "60cm", demand: 1800, covered: 1800, stock: 600 },
    ],
  },
  {
    id: "p6", article: "Chrysant Bacardi", stemLength: "65cm", quality: "A1", species: "Chrysant",
    buyer: "Mark", program: "Wk12 — AH", customer: "Albert Heijn",
    forecastDemand: 5400, currentStock: 800, allocated: 800, coveredVolume: 5400, remainingToBuy: 0,
    historicalPrice: 0.12, offerPrice: 0.11, advicePrice: 0.11, expectedPrice: 0.12,
    supplierCount: 2, aiRecommendation: "Ingekocht — 8% onder verwacht",
    deliveryDate: "2026-03-15", coverageStatus: "covered", demandChange: "stable", demandChangePercent: 0,
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 95, forecastHorizonDays: 2,
    purchaseState: "purchased", purchasedQuantity: 4600, purchasedAt: "08:12", section: "completed",
    bestHistoricalSupplier: "ChrysantenKwekerij",
    trackTrace: { status: "Onderweg", location: "Aalsmeer → DC Naaldwijk", eta: "14:30" },
    suppliers: [{ supplier: "ChrysantenKwekerij", channel: "Floriday", available: 6000, price: 0.11, deliveryDays: 1, confidence: 97, sourceHealth: "connected", isBestPrice: true, url: "https://floriday.io/supplier/chrysantenkwekerij" }],
  },
  {
    id: "p7", article: "Eucalyptus Parvifolia", stemLength: "60cm", quality: "A2", species: "Eucalyptus",
    buyer: "Sandra", program: "Wk12 — Jumbo", customer: "Jumbo",
    forecastDemand: 3800, currentStock: 200, allocated: 200, coveredVolume: 3800, remainingToBuy: 0,
    historicalPrice: 0.08, offerPrice: 0.07, advicePrice: 0.07, expectedPrice: 0.08,
    supplierCount: 1, aiRecommendation: "Ingekocht via contract",
    deliveryDate: "2026-03-15", coverageStatus: "covered", demandChange: "stable", demandChangePercent: 0,
    demandSource: "Productieorder", sourceHealth: "connected", forecastConfidence: 98, forecastHorizonDays: 2,
    purchaseState: "purchased", purchasedQuantity: 3600, purchasedAt: "07:48", section: "completed",
    bestHistoricalSupplier: "Green Direct",
    trackTrace: { status: "Geleverd", location: "DC Naaldwijk", eta: "Ontvangen 09:15" },
    suppliers: [{ supplier: "Green Direct", channel: "Contract", available: 5000, price: 0.07, deliveryDays: 1, confidence: 99, sourceHealth: "connected", isBestPrice: true, url: "https://greendirect.nl" }],
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => n > 0 ? `€${n.toFixed(2)}` : "—";

const coverageCls: Record<CoverageStatus, string> = {
  covered: "text-accent bg-accent/10",
  partial: "text-primary bg-primary/10",
  open: "text-muted-foreground bg-muted",
  "at-risk": "text-destructive bg-destructive/10",
};
const coverageLabel: Record<CoverageStatus, string> = {
  covered: "Gedekt", partial: "Deels", open: "Open", "at-risk": "At Risk",
};

const qualityCls = (q: QualityGrade) =>
  q === "A1" ? "text-accent bg-accent/10" : q === "A2" ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted";

const SourceIcon = ({ h }: { h: SourceHealth }) => {
  const m: Record<SourceHealth, { Icon: typeof Wifi; c: string; t: string }> = {
    connected: { Icon: Wifi, c: "text-accent", t: "Verbonden" },
    delayed: { Icon: Clock, c: "text-yellow-500", t: "Vertraagd" },
    stale: { Icon: RefreshCw, c: "text-orange-500", t: "Verouderd" },
    unavailable: { Icon: WifiOff, c: "text-muted-foreground/40", t: "Niet beschikbaar" },
    manual: { Icon: User, c: "text-primary/60", t: "Handmatig" },
  };
  const { Icon, c, t } = m[h];
  return <span title={t}><Icon className={cn("w-3 h-3", c)} /></span>;
};

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */
const ProcurementCockpit = () => {
  const [rows, setRows] = useState(demoRows);
  const [tab, setTab] = useState<ProcurementTab>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAuto, setShowAuto] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleBuy = (id: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, purchaseState: "buying" as PurchaseState } : r));
    setTimeout(() => {
      setRows(prev => prev.map(r => r.id === id ? {
        ...r, purchaseState: "purchased" as PurchaseState,
        purchasedQuantity: r.remainingToBuy,
        purchasedAt: new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }),
        remainingToBuy: 0, coveredVolume: r.forecastDemand,
        coverageStatus: "covered" as CoverageStatus, section: "completed" as const,
      } : r));
    }, 2200);
  };

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  const urgent = rows.filter(r => r.section === "urgent");
  const today = rows.filter(r => r.section === "today");
  const upcoming = rows.filter(r => r.section === "upcoming");
  const completed = rows.filter(r => r.section === "completed");
  const active = [...urgent, ...today, ...upcoming];

  const visible = tab === "all" ? active : tab === "urgent" ? urgent : tab === "today" ? today : tab === "upcoming" ? upcoming : completed;

  const totalDemand = rows.reduce((s, r) => s + r.forecastDemand, 0);
  const totalCovered = rows.reduce((s, r) => s + r.coveredVolume, 0);
  const totalOpen = rows.reduce((s, r) => s + r.remainingToBuy, 0);
  const totalValue = rows.reduce((s, r) => s + r.remainingToBuy * (r.advicePrice || r.expectedPrice), 0);
  const deviations = rows.filter(r => Math.abs(r.demandChangePercent) >= 10 && r.section !== "completed");

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-4 md:p-5 space-y-4">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-sm font-black text-foreground uppercase tracking-wider">Procurement Cockpit</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-3 h-3" /> Filters
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1" onClick={() => setShowAuto(!showAuto)}>
                <Zap className="w-3 h-3" /> Automatisering
              </Button>
            </div>
          </div>

          {/* ── KPI STRIP ── */}
          <div className="flex items-center gap-4 text-[11px] font-mono border-b border-border pb-3">
            <Stat label="Vraag" value={fmt(totalDemand)} />
            <Stat label="Gedekt" value={`${Math.round((totalCovered / totalDemand) * 100)}%`} accent />
            <Stat label="Open" value={fmt(totalOpen)} warn={totalOpen > 0} />
            <Stat label="Waarde" value={`€${totalValue.toFixed(0)}`} />
            <Stat label="Afgerond" value={String(completed.length)} accent />
            {deviations.length > 0 && (
              <span className="ml-auto flex items-center gap-1 text-destructive font-bold">
                <AlertCircle className="w-3.5 h-3.5" /> {deviations.length} afwijking{deviations.length > 1 ? "en" : ""}
              </span>
            )}
          </div>

          {/* ── ALERTS (compact) ── */}
          {deviations.length > 0 && (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-[10px] font-mono space-y-0.5">
              {deviations.map(d => (
                <div key={d.id} className="flex items-center gap-3">
                  <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
                  <span className="font-bold text-foreground w-36 truncate">{d.article}</span>
                  <span className={cn("font-bold w-16", d.demandChangePercent > 0 ? "text-accent" : "text-destructive")}>
                    {d.demandChangePercent > 0 ? "+" : ""}{d.demandChangePercent}%
                  </span>
                  <span className="text-muted-foreground truncate">{d.aiRecommendation}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── FILTERS (collapsible) ── */}
          {showFilters && (
            <div className="flex items-center gap-2 flex-wrap border-b border-border pb-3">
              {["Datum", "Buyer", "Klant", "Artikel", "Kanaal", "Dekking"].map(f => (
                <Select key={f}>
                  <SelectTrigger className="h-7 w-[110px] text-[10px] font-mono bg-card border-border">
                    <SelectValue placeholder={f} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                  </SelectContent>
                </Select>
              ))}
              <Button variant="ghost" size="sm" className="h-7 text-[10px] font-mono text-muted-foreground gap-1">
                <RotateCcw className="w-3 h-3" /> Reset
              </Button>
            </div>
          )}

          {/* ── AUTOMATION (collapsible) ── */}
          {showAuto && (
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /> Inkoop Automatisering</span>
                <Button variant="ghost" size="sm" className="h-5 px-1" onClick={() => setShowAuto(false)}><X className="w-3 h-3" /></Button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-[10px] font-mono">
                <div className="flex items-center justify-between border border-border rounded-md bg-card px-2.5 py-2">
                  <span className="text-foreground font-bold">Auto-order</span><Switch />
                </div>
                <div className="flex items-center justify-between border border-border rounded-md bg-card px-2.5 py-2">
                  <span className="text-foreground font-bold">Max afwijking</span><span className="text-primary font-bold">20%</span>
                </div>
                <div className="flex items-center justify-between border border-border rounded-md bg-card px-2.5 py-2">
                  <span className="text-foreground font-bold">Min. confidence</span><span className="text-primary font-bold">85%</span>
                </div>
                <div className="flex items-center justify-between border border-border rounded-md bg-card px-2.5 py-2">
                  <span className="text-foreground font-bold">Alleen verbonden</span><Switch defaultChecked />
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground/60 mt-2 flex items-center gap-1"><Shield className="w-3 h-3" /> Alleen regels die aan alle criteria voldoen.</p>
            </div>
          )}

          {/* ── TABS ── */}
          <Tabs value={tab} onValueChange={v => setTab(v as ProcurementTab)}>
            <TabsList className="bg-muted/40 h-8">
              <TabsTrigger value="all" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                Inkooplijst <span className="text-muted-foreground">({active.length})</span>
              </TabsTrigger>
              <TabsTrigger value="urgent" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                Urgent {urgent.length > 0 && <span className="text-destructive font-bold">({urgent.length})</span>}
              </TabsTrigger>
              <TabsTrigger value="today" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                Vandaag <span className="text-muted-foreground">({today.length})</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                Komend <span className="text-muted-foreground">({upcoming.length})</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-[10px] font-mono font-bold gap-1 data-[state=active]:bg-card">
                Afgerond <span className="text-accent">({completed.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* ── TABLE ── */}
          <div className="rounded-lg border border-border bg-card overflow-x-auto">
            <table className="w-full text-[11px]">
              {/* Header */}
              <thead>
                <tr className="bg-muted/40 text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground border-b-2 border-border">
                  <th className="w-8 px-2 py-2.5" />
                  <th className="text-left px-3 py-2.5">Artikel</th>
                  <th className="text-left px-2 py-2.5">Kwal</th>
                  <th className="text-left px-2 py-2.5">Buyer</th>
                  <th className="text-left px-2 py-2.5">Programma</th>
                  <th className="text-right px-3 py-2.5">Vraag</th>
                  <th className="text-center px-2 py-2.5">Δ</th>
                  <th className="text-right px-3 py-2.5">Voorraad</th>
                  <th className="text-right px-3 py-2.5 font-black">Te kopen</th>
                  <th className="text-right px-2 py-2.5 text-muted-foreground/60">Hist.</th>
                  <th className="text-right px-2 py-2.5">Offerte</th>
                  <th className="text-right px-2 py-2.5">Advies</th>
                  <th className="text-right px-2 py-2.5">Marge</th>
                  <th className="text-center px-2 py-2.5">Status</th>
                  <th className="text-left px-2 py-2.5">AI advies</th>
                  <th className="text-center px-2 py-2.5">Actie</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr><td colSpan={16} className="text-center py-16 text-xs font-mono text-muted-foreground">Geen items</td></tr>
                ) : visible.map(row => (
                  <Row key={row.id} row={row} isOpen={expanded === row.id} onToggle={() => toggle(row.id)} onBuy={handleBuy} />
                ))}
              </tbody>
            </table>
          </div>

          {/* ── FOOTER ── */}
          <p className="text-[9px] font-mono text-muted-foreground pb-2">
            Laatst bijgewerkt: vandaag 08:42 · {rows.length} artikelen · {completed.length} afgerond
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  STAT (inline KPI)                                                  */
/* ------------------------------------------------------------------ */
const Stat = ({ label, value, accent, warn }: { label: string; value: string; accent?: boolean; warn?: boolean }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn("font-bold", accent ? "text-accent" : warn ? "text-primary" : "text-foreground")}>{value}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  TABLE ROW                                                          */
/* ------------------------------------------------------------------ */
const Row = ({ row, isOpen, onToggle, onBuy }: {
  row: ProcurementRow; isOpen: boolean; onToggle: () => void; onBuy: (id: string) => void;
}) => {
  const isPurchased = row.purchaseState === "purchased";
  const delta = row.offerPrice > 0 && row.expectedPrice > 0 ? row.expectedPrice - row.offerPrice : null;

  return (
    <>
      <tr
        className={cn(
          "border-b border-border cursor-pointer transition-colors hover:bg-muted/30",
          isPurchased && "opacity-50",
          row.coverageStatus === "at-risk" && "bg-destructive/[0.03]",
        )}
        onClick={onToggle}
      >
        {/* Expand */}
        <td className="px-2 py-3 text-center">
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground inline" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground inline" />}
        </td>
        {/* Artikel */}
        <td className="px-3 py-3">
          <div className="font-semibold text-foreground leading-tight">{row.article}</div>
          <div className="text-[10px] text-muted-foreground font-mono">{row.species} · {row.stemLength}</div>
        </td>
        {/* Kwaliteit */}
        <td className="px-2 py-3">
          {row.quality !== "—" ? (
            <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded", qualityCls(row.quality))}>{row.quality}</span>
          ) : <span className="text-muted-foreground/40 text-[10px]">—</span>}
        </td>
        {/* Buyer */}
        <td className="px-2 py-3 text-foreground/70 font-mono">{row.buyer}</td>
        {/* Programma */}
        <td className="px-2 py-3 text-foreground max-w-[120px] truncate">{row.program}</td>
        {/* Vraag */}
        <td className="px-3 py-3 text-right font-mono tabular-nums text-foreground">{fmt(row.forecastDemand)}</td>
        {/* Δ */}
        <td className="px-2 py-3 text-center">
          {row.demandChange === "up" ? (
            <span className="text-accent font-mono font-bold text-[9px]">+{row.demandChangePercent}%</span>
          ) : row.demandChange === "down" ? (
            <span className="text-destructive font-mono font-bold text-[9px]">{row.demandChangePercent}%</span>
          ) : <Minus className="w-3 h-3 text-muted-foreground/40 inline" />}
        </td>
        {/* Voorraad */}
        <td className="px-3 py-3 text-right font-mono tabular-nums text-muted-foreground">{fmt(row.currentStock)}</td>
        {/* Te kopen */}
        <td className={cn("px-3 py-3 text-right font-mono tabular-nums font-bold", row.remainingToBuy > 0 ? "text-primary" : "text-accent")}>
          {fmt(row.remainingToBuy)}
        </td>
        {/* Hist */}
        <td className="px-2 py-3 text-right font-mono tabular-nums text-muted-foreground/50 text-[10px]">{fmtPrice(row.historicalPrice)}</td>
        {/* Offerte */}
        <td className={cn("px-2 py-3 text-right font-mono tabular-nums font-semibold",
          row.offerPrice > 0 && row.offerPrice <= row.historicalPrice ? "text-accent" : row.offerPrice > row.historicalPrice ? "text-destructive" : "text-foreground"
        )}>{fmtPrice(row.offerPrice)}</td>
        {/* Advies */}
        <td className="px-2 py-3 text-right font-mono tabular-nums font-bold text-primary">{fmtPrice(row.advicePrice)}</td>
        {/* Marge */}
        <td className="px-2 py-3 text-right">
          {delta !== null ? (
            <span className={cn("font-mono font-bold text-[10px]", delta > 0 ? "text-accent" : "text-destructive")}>
              {delta > 0 ? "-" : "+"}{fmtPrice(Math.abs(delta))}
            </span>
          ) : <span className="text-muted-foreground/40 text-[10px]">—</span>}
        </td>
        {/* Status */}
        <td className="px-2 py-3 text-center">
          <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full", coverageCls[row.coverageStatus])}>
            {coverageLabel[row.coverageStatus]}
          </span>
        </td>
        {/* AI */}
        <td className="px-2 py-3">
          <div className="flex items-center gap-1.5 max-w-[180px]">
            <Bot className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[10px] text-muted-foreground truncate">{row.aiRecommendation}</span>
          </div>
        </td>
        {/* Actie */}
        <td className="px-2 py-3 text-center">
          {row.purchaseState === "purchased" ? (
            <span className="text-accent text-[9px] font-mono font-bold inline-flex items-center gap-0.5"><Check className="w-3 h-3" /> {row.purchasedAt}</span>
          ) : row.purchaseState === "buying" ? (
            <Loader2 className="w-3.5 h-3.5 text-primary animate-spin inline" />
          ) : row.supplierCount > 0 ? (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-mono text-primary hover:bg-primary/10"
              onClick={e => { e.stopPropagation(); onBuy(row.id); }}>
              <ShoppingCart className="w-3 h-3 mr-0.5" /> Koop
            </Button>
          ) : null}
        </td>
      </tr>

      {/* ── EXPANDED DETAIL ── */}
      {isOpen && (
        <tr>
          <td colSpan={16} className="p-0">
            <div className="bg-muted/10 border-b-2 border-border">
              {/* AI + koop */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-border/60 bg-primary/[0.03]">
                <Bot className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-foreground">AI Advies: </span>
                  <span className="text-xs text-muted-foreground">{row.aiRecommendation}</span>
                  {row.bestHistoricalSupplier && (
                    <span className="text-[10px] text-muted-foreground ml-2">
                      · Best historisch: <span className="font-bold text-accent">{row.bestHistoricalSupplier}</span>
                    </span>
                  )}
                </div>
                {row.supplierCount > 0 && row.purchaseState === "open" && (
                  <Button size="sm" className="h-7 text-[10px] font-mono font-bold gap-1" onClick={() => onBuy(row.id)}>
                    <ShoppingCart className="w-3 h-3" /> Koop nu
                  </Button>
                )}
              </div>

              {/* Detail rows — 2 column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
                {/* Left: volume */}
                <div className="px-5 py-3">
                  <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">Volume</h4>
                  <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 text-[11px] font-mono">
                    <DetailRow label="Bruto vraag" value={fmt(row.forecastDemand)} />
                    <DetailRow label="Voorraad" value={fmt(row.currentStock)} />
                    <DetailRow label="Toegewezen" value={fmt(row.allocated)} />
                    <DetailRow label="Gedekt" value={fmt(row.coveredVolume)} accent />
                    <DetailRow label="Open" value={fmt(row.remainingToBuy)} warn={row.remainingToBuy > 0} />
                    {isPurchased && <DetailRow label="Gekocht" value={`${fmt(row.purchasedQuantity)} ✓`} accent />}
                  </div>
                </div>
                {/* Right: prijzen + meta */}
                <div className="px-5 py-3">
                  <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">Prijzen & info</h4>
                  <div className="space-y-1 text-[11px] font-mono">
                    <DottedRow label="Historisch" value={fmtPrice(row.historicalPrice)} cls="text-muted-foreground/60" />
                    <DottedRow label="Offerte" value={fmtPrice(row.offerPrice)} cls={row.offerPrice > 0 && row.offerPrice <= row.historicalPrice ? "text-accent" : "text-foreground"} />
                    <DottedRow label="Adviesprijs" value={fmtPrice(row.advicePrice)} cls="text-primary font-bold" />
                    <DottedRow label="Verwacht" value={fmtPrice(row.expectedPrice)} />
                    <DottedRow label="Klant" value={row.customer} />
                    <DottedRow label="Leverdatum" value={row.deliveryDate} />
                    <DottedRow label="Bron" value={row.demandSource} icon={<SourceIcon h={row.sourceHealth} />} />
                  </div>
                </div>
              </div>

              {/* Variants */}
              {row.variants && row.variants.length > 0 && (
                <div className="px-5 py-3 border-t border-border/60">
                  <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">Steellengte</h4>
                  <div className="grid grid-cols-5 gap-1 text-[10px] font-mono text-muted-foreground font-bold uppercase tracking-wider mb-1">
                    <span>Lengte</span><span className="text-right">Vraag</span><span className="text-right">Gedekt</span><span className="text-right">Voorraad</span><span className="text-right">Open</span>
                  </div>
                  {row.variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-5 gap-1 text-[11px] font-mono py-1 border-t border-border/30">
                      <span className="font-semibold text-foreground">{v.length}</span>
                      <span className="text-right text-foreground">{fmt(v.demand)}</span>
                      <span className="text-right text-accent">{fmt(v.covered)}</span>
                      <span className="text-right text-muted-foreground">{fmt(v.stock)}</span>
                      <span className={cn("text-right font-semibold", v.demand - v.covered > 0 ? "text-primary" : "text-accent")}>{fmt(Math.max(0, v.demand - v.covered))}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suppliers */}
              {row.suppliers.length > 0 ? (
                <div className="px-5 py-3 border-t border-border/60">
                  <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">Leveranciers</h4>
                  <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-3 text-[10px] font-mono text-muted-foreground font-bold uppercase tracking-wider mb-1">
                    <span>Leverancier</span><span className="text-right">Beschikbaar</span><span className="text-right">Prijs</span><span className="text-right">Levertijd</span><span className="text-center">Bron</span><span></span>
                  </div>
                  {row.suppliers.map((s, i) => (
                    <div key={i} className={cn("grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-3 items-center text-[11px] font-mono py-1.5 border-t border-border/30", s.isBestPrice && "bg-accent/5")}>
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        {s.supplier}
                        <Badge variant="outline" className="text-[7px] font-mono h-4 px-1">{s.channel}</Badge>
                        {s.isBestPrice && <span className="text-[7px] text-accent font-bold">BEST</span>}
                        {s.supplier === row.bestHistoricalSupplier && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                        {s.url && (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} title="Open leverancier">
                            <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors" />
                          </a>
                        )}
                      </span>
                      <span className="text-right text-foreground w-16">{fmt(s.available)}</span>
                      <span className={cn("text-right font-bold w-14", s.isBestPrice ? "text-accent" : "text-foreground")}>{fmtPrice(s.price)}</span>
                      <span className="text-right text-foreground w-10">{s.deliveryDays}d</span>
                      <span className="text-center w-8"><SourceIcon h={s.sourceHealth} /></span>
                      <span className="w-16 text-right">
                        {row.purchaseState === "open" && (
                          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[8px] font-mono text-primary hover:bg-primary/10"
                            onClick={e => { e.stopPropagation(); onBuy(row.id); }}>
                            <ShoppingCart className="w-2.5 h-2.5 mr-0.5" /> Koop
                          </Button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-3 border-t border-border/60 flex items-center gap-2 text-muted-foreground text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" /> Geen leveranciers — recept ontbreekt
                </div>
              )}

              {/* Track & Trace for completed */}
              {isPurchased && row.trackTrace && (
                <div className="px-5 py-3 border-t border-border/60 bg-accent/[0.03]">
                  <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">Track & Trace</h4>
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5">
                      <Truck className={cn("w-4 h-4", row.trackTrace.status === "Geleverd" ? "text-accent" : "text-primary")} />
                      <span className={cn("font-bold", row.trackTrace.status === "Geleverd" ? "text-accent" : "text-primary")}>{row.trackTrace.status}</span>
                    </span>
                    <span className="text-muted-foreground">{row.trackTrace.location}</span>
                    <span className="text-foreground font-semibold">{row.trackTrace.eta}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 px-5 py-3 border-t border-border/60 bg-muted/20">
                {row.supplierCount > 0 && row.purchaseState === "open" && (
                  <>
                    <Button size="sm" className="h-7 text-[10px] font-mono font-bold gap-1" onClick={() => onBuy(row.id)}>
                      <ShoppingCart className="w-3 h-3" /> Koop — AI advies
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Markeer ingekocht
                    </Button>
                  </>
                )}
                {isPurchased && (
                  <span className="text-[10px] font-mono text-accent font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Ingekocht om {row.purchasedAt} — {fmt(row.purchasedQuantity)} st.
                  </span>
                )}
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-mono text-muted-foreground gap-1 ml-auto">
                  <X className="w-3 h-3" /> Negeer
                </Button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  DETAIL ROW HELPER                                                  */
/* ------------------------------------------------------------------ */
const DetailRow = ({ label, value, accent, warn, primary, muted, icon }: {
  label: string; value: string; accent?: boolean; warn?: boolean; primary?: boolean; muted?: boolean; icon?: React.ReactNode;
}) => (
  <>
    <span className="text-muted-foreground">{label}</span>
    <span className={cn(
      "text-right font-semibold flex items-center justify-end gap-1",
      accent ? "text-accent" : warn ? "text-primary" : primary ? "text-primary" : muted ? "text-muted-foreground/60" : "text-foreground"
    )}>
      {icon}{value}
    </span>
  </>
);

export default ProcurementCockpit;
