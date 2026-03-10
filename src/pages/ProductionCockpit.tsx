import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Factory, AlertTriangle, Clock, TrendingUp, TrendingDown, Minus,
  ChevronDown, ChevronRight, Filter, Users, Gauge, Package,
  Zap, Activity, BarChart3, Truck, CheckCircle2, XCircle,
  AlertCircle, ArrowUpRight, ArrowDownRight, Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
type LineStatus = "running" | "slow" | "stopped" | "idle";
type OrderStatus = "planned" | "in-progress" | "delayed" | "completed" | "at-risk" | "waiting";
type AlertSeverity = "critical" | "warning" | "info";
type UrgencyLevel = "high" | "medium" | "low";

interface ProductionOrder {
  id: string;
  product: string;
  family: string;
  customer: string;
  program: string;
  plannedUnits: number;
  completedUnits: number;
  line: string;
  apuTarget: number;
  apuActual: number;
  labour: number;
  complexity: "low" | "medium" | "high";
  status: OrderStatus;
  risk: "none" | "low" | "medium" | "high";
  urgency: UrgencyLevel;
  departure: string;
  stemsPerBouquet: number;
  actions?: string[];
}

interface LineData {
  id: string;
  name: string;
  dept: "hand" | "band" | "inpak";
  load: number;
  orders: number;
  apuTarget: number;
  apuActual: number;
  labour: number;
  complexity: "low" | "medium" | "high";
  status: LineStatus;
  product?: string;
}

interface ProductionAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  line?: string;
  time: string;
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                          */
/* ------------------------------------------------------------------ */
const summaryMetrics = [
  { label: "Orders gepland", value: "34", icon: Package, status: "healthy" as const },
  { label: "Boeketten gepland", value: "48.2K", icon: Layers, status: "healthy" as const, target: "52K" },
  { label: "Gereed", value: "18.6K", icon: CheckCircle2, status: "healthy" as const, change: "+2.4K/u", changeDir: "up" as const },
  { label: "Resterend", value: "29.6K", icon: Clock, status: "warning" as const },
  { label: "Actieve lijnen", value: "10/12", icon: Factory, status: "healthy" as const },
  { label: "Arbeid ingezet", value: "68", unit: "pers", icon: Users, status: "healthy" as const },
  { label: "APU target", value: "220", unit: "st/u", icon: Gauge, status: "healthy" as const, sub: "Actueel: 208" },
  { label: "Druk index", value: "7.2", unit: "/10", icon: Activity, status: "warning" as const, change: "+0.8", changeDir: "up" as const },
];

