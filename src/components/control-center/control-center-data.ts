// HBMaster Control Center — Integration & Weekly Review mock data

export type IntegrationStatus = "online" | "degraded" | "offline" | "reconnecting";
export type ControlStatus = "healthy" | "watch" | "warning" | "critical" | "stable" | "noisy" | "internal-only" | "review-needed";

export const controlStatusStyles: Record<ControlStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  healthy:        { label: "Healthy",        bg: "bg-accent/10",        text: "text-accent",              border: "border-accent/20",        dot: "bg-accent" },
  stable:         { label: "Stable",         bg: "bg-accent/8",         text: "text-accent/80",           border: "border-accent/15",        dot: "bg-accent/70" },
  watch:          { label: "Watch",          bg: "bg-yellow-500/10",    text: "text-yellow-500",          border: "border-yellow-500/20",    dot: "bg-yellow-500" },
  noisy:          { label: "Noisy",          bg: "bg-orange-400/10",    text: "text-orange-400",          border: "border-orange-400/20",    dot: "bg-orange-400 animate-pulse" },
  warning:        { label: "Warning",        bg: "bg-orange-500/10",    text: "text-orange-500",          border: "border-orange-500/20",    dot: "bg-orange-500" },
  critical:       { label: "Critical",       bg: "bg-destructive/10",   text: "text-destructive",         border: "border-destructive/20",   dot: "bg-destructive" },
  "internal-only":{ label: "Internal Only",  bg: "bg-blue-500/10",      text: "text-blue-500",            border: "border-blue-500/20",      dot: "bg-blue-500" },
  "review-needed":{ label: "Review Needed",  bg: "bg-violet-500/10",    text: "text-violet-500",          border: "border-violet-500/20",    dot: "bg-violet-500" },
};

export const integrationStatusStyles: Record<IntegrationStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  online:       { label: "Online",        bg: "bg-accent/10",        text: "text-accent",         border: "border-accent/20",        dot: "bg-accent" },
  degraded:     { label: "Degraded",      bg: "bg-yellow-500/10",    text: "text-yellow-500",     border: "border-yellow-500/20",    dot: "bg-yellow-500" },
  offline:      { label: "Offline",       bg: "bg-destructive/10",   text: "text-destructive",    border: "border-destructive/20",   dot: "bg-destructive" },
  reconnecting: { label: "Reconnecting",  bg: "bg-orange-500/10",    text: "text-orange-500",     border: "border-orange-500/20",    dot: "bg-orange-500 animate-pulse" },
};

export interface IntegrationItem {
  name: string;
  category: "messaging" | "crm" | "data" | "api";
  status: IntegrationStatus;
  uptime: string;
  lastError?: string;
  lastErrorTime?: string;
  detail: string;
}

export const integrations: IntegrationItem[] = [
  { name: "WhatsApp Gateway", category: "messaging", status: "online", uptime: "99.9%", detail: "Connected via Business API — 2,340 messages today" },
  { name: "Telegram Bot", category: "messaging", status: "online", uptime: "99.8%", detail: "Bot active — 12 notifications sent today" },
  { name: "HBM CRM", category: "crm", status: "degraded", uptime: "98.7%", lastError: "Sync latency spike — 8.2s response", lastErrorTime: "14:13", detail: "Order sync active — 41 orders processed last run" },
  { name: "Axerrio Data Warehouse", category: "data", status: "online", uptime: "99.95%", detail: "Bi-directional sync active — 847 records last batch" },
  { name: "HBM Florist API", category: "api", status: "online", uptime: "99.99%", detail: "Recipe and composition data flowing" },
  { name: "HBM Logistics Bridge", category: "api", status: "online", uptime: "99.9%", detail: "12 routes updated last cycle" },
  { name: "Kenya Data Sync", category: "data", status: "offline", uptime: "91.0%", lastError: "Paused by user — seasonal schedule", lastErrorTime: "08:00", detail: "Farm production data from HBM Kenya" },
  { name: "Email Notification Service", category: "messaging", status: "reconnecting", uptime: "97.2%", lastError: "SMTP timeout — retrying", lastErrorTime: "14:28", detail: "Transactional emails for reports and alerts" },
];

export interface WeeklyReviewItem {
  category: "efficiency" | "issue" | "proposal" | "todo" | "recommendation";
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
  owner?: string;
}

export const weeklyReview: WeeklyReviewItem[] = [
  // Efficiency
  { category: "efficiency", title: "Productie-efficiëntie stabiel op 94%", detail: "Lijn 1 en Lijn 3 boven target. Lijn 2 licht onder gemiddelde door receptwisseling.", priority: "medium" },
  { category: "efficiency", title: "Inkoop coverage 87% → 92%", detail: "Verbeterde dekkingsgraad door eerder bestellen bij voorkeursleveranciers.", priority: "low" },
  
  // Issues
  { category: "issue", title: "Koelcel sensor K3-B intermittent", detail: "Sensor geeft sporadisch geen data. Hardware check ingepland voor vrijdag.", priority: "high", owner: "Technische Dienst" },
  { category: "issue", title: "CRM sync latency boven threshold", detail: "Response times tot 8.2s. Axerrio team geïnformeerd. Monitoring opgevoerd.", priority: "medium", owner: "Data Team" },
  
  // Proposals
  { category: "proposal", title: "AI-gestuurde inkoopvoorspelling activeren", detail: "Pilot met historische data toont 15% betere prijsvoorspelling. Voorstel: live pilot week 13.", priority: "high", owner: "Inkoop" },
  { category: "proposal", title: "Automatische dagrapportage uitbreiden", detail: "Kwaliteitsdata toevoegen aan de 18:00 rapportage. Geschatte effort: 2 uur.", priority: "low", owner: "Development" },
  
  // TODOs
  { category: "todo", title: "Kanban board opschonen", detail: "12 kaarten ouder dan 2 weken. Archiveer of herplan.", priority: "medium" },
  { category: "todo", title: "Agent rollen reviewen", detail: "3 agents hebben overlappende verantwoordelijkheden. Consolideren.", priority: "low" },
  
  // Recommendations
  { category: "recommendation", title: "Backupfrequentie verhogen naar elke 2 uur", detail: "Huidige 4-uurs interval is voldoende maar bij groeiend datavolume wordt 2-uurs aangeraden.", priority: "medium" },
  { category: "recommendation", title: "Sentinel monitoring uitbreiden met Mac mini nodes", detail: "Bij aanschaf van extra hardware direct opnemen in node health monitoring.", priority: "low" },
];

export const reviewCategoryConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
  efficiency:     { label: "Efficiëntie",      bg: "bg-accent/10",       text: "text-accent",         border: "border-accent/20" },
  issue:          { label: "Openstaand Issue",  bg: "bg-destructive/10",  text: "text-destructive",    border: "border-destructive/20" },
  proposal:       { label: "Voorstel",          bg: "bg-blue-500/10",     text: "text-blue-500",       border: "border-blue-500/20" },
  todo:           { label: "TODO",              bg: "bg-yellow-500/10",   text: "text-yellow-500",     border: "border-yellow-500/20" },
  recommendation: { label: "Aanbeveling",       bg: "bg-violet-500/10",   text: "text-violet-500",     border: "border-violet-500/20" },
};

export const priorityStyles: Record<string, { label: string; text: string }> = {
  high:   { label: "Hoog",   text: "text-destructive" },
  medium: { label: "Medium", text: "text-yellow-500" },
  low:    { label: "Laag",   text: "text-muted-foreground" },
};
