import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Factory, AlertTriangle, Clock, TrendingUp, TrendingDown, Minus,
  ChevronDown, ChevronRight, Filter, Users, Gauge, Package,
  Zap, Activity, BarChart3, Layers, AlertCircle, XCircle,
  ArrowUpDown, Flame, Star, Brain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
type Severity = "critical" | "warning" | "info";
type EffStatus = "efficient" | "moderate" | "inefficient";

interface Bottleneck {
  id: string;
  severity: Severity;
  title: string;
  what: string;
  why: string;
  impact: string;
  line?: string;
  family?: string;
  time: string;
}

interface PressureCell {
  id: string;
  label: string;
  pressure: number; // 0-10
  orders: number;
  avgStems: number;
  fragmentation: boolean;
  lateCluster: boolean;
}

interface ComplexityRow {
  family: string;
  avgStems: number;
  complexityIndex: number; // 0-10
  assemblyDifficulty: "low" | "medium" | "high";
  apuTarget: number;
  apuActual: number;
  efficiencyPct: number;
  volume: number;
}

interface LabourRow {
  line: string;
  dept: string;
  labour: number;
  labourTarget: number;
  per1000Stems: number;
  per1000Target: number;
  effPct: number;
  product: string;
  signal: "overstaffed" | "balanced" | "understaffed";
}

interface EfficiencyTableRow {
  id: string;
  family: string;
  orders: number;
  units: number;
  avgStems: number;
  apuTarget: number;
  apuActual: number;
  labour: number;
  labourEff: number;
  pressureIndex: number;
  complexityScore: number;
  bottleneck: boolean;
  action: string;
}

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */
const summaryMetrics = [
  { label: "Output vandaag", value: "18.6K", unit: "st", icon: Package, status: "healthy" as const },
  { label: "W-APU actueel", value: "208", unit: "st/u", icon: Gauge, status: "warning" as const, target: "220", change: "−5.5%", changeDir: "down" as const },
  { label: "APU gap", value: "−12", unit: "st/u", icon: TrendingDown, status: "warning" as const },
  { label: "Arbeid ingezet", value: "68", unit: "pers", icon: Users, status: "healthy" as const },
  { label: "Arbeid / 1000 st", value: "3.7", unit: "pers", icon: Users, status: "warning" as const, target: "3.2" },
  { label: "Drukindex", value: "7.2", unit: "/10", icon: Flame, status: "warning" as const, change: "+0.8", changeDir: "up" as const },
  { label: "Eff. trend vs gisteren", value: "−2.4", unit: "%", icon: Activity, status: "warning" as const, change: "Dalend", changeDir: "down" as const },
  { label: "Lijn-onbalans", value: "3", unit: "lijnen", icon: AlertTriangle, status: "critical" as const },
];

const pressureLines: PressureCell[] = [
  { id: "H1", label: "Hand 1", pressure: 5.2, orders: 3, avgStems: 11, fragmentation: false, lateCluster: false },
  { id: "H2", label: "Hand 2", pressure: 4.8, orders: 2, avgStems: 9, fragmentation: false, lateCluster: false },
  { id: "H3", label: "Hand 3", pressure: 9.1, orders: 4, avgStems: 15, fragmentation: true, lateCluster: true },
  { id: "H4", label: "Hand 4", pressure: 4.0, orders: 2, avgStems: 9, fragmentation: false, lateCluster: false },
  { id: "H5", label: "Hand 5", pressure: 6.5, orders: 3, avgStems: 12, fragmentation: true, lateCluster: false },
  { id: "H6", label: "Hand 6", pressure: 8.4, orders: 3, avgStems: 14, fragmentation: false, lateCluster: true },
  { id: "H7", label: "Hand 7", pressure: 2.0, orders: 0, avgStems: 0, fragmentation: false, lateCluster: false },
  { id: "B1", label: "Band 1", pressure: 3.2, orders: 1, avgStems: 7, fragmentation: false, lateCluster: false },
  { id: "B2", label: "Band 2", pressure: 5.8, orders: 2, avgStems: 8, fragmentation: false, lateCluster: false },
  { id: "B3", label: "Band 3", pressure: 4.5, orders: 2, avgStems: 7, fragmentation: false, lateCluster: false },
  { id: "B4", label: "Band 4", pressure: 7.6, orders: 3, avgStems: 13, fragmentation: true, lateCluster: false },
  { id: "B5", label: "Band 5", pressure: 1.5, orders: 0, avgStems: 0, fragmentation: false, lateCluster: false },
];

