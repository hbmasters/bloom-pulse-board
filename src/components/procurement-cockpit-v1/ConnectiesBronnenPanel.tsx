import { useState, useEffect } from "react";
import {
  Wifi, WifiOff, Clock, AlertCircle, CheckCircle2, Database,
  Globe, Server, ShieldCheck, RefreshCw, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type SourceStatus = "connected" | "planned" | "error" | "disabled" | "unknown";

interface DataSource {
  id: string;
  name: string;
  type: "internal" | "external" | "market" | "supplier";
  status: SourceStatus;
  last_sync: string | null;
  data_types: string[];
  trust_level: "high" | "medium" | "low" | "unknown";
  description: string;
}

const statusConfig: Record<SourceStatus, { label: string; color: string; icon: typeof Wifi }> = {
  connected: { label: "Verbonden", color: "text-accent bg-accent/10 border-accent/20", icon: Wifi },
  planned: { label: "Gepland", color: "text-primary bg-primary/10 border-primary/20", icon: Clock },
  error: { label: "Fout", color: "text-destructive bg-destructive/10 border-destructive/20", icon: WifiOff },
  disabled: { label: "Uitgeschakeld", color: "text-muted-foreground bg-muted/50 border-border", icon: WifiOff },
  unknown: { label: "Onbekend", color: "text-muted-foreground bg-muted/50 border-border", icon: AlertCircle },
};

const trustConfig: Record<string, { label: string; color: string }> = {
  high: { label: "Hoog", color: "text-accent" },
  medium: { label: "Medium", color: "text-yellow-500" },
  low: { label: "Laag", color: "text-orange-500" },
  unknown: { label: "Onbekend", color: "text-muted-foreground" },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  internal: { label: "Intern", color: "text-primary bg-primary/10 border-primary/20" },
  external: { label: "Extern", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
  market: { label: "Markt", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" },
  supplier: { label: "Leverancier", color: "text-accent bg-accent/10 border-accent/20" },
};

const ConnectiesBronnenPanel = () => {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const detectSources = async () => {
    setLoading(true);
    const detected: DataSource[] = [];

    // 1. Check procurement_snapshot_rows — live database source
    try {
      const { count, error } = await supabase
        .from("procurement_snapshot_rows")
        .select("*", { count: "exact", head: true });

      detected.push({
        id: "procurement-snapshot",
        name: "Procurement Snapshot",
        type: "internal",
        status: !error && (count ?? 0) > 0 ? "connected" : error ? "error" : "disabled",
        last_sync: !error ? new Date().toISOString() : null,
        data_types: ["inkooprijen", "voorraad", "urgentie", "prijzen"],
        trust_level: !error && (count ?? 0) > 0 ? "high" : "unknown",
        description: `${count ?? 0} rijen beschikbaar — operationeel inkoopsnapshot`,
      });
    } catch {
      detected.push({
        id: "procurement-snapshot",
        name: "Procurement Snapshot",
        type: "internal",
        status: "error",
        last_sync: null,
        data_types: ["inkooprijen", "voorraad"],
        trust_level: "unknown",
        description: "Verbindingsfout",
      });
    }

    // 2. Check execution_intents — live database source
    try {
      const { count, error } = await supabase
        .from("execution_intents")
        .select("*", { count: "exact", head: true });

      detected.push({
        id: "execution-intents",
        name: "Execution Intents",
        type: "internal",
        status: !error && (count ?? 0) > 0 ? "connected" : error ? "error" : "disabled",
        last_sync: !error ? new Date().toISOString() : null,
        data_types: ["acties", "prioriteiten", "risico", "ordervoorstellen"],
        trust_level: !error && (count ?? 0) > 0 ? "high" : "unknown",
        description: `${count ?? 0} intents beschikbaar — strategische acties`,
      });
    } catch {
      detected.push({
        id: "execution-intents",
        name: "Execution Intents",
        type: "internal",
        status: "error",
        last_sync: null,
        data_types: ["acties"],
        trust_level: "unknown",
        description: "Verbindingsfout",
      });
    }

    // 3. Planned / future sources — honest about status
    detected.push(
      {
        id: "hbm-dw",
        name: "HBM Data Warehouse / Axerrio",
        type: "internal",
        status: "planned",
        last_sync: null,
        data_types: ["historische prijzen", "verbruik", "productieorders"],
        trust_level: "unknown",
        description: "Nog niet beschikbaar — koppeling gepland",
      },
      {
        id: "hbm-production",
        name: "HBM Production",
        type: "internal",
        status: "planned",
        last_sync: null,
        data_types: ["productieorders", "W-APU", "O-APU", "lijnen"],
        trust_level: "unknown",
        description: "Nog niet beschikbaar — koppeling gepland",
      },
      {
        id: "floritrack",
        name: "Floritrack",
        type: "external",
        status: "planned",
        last_sync: null,
        data_types: ["logistiek", "zendingen", "tracking"],
        trust_level: "unknown",
        description: "Nog niet beschikbaar — koppeling gepland",
      },
      {
        id: "floraholland",
        name: "Flora Holland / Marktplaats",
        type: "market",
        status: "planned",
        last_sync: null,
        data_types: ["marktprijzen", "aanbod", "beschikbaarheid"],
        trust_level: "unknown",
        description: "Nog niet beschikbaar — koppeling gepland",
      },
      {
        id: "business-central",
        name: "Business Central",
        type: "internal",
        status: "planned",
        last_sync: null,
        data_types: ["financieel", "facturen", "orders"],
        trust_level: "unknown",
        description: "Nog niet beschikbaar — koppeling gepland",
      },
    );

    setSources(detected);
    setLoading(false);
  };

  useEffect(() => { detectSources(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await detectSources();
    setRefreshing(false);
  };

  const connectedCount = sources.filter(s => s.status === "connected").length;
  const plannedCount = sources.filter(s => s.status === "planned").length;
  const errorCount = sources.filter(s => s.status === "error").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-[11px] font-medium">Bronnen detecteren...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-2.5 flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 text-accent" />
            <div>
              <span className="text-[9px] font-medium text-muted-foreground uppercase block">Verbonden</span>
              <span className="text-sm font-bold font-mono text-accent">{connectedCount}</span>
            </div>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <div>
              <span className="text-[9px] font-medium text-muted-foreground uppercase block">Gepland</span>
              <span className="text-sm font-bold font-mono text-primary">{plannedCount}</span>
            </div>
          </div>
          {errorCount > 0 && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2.5 flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-destructive" />
              <div>
                <span className="text-[9px] font-medium text-muted-foreground uppercase block">Fout</span>
                <span className="text-sm font-bold font-mono text-destructive">{errorCount}</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
          Ververs
        </button>
      </div>

      {/* Source cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map(source => {
          const sc = statusConfig[source.status];
          const tc = trustConfig[source.trust_level];
          const typ = typeConfig[source.type];
          const StatusIcon = sc.icon;

          return (
            <div key={source.id} className={cn(
              "rounded-xl border bg-card p-4 space-y-3 transition-all",
              source.status === "connected" ? "border-accent/20" : source.status === "error" ? "border-destructive/20" : "border-border"
            )}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusIcon className={cn("w-4 h-4 flex-shrink-0", source.status === "connected" ? "text-accent" : source.status === "error" ? "text-destructive" : "text-muted-foreground")} />
                  <div className="min-w-0">
                    <h4 className="text-[12px] font-semibold text-foreground truncate">{source.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{source.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={cn("text-[8px] font-medium px-2 py-0.5 rounded-full border", typ.color)}>{typ.label}</span>
                  <span className={cn("text-[8px] font-medium px-2 py-0.5 rounded-full border", sc.color)}>{sc.label}</span>
                </div>
              </div>

              {/* Data types */}
              <div className="flex flex-wrap gap-1">
                {source.data_types.map(dt => (
                  <span key={dt} className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                    {dt}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[9px] pt-2 border-t border-border/30">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Vertrouwen:</span>
                  <span className={cn("font-medium", tc.color)}>{tc.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {source.last_sync
                      ? `Sync: ${new Date(source.last_sync).toLocaleString("nl-NL", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}`
                      : "Nog niet gesynchroniseerd"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration roadmap notice */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-2">
          <Database className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-[11px] font-semibold text-foreground mb-1">Integratieroadmap</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Bovenstaande bronnen worden stapsgewijs gekoppeld. Momenteel leest het systeem uit de operationele database (Procurement Snapshot & Execution Intents).
              Externe bronnen zoals Floritrack, Flora Holland en Business Central staan gepland voor toekomstige iteraties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectiesBronnenPanel;
