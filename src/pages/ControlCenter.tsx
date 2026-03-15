import { useState } from "react";
import { cn } from "@/lib/utils";
import { Shield, Timer, Activity, Link2, FileText, Monitor } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import Sentinel from "@/pages/Sentinel";
import MCCronJobs from "@/components/mission-control/MCCronJobs";
import TelemetryPanel from "@/components/mission-control/TelemetryPanel";
import {
  integrations, integrationStatusStyles, type IntegrationStatus,
  weeklyReview, reviewCategoryConfig, priorityStyles,
} from "@/components/control-center/control-center-data";

/* ── Tab system ── */
type CCTab = "sentinel" | "scheduler" | "telemetry" | "integrations" | "review";

const tabs: { id: CCTab; label: string; icon: typeof Shield }[] = [
  { id: "sentinel", label: "Sentinel", icon: Shield },
  { id: "scheduler", label: "Scheduler", icon: Timer },
  { id: "telemetry", label: "Telemetry", icon: Activity },
  { id: "integrations", label: "Integraties", icon: Link2 },
  { id: "review", label: "Weekly Review", icon: FileText },
];

/* ── Integration Status Badge ── */
const IntegrationBadge = ({ status }: { status: IntegrationStatus }) => {
  const s = integrationStatusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

/* ── Section 4: Integration Monitoring ── */
const IntegrationPanel = () => {
  const categoryLabels: Record<string, string> = { messaging: "Messaging", crm: "CRM", data: "Data", api: "API" };
  const onlineCount = integrations.filter(i => i.status === "online").length;
  const issueCount = integrations.filter(i => i.status !== "online").length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 text-[10px] font-mono">
        <span className="text-accent">{onlineCount} online</span>
        {issueCount > 0 && <span className="text-orange-500">{issueCount} issues</span>}
        <span className="text-muted-foreground">{integrations.length} totaal</span>
      </div>

      {/* Integration cards */}
      <div className="space-y-2">
        {integrations.map(item => (
          <div key={item.name} className={`rounded-lg border p-3 ${integrationStatusStyles[item.status].bg} ${integrationStatusStyles[item.status].border}`}>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold text-foreground">{item.name}</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50 border border-border">
                {categoryLabels[item.category]}
              </span>
              <IntegrationBadge status={item.status} />
              <span className="text-[9px] font-mono text-muted-foreground ml-auto">Uptime {item.uptime}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{item.detail}</p>
            {item.lastError && (
              <div className="mt-1.5 flex items-start gap-2 px-2 py-1.5 rounded bg-muted/20 border border-border/40">
                <span className="text-[9px] font-mono text-muted-foreground/50 shrink-0">{item.lastErrorTime}</span>
                <span className="text-[10px] font-mono text-orange-400">{item.lastError}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Section 5: Weekly Review ── */
const WeeklyReviewPanel = () => {
  const grouped = weeklyReview.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof weeklyReview>);

  const categoryOrder = ["issue", "proposal", "efficiency", "todo", "recommendation"];

  return (
    <div className="space-y-5">
      {/* Memo header */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Management Memo</span>
          <span className="text-[9px] font-mono text-muted-foreground">Week 11 · 2026</span>
        </div>
        <h3 className="text-sm font-bold text-foreground">Wekelijkse Operationele Review</h3>
        <p className="text-[11px] text-muted-foreground mt-1">Overzicht van efficiëntie, openstaande issues, voorstellen en aanbevelingen voor de komende week.</p>
      </div>

      {/* Grouped items */}
      {categoryOrder.map(cat => {
        const items = grouped[cat];
        if (!items) return null;
        const cfg = reviewCategoryConfig[cat];
        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${cfg.text}`}>{cfg.label}</span>
              <span className="text-[9px] font-mono text-muted-foreground/40">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className={`rounded-lg border p-3 ${cfg.bg} ${cfg.border}`}>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-foreground">{item.title}</span>
                    <span className={`text-[9px] font-mono font-bold ${priorityStyles[item.priority].text}`}>
                      {priorityStyles[item.priority].label}
                    </span>
                    {item.owner && (
                      <span className="text-[9px] font-mono text-muted-foreground/50 ml-auto">→ {item.owner}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Main Page ── */
const ControlCenter = () => {
  const [activeTab, setActiveTab] = useState<CCTab>("sentinel");

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-4">
        {/* Page header */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center relative">
            <Shield className="w-5 h-5 text-primary" />
            <Activity className="w-2.5 h-2.5 text-primary absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide text-foreground uppercase">HBMaster Control Center</h1>
            <p className="text-[11px] text-muted-foreground font-mono">System health · Scheduler · Telemetry · Integrations · Governance</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border">V1.0</span>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">BETA</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border",
                  isActive
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="min-h-[60vh]">
          {activeTab === "sentinel" && <Sentinel embedded />}

          {activeTab === "scheduler" && (
            <div className="rounded-lg border border-border bg-card/40 overflow-hidden" style={{ minHeight: "500px" }}>
              <MCCronJobs />
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border bg-card/40 overflow-hidden">
                <TelemetryPanel />
              </div>
              <IHSectionShell title="Job Run Logs" icon={Timer}>
                <div className="space-y-1.5">
                  {[
                    { time: "14:33", job: "Koelcel Monitoring", msg: "ERROR: Sensor K3-B niet bereikbaar", level: "error" },
                    { time: "14:32", job: "Productie Sync", msg: "Sync voltooid — 847 records", level: "ok" },
                    { time: "14:28", job: "Email Service", msg: "SMTP timeout — retrying", level: "warn" },
                    { time: "14:24", job: "KPI Berekening", msg: "9 KPI's herberekend", level: "ok" },
                    { time: "14:23", job: "CRM Order Import", msg: "Voltooid — 41 orders", level: "ok" },
                    { time: "14:13", job: "CRM Order Import", msg: "Timeout bij batch #4820 — retry OK", level: "warn" },
                    { time: "14:02", job: "Logistics Tracker", msg: "12 routes bijgewerkt", level: "ok" },
                    { time: "13:32", job: "Logistics Tracker", msg: "API vertraagd — 8.2s response", level: "warn" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-2 font-mono text-[10px] px-2 py-1.5 rounded bg-muted/10">
                      <span className="text-muted-foreground/40 w-10 shrink-0">{log.time}</span>
                      <span className="text-muted-foreground/60 w-28 shrink-0 truncate">{log.job}</span>
                      <span className={cn(
                        log.level === "ok" ? "text-accent/70" : log.level === "warn" ? "text-yellow-500/70" : "text-destructive/80"
                      )}>{log.msg}</span>
                    </div>
                  ))}
                </div>
              </IHSectionShell>
            </div>
          )}

          {activeTab === "integrations" && (
            <IHSectionShell title="Integration Monitoring" icon={Link2}>
              <IntegrationPanel />
            </IHSectionShell>
          )}

          {activeTab === "review" && (
            <IHSectionShell title="Weekly Review" icon={FileText}>
              <WeeklyReviewPanel />
            </IHSectionShell>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
