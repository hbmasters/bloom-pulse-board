/* ── Build Radar mock data ── */

export type PhaseStatus = "done" | "active" | "queued" | "blocked";
export type NodeStatus = "active" | "standby" | "offline";
export type RiskSeverity = "high" | "medium" | "low";

export const currentBuild = {
  phase: "Frontend Wiring",
  task: "Build Radar — Page Integration",
  alive: true,
  timeRunning: "2h 14m",
  lastCompleted: "Control Center — Weekly Review panel",
  etaNextMilestone: "~45 min",
};

export const phases: {
  name: string;
  status: PhaseStatus;
  progress: number;
  dependency: string;
  node: string;
  blocker: string | null;
}[] = [
  { name: "Data Architecture", status: "done", progress: 100, dependency: "—", node: "Mac Studio", blocker: null },
  { name: "Backend Functions", status: "done", progress: 100, dependency: "Data Architecture", node: "Mac Studio", blocker: null },
  { name: "Core UI Shell", status: "done", progress: 100, dependency: "Backend Functions", node: "Mac Studio", blocker: null },
  { name: "Frontend Wiring", status: "active", progress: 68, dependency: "Core UI Shell", node: "Mac Studio", blocker: null },
  { name: "Integration Testing", status: "queued", progress: 0, dependency: "Frontend Wiring", node: "Mac Studio", blocker: "Awaiting wiring completion" },
  { name: "UAT & Polish", status: "queued", progress: 0, dependency: "Integration Testing", node: "Mac Studio", blocker: null },
  { name: "Deployment", status: "queued", progress: 0, dependency: "UAT & Polish", node: "Mac Studio", blocker: null },
];

export const nodes: {
  name: string;
  type: string;
  status: NodeStatus;
  role: string;
  activeAgent: string | null;
  load: number;
}[] = [
  { name: "Mac Studio", type: "Primary", status: "active", role: "Build Execution", activeAgent: "Lovable Orchestrator", load: 72 },
  { name: "Mac mini #1", type: "Worker", status: "standby", role: "Background Jobs", activeAgent: null, load: 0 },
  { name: "Mac mini #2", type: "Worker", status: "offline", role: "Reserved", activeAgent: null, load: 0 },
];

export const nodeStatusStyles: Record<NodeStatus, { dot: string; text: string; label: string }> = {
  active: { dot: "bg-accent", text: "text-accent", label: "Active" },
  standby: { dot: "bg-yellow-500", text: "text-yellow-500", label: "Standby" },
  offline: { dot: "bg-muted-foreground/30", text: "text-muted-foreground/50", label: "Offline" },
};

export const queue: {
  task: string;
  priority: "critical" | "high" | "normal";
  dependency: string;
  runtime: string;
  estimatedStart: string;
}[] = [
  { task: "Build Radar — Risk section", priority: "high", dependency: "Current task", runtime: "~20 min", estimatedStart: "Next" },
  { task: "Sentinel — live node polling", priority: "normal", dependency: "Build Radar", runtime: "~35 min", estimatedStart: "+55 min" },
  { task: "KPI — margin recalculation", priority: "normal", dependency: "None", runtime: "~15 min", estimatedStart: "+1h 30m" },
  { task: "Cron — error retry logic", priority: "high", dependency: "None", runtime: "~25 min", estimatedStart: "+1h 45m" },
];

export const priorityStyles: Record<string, { text: string; bg: string }> = {
  critical: { text: "text-destructive", bg: "bg-destructive/10" },
  high: { text: "text-orange-400", bg: "bg-orange-500/10" },
  normal: { text: "text-muted-foreground", bg: "bg-muted/20" },
};

export const backgroundLoad = {
  cronLoad: { active: 3, total: 12, label: "Cron Jobs Active" },
  telemetry: { signals: 847, rate: "12/min", label: "Telemetry Signals" },
  maintenance: { pending: 1, label: "Maintenance Jobs" },
  interference: "low" as "low" | "medium" | "high",
};

export const risks: {
  title: string;
  detail: string;
  severity: RiskSeverity;
  category: string;
}[] = [
  { title: "Frontend wiring delay", detail: "Complex component dependencies may slow integration by ~30 min", severity: "medium", category: "Build" },
  { title: "Missing CRM data source", detail: "Live CRM connector not yet available — using mock data", severity: "low", category: "Data" },
  { title: "Gateway instability", detail: "WhatsApp gateway showed 2 reconnect loops today", severity: "medium", category: "Integration" },
  { title: "Cron noise during build", detail: "3 cron jobs may trigger during active build window", severity: "low", category: "System" },
  { title: "Blocked test dependency", detail: "Integration testing blocked until frontend wiring completes", severity: "high", category: "Pipeline" },
];

export const riskStyles: Record<RiskSeverity, { bg: string; border: string; text: string; dot: string }> = {
  high: { bg: "bg-destructive/5", border: "border-destructive/20", text: "text-destructive", dot: "bg-destructive" },
  medium: { bg: "bg-orange-500/5", border: "border-orange-500/20", text: "text-orange-400", dot: "bg-orange-500" },
  low: { bg: "bg-muted/10", border: "border-border", text: "text-muted-foreground", dot: "bg-muted-foreground/40" },
};

export const timeline = {
  currentMilestone: "Control Center — all 5 tabs functional",
  nextMilestone: "Build Radar — fully integrated",
  nextPhase: "Integration Testing",
  etaNextResult: "~45 min",
};
