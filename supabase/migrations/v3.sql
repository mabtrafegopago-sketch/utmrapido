-- ────────────────────────────────────────────────────────────
-- UTM Rápido — Migration v3
-- Descrição/contexto nos links · usuários de cliente com login
-- ────────────────────────────────────────────────────────────

-- 1. UTM_LINKS — campo description (contexto opcional do link)
ALTER TABLE public.utm_links
  ADD COLUMN IF NOT EXISTS description text;

-- 2. CLIENT_USERS — usuários do time do cliente com acesso ao portal
CREATE TABLE IF NOT EXISTS public.client_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_users_client_id_idx ON public.client_users(client_id);
CREATE INDEX IF NOT EXISTS client_users_email_idx ON public.client_users(email);

ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;

-- Gestor (dono do cliente) gerencia os usuários
DROP POLICY IF EXISTS "Gestor gerencia usuários do cliente" ON public.client_users;
CREATE POLICY "Gestor gerencia usuários do cliente"
  ON public.client_users FOR ALL
  USING (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );

-- Permite leitura pelo service_role (login via API)
DROP POLICY IF EXISTS "Service role full access client_users" ON public.client_users;
CREATE POLICY "Service role full access client_users"
  ON public.client_users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. CLIENT_USER_SESSIONS — sessões dos usuários de cliente (cookie httpOnly)
CREATE TABLE IF NOT EXISTS public.client_user_sessions (
  token text PRIMARY KEY,
  client_user_id uuid NOT NULL REFERENCES public.client_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_user_sessions_user_idx ON public.client_user_sessions(client_user_id);

ALTER TABLE public.client_user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access client_user_sessions" ON public.client_user_sessions;
CREATE POLICY "Service role full access client_user_sessions"
  ON public.client_user_sessions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
