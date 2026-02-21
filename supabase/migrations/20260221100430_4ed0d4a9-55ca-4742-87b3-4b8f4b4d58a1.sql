-- Allow bandleiders to insert line products
CREATE POLICY "Bandleiders can insert line products"
ON public.line_products
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'bandleider'::app_role));
