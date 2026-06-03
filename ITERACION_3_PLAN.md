# Iteración 3 — Catálogo Público + Panel Admin Completo

> Documento para entregar al agente que implementará la iteración. Léelo completo antes de generar código. Revisa también `CONTEXT.md` en la raíz del repo.

**Tiempo estimado:** 45-55 horas reales (~2-2.5 semanas)
**Alcance:** Catálogo público + páginas de producto + panel admin completo + uploads
**Stack admin:** Refine + Ant Design (UI library oficial de Refine, mantener `@refinedev/antd`)
**Stack frontend público:** Next.js 14+ App Router + Tailwind v4 (sin cambios)
**Status del repo:** v2.5 cerrado. Sistema funciona end-to-end con configurador + WhatsApp + folio MNC-2026-XXX. Postgres nativo en Windows local. Migración OrderCounter aplicada.

---

## 1. Visión general del trabajo

Esta iteración tiene **dos frentes simultáneos** que dependen uno del otro:

**Frente A — Frontend público:**
Agregar catálogo de productos prediseñados al sitio. Hoy solo existe el configurador de letreros. Hay que agregar `/catalogo` con grid filtrable, y `/producto/[slug]` con detalle. La sección "TE PUEDE INTERESAR" en home debe linkear al nuevo catálogo en lugar del configurador.

**Frente B — Panel admin:**
Construir el panel completo en `apps/admin` para que la tía gestione productos, categorías, pedidos, inventario, cupones y dashboard sin tu intervención. El admin usa **Refine + Ant Design** porque es panel interno (solo la tía lo ve), no requiere brand-matching estricto, y AntD acelera ~20 horas de trabajo en componentes UI.

Ambos frentes consumen los mismos endpoints del backend, así que el orden de trabajo es: **Backend primero, después admin (porque permite cargar datos), después frontend público (porque consume los datos cargados)**.

---

## 2. Sub-fases del trabajo

Después de cada bloque corre `pnpm -r lint && pnpm -r typecheck && pnpm -r build` antes de continuar.

### Bloque A: Backend — Endpoints faltantes y uploads (6-8 horas)

**A1. Endpoint de uploads real:**
- Reemplazar `apps/api/src/modules/uploads/uploads.controller.ts` que devuelve 501.
- Aceptar multipart con `@fastify/multipart` (ya configurado en server.ts con límite 5MB).
- Validar MIME real con `file-type` (no confiar en extensión).
- Procesar con Sharp:
  - Resize máximo 1920px ancho manteniendo ratio.
  - Convertir a WebP quality 85.
  - Generar también thumbnail 400px ancho (para grids).
- Nombre con `crypto.randomUUID()`. NO usar nombre original.
- Guardar en `apps/api/uploads/products/<uuid>.webp` y `apps/api/uploads/products/<uuid>-thumb.webp`.
- Servir estáticos vía `@fastify/static` desde `/uploads/...`.
- Devolver `{ url, thumbnailUrl, width, height, sizeBytes }`.
- Proteger con `authenticate` middleware.

**A2. Endpoint público de productos para catálogo:**

GET `/api/products` con query params:
- `category` (slug de categoría, opcional)
- `minPrice` (número, opcional)
- `maxPrice` (número, opcional)
- `search` (texto, opcional)
- `sort` (enum: `price_asc`, `price_desc`, `newest`, `featured`)
- `page` (número, default 1)
- `pageSize` (número, default 12, max 50)

