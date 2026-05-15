
-- Blog categories
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_categories_public_read" ON public.blog_categories
  FOR SELECT USING (true);

CREATE POLICY "blog_categories_admin_insert" ON public.blog_categories
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "blog_categories_admin_update" ON public.blog_categories
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "blog_categories_admin_delete" ON public.blog_categories
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  featured_image_url text,
  youtube_url text,
  category text,
  tags text[] DEFAULT '{}'::text[],
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  meta_title text,
  meta_description text,
  og_image_url text,
  read_time_minutes integer
);

CREATE INDEX blog_posts_published_idx ON public.blog_posts (published, published_at DESC);
CREATE INDEX blog_posts_category_idx ON public.blog_posts (category);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_public_read_published" ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "blog_posts_admin_read_all" ON public.blog_posts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "blog_posts_admin_insert" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "blog_posts_admin_update" ON public.blog_posts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "blog_posts_admin_delete" ON public.blog_posts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER blog_posts_set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Blog subscribers
CREATE TABLE public.blog_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  source text DEFAULT 'blog'
);

ALTER TABLE public.blog_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_subscribers_public_insert" ON public.blog_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "blog_subscribers_admin_read" ON public.blog_subscribers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed categories
INSERT INTO public.blog_categories (name, slug) VALUES
  ('Pattern Education', 'pattern-education'),
  ('Self Worth', 'self-worth'),
  ('Dating Advice', 'dating-advice'),
  ('Real Scenarios', 'real-scenarios'),
  ('Boundary Setting', 'boundary-setting'),
  ('Healthy Love', 'healthy-love');

-- Seed initial post
INSERT INTO public.blog_posts (
  title, slug, excerpt, content, featured_image_url, category, tags,
  published, published_at, read_time_minutes, meta_title, meta_description
) VALUES (
  'The Over-Investor: why you give everything before anything is real',
  'the-over-investor',
  'The Over-Investor pattern makes you give everything before anything is established. Here is where it comes from and what actually shifts it.',
  '<p>The Over-Investor gives everything before anything is established. The texts that pour out before they earn your time. The plans built around someone who has not chosen you yet. The future imagined with someone who is still a stranger.</p><h2>Where it comes from</h2><p>This pattern often forms early. Love had to be earned. Attention was inconsistent. So you learned to lean in, to give more, to be the safe one, the easy one, the one who did not ask for much.</p><h2>What actually shifts it</h2><p>Not better discipline. Not stricter rules. The shift comes when your nervous system stops believing that giving more equals being chosen. When you start trusting that the right person will move toward you without you running ahead of them.</p><blockquote>You are allowed to be received before you give yourself away.</blockquote>',
  'https://pub-687d7fb8b7f44636a61754dc527f9690.r2.dev/FLOWER%20AND%20CRYSTALS%20ISLAND%20CRYSTAL.mp4',
  'Pattern Education',
  ARRAY['over-investor', 'love patterns', 'self-worth'],
  true,
  now(),
  5,
  'The Over-Investor: why you give everything before anything is real',
  'The Over-Investor pattern makes you give everything before anything is established. Here is where it comes from and what actually shifts it.'
);
