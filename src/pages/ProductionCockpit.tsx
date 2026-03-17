import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Factory, AlertTriangle, Clock, TrendingUp, TrendingDown, Minus,
  ChevronDown, ChevronRight, Users, Gauge, Package,
  Activity, BarChart3, Flame, Brain, Info, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Eye, Shield, Lightbulb,
  ClipboardCheck, CalendarClock, Layers, BoxSelect,
  FlaskConical, Workflow, Zap
} from "lucide-react";
import StemsPerHourKPI from "@/components/production/StemsPerHourKPI";
import RecipeIntelligence from "@/components/production/RecipeIntelligence";
import OperationalComplexityView from "@/components/production/OperationalComplexityView";
import LineOperationImpact from "@/components/production/LineOperationImpact";
import LabourTruthPanel from "@/components/production/LabourTruthPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
type PDILevel = "laag" | "normaal" | "verhoogd" | "kritisch";
type Dept = "hand" | "band" | "totaal";

interface APURow {
  dept: string;
  oapu: number;
  wapu: number;
  papu: number;
  wVsO: number; // %
  wVsP: number; // %
}

interface CheckLine {
  line: string;
  dept: string;
  checks: number;
  checksPerDay: number;
  checksPerHour: number;
  lastCheck: string;
}

interface PeriodData {
  label: string;
  handUren: number;
  bandUren: number;
  totaalUren: number;
  handStelen: number;
  bandStelen: number;
  totaalStelen: number;
  pdiHand: number;
  pdiBand: number;
  pdiTotaal: number;
}

interface Bottleneck {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  impact: string;
}

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */
const apuData: APURow[] = [
  { dept: "Hand", oapu: 220, wapu: 208, papu: 215, wVsO: -5.5, wVsP: -3.3 },
  { dept: "Band", oapu: 330, wapu: 318, papu: 325, wVsO: -3.6, wVsP: -2.2 },
  { dept: "Totaal", oapu: 258, wapu: 248, papu: 254, wVsO: -3.9, wVsP: -2.4 },
];

const checksData: CheckLine[] = [
  { line: "H1", dept: "Hand", checks: 14, checksPerDay: 14, checksPerHour: 1.8, lastCheck: "11:42" },
  { line: "H2", dept: "Hand", checks: 12, checksPerDay: 12, checksPerHour: 1.5, lastCheck: "11:38" },
  { line: "H3", dept: "Hand", checks: 4, checksPerDay: 4, checksPerHour: 0.5, lastCheck: "09:15" },
  { line: "H4", dept: "Hand", checks: 11, checksPerDay: 11, checksPerHour: 1.4, lastCheck: "11:30" },
  { line: "H5", dept: "Hand", checks: 9, checksPerDay: 9, checksPerHour: 1.1, lastCheck: "11:20" },
  { line: "H6", dept: "Hand", checks: 6, checksPerDay: 6, checksPerHour: 0.8, lastCheck: "10:45" },
  { line: "H7", dept: "Hand", checks: 13, checksPerDay: 13, checksPerHour: 1.6, lastCheck: "11:40" },
  { line: "B1", dept: "Band", checks: 10, checksPerDay: 10, checksPerHour: 1.3, lastCheck: "11:35" },
  { line: "B2", dept: "Band", checks: 8, checksPerDay: 8, checksPerHour: 1.0, lastCheck: "11:10" },
  { line: "B3", dept: "Band", checks: 11, checksPerDay: 11, checksPerHour: 1.4, lastCheck: "11:28" },
  { line: "B4", dept: "Band", checks: 5, checksPerDay: 5, checksPerHour: 0.6, lastCheck: "10:00" },
  { line: "B5", dept: "Band", checks: 9, checksPerDay: 9, checksPerHour: 1.1, lastCheck: "11:22" },
];

const totalChecks = checksData.reduce((s, c) => s + c.checks, 0);
const avgChecks = totalChecks / checksData.length;

const periods: PeriodData[] = [
  { label: "Afgelopen week", handUren: 320, bandUren: 210, totaalUren: 530, handStelen: 142000, bandStelen: 98000, totaalStelen: 240000, pdiHand: 5.8, pdiBand: 4.2, pdiTotaal: 5.2 },
  { label: "Komende week", handUren: 365, bandUren: 245, totaalUren: 610, handStelen: 168000, bandStelen: 118000, totaalStelen: 286000, pdiHand: 7.4, pdiBand: 6.1, pdiTotaal: 6.9 },
  { label: "Week +2", handUren: 340, bandUren: 225, totaalUren: 565, handStelen: 155000, bandStelen: 105000, totaalStelen: 260000, pdiHand: 6.5, pdiBand: 5.3, pdiTotaal: 6.0 },
];

/* ── ORDERDRUK DATA ── */
interface OrderBucket {
  range: string;
  count: number;
  volume: number;
  pctOrders: number;
  inefficient: boolean;
}

interface OrderdrukPeriod {
  label: string;
  totalOrders: number;
  avgSize: number;
  medianSize: number;
  inefficientOrders: number;
  inefficientPct: number;
  totalVolume: number;
  inefficientVolume: number;
}

interface OrderdrukData {
  dept: string;
  threshold: number;
  totalOrders: number;
  avgSize: number;
  medianSize: number;
  totalVolume: number;
  buckets: OrderBucket[];
  inefficientOrders: number;
  inefficientVolume: number;
  inefficientPct: number;
  periods: OrderdrukPeriod[];
  // Correlations
  wapuImpact: number; // estimated APU loss from small orders
  opstartverliesUren: number; // estimated lost hours from startups
  fragmentatieIndex: number; // 0-10, how fragmented
}

type OrderdrukLevel = "laag" | "normaal" | "verhoogd" | "kritisch";

const calcOrderdrukScore = (d: OrderdrukData): { score: number; level: OrderdrukLevel } => {
  // Weighted: ineffPct (35%), avgSize inverse (25%), fragmentation (20%), opstartloss (20%)
  const ineffScore = Math.min(d.inefficientPct / 10, 10); // 30% → 3.0
  const sizeScore = Math.max(0, 10 - d.avgSize / (d.threshold * 0.5)); // smaller avg = higher score
  const fragScore = d.fragmentatieIndex;
  const opstart = Math.min(d.opstartverliesUren / 5, 10);
  const score = Math.min(10, ineffScore * 0.35 + sizeScore * 0.25 + fragScore * 0.20 + opstart * 0.20);
  const rounded = Math.round(score * 10) / 10;
  const level: OrderdrukLevel = rounded >= 8 ? "kritisch" : rounded >= 6 ? "verhoogd" : rounded >= 4 ? "normaal" : "laag";
  return { score: rounded, level };
};

const orderdrukHand: OrderdrukData = {
  dept: "Hand", threshold: 40,
  totalOrders: 186, avgSize: 87, medianSize: 62, totalVolume: 20808,
  buckets: [
    { range: "0 – 40", count: 54, volume: 1188, pctOrders: 29.0, inefficient: true },
    { range: "40 – 100", count: 68, volume: 4760, pctOrders: 36.6, inefficient: false },
    { range: "100 – 250", count: 42, volume: 6720, pctOrders: 22.6, inefficient: false },
    { range: "250+", count: 22, volume: 8140, pctOrders: 11.8, inefficient: false },
  ],
  inefficientOrders: 54, inefficientVolume: 1188, inefficientPct: 29.0,
  periods: [
    { label: "Afgelopen week", totalOrders: 186, avgSize: 87, medianSize: 62, inefficientOrders: 54, inefficientPct: 29.0, totalVolume: 20808, inefficientVolume: 1188 },
    { label: "Komende week", totalOrders: 212, avgSize: 78, medianSize: 55, inefficientOrders: 72, inefficientPct: 34.0, totalVolume: 22360, inefficientVolume: 1656 },
    { label: "Week +2", totalOrders: 195, avgSize: 82, medianSize: 58, inefficientOrders: 60, inefficientPct: 30.8, totalVolume: 21120, inefficientVolume: 1380 },
  ],
  wapuImpact: -8, // APU loss in st/u
  opstartverliesUren: 12.5,
  fragmentatieIndex: 6.2,
};

