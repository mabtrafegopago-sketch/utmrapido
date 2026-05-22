-- Tabela de pastas/projetos por cliente
CREATE TABLE public.folders (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id  uuid NOT NULL REFERENCES public.clients(id)  ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id)       ON DELETE CASCADE,
  name       text NOT NULL,
  color      text NOT NULL DEFAULT '#534AB7',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Adiciona folder_id em utm_links (nullable — link pode ficar sem pasta)
ALTER TABLE public.utm_links
  ADD COLUMN folder_id uuid REFERENCES public.folders(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own folders"
  ON public.folders FOR ALL
  USING (auth.uid() = user_id);

-- Índices
CREATE INDEX folders_client_id_idx   ON public.folders(client_id);
CREATE INDEX utm_links_folder_id_idx ON public.utm_links(folder_id);
