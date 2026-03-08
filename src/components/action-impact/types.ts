import type { Department, ProductionSub } from "@/components/department/DepartmentBadge";

export type ActionStatus = "open" | "in_progress" | "completed";
export type EffortLevel = "Low" | "Medium" | "High";
export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";
export type RiskReduction = "high" | "medium" | "low" | "none";

export interface ActionImpact {
  impact_financial?: number;        // € per year
  impact_efficiency?: number;       // W-APU delta
  impact_risk_reduction?: RiskReduction;
  impact_supply_stability?: number; // percentage points
}

export interface ActionItem extends ActionImpact {
  id: string;
  action_title: string;
  department_owner: Department;
  sub_department?: ProductionSub;
  driver: string;
  flower?: string;
  recommended_action: string;
  expected_impact: string;
  effort_level: EffortLevel;
  priority: PriorityLevel;
  status: ActionStatus;
  probability?: number;             // 0–1, used for priority score
  data_sources_used: string[];
  source_signal?: string;           // originating intelligence signal
  constraints?: string;
}

/** priority_score = financial_impact × probability / effort */
export function calcPriorityScore(a: ActionItem): number {
  const fin = a.impact_financial ?? 0;
  const prob = a.probability ?? 0.7;
  const effortMap: Record<EffortLevel, number> = { Low: 1, Medium: 2, High: 3 };
  const effort = effortMap[a.effort_level];
  return fin * prob / effort;
}
