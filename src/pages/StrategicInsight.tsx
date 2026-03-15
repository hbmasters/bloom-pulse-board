import { TrendingUp, TrendingDown, Minus, BarChart3, Globe, CalendarClock, Lightbulb, ShieldAlert, MessageCircle, ArrowRight, ChevronRight } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import {
  strategicKPIs, salesTrends, marketSignals, forecastShifts,
  strategicOpportunities, strategicRisks, managementTopics,
  signalStyles, directionLabels, marketSignalLabels, forecastTypeLabels,
  confidenceLabels, severityLabels, opportunityTypeLabels, riskTypeLabels,
  topicCategoryLabels,
  type SignalLevel,
} from "@/components/strategic-insight/strategic-insight-data";

/* ── tiny helpers ── */
const DirIcon = ({ dir }: { dir?: "up" | "down" | "stable" }) =>
  dir === "up" ? <TrendingUp className="w-3.5 h-3.5" /> : dir === "down" ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />;

const SignalBadge = ({ signal, label }: { signal: string; label?: string }) => {
  const s = signalStyles[signal as SignalLevel] ?? signalStyles.watch;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.bg} ${s.text} ${s.border}`}>{label ?? s.label}</span>;
};

const SmallBadge = ({ label, bg, text, border }: { label: string; bg: string; text: string; border: string }) => (
  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${bg} ${text} ${border}`}>{label}</span>
);

/* ══════════════════════════════════════════ */

