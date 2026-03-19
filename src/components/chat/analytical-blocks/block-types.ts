/**
 * HBM Analytical Block — Type Definitions
 * 
 * Extensible type system for all analytical chat blocks.
 */

import type { AnalyticalDomain } from "./block-domain-colors";

// ── Shared sub-types ──

export type BlockPeriodGranularity = "day" | "week" | "month" | "quarter" | "year" | "custom";

export interface BlockPeriod {
  granularity: BlockPeriodGranularity;
  label: string;           // e.g. "Week 12", "Maart 2026", "Ma 17 mrt"
  start?: string;          // ISO date
  end?: string;            // ISO date
  comparison?: string;     // e.g. "vs Week 11", "vs Vorig Jaar"
}

export interface BlockKPI {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
}

export interface BlockTableColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
}

export interface BlockTable {
  columns: BlockTableColumn[];
  rows: Record<string, string | number>[];
}

export interface BlockChartItem {
  label: string;
  value: number;
  value2?: number;
}

export interface BlockChart {
  type: "bar" | "line" | "comparison" | "progress";
  title?: string;
  data: BlockChartItem[];
  valueLabel?: string;
  value2Label?: string;
}

// ── Block variant data types ──

export interface ExecutiveSummaryData {
  block_type: "executive-summary";
  title: string;
  summary: string;
  key_findings?: string[];
  top_risks?: { issue: string; severity: "high" | "medium" | "low" }[];
  top_actions?: string[];
  kpis?: BlockKPI[];
  confidence?: number;
  status?: string;
}

export interface ProcurementActionData {
  block_type: "procurement-action";
  title: string;
  summary: string;
  items: {
    product: string;
    behoefte: number;
    voorraad: number;
    nog_nodig: number;
    supplier?: string;
    price?: number;
    priority: "critical" | "high" | "medium" | "low";
    action: string;
  }[];
  kpis?: BlockKPI[];
}

export interface ProductionEfficiencyData {
  block_type: "production-efficiency";
  title: string;
  summary: string;
  lines: {
    line: string;
    product?: string;
    w_apu: number;
    p_apu?: number;
    o_apu: number;
    stems_per_person?: number;
    deviation_pct: number;
  }[];
  top_losses?: string[];
  action_advice?: string;
  kpis?: BlockKPI[];
}

export interface MarginDeviationData {
  block_type: "margin-deviation";
  title: string;
  summary: string;
  items: {
    label: string;
    expected: number;
    actual: number;
    deviation_eur: number;
    deviation_pct: number;
    cause?: string;
    action?: string;
  }[];
  kpis?: BlockKPI[];
}

export interface FloritrackLogisticsData {
  block_type: "floritrack-logistics";
  title: string;
  summary: string;
  status_counts: { aangekocht: number; onderweg: number; afgeleverd: number; totaal: number };
  transactions: {
    id: string;
    article: string;
    status: "Aangekocht" | "Onderweg" | "Afgeleverd";
    supplier: string;
    destination: string;
    eta?: string;
    delay_minutes?: number;
    bouquets?: { name: string; quantity: number; departure?: string }[];
  }[];
}

export interface AlertExceptionData {
  block_type: "alert-exception";
  title: string;
  summary: string;
  alerts: {
    severity: "critical" | "high" | "medium" | "low";
    domain: string;
    issue: string;
    impact: string;
    action: string;
  }[];
  kpis?: BlockKPI[];
}

export interface ComparisonData {
  block_type: "comparison";
  title: string;
  summary: string;
  dimension: string; // e.g. "Leverancier", "Product", "Klant"
  items: {
    name: string;
    metrics: { label: string; value: number; unit?: string }[];
  }[];
  conclusion?: string;
}

export interface DecisionData {
  block_type: "decision";
  title: string;
  summary: string;
  decisions: {
    decision: string;
    reason: string;
    impact: string;
    risk: "high" | "medium" | "low";
    urgency: "now" | "today" | "this_week" | "later";
    execution_mode?: "auto" | "semi-auto" | "manual";
  }[];
}

// ── Union type ──

export type AnalyticalBlockData =
  | ExecutiveSummaryData
  | ProcurementActionData
  | ProductionEfficiencyData
  | MarginDeviationData
  | FloritrackLogisticsData
  | AlertExceptionData
  | ComparisonData
  | DecisionData;

// ── Block type to domain mapping ──

export const BLOCK_DOMAIN_MAP: Record<AnalyticalBlockData["block_type"], AnalyticalDomain> = {
  "executive-summary": "executive",
  "procurement-action": "procurement",
  "production-efficiency": "production",
  "margin-deviation": "margin",
  "floritrack-logistics": "logistics",
  "alert-exception": "alert",
  "comparison": "compare",
  "decision": "decision",
};

// ── Block labels for toggle buttons ──

export const BLOCK_LABELS: Record<AnalyticalBlockData["block_type"], string> = {
  "executive-summary": "Executive Summary",
  "procurement-action": "Inkoopacties",
  "production-efficiency": "Productie Efficiency",
  "margin-deviation": "Marge Afwijking",
  "floritrack-logistics": "Logistiek Overzicht",
  "alert-exception": "Alerts & Uitzonderingen",
  "comparison": "Vergelijking",
  "decision": "Beslissingsadvies",
};
