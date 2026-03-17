import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown, ChevronRight, Users, Clock, AlertTriangle,
  CheckCircle2, HelpCircle, TrendingDown, Info, ExternalLink,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type LabourTruthItem, type LabourAssessment, assessmentConfig,
} from "./labour-truth-types";
import { labourTruthData } from "./labour-truth-data";

/* ── Assessment Badge ── */
const AssessmentBadge = ({ assessment }: { assessment: LabourAssessment }) => {
  const cfg = assessmentConfig[assessment];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      cfg.bg, cfg.text, cfg.border
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      {cfg.label}
    </span>
  );
};

/* ── Assessment Icon ── */
const AssessmentIcon = ({ assessment }: { assessment: LabourAssessment }) => {
  const icons: Record<LabourAssessment, typeof CheckCircle2> = {
    aligned: CheckCircle2,
    likely_undercharged: TrendingDown,
    likely_overcharged: AlertTriangle,
    needs_review: HelpCircle,
  };
  const Icon = icons[assessment];
  const cfg = assessmentConfig[assessment];
  return <Icon className={cn("w-3.5 h-3.5", cfg.text)} />;
};

/* ── Confidence indicator ── */
const ConfidenceIndicator = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1.5">
    <div className="w-10 h-1 rounded-full bg-muted/30 overflow-hidden">
      <div
        className={cn("h-full rounded-full", value > 0.8 ? "bg-accent" : value > 0.6 ? "bg-yellow-500" : "bg-orange-500")}
        style={{ width: `${value * 100}%` }}
      />
    </div>
    <span className="text-[9px] font-mono text-muted-foreground">{Math.round(value * 100)}%</span>
  </div>
);

