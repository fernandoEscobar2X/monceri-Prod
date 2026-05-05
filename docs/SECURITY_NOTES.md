# Notas De Seguridad - Monceri

## Decisiones Documentadas

### Stock Check Al Crear Orden

El check de stock al crear una orden no esta dentro de una transaccion. Esto permite una race condition teorica si varios clientes compran el mismo producto al mismo tiempo.

Se acepta para v1 porque:

- La tia confirma manualmente cada pedido.
- La validacion que descuenta inventario ocurre en `confirmAndDecrementStock`, que si es transaccional.
- El volumen esperado inicial es bajo.

Si Monceri escala a mas de 10 pedidos por hora simultaneos, mover el check inicial a una transaccion.

### Modelo De Lineas En Configurador

La validacion actual usa limite total de letras por tamano. La distribucion exacta entre uno o dos renglones queda pendiente de decision con la clienta.

Estado: pendiente de decision operativa. No cambiar sin actualizar `CONTEXT.md` y las reglas compartidas de pricing.

### Imagenes Huerfanas

Si el admin sube una imagen y luego abandona el formulario sin crear o guardar el recurso, la imagen puede quedar en disco sin referencia en base de datos.

Aceptado para v1. Implementar un job de limpieza en una iteracion futura cuando haya politica de retencion definida.

## Configuracion Minima Para Produccion

- HTTPS forzado.
- Firewall solo para puertos 22, 80 y 443.
- SSH solo con llaves.
- PostgreSQL accesible solo desde localhost o red privada.
- Backups encriptados y verificados.
- Cambiar la contrasena admin del seed antes del primer uso real.
- `JWT_ISSUER` configurado con el dominio HTTPS real de la API.
- `COOKIE_SECRET` con minimo 64 caracteres aleatorios reales.
- JWT keys generadas en servidor y nunca compartidas por ZIP.
- `.env`, `.pem`, `.logs`, `node_modules`, `.next`, `dist` y uploads locales fuera de Git y ZIPs de auditoria.
