// HBMaster Sentinel — system health, security & communication guard data

export type SentinelStatus = "healthy" | "watch" | "warning" | "critical" | "protected" | "isolated" | "outdated";

export const statusStyles: Record<SentinelStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  healthy:   { label: "Healthy",   bg: "bg-accent/10",       text: "text-accent",       border: "border-accent/20",       dot: "bg-accent" },
  watch:     { label: "Watch",     bg: "bg-yellow-500/10",   text: "text-yellow-500",   border: "border-yellow-500/20",   dot: "bg-yellow-500" },
  warning:   { label: "Warning",   bg: "bg-orange-500/10",   text: "text-orange-500",   border: "border-orange-500/20",   dot: "bg-orange-500" },
  critical:  { label: "Critical",  bg: "bg-destructive/10",  text: "text-destructive",  border: "border-destructive/20",  dot: "bg-destructive" },
  protected: { label: "Protected", bg: "bg-blue-500/10",     text: "text-blue-500",     border: "border-blue-500/20",     dot: "bg-blue-500" },
  isolated:  { label: "Isolated",  bg: "bg-violet-500/10",   text: "text-violet-500",   border: "border-violet-500/20",   dot: "bg-violet-500" },
  outdated:  { label: "Outdated",  bg: "bg-muted",           text: "text-muted-foreground", border: "border-border",      dot: "bg-muted-foreground" },
};

// ── Section 1: Header KPIs ──
export interface SentinelKPI {
  id: string;
  label: string;
  status: SentinelStatus;
  detail: string;
}

export const sentinelKPIs: SentinelKPI[] = [
  { id: "sys-health",    label: "System Health",        status: "healthy",   detail: "All core services operational" },
  { id: "comm-guard",    label: "Communication Guard",  status: "protected", detail: "External channels blocked" },
  { id: "firewall",      label: "Firewall Status",      status: "healthy",   detail: "All rules active" },
  { id: "backup",        label: "Backup Status",        status: "healthy",   detail: "Last backup 4h ago" },
  { id: "updates",       label: "Update Status",        status: "watch",     detail: "1 patch pending" },
  { id: "node-health",   label: "Node Health",          status: "healthy",   detail: "1/1 nodes online" },
  { id: "sec-alerts",    label: "Security Alerts",      status: "warning",   detail: "1 open recommendation" },
];

// ── Section 2: Services ──
export interface ServiceItem {
  name: string;
  status: SentinelStatus;
  uptime: string;
  lastCheck: string;
  action?: string;
}

export const services: ServiceItem[] = [
  { name: "HBM Control API",       status: "healthy",  uptime: "99.98%", lastCheck: "2 min ago" },
  { name: "HBM Data Pipeline",     status: "healthy",  uptime: "99.95%", lastCheck: "1 min ago" },
  { name: "HBM CRM Sync",          status: "watch",    uptime: "98.70%", lastCheck: "5 min ago", action: "Monitor sync latency" },
  { name: "HBM Logistics Bridge",  status: "healthy",  uptime: "99.90%", lastCheck: "3 min ago" },
  { name: "HBM Florist Gateway",   status: "healthy",  uptime: "99.99%", lastCheck: "1 min ago" },
  { name: "OpenClaw Orchestrator",  status: "healthy",  uptime: "99.80%", lastCheck: "4 min ago" },
  { name: "Cron Scheduler",        status: "healthy",  uptime: "100%",   lastCheck: "30 sec ago" },
  { name: "Telemetry Collector",   status: "healthy",  uptime: "99.99%", lastCheck: "1 min ago" },
];

// ── Section 3: Communication Guard ──
export interface CommChannel {
  name: string;
  type: "internal" | "people_app" | "external";
  status: SentinelStatus;
  detail: string;
}

