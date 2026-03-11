import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, ScatterChart, Scatter, ZAxis
} from "recharts";
import {
  Layers, TrendingDown, FlaskConical, Calendar, AlertTriangle,
  XCircle, Star, Activity, ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  productLines, seasonData, alerts,
  fmtEur, fmt, seasonPhaseCls,
  type ProductLineRow, type CommercialAlert, type AlertSeverity
} from "./commercial-data";

/* ── Section Shell ── */
const Section = ({ title, icon: Icon, children, badge }: { title: string; icon: typeof Layers; children: React.ReactNode; badge?: string }) => (
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

/* ── Alert display helpers ── */
const alertIcon: Record<AlertSeverity, typeof AlertTriangle> = { critical: XCircle, warning: AlertTriangle, info: Star };
const alertCls: Record<AlertSeverity, string> = {
  critical: "border-destructive/30 bg-destructive/5",
  warning: "border-yellow-500/30 bg-yellow-500/5",
  info: "border-accent/30 bg-accent/5",
};

/* ── Stability color ── */
const stabilityColor = (v: number) => v >= 0.8 ? "hsl(155, 55%, 42%)" : v >= 0.6 ? "hsl(45, 85%, 50%)" : "hsl(0, 65%, 50%)";

/* ── Recipe threshold ── */
const RECIPE_THRESHOLD = 0.5;

/* ══════════════════════════════════════════════════ */
/*  PRODUCT LINE INTELLIGENCE SECTIONS               */
/* ══════════════════════════════════════════════════ */

const ProductLineIntelligence = () => {
  const [sortKey, setSortKey] = useState<keyof ProductLineRow>("lineStabilityIndex");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    return [...productLines].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "desc" ? bv - av : av - bv;
      return sortDir === "desc" ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
    });
  }, [sortKey, sortDir]);

  const handleSort = (key: keyof ProductLineRow) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortHeader = ({ label, field, className }: { label: string; field: keyof ProductLineRow; className?: string }) => (
    <button onClick={() => handleSort(field)} className={cn("text-left text-[10px] text-muted-foreground/40 font-mono hover:text-foreground transition-colors", className)}>
      {label} {sortKey === field && (sortDir === "desc" ? "↓" : "↑")}
    </button>
  );

  /* Charts data */
  const stabilityChart = useMemo(() =>
    [...productLines].sort((a, b) => b.lineStabilityIndex - a.lineStabilityIndex).slice(0, 20)
      .map(p => ({ name: p.productFamily, value: p.lineStabilityIndex })),
  []);

  const volatilityChart = useMemo(() =>
    [...productLines].sort((a, b) => a.lineStabilityIndex - b.lineStabilityIndex)
      .map(p => ({
        name: p.productFamily,
        volatility: +(1 - p.lineStabilityIndex).toFixed(2),
        margin: p.avgMargin,
        unstable: p.lineStabilityIndex < 0.6,
      })),
  []);

  const recipeLines = useMemo(() =>
    [...productLines].sort((a, b) => b.recipeVariationIndex - a.recipeVariationIndex),
  []);

  const plAlerts = alerts.filter(a => ["stability", "margin-vol", "recipe", "season"].includes(a.type));

  return (
    <>
      {/* ═══ SECTION 2: PRODUCT LINE TABLE ═══ */}
      <Section title="Product Line Intelligence" icon={Layers} badge={`${productLines.length} lijnen`}>
        <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
          {/* Header */}
          <div className="hidden lg:grid grid-cols-[1.2fr_0.8fr_0.6fr_0.4fr_0.4fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] gap-2 pb-2 border-b border-border/30 px-2 min-w-[900px]">
            <SortHeader label="Product Family" field="productFamily" />
            <SortHeader label="Programma" field="program" />
            <SortHeader label="Type" field="programType" />
            <SortHeader label="Wkn" field="weeksActive" />
            <SortHeader label="Orders" field="totalOrders" />
            <SortHeader label="Omzet" field="revenue" />
            <SortHeader label="Marge %" field="avgMargin" />
            <SortHeader label="Recept Var." field="recipeVariationIndex" />
            <SortHeader label="Stabiliteit" field="lineStabilityIndex" />
            <SortHeader label="Fase" field="seasonPhase" />
          </div>

          {/* Rows */}
          <div className="space-y-0.5 mt-1 min-w-[900px]">
            {sorted.map(p => {
              const phase = seasonPhaseCls[p.seasonPhase];
              return (
                <div key={p.id} className="grid grid-cols-[1.2fr_0.8fr_0.6fr_0.4fr_0.4fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted/30 transition-colors text-[12px]">
                  <span className="font-semibold text-foreground truncate">{p.productFamily}</span>
                  <span className="text-foreground/60 truncate font-mono text-[11px]">{p.program}</span>
                  <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full border w-fit", phase.bg, phase.text)}>{phase.label}</span>
                  <span className="font-mono text-foreground/60">{p.weeksActive}</span>
                  <span className="font-mono text-foreground/60">{fmt(p.totalOrders)}</span>
                  <span className="font-mono text-foreground/70">{fmtEur(p.revenue)}</span>
                  <span className={cn("font-mono font-semibold", p.avgMargin >= 18 ? "text-accent" : p.avgMargin >= 14 ? "text-yellow-500" : "text-destructive")}>{p.avgMargin}%</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-border/30 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.recipeVariationIndex * 100}%`, backgroundColor: p.recipeVariationIndex > RECIPE_THRESHOLD ? "hsl(0, 65%, 50%)" : "hsl(155, 55%, 42%)" }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/50">{p.recipeVariationIndex.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-border/30 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.lineStabilityIndex * 100}%`, backgroundColor: stabilityColor(p.lineStabilityIndex) }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground/50">{p.lineStabilityIndex.toFixed(2)}</span>
                  </div>
                  <span className={cn("text-[10px] font-mono px-2 py-0.5 rounded-full border w-fit", phase.bg, phase.text)}>{phase.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══ SECTION 3: LINE STABILITY ═══ */}
      <Section title="Lijnstabiliteit — Top 20" icon={Activity}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stabilityChart} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} angle={-45} textAnchor="end" interval={0} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 97%)", border: "1px solid hsl(220, 15%, 88%)", borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [v.toFixed(2), "Stabiliteit"]}
              />
              <ReferenceLine y={0.6} stroke="hsl(0, 65%, 50%)" strokeDasharray="4 4" label={{ value: "Min", position: "right", fontSize: 10, fill: "hsl(0, 65%, 50%)" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stabilityChart.map((entry, i) => (
                  <Cell key={i} fill={stabilityColor(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* ═══ SECTION 4: MARGIN VOLATILITY ═══ */}
      <Section title="Marge Volatiliteit" icon={TrendingDown}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volatilityChart} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} angle={-45} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 97%)", border: "1px solid hsl(220, 15%, 88%)", borderRadius: 8, fontSize: 11 }}
                formatter={(v: number, name: string) => [name === "volatility" ? v.toFixed(2) : `${v}%`, name === "volatility" ? "Volatiliteit" : "Marge"]}
              />
              <ReferenceLine y={0.4} stroke="hsl(0, 65%, 50%)" strokeDasharray="4 4" label={{ value: "Hoog risico", position: "right", fontSize: 10, fill: "hsl(0, 65%, 50%)" }} />
              <Bar dataKey="volatility" radius={[4, 4, 0, 0]}>
                {volatilityChart.map((entry, i) => (
                  <Cell key={i} fill={entry.unstable ? "hsl(0, 65%, 50%)" : "hsl(211, 100%, 50%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* ═══ SECTION 5: RECIPE VARIABILITY ═══ */}
      <Section title="Recept Variabiliteit" icon={FlaskConical} badge={`${recipeLines.filter(r => r.recipeVariationIndex > RECIPE_THRESHOLD).length} boven drempel`}>
        <div className="space-y-1.5">
          <div className="grid grid-cols-[1.2fr_1fr_0.4fr] text-[10px] text-muted-foreground/40 font-mono pb-1.5 border-b border-border/30 px-1">
            <span>Product Family</span>
            <span>Recipe Variation Index</span>
            <span>Status</span>
          </div>
          {recipeLines.map(p => {
            const flagged = p.recipeVariationIndex > RECIPE_THRESHOLD;
            return (
              <div key={p.id} className={cn("grid grid-cols-[1.2fr_1fr_0.4fr] items-center px-1 py-1.5 rounded-lg transition-colors", flagged ? "bg-destructive/5" : "hover:bg-muted/20")}>
                <span className="text-[12px] font-semibold text-foreground">{p.productFamily}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-border/30 overflow-hidden max-w-[200px]">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.recipeVariationIndex * 100}%`, backgroundColor: flagged ? "hsl(0, 65%, 50%)" : "hsl(155, 55%, 42%)" }} />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground/60 w-8">{p.recipeVariationIndex.toFixed(2)}</span>
                </div>
                <div>
                  {flagged ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" /> Hoog
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 w-fit">OK</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ SECTION 6: SEASONALITY HEATMAP ═══ */}
      <Section title="Seizoenskaart" icon={Calendar}>
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
            {seasonData.map(row => (
              <div key={row.productFamily} className="flex items-center gap-0 mb-0.5">
                <div className="w-32 shrink-0 text-[10px] font-medium text-foreground/70 truncate pr-2">{row.productFamily}</div>
                <div className="flex-1 flex h-4 rounded-sm overflow-hidden">
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
                        title={`Wk ${cell.week}: ${cell.volume}%`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-3 mt-3 justify-end">
              <span className="text-[9px] font-mono text-muted-foreground/40">Intensiteit:</span>
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

      {/* ═══ SECTION 7: PRODUCT LINE ALERTS ═══ */}
      <Section title="Product Line Alerts" icon={AlertTriangle} badge={`${plAlerts.filter(a => a.severity === "critical").length} kritiek`}>
        <div className="space-y-2">
          {plAlerts.map(a => {
            const AIcon = alertIcon[a.severity];
            const iconColor = a.severity === "critical" ? "text-destructive" : a.severity === "warning" ? "text-yellow-500" : "text-accent";
            return (
              <div key={a.id} className={cn("flex items-start gap-3 p-3 rounded-xl border", alertCls[a.severity])}>
                <AIcon className={cn("w-4 h-4 shrink-0 mt-0.5", iconColor)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-foreground">{a.title}</span>
                    <span className="text-[9px] font-mono text-muted-foreground/50 border border-border/50 px-1.5 rounded">{a.type}</span>
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

export default ProductLineIntelligence;