/* ── APU KPI cell ── */
const APUCell = ({ label, value, reference, tooltip }: {
  label: string; value: number; reference?: number; tooltip: string;
}) => {
  const diff = reference ? ((value - reference) / reference) * 100 : 0;
  const diffColor = !reference ? "text-muted-foreground" :
    Math.abs(diff) <= 3 ? "text-accent" :
    Math.abs(diff) <= 8 ? "text-yellow-500" : "text-destructive";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-center px-2 py-1.5 rounded-lg bg-muted/10 border border-border/30 cursor-default hover:bg-muted/20 transition-colors">
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 block mb-0.5">
              {label}
            </span>
            <span className="text-sm font-extrabold text-foreground block leading-none">{value}</span>
            {reference && (
              <span className={cn("text-[9px] font-mono font-semibold block mt-0.5", diffColor)}>
                {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[220px] text-[11px]"><p>{tooltip}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/* ── Detail expansion ── */
const LabourDetail = ({ item }: { item: LabourTruthItem }) => (
  <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
    {/* Reasoning */}
    <div>
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Beoordeling</span>
      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.reason}</p>
    </div>

    {/* Recommendation */}
    <div>
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">Aanbeveling</span>
      <p className="text-[11px] text-foreground/80 mt-0.5 leading-relaxed font-medium">{item.recommendation}</p>
    </div>

    {/* Meta */}
    <div className="flex items-center gap-4 flex-wrap text-[9px] font-mono text-muted-foreground/50">
      <span>Bron: {item.labor_source}</span>
      <span>Methode: {item.calculation_method}</span>
      <span>Periode: {item.period}</span>
    </div>

    {/* W-APU family explanation */}
    <div className="rounded-md bg-muted/10 border border-border/30 p-2.5">
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60 block mb-1.5">APU Familie</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px]">
        <div><span className="font-bold text-foreground/70">W-APU</span> <span className="text-muted-foreground">— Werkelijke productieprestatie (vloer)</span></div>
        <div><span className="font-bold text-foreground/70">O-APU</span> <span className="text-muted-foreground">— Orderbevestiging (klant betaalt)</span></div>
        <div><span className="font-bold text-foreground/70">C-APU</span> <span className="text-muted-foreground">— Calculatie (best achievable)</span></div>
        <div><span className="font-bold text-foreground/70">P-APU</span> <span className="text-muted-foreground">— Planning (uren-berekening)</span></div>
        <div><span className="font-bold text-foreground/70">APU</span> <span className="text-muted-foreground">— Standaard normwaarde</span></div>
      </div>
    </div>
  </div>
);

/* ── Main Panel ── */
const LabourTruthPanel = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterAssessment, setFilterAssessment] = useState<LabourAssessment | "all">("all");

  const filtered = filterAssessment === "all"
    ? labourTruthData
    : labourTruthData.filter(i => i.assessment === filterAssessment);

  const counts: Record<string, number> = {};
  labourTruthData.forEach(i => { counts[i.assessment] = (counts[i.assessment] || 0) + 1; });

  const issueCount = labourTruthData.filter(i => i.assessment !== "aligned").length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex items-center gap-4 flex-wrap text-[10px] font-mono">
        <span className="text-foreground font-bold">{labourTruthData.length} producten</span>
        {issueCount > 0 && <span className="text-orange-500">{issueCount} aandachtspunten</span>}
        <span className="text-accent">{counts.aligned || 0} aligned</span>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {(["all", "likely_undercharged", "likely_overcharged", "needs_review", "aligned"] as const).map(key => {
          const label = key === "all" ? "Alles" : assessmentConfig[key].label;
          const count = key === "all" ? labourTruthData.length : (counts[key] || 0);
          const isActive = filterAssessment === key;
          return (
            <button
              key={key}
              onClick={() => setFilterAssessment(key)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors",
                isActive
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              {label} <span className="text-muted-foreground/40 ml-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Product rows */}
      <div className="space-y-2">
        {filtered.map(item => {
          const isExpanded = expandedId === item.id;
          const cfg = assessmentConfig[item.assessment];

          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border p-3 transition-colors",
                cfg.bg, cfg.border,
                isExpanded && "ring-1 ring-primary/10"
              )}
            >
              {/* Header */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                {isExpanded
                  ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                }
                <AssessmentIcon assessment={item.assessment} />
                <span className="text-xs font-bold text-foreground truncate">{item.product}</span>
                <span className="text-[9px] font-mono uppercase text-muted-foreground/50 px-1.5 py-0.5 rounded bg-muted/30 border border-border/30">
                  {item.dept}
                </span>
                <div className="ml-auto flex items-center gap-2 shrink-0">
                  <ConfidenceIndicator value={item.confidence} />
                  <AssessmentBadge assessment={item.assessment} />
                </div>
              </div>

              {/* APU KPI Strip */}
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                <APUCell label="W-APU" value={item.w_apu} tooltip="Werkelijke APU — gemeten op de productievloer" />
                <APUCell label="O-APU" value={item.o_apu} reference={item.w_apu} tooltip="Orderbevestiging APU — productiviteit die de klant betaalt" />
                <APUCell label="C-APU" value={item.c_apu} reference={item.w_apu} tooltip="Calculatie APU — best achievable benchmark" />
                <APUCell label="P-APU" value={item.p_apu} reference={item.w_apu} tooltip="Planning APU — waarmee de uren-planning rekent" />
                <APUCell label="APU" value={item.apu} reference={item.w_apu} tooltip="Standaard normwaarde" />
              </div>

              {/* Stems & Labor display */}
              <div className="mt-3 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/30">
                  <Users className="w-3.5 h-3.5 text-primary/60" />
                  <div>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 block">
                      aantal stelen per persoon per uur
                    </span>
                    <span className="text-sm font-extrabold text-foreground">{item.stelen_per_persoon_per_uur}</span>
                    <span className="text-[9px] text-muted-foreground/50 ml-1">st/p/u</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/30">
                  <Clock className="w-3.5 h-3.5 text-primary/60" />
                  <div>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 block">
                      arbeid per stuk
                    </span>
                    <span className="text-sm font-extrabold text-foreground">{item.arbeid_per_stuk.toFixed(2)}</span>
                    <span className="text-[9px] text-muted-foreground/50 ml-1">min</span>
                  </div>
                </div>
              </div>

              {/* Assessment summary (always visible) */}
              <div className="mt-2 ml-5">
                <p className="text-[11px] text-muted-foreground">{item.reason}</p>
              </div>

              {/* Expanded detail */}
              {isExpanded && <LabourDetail item={item} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LabourTruthPanel;