export const commChannels: CommChannel[] = [
  { name: "Internal Telemetry",        type: "internal",   status: "protected", detail: "Telemetry internal only — no external routing" },
  { name: "HBM People App",            type: "people_app", status: "isolated",  detail: "People App channel isolated and safe" },
  { name: "Webhook Outbound",          type: "external",   status: "protected", detail: "No active external webhooks" },
  { name: "Email Notifications",       type: "external",   status: "protected", detail: "Scoped to admin recipients only" },
  { name: "External Messaging Hooks",  type: "external",   status: "warning",   detail: "Unsafe messaging hook detected — review required" },
];

// ── Section 4: Backup ──
export interface BackupEntry {
  label: string;
  value: string;
  status: SentinelStatus;
}

export const backupInfo: BackupEntry[] = [
  { label: "Last Full Backup",    value: "15 Mar 2026, 02:00",  status: "healthy" },
  { label: "Backup Age",          value: "4 hours",             status: "healthy" },
  { label: "Backup Size",         value: "2.4 GB",              status: "healthy" },
  { label: "Restore Readiness",   value: "Verified",            status: "healthy" },
  { label: "Incremental Backup",  value: "15 Mar 2026, 05:30",  status: "healthy" },
  { label: "Off-site Copy",       value: "Synced",              status: "protected" },
];

// ── Section 5: Updates ──
export interface UpdateItem {
  component: string;
  current: string;
  latest: string;
  status: SentinelStatus;
  note?: string;
}

export const updates: UpdateItem[] = [
  { component: "HBM Core",            current: "2.14.1", latest: "2.14.1", status: "healthy" },
  { component: "OpenClaw Runtime",     current: "1.8.0",  latest: "1.8.2",  status: "watch",   note: "Minor patch available" },
  { component: "Data Pipeline",       current: "3.2.0",  latest: "3.2.0",  status: "healthy" },
  { component: "Security Module",     current: "1.5.4",  latest: "1.5.4",  status: "healthy" },
  { component: "CRM Connector",       current: "0.9.1",  latest: "0.9.3",  status: "watch",   note: "Stability patch recommended" },
];

// ── Section 6: Firewall / Security ──
export interface SecurityRule {
  rule: string;
  status: SentinelStatus;
  detail: string;
}

export const securityRules: SecurityRule[] = [
  { rule: "Inbound Firewall",            status: "healthy",   detail: "All ports filtered, only approved traffic" },
  { rule: "Outbound Policy",             status: "protected", detail: "Strict allowlist enforced" },
  { rule: "Webhook Validation",          status: "warning",   detail: "1 unverified webhook endpoint — review recommended" },
  { rule: "API Key Rotation",            status: "healthy",   detail: "All keys rotated within policy" },
  { rule: "TLS / Certificate Status",    status: "healthy",   detail: "Valid, 287 days remaining" },
  { rule: "Communication Isolation",     status: "protected", detail: "Telemetry and People App fully isolated" },
];

// ── Section 7: Nodes ──
export interface NodeItem {
  name: string;
  type: string;
  status: SentinelStatus;
  cpu: string;
  memory: string;
  detail: string;
}

export const nodes: NodeItem[] = [
  { name: "Mac Studio — Primary", type: "Orchestrator", status: "healthy", cpu: "12%", memory: "38%", detail: "All runners active" },
];

// ── Section 8: Alerts ──
export interface AlertItem {
  id: string;
  severity: SentinelStatus;
  title: string;
  detail: string;
  time: string;
}

export const alerts: AlertItem[] = [
  { id: "a1", severity: "warning",  title: "External messaging risk detected",               detail: "An unverified webhook was registered. Telemetry should remain internal only.", time: "2h ago" },
  { id: "a2", severity: "watch",    title: "CRM Connector patch available",                   detail: "Version 0.9.3 improves sync stability. Recommended update.", time: "6h ago" },
  { id: "a3", severity: "healthy",  title: "People App channel isolated and safe",            detail: "Communication guard confirmed: People App has no external routing.", time: "1d ago" },
  { id: "a4", severity: "healthy",  title: "Full backup completed successfully",              detail: "2.4 GB snapshot stored and verified.", time: "4h ago" },
];