Devuelve:
```typescript
{
  items: ProductSummary[],  // id, slug, name, basePrice, comparePrice, thumbnail, categoryName, featured
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

Solo devuelve productos con `active: true`. Excluye el producto del configurador (slug `letrero-neon-personalizado`) por defecto, ese tiene su propio flujo.

GET `/api/products/:slug` para detalle:
- Devuelve producto completo con images, variants, category.
- Solo si `active: true`.
- Si no existe o está inactivo, 404.

GET `/api/categories` (público):
- Lista de categorías activas ordenadas por `sortOrder`.
- Para usar en el filtro del catálogo y en el footer.

**A3. Endpoints admin que faltan:**

Verificar/crear (todos con `preHandler: authenticate`):
- Categorías: GET/POST/PATCH/DELETE en `/api/admin/categories`.
- Productos: GET/POST/PATCH/DELETE en `/api/admin/products` con paginación y filtros.
- Inventario: GET `/api/admin/inventory/stock`, POST `/api/admin/inventory/adjustments`, GET `/api/admin/inventory/movements?productId=...`.
- Cupones: GET/POST/PATCH/DELETE en `/api/admin/coupons`.
- Pedidos: list y patch status ya existen. Agregar GET `/api/admin/orders/:orderNumber`.
- Dashboard: GET `/api/admin/dashboard/summary` que devuelva:
  ```typescript
  {
    ordersThisMonth: number,
    revenueThisMonth: number,
    pendingOrders: number,
    lowStockProducts: { id, name, stock, lowStockAlert }[],
    recentOrders: Order[],
    weeklyRevenue: { week: string, total: number }[]  // últimas 8 semanas
  }
  ```

**A4. Reglas técnicas backend:**
- Cada endpoint sigue Routes → Controller → Service → Repository.
- Validación con Zod.
- Errores tipados.
- Schemas compartidos en `packages/shared/src/schemas/` cuando aplique.
- N+1 evitado con `include` de Prisma.

### Bloque B: Setup admin con Refine + Ant Design (2-3 horas)

**B1. Confirmar dependencias instaladas:**
El `package.json` de `apps/admin` ya tiene:
- `@refinedev/core`
- `@refinedev/antd`
- `antd`
- `@ant-design/icons`
- `dayjs`

NO removerlas. Mantener todas. Si alguna falta, agregarla.

**B2. Configurar locale español:**
- En `main.tsx` ya está `import esES from "antd/locale/es_ES"` y `<ConfigProvider locale={esES}>`. Mantener.
- Verificar que `dayjs` esté configurado en español (`dayjs.locale("es")`).

**B3. Auth provider:**
Crear `apps/admin/src/providers/auth-provider.ts`:
- `login`: POST `/api/admin/auth/login`. Si éxito devolver `{ success: true, redirectTo: "/" }`. Si falla `{ success: false, error: { name, message } }`.
- `logout`: POST `/api/admin/auth/logout`. Devolver `{ success: true, redirectTo: "/login" }`.
- `check`: GET `/api/admin/auth/me`. Si 200 `{ authenticated: true }`. Si 401 `{ authenticated: false, redirectTo: "/login" }`.
- `getIdentity`: GET `/api/admin/auth/me` y devuelve el admin actual.
- `onError`: si recibe 401 en cualquier request, retornar `{ logout: true, redirectTo: "/login" }`.

**B4. Data provider tipado:**
Reescribir el data provider actual del `main.tsx` y moverlo a `apps/admin/src/providers/data-provider.ts`:
- Mapear cada `resource` a su URL real con prefix `/api/admin/`:
  - `products` → `/api/admin/products`
  - `categories` → `/api/admin/categories`
  - `orders` → `/api/admin/orders`
  - `inventory` → `/api/admin/inventory/stock`
  - `coupons` → `/api/admin/coupons`
- `getList` debe leer pagination y filters de Refine y mapearlos a query params del backend (`page`, `pageSize`, `search`, etc).
- Manejar paginación leyendo `total` del response (no de headers).
- `getOne`, `create`, `update`, `deleteOne` con `credentials: "include"`.
- Parsear errores con formato AppError del backend.

**B5. Layout y rutas:**
Usar `<ThemedLayoutV2>` de `@refinedev/antd` que ya incluye sidebar, topbar y manejo de rutas. Configurar:
- Logo de Monceri en el sidebar.
- Items de menú: Dashboard, Productos, Categorías, Pedidos, Inventario, Cupones.
- Topbar con nombre del admin (de `getIdentity`) y botón logout.
- Tema custom mínimo: cambiar el color primary de AntD a `#E63946` (rojo Monceri) para mantener consistencia visual sin esfuerzo.

```tsx
<ConfigProvider 
  locale={esES} 
  theme={{ token: { colorPrimary: "#E63946" } }}
>
```

**B6. Setup React Router:**
Configurar rutas con `react-router-dom`:
- `/login` → LoginPage
- `/` → redirect a `/dashboard`
- `/dashboard` → DashboardPage
- `/products` → ProductList
- `/products/create` → ProductCreate
- `/products/edit/:id` → ProductEdit
- `/categories` → CategoryList
- ... etc para cada resource.

Refine maneja esto automáticamente con `<Refine>` + `routerProvider`.

### Bloque C: CRUDs core — Categorías y Productos (8-10 horas)

**C1. Categorías (hacer primero, valida el patrón):**
- Resource Refine en `apps/admin/src/pages/categories/`.
- `CategoryList`: usar `<List>` + `<Table>` de @refinedev/antd. Columnas: name, slug, sortOrder, active (Switch), acciones (Edit, Delete).
- `CategoryCreate` y `CategoryEdit`: `<Create>` + `<Form>` + `<Form.Item>`. Validación con `useForm` de Refine + Zod resolver vía `@hookform/resolvers/zod` (o validación nativa de AntD Form, ambas funcionan).
- Slug auto-generado del name pero editable.

