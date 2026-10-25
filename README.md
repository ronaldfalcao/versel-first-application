# Diário Perdido

Blog em **Next.js 16** (App Router, Cache Components) com conteúdo gerenciado no **Sanity**, hospedado na **Vercel**.

```
/            → site público (Next.js) — implantado na Vercel
/studio      → painel de edição (Sanity Studio) — implantado em https://<host>.sanity.studio
```

O site público **só lê** conteúdo publicado. Toda escrita acontece no Studio, que exige login
na conta Sanity e respeita os papéis (roles) do projeto. Não existe nenhuma rota de escrita no site.

## 1. Configurar o Sanity (uma vez)

```bash
cd studio
npx sanity login                 # use GitHub ou Google com 2FA ativado
npx sanity init --bare           # cria o projeto e mostra o projectId
cp .env.example .env             # preencha SANITY_STUDIO_PROJECT_ID
npm run dev                      # http://localhost:3333
npm run deploy                   # publica o Studio em https://<host>.sanity.studio
```

No Studio, crie primeiro **Configurações do site**, depois um **Autor** e o primeiro **Post**.

## 2. Configurar o site

```bash
cp .env.example .env.local       # preencha as variáveis
npm run dev                      # http://localhost:3000
```

Na Vercel (**Settings → Environment Variables**), cadastre as mesmas variáveis do `.env.example`.
Marque `SANITY_API_READ_TOKEN` e `SANITY_REVALIDATE_SECRET` como **Sensitive**.

## 3. Webhook de publicação

Em **sanity.io/manage → API → Webhooks → Create webhook**:

| Campo | Valor |
|---|---|
| URL | `https://www.diarioperdido.com.br/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type in ["post", "author", "category", "siteSettings"]` |
| HTTP method | POST |
| Secret | o mesmo valor de `SANITY_REVALIDATE_SECRET` (`openssl rand -hex 32`) |

Requisições sem a assinatura correta recebem `401`.

## Checklist de segurança

**Sanity (sanity.io/manage)**
- [ ] **Members:** apenas você como *Administrator*. Colaboradores entram como *Editor* (ou *Viewer*), nunca Administrator.
- [ ] **Login:** use GitHub/Google com **verificação em duas etapas** ativada.
- [ ] **Datasets:** deixe `production` como **Private** e crie um token *Viewer* para `SANITY_API_READ_TOKEN`.
- [ ] **API → Tokens:** nenhum token com permissão de escrita. Revogue tokens que não usa.
- [ ] **API → CORS origins:** apenas `http://localhost:3333` e o domínio do Studio, **sem** "Allow credentials" para outros domínios. O site não precisa de CORS (consulta pelo servidor).

**Vercel**
- [ ] **Deployment Protection:** *Vercel Authentication* ativada para **Preview** deployments.
- [ ] Variáveis secretas marcadas como **Sensitive** e só nos ambientes necessários.
- [ ] Conta Vercel com **2FA**.

**GitHub**
- [ ] **Branch protection** na `main` (exigir PR, bloquear force-push).
- [ ] Conta com **2FA**. Dependabot já está configurado em `.github/dependabot.yml`.

### O que já está no código
- Cliente Sanity **somente leitura**, só no servidor (`server-only`), com `perspective: 'published'` — rascunhos nunca chegam ao site.
- Posts com data futura ficam ocultos até a hora agendada.
- Webhook de revalidação validado por **HMAC** (`next-sanity/webhook`), recusando segredo curto ou ausente.
- Cabeçalhos: **CSP** restritiva, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, sem `X-Powered-By`.
- Links do conteúdo restritos a `http(s)`/`mailto` (no Studio e de novo na renderização); JSON-LD escapado contra XSS.
- No Studio: excluir/despublicar visível só para administradores; ferramenta Vision só para administradores.

## SEO e IA
Metadados e Open Graph por post, URLs canônicas, `sitemap.xml`, `robots.txt` (com robôs de IA liberados),
feed RSS em `/feed.xml`, `/llms.txt`, JSON-LD (`WebSite`, `BlogPosting`, `BreadcrumbList`, `ProfilePage`),
páginas de autor e categoria, imagens responsivas pelo CDN do Sanity e Vercel Analytics/Speed Insights.

Depois do deploy, cadastre o site no **Google Search Console** e no **Bing Webmaster Tools** e envie o sitemap.
