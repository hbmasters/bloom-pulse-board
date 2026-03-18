import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SupplierOffer, CustomerProductLine, AIAdvice, Urgency, ProcurementStatus } from "@/components/procurement-cockpit-v1/procurement-cockpit-v1-data";

export type SnapshotStatusLabel = "gedekt" | "deels" | "actie_nodig" | "onbekend";

export interface ProcurementSnapshotRow {
  id: string;
  product: string;
  stem_length: string | null;
  product_family: string;
  buyer: string | null;
  required_volume: number;
  available_stock: number;
  reserved_stock: number;
  free_stock: number;
  open_buy_need: number;
  historical_price: number;
  offer_price: number;
  advised_price: number;
  market_price: number | null;
  variance_vs_calculated: number;
  preferred_supplier: string | null;
  supplier_quality: number | null;
  supplier_reliability: number | null;
  supplier_score: number | null;
  external_quality: string | null;
  internal_quality: number | null;
  ai_advice: string | null;
  urgency: string;
  status_label: SnapshotStatusLabel;
  procurement_status: string | null;
  execution_intent_id: string | null;
  execution_status: string | null;
  action_summary: string | null;
  reasoning: string | null;
  procurement_rule_id: string | null;
  customer_product_lines: CustomerProductLine[];
  supplier_offers: SupplierOffer[];
  snapshot_date: string;
  created_at: string;
  updated_at: string;
}

export interface SnapshotFilters {
  search?: string;
  family?: string | null;
  buyer?: string | null;
  urgency?: string | null;
  statusLabel?: SnapshotStatusLabel | null;
  actionReadyOnly?: boolean;
}

export function useProcurementSnapshot() {
  const [rows, setRows] = useState<ProcurementSnapshotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshot = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("procurement_snapshot_rows")
      .select("*")
      .order("urgency", { ascending: false });

    if (fetchError) {
      console.error("Failed to fetch procurement snapshot:", fetchError);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const mapped: ProcurementSnapshotRow[] = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      product: row.product as string,
      stem_length: row.stem_length as string | null,
      product_family: row.product_family as string,
      buyer: row.buyer as string | null,
      required_volume: (row.required_volume as number) || 0,
      available_stock: (row.available_stock as number) || 0,
      reserved_stock: (row.reserved_stock as number) || 0,
      free_stock: (row.free_stock as number) || 0,
      open_buy_need: (row.open_buy_need as number) || 0,
      historical_price: (row.historical_price as number) || 0,
      offer_price: (row.offer_price as number) || 0,
      advised_price: (row.advised_price as number) || 0,
      market_price: row.market_price as number | null,
      variance_vs_calculated: (row.variance_vs_calculated as number) || 0,
      preferred_supplier: row.preferred_supplier as string | null,
      supplier_quality: row.supplier_quality as number | null,
      supplier_reliability: row.supplier_reliability as number | null,
      supplier_score: row.supplier_score as number | null,
      external_quality: row.external_quality as string | null,
      internal_quality: row.internal_quality as number | null,
      ai_advice: row.ai_advice as string | null,
      urgency: (row.urgency as string) || "low",
      status_label: (row.status_label as SnapshotStatusLabel) || "onbekend",
      procurement_status: row.procurement_status as string | null,
      execution_intent_id: row.execution_intent_id as string | null,
      execution_status: row.execution_status as string | null,
      action_summary: row.action_summary as string | null,
      reasoning: row.reasoning as string | null,
      procurement_rule_id: row.procurement_rule_id as string | null,
      customer_product_lines: Array.isArray(row.customer_product_lines) ? row.customer_product_lines as CustomerProductLine[] : [],
      supplier_offers: Array.isArray(row.supplier_offers) ? row.supplier_offers as SupplierOffer[] : [],
      snapshot_date: row.snapshot_date as string,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    }));

    setRows(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSnapshot();
  }, [fetchSnapshot]);

  const families = useMemo(() => [...new Set(rows.map(r => r.product_family))].sort(), [rows]);
  const buyers = useMemo(() => [...new Set(rows.map(r => r.buyer).filter(Boolean) as string[])].sort(), [rows]);

  return {
    rows,
    loading,
    error,
    refetch: fetchSnapshot,
    families,
    buyers,
  };
}