const pressureFamilies: PressureCell[] = [
  { id: "prem", label: "Premium", pressure: 7.8, orders: 8, avgStems: 13, fragmentation: true, lateCluster: true },
  { id: "std", label: "Standard", pressure: 5.2, orders: 6, avgStems: 10, fragmentation: false, lateCluster: false },
  { id: "budg", label: "Budget", pressure: 4.0, orders: 5, avgStems: 8, fragmentation: false, lateCluster: false },
  { id: "seas", label: "Seasonal", pressure: 8.5, orders: 4, avgStems: 14, fragmentation: true, lateCluster: true },
  { id: "field", label: "Field", pressure: 3.4, orders: 3, avgStems: 7, fragmentation: false, lateCluster: false },
];

const bottlenecks: Bottleneck[] = [
  { id: "b1", severity: "critical", title: "H3 — Extreme steelcomplexiteit", what: "Lijn H3 verwerkt 'Lovely' met 15 stelen/boeket en 4 gelijktijdige orders.", why: "Hoge steelcomplexiteit gecombineerd met orderfragmentatie verlaagt APU naar 172 (norm 220).", impact: "22% efficiëntieverlies, €840 extra arbeidskosten per dag.", line: "H3", family: "Premium", time: "10:12" },
  { id: "b2", severity: "critical", title: "Seasonal producten verstoren ritme", what: "Productfamilie Seasonal heeft complexiteitsscore 8.2/10 en veroorzaakt APU-daling op 3 lijnen.", why: "Hoge steelvariatie, onbekende recepten en kleine orderseries.", impact: "Gemiddeld −18% APU op betrokken lijnen.", family: "Seasonal", time: "09:30" },
  { id: "b3", severity: "warning", title: "H6 — Late order clustering", what: "3 orders met vertrek 14:00-14:30 geconcentreerd op H6.", why: "Ongelijke orderverdeling creëert piekdruk in de middag.", impact: "Risico op vertraging en kwaliteitsverlies.", line: "H6", time: "09:45" },
  { id: "b4", severity: "warning", title: "Arbeiddruk Hand-afdeling", what: "68 medewerkers ingezet, 3.7 per 1000 stelen vs norm 3.2.", why: "Hoge complexiteit vereist meer arbeid maar levert minder output.", impact: "15.6% arbeids-inefficiëntie, ~€1.200/dag overbesteding.", time: "09:00" },
  { id: "b5", severity: "warning", title: "B4 — Orderfragmentatie", what: "3 kleine orders van verschillende klanten op Band 4.", why: "Frequente productwissels verlagen doorloopsnelheid.", impact: "APU 310 vs target 330, −6% efficiëntie.", line: "B4", time: "10:20" },
  { id: "b6", severity: "info", title: "Materiaalrisico PO-007", what: "Order Chique wacht op Alstroemeria Virginia — recept onopgelost.", why: "Zonder receptidentificatie kan inkoop niet afronden.", impact: "Order geblokkeerd, lijn-slot onbenut.", time: "08:30" },
];

const complexityRows: ComplexityRow[] = [
  { family: "Premium", avgStems: 13.2, complexityIndex: 7.8, assemblyDifficulty: "high", apuTarget: 220, apuActual: 195, efficiencyPct: 88.6, volume: 8200 },
  { family: "Seasonal", avgStems: 14.1, complexityIndex: 8.2, assemblyDifficulty: "high", apuTarget: 220, apuActual: 188, efficiencyPct: 85.5, volume: 5200 },
  { family: "Standard", avgStems: 10.4, complexityIndex: 5.0, assemblyDifficulty: "medium", apuTarget: 220, apuActual: 218, efficiencyPct: 99.1, volume: 11600 },
  { family: "Budget", avgStems: 8.0, complexityIndex: 3.2, assemblyDifficulty: "low", apuTarget: 220, apuActual: 226, efficiencyPct: 102.7, volume: 9400 },
  { family: "Field", avgStems: 7.2, complexityIndex: 2.8, assemblyDifficulty: "low", apuTarget: 330, apuActual: 342, efficiencyPct: 103.6, volume: 6800 },
];

