import { useState } from "react";
import { BarChart3, PiggyBank, Users, Trash2, PieChart, Factory, Truck, LayoutGrid, Globe, Brain, AlertTriangle, TrendingUp, Zap, ChevronRight } from "lucide-react";
import PageAgentBadges from "./PageAgentBadges";
import KPIPeriodFilter, { PeriodFilterState } from "./kpi/KPIPeriodFilter";
import KPIExecutiveCard, { ExecutiveKPI } from "./kpi/KPIExecutiveCard";

// Detail pages
import KPIProductCost from "./kpi/details/KPIProductCost";
import KPILaborPerStem from "./kpi/details/KPILaborPerStem";
import KPIWaste from "./kpi/details/KPIWaste";
import KPIRevenueDistribution from "./kpi/details/KPIRevenueDistribution";
import KPIProductionEfficiency from "./kpi/details/KPIProductionEfficiency";
import KPIProcurementDetail from "./kpi/details/KPIProcurementDetail";
import KPICapacity from "./kpi/details/KPICapacity";
import KPIKenya from "./kpi/details/KPIKenya";

type ActiveKPI = null | "product-cost" | "labor" | "waste" | "revenue" | "production" | "procurement" | "capacity" | "kenya";

const kpis: ExecutiveKPI[] = [
  {
    id: "product-cost", title: "Product Cost Control", icon: PiggyBank,
    value: "36.2%", unit: "marge", target: "38.0%", diffTarget: "-1.8pp", diffTargetDir: "negative",
    trendPeriod: "-0.3pp", trendPeriodDir: "down", trendYear: "-1.2pp", trendYearDir: "down", status: "warning",
  },
  {
    id: "labor", title: "Arbeid per Steel", icon: Users,
    value: "€0.038", target: "< €0.042", diffTarget: "OK", diffTargetDir: "positive",
    trendPeriod: "+4.8%", trendPeriodDir: "up", trendYear: "+8.2%", trendYearDir: "up", status: "warning",
  },
  {
    id: "waste", title: "Uitval & Afschrijving", icon: Trash2,
    value: "3.4%", target: "3.0%", diffTarget: "+0.4pp", diffTargetDir: "negative",
    trendPeriod: "+0.2pp", trendPeriodDir: "up", trendYear: "+0.6pp", trendYearDir: "up", status: "critical",
  },
  {
    id: "revenue", title: "Omzetverdeling", icon: PieChart,
    value: "27.4%", unit: "top klant", target: "< 25%", diffTarget: "+2.4pp", diffTargetDir: "negative",
    trendPeriod: "+1.2pp", trendPeriodDir: "up", trendYear: "+3.1pp", trendYearDir: "up", status: "critical",
  },
  {
    id: "production", title: "Productie Efficiëntie", icon: Factory,
    value: "208", unit: "st/p/u", target: "220", diffTarget: "-5.5%", diffTargetDir: "negative",
    trendPeriod: "-1.0%", trendPeriodDir: "down", trendYear: "-4.2%", trendYearDir: "down", status: "warning",
  },
  {
    id: "procurement", title: "Inkoop & Waardering", icon: Truck,
    value: "€0.18", unit: "/steel", target: "€0.17", diffTarget: "+5.9%", diffTargetDir: "negative",
    trendPeriod: "+2.8%", trendPeriodDir: "up", trendYear: "+12.5%", trendYearDir: "up", status: "warning",
  },
  {
    id: "capacity", title: "Bedcapaciteit", icon: LayoutGrid,
    value: "86.4%", target: "90%", diffTarget: "-3.6pp", diffTargetDir: "negative",
    trendPeriod: "-0.6pp", trendPeriodDir: "down", trendYear: "-2.1pp", trendYearDir: "down", status: "warning",
  },
  {
    id: "kenya", title: "HBM Kenya", icon: Globe,
    value: "€420K", target: "€390K", diffTarget: "+7.7%", diffTargetDir: "positive",
    trendPeriod: "+18.5%", trendPeriodDir: "up", trendYear: "+24.2%", trendYearDir: "up", status: "healthy",
  },
];

const aiInsights = [
  { severity: "critical" as const, icon: AlertTriangle, text: "Albert Heijn overschrijdt 25% omzetgrens (27.4%) — klantafhankelijkheid risico" },
  { severity: "critical" as const, icon: AlertTriangle, text: "Uitval boven 3% norm (3.4%) — stijgende trend afgelopen 4 perioden" },
  { severity: "warning" as const, icon: TrendingUp, text: "Arbeidskosten per steel stijgend (+4.8% vs vorige periode)" },
  { severity: "warning" as const, icon: Zap, text: "Productie-efficiëntie H3 lijn 23% onder target — operator verloop" },
  { severity: "info" as const, icon: TrendingUp, text: "Kenya operatie overtreft forecast met 8% — positieve groeitrend" },
];

const sevStyles = {
  info: "border-primary/20 bg-primary/5",
  warning: "border-yellow-500/20 bg-yellow-500/5",
  critical: "border-red-500/20 bg-red-500/5",
};
const sevDot = {
  info: "bg-primary",
  warning: "bg-yellow-500",
  critical: "bg-red-500 animate-pulse",
};

const KPIDashboard = () => {
  const [activeKPI, setActiveKPI] = useState<ActiveKPI>(null);
  const [filter, setFilter] = useState<PeriodFilterState>({
    year: new Date().getFullYear(),
    period: Math.ceil((new Date().getMonth() + 1) / (12 / 13)),
    comparison: "previous",
  });

  const goBack = () => setActiveKPI(null);

  if (activeKPI === "product-cost") return <KPIProductCost onBack={goBack} />;
  if (activeKPI === "labor") return <KPILaborPerStem onBack={goBack} />;
  if (activeKPI === "waste") return <KPIWaste onBack={goBack} />;
  if (activeKPI === "revenue") return <KPIRevenueDistribution onBack={goBack} />;
  if (activeKPI === "production") return <KPIProductionEfficiency onBack={goBack} />;
  if (activeKPI === "procurement") return <KPIProcurementDetail onBack={goBack} />;
  if (activeKPI === "capacity") return <KPICapacity onBack={goBack} />;
  if (activeKPI === "kenya") return <KPIKenya onBack={goBack} />;

  return (
    <div className="flex flex-col h-full p-3 md:p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">Executive KPI Dashboard</h2>
        <span className="text-[9px] font-mono text-muted-foreground/50 ml-1">HBM • ~500 medewerkers • 13 perioden</span>
      </div>

      <PageAgentBadges pageId="kpis" className="mb-2" />
      <KPIPeriodFilter value={filter} onChange={setFilter} />

      <div className="flex-1 min-h-0 overflow-y-auto mt-3 space-y-4">
        {/* AI Insights */}
        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-wider">HBMaster AI Insights</h3>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[8px] font-mono text-red-400">2 kritiek</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5">
            {aiInsights.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className={`flex items-start gap-2 p-2 rounded-lg border ${sevStyles[a.severity]}`}>
                  <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${sevDot[a.severity]}`} />
                  <span className="text-[9px] font-mono text-foreground/80 leading-relaxed">{a.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map(kpi => (
            <KPIExecutiveCard
              key={kpi.id}
              kpi={kpi}
              onClick={() => setActiveKPI(kpi.id as ActiveKPI)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
