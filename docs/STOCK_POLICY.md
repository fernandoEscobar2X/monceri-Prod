# Politica De Stock V1

`CONTEXT.md` sigue siendo la fuente de verdad. Esta politica concreta como se interpreta inventario en v1.

## Decisiones

- Productos estandar: `trackStock = true`; el stock se controla en `Product.stock`.
- Variantes fisicas reales: se controla `ProductVariant.stock` solo si esa variante representa inventario fisico separado.
- Productos personalizados: `trackStock = false`; no bloquean orden por stock y se gestionan manualmente.
- Pedidos personalizados: crean orden `PENDING`, pero no descuentan stock automaticamente.
- Descuento automatico de stock: solo al confirmar orden y solo para items con `trackStock = true`.
- Ajustes manuales: siempre quedan como `StockMovement` con motivo y admin.

## Justificacion

Un letrero personalizado no existe como SKU terminado antes de venderse. Bloquearlo por stock generaria falsos negativos. Para v1, el sistema debe distinguir producto inventariable de producto fabricado bajo pedido.

## Impacto En API/Admin

- `POST /api/orders` valida stock solo si `trackStock = true`.
- El admin debe exponer `trackStock` al crear/editar producto.
- Inventario muestra productos sin stock como `Control manual`.
- Variantes con `stock = null` heredan control por producto o control manual.