const labourRows: LabourRow[] = [
  { line: "H1", dept: "Hand", labour: 8, labourTarget: 7, per1000Stems: 3.2, per1000Target: 3.2, effPct: 100, product: "Charme XL", signal: "balanced" },
  { line: "H2", dept: "Hand", labour: 7, labourTarget: 7, per1000Stems: 3.1, per1000Target: 3.2, effPct: 103, product: "Pastel", signal: "balanced" },
  { line: "H3", dept: "Hand", labour: 10, labourTarget: 7, per1000Stems: 5.8, per1000Target: 3.2, effPct: 55, product: "Lovely", signal: "overstaffed" },
  { line: "H4", dept: "Hand", labour: 7, labourTarget: 7, per1000Stems: 3.0, per1000Target: 3.2, effPct: 107, product: "Spring Bouquet", signal: "balanced" },
  { line: "H5", dept: "Hand", labour: 8, labourTarget: 8, per1000Stems: 3.4, per1000Target: 3.2, effPct: 94, product: "Trend", signal: "balanced" },
  { line: "H6", dept: "Hand", labour: 6, labourTarget: 8, per1000Stems: 3.6, per1000Target: 3.2, effPct: 89, product: "Elegance", signal: "understaffed" },
  { line: "B1", dept: "Band", labour: 6, labourTarget: 5, per1000Stems: 2.4, per1000Target: 2.2, effPct: 92, product: "De Luxe ✓", signal: "balanced" },
  { line: "B2", dept: "Band", labour: 5, labourTarget: 5, per1000Stems: 2.3, per1000Target: 2.2, effPct: 96, product: "Zomermix", signal: "balanced" },
  { line: "B3", dept: "Band", labour: 5, labourTarget: 5, per1000Stems: 2.1, per1000Target: 2.2, effPct: 105, product: "Field M", signal: "balanced" },
  { line: "B4", dept: "Band", labour: 4, labourTarget: 5, per1000Stems: 2.8, per1000Target: 2.2, effPct: 79, product: "Moederdag Mix", signal: "understaffed" },
];

