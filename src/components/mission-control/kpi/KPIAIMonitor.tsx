import { Brain, AlertTriangle, TrendingUp, Zap, ChevronRight } from "lucide-react";

interface AIAlert {
  id: string;
  type: "anomaly" | "insight" | "recommendation";
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  department?: string;
}

const alerts: AIAlert[] = [
  {
    id: "1", type: "anomaly", severity: "critical",
    title: "Productiviteit H3 onder drempel",
    description: "Lijn H3 produceert 23% onder target. Oorzaak: hoog verloop operators + materiaaltekort bloemen.",
    department: "Operations"
  },
  {
    id: "2", type: "insight", severity: "warning",
    title: "Inkoopprijs rozen +12% vs vorige week",
    description: "Colombiaanse rozen tonen prijsstijging. Alternatieve leveranciers beschikbaar met 8% korting.",
    department: "Procurement"
  },
  {
    id: "3", type: "recommendation", severity: "info",
    title: "Omzet forecast overschrijding mogelijk",
    description: "Op basis van huidige orderintake wordt de maandomzet met 6% overschreden. Capaciteit afstemmen.",
    department: "Sales"
  },
  {
    id: "4", type: "anomaly", severity: "warning",
    title: "Verpakkingsfouten stijgend",
    description: "Error rate inpak afdeling gestegen van 1.2% naar 2.8%. Correlatie met nieuw personeel.",
    department: "Operations"
  },
];

const severityStyles = {
  info: "border-primary/20 bg-primary/5",
  warning: "border-yellow-500/20 bg-yellow-500/5",
  critical: "border-red-500/20 bg-red-500/5",
};

const severityDot = {
  info: "bg-primary",
  warning: "bg-yellow-500",
  critical: "bg-red-500 animate-pulse",
};

const typeIcons = {
  anomaly: AlertTriangle,
  insight: TrendingUp,
  recommendation: Zap,
};

const KPIAIMonitor = () => {
  return (
    <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider">HBMaster AI Monitoring</h3>
          <p className="text-[9px] font-mono text-muted-foreground">Real-time alerts, anomalieën & inzichten</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-mono text-red-400">1 kritiek</span>
          <span className="w-2 h-2 rounded-full bg-yellow-500 ml-2" />
          <span className="text-[9px] font-mono text-yellow-400">2 aandacht</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {alerts.map(alert => {
          const Icon = typeIcons[alert.type];
          return (
            <div key={alert.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${severityStyles[alert.severity]} transition-all hover:shadow-sm cursor-pointer group`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${severityDot[alert.severity]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-foreground truncate">{alert.title}</span>
                </div>
                <p className="text-[9px] text-muted-foreground leading-relaxed">{alert.description}</p>
                {alert.department && (
                  <span className="text-[8px] font-mono font-bold text-primary/60 mt-1 inline-block">{alert.department}</span>
                )}
              </div>
              <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors mt-1 shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KPIAIMonitor;
