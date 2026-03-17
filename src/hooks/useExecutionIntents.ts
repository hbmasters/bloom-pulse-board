import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ExecutionIntentRow {
  id: string;
  action_type: string;
  action_category: string;
  recommended_action: string;
  priority: string;
  urgency_score: number;
  confidence: number;
  execution_status: string;
  execution_mode: string;
  owner: string | null;
  due_date: string | null;
  source_type: string;
  source_context: string | null;
  source_rule_id: string | null;
  risk_level: string;
  risk_type: string | null;
  reasoning: string | null;
  recommendation: string | null;
  execution_payload: Record<string, unknown> | null;
  failure_reason: string | null;
  related_task_ids: string[] | null;
  product_name: string | null;
  advised_price_action: string | null;
  current_price: number | null;
  proposed_delta_value: number | null;
  proposed_delta_pct: number | null;
  inventory_risk_type: string | null;
  severity: string | null;
  created_at: string;
  updated_at: string;
}

type PatchFields = Partial<Pick<ExecutionIntentRow, "execution_status" | "owner" | "due_date" | "failure_reason">>;

export function useExecutionIntents(category?: string) {
  const [intents, setIntents] = useState<ExecutionIntentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [patchingId, setPatchingId] = useState<string | null>(null);

  const fetchIntents = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("execution_intents").select("*").order("urgency_score", { ascending: false });
    if (category) {
      query = query.eq("action_category", category);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Failed to fetch execution intents:", error);
      // Fallback: keep current state
    } else {
      setIntents((data as unknown as ExecutionIntentRow[]) || []);
    }
    setLoading(false);
  }, [category]);

  useEffect(() => {
    fetchIntents();
  }, [fetchIntents]);

  const patchIntent = useCallback(async (id: string, fields: PatchFields) => {
    setPatchingId(id);

    // Optimistic update
    setIntents(prev => prev.map(i => i.id === id ? { ...i, ...fields } : i));

    const { error } = await supabase
      .from("execution_intents")
      .update(fields as Record<string, unknown>)
      .eq("id", id);

    if (error) {
      console.error("Patch failed:", error);
      toast({
        title: "Fout bij opslaan",
        description: error.message || "Kon de wijziging niet opslaan. Probeer opnieuw.",
        variant: "destructive",
      });
      // Rollback
      await fetchIntents();
    } else {
      toast({
        title: "Opgeslagen",
        description: `${id} succesvol bijgewerkt.`,
      });
    }

    setPatchingId(null);
  }, [fetchIntents]);

  const approve = useCallback((id: string) => patchIntent(id, { execution_status: "approved" }), [patchIntent]);
  const reject = useCallback((id: string) => patchIntent(id, { execution_status: "rejected" }), [patchIntent]);
  const cancel = useCallback((id: string) => patchIntent(id, { execution_status: "cancelled" }), [patchIntent]);
  const confirm = useCallback((id: string) => patchIntent(id, { execution_status: "in_progress" }), [patchIntent]);
  const retry = useCallback((id: string) => patchIntent(id, { execution_status: "proposed", failure_reason: null }), [patchIntent]);
  const setOwner = useCallback((id: string, owner: string) => patchIntent(id, { owner }), [patchIntent]);
  const setDueDate = useCallback((id: string, due_date: string) => patchIntent(id, { due_date }), [patchIntent]);

  return {
    intents,
    loading,
    patchingId,
    refetch: fetchIntents,
    approve,
    reject,
    cancel,
    confirm,
    retry,
    setOwner,
    setDueDate,
    patchIntent,
  };
}
