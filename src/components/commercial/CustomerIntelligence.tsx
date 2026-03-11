import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, ScatterChart, Scatter, ZAxis, Legend
} from "recharts";
import {
  Users, Factory, TrendingDown, Briefcase, Calendar, AlertTriangle,
  XCircle, Star, Activity, ChevronDown, ChevronRight, ArrowUpRight, ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  customerRows, customerSeasonData, alerts,
  fmtEur, fmt, customerTypeCls,
  type CustomerRow, type AlertSeverity
} from "./commercial-data";

/* ── Section Shell ── */
const Section = ({ title, icon: Icon, children, badge }: { title: string; icon: typeof Users; children: React.ReactNode; badge?: string }) => (
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

/* ── Alert helpers ── */
const alertIcon: Record<AlertSeverity, typeof AlertTriangle> = { critical: XCircle, warning: AlertTriangle, info: Star };
const alertCls: Record<AlertSeverity, string> = {
  critical: "border-destructive/30 bg-destructive/5",
  warning: "border-yellow-500/30 bg-yellow-500/5",
  info: "border-accent/30 bg-accent/5",
};

/* ── Stability color ── */
const stabilityColor = (v: number) => v >= 0.8 ? "hsl(155, 55%, 42%)" : v >= 0.6 ? "hsl(45, 85%, 50%)" : v >= 0.4 ? "hsl(30, 80%, 50%)" : "hsl(0, 65%, 50%)";
const stabilityLabel = (v: number) => v >= 0.8 ? "Stabiel" : v >= 0.6 ? "Seizoen" : v >= 0.4 ? "Instabiel" : "Probleem";

/* ══════════════════════════════════════════════════ */
/*  CUSTOMER INTELLIGENCE                            */
/* ══════════════════════════════════════════════════ */

const CustomerIntelligence = () => {
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<keyof CustomerRow>("stabilityIndex");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    return [...customerRows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "desc" ? bv - av : av - bv;
      return sortDir === "desc" ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
    });
  }, [sortKey, sortDir]);

  const handleSort = (key: keyof CustomerRow) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortHeader = ({ label, field, className }: { label: string; field: keyof CustomerRow; className?: string }) => (
    <button onClick={() => handleSort(field)} className={cn("text-left text-[10px] text-muted-foreground/40 font-mono hover:text-foreground transition-colors", className)}>
      {label} {sortKey === field && (sortDir === "desc" ? "↓" : "↑")}
    </button>
  );

  /* Production impact chart */
  const productionImpact = useMemo(() =>
    [...customerRows].sort((a, b) => b.productionPressure - a.productionPressure)
      .map(c => ({
        name: c.customer,
        pressure: c.productionPressure,
        inefficiency: c.inefficiencyPct,
        fragmentation: +(c.orderFragmentation * 100).toFixed(0),
        avgOrderSize: c.avgOrderSize,
        type: c.customerType,
      })),
  []);

  /* Customer stability chart */
  const stabilityChart = useMemo(() =>
    [...customerRows].sort((a, b) => b.stabilityIndex - a.stabilityIndex)
      .map(c => ({ name: c.customer, value: c.stabilityIndex, type: c.customerType })),
  []);

  /* Customer alerts */
  const customerAlerts = alerts.filter(a =>
    ["customer-stability", "customer-margin", "customer-fragmentation", "customer-seasonal"].includes(a.type)
  );

  return (
    <>
      {/* ═══ SECTION 1: CUSTOMER STABILITY DASHBOARD ═══ */}
      <Section title="Klantstabiliteit Dashboard" icon={Users} badge={`${customerRows.length} klanten`}>
        {/* Stability bar chart */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stabilityChart} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} angle={-30} textAnchor="end" interval={0} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 97%)", border: "1px solid hsl(220, 15%, 88%)", borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [v.toFixed(2), "Stabiliteit"]}
              />
              <ReferenceLine y={0.6} stroke="hsl(30, 80%, 50%)" strokeDasharray="4 4" label={{ value: "Min stabiel", position: "right", fontSize: 10, fill: "hsl(30, 80%, 50%)" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stabilityChart.map((entry, i) => (
                  <Cell key={i} fill={stabilityColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {sorted.map(c => {
            const typeCls = customerTypeCls[c.customerType];
            return (
              <div key={c.id} className={cn("p-3 rounded-xl border transition-all hover:shadow-md", typeCls.bg)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-bold text-foreground">{c.customer}</span>
                  <div className={cn("w-2 h-2 rounded-full", typeCls.dot)} />
                </div>
                <div className={cn("text-[9px] font-mono px-2 py-0.5 rounded-full border w-fit mb-2", typeCls.bg, typeCls.text)}>{typeCls.label}</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground/60">Omzet</span>
                    <span className="font-mono font-semibold text-foreground">{fmtEur(c.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground/60">Marge</span>
                    <span className={cn("font-mono font-semibold", c.marginPct >= c.targetMarginPct ? "text-accent" : "text-destructive")}>{c.marginPct}%</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground/60">Stabiliteit</span>
                    <span className="font-mono font-semibold" style={{ color: stabilityColor(c.stabilityIndex) }}>{c.stabilityIndex.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground/60">Wkn actief</span>
                    <span className="font-mono text-foreground/60">{c.weeksActive}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground/60">Forecast acc.</span>
                    <span className={cn("font-mono font-semibold", c.forecastAccuracy >= 90 ? "text-accent" : c.forecastAccuracy >= 80 ? "text-yellow-500" : "text-destructive")}>{c.forecastAccuracy}%</span>
                  </div>
                </div>
                {/* Stability bar */}
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-border/30 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${c.stabilityIndex * 100}%`, backgroundColor: stabilityColor(c.stabilityIndex) }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ SECTION 2: CUSTOMER PRODUCTION IMPACT ═══ */}
      <Section title="Klant Productie-Impact" icon={Factory}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productionImpact} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 97%)", border: "1px solid hsl(220, 15%, 88%)", borderRadius: 8, fontSize: 11 }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine y={7} stroke="hsl(0, 65%, 50%)" strokeDasharray="4 4" label={{ value: "Hoog", position: "right", fontSize: 10, fill: "hsl(0, 65%, 50%)" }} />
              <Bar dataKey="pressure" name="Productiedruk" radius={[4, 4, 0, 0]}>
                {productionImpact.map((entry, i) => (
                  <Cell key={i} fill={entry.pressure >= 7 ? "hsl(0, 65%, 50%)" : entry.pressure >= 4 ? "hsl(45, 85%, 50%)" : "hsl(155, 55%, 42%)"} />
                ))}
              </Bar>
              <Bar dataKey="inefficiency" name="Inefficiëntie %" fill="hsl(211, 100%, 50%)" radius={[4, 4, 0, 0]} opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Production impact detail */}
        <div className="mt-4 overflow-x-auto">
          <div className="hidden md:grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr] text-[10px] text-muted-foreground/40 font-mono pb-1.5 border-b border-border/30 px-2 gap-2 min-w-[700px]">
            <span>Klant</span><span>Gem. ordergrootte</span><span>Inefficiëntie %</span><span>Fragmentatie</span><span>Productiedruk</span><span>Forecast acc.</span>
          </div>
          <div className="space-y-0.5 mt-1 min-w-[700px]">
            {[...customerRows].sort((a, b) => b.productionPressure - a.productionPressure).map(c => (
              <div key={c.id} className="grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr] items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted/30 transition-colors text-[12px]">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", customerTypeCls[c.customerType].dot)} />
                  <span className="font-semibold text-foreground">{c.customer}</span>
                </div>
                <span className="font-mono text-foreground/70">{fmt(c.avgOrderSize)}</span>
                <span className={cn("font-mono font-semibold", c.inefficiencyPct > 15 ? "text-destructive" : c.inefficiencyPct > 8 ? "text-yellow-500" : "text-accent")}>{c.inefficiencyPct}%</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 rounded-full bg-border/30 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.orderFragmentation * 100}%`, backgroundColor: c.orderFragmentation > 0.5 ? "hsl(0, 65%, 50%)" : c.orderFragmentation > 0.2 ? "hsl(45, 85%, 50%)" : "hsl(155, 55%, 42%)" }} />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/50">{c.orderFragmentation.toFixed(2)}</span>
                </div>
                <span className={cn("font-mono font-semibold", c.productionPressure >= 7 ? "text-destructive" : c.productionPressure >= 4 ? "text-yellow-500" : "text-accent")}>{c.productionPressure.toFixed(1)}</span>
                <span className={cn("font-mono", c.forecastAccuracy >= 90 ? "text-accent" : c.forecastAccuracy >= 80 ? "text-yellow-500" : "text-destructive")}>{c.forecastAccuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ SECTION 3: CUSTOMER MARGIN PERFORMANCE ═══ */}
      <Section title="Klant Marge Prestatie" icon={TrendingDown} badge={`${customerRows.filter(c => c.marginGap < 0).length} onder target`}>
        <div className="overflow-x-auto">
          <div className="hidden md:grid grid-cols-[1.2fr_0.6fr_0.6fr_0.5fr_0.5fr_0.5fr_0.5fr] text-[10px] text-muted-foreground/40 font-mono pb-1.5 border-b border-border/30 px-2 gap-2 min-w-[800px]">
            <span>Klant</span><span>Omzet</span><span>Marge €</span><span>Marge %</span><span>Target %</span><span>Gap</span><span>Volume</span>
          </div>
          <div className="space-y-0.5 mt-1 min-w-[800px]">
            {[...customerRows].sort((a, b) => a.marginGap - b.marginGap).map(c => {
              const typeCls = customerTypeCls[c.customerType];
              return (
                <div key={c.id} className={cn("grid grid-cols-[1.2fr_0.6fr_0.6fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted/30 transition-colors text-[12px]", c.marginGap <= -3 && "bg-destructive/5")}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", typeCls.dot)} />
                    <div>
                      <span className="font-semibold text-foreground">{c.customer}</span>
                      <span className={cn("text-[9px] font-mono ml-2 px-1.5 py-0.5 rounded-full border", typeCls.bg, typeCls.text)}>{typeCls.label}</span>
                    </div>
                  </div>
                  <span className="font-mono text-foreground/70">{fmtEur(c.totalRevenue)}</span>
                  <span className="font-mono text-foreground/70">{fmtEur(c.marginEur)}</span>
                  <span className={cn("font-mono font-semibold", c.marginPct >= c.targetMarginPct ? "text-accent" : "text-destructive")}>{c.marginPct}%</span>
                  <span className="font-mono text-muted-foreground/50">{c.targetMarginPct}%</span>
                  <span className={cn("font-mono font-semibold", c.marginGap >= 0 ? "text-accent" : "text-destructive")}>{c.marginGap > 0 ? "+" : ""}{c.marginGap}pp</span>
                  <span className="font-mono text-foreground/60">{fmt(c.productionVolume)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══ SECTION 4: CUSTOMER PROGRAM ANALYSIS ═══ */}
      <Section title="Klant Programma Analyse" icon={Briefcase}>
        <div className="space-y-2">
          {customerRows.map(c => (
            <Collapsible key={c.id} open={expandedCustomer === c.id} onOpenChange={() => setExpandedCustomer(prev => prev === c.id ? null : c.id)}>
              <CollapsibleTrigger asChild>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                  expandedCustomer === c.id ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30 border border-transparent",
                )}>
                  {expandedCustomer === c.id ? <ChevronDown className="w-3 h-3 text-muted-foreground/40" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
                  <div className={cn("w-2 h-2 rounded-full", customerTypeCls[c.customerType].dot)} />
                  <span className="text-[12px] font-semibold text-foreground">{c.customer}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/40">{c.programs.length} programma's</span>
                  <span className="text-[10px] font-mono text-muted-foreground/40 ml-auto">{fmtEur(c.totalRevenue)}</span>
                  <span className={cn("text-[10px] font-mono font-semibold", c.marginPct >= c.targetMarginPct ? "text-accent" : "text-destructive")}>{c.marginPct}%</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-8 mt-1 mb-2 space-y-1">
                  {c.programs.map(p => (
                    <div key={p.id} className="grid grid-cols-[1.2fr_0.6fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border/30 text-[11px]">
                      <div>
                        <span className="font-semibold text-foreground">{p.programName}</span>
                        <span className="text-[9px] font-mono text-muted-foreground/40 ml-2">{p.productFamily}</span>
                      </div>
                      <span className="font-mono text-foreground/70">{fmtEur(p.revenue)}</span>
                      <span className={cn("font-mono font-semibold", p.marginPct >= 18 ? "text-accent" : p.marginPct >= 14 ? "text-yellow-500" : "text-destructive")}>{p.marginPct}%</span>
                      <span className="font-mono text-muted-foreground/50">{p.durationWeeks} wkn</span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full bg-border/30 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.stabilityIndex * 100}%`, backgroundColor: stabilityColor(p.stabilityIndex) }} />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground/50">{p.stabilityIndex.toFixed(2)}</span>
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: stabilityColor(p.stabilityIndex) }}>{stabilityLabel(p.stabilityIndex)}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </Section>

      {/* ═══ SECTION 6: CUSTOMER SEASONALITY MAP ═══ */}
      <Section title="Klant Seizoenskaart" icon={Calendar}>
        <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
          <div className="min-w-[800px]">
            {/* Week header */}
            <div className="flex items-center gap-0 mb-1">
              <div className="w-32 shrink-0" />
              <div className="flex-1 flex">
                {Array.from({ length: 52 }, (_, i) => (
                  <div key={i} className="flex-1 text-center">
                    {(i + 1) % 4 === 0 && <span className="text-[8px] font-mono text-muted-foreground/30">{i + 1}</span>}
                  </div>
                ))}
              </div>
            </div>
            {/* Rows */}
            {customerSeasonData.map(row => (
              <div key={row.customer} className="flex items-center gap-0 mb-0.5">
                <div className="w-32 shrink-0 text-[10px] font-medium text-foreground/70 truncate pr-2">{row.customer}</div>
                <div className="flex-1 flex h-5 rounded-sm overflow-hidden">
                  {row.weeks.map(cell => {
                    const intensity = cell.volume / 100;
                    const hue = intensity > 0.7 ? 0 : intensity > 0.4 ? 45 : 155;
                    const sat = intensity > 0.3 ? 55 + intensity * 30 : 10;
                    const light = 95 - intensity * 50;
                    return (
                      <div
                        key={cell.week}
                        className="flex-1 border-r border-background/20"
                        style={{ backgroundColor: `hsl(${hue}, ${sat}%, ${light}%)` }}
                        title={`${row.customer} — Wk ${cell.week}: ${cell.volume}%`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-3 mt-3 justify-end">
              <span className="text-[9px] font-mono text-muted-foreground/40">Vraag intensiteit:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(155, 20%, 90%)" }} />
                <span className="text-[9px] text-muted-foreground/40">Laag</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(45, 65%, 65%)" }} />
                <span className="text-[9px] text-muted-foreground/40">Midden</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(0, 70%, 55%)" }} />
                <span className="text-[9px] text-muted-foreground/40">Piek</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ SECTION 7: CUSTOMER ALERTS ═══ */}
      <Section title="Klant Alerts" icon={ShieldAlert} badge={`${customerAlerts.filter(a => a.severity === "critical").length} kritiek`}>
        <div className="space-y-2">
          {customerAlerts.map(a => {
            const AIcon = alertIcon[a.severity];
            const iconColor = a.severity === "critical" ? "text-destructive" : a.severity === "warning" ? "text-yellow-500" : "text-accent";
            return (
              <div key={a.id} className={cn("flex items-start gap-3 p-3 rounded-xl border", alertCls[a.severity])}>
                <AIcon className={cn("w-4 h-4 shrink-0 mt-0.5", iconColor)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-foreground">{a.title}</span>
                    {a.customer && <span className="text-[9px] font-mono text-muted-foreground/50 border border-border/50 px-1.5 rounded">{a.customer}</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5 leading-relaxed">{a.description}</p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">{a.time}</span>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
};

export default CustomerIntelligence;