const productionOrders: ProductionOrder[] = [
  { id: "PO-001", product: "Charme XL", family: "Premium", customer: "Albert Heijn", program: "Wk12 — AH", plannedUnits: 4200, completedUnits: 2800, line: "H1", apuTarget: 220, apuActual: 228, labour: 8, complexity: "medium", status: "in-progress", risk: "none", urgency: "high", departure: "14:00", stemsPerBouquet: 12, actions: ["Versnellen"] },
  { id: "PO-002", product: "Lovely", family: "Standard", customer: "Jumbo", program: "Wk12 — Jumbo", plannedUnits: 6800, completedUnits: 1200, line: "H3", apuTarget: 220, apuActual: 172, labour: 10, complexity: "high", status: "delayed", risk: "high", urgency: "high", departure: "13:00", stemsPerBouquet: 15, actions: ["Extra arbeid", "Herplannen"] },
  { id: "PO-003", product: "De Luxe", family: "Premium", customer: "Aldi", program: "Wk12 — Aldi", plannedUnits: 3600, completedUnits: 3600, line: "B1", apuTarget: 330, apuActual: 345, labour: 6, complexity: "low", status: "completed", risk: "none", urgency: "low", departure: "11:00", stemsPerBouquet: 10 },
  { id: "PO-004", product: "Trend", family: "Budget", customer: "Lidl", program: "Wk12 — Lidl", plannedUnits: 5200, completedUnits: 0, line: "H5", apuTarget: 220, apuActual: 0, labour: 8, complexity: "medium", status: "planned", risk: "low", urgency: "medium", departure: "16:00", stemsPerBouquet: 8 },
  { id: "PO-005", product: "Field M", family: "Field", customer: "Dekamarkt", program: "Wk12 — Deka", plannedUnits: 2400, completedUnits: 1600, line: "B3", apuTarget: 330, apuActual: 310, labour: 5, complexity: "low", status: "in-progress", risk: "none", urgency: "medium", departure: "15:00", stemsPerBouquet: 7 },
  { id: "PO-006", product: "Elegance", family: "Premium", customer: "Albert Heijn", program: "Wk12 — AH", plannedUnits: 1800, completedUnits: 400, line: "H6", apuTarget: 220, apuActual: 195, labour: 6, complexity: "high", status: "at-risk", risk: "medium", urgency: "high", departure: "14:30", stemsPerBouquet: 14, actions: ["Monitor", "Bijsturen"] },
  { id: "PO-007", product: "Chique", family: "Standard", customer: "Jumbo", program: "Wk12 — Jumbo", plannedUnits: 4800, completedUnits: 0, line: "—", apuTarget: 220, apuActual: 0, labour: 0, complexity: "medium", status: "waiting", risk: "medium", urgency: "medium", departure: "17:00", stemsPerBouquet: 11, actions: ["Materiaal checken"] },
  { id: "PO-008", product: "Spring Bouquet", family: "Seasonal", customer: "Aldi", program: "Wk12 — Aldi", plannedUnits: 3200, completedUnits: 2100, line: "H4", apuTarget: 220, apuActual: 232, labour: 7, complexity: "medium", status: "in-progress", risk: "none", urgency: "medium", departure: "15:30", stemsPerBouquet: 9 },
  { id: "PO-009", product: "Moederdag Mix", family: "Seasonal", customer: "Albert Heijn", program: "Wk12 — AH", plannedUnits: 2000, completedUnits: 800, line: "B4", apuTarget: 330, apuActual: 328, labour: 4, complexity: "high", status: "in-progress", risk: "low", urgency: "low", departure: "16:30", stemsPerBouquet: 13 },
];

const lines: LineData[] = [
  { id: "H1", name: "Hand 1", dept: "hand", load: 92, orders: 2, apuTarget: 220, apuActual: 228, labour: 8, complexity: "medium", status: "running", product: "Charme XL" },
  { id: "H2", name: "Hand 2", dept: "hand", load: 88, orders: 1, apuTarget: 220, apuActual: 218, labour: 7, complexity: "low", status: "running", product: "Pastel" },
  { id: "H3", name: "Hand 3", dept: "hand", load: 98, orders: 1, apuTarget: 220, apuActual: 172, labour: 10, complexity: "high", status: "slow", product: "Lovely" },
  { id: "H4", name: "Hand 4", dept: "hand", load: 85, orders: 1, apuTarget: 220, apuActual: 232, labour: 7, complexity: "medium", status: "running", product: "Spring Bouquet" },
  { id: "H5", name: "Hand 5", dept: "hand", load: 60, orders: 1, apuTarget: 220, apuActual: 0, labour: 8, complexity: "medium", status: "idle", product: "Trend" },
  { id: "H6", name: "Hand 6", dept: "hand", load: 95, orders: 1, apuTarget: 220, apuActual: 195, labour: 6, complexity: "high", status: "slow", product: "Elegance" },
  { id: "H7", name: "Hand 7", dept: "hand", load: 0, orders: 0, apuTarget: 220, apuActual: 0, labour: 0, complexity: "low", status: "stopped" },
  { id: "B1", name: "Band 1", dept: "band", load: 45, orders: 0, apuTarget: 330, apuActual: 345, labour: 6, complexity: "low", status: "running", product: "De Luxe ✓" },
  { id: "B2", name: "Band 2", dept: "band", load: 78, orders: 1, apuTarget: 330, apuActual: 310, labour: 5, complexity: "low", status: "running", product: "Zomermix" },
  { id: "B3", name: "Band 3", dept: "band", load: 82, orders: 1, apuTarget: 330, apuActual: 352, labour: 5, complexity: "low", status: "running", product: "Field M" },
  { id: "B4", name: "Band 4", dept: "band", load: 70, orders: 1, apuTarget: 330, apuActual: 328, labour: 4, complexity: "high", status: "running", product: "Moederdag Mix" },
  { id: "B5", name: "Band 5", dept: "band", load: 0, orders: 0, apuTarget: 330, apuActual: 0, labour: 0, complexity: "low", status: "stopped" },
];

