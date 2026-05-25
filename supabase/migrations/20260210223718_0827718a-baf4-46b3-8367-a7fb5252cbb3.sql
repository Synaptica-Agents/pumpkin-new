
-- Drop overly permissive INSERT policy and replace with service-role only approach
-- The edge function uses service_role key, so no separate INSERT policy needed for anon
DROP POLICY "Service role can insert explanations" ON public.mental_math_explanations;