**C2. Productos:**
- `ProductList`: `<Table>` con thumbnail (img tag con tamaño fijo), name, category (filtro dropdown), basePrice formateado MXN, stock, active (Switch toggle inline), featured (Tag amarillo si true), acciones.
- Filtros AntD: search por name (`<Input.Search>`), filtro por categoría (Select), filtro por estado (Select activo/inactivo).
- Paginación nativa de AntD Table (Refine la maneja automáticamente).

- `ProductCreate` y `ProductEdit`: usar `<Tabs>` de AntD para las secciones:
  - **Tab "General"**: name, slug, description (TextArea), basePrice, comparePrice, category (Select), featured (Switch).
  - **Tab "Imágenes"**: componente `<ImageUploader>` (ver C3).
  - **Tab "Variantes"**: `<Form.List>` de AntD para tabla inline editable. Agregar/borrar filas. Campos: name, value, priceAdjust, stock (nullable), active.
  - **Tab "Inventario"**: switch trackStock, número stock, número lowStockAlert.
  - **Tab "SEO"**: metaTitle, metaDescription.

**C3. Componente `<ImageUploader>`:**
Usar `<Upload>` de AntD con `customRequest` apuntando a tu endpoint:
- `customRequest` hace POST a `/api/admin/uploads` con FormData.
- `onSuccess` agrega la URL devuelta a la lista de imágenes del producto.
- `listType="picture-card"` para mostrar previews cuadrados.
- `multiple` true.
- Reordenar: AntD no lo trae nativo, usar botones up/down en cada item (no react-beautiful-dnd, no se justifica).
- Borrar: maneja con `onRemove` del Upload.
- Validación: `beforeUpload` rechaza archivos > 5MB o no-imagen.

### Bloque D: Pedidos en admin (5-6 horas)

**D1. `OrderList`:**
- `<Table>` con columnas: orderNumber (link al show), customerName, customerPhone (botón "WhatsApp" que abre wa.me), total formateado MXN, status (`<OrderStatusTag>` con color), createdAt formateado con dayjs ("hace 2 horas").
- Filtros: por status (Select multi), rango de fechas (`<DatePicker.RangePicker>`).
- Búsqueda por orderNumber o teléfono.
- Default sort: createdAt desc.

**D2. `OrderShow` (vista detalle):**
Usar `<Show>` de @refinedev/antd con `<Descriptions>` para datos estructurados:
- Header con orderNumber, status grande, badge whatsappSent, fecha.
- `<Descriptions title="Cliente">`: nombre, teléfono (con botón WhatsApp), email opcional.
- Tabla de items: usar `<Table>` con productName, variantData formateada en celda custom, quantity, unitPrice, subtotal. Items CONFIGURATOR muestran detalles del letrero (phrase, font, size, colors, addons) con `<Descriptions>` interno o lista. Items PRODUCT muestran variantes regulares.
- `<Descriptions title="Totales">`: subtotal, descuento (si aplica con código de cupón), total destacado en grande.
- Sección Notas: `<Input.TextArea>` con botón "Guardar nota" o auto-save.
- Sección Acciones según status:
  - PENDING → `<Button type="primary">Confirmar pedido</Button>`.
  - CONFIRMED → `<Button>Marcar en producción</Button>`.
  - IN_PRODUCTION → `<Button>Marcar como listo</Button>`.
  - READY → `<Button type="primary">Marcar como entregado</Button>`.
  - Cualquiera (excepto DELIVERED/CANCELLED) → `<Button danger>Cancelar</Button>` con `<Popconfirm>`.
- `<message.success>` al confirmar: "Pedido confirmado. Stock actualizado y cupón consumido."

**D3. Componente `<OrderStatusTag>`:**
Usar `<Tag>` de AntD:
- PENDING: `color="gold"`, CONFIRMED: `color="blue"`, IN_PRODUCTION: `color="purple"`, READY: `color="green"`, DELIVERED: `color="default"`, CANCELLED: `color="red"`.

### Bloque E: Inventario y Cupones (4-5 horas)

**E1. Inventario:**
- Página principal con `<Table>`: productos con stock actual, columna "Estado" con `<Tag>` rojo si `stock <= lowStockAlert`.
- Botón "Ajustar stock" en cada fila → abre `<Modal>` con `<Form>`: cantidad (puede ser negativa), razón (TextArea), tipo (Select: PURCHASE/ADJUSTMENT/RETURN).
- Submit crea StockMovement, actualiza stock atómicamente, cierra modal, refresca tabla.
- `<Tabs>` con segunda tab "Histórico de movimientos": tabla con productName, type (Tag con color), quantity (verde si positivo, rojo si negativo), reason, adminName, fecha. Filtro por producto.

