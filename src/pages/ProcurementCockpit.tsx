import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Filter, RotateCcw, ChevronDown, ChevronRight, ExternalLink,
  TrendingUp, TrendingDown, Minus, Bot, ShoppingCart, AlertTriangle,
  Clock, Package, Truck, DollarSign, BarChart3, CheckCircle2, X
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
import { DataMaturityBadge, SourceLabel } from "@/components/intelligence-hub/DataMaturityBadge";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type ChangeDirection = "up" | "down" | "stable";
type CoverageStatus = "covered" | "partial" | "open" | "at-risk";

interface SupplierOption {
  supplier: string;
  channel: string;
  available: number;
  price: number;
  deliveryDays: number;
  confidence: number;
}

interface ProcurementRow {
  id: string;
  article: string;
  stemLength: string;
  program: string;
  customer: string;
  forecastDemand: number;
  coveredVolume: number;
  remainingToBuy: number;
  expectedPrice: number;
  supplierCount: number;
  aiRecommendation: string;
  deliveryDate: string;
  coverageStatus: CoverageStatus;
  demandChange: ChangeDirection;
  demandSource: string;
  suppliers: SupplierOption[];
  variants?: { length: string; demand: number; covered: number }[];
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                          */
/* ------------------------------------------------------------------ */

const demoRows: ProcurementRow[] = [
  {
    id: "p1",
    article: "Roos Red Naomi",
    stemLength: "60cm",
    program: "Week 12 — AH",
    customer: "Albert Heijn",
    forecastDemand: 12400,
    coveredVolume: 8200,
    remainingToBuy: 4200,
    expectedPrice: 0.24,
    supplierCount: 3,
    aiRecommendation: "Koop vandaag via Floriday — prijsvoordeel 7%",
    deliveryDate: "2026-03-16",
    coverageStatus: "partial",
    demandChange: "up",
    demandSource: "Axerrio forecast",
    suppliers: [
      { supplier: "Van der Berg Roses", channel: "Floriday", available: 5000, price: 0.22, deliveryDays: 2, confidence: 92 },
      { supplier: "Porta Nova", channel: "Contract", available: 3000, price: 0.26, deliveryDays: 1, confidence: 98 },
      { supplier: "Marktplaats NL", channel: "Marketplace", available: 2000, price: 0.28, deliveryDays: 3, confidence: 75 },
    ],
    variants: [
      { length: "50cm", demand: 3200, covered: 3200 },
      { length: "60cm", demand: 6400, covered: 3800 },
      { length: "70cm", demand: 2800, covered: 1200 },
    ],
  },
  {
    id: "p2",
    article: "Pistacia",
    stemLength: "50cm",
    program: "Week 12 — Jumbo",
    customer: "Jumbo",
    forecastDemand: 6800,
    coveredVolume: 6800,
    remainingToBuy: 0,
    expectedPrice: 0.14,
    supplierCount: 2,
    aiRecommendation: "Volledig gedekt via contractleverancier",
    deliveryDate: "2026-03-17",
    coverageStatus: "covered",
    demandChange: "stable",
    demandSource: "Productieorder",
    suppliers: [
      { supplier: "Green Team", channel: "Contract", available: 7000, price: 0.14, deliveryDays: 1, confidence: 99 },
      { supplier: "Flora Direct", channel: "Webshop", available: 3000, price: 0.16, deliveryDays: 2, confidence: 88 },
    ],
    variants: [
      { length: "40cm", demand: 1800, covered: 1800 },
      { length: "50cm", demand: 3200, covered: 3200 },
      { length: "60cm", demand: 1800, covered: 1800 },
    ],
  },
  {
    id: "p3",
    article: "Germini Barca",
    stemLength: "45cm",
    program: "Week 12 — Aldi",
    customer: "Aldi",
    forecastDemand: 9200,
    coveredVolume: 2100,
    remainingToBuy: 7100,
    expectedPrice: 0.11,
    supplierCount: 4,
    aiRecommendation: "Vraagpiek verwacht morgen — nu inkopen",
    deliveryDate: "2026-03-15",
    coverageStatus: "at-risk",
    demandChange: "up",
    demandSource: "Axerrio forecast",
    suppliers: [
      { supplier: "Germini World", channel: "Floriday", available: 4000, price: 0.10, deliveryDays: 2, confidence: 85 },
      { supplier: "FlowerLink", channel: "Marketplace", available: 2500, price: 0.12, deliveryDays: 2, confidence: 72 },
      { supplier: "Direct Grower", channel: "Webshop", available: 3000, price: 0.11, deliveryDays: 3, confidence: 80 },
      { supplier: "BloemenVeiling", channel: "Floriday", available: 1500, price: 0.13, deliveryDays: 1, confidence: 90 },
    ],
  },
  {
    id: "p4",
    article: "Alstroemeria Virginia",
    stemLength: "55cm",
    program: "Week 13 — Lidl",
    customer: "Lidl",
    forecastDemand: 4600,
    coveredVolume: 0,
    remainingToBuy: 4600,
    expectedPrice: 0.0,
    supplierCount: 0,
    aiRecommendation: "Recept ontbreekt — productidentiteit onbekend",
    deliveryDate: "2026-03-20",
    coverageStatus: "open",
    demandChange: "stable",
    demandSource: "Forecast (onopgelost)",
    suppliers: [],
  },
  {
    id: "p5",
    article: "Dianthus Nobbio",
    stemLength: "60cm",
    program: "Week 12 — Dekamarkt",
    customer: "Dekamarkt",
    forecastDemand: 3200,
    coveredVolume: 1600,
    remainingToBuy: 1600,
    expectedPrice: 0.18,
    supplierCount: 2,
    aiRecommendation: "Contractleverancier goedkoper dan markt",
    deliveryDate: "2026-03-16",
    coverageStatus: "partial",
    demandChange: "down",
    demandSource: "Productieorder",
    suppliers: [
      { supplier: "Carnation BV", channel: "Contract", available: 2000, price: 0.17, deliveryDays: 1, confidence: 95 },
      { supplier: "FloriTrade", channel: "Floriday", available: 1500, price: 0.20, deliveryDays: 2, confidence: 82 },
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
  return <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border", cls)}>{label}</span>;
};

const changeIcon = (d: ChangeDirection) => {
  if (d === "up") return <TrendingUp className="w-3 h-3 text-accent" />;
  if (d === "down") return <TrendingDown className="w-3 h-3 text-destructive" />;
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

const fmt = (n: number) => n.toLocaleString("nl-NL");
const fmtPrice = (n: number) => n > 0 ? `€${n.toFixed(2)}` : "—";

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
    <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg", accent || "bg-primary/10")}>
      <Icon className={cn("w-4 h-4", accent ? "text-accent-foreground" : "text-primary")} />
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
        <div key={i} className="rounded-lg border border-border bg-card/50 p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground truncate">{s.supplier}</span>
            <Badge variant="outline" className="text-[9px] font-mono">{s.channel}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] font-mono">
            <span className="text-muted-foreground">Beschikbaar</span>
            <span className="text-foreground text-right">{fmt(s.available)}</span>
            <span className="text-muted-foreground">Prijs</span>
            <span className="text-foreground text-right">{fmtPrice(s.price)}</span>
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

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <TableRow className="group cursor-pointer hover:bg-secondary/30" onClick={() => setOpen(!open)}>
        <TableCell className="w-8 px-2">
          <CollapsibleTrigger asChild>
            <button className="p-0.5" onClick={e => e.stopPropagation()}>
              {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          </CollapsibleTrigger>
        </TableCell>
        <TableCell className="font-bold text-xs text-foreground whitespace-nowrap">{row.article}</TableCell>
        <TableCell className="text-[10px] font-mono text-muted-foreground">{row.stemLength}</TableCell>
        <TableCell className="text-xs text-foreground max-w-[140px] truncate">{row.program}</TableCell>
        <TableCell className="text-xs font-mono text-foreground text-right">{fmt(row.forecastDemand)}</TableCell>
        <TableCell className="text-xs font-mono text-foreground text-right">{fmt(row.coveredVolume)}</TableCell>
        <TableCell className="text-xs font-mono font-bold text-foreground text-right">{fmt(row.remainingToBuy)}</TableCell>
        <TableCell className="text-xs font-mono text-foreground text-right">{fmtPrice(row.expectedPrice)}</TableCell>
        <TableCell className="text-center">{coverageBadge(row.coverageStatus)}</TableCell>
        <TableCell className="text-center">{row.supplierCount}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1.5 max-w-[200px]">
            <Bot className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[10px] text-muted-foreground truncate">{row.aiRecommendation}</span>
          </div>
        </TableCell>
        <TableCell className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{row.deliveryDate}</TableCell>
        <TableCell className="text-center">{changeIcon(row.demandChange)}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            {row.supplierCount > 0 && (
              <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-mono text-primary hover:text-primary">
                <ShoppingCart className="w-3 h-3 mr-1" />Koop
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <CollapsibleContent asChild>
        <tr>
          <td colSpan={14} className="p-0">
            <div className="border-t border-border bg-secondary/20">
              {/* AI Advice banner */}
              <div className="flex items-start gap-2 px-4 py-2.5 border-b border-border bg-primary/5">
                <Bot className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">AI Inkoopadvies</p>
                  <p className="text-[11px] text-muted-foreground">{row.aiRecommendation}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 px-4 py-2 border-b border-border text-[10px] font-mono text-muted-foreground">
                <span>Bron: <SourceLabel source={row.demandSource} maturity={row.coverageStatus === "open" ? "unresolved" : row.coverageStatus === "partial" ? "partial" : "live"} /></span>
                <span>Klant: <span className="text-foreground">{row.customer}</span></span>
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
                        <span className="text-[10px] font-mono text-muted-foreground">{fmt(v.demand)} vraag</span>
                        <span className="text-[10px] font-mono text-accent">{fmt(v.covered)} gedekt</span>
                        {v.demand - v.covered > 0 && (
                          <span className="text-[10px] font-mono text-primary font-bold">{fmt(v.demand - v.covered)} open</span>
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
                  <X className="w-3 h-3" /> Negeer aanbeveling
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
/*  FILTER BAR                                                         */
/* ------------------------------------------------------------------ */

const FilterBar = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Filter className="w-3.5 h-3.5" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Filters</span>
      </div>

      <Select>
        <SelectTrigger className="h-7 w-[130px] text-[10px] font-mono bg-card border-border">
          <SelectValue placeholder="Datum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Vandaag</SelectItem>
          <SelectItem value="this-week">Deze week</SelectItem>
          <SelectItem value="next-week">Volgende week</SelectItem>
          <SelectItem value="week-12">Week 12</SelectItem>
          <SelectItem value="week-13">Week 13</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="h-7 w-[130px] text-[10px] font-mono bg-card border-border">
          <SelectValue placeholder="Klant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle klanten</SelectItem>
          <SelectItem value="ah">Albert Heijn</SelectItem>
          <SelectItem value="jumbo">Jumbo</SelectItem>
          <SelectItem value="aldi">Aldi</SelectItem>
          <SelectItem value="lidl">Lidl</SelectItem>
          <SelectItem value="deka">Dekamarkt</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="h-7 w-[130px] text-[10px] font-mono bg-card border-border">
          <SelectValue placeholder="Artikel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle artikelen</SelectItem>
          <SelectItem value="roos">Roos</SelectItem>
          <SelectItem value="pistacia">Pistacia</SelectItem>
          <SelectItem value="germini">Germini</SelectItem>
          <SelectItem value="dianthus">Dianthus</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="h-7 w-[130px] text-[10px] font-mono bg-card border-border">
          <SelectValue placeholder="Kanaal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle kanalen</SelectItem>
          <SelectItem value="floriday">Floriday</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="webshop">Webshop</SelectItem>
          <SelectItem value="marketplace">Marketplace</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="h-7 w-[130px] text-[10px] font-mono bg-card border-border">
          <SelectValue placeholder="Dekking" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle statussen</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="partial">Gedeeltelijk</SelectItem>
          <SelectItem value="at-risk">At Risk</SelectItem>
          <SelectItem value="covered">Gedekt</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-mono text-muted-foreground gap-1">
        <RotateCcw className="w-3 h-3" /> Reset
      </Button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

const ProcurementCockpit = () => {
  const totalDemand = demoRows.reduce((s, r) => s + r.forecastDemand, 0);
  const totalCovered = demoRows.reduce((s, r) => s + r.coveredVolume, 0);
  const totalOpen = demoRows.reduce((s, r) => s + r.remainingToBuy, 0);
  const totalValue = demoRows.reduce((s, r) => s + r.remainingToBuy * r.expectedPrice, 0);
  const uniqueSuppliers = new Set(demoRows.flatMap(r => r.suppliers.map(s => s.supplier))).size;

  return (
    <div className="relative flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-3 md:p-5 space-y-4 max-w-[1600px] mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-sm md:text-base font-black text-foreground uppercase tracking-wider">Procurement Cockpit</h1>
              <p className="text-[10px] font-mono text-muted-foreground">Operationeel inkoopoverzicht — real-time vraag & leveranciersdekking</p>
            </div>
            <DataMaturityBadge maturity="partial" size="sm" label="Forecast gedeeltelijk beschikbaar" />
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <KpiCard icon={Package} label="Totale vraag" value={fmt(totalDemand)} sub="stelen deze week" />
            <KpiCard icon={CheckCircle2} label="Gedekte supply" value={fmt(totalCovered)} sub={`${Math.round((totalCovered / totalDemand) * 100)}% dekking`} accent="bg-accent/15" />
            <KpiCard icon={ShoppingCart} label="Open inkoop" value={fmt(totalOpen)} sub="nog in te kopen" />
            <KpiCard icon={DollarSign} label="Verwachte waarde" value={`€${totalValue.toFixed(0)}`} sub="open inkoopwaarde" />
            <KpiCard icon={Truck} label="Leveranciers" value={String(uniqueSuppliers)} sub="beschikbaar" />
            <KpiCard icon={Bot} label="AI Confidence" value="84%" sub="forecastbetrouwbaarheid" accent="bg-primary/10" />
          </div>

          {/* Filters */}
          <FilterBar />

          {/* Procurement Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="w-8 px-2" />
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider">Artikel</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider">Lengte</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider">Programma</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider text-right">Vraag</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider text-right">Gedekt</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider text-right">Open</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider text-right">Prijs</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider text-center">Lev.</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider">AI Advies</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider">Datum</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider text-center">Δ</TableHead>
                  <TableHead className="text-[10px] font-mono font-bold uppercase tracking-wider">Actie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoRows.map(row => (
                  <ProcurementTableRow key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer info */}
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