const orderdrukBand: OrderdrukData = {
  dept: "Band", threshold: 250,
  totalOrders: 124, avgSize: 412, medianSize: 320, totalVolume: 59680,
  buckets: [
    { range: "0 – 250", count: 38, volume: 5320, pctOrders: 30.6, inefficient: true },
    { range: "250 – 500", count: 44, volume: 16280, pctOrders: 35.5, inefficient: false },
    { range: "500 – 1000", count: 28, volume: 18480, pctOrders: 22.6, inefficient: false },
    { range: "1000+", count: 14, volume: 19600, pctOrders: 11.3, inefficient: false },
  ],
  inefficientOrders: 38, inefficientVolume: 5320, inefficientPct: 30.6,
  periods: [
    { label: "Afgelopen week", totalOrders: 124, avgSize: 412, medianSize: 320, inefficientOrders: 38, inefficientPct: 30.6, totalVolume: 59680, inefficientVolume: 5320 },
    { label: "Komende week", totalOrders: 138, avgSize: 385, medianSize: 295, inefficientOrders: 48, inefficientPct: 34.8, totalVolume: 62540, inefficientVolume: 6720 },
    { label: "Week +2", totalOrders: 130, avgSize: 398, medianSize: 310, inefficientOrders: 42, inefficientPct: 32.3, totalVolume: 60840, inefficientVolume: 5880 },
  ],
  wapuImpact: -5,
  opstartverliesUren: 8.2,
  fragmentatieIndex: 5.4,
};

const orderdrukTotaal: OrderdrukData = {
  dept: "Totaal", threshold: 0,
  totalOrders: orderdrukHand.totalOrders + orderdrukBand.totalOrders,
  avgSize: Math.round((orderdrukHand.avgSize * orderdrukHand.totalOrders + orderdrukBand.avgSize * orderdrukBand.totalOrders) / (orderdrukHand.totalOrders + orderdrukBand.totalOrders)),
  medianSize: Math.round((orderdrukHand.medianSize + orderdrukBand.medianSize) / 2),
  totalVolume: orderdrukHand.totalVolume + orderdrukBand.totalVolume,
  buckets: [],
  inefficientOrders: orderdrukHand.inefficientOrders + orderdrukBand.inefficientOrders,
  inefficientVolume: orderdrukHand.inefficientVolume + orderdrukBand.inefficientVolume,
  inefficientPct: Math.round((orderdrukHand.inefficientOrders + orderdrukBand.inefficientOrders) / (orderdrukHand.totalOrders + orderdrukBand.totalOrders) * 1000) / 10,
  periods: [0, 1, 2].map(i => ({
    label: orderdrukHand.periods[i].label,
    totalOrders: orderdrukHand.periods[i].totalOrders + orderdrukBand.periods[i].totalOrders,
    avgSize: Math.round((orderdrukHand.periods[i].avgSize * orderdrukHand.periods[i].totalOrders + orderdrukBand.periods[i].avgSize * orderdrukBand.periods[i].totalOrders) / (orderdrukHand.periods[i].totalOrders + orderdrukBand.periods[i].totalOrders)),
    medianSize: Math.round((orderdrukHand.periods[i].medianSize + orderdrukBand.periods[i].medianSize) / 2),
    inefficientOrders: orderdrukHand.periods[i].inefficientOrders + orderdrukBand.periods[i].inefficientOrders,
    inefficientPct: Math.round((orderdrukHand.periods[i].inefficientOrders + orderdrukBand.periods[i].inefficientOrders) / (orderdrukHand.periods[i].totalOrders + orderdrukBand.periods[i].totalOrders) * 1000) / 10,
    totalVolume: orderdrukHand.periods[i].totalVolume + orderdrukBand.periods[i].totalVolume,
    inefficientVolume: orderdrukHand.periods[i].inefficientVolume + orderdrukBand.periods[i].inefficientVolume,
  })),
  wapuImpact: -7,
  opstartverliesUren: orderdrukHand.opstartverliesUren + orderdrukBand.opstartverliesUren,
  fragmentatieIndex: Math.round((orderdrukHand.fragmentatieIndex * orderdrukHand.totalOrders + orderdrukBand.fragmentatieIndex * orderdrukBand.totalOrders) / (orderdrukHand.totalOrders + orderdrukBand.totalOrders) * 10) / 10,
};

const allOrderdruk = [orderdrukHand, orderdrukBand, orderdrukTotaal];
const orderdrukScores = allOrderdruk.map(d => ({ dept: d.dept, ...calcOrderdrukScore(d) }));

