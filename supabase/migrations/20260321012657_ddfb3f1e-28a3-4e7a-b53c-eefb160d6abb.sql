
-- Plans table
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active plans"
  ON public.plans FOR SELECT
  USING (is_active = true);

-- Features enum
CREATE TYPE public.app_feature AS ENUM (
  'consultoria_ia',
  'minicursos',
  'noticias',
  'negocios',
  'workspace'
);

-- Plan-feature mapping (parametrizable by admin)
CREATE TABLE public.plan_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE NOT NULL,
  feature app_feature NOT NULL,
  UNIQUE (plan_id, feature)
);

ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plan features"
  ON public.plan_features FOR SELECT
  USING (true);

-- User subscriptions
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES public.plans(id) NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscription"
  ON public.user_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Seed plans
INSERT INTO public.plans (name, display_name, description, price_cents, sort_order) VALUES
  ('free', 'Gratuito', 'Acesso básico às notícias e artigos', 0, 0),
  ('basic', 'Básico', 'Notícias, mercado e minicursos', 4700, 1),
  ('pro', 'Profissional', 'Acesso completo a todas as funcionalidades', 9700, 2);

-- Seed plan features
INSERT INTO public.plan_features (plan_id, feature)
SELECT p.id, f.feature FROM public.plans p,
  (VALUES ('noticias'::app_feature)) AS f(feature)
WHERE p.name = 'free';

INSERT INTO public.plan_features (plan_id, feature)
SELECT p.id, f.feature FROM public.plans p,
  UNNEST(ARRAY['noticias'::app_feature, 'negocios'::app_feature, 'minicursos'::app_feature]) AS f(feature)
WHERE p.name = 'basic';

INSERT INTO public.plan_features (plan_id, feature)
SELECT p.id, f.feature FROM public.plans p,
  UNNEST(ARRAY['noticias'::app_feature, 'negocios'::app_feature, 'minicursos'::app_feature, 'consultoria_ia'::app_feature, 'workspace'::app_feature]) AS f(feature)
WHERE p.name = 'pro';

-- Auto-assign free plan on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan_id)
  SELECT NEW.id, id FROM public.plans WHERE name = 'free' LIMIT 1;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();
