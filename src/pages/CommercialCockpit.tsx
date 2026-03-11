import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DollarSign, TrendingUp, TrendingDown, Minus, AlertTriangle,
  ChevronDown, ChevronRight, Filter, Zap, BarChart3,
  XCircle, Star, ShieldAlert, Percent, Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MCHologramBackground } from "@/components/mission-control/MCHologramBackground";
import ProductLineIntelligence from "@/components/commercial/ProductLineIntelligence";
import {
  summaryMetrics, commercialRows, alerts,
  fmt, fmtEur, marginStatusCls, marginStatusLabel, riskCls,
  type MarginStatus, type AlertSeverity,
} from "@/components/commercial/commercial-data";

/* ── Section wrapper ── */
const Section = ({ title, icon: Icon, children, badge }: { title: string; icon: typeof DollarSign; children: React.ReactNode; badge?: string }) => (
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

/* ── Metric Card ── */
const MetricCard = ({ label, value, unit, icon: Icon, status, change, changeDir, target, sub }: {
  label: string; value: string; unit?: string; icon: typeof DollarSign;
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

/* ── Margin Bar ── */
const MarginBar = ({ actual, target }: { actual: number; target: number }) => {
  const max = Math.max(actual, target, 25);
  const actualW = (actual / max) * 100;
  const targetPos = (target / max) * 100;
  const color = actual >= target ? "bg-accent/60" : actual >= target * 0.9 ? "bg-yellow-500/60" : "bg-destructive/60";
  return (
    <div className="relative h-2 rounded-full bg-border/30 overflow-visible">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${actualW}%` }} />
      <div className="absolute top-0 h-full w-px bg-foreground/30" style={{ left: `${targetPos}%` }} />
    </div>
  );
};

/* ── Alert helpers ── */
const alertIcon: Record<AlertSeverity, typeof AlertTriangle> = { critical: XCircle, warning: AlertTriangle, info: Star };
const alertCls: Record<AlertSeverity, string> = {
  critical: "border-destructive/30 bg-destructive/5",
  warning: "border-yellow-500/30 bg-yellow-500/5",
  info: "border-accent/30 bg-accent/5",
};

/* ══════════════════════════════════════════════════ */
/*  COMMERCIAL COCKPIT                               */
/* ══════════════════════════════════════════════════ */
const CommercialCockpit = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterCustomer, setFilterCustomer] = useState("all");
  const [filterFamily, setFilterFamily] = useState("all");
  const [filterOwner, setFilterOwner] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  const customers = [...new Set(commercialRows.map(r => r.customer))];
  const families = [...new Set(commercialRows.map(r => r.family))];
  const owners = [...new Set(commercialRows.map(r => r.owner))];

  const filtered = commercialRows.filter(r => {
    if (filterCustomer !== "all" && r.customer !== filterCustomer) return false;
    if (filterFamily !== "all" && r.family !== filterFamily) return false;
    if (filterOwner !== "all" && r.owner !== filterOwner) return false;
    return true;
  });

  const totalTurnover = commercialRows.reduce((s, r) => s + r.turnover, 0);
  const totalMargin = commercialRows.reduce((s, r) => s + r.marginEur, 0);
  const avgMarginPct = totalTurnover > 0 ? ((totalMargin / totalTurnover) * 100).toFixed(1) : "0";

  const risks = alerts.filter(a => a.type === "risk");
  const opportunities = alerts.filter(a => a.type === "opportunity");

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
                <h1 className="text-sm font-black text-foreground uppercase tracking-wider">Commercial Cockpit</h1>
                <p className="text-[10px] font-mono text-muted-foreground">Revenue • Marge • Product Line Intelligence • Seizoensinzicht</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono gap-1 border-accent/30 text-accent">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              LIVE
            </Badge>
          </div>

          {/* ═══ SECTION 1: REVENUE & MARGIN KPIs ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {summaryMetrics.map(m => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* ── Marge & Omzet Overzicht ── */}
          <Section title="Marge & Omzet Overzicht" icon={BarChart3}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-xl border border-accent/20 bg-accent/5">
                <div className="text-[10px] text-foreground/50 mb-1">Totale omzet</div>
                <div className="text-lg font-extrabold text-foreground">{fmtEur(totalTurnover)}</div>
              </div>
              <div className="p-3 rounded-xl border border-accent/20 bg-accent/5">
                <div className="text-[10px] text-foreground/50 mb-1">Totale marge</div>
                <div className="text-lg font-extrabold text-foreground">{fmtEur(totalMargin)}</div>
              </div>
              <div className={cn("p-3 rounded-xl border", Number(avgMarginPct) >= 19 ? "border-accent/20 bg-accent/5" : "border-yellow-500/20 bg-yellow-500/5")}>
                <div className="text-[10px] text-foreground/50 mb-1">Gem. marge %</div>
                <div className="text-lg font-extrabold text-foreground">{avgMarginPct}%</div>
                <div className="text-[10px] text-muted-foreground/40">Target: 19%</div>
              </div>
              <div className="p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <div className="text-[10px] text-foreground/50 mb-1">Factuur delta</div>
                <div className="text-lg font-extrabold text-foreground">−€68K</div>
                <div className="text-[10px] text-muted-foreground/40">Verwacht vs gefactureerd</div>
              </div>
            </div>
            {/* Customer margin bars */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-[1.2fr_0.6fr_0.6fr_1fr] text-[10px] text-muted-foreground/40 font-mono pb-1.5 border-b border-border/30 gap-3 px-1">
                <span>Klant</span><span>Omzet</span><span>Marge</span><span>Marge vs target</span>
              </div>
              {[...commercialRows].sort((a, b) => b.turnover - a.turnover).map(r => (
                <div key={r.id} className="grid grid-cols-[1.2fr_0.6fr_0.6fr_1fr] items-center text-[12px] gap-3 px-1 py-1">
                  <div>
                    <span className="font-semibold text-foreground">{r.customer}</span>
                    <span className="text-[10px] text-muted-foreground/40 ml-1.5">{r.family}</span>
                  </div>
                  <span className="font-mono text-foreground/70">{fmtEur(r.turnover)}</span>
                  <span className={cn("font-mono font-semibold", r.marginPct >= r.targetMarginPct ? "text-accent" : r.marginPct >= r.targetMarginPct * 0.9 ? "text-yellow-500" : "text-destructive")}>{r.marginPct}%</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1"><MarginBar actual={r.marginPct} target={r.targetMarginPct} /></div>
                    <span className={cn("text-[10px] font-mono w-10 text-right", r.variancePct >= 0 ? "text-accent" : "text-destructive")}>{r.variancePct > 0 ? "+" : ""}{r.variancePct}pp</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Risks / Opportunities ── */}
          <div className="grid md:grid-cols-2 gap-4">
            <Section title="Commerciële Risico's" icon={ShieldAlert} badge={`${risks.filter(r => r.severity === "critical").length} kritiek`}>
              <div className="space-y-2">
                {risks.map(a => {
                  const AIcon = alertIcon[a.severity];
                  return (
                    <div key={a.id} className={cn("flex items-start gap-3 p-3 rounded-xl border", alertCls[a.severity])}>
                      <AIcon className={cn("w-4 h-4 shrink-0 mt-0.5", a.severity === "critical" ? "text-destructive" : "text-yellow-500")} />
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

            <Section title="Commerciële Kansen" icon={Star}>
              <div className="space-y-2">
                {opportunities.map(a => {
                  const AIcon = alertIcon[a.severity];
                  return (
                    <div key={a.id} className={cn("flex items-start gap-3 p-3 rounded-xl border", alertCls[a.severity])}>
                      <AIcon className={cn("w-4 h-4 shrink-0 mt-0.5 text-accent")} />
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
          </div>

          {/* ═══ SECTIONS 2-7: PRODUCT LINE INTELLIGENCE ═══ */}
          <ProductLineIntelligence />

          {/* ── Commercieel Detail Table ── */}
          <Section title="Commercieel Detail" icon={Briefcase} badge={`${filtered.length} programma's`}>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] font-mono gap-1" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-3 h-3" /> Filter
              </Button>
              {showFilters && (
                <>
                  <Select value={filterCustomer} onValueChange={setFilterCustomer}>
                    <SelectTrigger className="h-7 w-28 text-[10px] font-mono"><SelectValue placeholder="Klant" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle klanten</SelectItem>
                      {customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterFamily} onValueChange={setFilterFamily}>
                    <SelectTrigger className="h-7 w-24 text-[10px] font-mono"><SelectValue placeholder="Familie" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle families</SelectItem>
                      {families.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterOwner} onValueChange={setFilterOwner}>
                    <SelectTrigger className="h-7 w-24 text-[10px] font-mono"><SelectValue placeholder="Owner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle owners</SelectItem>
                      {owners.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>

            <div className="hidden md:grid grid-cols-[1fr_0.8fr_0.6fr_0.5fr_0.5fr_0.5fr_0.4fr_0.5fr_0.4fr_0.5fr] text-[10px] text-muted-foreground/40 font-mono pb-2 border-b border-border/30 gap-2 px-3">
              <span>Klant / Programma</span>
              <span>Productfamilie</span>
              <span>Omzet</span>
              <span>Marge €</span>
              <span>Marge %</span>
              <span>Target %</span>
              <span>Δ €</span>
              <span>Volume</span>
              <span>Risico</span>
              <span>Status</span>
            </div>

            <div className="space-y-1 mt-1">
              {filtered.map(r => {
                const isExp = expanded === r.id;
                const varColor = r.varianceEur >= 0 ? "text-accent" : "text-destructive";

                return (
                  <Collapsible key={r.id} open={isExp} onOpenChange={() => toggle(r.id)}>
                    <CollapsibleTrigger asChild>
                      <div className={cn(
                        "grid grid-cols-1 md:grid-cols-[1fr_0.8fr_0.6fr_0.5fr_0.5fr_0.5fr_0.4fr_0.5fr_0.4fr_0.5fr] items-center text-[12px] py-2.5 px-3 rounded-lg gap-2 cursor-pointer transition-colors",
                        isExp ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/30 border border-transparent",
                        r.status === "critical" && "border-destructive/20 bg-destructive/3",
                      )}>
                        <div className="flex items-center gap-2">
                          {isExp ? <ChevronDown className="w-3 h-3 text-muted-foreground/40 shrink-0" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
                          <div>
                            <div className="font-semibold text-foreground">{r.customer}</div>
                            <div className="text-[10px] text-muted-foreground/40 font-mono">{r.program}</div>
                          </div>
                        </div>
                        <span className="hidden md:block text-[11px] text-foreground/60">{r.family}</span>
                        <span className="hidden md:block text-[11px] font-mono text-foreground/70">{fmtEur(r.turnover)}</span>
                        <span className="hidden md:block text-[11px] font-mono text-foreground/70">{fmtEur(r.marginEur)}</span>
                        <span className={cn("hidden md:block text-[11px] font-mono font-semibold", r.marginPct >= r.targetMarginPct ? "text-accent" : r.marginPct >= r.targetMarginPct * 0.9 ? "text-yellow-500" : "text-destructive")}>{r.marginPct}%</span>
                        <span className="hidden md:block text-[11px] font-mono text-muted-foreground/50">{r.targetMarginPct}%</span>
                        <span className={cn("hidden md:block text-[11px] font-mono font-semibold", varColor)}>{r.varianceEur >= 0 ? "+" : ""}{fmtEur(r.varianceEur)}</span>
                        <span className="hidden md:block text-[11px] font-mono text-foreground/60">{fmt(r.volume)}</span>
                        <span className={cn("hidden md:block text-[11px] font-semibold", riskCls[r.risk])}>{r.risk === "none" ? "—" : r.risk}</span>
                        <div className="hidden md:block">
                          <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full", marginStatusCls[r.status])}>{marginStatusLabel[r.status]}</span>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-5 md:ml-8 p-3 rounded-lg bg-muted/20 border border-border/30 mt-1 mb-2 space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:hidden">
                          <div><span className="text-[10px] text-muted-foreground/40">Omzet</span><div className="text-[11px] font-mono">{fmtEur(r.turnover)}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Marge</span><div className="text-[11px] font-mono">{r.marginPct}%</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Risico</span><div className={cn("text-[11px]", riskCls[r.risk])}>{r.risk}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Status</span><div><span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full", marginStatusCls[r.status])}>{marginStatusLabel[r.status]}</span></div></div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div><span className="text-[10px] text-muted-foreground/40">Account manager</span><div className="text-[11px] font-semibold text-foreground">{r.owner}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Gefactureerd</span><div className="text-[11px] font-mono text-foreground">{fmtEur(r.invoicedTurnover)}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Verwacht</span><div className="text-[11px] font-mono text-foreground">{fmtEur(r.expectedTurnover)}</div></div>
                          <div><span className="text-[10px] text-muted-foreground/40">Factuur Δ</span><div className={cn("text-[11px] font-mono font-semibold", r.invoicedTurnover >= r.expectedTurnover ? "text-accent" : "text-destructive")}>{fmtEur(r.invoicedTurnover - r.expectedTurnover)}</div></div>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground/40">Marge verdeling</span>
                          <div className="mt-1"><MarginBar actual={r.marginPct} target={r.targetMarginPct} /></div>
                          <div className="flex justify-between text-[10px] text-muted-foreground/40 mt-1">
                            <span>Actueel: {r.marginPct}%</span>
                            <span>Target: {r.targetMarginPct}%</span>
                          </div>
                        </div>
                        {r.actions && r.actions.length > 0 && (
                          <div className="flex gap-2 pt-1">
                            {r.actions.map(a => (
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

export default CommercialCockpit;
