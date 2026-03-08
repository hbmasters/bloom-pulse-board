import { TrendingUp, Zap, Clock, CheckCircle2, Target, ArrowUpRight } from "lucide-react";
import type { ActionItem } from "./types";

interface Props {
  actions: ActionItem[];
}

export const ActionImpactSummary = ({ actions }: Props) => {
  const open = actions.filter((a) => a.status === "open").length;
  const inProgress = actions.filter((a) => a.status === "in_progress").length;
  const completed = actions.filter((a) => a.status === "completed").length;

  const totalFinancial = actions.reduce((s, a) => s + (a.impact_financial ?? 0), 0);
  const avgEfficiency = actions.filter((a) => a.impact_efficiency).reduce((s, a) => s + (a.impact_efficiency ?? 0), 0);
  const procurementSavings = actions
    .filter((a) => a.department_owner === "Inkoop")
    .reduce((s, a) => s + (a.impact_financial ?? 0), 0);

  const kpis = [
    {
      label: "Totaal acties",
      value: actions.length.toString(),
      icon: Zap,
      accent: "text-primary",
      bg: "bg-primary/5 border-primary/20",
    },
    {
      label: "Open",
      value: open.toString(),
      icon: Target,
      accent: "text-yellow-500",
      bg: "bg-yellow-500/5 border-yellow-500/20",
    },
    {
      label: "In uitvoering",
      value: inProgress.toString(),
      icon: Clock,
      accent: "text-blue-400",
      bg: "bg-blue-400/5 border-blue-400/20",
    },
    {
      label: "Afgerond",
      value: completed.toString(),
      icon: CheckCircle2,
      accent: "text-accent",
      bg: "bg-accent/5 border-accent/20",
    },
  ];

  const impacts = [
    {
      label: "Geschatte margebijdrage",
      value: `€${(totalFinancial).toLocaleString("nl-NL")}`,
      sub: "/ jaar",
      icon: TrendingUp,
      accent: "text-accent",
    },
    {
      label: "Efficiëntiepotentieel",
      value: `+${avgEfficiency.toFixed(1)}`,
      sub: "W-APU",
      icon: ArrowUpRight,
      accent: "text-primary",
    },
    {
      label: "Inkoopbesparing",
      value: `€${procurementSavings.toLocaleString("nl-NL")}`,
      sub: "/ jaar",
      icon: Target,
      accent: "text-accent",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Action counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className={`rounded-xl border p-4 ${k.bg} transition-all`}>
            <div className="flex items-center gap-2 mb-2">
              <k.icon className={`w-4 h-4 ${k.accent}`} />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{k.label}</span>
            </div>
            <div className={`text-2xl font-black font-mono ${k.accent}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Impact potential */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent mb-3">
          Potentiële Business Impact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {impacts.map((i) => (
            <div key={i.label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <i.icon className={`w-4 h-4 ${i.accent}`} />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">{i.label}</div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-lg font-black font-mono ${i.accent}`}>{i.value}</span>
                  <span className="text-[10px] text-muted-foreground">{i.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