const alerts: ProductionAlert[] = [
  { id: "a1", severity: "critical", title: "H3 — APU 22% onder norm", description: "Lijn H3 produceert 172 st/u i.p.v. 220. Product Lovely met hoge complexiteit. Overweeg extra arbeid of herplanning.", line: "H3", time: "10:12" },
  { id: "a2", severity: "critical", title: "PO-002 vertraging — vertrek 13:00 niet haalbaar", description: "Order Lovely voor Jumbo ligt achter op schema. 1.200 van 6.800 gereed. Verwachte afronding: 17:30.", line: "H3", time: "10:15" },
  { id: "a3", severity: "warning", title: "H6 — Efficiëntie onder druk", description: "Lijn H6 op 195 APU (target 220). Product Elegance met hoge steelcomplexiteit.", line: "H6", time: "09:45" },
  { id: "a4", severity: "warning", title: "PO-007 wacht op materiaal", description: "Order Chique kan niet starten — Alstroemeria Virginia recept onopgelost.", time: "08:30" },
  { id: "a5", severity: "warning", title: "Arbeiddruk hoog op Hand-afdeling", description: "68 medewerkers ingezet, 6 van 7 handlijnen actief. Geen reserve beschikbaar.", time: "09:00" },
  { id: "a6", severity: "info", title: "B1 — Order De Luxe afgerond", description: "3.600 boeketten gereed. Lijn beschikbaar voor volgende order.", line: "B1", time: "10:30" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const fmt = (n: number) => n.toLocaleString("nl-NL");

const statusCls: Record<OrderStatus, string> = {
  planned: "text-muted-foreground bg-muted/50",
  "in-progress": "text-primary bg-primary/10",
  delayed: "text-destructive bg-destructive/10",
  completed: "text-accent bg-accent/10",
  "at-risk": "text-yellow-500 bg-yellow-500/10",
  waiting: "text-muted-foreground bg-muted/30",
};
const statusLabel: Record<OrderStatus, string> = {
  planned: "Gepland", "in-progress": "In productie", delayed: "Vertraagd",
  completed: "Gereed", "at-risk": "At Risk", waiting: "Wachtend",
};

const lineStatusCls: Record<LineStatus, string> = {
  running: "bg-accent", slow: "bg-yellow-500 animate-pulse", stopped: "bg-muted-foreground/30", idle: "bg-primary/40",
};

const riskCls: Record<string, string> = {
  none: "text-accent", low: "text-primary", medium: "text-yellow-500", high: "text-destructive",
};

const complexityCls: Record<string, string> = {
  low: "text-accent bg-accent/10", medium: "text-yellow-500 bg-yellow-500/10", high: "text-destructive bg-destructive/10",
};

const alertIcon: Record<AlertSeverity, typeof AlertTriangle> = {
  critical: XCircle, warning: AlertTriangle, info: AlertCircle,
};
const alertCls: Record<AlertSeverity, string> = {
  critical: "border-destructive/30 bg-destructive/5", warning: "border-yellow-500/30 bg-yellow-500/5", info: "border-border bg-card/50",
};

/* ------------------------------------------------------------------ */
/*  SECTION WRAPPER                                                    */
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

/* ------------------------------------------------------------------ */
/*  METRIC CARD (compact)                                              */
/* ------------------------------------------------------------------ */
const MetricCard = ({ label, value, unit, icon: Icon, status, change, changeDir, target, sub }: {
  label: string; value: string; unit?: string; icon: typeof Factory;
  status: "healthy" | "warning" | "critical";
  change?: string; changeDir?: "up" | "down"; target?: string; sub?: string;
}) => {
  const bg = status === "healthy" ? "bg-accent/5 border-accent/20" : status === "warning" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-destructive/5 border-destructive/20";
  const dot = status === "healthy" ? "bg-accent" : status === "warning" ? "bg-yellow-500" : "bg-destructive";
  const ChangeDirIcon = changeDir === "up" ? TrendingUp : changeDir === "down" ? TrendingDown : Minus;
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
          {sub && <div className="text-[10px] text-muted-foreground/50 mt-0.5">{sub}</div>}
          {change && (
            <div className={cn("flex items-center gap-0.5 mt-1", changeColor)}>
              <ChangeDirIcon className="w-3 h-3" />
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
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */
const ProductionCockpit = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterLine, setFilterLine] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  const filtered = productionOrders.filter(o => {
    if (filterLine !== "all" && o.line !== filterLine) return false;
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (filterUrgency !== "all" && o.urgency !== filterUrgency) return false;
    return true;
  });

  const totalPlanned = productionOrders.reduce((s, o) => s + o.plannedUnits, 0);
  const totalCompleted = productionOrders.reduce((s, o) => s + o.completedUnits, 0);
  const progressPct = Math.round((totalCompleted / totalPlanned) * 100);

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
                <p className="text-[10px] font-mono text-muted-foreground">Operationele productie controle • {new Date().toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-mono gap-1 border-accent/30 text-accent">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                LIVE
              </Badge>
            </div>
          </div>

          {/* ── SECTION 1: PRODUCTION SUMMARY ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {summaryMetrics.map(m => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* ── SECTION 5: EXECUTION PROGRESS (compact bar) ── */}
          <div className="rounded-xl border border-border bg-card/70 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-primary/70" />
                <span className="text-[12px] font-semibold text-foreground">Dagvoortgang</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-foreground">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2.5" />
            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground/50 font-mono">
              <span>{fmt(totalCompleted)} gereed</span>
              <span>{fmt(totalPlanned - totalCompleted)} resterend</span>
              <span>{fmt(totalPlanned)} totaal</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[
                { label: "In productie", count: productionOrders.filter(o => o.status === "in-progress").length, cls: "text-primary" },
                { label: "Vertraagd", count: productionOrders.filter(o => o.status === "delayed").length, cls: "text-destructive" },
                { label: "At Risk", count: productionOrders.filter(o => o.status === "at-risk").length, cls: "text-yellow-500" },
                { label: "Wachtend", count: productionOrders.filter(o => o.status === "waiting" || o.status === "planned").length, cls: "text-muted-foreground" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={cn("text-lg font-bold", s.cls)}>{s.count}</div>
                  <div className="text-[10px] text-muted-foreground/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 4: BOTTLENECKS / ALERTS ── */}
          <Section title="Bottlenecks & Alerts" icon={AlertTriangle} badge={`${alerts.filter(a => a.severity === "critical").length} kritiek`}>
            <div className="space-y-2">
              {alerts.map(a => {
                const AIcon = alertIcon[a.severity];
                return (
                  <div key={a.id} className={cn("flex items-start gap-3 p-3 rounded-xl border", alertCls[a.severity])}>
                    <AIcon className={cn("w-4 h-4 shrink-0 mt-0.5", a.severity === "critical" ? "text-destructive" : a.severity === "warning" ? "text-yellow-500" : "text-muted-foreground")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold text-foreground">{a.title}</span>
                        {a.line && <span className="text-[9px] font-mono text-muted-foreground/50 border border-border/50 px-1.5 rounded">{a.line}</span>}
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-relaxed">{a.description}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">{a.time}</span>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── SECTION 3: LINE / WORKSTATION VIEW ── */}
          <Section title="Lijn & Werkplek Overzicht" icon={Factory} badge="12 lijnen">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {lines.map(l => {
                const loadColor = l.load >= 90 ? "text-destructive" : l.load >= 70 ? "text-yellow-500" : l.load > 0 ? "text-accent" : "text-muted-foreground/30";
                const apuColor = l.apuActual === 0 ? "text-muted-foreground/30" : l.apuActual >= l.apuTarget ? "text-accent" : l.apuActual >= l.apuTarget * 0.9 ? "text-yellow-500" : "text-destructive";
                return (
                  <div key={l.id} className="rounded-xl border border-border bg-card/50 p-3 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-2 h-2 rounded-full", lineStatusCls[l.status])} />
                        <span className="text-[12px] font-bold text-foreground">{l.id}</span>
                      </div>
                      <span className={cn("text-[10px] font-mono font-semibold", loadColor)}>{l.load}%</span>
                    </div>
                    {l.product && <div className="text-[10px] text-muted-foreground/60 truncate mb-2">{l.product}</div>}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground/50">APU</span>
                        <span className={cn("font-semibold", apuColor)}>{l.apuActual || "—"}<span className="text-muted-foreground/30">/{l.apuTarget}</span></span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground/50">Arbeid</span>
                        <span className="text-foreground/70 font-medium">{l.labour || "—"}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted-foreground/50">Orders</span>
                        <span className="text-foreground/70 font-medium">{l.orders}</span>
                      </div>
                    </div>
                    {/* Load bar */}
                    <div className="mt-2 h-1 rounded-full bg-border/30 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", l.load >= 90 ? "bg-destructive/60" : l.load >= 70 ? "bg-yellow-500/60" : l.load > 0 ? "bg-accent/60" : "bg-transparent")}
                        style={{ width: `${l.load}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ── SECTION 6: PRODUCTIVITY / EFFICIENCY ── */}
          <Section title="Productiviteit & Efficiëntie" icon={Gauge}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { label: "Output vandaag", value: fmt(totalCompleted), unit: "bq", status: "healthy" as const },
                { label: "Gem. ordergrootte", value: "1.4K", unit: "bq", status: "healthy" as const },
                { label: "Gem. stelen/boeket", value: "11.2", unit: "st", status: "healthy" as const },
                { label: "APU actueel", value: "208", unit: "st/u", status: "warning" as const, target: "220" },
                { label: "Arbeidsefficiëntie", value: "94.5", unit: "%", status: "warning" as const },
                { label: "Drukindex", value: "7.2", unit: "/10", status: "warning" as const },
              ].map(m => (
                <div key={m.label} className={cn("p-3 rounded-xl border", m.status === "healthy" ? "bg-accent/5 border-accent/20" : "bg-yellow-500/5 border-yellow-500/20")}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full", m.status === "healthy" ? "bg-accent" : "bg-yellow-500")} />
                    <span className="text-[10px] text-foreground/50">{m.label}</span>
                  </div>
                  <div className="text-lg font-extrabold text-foreground leading-none">
                    {m.value}
                    {m.unit && <span className="text-[10px] font-normal text-muted-foreground/50 ml-0.5">{m.unit}</span>}
                  </div>
                  {m.target && <div className="text-[10px] text-muted-foreground/40 mt-0.5">Target: {m.target}</div>}
                </div>
              ))}
            </div>
          </Section>

          {/* ── SECTION 2 & 7: WORKLOAD + DETAILED TABLE ── */}
          <Section title="Productie Orders" icon={Package} badge={`${filtered.length} orders`}>
            {/* Filters */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-3 h-3" /> Filter
              </Button>
              {showFilters && (
                <>
                  <Select value={filterLine} onValueChange={setFilterLine}>
                    <SelectTrigger className="h-7 w-24 text-[10px] font-mono"><SelectValue placeholder="Lijn" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle lijnen</SelectItem>
                      {lines.map(l => <SelectItem key={l.id} value={l.id}>{l.id}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-7 w-28 text-[10px] font-mono"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle statussen</SelectItem>
                      {Object.entries(statusLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                    <SelectTrigger className="h-7 w-24 text-[10px] font-mono"><SelectValue placeholder="Urgentie" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="high">Hoog</SelectItem>
                      <SelectItem value="medium">Middel</SelectItem>
                      <SelectItem value="low">Laag</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>

            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_0.8fr_0.6fr_0.8fr_0.5fr_0.5fr_0.4fr_0.5fr_0.4fr_0.5fr] text-[10px] text-muted-foreground/40 font-mono pb-2 border-b border-border/30 gap-2 px-3">
              <span>Order / Product</span>
              <span>Klant / Programma</span>
              <span>Volume</span>
              <span>Voortgang</span>
              <span>Lijn</span>
              <span>APU</span>
              <span>Arbeid</span>
              <span>Complexiteit</span>
              <span>Risico</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            <div className="space-y-1 mt-1">
              {filtered.map(o => {
                const pct = o.plannedUnits > 0 ? Math.round((o.completedUnits / o.plannedUnits) * 100) : 0;
                const isExpanded = expanded === o.id;
                const apuColor = o.apuActual === 0 ? "text-muted-foreground/30" : o.apuActual >= o.apuTarget ? "text-accent" : o.apuActual >= o.apuTarget * 0.9 ? "text-yellow-500" : "text-destructive";

                return (
                  <Collapsible key={o.id} open={isExpanded} onOpenChange={() => toggle(o.id)}>
                    <CollapsibleTrigger asChild>
                      <div className={cn(
                        "grid grid-cols-1 md:grid-cols-[1fr_0.8fr_0.6fr_0.8fr_0.5fr_0.5fr_0.4fr_0.5fr_0.4fr_0.5fr] items-center text-[12px] py-2.5 px-3 rounded-lg gap-2 cursor-pointer transition-colors",
                        isExpanded ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30 border border-transparent",
                        o.status === "delayed" && "border-destructive/20 bg-destructive/3",
                        o.status === "at-risk" && "border-yellow-500/15 bg-yellow-500/3",
                      )}>
                        {/* Order / Product */}
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown className="w-3 h-3 text-muted-foreground/40 shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
                          <div>
                            <div className="font-semibold text-foreground">{o.product}</div>
                            <div className="text-[10px] text-muted-foreground/40 font-mono">{o.id} • {o.family}</div>
                          </div>
                        </div>
                        {/* Klant */}
                        <div className="hidden md:block">
                          <div className="text-foreground/70 text-[11px]">{o.customer}</div>
                          <div className="text-[10px] text-muted-foreground/40">{o.program}</div>
                        </div>
                        {/* Volume */}
                        <div className="hidden md:block text-[11px] font-mono">
                          <span className="text-foreground/70">{fmt(o.completedUnits)}</span>
                          <span className="text-muted-foreground/30">/{fmt(o.plannedUnits)}</span>
                        </div>
                        {/* Voortgang */}
                        <div className="hidden md:block">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-border/30 overflow-hidden">
                              <div className={cn("h-full rounded-full", pct >= 100 ? "bg-accent" : pct >= 50 ? "bg-primary" : "bg-yellow-500/60")} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground/50 w-8 text-right">{pct}%</span>
                          </div>
                        </div>
                        {/* Lijn */}
                        <span className="hidden md:block text-[11px] font-mono text-foreground/60">{o.line}</span>
                        {/* APU */}
                        <span className={cn("hidden md:block text-[11px] font-mono font-semibold", apuColor)}>
                          {o.apuActual || "—"}<span className="text-muted-foreground/30 font-normal">/{o.apuTarget}</span>
                        </span>
                        {/* Arbeid */}
                        <span className="hidden md:block text-[11px] font-mono text-foreground/60">{o.labour || "—"}</span>
                        {/* Complexiteit */}
                        <div className="hidden md:block">
                          <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded", complexityCls[o.complexity])}>{o.complexity}</span>
                        </div>
                        {/* Risico */}
                        <span className={cn("hidden md:block text-[11px] font-semibold", riskCls[o.risk])}>{o.risk === "none" ? "—" : o.risk}</span>
                        {/* Status */}
                        <div className="hidden md:block">
                          <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full", statusCls[o.status])}>{statusLabel[o.status]}</span>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-5 md:ml-8 p-3 rounded-lg bg-muted/20 border border-border/30 mt-1 mb-2 space-y-2">
                        {/* Mobile summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:hidden">
                          <div><span className="text-[10px] text-muted-foreground/40">Klant</span><div className="text-[11px] text-foreground">{o.customer}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Volume</span><div className="text-[11px] font-mono">{fmt(o.completedUnits)}/{fmt(o.plannedUnits)}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Lijn</span><div className="text-[11px] font-mono">{o.line}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Status</span><div><span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full", statusCls[o.status])}>{statusLabel[o.status]}</span></div></div>
                        </div>
                        {/* Detail grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div><span className="text-[10px] text-muted-foreground/40">Vertrek</span><div className="text-[11px] font-semibold text-foreground">{o.departure}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Stelen/boeket</span><div className="text-[11px] font-mono text-foreground">{o.stemsPerBouquet}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Resterend</span><div className="text-[11px] font-mono text-foreground">{fmt(o.plannedUnits - o.completedUnits)}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Urgentie</span><div className={cn("text-[11px] font-semibold", o.urgency === "high" ? "text-destructive" : o.urgency === "medium" ? "text-yellow-500" : "text-accent")}>{o.urgency}</div></div>
                        </div>
                        {/* Actions */}
                        {o.actions && o.actions.length > 0 && (
                          <div className="flex gap-2 pt-1">
                            {o.actions.map(a => (
                              <Button key={a} variant="outline" size="sm" className="h-6 text-[10px] font-mono">
                                <Zap className="w-3 h-3 mr-1" />{a}
                              </Button>
                            ))}
                          </div>
                        )}
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