**E2. Cupones:**
- `CouponList`: code, type (Tag), value formateado según type, usedCount/maxUses, expiresAt formateado, active.
- Visual claro: si `usedCount >= maxUses` mostrar Tag "Agotado". Si `expiresAt < now` mostrar Tag "Expirado".
- `CouponCreate/Edit`: form completo con AntD.

### Bloque F: Dashboard (3-4 horas)

**F1. Página `/dashboard` (ruta default tras login):**
Usar `<Row>` y `<Col>` de AntD para grid:
- 4 `<Card>` arriba con `<Statistic>` de AntD:
  - Pedidos del mes (con flecha indicator vs mes anterior usando `<Statistic.Trend>` o flecha custom).
  - Ingresos del mes (formateado MXN, `prefix="$"`).
  - Pedidos pendientes (link a lista filtrada).
  - Productos con stock bajo (link a inventario filtrado).
- `<Card title="Ingresos por semana">` con gráfica de líneas. Usar **Recharts** (ya disponible en frontend público — si no está en admin, agregar `recharts` a dependencies).
- `<Card title="Últimos pedidos">` con `<Table>` de top 10 con link al detalle.

**F2. Vacío inteligente:**
Si no hay pedidos: usar `<Empty>` de AntD con descripción "Aún no hay pedidos. Cuando llegue el primer aparecerá aquí."

### Bloque G: Login y pulido admin (2-3 horas)

**G1. Página de login:**
Usar `<AuthPage>` de @refinedev/antd que ya viene listo:
```tsx
<AuthPage 
  type="login"
  title={<img src="/logo-monceri.svg" />}
  formProps={{
    initialValues: { email: "", password: "" }
  }}
/>
```

Si necesitas custom: form simple con `<Card>`, logo arriba, email, password, botón "Entrar". Submit llama al `authProvider.login`.

**G2. Manejo de errores global:**
Refine + AntD `<App>` ya manejan toasts automáticamente con `useNotificationProvider`. Solo asegurar que:
- 500 → mensaje genérico AntD.
- 401 → logout y redirect (manejado por `onError` del authProvider).
- 403 → mensaje "No tienes permiso".

**G3. Loading states:**
- AntD `<Skeleton>` en listas mientras cargan (Refine maneja esto automático).
- `loading` prop en botones de submit (Refine también).
- AntD `<Spin>` para overlays globales si hace falta.

**G4. Responsive:**
- AntD `<Table>` tiene `scroll={{ x: "max-content" }}` para horizontal scroll en mobile/tablet.
- `<ThemedLayoutV2>` ya colapsa el sidebar en mobile.

### Bloque H: Frontend público — Catálogo (10-12 horas)

**H0. Brief visual obligatorio (LEER ANTES DE CODEAR):**

El catálogo y la página de producto **escalan el estilo del teaser actual** (`apps/web/src/components/sections/product-lines-section.tsx`). NO inventar nuevo lenguaje visual. Estos son los tokens canónicos que ya están en uso:

**Colores:**
- Fondo principal: `#FAFAFA`
- Texto principal: `#111827` (gris muy oscuro casi negro)
- Acento Monceri: `#E63946` (rojo, usar SOLO en eyebrow text uppercase tracking-wide y CTAs primarios)
- Texto secundario/labels: `text-gray-400` y `text-gray-500`
- Bordes: `border-gray-200`
- Card background: `bg-white`
- Botón primario: `bg-[#111827]` con hover `hover:bg-black` (negro puro), texto blanco

**Tipografía (ya configurada en globals.css):**
- Headings: `font-display` (Playfair Display style), peso `font-black`, `tracking-tight`
- Eyebrow text (categoría, "TE PUEDE INTERESAR"): `text-xs` o `text-sm`, `font-bold` o `font-semibold`, `uppercase`, `tracking-[0.22em]` a `tracking-[0.28em]`, color `text-[#E63946]` para eyebrows principales o `text-gray-400` para metadata de producto
- Body: default sans (Outfit), pesos regulares
- Precios: `font-bold` `text-[#111827]`

**Spacing y layout:**
- Container: `mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8`
- Padding vertical de secciones: `py-14 lg:py-18`
- Gap entre cards: `gap-4 sm:gap-5`
- Border radius: NO usar `rounded-3xl` ni similares en cards (las cards actuales son rectangulares con bordes rectos). Solo `rounded-xl` en botones, `rounded-2xl` en inputs y `rounded-full` en pills.

