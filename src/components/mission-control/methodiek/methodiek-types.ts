export interface MethodiekDataSource {
  name: string;
  type: "api" | "database" | "csv" | "manual" | "erp";
  required: boolean;
}

export interface MethodiekOutputSection {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "list" | "json";
  required: boolean;
}

export interface MethodiekOutputModel {
  result_summary_template: string;
  result_payload_structure: string;
  result_ready_behavior: string;
  sections: MethodiekOutputSection[];
}

export type MethodiekStatus = "active" | "inactive";
export type AnalysisKind = "mapping" | "margin" | "procurement" | "production" | "logistics" | "quality" | "general";

export interface Methodiek {
  id: string;
  methodiek_id: string;
  name: string;
  description: string;
  analysis_kind: AnalysisKind;
  status: MethodiekStatus;
  version: string;
  base_prompt: string;
  data_sources: MethodiekDataSource[];
  output_model: MethodiekOutputModel;
  updated_at: string;
  created_at: string;
  total_runs: number;
  accuracy?: number;
}
