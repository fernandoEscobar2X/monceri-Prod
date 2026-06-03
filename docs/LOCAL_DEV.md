# Setup local

## Hosts

Todos los servicios usan `localhost` consistentemente. NO mezclar con `127.0.0.1` porque las cookies HttpOnly se rompen entre origins.

| Servicio | URL local | Puerto |
|----------|-----------|--------|
| API | http://localhost:4000 | 4000 |
| Web | http://localhost:3000 | 3000 |
| Admin | http://localhost:5173 | 5173 |

Los servidores de desarrollo escuchan en `0.0.0.0` para aceptar conexiones locales y de red, pero los clientes del proyecto deben apuntar a `localhost`.

## CORS

La API solo acepta requests de `ADMIN_FRONTEND_URL` y `WEB_FRONTEND_URL` definidos en `apps/api/.env`. Si cambias el puerto del admin o web, actualiza la env var correspondiente y reinicia la API.

## Cookies

La cookie de sesion admin se setea con:

- `httpOnly: true`
- `sameSite: strict` en desarrollo y produccion
- `secure: false` en desarrollo
- `secure: true` en produccion
- `path: /`

No se setea `domain` explicitamente en desarrollo. El navegador asocia la cookie al host del request (`localhost`).

## Arranque

Puedes levantar cada servicio en una terminal:

```bash
pnpm --filter api dev
pnpm --filter web dev
pnpm --filter admin dev
```

En Windows tambien puedes abrir las tres terminales con:

```bat
start-dev.bat
```

## Consideracion para produccion

Si produccion queda en subdominios como `admin.monceri.com.mx` y `api.monceri.com.mx`, evaluar si la cookie necesita `domain: ".monceri.com.mx"`. No se implementa todavia porque depende del dominio final y de la topologia real de Nginx/HTTPS.
