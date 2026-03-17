
-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Execution intents table
CREATE TABLE public.execution_intents (
  id TEXT PRIMARY KEY,
  action_type TEXT NOT NULL,
  action_category TEXT NOT NULL DEFAULT 'operations',
  recommended_action TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  urgency_score INTEGER NOT NULL DEFAULT 50,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.70,
  execution_status TEXT NOT NULL DEFAULT 'proposed',
  execution_mode TEXT NOT NULL DEFAULT 'semi-auto',
  owner TEXT,
  due_date DATE,
  source_type TEXT NOT NULL DEFAULT 'strategic-insight',
  source_context TEXT,
  source_rule_id TEXT,
  risk_level TEXT NOT NULL DEFAULT 'medium',
  risk_type TEXT,
  reasoning TEXT,
  recommendation TEXT,
  execution_payload JSONB DEFAULT '{}'::jsonb,
  failure_reason TEXT,
  related_task_ids TEXT[] DEFAULT '{}',
  product_name TEXT,
  advised_price_action TEXT,
  current_price NUMERIC(10,2),
  proposed_delta_value NUMERIC(10,2),
  proposed_delta_pct NUMERIC(5,2),
  inventory_risk_type TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.execution_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorized users can view execution intents"
ON public.execution_intents FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'bandleider'));

CREATE POLICY "Admins can insert execution intents"
ON public.execution_intents FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authorized users can update execution intents"
ON public.execution_intents FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'bandleider'));

CREATE TRIGGER update_execution_intents_updated_at
BEFORE UPDATE ON public.execution_intents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
