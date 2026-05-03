-- Tools table: defines in-app interactive tools per module
CREATE TABLE public.tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  kind text NOT NULL CHECK (kind IN ('worksheet','tracker','cheatsheet','scripts','planner')),
  schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY tools_select_paid ON public.tools
  FOR SELECT TO authenticated
  USING (public.has_paid_access(auth.uid()));
CREATE INDEX idx_tools_module_order ON public.tools (module, order_index);

-- User responses: one row per (user, tool)
CREATE TABLE public.user_tool_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, tool_id)
);
ALTER TABLE public.user_tool_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY utr_select_own ON public.user_tool_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY utr_insert_own ON public.user_tool_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY utr_update_own ON public.user_tool_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY utr_delete_own ON public.user_tool_responses FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_utr_updated BEFORE UPDATE ON public.user_tool_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_tools_updated BEFORE UPDATE ON public.tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();