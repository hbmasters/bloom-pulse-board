import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, RefreshCw } from "lucide-react";

interface SystemInfo {
  id: string;
  name: string;
  description: string;
  status: "online" | "degraded" | "offline";
  latency?: number;
  version?: string;
  lastSync?: string;
}

const systems: SystemInfo[] = [
  { id: "control", name: "HBM Control",    description: "Productie aansturing & monitoring",   status: "online",   latency: 12,  version: "3.2.1", lastSync: "2 sec geleden" },
  { id: "data",    name: "HBM Data",       description: "Data warehouse & analytics engine",   status: "online",   latency: 28,  version: "2.8.0", lastSync: "5 sec geleden" },
  { id: "crm",     name: "HBM CRM",        description: "Klantrelaties & orderbeheer",         status: "online",   latency: 45,  version: "4.1.3", lastSync: "12 sec geleden" },
  { id: "logistics", name: "HBM Logistics", description: "Transport & supply chain",           status: "degraded", latency: 320, version: "2.5.7", lastSync: "1 min geleden" },
  { id: "florist", name: "HBM Florist",    description: "Bloemenverwerking & recepturen",      status: "online",   latency: 18,  version: "5.0.2", lastSync: "3 sec geleden" },
];

const statusConfig = {
  online:   { label: "Online",   icon: CheckCircle2,  color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", dot: "bg-emerald-400" },
  degraded: { label: "Vertraagd", icon: AlertTriangle, color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20",   dot: "bg-amber-400" },
  offline:  { label: "Offline",  icon: XCircle,       color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", dot: "bg-destructive" },
};

const MCStatusPanel = () => {
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const onlineCount = systems.filter(s => s.status === "online").length;
  const allOnline = onlineCount === systems.length;

  const handleRefresh = (id: string) => {
    setRefreshing(id);
    setTimeout(() => setRefreshing(null), 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header summary */}
      <div className="flex-shrink-0 px-4 md:px-6 py-5 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-3 h-3 rounded-full animate-pulse", allOnline ? "bg-emerald-400" : "bg-amber-400")} />
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Systeem Status
          </h2>
          <span className="text-[10px] font-mono text-muted-foreground ml-auto">
            {onlineCount}/{systems.length} operationeel
          </span>
        </div>

        {/* Overall bar */}
        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted/30">
          {systems.map(s => (
            <div key={s.id} className={cn("flex-1 rounded-full transition-colors", statusConfig[s.status].dot)} />
          ))}
        </div>
      </div>

      {/* System list */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        {systems.map(sys => {
          const cfg = statusConfig[sys.status];
          const StatusIcon = cfg.icon;
          const isRefreshing = refreshing === sys.id;

          return (
            <div
              key={sys.id}
              className={cn(
                "rounded-xl border p-4 transition-all hover:scale-[1.01]",
                cfg.bg, cfg.border
              )}
            >
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <div className={cn("mt-0.5 flex-shrink-0", cfg.color)}>
                  <StatusIcon className="w-5 h-5" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{sys.name}</h3>
                    <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded-full border", cfg.color, cfg.bg, cfg.border)}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{sys.description}</p>

                  {/* Metrics row */}
                  <div className="flex items-center gap-4 mt-2.5">
                    {sys.latency !== undefined && (
                      <div className="flex items-center gap-1">
                        <div className={cn("w-1.5 h-1.5 rounded-full", sys.latency < 100 ? "bg-emerald-400" : sys.latency < 300 ? "bg-amber-400" : "bg-destructive")} />
                        <span className="text-[10px] font-mono text-muted-foreground">{sys.latency}ms</span>
                      </div>
                    )}
                    {sys.version && (
                      <span className="text-[10px] font-mono text-muted-foreground/60">v{sys.version}</span>
                    )}
                    {sys.lastSync && (
                      <span className="text-[10px] font-mono text-muted-foreground/40">Sync: {sys.lastSync}</span>
                    )}
                  </div>
                </div>

                {/* Refresh */}
                <button
                  onClick={() => handleRefresh(sys.id)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 md:px-6 py-3 border-t border-border bg-card/40">
        <p className="text-[10px] font-mono text-muted-foreground/50 text-center">
          Laatste volledige check: {new Date().toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} · Automatische refresh elke 30s
        </p>
      </div>
    </div>
  );
};

export default MCStatusPanel;
