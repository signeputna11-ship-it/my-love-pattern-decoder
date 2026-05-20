
CREATE TABLE public.email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  source text NOT NULL DEFAULT 'purchase',
  product_slug text,
  sequence_step int NOT NULL DEFAULT 1,
  sequence_paused boolean NOT NULL DEFAULT false,
  last_emailed_at timestamptz,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_email_subscribers_due ON public.email_subscribers (sequence_paused, sequence_step, last_emailed_at);
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY email_subscribers_admin_all ON public.email_subscribers
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_email_subscribers_updated_at
  BEFORE UPDATE ON public.email_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.email_sequence_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL REFERENCES public.email_subscribers(id) ON DELETE CASCADE,
  step int NOT NULL,
  template_name text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_email_sequence_log_sub ON public.email_sequence_log (subscriber_id, step);
ALTER TABLE public.email_sequence_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY email_sequence_log_admin_read ON public.email_sequence_log
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS upsell_shown boolean NOT NULL DEFAULT false;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS downloaded_at timestamptz;
