/**
 * HBM Analytical Block — Registry
 * 
 * Central registry that maps block_type to the correct renderer.
 * To add a new block variant: create component, add to this registry.
 */

import type { AnalyticalBlockData } from "./block-types";
import { ExecutiveSummaryBlock } from "./variants/ExecutiveSummaryBlock";
import { ProcurementActionBlock } from "./variants/ProcurementActionBlock";
import { ProductionEfficiencyBlock } from "./variants/ProductionEfficiencyBlock";
import { MarginDeviationBlock } from "./variants/MarginDeviationBlock";
import { FloritrackLogisticsBlock } from "./variants/FloritrackLogisticsBlock";
import { AlertExceptionBlock } from "./variants/AlertExceptionBlock";
import { ComparisonBlock } from "./variants/ComparisonBlock";
import { DecisionBlock } from "./variants/DecisionBlock";

/**
 * Renders the correct analytical block based on block_type.
 * Returns null for unknown types (extensible — just add new cases).
 */
export const AnalyticalBlock = ({ data }: { data: AnalyticalBlockData }) => {
  switch (data.block_type) {
    case "executive-summary":
      return <ExecutiveSummaryBlock data={data} />;
    case "procurement-action":
      return <ProcurementActionBlock data={data} />;
    case "production-efficiency":
      return <ProductionEfficiencyBlock data={data} />;
    case "margin-deviation":
      return <MarginDeviationBlock data={data} />;
    case "floritrack-logistics":
      return <FloritrackLogisticsBlock data={data} />;
    case "alert-exception":
      return <AlertExceptionBlock data={data} />;
    case "comparison":
      return <ComparisonBlock data={data} />;
    case "decision":
      return <DecisionBlock data={data} />;
    default:
      return null;
  }
};

/**
 * Parse a hbmaster-block from message content.
 */
export function parseAnalyticalBlock(content: string): {
  text: string;
  block: AnalyticalBlockData | null;
} {
  const match = content.match(/```hbmaster-block\n([\s\S]*?)```/);
  if (!match) return { text: content, block: null };
  try {
    const block = JSON.parse(match[1]) as AnalyticalBlockData;
    const text = content.replace(/```hbmaster-block\n[\s\S]*?```/, "").trim();
    return { text, block };
  } catch {
    return { text: content, block: null };
  }
}