const advisories = [
  { icon: AlertTriangle, severity: "critical" as const, text: "Werkdruk Band stijgt +16.7% komende week — overweeg extra capaciteit of orderspreiding." },
  { icon: TrendingUp, severity: "warning" as const, text: "Stelenvolume stijgt +19.2% (Hand) terwijl uren slechts +14.1% stijgen — verwacht druk op APU." },
  { icon: Eye, severity: "warning" as const, text: "Checks op H3 en B4 significant lager dan gemiddeld — bandleiders sturen daar te weinig bij." },
  { icon: TrendingDown, severity: "warning" as const, text: "W-APU (208) ligt onder zowel O-APU (220) als P-APU (215) — efficiency- en planningsdruk." },
  { icon: Shield, severity: "critical" as const, text: "PDI stijgt naar 6.9 komende week (verhoogd) — extra managementaandacht vereist." },
  { icon: Lightbulb, severity: "info" as const, text: "Band-afdeling draait relatief stabiel — potentie om orders van Hand naar Band te verschuiven." },
  { icon: BoxSelect, severity: "critical" as const, text: `Orderdruk stijgt: ${orderdrukTotaal.periods[1].inefficientPct}% inefficiënte orders komende week (was ${orderdrukTotaal.periods[0].inefficientPct}%). Geschat opstartverlies: ${orderdrukTotaal.opstartverliesUren} uur.` },
  { icon: Package, severity: "warning" as const, text: `Fragmentatie Hand (${orderdrukHand.fragmentatieIndex}/10) hoger dan Band (${orderdrukBand.fragmentatieIndex}/10) — Hand productie kampt met meer orderwissels en opstartverlies.` },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString("nl-NL");
const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
const pctDiff = (current: number, prev: number) => ((current - prev) / prev * 100);

const deviationColor = (v: number) =>
  v >= 0 ? "text-accent" : v >= -3 ? "text-yellow-500" : "text-destructive";

const pdiColor = (v: number): { text: string; bg: string; border: string; level: PDILevel } =>
  v >= 8 ? { text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", level: "kritisch" } :
  v >= 6 ? { text: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30", level: "verhoogd" } :
  v >= 4 ? { text: "text-primary", bg: "bg-primary/10", border: "border-primary/30", level: "normaal" } :
  { text: "text-accent", bg: "bg-accent/10", border: "border-accent/30", level: "laag" };

const alertSeverity: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-destructive/5 border-destructive/25", text: "text-destructive" },
  warning: { bg: "bg-yellow-500/5 border-yellow-500/25", text: "text-yellow-500" },
  info: { bg: "bg-primary/5 border-primary/25", text: "text-primary" },
};

/* ------------------------------------------------------------------ */
/*  REUSABLE COMPONENTS                                                */
/* ------------------------------------------------------------------ */
const Section = ({ title, icon: Icon, children, badge, tooltip }: {
  title: string; icon: typeof Factory; children: React.ReactNode; badge?: string; tooltip?: string;
}) => (
  <section className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <h2 className="text-[13px] font-bold text-foreground tracking-tight">{title}</h2>
      {badge && <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary">{badge}</span>}
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-muted-foreground/40 cursor-help" /></TooltipTrigger>
            <TooltipContent className="max-w-[280px] text-[11px]"><p>{tooltip}</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <div className="p-4 md:p-5">{children}</div>
  </section>
);

const KPITile = ({ label, value, unit, tooltip, status, change }: {
  label: string; value: string; unit?: string; tooltip?: string;
  status: "healthy" | "warning" | "critical"; change?: string;
}) => {
  const bg = status === "healthy" ? "bg-accent/5 border-accent/20" : status === "warning" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-destructive/5 border-destructive/20";
  const dot = status === "healthy" ? "bg-accent" : status === "warning" ? "bg-yellow-500" : "bg-destructive";
  const changeColor = status === "healthy" ? "text-accent" : status === "warning" ? "text-yellow-500" : "text-destructive";
  const content = (
    <div className={cn("p-3 rounded-xl border transition-all hover:shadow-md cursor-default", bg)}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={cn("w-1.5 h-1.5 rounded-full", dot)} />
        <span className="text-[10px] font-medium text-foreground/50 tracking-tight truncate">{label}</span>
      </div>
      <div className="text-lg font-extrabold text-foreground leading-none">
        {value}
        {unit && <span className="text-[10px] font-normal text-muted-foreground/50 ml-0.5">{unit}</span>}
      </div>
      {change && <div className={cn("text-[10px] font-semibold mt-1", changeColor)}>{change}</div>}
    </div>
  );
  if (!tooltip) return content;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent className="max-w-[260px] text-[11px]"><p>{tooltip}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TrendArrow = ({ value, suffix = "%" }: { value: number; suffix?: string }) => {
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  const color = value > 0 ? "text-destructive" : value < 0 ? "text-accent" : "text-muted-foreground/50";
  // For hours/stems, increase = pressure = red. Decrease = green.
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-[10px] font-mono font-semibold", color)}>
      <Icon className="w-3 h-3" />
      {value > 0 ? "+" : ""}{value.toFixed(1)}{suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */
const ProductionCockpit = () => {
  const [deptFilter, setDeptFilter] = useState<"all" | Dept>("all");

  const currentPeriod = periods[1]; // komende week
  const prevPeriod = periods[0]; // afgelopen week

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <MCHologramBackground />
        <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-5 space-y-4">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-brand" />
              <div>
                <h1 className="text-sm font-black text-foreground uppercase tracking-wider">Production Cockpit</h1>
                <p className="text-[10px] font-mono text-muted-foreground">Efficiëntie · Capaciteitsdruk · Lijnsturing · Productiedruk Index</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={deptFilter} onValueChange={v => setDeptFilter(v as any)}>
                <SelectTrigger className="h-7 w-28 text-[10px] font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle afd.</SelectItem>
                  <SelectItem value="hand">Hand</SelectItem>
                  <SelectItem value="band">Band</SelectItem>
                  <SelectItem value="totaal">Totaal</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-[10px] font-mono gap-1 border-accent/30 text-accent">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                LIVE
              </Badge>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 1 — KPI HEADER / TOP SUMMARY                     */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2.5">
            <KPITile label="W-APU gem." value="248" unit="st/u" status="warning"
              tooltip="Werkelijke APU: de productiviteit gemeten via handmatige checks op de vloer." change="vs O-APU: −3.9%" />
            <KPITile label="O-APU gem." value="258" unit="st/u" status="healthy"
              tooltip="Klant-APU: de productiviteitsnorm die door de klant wordt betaald." />
            <KPITile label="P-APU gem." value="254" unit="st/u" status="healthy"
              tooltip="Plan-APU: de productiviteit waarmee planning rekent voor benodigde uren." />
            <KPITile label="W vs O-APU" value="-3.9" unit="%" status="warning"
              tooltip="Verschil tussen werkelijke APU en klantnorm. Negatief = minder productief dan betaald." />
            <KPITile label="W vs P-APU" value="-2.4" unit="%" status="warning"
              tooltip="Verschil tussen werkelijke APU en plan-APU. Negatief = meer uren nodig dan gepland." />
            <KPITile label="Checks totaal" value={String(totalChecks)} status={totalChecks < 100 ? "warning" : "healthy"}
              tooltip="Totaal checks over alle lijnen. Indicator van actieve operationele sturing door bandleiders." />
            <KPITile label="Uren komende 2w" value={fmt(currentPeriod.totaalUren + periods[2].totaalUren)} unit="uur" status="warning"
              tooltip="Verwachte productie-uren komende 2 weken op basis van vertrekdatum. Let op: vertrekdatum ≠ productiedatum, maar geeft een goede indicatie." />
            <KPITile label="Stelen komende 2w" value={`${((currentPeriod.totaalStelen + periods[2].totaalStelen) / 1000).toFixed(0)}K`} unit="st" status="warning"
              tooltip="Verwacht stelenvolume komende 2 weken. Indicator voor fysieke verwerkingsdruk." />
            <KPITile label="PDI totaal" value={currentPeriod.pdiTotaal.toFixed(1)} unit="/10" status={currentPeriod.pdiTotaal >= 8 ? "critical" : currentPeriod.pdiTotaal >= 6 ? "warning" : "healthy"}
              tooltip="Productiedruk Index: samengestelde score op basis van uren, stelen, checks en APU-afwijkingen." />
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 1A — STEMS PER HOUR                               */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Stelen per Uur" icon={Zap}
            tooltip="Stelenverwerking per lijn, per persoon en per afdeling. Stelen/uur is een betere indicator van werkelijke operationele belasting dan bouquets/uur."
            badge="STELEN">
            <StemsPerHourKPI deptFilter={deptFilter} />
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 1B — RECIPE INTELLIGENCE                          */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Recipe Intelligence" icon={FlaskConical}
            tooltip="Receptanalyse per boeket: stelen, bloementypes, componentenmix, variatie en handling. Verklaart waarom sommige lijnen operationeel zwaarder zijn."
            badge="RECEPTEN">
            <RecipeIntelligence />
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 1C — OPERATIONAL COMPLEXITY                       */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Operationele Complexiteit" icon={Workflow}
            tooltip="Vergelijking van complexiteit, stelen/uur en verwachte operationele druk per product. Maakt verborgen zwaarte zichtbaar."
            badge="COMPLEXITY INDEX">
            <OperationalComplexityView />
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 1D — LINE OPERATION IMPACT                        */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Lijn Complexiteit & Impact" icon={Activity}
            tooltip="Hoe complexiteit de lijnsnelheid, check-frequentie, vertragingsrisico en efficiency beïnvloedt. Ondersteunt beslissingen over lijnverdeling en orderspreiding."
            badge="IMPACT">
            <LineOperationImpact deptFilter={deptFilter} />
          </Section>

          {/* SECTION 1B — PRODUCTION TIMELINE                          */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Productie Timeline" icon={CalendarClock}
            tooltip="Geplande start, verwachte finish, actuele voortgang en vertragingsreden per lijn."
            badge="LIVE">
            <div className="space-y-2">
              {[
                { line: "H1", dept: "Hand", plannedStart: "06:00", expectedFinish: "14:30", progress: 72, delay: null, status: "healthy" as const },
                { line: "H2", dept: "Hand", plannedStart: "06:00", expectedFinish: "14:00", progress: 68, delay: null, status: "healthy" as const },
                { line: "H3", dept: "Hand", plannedStart: "06:00", expectedFinish: "15:45", progress: 45, delay: "Transportband storing", status: "critical" as const },
                { line: "H4", dept: "Hand", plannedStart: "06:30", expectedFinish: "14:30", progress: 65, delay: null, status: "healthy" as const },
                { line: "H5", dept: "Hand", plannedStart: "06:30", expectedFinish: "14:30", progress: 58, delay: null, status: "healthy" as const },
                { line: "H6", dept: "Hand", plannedStart: "07:00", expectedFinish: "15:00", progress: 52, delay: "Nieuw personeel", status: "warning" as const },
                { line: "H7", dept: "Hand", plannedStart: "06:00", expectedFinish: "14:00", progress: 70, delay: null, status: "healthy" as const },
                { line: "B1", dept: "Band", plannedStart: "06:00", expectedFinish: "14:00", progress: 74, delay: null, status: "healthy" as const },
                { line: "B2", dept: "Band", plannedStart: "06:00", expectedFinish: "14:30", progress: 62, delay: null, status: "healthy" as const },
                { line: "B3", dept: "Band", plannedStart: "06:30", expectedFinish: "14:30", progress: 66, delay: null, status: "healthy" as const },
                { line: "B4", dept: "Band", plannedStart: "06:00", expectedFinish: "15:30", progress: 48, delay: "Sensor kalibratie", status: "warning" as const },
                { line: "B5", dept: "Band", plannedStart: "06:00", expectedFinish: "16:00", progress: 38, delay: "Sensor + orderwissels", status: "critical" as const },
              ].filter(l => deptFilter === "all" || l.dept.toLowerCase() === deptFilter || deptFilter === "totaal").map(l => {
                const barColor = l.status === "healthy" ? "bg-accent" : l.status === "warning" ? "bg-yellow-500" : "bg-destructive";
                const bgColor = l.status === "healthy" ? "border-accent/20" : l.status === "warning" ? "border-yellow-500/20" : "border-destructive/20";
                return (
                  <div key={l.line} className={cn("grid grid-cols-[3rem_4rem_4rem_1fr_3rem_auto] items-center gap-3 px-3 py-2 rounded-lg border", bgColor, "bg-card/50")}>
                    <span className={cn("text-[12px] font-mono font-bold", l.status === "critical" ? "text-destructive" : "text-foreground")}>{l.line}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{l.plannedStart}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">{l.expectedFinish}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 rounded-full bg-border/30 overflow-hidden relative">
                        <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${l.progress}%` }} />
                      </div>
                      <span className={cn("text-[11px] font-mono font-bold w-8 text-right", l.status === "critical" ? "text-destructive" : l.status === "warning" ? "text-yellow-500" : "text-foreground")}>{l.progress}%</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/40">{l.dept}</span>
                    {l.delay ? (
                      <span className="text-[9px] font-mono text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20 truncate max-w-[140px]">{l.delay}</span>
                    ) : (
                      <span className="text-[9px] font-mono text-accent">Op schema</span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Column headers */}
            <div className="grid grid-cols-[3rem_4rem_4rem_1fr_3rem_auto] items-center gap-3 px-3 mt-2 text-[9px] font-mono text-muted-foreground/30">
              <span>Lijn</span><span>Start</span><span>Finish</span><span>Voortgang</span><span>Afd.</span><span>Status</span>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 2 — EFFICIENCY OVERVIEW                          */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Efficiency Overzicht" icon={Gauge} tooltip="Vergelijking O-APU (klantnorm), W-APU (werkelijk) en P-APU (planning) per afdeling.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {apuData.filter(r => deptFilter === "all" || r.dept.toLowerCase() === deptFilter).map(r => (
                <div key={r.dept} className={cn(
                  "rounded-xl border p-4 transition-all",
                  r.wVsO >= 0 ? "border-accent/20 bg-accent/5" : r.wVsO >= -3 ? "border-yellow-500/20 bg-yellow-500/5" : "border-destructive/20 bg-destructive/5"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-bold text-foreground">{r.dept}</span>
                    <Badge variant="outline" className={cn("text-[9px] font-mono",
                      r.wVsO >= 0 ? "border-accent/30 text-accent" : r.wVsO >= -3 ? "border-yellow-500/30 text-yellow-500" : "border-destructive/30 text-destructive"
                    )}>
                      {r.wVsO >= 0 ? "Op norm" : r.wVsO >= -3 ? "Licht onder" : "Onder norm"}
                    </Badge>
                  </div>

                  {/* APU bars */}
                  <div className="space-y-2.5">
                    {[
                      { label: "O-APU", sublabel: "Klantnorm", value: r.oapu, color: "bg-primary" },
                      { label: "W-APU", sublabel: "Werkelijk", value: r.wapu, color: r.wVsO >= 0 ? "bg-accent" : r.wVsO >= -3 ? "bg-yellow-500" : "bg-destructive" },
                      { label: "P-APU", sublabel: "Planning", value: r.papu, color: "bg-primary/50" },
                    ].map(bar => {
                      const maxVal = Math.max(r.oapu, r.wapu, r.papu) * 1.05;
                      return (
                        <div key={bar.label}>
                          <div className="flex items-center justify-between mb-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-[10px] font-mono text-muted-foreground/60 cursor-help">{bar.label}</span>
                                </TooltipTrigger>
                                <TooltipContent className="text-[11px]"><p>{bar.sublabel}</p></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-[12px] font-mono font-bold text-foreground">{bar.value} <span className="text-muted-foreground/40 font-normal">st/u</span></span>
                          </div>
                          <div className="h-2 rounded-full bg-border/30 overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all", bar.color)} style={{ width: `${(bar.value / maxVal) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Deviations */}
                  <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] font-mono text-muted-foreground/40">W vs O-APU</span>
                      <div className={cn("text-[13px] font-mono font-bold", deviationColor(r.wVsO))}>{pct(r.wVsO)}</div>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-muted-foreground/40">W vs P-APU</span>
                      <div className={cn("text-[13px] font-mono font-bold", deviationColor(r.wVsP))}>{pct(r.wVsP)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 3 — CHECKS & LIJNSTURING                         */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Checks & Lijnsturing" icon={ClipboardCheck}
            badge={`${totalChecks} checks`}
            tooltip="Aantal handmatige checks per lijn door bandleiders. Indicator voor actieve sturing en operationele druk op de productie.">

            {/* Total tile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Checks totaal</span>
                <div className="text-2xl font-extrabold text-foreground mt-1">{totalChecks}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Gem. per lijn</span>
                <div className="text-2xl font-extrabold text-foreground mt-1">{avgChecks.toFixed(1)}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Checks Hand</span>
                <div className="text-lg font-extrabold text-foreground mt-1">{checksData.filter(c => c.dept === "Hand").reduce((s, c) => s + c.checks, 0)}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Checks Band</span>
                <div className="text-lg font-extrabold text-foreground mt-1">{checksData.filter(c => c.dept === "Band").reduce((s, c) => s + c.checks, 0)}</div>
              </div>
            </div>

            {/* Bar chart per lijn */}
            <div className="mb-4">
              <span className="text-[10px] font-mono text-muted-foreground/40 mb-2 block">Checks per lijn (gesorteerd)</span>
              <div className="space-y-1.5">
                {[...checksData].sort((a, b) => b.checks - a.checks).map(c => {
                  const maxChecks = Math.max(...checksData.map(x => x.checks));
                  const isLow = c.checks < avgChecks * 0.6;
                  return (
                    <div key={c.line} className="flex items-center gap-3">
                      <span className={cn("text-[11px] font-mono font-bold w-6", isLow ? "text-destructive" : "text-foreground")}>{c.line}</span>
                      <div className="flex-1 h-4 rounded bg-border/20 overflow-hidden relative">
                        <div
                          className={cn("h-full rounded transition-all", isLow ? "bg-destructive/60" : "bg-primary/50")}
                          style={{ width: `${(c.checks / maxChecks) * 100}%` }}
                        />
                        {/* avg line */}
                        <div
                          className="absolute top-0 bottom-0 w-px bg-accent/60"
                          style={{ left: `${(avgChecks / maxChecks) * 100}%` }}
                        />
                      </div>
                      <span className={cn("text-[11px] font-mono font-semibold w-6 text-right", isLow ? "text-destructive" : "text-foreground/70")}>{c.checks}</span>
                      <span className="text-[9px] font-mono text-muted-foreground/40 w-12 text-right">{c.checksPerHour}/uur</span>
                      <span className="text-[9px] font-mono text-muted-foreground/30 w-12 text-right">{c.lastCheck}</span>
                      {isLow && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild><AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" /></TooltipTrigger>
                            <TooltipContent className="text-[11px]"><p>Significant minder checks dan gemiddeld — mogelijke blinde vlek in sturing.</p></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-px h-3 bg-accent/60" />
                <span className="text-[9px] font-mono text-accent/60">gem. {avgChecks.toFixed(1)}</span>
              </div>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 4 — UURDRUK VOORUITBLIK                          */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Uurdruk Vooruitblik" icon={CalendarClock}
            tooltip="Verwachte productie-uren op basis van vertrekdatum. Let op: vertrekdatum is niet altijd gelijk aan productiedatum, maar geeft een goede indicatie van de uren die op de productie afkomen.">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left text-[10px] font-mono text-muted-foreground/40 pb-2 pr-4">Periode</th>
                    <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Hand uren</th>
                    <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Band uren</th>
                    <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3 font-bold">Totaal uren</th>
                    <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Δ vs vorige week</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p, i) => {
                    const diffTotal = i > 0 ? pctDiff(p.totaalUren, periods[0].totaalUren) : 0;
                    return (
                      <tr key={p.label} className={cn("border-b border-border/20", i === 1 && "bg-primary/3")}>
                        <td className="py-2.5 pr-4">
                          <span className={cn("font-semibold", i === 0 ? "text-muted-foreground/60" : "text-foreground")}>{p.label}</span>
                          {i === 1 && <span className="text-[8px] ml-1 font-mono text-primary">▸ focus</span>}
                        </td>
                        <td className="text-right px-3 font-mono font-semibold">{fmt(p.handUren)}</td>
                        <td className="text-right px-3 font-mono font-semibold">{fmt(p.bandUren)}</td>
                        <td className="text-right px-3 font-mono font-bold text-foreground">{fmt(p.totaalUren)}</td>
                        <td className="text-right px-3">
                          {i > 0 ? <TrendArrow value={diffTotal} /> : <span className="text-[10px] text-muted-foreground/30">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/30">
              <Info className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                Uurdruk is berekend op basis van vertrekdatum. Vertrekdatum is niet altijd gelijk aan de feitelijke productiedatum, maar geeft wel een betrouwbare indicatie van het urenvolume dat op de productie afkomt.
              </p>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 5 — STELENDRUK VOORUITBLIK                       */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Stelendruk Vooruitblik" icon={Layers}
            tooltip="Verwacht stelenvolume per afdeling. Naast uren is het fysieke volume (stelen) een kritische indicator voor verwerkingsdruk en complexiteit.">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left text-[10px] font-mono text-muted-foreground/40 pb-2 pr-4">Periode</th>
                    <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Hand stelen</th>
                    <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Band stelen</th>
                    <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3 font-bold">Totaal stelen</th>
                    <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Δ vs vorige week</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p, i) => {
                    const diffTotal = i > 0 ? pctDiff(p.totaalStelen, periods[0].totaalStelen) : 0;
                    return (
                      <tr key={p.label} className={cn("border-b border-border/20", i === 1 && "bg-primary/3")}>
                        <td className="py-2.5 pr-4">
                          <span className={cn("font-semibold", i === 0 ? "text-muted-foreground/60" : "text-foreground")}>{p.label}</span>
                        </td>
                        <td className="text-right px-3 font-mono font-semibold">{fmt(p.handStelen)}</td>
                        <td className="text-right px-3 font-mono font-semibold">{fmt(p.bandStelen)}</td>
                        <td className="text-right px-3 font-mono font-bold text-foreground">{fmt(p.totaalStelen)}</td>
                        <td className="text-right px-3">
                          {i > 0 ? <TrendArrow value={diffTotal} /> : <span className="text-[10px] text-muted-foreground/30">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 5B — ORDERDRUK (EXPANDED)                         */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Orderdruk" icon={BoxSelect}
            badge={`Score: ${orderdrukScores.find(s => s.dept === "Totaal")?.score.toFixed(1)} / 10`}
            tooltip="Orderdruk meet de inefficiency die ontstaat door veel kleine orders. Kleine orders veroorzaken meer opstartmomenten, lijnwissels, handling, lagere APU en hogere organisatorische druk. Hand: rendabel vanaf 40 stuks. Band: rendabel vanaf 250 stuks.">

            {/* ── 1. ORDERSTRUCTUUR SAMENVATTING ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Orders totaal</span>
                <div className="text-xl font-extrabold text-foreground mt-1">{orderdrukTotaal.totalOrders}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Gem. ordergrootte</span>
                <div className="text-xl font-extrabold text-foreground mt-1">{orderdrukTotaal.avgSize} <span className="text-[10px] font-normal text-muted-foreground/50">st</span></div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Mediaan</span>
                <div className="text-xl font-extrabold text-foreground mt-1">{orderdrukTotaal.medianSize} <span className="text-[10px] font-normal text-muted-foreground/50">st</span></div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Totaal boeketten</span>
                <div className="text-xl font-extrabold text-foreground mt-1">{(orderdrukTotaal.totalVolume / 1000).toFixed(1)}K</div>
              </div>
              <div className={cn("rounded-xl border p-3", orderdrukTotaal.inefficientPct >= 25 ? "border-destructive/20 bg-destructive/5" : "border-yellow-500/20 bg-yellow-500/5")}>
                <span className="text-[10px] font-mono text-muted-foreground/50">Inefficiënte orders</span>
                <div className={cn("text-xl font-extrabold mt-1", orderdrukTotaal.inefficientPct >= 25 ? "text-destructive" : "text-yellow-500")}>
                  {orderdrukTotaal.inefficientOrders} <span className="text-[10px] font-normal text-muted-foreground/50">({orderdrukTotaal.inefficientPct}%)</span>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50">Opstartverlies</span>
                <div className="text-xl font-extrabold text-destructive mt-1">{orderdrukTotaal.opstartverliesUren} <span className="text-[10px] font-normal text-muted-foreground/50">uur</span></div>
              </div>
            </div>

            {/* ── 2. ORDERVERDELING PER AFDELING ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {[orderdrukHand, orderdrukBand].filter(d => deptFilter === "all" || d.dept.toLowerCase() === deptFilter || deptFilter === "totaal").map(od => {
                const maxCount = Math.max(...od.buckets.map(b => b.count));
                const threshold = od.dept === "Hand" ? "40 stuks" : "250 stuks";
                const score = calcOrderdrukScore(od);
                const scoreStyle = pdiColor(score.score);
                return (
                  <div key={od.dept} className="rounded-xl border border-border bg-card/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-foreground">{od.dept}</span>
                        <Badge variant="outline" className={cn("text-[9px] font-mono", scoreStyle.border, scoreStyle.text)}>
                          Score: {score.score.toFixed(1)} — {score.level}
                        </Badge>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className={cn("text-[9px] font-mono",
                              od.inefficientPct >= 25 ? "border-destructive/30 text-destructive" : "border-yellow-500/30 text-yellow-500"
                            )}>
                              Rendabel vanaf {threshold}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[240px] text-[11px]">
                            <p>Orders onder {threshold} per stuk veroorzaken relatief meer inefficiency door opstartverliezen, extra handling en lijnwissels.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-2 mb-4 text-[10px]">
                      <div>
                        <span className="text-muted-foreground/40 font-mono block">Orders</span>
                        <span className="font-mono font-bold text-foreground">{od.totalOrders}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground/40 font-mono block">Gem.</span>
                        <span className="font-mono font-bold text-foreground">{od.avgSize} st</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground/40 font-mono block">Mediaan</span>
                        <span className="font-mono font-bold text-foreground">{od.medianSize} st</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground/40 font-mono block">Fragmentatie</span>
                        <span className={cn("font-mono font-bold", od.fragmentatieIndex >= 6 ? "text-destructive" : "text-foreground")}>{od.fragmentatieIndex}/10</span>
                      </div>
                    </div>

                    {/* Distribution bars */}
                    <span className="text-[10px] font-mono text-muted-foreground/40 mb-2 block">Orderverdeling</span>
                    <div className="space-y-2">
                      {od.buckets.map(b => (
                        <div key={b.range}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("text-[11px] font-mono font-semibold", b.inefficient ? "text-destructive" : "text-foreground/70")}>{b.range}</span>
                              {b.inefficient && (
                                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">inefficiënt</span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground/60">{b.count} orders ({b.pctOrders}%) · {fmt(b.volume)} st</span>
                          </div>
                          <div className="h-3.5 rounded bg-border/20 overflow-hidden">
                            <div
                              className={cn("h-full rounded transition-all", b.inefficient ? "bg-destructive/60" : "bg-primary/40")}
                              style={{ width: `${(b.count / maxCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Inefficiency + impact summary */}
                    <div className={cn("mt-4 p-2.5 rounded-lg border space-y-1.5",
                      od.inefficientPct >= 25 ? "bg-destructive/5 border-destructive/20" : "bg-yellow-500/5 border-yellow-500/20"
                    )}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={cn("w-3.5 h-3.5 shrink-0", od.inefficientPct >= 25 ? "text-destructive" : "text-yellow-500")} />
                        <span className="text-[11px] text-foreground/80">
                          <span className="font-bold">{od.inefficientOrders}</span> orders ({od.inefficientPct}%) onder rendabiliteitsgrens — <span className="font-bold">{fmt(od.inefficientVolume)}</span> stuks inefficiënt volume
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] pl-5">
                        <span className="text-muted-foreground/60">APU impact: <span className="font-bold text-destructive">{od.wapuImpact} st/u</span></span>
                        <span className="text-muted-foreground/60">Opstartverlies: <span className="font-bold text-destructive">{od.opstartverliesUren} uur</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── 3. INEFFICIËNTIE ANALYSE — correlatie met APU/checks/uurdruk ── */}
            <div className="rounded-xl border border-border bg-card/50 p-4 mb-5">
              <span className="text-[12px] font-bold text-foreground block mb-3">Inefficiëntie Analyse — Impact op Productie</span>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left text-[10px] font-mono text-muted-foreground/40 pb-2">Afdeling</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Ineff. orders</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Ineff. %</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Ineff. volume</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">
                        <TooltipProvider><Tooltip><TooltipTrigger asChild><span className="cursor-help">APU impact</span></TooltipTrigger>
                        <TooltipContent className="text-[11px]"><p>Geschatte APU-daling door extra opstarttijd en lijnwissels van kleine orders.</p></TooltipContent></Tooltip></TooltipProvider>
                      </th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Opstartverlies</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-3">Fragmentatie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrderdruk.filter(d => d.buckets.length > 0 || d.dept === "Totaal").map(od => (
                      <tr key={od.dept} className={cn("border-b border-border/20", od.dept === "Totaal" && "font-bold bg-muted/10")}>
                        <td className="py-2">{od.dept}</td>
                        <td className="text-right px-3 font-mono">{od.inefficientOrders}</td>
                        <td className={cn("text-right px-3 font-mono", od.inefficientPct >= 30 ? "text-destructive" : od.inefficientPct >= 25 ? "text-yellow-500" : "text-foreground")}>{od.inefficientPct}%</td>
                        <td className="text-right px-3 font-mono">{fmt(od.inefficientVolume)} st</td>
                        <td className="text-right px-3 font-mono text-destructive">{od.wapuImpact} st/u</td>
                        <td className="text-right px-3 font-mono text-destructive">{od.opstartverliesUren} uur</td>
                        <td className={cn("text-right px-3 font-mono", od.fragmentatieIndex >= 6 ? "text-destructive" : "text-foreground")}>{od.fragmentatieIndex}/10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg border border-border/30 bg-muted/20">
                  <span className="text-[9px] font-mono text-muted-foreground/50 block mb-1">Relatie met W-APU</span>
                  <p className="text-[10px] text-foreground/70">Kleine orders verlagen de W-APU door extra opstarttijd. Geschat APU-verlies van <span className="font-bold text-destructive">{orderdrukTotaal.wapuImpact} st/u</span> door orderdruk.</p>
                </div>
                <div className="p-2.5 rounded-lg border border-border/30 bg-muted/20">
                  <span className="text-[9px] font-mono text-muted-foreground/50 block mb-1">Relatie met Uurdruk</span>
                  <p className="text-[10px] text-foreground/70">Opstartverlies door kleine orders (<span className="font-bold text-destructive">{orderdrukTotaal.opstartverliesUren} uur/week</span>) vergroot de effectieve uurdruk bovenop de geplande productie-uren.</p>
                </div>
                <div className="p-2.5 rounded-lg border border-border/30 bg-muted/20">
                  <span className="text-[9px] font-mono text-muted-foreground/50 block mb-1">Relatie met Checks</span>
                  <p className="text-[10px] text-foreground/70">Kleine orders vereisen meer controle per boekettype. Meer fragmentatie = meer checks nodig voor kwaliteitsborging.</p>
                </div>
              </div>
            </div>

            {/* ── 4. TIJDSANALYSE — orderdruk per periode ── */}
            <div className="rounded-xl border border-border bg-card/50 p-4 mb-5">
              <span className="text-[12px] font-bold text-foreground block mb-3">Tijdsanalyse — Orderdruk per Periode</span>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left text-[10px] font-mono text-muted-foreground/40 pb-2">Periode</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-2">Orders</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-2">Gem. grootte</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-2">Mediaan</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-2">Ineff. orders</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-2">Ineff. %</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-2">Δ orders</th>
                      <th className="text-right text-[10px] font-mono text-muted-foreground/40 pb-2 px-2">Δ ineff. %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Show per dept filtered */}
                    {(deptFilter === "all" || deptFilter === "totaal"
                      ? [orderdrukTotaal]
                      : allOrderdruk.filter(d => d.dept.toLowerCase() === deptFilter)
                    ).map(od =>
                      od.periods.map((p, i) => {
                        const prev = od.periods[0];
                        const orderDiff = i > 0 ? pctDiff(p.totalOrders, prev.totalOrders) : 0;
                        const ineffDiff = i > 0 ? (p.inefficientPct - prev.inefficientPct) : 0;
                        return (
                          <tr key={`${od.dept}-${p.label}`} className={cn("border-b border-border/20", i === 1 && "bg-primary/3")}>
                            <td className="py-2">
                              <span className={cn("font-semibold", i === 0 ? "text-muted-foreground/60" : "text-foreground")}>{p.label}</span>
                              {i === 0 && od.dept !== "Totaal" && <span className="text-[8px] ml-1 text-muted-foreground/40">({od.dept})</span>}
                              {i === 1 && <span className="text-[8px] ml-1 font-mono text-primary">▸ focus</span>}
                            </td>
                            <td className="text-right px-2 font-mono font-semibold">{p.totalOrders}</td>
                            <td className="text-right px-2 font-mono">{p.avgSize} st</td>
                            <td className="text-right px-2 font-mono">{p.medianSize} st</td>
                            <td className="text-right px-2 font-mono">{p.inefficientOrders}</td>
                            <td className={cn("text-right px-2 font-mono font-semibold", p.inefficientPct >= 30 ? "text-destructive" : p.inefficientPct >= 25 ? "text-yellow-500" : "text-foreground")}>
                              {p.inefficientPct}%
                            </td>
                            <td className="text-right px-2">
                              {i > 0 ? <TrendArrow value={orderDiff} /> : <span className="text-muted-foreground/30">—</span>}
                            </td>
                            <td className="text-right px-2">
                              {i > 0 ? (
                                <span className={cn("text-[10px] font-mono font-semibold", ineffDiff > 0 ? "text-destructive" : "text-accent")}>
                                  {ineffDiff > 0 ? "+" : ""}{ineffDiff.toFixed(1)}pp
                                </span>
                              ) : <span className="text-muted-foreground/30">—</span>}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/30">
                <Info className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                  Tijdsanalyse op basis van vertrekdatum. Vertrekdatum ≠ productiedatum, maar geeft een goede indicatie van de orderdruk die op de productie afkomt.
                </p>
              </div>
            </div>

            {/* ── 5. ORDERDRUK SCORE ── */}
            <div className="rounded-xl border border-border bg-card/50 p-4 mb-5">
              <span className="text-[12px] font-bold text-foreground block mb-3">Orderdruk Score</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allOrderdruk.filter(d => d.buckets.length > 0 || d.dept === "Totaal").map(od => {
                  const score = calcOrderdrukScore(od);
                  const style = pdiColor(score.score);
                  return (
                    <div key={od.dept} className={cn("rounded-xl border p-4", style.border, style.bg)}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold text-foreground">{od.dept}</span>
                        <Badge variant="outline" className={cn("text-[9px] font-mono uppercase", style.border, style.text)}>{score.level}</Badge>
                      </div>
                      <div className={cn("text-3xl font-extrabold font-mono leading-none mb-3", style.text)}>{score.score.toFixed(1)}</div>
                      <div className="h-2.5 rounded-full bg-border/30 overflow-hidden mb-3">
                        <div className={cn("h-full rounded-full transition-all",
                          score.score >= 8 ? "bg-destructive" : score.score >= 6 ? "bg-yellow-500" : score.score >= 4 ? "bg-primary" : "bg-accent"
                        )} style={{ width: `${score.score * 10}%` }} />
                      </div>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between"><span className="text-muted-foreground/60">Ineff. %</span><span className="font-mono font-semibold">{od.inefficientPct}%</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground/60">Gem. grootte</span><span className="font-mono">{od.avgSize} st</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground/60">Fragmentatie</span><span className="font-mono">{od.fragmentatieIndex}/10</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground/60">Opstartverlies</span><span className="font-mono">{od.opstartverliesUren} uur</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 rounded-lg border border-border/30 bg-muted/20 p-3">
                <span className="text-[10px] font-mono text-muted-foreground/50 block mb-2">Orderdruk Score samenstelling</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px]">
                  {[
                    { label: "Ineff. aandeel", weight: "35%", icon: AlertTriangle },
                    { label: "Gem. ordergrootte", weight: "25%", icon: Package },
                    { label: "Fragmentatie-index", weight: "20%", icon: Layers },
                    { label: "Opstartverlies", weight: "20%", icon: Clock },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-2">
                      <c.icon className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                      <div>
                        <span className="text-foreground/70 block">{c.label}</span>
                        <span className="font-mono font-bold text-primary">{c.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── 6. AANVULLENDE INZICHTEN ── */}
            <div className="rounded-xl border border-border bg-card/50 p-4">
              <span className="text-[12px] font-bold text-foreground block mb-3">Aanvullende Inzichten</span>
              <div className="space-y-2">
                {[
                  { icon: Clock, severity: "critical" as const, text: `Geschat opstartverlies door kleine orders: ${orderdrukTotaal.opstartverliesUren} uur/week. Dit equivalent staat aan ${((orderdrukTotaal.opstartverliesUren / periods[1].totaalUren) * 100).toFixed(1)}% van de totale productie-uren.` },
                  { icon: Layers, severity: "warning" as const, text: `Fragmentatie-index Hand (${orderdrukHand.fragmentatieIndex}) is significant hoger dan Band (${orderdrukBand.fragmentatieIndex}). Hand productie kampt met meer unieke ordertypen en dus meer wisselingen.` },
                  { icon: TrendingUp, severity: "critical" as const, text: `Orderdruk stijgt komende week: inefficiënt aandeel groeit van ${orderdrukTotaal.periods[0].inefficientPct}% naar ${orderdrukTotaal.periods[1].inefficientPct}% (+${(orderdrukTotaal.periods[1].inefficientPct - orderdrukTotaal.periods[0].inefficientPct).toFixed(1)}pp).` },
                  { icon: Gauge, severity: "warning" as const, text: `Verband orderdruk en lijnprestatie: lijnen met veel kleine orders presteren gemiddeld ${Math.abs(orderdrukTotaal.wapuImpact)} st/u lager in W-APU door opstarttijd en complexiteit.` },
                  { icon: Users, severity: "info" as const, text: `Concentratie: top-5 klanten zijn verantwoordelijk voor ~40% van de kleine orders. Ordersamenvoeging of minimale ordergrenzen bij deze klanten kan opstartverlies met ~30% reduceren.` },
                ].map((a, i) => {
                  const s = alertSeverity[a.severity];
                  return (
                    <div key={i} className={cn("flex items-start gap-3 p-3 rounded-xl border", s.bg)}>
                      <a.icon className={cn("w-4 h-4 shrink-0 mt-0.5", s.text)} />
                      <p className="text-[11px] text-foreground/80 leading-relaxed">{a.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            <div className="mt-4 flex items-start gap-2 p-2.5 rounded-lg bg-muted/30 border border-border/30">
              <Info className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                Orderdruk geeft aan hoeveel orders onder de rendabiliteitsdrempel vallen en welke impact dat heeft op productie-efficiëntie.
                Hand productie is rendabel vanaf <span className="font-bold text-foreground/70">40 stuks</span> per order. Band productie is rendabel vanaf <span className="font-bold text-foreground/70">250 stuks</span> per order.
                Kleine orders genereren meer opstartmomenten, lijnwissels, handling en organisatorische druk, wat leidt tot lagere APU en hogere effectieve uurdruk.
              </p>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 6 — VERGELIJKING (UREN + STELEN + PDI COMBINED)  */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Vergelijking: Afgelopen week vs Komende 2 weken" icon={BarChart3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {periods.map((p, i) => {
                const pdi = pdiColor(p.pdiTotaal);
                return (
                  <div key={p.label} className={cn(
                    "rounded-xl border p-4",
                    i === 0 ? "border-border bg-card/50 opacity-80" : i === 1 ? `${pdi.border} ${pdi.bg}` : "border-border bg-card/50"
                  )}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] font-bold text-foreground">{p.label}</span>
                      {i === 1 && <Badge variant="outline" className="text-[8px] font-mono border-primary/30 text-primary">Focus</Badge>}
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="flex justify-between"><span className="text-muted-foreground/60">Uren totaal</span><span className="font-mono font-bold">{fmt(p.totaalUren)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground/60">↳ Hand</span><span className="font-mono">{fmt(p.handUren)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground/60">↳ Band</span><span className="font-mono">{fmt(p.bandUren)}</span></div>
                      <div className="border-t border-border/20 my-1" />
                      <div className="flex justify-between"><span className="text-muted-foreground/60">Stelen totaal</span><span className="font-mono font-bold">{fmt(p.totaalStelen)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground/60">↳ Hand</span><span className="font-mono">{fmt(p.handStelen)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground/60">↳ Band</span><span className="font-mono">{fmt(p.bandStelen)}</span></div>
                      <div className="border-t border-border/20 my-1" />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground/60">PDI</span>
                        <div className="flex items-center gap-2">
                          <span className={cn("font-mono font-bold text-[13px]", pdiColor(p.pdiTotaal).text)}>{p.pdiTotaal.toFixed(1)}</span>
                          <Badge variant="outline" className={cn("text-[8px] font-mono", pdiColor(p.pdiTotaal).border, pdiColor(p.pdiTotaal).text)}>
                            {pdiColor(p.pdiTotaal).level}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {i > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/30 grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-muted-foreground/40 font-mono">Δ Uren</span>
                          <div><TrendArrow value={pctDiff(p.totaalUren, periods[0].totaalUren)} /></div>
                        </div>
                        <div>
                          <span className="text-muted-foreground/40 font-mono">Δ Stelen</span>
                          <div><TrendArrow value={pctDiff(p.totaalStelen, periods[0].totaalStelen)} /></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 7 — PRODUCTIEDRUK INDEX (PDI)                    */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Productiedruk Index (PDI)" icon={Activity}
            tooltip="Samengestelde drukscore op basis van uurdruk, stelenvolume, checks per lijn, en afwijkingen W-APU vs O-APU en P-APU. Schaal 0-10.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {(["Hand", "Band", "Totaal"] as const).map(dept => {
                const deptKey = dept.toLowerCase() as "hand" | "band" | "totaal";
                const weekData = periods.map(p => ({
                  label: p.label,
                  value: deptKey === "hand" ? p.pdiHand : deptKey === "band" ? p.pdiBand : p.pdiTotaal,
                }));
                const current = weekData[1].value;
                const pdi = pdiColor(current);
                return (
                  <div key={dept} className={cn("rounded-xl border p-4", pdi.border, pdi.bg)}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] font-bold text-foreground">{dept}</span>
                      <Badge variant="outline" className={cn("text-[9px] font-mono uppercase", pdi.border, pdi.text)}>{pdi.level}</Badge>
                    </div>
                    <div className={cn("text-3xl font-extrabold font-mono leading-none mb-3", pdi.text)}>{current.toFixed(1)}</div>
                    {/* Mini gauge */}
                    <div className="h-2.5 rounded-full bg-border/30 overflow-hidden mb-3">
                      <div className={cn("h-full rounded-full transition-all",
                        current >= 8 ? "bg-destructive" : current >= 6 ? "bg-yellow-500" : current >= 4 ? "bg-primary" : "bg-accent"
                      )} style={{ width: `${current * 10}%` }} />
                    </div>
                    {/* Trend per week */}
                    <div className="space-y-1">
                      {weekData.map((w, i) => (
                        <div key={w.label} className="flex justify-between text-[10px]">
                          <span className={cn("font-mono", i === 0 ? "text-muted-foreground/40" : "text-foreground/70")}>{w.label}</span>
                          <span className={cn("font-mono font-semibold", pdiColor(w.value).text)}>{w.value.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PDI composition explanation */}
            <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
              <span className="text-[10px] font-mono text-muted-foreground/50 block mb-2">PDI samenstelling</span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-[10px]">
                {[
                  { label: "Uurdruk", weight: "20%", icon: Clock },
                  { label: "Stelenvolume", weight: "20%", icon: Layers },
                  { label: "Checks / sturing", weight: "12%", icon: ClipboardCheck },
                  { label: "W vs O-APU afw.", weight: "18%", icon: Gauge },
                  { label: "W vs P-APU afw.", weight: "12%", icon: Brain },
                  { label: "Orderdruk", weight: "18%", icon: BoxSelect },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-2">
                    <c.icon className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    <div>
                      <span className="text-foreground/70 block">{c.label}</span>
                      <span className="font-mono font-bold text-primary">{c.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* SECTION 8 — ADVIESBLOK / CONCLUSIE                       */}
          {/* ══════════════════════════════════════════════════════════ */}
          <Section title="Management Advies" icon={Lightbulb} badge="Auto-gegenereerd">
            <div className="space-y-2">
              {advisories.map((a, i) => {
                const s = alertSeverity[a.severity];
                return (
                  <div key={i} className={cn("flex items-start gap-3 p-3 rounded-xl border", s.bg)}>
                    <a.icon className={cn("w-4 h-4 shrink-0 mt-0.5", s.text)} />
                    <p className="text-[12px] text-foreground/80 leading-relaxed">{a.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-[12px] font-bold text-foreground">Conclusie</span>
              </div>
              <p className="text-[12px] text-foreground/70 leading-relaxed">
                De productie staat onder verhoogde druk komende week. Het stelenvolume stijgt sneller dan de beschikbare uren, wat wijst op toenemende verwerkingscomplexiteit.
                De W-APU ligt onder zowel de klantnorm (O-APU) als de planningsnorm (P-APU), wat betekent dat er meer uren nodig zijn dan gepland én betaald.
                Checks op lijnen H3 en B4 zijn significant lager dan gemiddeld — dit zijn potentiële blinde vlekken in de sturing.
                De PDI stijgt naar {currentPeriod.pdiTotaal.toFixed(1)} (verhoogd). Aanbevolen wordt om extra capaciteitsmaatregelen te overwegen en de bandleiders te briefen over de focus-lijnen.
              </p>
            </div>
          </Section>

          {/* ── LABOUR TRUTH ── */}
          <Section title="Labour Truth" icon={Users} badge="NEW" tooltip="Vergelijkt werkelijke productiviteit (W-APU) met doorbelasting (O-APU), planning (P-APU) en benchmark (C-APU) per product.">
            <LabourTruthPanel />
          </Section>

        </div>
      </div>
    </div>
  );
};

export default ProductionCockpit;
