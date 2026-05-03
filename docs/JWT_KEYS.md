# Llaves JWT RS256

El API usa JWT RS256 con cookies HttpOnly, como exige `CONTEXT.md`.

## Generar llaves locales

```bash
pnpm --filter api keys:generate
```

Esto crea:

```text
apps/api/secrets/jwt-private.pem
apps/api/secrets/jwt-public.pem
```

Los `.pem` no se versionan.

## Sesion V1

V1 mantiene access token de 15 minutos en cookie HttpOnly. Refresh token de 7 dias esta definido en `CONTEXT.md` y debe implementarse antes de produccion real si el admin requiere sesiones persistentes.

## Error esperado si faltan llaves

El API falla temprano con instruccion clara:

```text
Missing JWT key file ... Run "pnpm --filter api keys:generate"
```
