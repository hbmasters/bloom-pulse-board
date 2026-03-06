import { useState } from "react";
import { BarChart3, PiggyBank, Users, Trash2, PieChart, Factory, Truck, LayoutGrid, Globe, Brain, AlertTriangle, TrendingUp, TrendingDown, ArrowDown, CheckCircle2, Zap, Clock } from "lucide-react";
import PageAgentBadges from "./PageAgentBadges";
import KPIPeriodFilter, { PeriodFilterState } from "./kpi/KPIPeriodFilter";
import KPIExecutiveCard, { ExecutiveKPI } from "./kpi/KPIExecutiveCard";

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
    id: "product-cost", title: "Product Cost", icon: PiggyBank,
    value: "36.2%", target: "38.0%", diffTarget: "-1.8pp", diffTargetDir: "negative",
    trendPeriod: "-0.3pp", trendPeriodDir: "down", trendYear: "-1.2pp", trendYearDir: "down", status: "warning",
  },
  {
    id: "labor", title: "Arbeid/Steel", icon: Users,
    value: "€0.038", target: "< €0.042", diffTarget: "OK", diffTargetDir: "positive",
    trendPeriod: "+4.8%", trendPeriodDir: "up", trendYear: "+8.2%", trendYearDir: "up", status: "warning",
  },
  {
    id: "waste", title: "Uitval", icon: Trash2,
    value: "3.4%", target: "3.0%", diffTarget: "+0.4pp", diffTargetDir: "negative",
    trendPeriod: "+0.2pp", trendPeriodDir: "up", trendYear: "+0.6pp", trendYearDir: "up", status: "critical",
  },
  {
    id: "revenue", title: "Omzetverdeling", icon: PieChart,
    value: "27.4%", unit: "top", target: "< 25%", diffTarget: "+2.4pp", diffTargetDir: "negative",
    trendPeriod: "+1.2pp", trendPeriodDir: "up", trendYear: "+3.1pp", trendYearDir: "up", status: "critical",
  },
  {
    id: "production", title: "Productie Eff.", icon: Factory,
    value: "208", unit: "st/u", target: "220", diffTarget: "-5.5%", diffTargetDir: "negative",
    trendPeriod: "-1.0%", trendPeriodDir: "down", trendYear: "-4.2%", trendYearDir: "down", status: "warning",
  },
  {
    id: "procurement", title: "Inkoop", icon: Truck,
    value: "€0.18", unit: "/st", target: "€0.17", diffTarget: "+5.9%", diffTargetDir: "negative",
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

interface Alert {
  icon: typeof AlertTriangle;
  iconColor: string;
  message: string;
  time: string;
  severity: "critical" | "warning" | "info";
}

const alerts: Alert[] = [
  { icon: ArrowDown, iconColor: "text-red-400", message: "Klant AH > 25% omzetaandeel (27.4%)", time: "12 min", severity: "critical" },
  { icon: ArrowDown, iconColor: "text-red-400", message: "Uitval boven 3% norm (3.4%)", time: "25 min", severity: "critical" },
  { icon: ArrowDown, iconColor: "text-red-400", message: "Productie eff. H3 lijn −23%", time: "1 uur", severity: "critical" },
  { icon: TrendingDown, iconColor: "text-yellow-500", message: "Arbeidskosten/steel +4.8%", time: "2 uur", severity: "warning" },
  { icon: TrendingDown, iconColor: "text-yellow-500", message: "Bedcapaciteit onder 90%", time: "2 uur", severity: "warning" },
  { icon: TrendingDown, iconColor: "text-yellow-500", message: "Inkoopprijs rozen +12%", time: "3 uur", severity: "warning" },
  { icon: CheckCircle2, iconColor: "text-accent", message: "Kenya omzet +18.5% vs periode", time: "3 uur", severity: "info" },
  { icon: TrendingUp, iconColor: "text-accent", message: "Marge verbetering Jumbo +2.1%", time: "4 uur", severity: "info" },
];

const alertBorder = {
  critical: "border-red-500/15",
  warning: "border-yellow-500/15",
  info: "border-accent/15",
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

  const criticalCount = alerts.filter(a => a.severity === "critical").length;

  return (
    <div className="flex flex-col h-full p-4 md:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <BarChart3 className="w-5 h-5 text-primary/70" />
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">Executive KPI Dashboard</h2>
          <p className="text-[13px] text-muted-foreground/50">HBM • ~500 medewerkers • Periode {filter.period} / {filter.year}</p>
        </div>
      </div>

      <PageAgentBadges pageId="kpis" className="mb-3" />
      <KPIPeriodFilter value={filter} onChange={setFilter} />

      {/* Main layout: KPIs left, Alerts right */}
      <div className="flex-1 min-h-0 flex gap-5 mt-4 overflow-hidden">
        {/* Left: KPI cards */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map(kpi => (
              <KPIExecutiveCard
                key={kpi.id}
                kpi={kpi}
                onClick={() => setActiveKPI(kpi.id as ActiveKPI)}
              />
            ))}
          </div>
        </div>

        {/* Right: Alerts panel */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border/30">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight">AI Alerts</h3>
            </div>
            {criticalCount > 0 && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-red-400">{criticalCount}</span>
              </div>
            )}
          </div>

          {/* Alert list */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
            {alerts.map((alert, i) => {
              const AlertIcon = alert.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border ${alertBorder[alert.severity]} bg-card/40 transition-colors hover:bg-card/70`}
                >
                  <AlertIcon className={`w-4 h-4 mt-0.5 shrink-0 ${alert.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-foreground/80 leading-snug">{alert.message}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground/25" />
                      <span className="text-[10px] text-muted-foreground/35">{alert.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default KPIDashboard;
