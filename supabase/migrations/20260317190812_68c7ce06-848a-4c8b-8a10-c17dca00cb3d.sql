-- Allow normal authenticated users to read execution intents (read-only)
CREATE POLICY "All authenticated users can view execution intents"
ON public.execution_intents
FOR SELECT
TO authenticated
USING (true);

-- Drop the old restrictive select policy
DROP POLICY IF EXISTS "Authorized users can view execution intents" ON public.execution_intents;
