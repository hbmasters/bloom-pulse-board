export type ExecutionStatus =
  | "proposed"
  | "approved"
  | "prepared"
  | "in_progress"
  | "completed"
  | "failed"
  | "cancelled"
  | "rejected";

export type ExecutionMode = "semi-auto" | "manual" | "auto";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type SourceType = "strategic-insight" | "forecast" | "sentinel" | "procurement" | "commercial" | "production";

export interface ExecutionIntent {
  id: string;
  action_type: string;
  recommended_action: string;
  priority: "critical" | "high" | "medium" | "low";
  urgency_score: number; // 0–100
  confidence: number; // 0–1
  execution_status: ExecutionStatus;
  execution_mode: ExecutionMode;
  owner?: string;
  due_date?: string;
  source_type: SourceType;
  source_context: string;
  created_at: string;
  updated_at?: string;
  reasoning?: string;
  execution_payload?: Record<string, unknown>;
  risk_level: RiskLevel;
  risk_type?: string;
  related_task_ids?: string[];
  failure_reason?: string;
}

export const executionStatusConfig: Record<ExecutionStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  proposed:    { label: "Voorgesteld",  bg: "bg-blue-500/10",        text: "text-blue-500",        border: "border-blue-500/20",        dot: "bg-blue-500" },
  approved:    { label: "Goedgekeurd", bg: "bg-accent/10",          text: "text-accent",          border: "border-accent/20",          dot: "bg-accent" },
  prepared:    { label: "Voorbereid",  bg: "bg-cyan-500/10",        text: "text-cyan-500",        border: "border-cyan-500/20",        dot: "bg-cyan-500" },
  in_progress: { label: "In Uitvoering", bg: "bg-yellow-500/10",   text: "text-yellow-500",      border: "border-yellow-500/20",      dot: "bg-yellow-500 animate-pulse" },
  completed:   { label: "Afgerond",    bg: "bg-accent/10",          text: "text-accent",          border: "border-accent/20",          dot: "bg-accent" },
  failed:      { label: "Mislukt",     bg: "bg-destructive/10",     text: "text-destructive",     border: "border-destructive/20",     dot: "bg-destructive" },
  cancelled:   { label: "Geannuleerd", bg: "bg-muted/20",           text: "text-muted-foreground", border: "border-border",            dot: "bg-muted-foreground" },
  rejected:    { label: "Afgewezen",   bg: "bg-orange-500/10",      text: "text-orange-500",      border: "border-orange-500/20",      dot: "bg-orange-500" },
};

export const riskLevelConfig: Record<RiskLevel, { label: string; text: string }> = {
  low:      { label: "Laag",     text: "text-accent" },
  medium:   { label: "Medium",   text: "text-yellow-500" },
  high:     { label: "Hoog",     text: "text-orange-500" },
  critical: { label: "Kritiek",  text: "text-destructive" },
};

export const sourceTypeConfig: Record<SourceType, { label: string; text: string }> = {
  "strategic-insight": { label: "Strategic Insight", text: "text-violet-500" },
  forecast:            { label: "Forecast",          text: "text-blue-500" },
  sentinel:            { label: "Sentinel",          text: "text-cyan-500" },
  procurement:         { label: "Inkoop",            text: "text-accent" },
  commercial:          { label: "Commercieel",       text: "text-yellow-500" },
  production:          { label: "Productie",         text: "text-orange-500" },
};

export const executionModeConfig: Record<ExecutionMode, { label: string; text: string }> = {
  "semi-auto": { label: "Semi-Auto", text: "text-cyan-500" },
  manual:      { label: "Manueel",   text: "text-muted-foreground" },
  auto:        { label: "Auto",      text: "text-accent" },
};
