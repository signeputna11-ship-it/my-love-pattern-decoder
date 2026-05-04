-- 1. Restrictive write policies on kit_resources (deny all writes to authenticated; service role bypasses RLS)
CREATE POLICY "kit_resources_no_insert" ON public.kit_resources
  AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "kit_resources_no_update" ON public.kit_resources
  AS RESTRICTIVE FOR UPDATE TO authenticated USING (false);
CREATE POLICY "kit_resources_no_delete" ON public.kit_resources
  AS RESTRICTIVE FOR DELETE TO authenticated USING (false);

-- 2. Restrictive write policies on tools
CREATE POLICY "tools_no_insert" ON public.tools
  AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (false);
CREATE POLICY "tools_no_update" ON public.tools
  AS RESTRICTIVE FOR UPDATE TO authenticated USING (false);
CREATE POLICY "tools_no_delete" ON public.tools
  AS RESTRICTIVE FOR DELETE TO authenticated USING (false);

-- 3. Storage bucket write protection for secure-response-relationship-kit
CREATE POLICY "secure_kit_no_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'secure-response-relationship-kit' AND false);
CREATE POLICY "secure_kit_no_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'secure-response-relationship-kit' AND false);
CREATE POLICY "secure_kit_no_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'secure-response-relationship-kit' AND false);

-- 4. Gate exercises and modules behind paid access
DROP POLICY IF EXISTS "exercises_read_authenticated" ON public.exercises;
CREATE POLICY "exercises_read_paid" ON public.exercises
  FOR SELECT TO authenticated
  USING (public.has_paid_access(auth.uid()));

DROP POLICY IF EXISTS "modules_read_authenticated" ON public.modules;
CREATE POLICY "modules_read_paid" ON public.modules
  FOR SELECT TO authenticated
  USING (public.has_paid_access(auth.uid()));

-- 5. Revoke EXECUTE on has_paid_access from authenticated/anon. RLS policies
-- run with definer privileges of the policy and can still call it internally.
REVOKE EXECUTE ON FUNCTION public.has_paid_access(uuid) FROM PUBLIC, anon, authenticated;
