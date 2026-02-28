import { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, Play, Pause, CheckCircle2, AlertTriangle, XCircle, RotateCw, Zap, Database, Mail, BarChart3, Truck, RefreshCw } from "lucide-react";

type CronStatus = "active" | "paused" | "error" | "running";
type CronInterval = string;

interface CronJob {
  id: string;
  name: string;
  description: string;
  schedule: CronInterval;
  scheduleLabel: string;
  status: CronStatus;
  enabled: boolean;
  lastRun?: string;
  lastDuration?: number;
  nextRun?: string;
  successRate: number;
  runsToday: number;
  icon: typeof Clock;
  category: "data" | "sync" | "report" | "system";
}

const initialJobs: CronJob[] = [
  {
    id: "prod-sync", name: "Productie Sync", description: "Synchroniseert productiedata van HBM Control naar Data warehouse",
    schedule: "*/5 * * * *", scheduleLabel: "Elke 5 min", status: "active", enabled: true,
    lastRun: "2 min geleden", lastDuration: 1.2, nextRun: "Over 3 min", successRate: 99.8, runsToday: 156,
    icon: RotateCw, category: "sync",
  },
  {
    id: "kpi-calc", name: "KPI Berekening", description: "Herberekent alle KPI dashboards en sparkline data",
    schedule: "*/15 * * * *", scheduleLabel: "Elke 15 min", status: "active", enabled: true,
    lastRun: "8 min geleden", lastDuration: 4.7, nextRun: "Over 7 min", successRate: 100, runsToday: 52,
    icon: BarChart3, category: "report",
  },
  {
    id: "crm-orders", name: "CRM Order Import", description: "Haalt nieuwe orders op uit HBM CRM en koppelt aan productieplanning",
    schedule: "*/10 * * * *", scheduleLabel: "Elke 10 min", status: "running", enabled: true,
    lastRun: "Nu actief", lastDuration: 2.1, nextRun: "—", successRate: 97.5, runsToday: 84,
    icon: Database, category: "sync",
  },
  {
    id: "logistics-update", name: "Logistics Tracker", description: "Update transport status en levertijden vanuit HBM Logistics",
    schedule: "*/30 * * * *", scheduleLabel: "Elke 30 min", status: "active", enabled: true,
    lastRun: "22 min geleden", lastDuration: 3.8, nextRun: "Over 8 min", successRate: 94.2, runsToday: 28,
    icon: Truck, category: "sync",
  },
  {
    id: "daily-report", name: "Dagrapportage", description: "Genereert de dagelijkse productie- en kwaliteitsrapportage",
    schedule: "0 18 * * 1-5", scheduleLabel: "Ma-Vr 18:00", status: "active", enabled: true,
    lastRun: "Gisteren 18:00", lastDuration: 12.4, nextRun: "Vandaag 18:00", successRate: 100, runsToday: 0,
    icon: Mail, category: "report",
  },
  {
    id: "cold-storage-check", name: "Koelcel Monitoring", description: "Controleert temperatuur en voorraadniveaus in koelcellen",
    schedule: "*/2 * * * *", scheduleLabel: "Elke 2 min", status: "error", enabled: true,
    lastRun: "45 sec geleden", lastDuration: 0.8, nextRun: "Over 1 min", successRate: 88.3, runsToday: 412,
    icon: Zap, category: "system",
  },
  {
    id: "kenya-sync", name: "Kenya Data Sync", description: "Synchroniseert productie- en aanvoerdata vanuit HBM Kenya",
    schedule: "0 */2 * * *", scheduleLabel: "Elke 2 uur", status: "paused", enabled: false,
    lastRun: "6 uur geleden", lastDuration: 18.2, nextRun: "Gepauzeerd", successRate: 91.0, runsToday: 0,
    icon: RefreshCw, category: "data",
  },
  {
    id: "florist-recipes", name: "Receptuur Update", description: "Synct bloemenrecepturen en samenstellingen vanuit HBM Florist",
    schedule: "0 6 * * *", scheduleLabel: "Dagelijks 06:00", status: "active", enabled: true,
    lastRun: "Vandaag 06:00", lastDuration: 5.6, nextRun: "Morgen 06:00", successRate: 100, runsToday: 1,
    icon: Zap, category: "data",
  },
];

