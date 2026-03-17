export interface AnalysisKPI {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
}

export interface AnalysisTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

export interface AnalysisTableData {
  columns: AnalysisTableColumn[];
  rows: Record<string, string | number>[];
}

export interface AnalysisChartDataPoint {
  label: string;
  value: number;
  value2?: number;
}

export interface AnalysisChart {
  type: "bar" | "line" | "stacked-bar";
  title: string;
  data: AnalysisChartDataPoint[];
  color?: string;
  color2?: string;
  valueLabel?: string;
  value2Label?: string;
}

export type AnalysisStatus = "pending" | "running" | "completed" | "blocked" | "stale";

export interface AnalysisMethodiekMeta {
  methodiek_name: string;
  methodiek_id?: string;
  methodiek_version?: string;
  analysis_kind?: string;
  data_sources?: string[];
  query_scope?: string;
}

export interface AnalysisRunEntry {
  run_id: string;
  methodiek_version: string;
  analysis_status: AnalysisStatus;
  result_summary: string;
  data_scope?: string;
  created_at: string;
}

export interface AnalysisPresentationData {
  // Header
  title: string;
  task_type?: "development" | "analysis";
  status?: AnalysisStatus;
  result_ready?: boolean;
  updated_at?: string;

  // Executive summary
  summary?: string;

  // KPI strip
  kpis?: AnalysisKPI[];

  // Table
  table?: AnalysisTableData;

  // Chart
  chart?: AnalysisChart;

  // Methodiek meta
  methodiek?: AnalysisMethodiekMeta;

  // Full detail
  detail_payload?: string;

  // Run history
  run_history?: AnalysisRunEntry[];
}
