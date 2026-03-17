import type { ExecutionStatus, ExecutionMode, RiskLevel, SourceType } from "./execution-types";

/* ── Pricing Action Types ── */
export type PriceAction = "hold" | "increase" | "decrease" | "review";

export interface PricingIntent {
  id: string;
  product_name: string;
  advised_price_action: PriceAction;
  current_price?: number;
  proposed_delta_value?: number;
  proposed_delta_pct?: number;
  urgency_score: number;
  confidence: number;
  reason: string;
  recommendation: string;
  execution_status: ExecutionStatus;
  execution_mode: ExecutionMode;
  priority: "critical" | "high" | "medium" | "low";
  owner?: string;
  due_date?: string;
  source_type: SourceType;
  source_context: string;
  source_rule_id?: string;
  risk_level: RiskLevel;
  created_at: string;
  updated_at?: string;
  execution_payload?: Record<string, unknown>;
  related_task_ids?: string[];
  failure_reason?: string;
}

export const priceActionConfig: Record<PriceAction, { label: string; bg: string; text: string; border: string; icon: string }> = {
  hold:     { label: "Hold",     bg: "bg-accent/10",       text: "text-accent",          border: "border-accent/20",       icon: "—" },
  increase: { label: "Verhogen", bg: "bg-orange-500/10",   text: "text-orange-500",      border: "border-orange-500/20",   icon: "↑" },
  decrease: { label: "Verlagen", bg: "bg-blue-500/10",     text: "text-blue-500",        border: "border-blue-500/20",     icon: "↓" },
  review:   { label: "Review",   bg: "bg-violet-500/10",   text: "text-violet-500",      border: "border-violet-500/20",   icon: "?" },
};

/* ── Inventory Risk Types ── */
export type InventoryRiskType = "oversupply" | "undersupply" | "stale_stock" | "margin_pressure";

export interface InventoryRiskIntent {
  id: string;
  product_name: string;
  risk_type: InventoryRiskType;
  severity: RiskLevel;
  recommended_action: string;
  urgency_score: number;
  confidence: number;
  reason: string;
  execution_status: ExecutionStatus;
  execution_mode: ExecutionMode;
  priority: "critical" | "high" | "medium" | "low";
  owner?: string;
  due_date?: string;
  source_type: SourceType;
  source_context: string;
  source_rule_id?: string;
  risk_level: RiskLevel;
  created_at: string;
  updated_at?: string;
  execution_payload?: Record<string, unknown>;
  related_task_ids?: string[];
  failure_reason?: string;
}

export const inventoryRiskConfig: Record<InventoryRiskType, { label: string; bg: string; text: string; border: string }> = {
  oversupply:      { label: "Overvoorraad",    bg: "bg-blue-500/10",       text: "text-blue-500",        border: "border-blue-500/20" },
  undersupply:     { label: "Tekort",          bg: "bg-destructive/10",    text: "text-destructive",     border: "border-destructive/20" },
  stale_stock:     { label: "Verouderd",       bg: "bg-orange-500/10",     text: "text-orange-500",      border: "border-orange-500/20" },
  margin_pressure: { label: "Margedruk",       bg: "bg-yellow-500/10",     text: "text-yellow-500",      border: "border-yellow-500/20" },
};