const statusConfig: Record<CronStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  active:  { label: "Actief",   dot: "bg-emerald-400",   text: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  running: { label: "Draait…",  dot: "bg-primary",       text: "text-primary",     bg: "bg-primary/10",     border: "border-primary/20" },
  paused:  { label: "Gepauzeerd", dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted/20", border: "border-border" },
  error:   { label: "Fout",     dot: "bg-destructive",   text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
};

const categoryLabels: Record<string, string> = { data: "Data", sync: "Sync", report: "Rapport", system: "Systeem" };

const MCCronJobs = () => {
  const [jobs, setJobs] = useState<CronJob[]>(initialJobs);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const toggleJob = (id: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== id) return j;
      const enabled = !j.enabled;
      return { ...j, enabled, status: enabled ? "active" : "paused" };
    }));
  };

  const filtered = filterCategory ? jobs.filter(j => j.category === filterCategory) : jobs;
  const activeCount = jobs.filter(j => j.enabled).length;
  const errorCount = jobs.filter(j => j.status === "error").length;
  const runningCount = jobs.filter(j => j.status === "running").length;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 md:px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Cron Jobs</h2>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="text-emerald-400">{activeCount} actief</span>
            {runningCount > 0 && <span className="text-primary animate-pulse">{runningCount} draait</span>}
            {errorCount > 0 && <span className="text-destructive">{errorCount} fout</span>}
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilterCategory(null)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors",
              !filterCategory ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground/30"
            )}
          >Alles</button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterCategory(filterCategory === key ? null : key)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors",
                filterCategory === key ? "bg-primary/15 border-primary/30 text-primary" : "border-border text-muted-foreground hover:border-muted-foreground/30"
              )}
            >{label}</button>
          ))}
        </div>
      </div>

      {/* Job list */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2.5">
        {filtered.map(job => {
          const cfg = statusConfig[job.status];
          const Icon = job.icon;

          return (
            <div
              key={job.id}
              className={cn(
                "rounded-xl border p-4 transition-all",
                cfg.bg, cfg.border,
                !job.enabled && "opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn("mt-0.5 p-2 rounded-lg border flex-shrink-0", cfg.bg, cfg.border)}>
                  <Icon className={cn("w-4 h-4", cfg.text, job.status === "running" && "animate-spin")} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground">{job.name}</h3>
                    <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded-full border", cfg.text, cfg.bg, cfg.border)}>
                      {cfg.label}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground/50 px-1.5 py-0.5 rounded-full border border-border">
                      {categoryLabels[job.category]}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{job.description}</p>

                  {/* Metrics */}
                  <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground/50" />
                      <span className="text-[10px] font-mono text-muted-foreground">{job.scheduleLabel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-muted-foreground/50">Laatste:</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{job.lastRun}</span>
                    </div>
                    {job.lastDuration !== undefined && (
                      <span className="text-[10px] font-mono text-muted-foreground/40">{job.lastDuration}s</span>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-muted-foreground/50">Volgende:</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{job.nextRun}</span>
                    </div>
                  </div>

                  {/* Success rate bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden max-w-[120px]">
                      <div
                        className={cn("h-full rounded-full transition-all", job.successRate >= 98 ? "bg-emerald-400" : job.successRate >= 90 ? "bg-amber-400" : "bg-destructive")}
                        style={{ width: `${job.successRate}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-muted-foreground">{job.successRate}%</span>
                    <span className="text-[9px] font-mono text-muted-foreground/40">· {job.runsToday}x vandaag</span>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleJob(job.id)}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-1",
                    job.enabled ? "bg-emerald-400/80" : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-foreground shadow-md transition-transform",
                    job.enabled ? "translate-x-5" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 md:px-6 py-3 border-t border-border bg-card/40">
        <p className="text-[10px] font-mono text-muted-foreground/50 text-center">
          {jobs.reduce((s, j) => s + j.runsToday, 0)} totale runs vandaag · Scheduler actief
        </p>
      </div>
    </div>
  );
};

export default MCCronJobs;
