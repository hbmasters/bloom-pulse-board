import { Shield, Radio, Database, RefreshCw, Server, AlertTriangle, Lock, Wifi } from "lucide-react";
import IHSectionShell from "@/components/intelligence-hub/IHSectionShell";
import {
  sentinelKPIs, services, commChannels, backupInfo, updates, securityRules, nodes, alerts,
  statusStyles, type SentinelStatus,
} from "@/components/sentinel/sentinel-data";

/* ── Shared status badge ── */
const StatusBadge = ({ status, label }: { status: SentinelStatus; label?: string }) => {
  const s = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {label ?? s.label}
    </span>
  );
};

/* ── Section 1: Header KPIs ── */
const KPIHeader = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
    {sentinelKPIs.map(k => (
      <div key={k.id} className={`rounded-lg border p-3 ${statusStyles[k.status].bg} ${statusStyles[k.status].border}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">{k.label}</span>
        </div>
        <StatusBadge status={k.status} />
        <p className="text-[10px] text-muted-foreground mt-1.5 leading-tight">{k.detail}</p>
      </div>
    ))}
  </div>
);

/* ── Section 2: Service Scanner ── */
const ServicePanel = () => (
  <div className="rounded-lg border border-border bg-card overflow-hidden">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border bg-muted/30">
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px]">Service</th>
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px]">Status</th>
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px] hidden sm:table-cell">Uptime</th>
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px] hidden md:table-cell">Last Check</th>
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px] hidden lg:table-cell">Action</th>
        </tr>
      </thead>
      <tbody>
        {services.map(s => (
          <tr key={s.name} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
            <td className="px-3 py-2.5 font-medium text-foreground">{s.name}</td>
            <td className="px-3 py-2.5"><StatusBadge status={s.status} /></td>
            <td className="px-3 py-2.5 text-muted-foreground hidden sm:table-cell font-mono">{s.uptime}</td>
            <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">{s.lastCheck}</td>
            <td className="px-3 py-2.5 text-muted-foreground hidden lg:table-cell">{s.action ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Section 3: Communication Guard ── */
const CommGuardPanel = () => {
  const typeLabel: Record<string, string> = { internal: "Internal", people_app: "People App", external: "External" };
  return (
    <div className="space-y-2">
      {commChannels.map(c => (
        <div key={c.name} className={`flex items-start gap-3 rounded-lg border p-3 ${statusStyles[c.status].bg} ${statusStyles[c.status].border}`}>
          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${statusStyles[c.status].dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-foreground">{c.name}</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50 border border-border">{typeLabel[c.type]}</span>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── Section 4: Backup ── */
const BackupPanel = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {backupInfo.map(b => (
      <div key={b.label} className="rounded-lg border border-border bg-card p-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">{b.label}</span>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-bold text-foreground">{b.value}</span>
          <StatusBadge status={b.status} />
        </div>
      </div>
    ))}
  </div>
);

/* ── Section 5: Updates ── */
const UpdatePanel = () => (
  <div className="rounded-lg border border-border bg-card overflow-hidden">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-border bg-muted/30">
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px]">Component</th>
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px]">Current</th>
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px]">Latest</th>
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px]">Status</th>
          <th className="text-left px-3 py-2 font-mono font-bold uppercase tracking-wider text-muted-foreground text-[10px] hidden md:table-cell">Note</th>
        </tr>
      </thead>
      <tbody>
        {updates.map(u => (
          <tr key={u.component} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
            <td className="px-3 py-2.5 font-medium text-foreground">{u.component}</td>
            <td className="px-3 py-2.5 font-mono text-muted-foreground">{u.current}</td>
            <td className="px-3 py-2.5 font-mono text-muted-foreground">{u.latest}</td>
            <td className="px-3 py-2.5"><StatusBadge status={u.status} /></td>
            <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">{u.note ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Section 6: Firewall / Security ── */
const SecurityPanel = () => (
  <div className="space-y-2">
    {securityRules.map(r => (
      <div key={r.rule} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
        <StatusBadge status={r.status} />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold text-foreground">{r.rule}</span>
          <p className="text-[11px] text-muted-foreground">{r.detail}</p>
        </div>
      </div>
    ))}
  </div>
);

/* ── Section 7: Node Health ── */
const NodePanel = () => (
  <div className="space-y-2">
    {nodes.map(n => (
      <div key={n.name} className={`rounded-lg border p-4 ${statusStyles[n.status].bg} ${statusStyles[n.status].border}`}>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-sm font-bold text-foreground">{n.name}</span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50 border border-border">{n.type}</span>
          <StatusBadge status={n.status} />
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>CPU <strong className="text-foreground">{n.cpu}</strong></span>
          <span>Memory <strong className="text-foreground">{n.memory}</strong></span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">{n.detail}</p>
      </div>
    ))}
    <div className="rounded-lg border border-dashed border-border p-3 text-center">
      <p className="text-[11px] text-muted-foreground font-mono">Future nodes will appear here when added to the fleet</p>
    </div>
  </div>
);

/* ── Section 8: Alerts ── */
const AlertsPanel = () => (
  <div className="space-y-2">
    {alerts.map(a => (
      <div key={a.id} className={`rounded-lg border p-3 ${statusStyles[a.severity].bg} ${statusStyles[a.severity].border}`}>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <StatusBadge status={a.severity} />
          <span className="text-[10px] text-muted-foreground ml-auto">{a.time}</span>
        </div>
        <p className="text-xs font-bold text-foreground">{a.title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{a.detail}</p>
      </div>
    ))}
  </div>
);

/* ── Main Page ── */
const Sentinel = () => (
  <div className="h-full overflow-y-auto">
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-wide text-foreground uppercase">HBMaster Sentinel</h1>
          <p className="text-[11px] text-muted-foreground font-mono">Platform security, health & communication control</p>
        </div>
        <span className="ml-auto text-[9px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-1 rounded border border-border bg-muted/30">Labs / Beta</span>
      </div>

      {/* S1 — KPI Header */}
      <KPIHeader />

      {/* S2 — Service Scanner */}
      <IHSectionShell title="Service Scanner" icon={<Wifi className="w-4 h-4" />}>
        <ServicePanel />
      </IHSectionShell>

      {/* S3 — Communication Guard */}
      <IHSectionShell title="Communication Guard" icon={<Radio className="w-4 h-4" />}>
        <CommGuardPanel />
      </IHSectionShell>

      {/* S4 — Backup */}
      <IHSectionShell title="Backup Status" icon={<Database className="w-4 h-4" />}>
        <BackupPanel />
      </IHSectionShell>

      {/* S5 — Updates */}
      <IHSectionShell title="Update & Patch Status" icon={<RefreshCw className="w-4 h-4" />}>
        <UpdatePanel />
      </IHSectionShell>

      {/* S6 — Firewall / Security */}
      <IHSectionShell title="Firewall & Security" icon={<Lock className="w-4 h-4" />}>
        <SecurityPanel />
      </IHSectionShell>

      {/* S7 — Node Health */}
      <IHSectionShell title="Node Health" icon={<Server className="w-4 h-4" />}>
        <NodePanel />
      </IHSectionShell>

      {/* S8 — Alerts & Incidents */}
      <IHSectionShell title="Alerts & Incidents" icon={<AlertTriangle className="w-4 h-4" />}>
        <AlertsPanel />
      </IHSectionShell>
    </div>
  </div>
);

export default Sentinel;
