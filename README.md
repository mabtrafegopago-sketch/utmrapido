# UTM Rápido

Gerador e gerenciador de links UTM para gestores de tráfego pago brasileiros.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + RLS)
- Google OAuth via Supabase

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha no `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — Dashboard Supabase > Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Dashboard Supabase > Settings > API > anon key
- `SUPABASE_SERVICE_ROLE_KEY` — service_role key
- `NEXT_PUBLIC_SITE_URL` — URL de produção

### 3. Banco de dados

Execute o SQL do `CONTEXTO.md` no Supabase SQL Editor.

### 4. Google OAuth

No Supabase Dashboard > Authentication > Providers > Google:
- Client ID: `984716952729-6itfgl3alotrndmesseog8kn13hb6dfb.apps.googleusercontent.com`
- Redirect URL de produção: `https://utmrapido.com.br/api/auth/callback`
- Redirect URL de dev: `http://localhost:3000/api/auth/callback`

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

---

## Deploy na Hostinger

### Pré-requisitos

- Node.js 18+ no servidor
- PM2: `npm install -g pm2`
- Nginx instalado

### Passos

```bash
# 1. Clonar o repositório no servidor
git clone https://github.com/mabtrafegopago-sketch/utmrapido.git /var/www/utmrapido
cd /var/www/utmrapido

# 2. Instalar dependências
npm install

# 3. Criar .env.local com as variáveis de produção
nano .env.local

# 4. Build
npm run build

# 5. Iniciar com PM2
pm2 start npm --name "utmrapido" -- start
pm2 save
pm2 startup
```

### Nginx

```nginx
server {
    listen 80;
    server_name utmrapido.com.br www.utmrapido.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site e HTTPS
ln -s /etc/nginx/sites-available/utmrapido /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d utmrapido.com.br -d www.utmrapido.com.br
```

### Atualizar após mudanças

```bash
cd /var/www/utmrapido
git pull origin main
npm install
npm run build
pm2 restart utmrapido
```

---

## Estrutura

```
app/
  (public)/       → Home, artigos SEO, preços, portal do cliente
  (auth)/login/   → Login Google OAuth
  (dashboard)/    → Dashboard protegido
  api/            → Rotas de API
components/
  ui/             → Button, Input, Select, Toast, Badge, CopyButton
  utm/            → UTMGenerator, URLPreview, ParamTooltip
  dashboard/      → StatsCards, ClientCard, LinkHistory
  marketing/      → Hero, Benefits, PricingCards, AdSenseBlock
lib/
  supabase/       → client.ts, server.ts, middleware.ts
  utils/utm.ts    → buildUTMUrl, slugify, presets
types/            → Database types, interfaces compartilhadas
```

## Checklist pós-deploy

- [ ] Variáveis de ambiente no servidor
- [ ] SQL executado no Supabase
- [ ] Google OAuth com URL de produção
- [ ] DNS apontando para o servidor
- [ ] HTTPS ativo (Certbot)
- [ ] Google Search Console + sitemap
- [ ] AdSense: substituir slots no `AdSenseBlock.tsx`
- [ ] Stripe: ativar e configurar quando pronto
