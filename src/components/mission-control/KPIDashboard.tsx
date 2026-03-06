import { useState } from "react";
import { Factory, ShoppingCart, Truck, DollarSign, BarChart3, ChevronRight, Users, AlertTriangle } from "lucide-react";
import PageAgentBadges from "./PageAgentBadges";
import KPIAIMonitor from "./kpi/KPIAIMonitor";
import KPIOperations from "./kpi/KPIOperations";
import KPISales from "./kpi/KPISales";
import KPIProcurement from "./kpi/KPIProcurement";
import KPIFinance from "./kpi/KPIFinance";

type Department = null | "sales" | "procurement" | "operations" | "finance";

const departments = [
  {
    key: "sales" as const,
    title: "Sales",
    subtitle: "Omzet, orders & klantprestatie",
    icon: ShoppingCart,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20 hover:border-primary/40 hover:shadow-primary/10",
    stats: [
      { label: "Omzet", value: "€2.4M", status: "healthy" as const },
      { label: "Orders", value: "1,842", status: "healthy" as const },
    ],
  },
  {
    key: "procurement" as const,
    title: "Procurement",
    subtitle: "Inkoop, leveranciers & kosten",
    icon: Truck,
    color: "text-bloom-warm",
    bgColor: "bg-bloom-warm/10 border-bloom-warm/20 hover:border-bloom-warm/40 hover:shadow-bloom-warm/10",
    stats: [
      { label: "Prijs/steel", value: "€0.18", status: "warning" as const },
      { label: "Leveranciers", value: "8", status: "healthy" as const },
    ],
  },
  {
    key: "operations" as const,
    title: "Operations",
    subtitle: "Productie, lijnen & efficiency",
    icon: Factory,
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20 hover:border-accent/40 hover:shadow-accent/10",
    stats: [
      { label: "Output", value: "12,400 bq", status: "healthy" as const },
      { label: "Efficiency", value: "87.5%", status: "warning" as const },
    ],
  },
  {
    key: "finance" as const,
    title: "Finance",
    subtitle: "Marge, kosten & cashflow",
    icon: DollarSign,
    color: "text-bloom-sky",
    bgColor: "bg-bloom-sky/10 border-bloom-sky/20 hover:border-bloom-sky/40 hover:shadow-bloom-sky/10",
    stats: [
      { label: "Marge", value: "34.2%", status: "healthy" as const },
      { label: "EBITDA", value: "€820K", status: "healthy" as const },
    ],
  },
];

const statusDot = {
  healthy: "bg-accent",
  warning: "bg-yellow-500",
  critical: "bg-red-500 animate-pulse",
};

const KPIDashboard = () => {
  const [activeDept, setActiveDept] = useState<Department>(null);

  if (activeDept === "operations") return <KPIOperations onBack={() => setActiveDept(null)} />;
  if (activeDept === "sales") return <KPISales onBack={() => setActiveDept(null)} />;
  if (activeDept === "procurement") return <KPIProcurement onBack={() => setActiveDept(null)} />;
  if (activeDept === "finance") return <KPIFinance onBack={() => setActiveDept(null)} />;

  return (
    <div className="flex flex-col h-full p-3 md:p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-xs font-black text-foreground uppercase tracking-wider">KPI Command Center</h2>
        <span className="text-[9px] font-mono text-muted-foreground/50 ml-1">HBM • 500 medewerkers</span>
      </div>
      <PageAgentBadges pageId="kpis" className="mb-3" />

      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {/* AI Monitoring */}
        <KPIAIMonitor />

        {/* Department buttons */}
        <div>
          <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider mb-2">Afdelingen</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departments.map(dept => {
              const Icon = dept.icon;
              return (
                <button
                  key={dept.key}
                  onClick={() => setActiveDept(dept.key)}
                  className={`group text-left p-4 rounded-xl border transition-all hover:shadow-lg ${dept.bgColor}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl bg-card/60 border border-border flex items-center justify-center ${dept.color} group-hover:scale-105 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-foreground">{dept.title}</h3>
                        <p className="text-[10px] text-muted-foreground">{dept.subtitle}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground/60 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="flex items-center gap-4">
                    {dept.stats.map(s => (
                      <div key={s.label} className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusDot[s.status]}`} />
                        <span className="text-[9px] font-mono text-muted-foreground">{s.label}:</span>
                        <span className="text-[10px] font-mono font-bold text-foreground">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick alerts summary */}
        <div className="rounded-xl border border-border bg-card/50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">Actieve Alerts</span>
          </div>
          <div className="space-y-1.5">
            {[
              { text: "H3 productiviteit onder drempel — 23% onder target", severity: "critical" as const },
              { text: "Inkoopprijs rozen +12% vs vorige week", severity: "warning" as const },
              { text: "Verpakkingsfouten stijgend (2.8%)", severity: "warning" as const },
              { text: "Arbeidskosten boven budget (+4.8%)", severity: "warning" as const },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground">
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[a.severity]}`} />
                {a.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