**ProductCard (referencia del teaser actual, líneas 42-69):**
```
<article className="overflow-hidden border border-gray-200 bg-white shadow-sm">
  <div className="h-[280px] sm:h-[360px] bg-cover bg-center" style={...}/>
  <div className="px-5 py-5 text-left">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">{category}</p>
    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#111827]">{name}</h3>
    <div className="mt-6 flex items-center justify-between gap-3">
      <span className="text-lg font-bold text-[#111827]">{price}</span>
      <button className="inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white hover:bg-black">
        Ver detalle
      </button>
    </div>
  </div>
</article>
```

Para el catálogo full (Bloque H), ProductCard es **idéntico** al del teaser pero adaptado a grid (sin `w-[84vw]` ni `shrink-0` que son del scroll horizontal del teaser). Solo `w-full` dentro de un grid de columnas.

**Layout del catálogo /catalogo:**
- Sidebar de filtros a la **izquierda**, fija en desktop. Width `w-[280px]` desktop. En mobile/tablet (`< lg`), los filtros van como botón "Filtros" arriba que abre un drawer lateral o panel colapsable.
- Grid de productos a la derecha: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`.
- Header del catálogo: eyebrow "CATÁLOGO COMPLETO" en rojo, título grande `font-display`, contador de resultados ("28 productos" en texto secundario).
- Paginación abajo del grid: numeritos clickeables, anterior/siguiente. Estilo minimalista en `text-[#111827]` con item activo subrayado o con fondo `bg-[#111827] text-white`.

**Sidebar de filtros (estilo Monceri, no Mercado Libre):**
- Fondo `bg-white` con `border border-gray-200` o sin borde, según se vea mejor.
- Cada grupo de filtro tiene un eyebrow uppercase tracking-wide (estilo "CATEGORÍA", "PRECIO", "BÚSQUEDA").
- Inputs limpios: `h-11`, `border-gray-200`, `rounded-2xl`, `focus:border-[#E63946]` (mismo estilo que el checkout-form actual línea 102).
- Checkboxes con `accent-[#E63946]` para que se vean rojos cuando seleccionados.
- Botón "Limpiar filtros" en `text-[#E63946]` `text-sm` `font-semibold` `uppercase` `tracking-wide` al final.

**Página de producto /producto/[slug] (Bloque I):**
Layout similar a Apple/luxury brands, NO Amazon-style:
- Container `max-w-[1440px]` con padding lateral.
- Desktop (`lg:`): grid de **2 columnas** con `lg:grid-cols-[1.1fr_0.9fr] gap-12`. Galería izquierda más ancha (54%), info derecha más estrecha (46%).
- Mobile/tablet: una sola columna, galería arriba, info abajo.
- Galería:
  - Foto principal grande con ratio 1:1 o 4:5.
  - Thumbnails horizontales abajo (mobile) o verticales al lado izquierdo (desktop opcional).
  - `border border-gray-200`, sin shadows pesadas.
- Info derecha:
  - Eyebrow "CATEGORÍA EN UPPERCASE" rojo.
  - Title grande `font-display font-black text-4xl lg:text-5xl tracking-tight`.
  - Precio: `text-3xl font-bold text-[#111827]`. Si hay `comparePrice`, mostrar tachado en `text-gray-400 line-through` al lado.
  - Description: `text-base text-gray-600 leading-relaxed mt-6`.
  - Selectores de variantes: agrupados por nombre. Cada grupo tiene eyebrow uppercase + pills/botones. Pills inactivos: `border border-gray-200 bg-white text-[#111827]`. Pill activo: `bg-[#111827] text-white border-[#111827]`.
  - Selector de cantidad: pequeño, mismo estilo que un input numérico simple con +/-.
  - Botón "Agregar al carrito": `h-14 w-full rounded-full bg-[#E63946] text-white font-bold` (igual que el de checkout). Hover `-translate-y-0.5`.

**ProductGallery (interactividad):**
- Click/tap en thumbnail cambia foto principal.
- Mobile: swipe horizontal (touch) cambia foto.
- Desktop: hover sobre foto principal hace zoom sutil (`scale-105`).
- Flechas izquierda/derecha sobreimpuestas en hover desktop.

**ProductVariantSelector (estilo pills horizontales):**
```
Tamaño
[ 50cm ]  [ 70cm ]  [ 90cm ]  [ 100cm ]
Color
[ Rojo ]  [ Blanco ]  [ Cyan ]  [ Rosa ]
```

**Toast "Agregado al carrito":**
- Aparece bottom-right con animación slide-up.
- Fondo `bg-[#111827] text-white`, padding generoso, border-radius `rounded-2xl`.
- Texto: "Agregado al carrito" + botón secundario "Ver carrito".
- Auto-dismiss en 4 segundos.
- Si ya hay un toast activo, reemplazarlo (no apilar).

**Animaciones (Framer Motion ya disponible):**
- Cards del grid: `whileHover={{ y: -4 }}` con transición de 0.2s ease-out.
- Imagen del card: scale `1.05` al hover sobre el card padre (no sobre la imagen directa).
- Toast: slide-up + fade-in.
- NO usar animaciones extravagantes. El estilo Monceri es sobrio y editorial.

**Empty states:**
- Sin productos en filtro: mensaje grande tipo "No encontramos productos con esos filtros" + botón "LIMPIAR FILTROS" rojo uppercase.
- Producto no encontrado en `/producto/[slug-invalido]`: página simple con "Producto no encontrado" + link "Ver catálogo completo".

**Mobile-first checklist:**
- Cards apiladas en una columna.
- Filtros en drawer lateral o panel colapsable arriba.
- Galería con swipe.
- CTAs full-width.
- Padding lateral mínimo `px-4`.
- Tipografías escalan: `text-3xl sm:text-4xl lg:text-5xl` en headings.

**REFERENCIA OBLIGATORIA:**
Antes de codear cualquier componente del catálogo o producto, abrir y leer `apps/web/src/components/sections/product-lines-section.tsx` Y `apps/web/src/components/cart/checkout-form.tsx` para internalizar los patrones de spacing, color y tipografía que ya están en el proyecto. NO inventar variantes nuevas de los mismos tokens.

---

**H1. Cambiar el botón teaser en home:**
En `apps/web/src/components/sections/product-lines-section.tsx`:
- Botón "IR AL CONFIGURADOR" → "VER CATÁLOGO COMPLETO" linkeado a `/catalogo`.
- Mantener visualmente los 4 productos predisenados como teaser, pero ahora son productos reales del backend (los primeros 4 con `featured: true` ordenados por createdAt desc).
- El componente sigue siendo carrusel horizontal con scroll-snap (no convertirlo en grid, eso es solo para `/catalogo`).

**H2. Crear página `/catalogo` en Next.js App Router:**

`apps/web/src/app/catalogo/page.tsx`:
- Server Component que llama `GET /api/products` con los searchParams.
- Recibe filtros desde la URL (`?category=neon&minPrice=1000&maxPrice=5000&sort=price_asc&page=1`).
- Renderiza:
  - Sidebar de filtros (componente client) con: categorías (checkbox), rango de precio (inputs min/max), búsqueda (input con debounce), sort (select).
  - Grid de productos (4 columnas desktop, 2 tablet, 1 mobile).
  - Paginación abajo.
- Filtros actualizan la URL (`router.push`) sin recargar.
- Empty state si no hay productos.

**H3. Componentes de catálogo:**
- `<ProductCatalogGrid>`: recibe items, renderiza cards.
- `<ProductCard>`: thumbnail, name, category, price, link a `/producto/[slug]`. Hover con efecto sutil.
- `<CatalogFilters>`: client component con todos los filtros y debounced search.
- `<CatalogPagination>`: anterior/siguiente + números de página.

**H4. SEO en catálogo:**
- Metadata con title "Catálogo - Monceri" y description.
- Si hay categoría seleccionada: title "Letreros de [Categoría] - Monceri".

**H5. Estilos: Tailwind v4 plano** (igual que el resto del frontend público, sin AntD aquí).

### Bloque I: Frontend público — Página de producto (8-10 horas)

**I1. Crear página `/producto/[slug]` en Next.js:**

`apps/web/src/app/producto/[slug]/page.tsx`:
- Server Component que llama `GET /api/products/:slug`.
- Si 404, mostrar página de no encontrado con link al catálogo.

**I2. Componentes de producto (Tailwind plano, sin AntD):**
- `<ProductGallery>` (client): galería con foto principal grande + thumbnails. Zoom al hover. Navegación con flechas. Mobile: swipe.
- `<ProductInfo>`: name, category, description, price, comparePrice tachado si existe.
- `<ProductVariantSelector>` (client): si el producto tiene variantes:
  - Agrupar por `name` (Tamaño, Color, etc).
  - Mostrar como botones radio o pills.
  - El cliente debe seleccionar una opción de cada grupo de variantes.
  - El precio total se actualiza con los priceAdjust seleccionados.
- `<ProductAddToCart>` (client): selector de cantidad + botón "Agregar al carrito" que llama al store de Zustand.
- `<ProductSpecs>`: lista de especificaciones (si existen como JSON o markdown en description).

**I3. Lógica del carrito para items PRODUCT:**

El store de Zustand (`apps/web/src/stores/cart.ts`) ya tiene el tipo `ProductCartItem` desde la iteración 2. Solo hay que crear el flujo de UI.

Cuando el cliente selecciona variantes y agrega al carrito:
1. Construir `ProductCartItem` con productId, name, variants (objeto key-value), price calculado, qty.
2. Generar id único: `${productId}|${Object.entries(variants).sort().map(([k,v]) => `${k}:${v}`).join('.')}`. Esto garantiza que el mismo producto con mismas variantes incrementa qty, y con variantes distintas crea item separado.
3. Llamar `addItem` del store.
4. Mostrar toast "Agregado al carrito" con botón "Ver carrito".

**I4. SEO en página de producto:**
- Metadata con title `${productName} - Monceri`, description del producto, OG image.
- Schema.org Product structured data en JSON-LD.

**I5. Validación de tipo PRODUCT en el checkout:**

El `checkout-form.tsx` actual ya construye el payload correcto (línea 51-66 que mappea según `item.type === "CONFIGURATOR"` vs PRODUCT). Verificar que efectivamente funciona end-to-end con un producto PRODUCT.

### Bloque J: Pulido final + capacitación (4-5 horas)

**J1. Testing manual completo end-to-end:**
- Login admin, crear categoría, crear 5 productos PRODUCT con variantes e imágenes.
- Verificar en frontend público: catálogo se ve bien, filtros funcionan, página de producto carga, agregar al carrito funciona.
- Crear pedido mixto: 1 letrero configurado + 1 producto del catálogo. Verificar que llega correcto al admin.
- Verificar dashboard con datos reales.

**J2. Material para la tía:**
- PDF de 2-3 páginas con screenshots de:
  - Cómo entrar al panel.
  - Cómo crear un producto nuevo.
  - Cómo gestionar pedidos.
  - Cómo ajustar stock.
- Cambiar password admin del seed (`MonceriAdmin123`) por una real con la tía presente.

**J3. Sesión de capacitación (1-2 horas con la tía):**
- Recorrido completo del panel.
- Ella crea un producto bajo tu supervisión.
- Ella simula gestionar un pedido.
- Resolver dudas.

---

## 3. Reglas técnicas obligatorias

1. **Admin con Refine + Ant Design**. NO removerlos. Usar componentes nativos de AntD: Table, Form, Modal, Tabs, Upload, DatePicker, Select, Card, Statistic, Descriptions, Tag, Empty, Spin, Skeleton, message, notification.

2. **Frontend público con Tailwind plano**. Sin AntD en `apps/web`. Mantiene consistencia con lo ya construido.

3. **Theme primary de AntD = `#E63946`** (rojo Monceri). Es el único custom necesario. Lo demás se queda con look corporativo de AntD.

4. **Locale español obligatorio**. `<ConfigProvider locale={esES}>` y `dayjs.locale("es")`.

5. **Respetar arquitectura backend**. Routes → Controller → Service → Repository.

6. **Schemas compartidos**. Si admin y backend validan lo mismo, el schema vive en `@monceri/shared`.

7. **Forms admin**: usar AntD Form nativo o React Hook Form + AntD según convenga. Refine soporta ambos.

8. **Forms frontend público**: React Hook Form + Zod (consistente con checkout-form.tsx ya existente).

9. **No introducir librerías extra sin justificar**. Stack cerrado. AntD ya trae casi todo.

10. **Auth real**. Cookie HttpOnly en cada request admin.

11. **No tocar el flujo del configurador**. Está funcionando, no romperlo.

12. **No tocar el checkout actual**. Solo verificar que items PRODUCT pasan correctamente.

13. **Performance**. Paginación en listas. Sin N+1.

14. **Confirmaciones para acciones destructivas**. Usar `<Popconfirm>` de AntD para borrar/cancelar.

15. **Mobile-first en frontend público**, desktop-first en admin (tablet legible mínimo).

16. **SEO en frontend público**. Metadata API, semántica correcta.

---

## 4. Plan de pruebas manuales por bloque

**Después de Bloque A (backend):**
- POST `/api/admin/uploads` con JPG 5MB → convierte a WebP, devuelve URL + thumbnailUrl.
- GET la URL → sirve la imagen.
- Subir PDF → 400.
- Subir sin auth → 401.
- GET `/api/products?category=neon&minPrice=1000&page=1&pageSize=12` → devuelve filtrado y paginado.
- GET `/api/products/:slug-no-existe` → 404.

**Después de Bloque C (productos admin):**
- Crear categoría → aparece en lista AntD Table.
- Crear producto con 3 imágenes y 2 variantes → aparece en lista con thumbnail.
- Editar producto, agregar variante → guarda.
- Borrar producto → desaparece (con Popconfirm).

**Después de Bloque D (pedidos admin):**
- Crear pedido desde frontend público → aparece en lista admin con PENDING.
- Confirmar pedido → CONFIRMED, stock decrementa, cupón incrementa.
- Avanzar status: CONFIRMED → IN_PRODUCTION → READY → DELIVERED.
- Cancelar PENDING → CANCELLED, stock NO decrementa.

**Después de Bloque E (inventario):**
- Ajuste +50 con razón "Reposición" → stock aumenta, aparece en histórico.
- Stock bajo del threshold → Tag rojo "Stock bajo".
- Cupón maxUses=1 → agotar → reintentar → backend rechaza.

**Después de Bloque F (dashboard):**
- Ver dashboard con datos reales → métricas coherentes en `<Statistic>` cards.
- Pedido nuevo → métricas se actualizan al refrescar.

**Después de Bloque H (catálogo):**
- `/catalogo` carga grid de productos.
- Filtros funcionan: categoría, precio, búsqueda, sort.
- Paginación funciona.
- Empty state si no hay resultados.

**Después de Bloque I (página producto):**
- `/producto/the-sarmientos` carga.
- Galería navegable.
- Selección de variantes actualiza precio.
- Agregar al carrito funciona, item aparece en drawer.
- Persiste en recarga (Zustand persist).

**Final completo:**
- Pedido mixto (1 configurado + 1 PRODUCT) llega correcto al admin.
- WhatsApp message muestra ambos items con sus detalles.
- Admin puede confirmar → stock decrementa solo de items con `trackStock: true`.

---

## 5. Variables de entorno nuevas

```bash
# apps/admin/.env
VITE_API_URL=http://localhost:4000

# apps/api/.env (agregar si no existe)
UPLOADS_DIR=./uploads
UPLOADS_URL_PREFIX=/uploads
MAX_UPLOAD_SIZE_BYTES=5242880
```

---

## 6. Lo que NO debes hacer

- No tocar el flujo del configurador (`use-configurator.ts`, `configurator-data.ts`).
- No tocar el checkout (`checkout-form.tsx`).
- No tocar el shared package excepto para agregar schemas nuevos del catálogo.
- No remover Ant Design del admin (es la base del setup).
- No agregar Tailwind al admin (no es necesario, AntD basta).
- No agregar pagos en línea.
- No agregar facturación CFDI.
- No agregar módulo de envíos.
- No agregar gestión de clientes/CRM.
- No agregar i18n más allá del locale español de AntD.
- No agregar dark mode.
- No agregar Sentry todavía.
- No regenerar JWT keys.
- No tocar Postgres directamente, todo vía Prisma migrations.
- No instalar Docker/WSL.

---

## 7. Definición de "terminado"

El proyecto está terminado cuando:

- [ ] La tía puede crear/editar/borrar productos y categorías sin ayuda.
- [ ] La tía puede subir fotos directamente desde el panel.
- [ ] La tía puede gestionar pedidos completos.
- [ ] La tía puede ajustar stock y ver histórico.
- [ ] La tía puede crear cupones.
- [ ] El dashboard muestra métricas reales del mes.
- [ ] El catálogo público en `/catalogo` muestra los productos cargados con filtros y paginación.
- [ ] Cada producto tiene su página de detalle en `/producto/[slug]`.
- [ ] El cliente puede agregar productos PRODUCT al carrito y mezclarlos con configurados.
- [ ] El checkout WhatsApp funciona con pedidos mixtos.
- [ ] Admin se ve limpio en desktop, legible en tablet.
- [ ] Login y logout funcionan con cookies HttpOnly.
- [ ] Todos los endpoints admin protegidos por auth.
- [ ] Código respeta patrón modular del CONTEXT.md.
- [ ] `pnpm -r lint && pnpm -r typecheck && pnpm -r build` pasan.
- [ ] La tía recibió capacitación y entiende cómo usarlo.
- [ ] PDF de manual entregado.

---

## 8. Compromiso post-entrega

Recordar al cliente:
- 15 días de soporte incluido para correcciones.
- Cualquier feature nueva (CFDI, envíos, etc.) se cotiza aparte.
- Código entregado en repo privado o copia local.
- Backups Postgres se configuran al desplegar Hetzner (próxima iteración 4 de despliegue).