const efficiencyTable: EfficiencyTableRow[] = [
  { id: "e1", family: "Premium", orders: 8, units: 8200, avgStems: 13.2, apuTarget: 220, apuActual: 195, labour: 24, labourEff: 81, pressureIndex: 7.8, complexityScore: 7.8, bottleneck: true, action: "Complexiteit spreiden" },
  { id: "e2", family: "Seasonal", orders: 4, units: 5200, avgStems: 14.1, apuTarget: 220, apuActual: 188, labour: 14, labourEff: 76, pressureIndex: 8.5, complexityScore: 8.2, bottleneck: true, action: "Orderbundeling" },
  { id: "e3", family: "Standard", orders: 6, units: 11600, avgStems: 10.4, apuTarget: 220, apuActual: 218, labour: 14, labourEff: 98, pressureIndex: 5.2, complexityScore: 5.0, bottleneck: false, action: "—" },
  { id: "e4", family: "Budget", orders: 5, units: 9400, avgStems: 8.0, apuTarget: 220, apuActual: 226, labour: 10, labourEff: 104, pressureIndex: 4.0, complexityScore: 3.2, bottleneck: false, action: "Schaalbaar" },
  { id: "e5", family: "Field", orders: 3, units: 6800, avgStems: 7.2, apuTarget: 330, apuActual: 342, labour: 10, labourEff: 106, pressureIndex: 3.4, complexityScore: 2.8, bottleneck: false, action: "Schaalbaar" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString("nl-NL");

const pressureColor = (p: number) =>
  p >= 8 ? "bg-destructive" : p >= 6 ? "bg-yellow-500" : p >= 4 ? "bg-primary/60" : "bg-accent/60";

const pressureTextColor = (p: number) =>
  p >= 8 ? "text-destructive" : p >= 6 ? "text-yellow-500" : "text-accent";

const effColor = (pct: number) =>
  pct >= 100 ? "text-accent" : pct >= 90 ? "text-yellow-500" : "text-destructive";

const signalCls: Record<string, { bg: string; text: string; label: string }> = {
  overstaffed: { bg: "bg-destructive/10 border-destructive/20", text: "text-destructive", label: "Overbezet" },
  balanced: { bg: "bg-accent/10 border-accent/20", text: "text-accent", label: "Gebalanceerd" },
  understaffed: { bg: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-500", label: "Onderbezet" },
};

const difficultyLabel: Record<string, { cls: string }> = {
  low: { cls: "text-accent bg-accent/10" },
  medium: { cls: "text-yellow-500 bg-yellow-500/10" },
  high: { cls: "text-destructive bg-destructive/10" },
};

const alertIcon: Record<Severity, typeof AlertTriangle> = {
  critical: XCircle, warning: AlertTriangle, info: AlertCircle,
};
const alertCls: Record<Severity, string> = {
  critical: "border-destructive/30 bg-destructive/5",
  warning: "border-yellow-500/30 bg-yellow-500/5",
  info: "border-border bg-card/50",
};

/* ------------------------------------------------------------------ */
/*  REUSABLE COMPONENTS                                                */
/* ------------------------------------------------------------------ */
const Section = ({ title, icon: Icon, children, badge }: { title: string; icon: typeof Factory; children: React.ReactNode; badge?: string }) => (
  <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <h2 className="text-[13px] font-bold text-foreground tracking-tight">{title}</h2>
      {badge && <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary">{badge}</span>}
    </div>
    <div className="p-4 md:p-5">{children}</div>
  </section>
);

const MetricCard = ({ label, value, unit, icon: Icon, status, change, changeDir, target }: {
  label: string; value: string; unit?: string; icon: typeof Factory;
  status: "healthy" | "warning" | "critical";
  change?: string; changeDir?: "up" | "down"; target?: string;
}) => {
  const bg = status === "healthy" ? "bg-accent/5 border-accent/20" : status === "warning" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-destructive/5 border-destructive/20";
  const dot = status === "healthy" ? "bg-accent" : status === "warning" ? "bg-yellow-500" : "bg-destructive";
  const DirIcon = changeDir === "up" ? TrendingUp : changeDir === "down" ? TrendingDown : Minus;
  const changeColor = status === "healthy" ? "text-accent" : status === "warning" ? "text-yellow-500" : "text-destructive";
  return (
    <div className={cn("p-3 rounded-xl border transition-all hover:shadow-md", bg)}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={cn("w-1.5 h-1.5 rounded-full", dot)} />
        <span className="text-[10px] font-medium text-foreground/50 tracking-tight truncate">{label}</span>
      </div>
      <div className="flex items-end justify-between gap-1">
        <div>
          <div className="text-lg font-extrabold text-foreground leading-none">
            {value}
            {unit && <span className="text-[10px] font-normal text-muted-foreground/50 ml-0.5">{unit}</span>}
          </div>
          {target && <div className="text-[10px] text-muted-foreground/40 mt-0.5">Target: {target}</div>}
          {change && (
            <div className={cn("flex items-center gap-0.5 mt-1", changeColor)}>
              <DirIcon className="w-3 h-3" />
              <span className="text-[10px] font-semibold">{change}</span>
            </div>
          )}
        </div>
        <Icon className="w-5 h-5 text-muted-foreground/20 shrink-0" />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  PRESSURE HEATMAP CELL                                              */
/* ------------------------------------------------------------------ */
const PressureCard = ({ cell }: { cell: PressureCell }) => (
  <div className={cn(
    "rounded-xl border p-3 transition-all hover:shadow-md",
    cell.pressure >= 8 ? "border-destructive/30 bg-destructive/5" :
    cell.pressure >= 6 ? "border-yellow-500/30 bg-yellow-500/5" :
    "border-border bg-card/50"
  )}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <div className={cn("w-2 h-2 rounded-full", pressureColor(cell.pressure))} />
        <span className="text-[12px] font-bold text-foreground">{cell.label}</span>
      </div>
      <span className={cn("text-[13px] font-extrabold font-mono", pressureTextColor(cell.pressure))}>{cell.pressure.toFixed(1)}</span>
    </div>
    <div className="space-y-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-muted-foreground/50">Orders</span>
        <span className="text-foreground/70">{cell.orders}</span>
      </div>
      <div className="flex justify-between text-[10px]">
        <span className="text-muted-foreground/50">Gem. stelen</span>
        <span className={cn("font-medium", cell.avgStems >= 13 ? "text-destructive" : cell.avgStems >= 10 ? "text-yellow-500" : "text-foreground/70")}>{cell.avgStems || "—"}</span>
      </div>
    </div>
    {(cell.fragmentation || cell.lateCluster) && (
      <div className="flex gap-1 mt-2">
        {cell.fragmentation && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Fragment</span>}
        {cell.lateCluster && <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">Late cluster</span>}
      </div>
    )}
    {/* Pressure bar */}
    <div className="mt-2 h-1.5 rounded-full bg-border/30 overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", pressureColor(cell.pressure))} style={{ width: `${cell.pressure * 10}%` }} />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */
const ProductionCockpit = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("pressure");
  const [pressureView, setPressureView] = useState<"lines" | "families">("lines");

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  const sortedTable = [...efficiencyTable].sort((a, b) => {
    if (sortBy === "pressure") return b.pressureIndex - a.pressureIndex;
    if (sortBy === "efficiency") return a.labourEff - b.labourEff;
    if (sortBy === "deviation") return (a.apuActual - a.apuTarget) - (b.apuActual - b.apuTarget);
    return 0;
  });

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <MCHologramBackground />
        <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-5 space-y-4">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-brand" />
              <div>
                <h1 className="text-sm font-black text-foreground uppercase tracking-wider">Production Cockpit</h1>
                <p className="text-[10px] font-mono text-muted-foreground">Efficiëntie · Complexiteit · Druk · Knelpunten</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono gap-1 border-accent/30 text-accent">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              LIVE
            </Badge>
          </div>

          {/* ── SECTION 1: OPERATIONAL EFFICIENCY SUMMARY ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {summaryMetrics.map(m => <MetricCard key={m.label} {...m} />)}
          </div>

          {/* ── SECTION 2: PRODUCTION PRESSURE MAP ── */}
          <Section title="Production Pressure Map" icon={Flame} badge={`${pressureLines.filter(l => l.pressure >= 7).length} hoge druk`}>
            <div className="flex gap-2 mb-4">
              <Button variant={pressureView === "lines" ? "default" : "outline"} size="sm" className="h-7 text-[10px] font-mono" onClick={() => setPressureView("lines")}>Per lijn</Button>
              <Button variant={pressureView === "families" ? "default" : "outline"} size="sm" className="h-7 text-[10px] font-mono" onClick={() => setPressureView("families")}>Per productfamilie</Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {(pressureView === "lines" ? pressureLines : pressureFamilies).map(cell => (
                <PressureCard key={cell.id} cell={cell} />
              ))}
            </div>
          </Section>

          {/* ── SECTION 3: BOTTLENECK INTELLIGENCE ── */}
          <Section title="Bottleneck Intelligence" icon={AlertTriangle} badge={`${bottlenecks.filter(b => b.severity === "critical").length} kritiek`}>
            <div className="space-y-2">
              {bottlenecks.map(b => {
                const BIcon = alertIcon[b.severity];
                return (
                  <div key={b.id} className={cn("p-3.5 rounded-xl border", alertCls[b.severity])}>
                    <div className="flex items-start gap-3">
                      <BIcon className={cn("w-4 h-4 shrink-0 mt-0.5", b.severity === "critical" ? "text-destructive" : b.severity === "warning" ? "text-yellow-500" : "text-muted-foreground")} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[12px] font-semibold text-foreground">{b.title}</span>
                          {b.line && <span className="text-[9px] font-mono text-muted-foreground/50 border border-border/50 px-1.5 rounded">{b.line}</span>}
                          {b.family && <span className="text-[9px] font-mono text-muted-foreground/50 border border-border/50 px-1.5 rounded">{b.family}</span>}
                        </div>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <span className="text-[9px] font-mono uppercase text-muted-foreground/40">Wat</span>
                            <p className="text-[11px] text-foreground/70 leading-relaxed">{b.what}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono uppercase text-muted-foreground/40">Waarom</span>
                            <p className="text-[11px] text-foreground/70 leading-relaxed">{b.why}</p>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono uppercase text-muted-foreground/40">Impact</span>
                            <p className={cn("text-[11px] leading-relaxed font-medium", b.severity === "critical" ? "text-destructive" : b.severity === "warning" ? "text-yellow-500" : "text-foreground/70")}>{b.impact}</p>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">{b.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── SECTION 4: PRODUCT COMPLEXITY ANALYSIS ── */}
          <Section title="Product Complexity Analysis" icon={Brain}>
            <div className="space-y-1">
              <div className="hidden md:grid grid-cols-[1.2fr_0.5fr_0.6fr_0.6fr_0.6fr_0.5fr_0.6fr_0.5fr] text-[10px] text-muted-foreground/40 font-mono pb-2 border-b border-border/30 gap-2 px-3">
                <span>Productfamilie</span><span>Gem. stelen</span><span>Complexiteit</span><span>Assemblage</span><span>APU act/target</span><span>Efficiëntie</span><span>Volume</span><span>Impact</span>
              </div>
              {complexityRows.sort((a, b) => b.complexityIndex - a.complexityIndex).map(r => {
                const eff = effColor(r.efficiencyPct);
                return (
                  <div key={r.family} className={cn(
                    "grid grid-cols-1 md:grid-cols-[1.2fr_0.5fr_0.6fr_0.6fr_0.6fr_0.5fr_0.6fr_0.5fr] items-center text-[12px] py-2.5 px-3 rounded-lg gap-2 transition-colors hover:bg-muted/30",
                    r.complexityIndex >= 7 && "bg-destructive/3 border border-destructive/15",
                  )}>
                    <span className="font-semibold text-foreground">{r.family}</span>
                    <span className={cn("hidden md:block font-mono", r.avgStems >= 13 ? "text-destructive font-semibold" : r.avgStems >= 10 ? "text-yellow-500" : "text-foreground/70")}>{r.avgStems}</span>
                    <div className="hidden md:flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-border/30 overflow-hidden">
                        <div className={cn("h-full rounded-full", pressureColor(r.complexityIndex))} style={{ width: `${r.complexityIndex * 10}%` }} />
                      </div>
                      <span className={cn("text-[10px] font-mono font-bold", pressureTextColor(r.complexityIndex))}>{r.complexityIndex}</span>
                    </div>
                    <div className="hidden md:block">
                      <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded", difficultyLabel[r.assemblyDifficulty].cls)}>{r.assemblyDifficulty}</span>
                    </div>
                    <span className="hidden md:block font-mono">
                      <span className={eff}>{r.apuActual}</span>
                      <span className="text-muted-foreground/30">/{r.apuTarget}</span>
                    </span>
                    <span className={cn("hidden md:block font-mono font-semibold", eff)}>{r.efficiencyPct}%</span>
                    <span className="hidden md:block font-mono text-foreground/60">{fmt(r.volume)}</span>
                    <span className="hidden md:block">
                      {r.complexityIndex >= 7 ? <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> : r.complexityIndex >= 5 ? <AlertCircle className="w-3.5 h-3.5 text-yellow-500" /> : <span className="text-accent text-[10px]">OK</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── SECTION 5: LABOUR EFFICIENCY VIEW ── */}
          <Section title="Labour Efficiency" icon={Users}>
            <div className="space-y-1">
              <div className="hidden md:grid grid-cols-[0.4fr_0.5fr_0.9fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.6fr] text-[10px] text-muted-foreground/40 font-mono pb-2 border-b border-border/30 gap-2 px-3">
                <span>Lijn</span><span>Afd.</span><span>Product</span><span>Arbeid</span><span>Target</span><span>/1000 st</span><span>Target</span><span>Eff %</span><span>Signaal</span>
              </div>
              {labourRows.map(r => {
                const s = signalCls[r.signal];
                return (
                  <div key={r.line} className={cn(
                    "grid grid-cols-1 md:grid-cols-[0.4fr_0.5fr_0.9fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.6fr] items-center text-[12px] py-2 px-3 rounded-lg gap-2 transition-colors hover:bg-muted/30",
                    r.signal !== "balanced" && `border ${s.bg}`,
                  )}>
                    <span className="font-bold text-foreground">{r.line}</span>
                    <span className="hidden md:block text-muted-foreground/60 text-[11px]">{r.dept}</span>
                    <span className="hidden md:block text-foreground/70 text-[11px] truncate">{r.product}</span>
                    <span className={cn("hidden md:block font-mono", r.labour > r.labourTarget ? "text-destructive font-semibold" : "text-foreground/70")}>{r.labour}</span>
                    <span className="hidden md:block font-mono text-muted-foreground/50">{r.labourTarget}</span>
                    <span className={cn("hidden md:block font-mono", r.per1000Stems > r.per1000Target * 1.1 ? "text-destructive font-semibold" : "text-foreground/70")}>{r.per1000Stems}</span>
                    <span className="hidden md:block font-mono text-muted-foreground/50">{r.per1000Target}</span>
                    <span className={cn("hidden md:block font-mono font-semibold", effColor(r.effPct))}>{r.effPct}%</span>
                    <div className="hidden md:block">
                      <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full border", s.bg, s.text)}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── SECTION 6: DETAILED EFFICIENCY TABLE ── */}
          <Section title="Efficiëntie Detail" icon={BarChart3} badge={`${efficiencyTable.length} families`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] text-muted-foreground/50">Sorteer:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-7 w-36 text-[10px] font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pressure">Hoogste druk</SelectItem>
                  <SelectItem value="efficiency">Laagste efficiëntie</SelectItem>
                  <SelectItem value="deviation">Grootste afwijking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:grid grid-cols-[1fr_0.4fr_0.5fr_0.5fr_0.6fr_0.4fr_0.5fr_0.5fr_0.5fr_0.4fr_0.8fr] text-[10px] text-muted-foreground/40 font-mono pb-2 border-b border-border/30 gap-2 px-3">
              <span>Familie</span><span>Orders</span><span>Units</span><span>St/bq</span><span>APU act/tgt</span><span>Arbeid</span><span>Arb.eff</span><span>Druk</span><span>Compl.</span><span>Knelp.</span><span>Actie</span>
            </div>

            <div className="space-y-1 mt-1">
              {sortedTable.map(r => {
                const isExp = expanded === r.id;
                return (
                  <Collapsible key={r.id} open={isExp} onOpenChange={() => toggle(r.id)}>
                    <CollapsibleTrigger asChild>
                      <div className={cn(
                        "grid grid-cols-1 md:grid-cols-[1fr_0.4fr_0.5fr_0.5fr_0.6fr_0.4fr_0.5fr_0.5fr_0.5fr_0.4fr_0.8fr] items-center text-[12px] py-2.5 px-3 rounded-lg gap-2 cursor-pointer transition-colors",
                        isExp ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30 border border-transparent",
                        r.bottleneck && !isExp && "border-destructive/15 bg-destructive/3",
                      )}>
                        <div className="flex items-center gap-2">
                          {isExp ? <ChevronDown className="w-3 h-3 text-muted-foreground/40" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
                          <span className="font-semibold text-foreground">{r.family}</span>
                        </div>
                        <span className="hidden md:block font-mono text-foreground/60">{r.orders}</span>
                        <span className="hidden md:block font-mono text-foreground/60">{fmt(r.units)}</span>
                        <span className={cn("hidden md:block font-mono", r.avgStems >= 13 ? "text-destructive font-semibold" : r.avgStems >= 10 ? "text-yellow-500" : "text-foreground/70")}>{r.avgStems}</span>
                        <span className="hidden md:block font-mono">
                          <span className={effColor((r.apuActual / r.apuTarget) * 100)}>{r.apuActual}</span>
                          <span className="text-muted-foreground/30">/{r.apuTarget}</span>
                        </span>
                        <span className="hidden md:block font-mono text-foreground/60">{r.labour}</span>
                        <span className={cn("hidden md:block font-mono font-semibold", effColor(r.labourEff))}>{r.labourEff}%</span>
                        <span className={cn("hidden md:block font-mono font-bold", pressureTextColor(r.pressureIndex))}>{r.pressureIndex}</span>
                        <span className={cn("hidden md:block font-mono font-bold", pressureTextColor(r.complexityScore))}>{r.complexityScore}</span>
                        <span className="hidden md:block">{r.bottleneck ? <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> : <span className="text-accent text-[10px]">—</span>}</span>
                        <span className="hidden md:block text-[10px] text-muted-foreground/60">{r.action}</span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-5 md:ml-8 p-3 rounded-lg bg-muted/20 border border-border/30 mt-1 mb-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div><span className="text-[10px] text-muted-foreground/40">APU gap</span><div className={cn("text-[12px] font-mono font-bold", r.apuActual >= r.apuTarget ? "text-accent" : "text-destructive")}>{r.apuActual - r.apuTarget} st/u</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Arbeid / 1000 st</span><div className="text-[12px] font-mono text-foreground">{(r.labour / (r.units / 1000)).toFixed(1)}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Druk classificatie</span><div className={cn("text-[12px] font-semibold", pressureTextColor(r.pressureIndex))}>{r.pressureIndex >= 8 ? "Kritiek" : r.pressureIndex >= 6 ? "Hoog" : r.pressureIndex >= 4 ? "Gemiddeld" : "Laag"}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Aanbeveling</span><div className="text-[12px] text-foreground font-medium">{r.action}</div></div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
};

export default ProductionCockpit;
