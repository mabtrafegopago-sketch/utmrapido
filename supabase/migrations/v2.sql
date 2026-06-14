-- ────────────────────────────────────────────────────────────
-- UTM Rápido — Migration v2
-- Slugs personalizados · logo de cliente · subpastas · RLS público
-- ────────────────────────────────────────────────────────────

-- 1. CLIENTS — slug + logo_url
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS slug text;

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS logo_url text;

-- Unicidade do slug por usuário (mesmo gestor não pode ter dois slugs iguais).
-- Se quiser unicidade global, troque por:  ALTER TABLE clients ADD CONSTRAINT clients_slug_unique UNIQUE (slug);
CREATE UNIQUE INDEX IF NOT EXISTS clients_slug_per_user_idx
  ON public.clients (user_id, slug)
  WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS clients_slug_idx ON public.clients(slug);

-- 2. FOLDERS — parent_id para subpastas
ALTER TABLE public.folders
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.folders(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS folders_parent_id_idx ON public.folders(parent_id);

-- 3. RLS — acesso público ao portal /c/[token|slug]
-- O portal lê client + folders + links pelo token ou slug sem autenticação.
-- Permitimos SELECT anônimo apenas dessas tabelas (escrita continua restrita ao dono).

-- Garante RLS ligado
ALTER TABLE public.clients   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utm_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders   ENABLE ROW LEVEL SECURITY;

-- CLIENTS — leitura pública (necessário para encontrar o cliente pelo token/slug)
DROP POLICY IF EXISTS "Public can read clients by token or slug" ON public.clients;
CREATE POLICY "Public can read clients by token or slug"
  ON public.clients FOR SELECT
  TO anon, authenticated
  USING (true);

-- UTM_LINKS — leitura pública dos links de qualquer cliente
DROP POLICY IF EXISTS "Public can read utm_links" ON public.utm_links;
CREATE POLICY "Public can read utm_links"
  ON public.utm_links FOR SELECT
  TO anon, authenticated
  USING (true);

-- FOLDERS — leitura pública das pastas
DROP POLICY IF EXISTS "Public can read folders" ON public.folders;
CREATE POLICY "Public can read folders"
  ON public.folders FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. STORAGE — bucket para logos de clientes (público, leitura aberta)
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-logos', 'client-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: qualquer pessoa pode ler (bucket público)
DROP POLICY IF EXISTS "Public read client-logos" ON storage.objects;
CREATE POLICY "Public read client-logos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'client-logos');

-- Policy: usuários autenticados podem subir/atualizar/deletar seus próprios logos
DROP POLICY IF EXISTS "Auth users upload client-logos" ON storage.objects;
CREATE POLICY "Auth users upload client-logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'client-logos');

DROP POLICY IF EXISTS "Auth users update client-logos" ON storage.objects;
CREATE POLICY "Auth users update client-logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'client-logos');

DROP POLICY IF EXISTS "Auth users delete client-logos" ON storage.objects;
CREATE POLICY "Auth users delete client-logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'client-logos');
