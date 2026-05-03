# Deploy Produccion

No se despliega remoto en esta fase porque faltan dominio, servidor y secretos.

## Verificacion local

```bash
corepack enable
corepack prepare pnpm@10.20.0 --activate
pnpm install
docker compose up -d postgres
pnpm --filter api keys:generate
pnpm db:migrate
pnpm db:seed
pnpm lint
pnpm typecheck
pnpm build
```

## Produccion objetivo

- Hetzner CPX22
- Ubuntu 24.04 LTS
- Nginx como reverse proxy
- PM2 como process manager
- PostgreSQL local o gestionado
- Cloudflare DNS
- Let's Encrypt SSL

## Variables reales pendientes

- Dominio web
- Dominio admin
- Dominio API
- Numero WhatsApp real
- `DATABASE_URL`
- `COOKIE_SECRET`
- Llaves JWT
- `SENTRY_DSN` si aplica
