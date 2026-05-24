
-- 1. Fix overly permissive purchases policy: drop public token-based read.
-- All purchase reads go through server functions using the service role,
-- which bypasses RLS. The previous policy exposed every purchase row to any
-- anon/authenticated caller.
DROP POLICY IF EXISTS "purchases_select_by_token" ON public.purchases;

-- 2. Add explicit service-role-only policies for worksheet_responses
-- (RLS is enabled with no policies; all access already goes through
-- supabaseAdmin in server functions. Make intent explicit and prevent
-- accidental future exposure.)
CREATE POLICY "worksheet_responses_service_role_all"
ON public.worksheet_responses
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 3. Same for kit_stage_progress.
CREATE POLICY "kit_stage_progress_service_role_all"
ON public.kit_stage_progress
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 4. Add explicit service-role write policies for email_sequence_log.
CREATE POLICY "email_sequence_log_service_insert"
ON public.email_sequence_log
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role');

-- 5. Set fixed search_path on SECURITY DEFINER functions that lack it.
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

-- 6. Revoke public/anon/authenticated EXECUTE on pgmq-wrapping helper
-- functions. These are SECURITY DEFINER and should only be invoked by the
-- service role from server code.
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
