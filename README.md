# Monceri Production

Monorepo de produccion para Monceri, creado desde `CONTEXT.md` y usando el prototipo visual `monceriPrototype` como base de diseno.

## Apps

- `apps/web`: sitio publico Next.js.
- `apps/api`: API Fastify + Prisma.
- `apps/admin`: panel admin Refine.
- `packages/shared`: schemas Zod y tipos compartidos.

## Primer uso local

```bash
corepack enable
corepack prepare pnpm@10.20.0 --activate
pnpm install
docker compose up -d postgres
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Verificacion

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Puertos

- Web: `http://127.0.0.1:3000`
- API: `http://127.0.0.1:4000`
- Admin: `http://127.0.0.1:5173`

## Nota

No hay pagos en linea. El flujo de venta crea una orden y abre WhatsApp con el resumen, tal como define `CONTEXT.md`.
