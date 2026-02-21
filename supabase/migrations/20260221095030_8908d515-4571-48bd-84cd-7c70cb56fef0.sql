
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'bandleider', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Create lines table
CREATE TABLE public.lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bandleiders can view all lines" ON public.lines
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'bandleider'));

-- Create line_products table
CREATE TABLE public.line_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id UUID NOT NULL REFERENCES public.lines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  persons_count INTEGER NOT NULL DEFAULT 0,
  updated_by TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.line_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bandleiders can view line products" ON public.line_products
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'bandleider'));

CREATE POLICY "Bandleiders can update line products" ON public.line_products
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'bandleider'));

-- Enable realtime for line_products
ALTER PUBLICATION supabase_realtime ADD TABLE public.line_products;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Seed demo data
INSERT INTO public.lines (id, name) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Hand Lijn 1'),
  ('a2222222-2222-2222-2222-222222222222', 'Hand Lijn 2'),
  ('a3333333-3333-3333-3333-333333333333', 'Band Lijn 1'),
  ('a4444444-4444-4444-4444-444444444444', 'Band Lijn 2');

INSERT INTO public.line_products (line_id, name, persons_count) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'BQ Field L', 3),
  ('a1111111-1111-1111-1111-111111111111', 'BQ Elegance', 2),
  ('a1111111-1111-1111-1111-111111111111', 'BQ Charme XL', 2),
  ('a2222222-2222-2222-2222-222222222222', 'BQ de Luxe', 4),
  ('a2222222-2222-2222-2222-222222222222', 'BQ Lovely', 2),
  ('a3333333-3333-3333-3333-333333333333', 'BQ Trend', 3),
  ('a3333333-3333-3333-3333-333333333333', 'BQ Chique', 2),
  ('a4444444-4444-4444-4444-444444444444', 'BQ Spring Mix', 1),
  ('a4444444-4444-4444-4444-444444444444', 'BQ Field M', 3);
