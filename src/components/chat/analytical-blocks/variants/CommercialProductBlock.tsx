/**
 * Commercial Product Analysis Block
 * 
 * Full cockpit-style dashboard for product-level commercial + operational analysis.
 * Reads input fields, computes derived KPIs, and renders a management-grade overview.
 */

import { useState } from "react";
import {
  TrendingUp, TrendingDown, Minus, BarChart3, Settings2,
  AlertTriangle, CheckCircle2, Target, Euro, Package,
  ArrowRight, Lightbulb, FileText, ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */

interface CommercialProductInput {
  product_name: string;
  period: string;
  target_margin_pct: number;
  actual_margin_pct: number;
  w_apu: number;
  o_apu: number;
  total_revenue: number;
  quantity: number;
  avg_selling_price: number;
}

interface DerivedMetrics {
  margin_diff_pp: number;
  target_margin_eur: number;
  actual_margin_eur: number;
  margin_diff_eur: number;
  apu_diff: number;
  labor_per_unit: number | null;
  commercial_status: "strong" | "moderate" | "weak";
  operational_status: "strong" | "moderate" | "weak";
}

/* ── Compute engine ── */

function computeMetrics(input: CommercialProductInput): DerivedMetrics {
  const margin_diff_pp = input.actual_margin_pct - input.target_margin_pct;
  const target_margin_eur = input.total_revenue * (input.target_margin_pct / 100);
  const actual_margin_eur = input.total_revenue * (input.actual_margin_pct / 100);
  const margin_diff_eur = actual_margin_eur - target_margin_eur;
  const apu_diff = input.w_apu - input.o_apu;
  const labor_per_unit = input.o_apu > 0 && input.quantity > 0
    ? Math.round((input.quantity / input.o_apu) * 100) / 100
    : null;

  const commercial_status: DerivedMetrics["commercial_status"] =
    margin_diff_pp >= 0 ? "strong" : margin_diff_pp >= -2 ? "moderate" : "weak";
  const operational_status: DerivedMetrics["operational_status"] =
    apu_diff >= 0 ? "strong" : apu_diff >= -5 ? "moderate" : "weak";

  return { margin_diff_pp, target_margin_eur, actual_margin_eur, margin_diff_eur, apu_diff, labor_per_unit, commercial_status, operational_status };
}

/* ── Color helpers ── */

const statusColor = (status: "strong" | "moderate" | "weak") =>
  status === "strong" ? "text-emerald-500" : status === "moderate" ? "text-amber-500" : "text-red-500";

const statusBg = (status: "strong" | "moderate" | "weak") =>
  status === "strong" ? "bg-emerald-500/10 border-emerald-500/20" : status === "moderate" ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20";

const deviationColor = (val: number) =>
  val > 0 ? "text-emerald-500" : val === 0 ? "text-muted-foreground" : val >= -2 ? "text-amber-500" : "text-red-500";

const deviationBg = (val: number) =>
  val > 0 ? "bg-emerald-500/8 border-emerald-500/20" : val === 0 ? "bg-muted/20 border-border" : val >= -2 ? "bg-amber-500/8 border-amber-500/20" : "bg-red-500/8 border-red-500/20";

const TrendIcon = ({ val, className }: { val: number; className?: string }) =>
  val > 0 ? <TrendingUp className={cn("w-3.5 h-3.5", className)} /> :
  val < 0 ? <TrendingDown className={cn("w-3.5 h-3.5", className)} /> :
  <Minus className={cn("w-3.5 h-3.5", className)} />;

const fmtEur = (v: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
const fmtNum = (v: number) => new Intl.NumberFormat("nl-NL").format(v);
const fmtPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;

/* ── Summary generator ── */

function generateSummary(input: CommercialProductInput, m: DerivedMetrics): string {
  const parts: string[] = [];

  if (m.commercial_status === "strong") {
    parts.push(`De omzet van ${fmtEur(input.total_revenue)} en behaalde marge van ${input.actual_margin_pct.toFixed(1)}% liggen boven target.`);
  } else if (m.commercial_status === "moderate") {
    parts.push(`De behaalde marge van ${input.actual_margin_pct.toFixed(1)}% ligt net onder de target van ${input.target_margin_pct.toFixed(1)}%, wat resulteert in ${fmtEur(Math.abs(m.margin_diff_eur))} minder marge dan gepland.`);
  } else {
    parts.push(`De behaalde marge van ${input.actual_margin_pct.toFixed(1)}% wijkt significant af van de target (${input.target_margin_pct.toFixed(1)}%). Dit kost ${fmtEur(Math.abs(m.margin_diff_eur))} aan margeverlies.`);
  }

  if (m.operational_status === "strong") {
    parts.push(`Operationeel presteert het product goed: de W-APU (${input.w_apu}) ligt op of boven de O-APU (${input.o_apu}).`);
  } else if (m.operational_status === "moderate") {
    parts.push(`Daarnaast ligt de W-APU (${input.w_apu}) licht onder de O-APU (${input.o_apu}), wat wijst op lichte operationele druk.`);
  } else {
    parts.push(`De W-APU (${input.w_apu}) ligt duidelijk onder de O-APU (${input.o_apu}), wat wijst op structurele operationele inefficiëntie.`);
  }

  if (m.commercial_status === "weak" && m.operational_status === "weak") {
    parts.push("Hierdoor gaat resultaat verloren op zowel marge als efficiency. Directe actie is noodzakelijk.");
  } else if (m.commercial_status !== "strong" || m.operational_status !== "strong") {
    parts.push("Bijsturing verdient aandacht om verdere erosie te voorkomen.");
  } else {
    parts.push("Het product presteert op alle fronten binnen of boven target.");
  }

  return parts.join(" ");
}

/* ── Advice generator ── */

function generateAdvice(input: CommercialProductInput, m: DerivedMetrics): { text: string; urgency: "high" | "medium" | "low" }[] {
  const advice: { text: string; urgency: "high" | "medium" | "low" }[] = [];

  if (m.margin_diff_pp < -3) advice.push({ text: "Verkoopprijs verhogen of kostprijs herijken", urgency: "high" });
  else if (m.margin_diff_pp < 0) advice.push({ text: "Marge actief bewaken en prijsstrategie evalueren", urgency: "medium" });

  if (m.apu_diff < -5) advice.push({ text: "Productie-efficiency structureel verbeteren", urgency: "high" });
  else if (m.apu_diff < 0) advice.push({ text: "Operationele performance monitoren", urgency: "medium" });

  if (m.commercial_status === "strong" && m.operational_status === "strong") {
    advice.push({ text: "Product opschalen: prestaties zijn sterk op alle fronten", urgency: "low" });
  }

  if (m.margin_diff_eur < -5000) advice.push({ text: "Product herijken: significante euro-impact op resultaat", urgency: "high" });

  if (input.avg_selling_price < (input.total_revenue / input.quantity) * 0.9) {
    advice.push({ text: "Gemiddelde verkoopprijs onder druk — volume vs. prijs evalueren", urgency: "medium" });
  }

  if (advice.length === 0) advice.push({ text: "Huidige koers vasthouden en performance blijven monitoren", urgency: "low" });

  return advice;
}

/* ── Operational interpretation ── */

function getOperationalLabel(m: DerivedMetrics): string {
  if (m.operational_status === "strong") return "Operationeel beter dan verwacht";
  if (m.apu_diff >= -2) return "Lichte druk op efficiency";
  if (m.apu_diff >= -5) return "Operationeel onder norm";
  return "Duidelijke operationele afwijking";
}

/* ── Demo data ── */

const DEMO_DATA: CommercialProductInput = {
  product_name: "Royal Sunset Mix — Handgebonden",
  period: "Week 11 · 2026",
  target_margin_pct: 32,
  actual_margin_pct: 27.4,
  w_apu: 118,
  o_apu: 125,
  total_revenue: 84500,
  quantity: 3200,
  avg_selling_price: 26.41,
};

/* ── Main Component ── */

export const CommercialProductBlock = () => {
  const [expanded, setExpanded] = useState(true);
  const input = DEMO_DATA;
  const m = computeMetrics(input);
  const summary = generateSummary(input, m);
  const advice = generateAdvice(input, m);
  const opLabel = getOperationalLabel(m);

  const overallStatus = m.commercial_status === "weak" || m.operational_status === "weak"
    ? "weak" : m.commercial_status === "moderate" || m.operational_status === "moderate"
    ? "moderate" : "strong";

  return (
    <div className="w-full max-w-4xl rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* ── 1. Header / Context block ── */}
      <div className="px-5 py-4 border-b border-border bg-gradient-to-r from-card to-muted/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-primary shrink-0" />
              <h2 className="text-sm font-bold text-foreground truncate">{input.product_name}</h2>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
              <span className="px-2 py-0.5 rounded bg-muted/50 border border-border">{input.period}</span>
            </div>
          </div>
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider shrink-0", statusBg(overallStatus), statusColor(overallStatus))}>
            {overallStatus === "strong" ? <CheckCircle2 className="w-3 h-3" /> : overallStatus === "moderate" ? <AlertTriangle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {overallStatus === "strong" ? "Op Target" : overallStatus === "moderate" ? "Aandacht" : "Actie Vereist"}
          </div>
        </div>

        {/* Context KPIs */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          {[
            { label: "Totale omzet", value: fmtEur(input.total_revenue), icon: Euro },
            { label: "Aantal stuks", value: fmtNum(input.quantity), icon: Package },
            { label: "Gem. verkoopprijs", value: fmtEur(input.avg_selling_price), icon: Target },
          ].map((kpi) => (
            <div key={kpi.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/60 border border-border/50">
              <kpi.icon className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
              <div className="min-w-0">
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">{kpi.label}</div>
                <div className="text-xs font-bold text-foreground">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle */}
      <button onClick={() => setExpanded(!expanded)} className="w-full px-5 py-2 flex items-center justify-between text-[10px] text-muted-foreground hover:bg-muted/20 transition-colors border-b border-border/50">
        <span className="font-medium uppercase tracking-wider">Analyse Details</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="px-5 py-4 space-y-5">
          {/* ── 2. Commercial Performance ── */}
          <section>
            <SectionTitle icon={Euro} label="Commerciële Prestaties" />
            <div className="grid grid-cols-3 gap-2.5 mt-3">
              <KPICard label="Gewenste marge" value={`${input.target_margin_pct.toFixed(1)}%`} sub={fmtEur(m.target_margin_eur)} variant="neutral" />
              <KPICard label="Behaalde marge" value={`${input.actual_margin_pct.toFixed(1)}%`} sub={fmtEur(m.actual_margin_eur)} variant={m.commercial_status} />
              <KPICard
                label="Verschil marge"
                value={fmtPct(m.margin_diff_pp)}
                sub={`${m.margin_diff_eur >= 0 ? "+" : ""}${fmtEur(m.margin_diff_eur)}`}
                variant={m.commercial_status}
                highlight
              />
            </div>

            {/* Margin bar */}
            <div className="mt-3 rounded-lg border border-border/50 bg-muted/10 p-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                <span>Target: {input.target_margin_pct.toFixed(1)}%</span>
                <span>Behaald: {input.actual_margin_pct.toFixed(1)}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground/15" style={{ width: `${Math.min(input.target_margin_pct, 100)}%` }} />
                <div className={cn("absolute inset-y-0 left-0 rounded-full transition-all", m.commercial_status === "strong" ? "bg-emerald-500/70" : m.commercial_status === "moderate" ? "bg-amber-500/70" : "bg-red-500/70")}
                  style={{ width: `${Math.min(input.actual_margin_pct, 100)}%` }} />
              </div>
              <div className="flex items-center gap-2 mt-2 text-[10px]">
                <TrendIcon val={m.margin_diff_eur} className={deviationColor(m.margin_diff_pp)} />
                <span className={cn("font-bold", deviationColor(m.margin_diff_pp))}>
                  {m.margin_diff_eur >= 0 ? "+" : ""}{fmtEur(m.margin_diff_eur)} euro-impact
                </span>
              </div>
            </div>
          </section>

          {/* ── 3. Operational Performance ── */}
          <section>
            <SectionTitle icon={Settings2} label="Operationele Prestaties" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
              <KPICard label="W-APU" value={String(input.w_apu)} variant={m.operational_status} />
              <KPICard label="O-APU" value={String(input.o_apu)} variant="neutral" />
              <KPICard label="Verschil APU" value={`${m.apu_diff >= 0 ? "+" : ""}${m.apu_diff}`} variant={m.operational_status} highlight />
              {m.labor_per_unit !== null && <KPICard label="Arbeid / stuk" value={String(m.labor_per_unit)} variant="neutral" />}
            </div>
            <div className={cn("mt-3 flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] font-medium", statusBg(m.operational_status), statusColor(m.operational_status))}>
              <TrendIcon val={m.apu_diff} className={statusColor(m.operational_status)} />
              {opLabel}
            </div>
          </section>

          {/* ── 4. Executive summary ── */}
          <section>
            <SectionTitle icon={FileText} label="Commerciële Duiding" />
            <div className="mt-3 p-3.5 rounded-lg border border-border/50 bg-muted/10">
              <p className="text-[11px] leading-relaxed text-foreground/90">{summary}</p>
            </div>
          </section>

          {/* ── 5. Advice ── */}
          <section>
            <SectionTitle icon={Lightbulb} label="Conclusie & Advies" />
            <div className="mt-3 space-y-1.5">
              {advice.map((a, i) => (
                <div key={i} className={cn(
                  "flex items-start gap-2.5 px-3 py-2 rounded-lg border text-[11px]",
                  a.urgency === "high" ? "bg-red-500/5 border-red-500/20" : a.urgency === "medium" ? "bg-amber-500/5 border-amber-500/20" : "bg-emerald-500/5 border-emerald-500/20"
                )}>
                  <ArrowRight className={cn(
                    "w-3 h-3 mt-0.5 shrink-0",
                    a.urgency === "high" ? "text-red-500" : a.urgency === "medium" ? "text-amber-500" : "text-emerald-500"
                  )} />
                  <span className="text-foreground/90 font-medium">{a.text}</span>
                  <span className={cn(
                    "ml-auto shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                    a.urgency === "high" ? "bg-red-500/10 text-red-500" : a.urgency === "medium" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                  )}>
                    {a.urgency === "high" ? "Urgent" : a.urgency === "medium" ? "Bewaken" : "OK"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

/* ── Sub-components ── */

const SectionTitle = ({ icon: Icon, label }: { icon: typeof Euro; label: string }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-3.5 h-3.5 text-muted-foreground/50" />
    <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</h3>
  </div>
);

const KPICard = ({ label, value, sub, variant, highlight }: {
  label: string;
  value: string;
  sub?: string;
  variant: "strong" | "moderate" | "weak" | "neutral";
  highlight?: boolean;
}) => {
  const isDeviation = variant !== "neutral";
  return (
    <div className={cn(
      "rounded-lg border p-3 transition-all",
      highlight && isDeviation ? deviationBg(variant === "strong" ? 1 : variant === "moderate" ? -1 : -5) : "bg-card border-border/50",
      highlight && "ring-1 ring-inset",
      highlight && variant === "strong" ? "ring-emerald-500/20" : highlight && variant === "moderate" ? "ring-amber-500/20" : highlight && variant === "weak" ? "ring-red-500/20" : "ring-transparent"
    )}>
      <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium mb-1">{label}</div>
      <div className={cn(
        "text-base font-bold tabular-nums",
        isDeviation ? statusColor(variant as "strong" | "moderate" | "weak") : "text-foreground"
      )}>
        {value}
      </div>
      {sub && (
        <div className={cn(
          "text-[10px] font-medium mt-0.5 tabular-nums",
          isDeviation ? statusColor(variant as "strong" | "moderate" | "weak") + " opacity-70" : "text-muted-foreground"
        )}>
          {sub}
        </div>
      )}
    </div>
  );
};

export default CommercialProductBlock;