const StrategicInsight = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* Page header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-extrabold text-foreground tracking-tight">Strategic & Market Insight</h1>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">LABS BETA</span>
          </div>
          <p className="text-xs text-muted-foreground">Strategisch inzicht voor management — trends, risico's, kansen en gespreksvoorbereiding.</p>
        </div>

        {/* SECTION 1 — Strategic KPI header */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {strategicKPIs.map(kpi => {
            const s = signalStyles[kpi.signal];
            return (
              <div key={kpi.id} className={`p-3 rounded-xl border ${s.bg} ${s.border} transition-all hover:shadow-md`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.text.replace("text-", "bg-")}`} />
                  <span className="text-[10px] font-medium text-foreground/60 truncate">{kpi.label}</span>
                </div>
                <div className="text-base font-extrabold text-foreground leading-none">{kpi.value}</div>
                {kpi.change && (
                  <div className={`flex items-center gap-0.5 mt-1 ${s.text}`}>
                    <DirIcon dir={kpi.changeDir} />
                    <span className="text-[10px] font-semibold">{kpi.change}</span>
                  </div>
                )}
                {kpi.detail && <div className="text-[9px] text-muted-foreground mt-1">{kpi.detail}</div>}
              </div>
            );
          })}
        </div>

        {/* SECTION 2 — Sales Trends */}
        <IHSectionShell icon={BarChart3} title="Omzettrends" subtitle="Groei, daling en verschuivingen in sales">
          <div className="grid gap-2">
            {salesTrends.map(t => {
              const d = directionLabels[t.direction];
              return (
                <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">{t.name}</span>
                      <span className="text-[9px] font-mono text-muted-foreground">{t.category}</span>
                    </div>
                    {t.detail && <p className="text-[10px] text-muted-foreground mt-0.5">{t.detail}</p>}
                  </div>
                  <span className={`text-sm font-bold ${d.color}`}>{t.change}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-muted ${d.color} border-border`}>{d.label}</span>
                </div>
              );
            })}
          </div>
        </IHSectionShell>

        {/* SECTION 3 — Market Intelligence */}
        <IHSectionShell icon={Globe} title="Marktintelligentie" subtitle="Prijstrends, aanboddruk en volatiliteit">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {marketSignals.map(m => {
              const s = marketSignalLabels[m.signal];
              return (
                <div key={m.id} className={`p-3 rounded-xl border ${s.bg} ${s.border} hover:shadow-md transition-all`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-foreground">{m.category}</span>
                    <SmallBadge {...s} />
                  </div>
                  {m.product && <div className="text-[10px] font-mono text-muted-foreground mb-1">{m.product}</div>}
                  <div className={`text-base font-extrabold ${s.text}`}>{m.value}</div>
                  {m.detail && <p className="text-[10px] text-muted-foreground mt-1">{m.detail}</p>}
                </div>
              );
            })}
          </div>
        </IHSectionShell>

        {/* SECTION 4 — Forecast / Demand Shifts */}
        <IHSectionShell icon={CalendarClock} title="Forecast & Vraagverschuivingen" subtitle="Pieken, vertragingen en drukperiodes vooruit">
          <div className="grid gap-2">
            {forecastShifts.map(f => {
              const s = forecastTypeLabels[f.type];
              return (
                <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                  <div className="w-20 shrink-0">
                    <span className="text-xs font-bold text-foreground">{f.period}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{f.product_group}</span>
                      <SmallBadge {...s} />
                    </div>
                    {f.detail && <p className="text-[10px] text-muted-foreground mt-0.5">{f.detail}</p>}
                  </div>
                  <span className={`text-sm font-bold ${s.text}`}>{f.magnitude}</span>
                </div>
              );
            })}
          </div>
        </IHSectionShell>

        {/* SECTION 5 — Strategic Opportunities */}
        <IHSectionShell icon={Lightbulb} title="Strategische Kansen" subtitle="Jaarrond kandidaten, standaardisatie en groei" badge={`${strategicOpportunities.length} kansen`} badgeVariant="success">
          <div className="grid gap-3">
            {strategicOpportunities.map(o => {
              const conf = confidenceLabels[o.confidence];
              return (
                <div key={o.id} className="p-3.5 rounded-xl bg-accent/5 border border-accent/15 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{o.title}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">{opportunityTypeLabels[o.type]}</span>
                    </div>
                    <span className={`text-[10px] font-semibold ${conf.color} whitespace-nowrap`}>Vertrouwen: {conf.label}</span>
                  </div>
                  <p className="text-[11px] text-foreground/70 mb-2">{o.reason}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-accent font-medium">
                    <ArrowRight className="w-3 h-3" />
                    <span>{o.next_step}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </IHSectionShell>

        {/* SECTION 6 — Strategic Risks */}
        <IHSectionShell icon={ShieldAlert} title="Strategische Risico's" subtitle="Margedruk, leveranciersrisico en instabiliteit" badge={`${strategicRisks.filter(r => r.severity === "high").length} hoog`} badgeVariant="critical">
          <div className="grid gap-3">
            {strategicRisks.map(r => {
              const sev = severityLabels[r.severity];
              return (
                <div key={r.id} className={`p-3.5 rounded-xl border ${sev.bg} ${sev.border} hover:shadow-md transition-all`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{r.title}</span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${sev.bg} ${sev.text} border ${sev.border}`}>{riskTypeLabels[r.type]}</span>
                    </div>
                    <SmallBadge label={sev.label} bg={sev.bg} text={sev.text} border={sev.border} />
                  </div>
                  <p className="text-[11px] text-foreground/70">{r.detail}</p>
                </div>
              );
            })}
          </div>
        </IHSectionShell>

        {/* SECTION 7 — Management conversation block */}
        <IHSectionShell icon={MessageCircle} title="Management Gespreksvoorbereiding" subtitle="Onderwerpen, vragen en aandachtspunten voor deze week">
          <div className="grid gap-2">
            {managementTopics.map(t => {
              const cat = topicCategoryLabels[t.category];
              return (
                <div key={t.id} className="flex items-start gap-3 px-3 py-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors group cursor-pointer">
                  <SmallBadge {...cat} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">{t.question}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.context}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-0.5" />
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg border border-dashed border-primary/30 bg-primary/5">
            <p className="text-[11px] text-primary font-medium">🧠 Toekomstig: AI sparring partner — stel vragen, krijg analyses, bereid beslissingen voor.</p>
          </div>
        </IHSectionShell>

      </div>
    </div>
  );
};

export default StrategicInsight;
