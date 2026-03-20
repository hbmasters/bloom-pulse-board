/* Shared Kanban types & data — used by KanbanBoard + MCAgenda */

export type Priority = "high" | "medium" | "low";
export type Category = "productie" | "planning" | "logistiek" | "qc" | "personeel" | "koelcel";
export type Status = "todo" | "in_progress" | "review" | "done";
export type TaskType = "development" | "analysis";
export type AnalysisKind = "mapping" | "margin" | "procurement" | "production" | "logistics" | "quality" | "general";
export type AnalysisStatus = "pending" | "running" | "completed" | "blocked" | "stale";

export interface OvernightActivity {
  timestamp: string;
  description: string;
}

export interface AnalysisRun {
  run_id: string;
  methodiek_version: string;
  analysis_status: AnalysisStatus;
  result_summary: string;
  data_scope?: string;
  created_at: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  labels: string[];
  assignee?: string;
  status: Status;
  dueDate?: string;
  startTime?: string;
  stopTime?: string;
  createdAt: string;
  task_type: TaskType;
  analysis_kind?: AnalysisKind;
  analysis_status?: AnalysisStatus;
  methodiek_name?: string;
  methodiek_id?: string;
  methodiek_version?: string;
  result_ready_flag?: boolean;
  result_summary?: string;
  result_payload?: string;
  result_updated_at?: string;
  run_history?: AnalysisRun[];
  overnight_flag?: boolean;
  overnight_summary?: string;
  overnight_activity_log?: OvernightActivity[];
  last_activity_at?: string;
  // Recurring fields (for agenda integration)
  recurring?: boolean;
  recurrence_pattern?: "daily" | "weekly" | "biweekly" | "monthly";
  recurrence_label?: string;
  next_run_at?: string;
  last_run_at?: string;
  // Agent assignment
  agent?: string;
}
