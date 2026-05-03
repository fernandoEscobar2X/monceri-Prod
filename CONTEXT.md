# MONCERI — Context File

> **Propósito de este archivo:** Documento de contexto para cualquier IA (Claude, GPT, Cursor, etc.) que asista en el desarrollo del proyecto Monceri. Contiene arquitectura, patrones, decisiones técnicas, estructura de código y reglas de implementación. Léelo completo antes de generar cualquier código.

**Última actualización:** Mayo 2026
**Cliente:** Monceri (familiar de Cineret)
**Vendor:** VisibleMX (Fernando)
**Tipo:** E-commerce con cierre por WhatsApp + panel admin con inventario
**Precio cerrado:** $4,000 MXN
**Timeline:** 4-5 semanas (alcance ampliado vs Opción 2 original)

---

## 1. CONTEXTO DEL NEGOCIO

Monceri es un negocio de letreros de neón, acrílico y MDF cortado con láser, ubicado en México. Vende letreros personalizados (texto custom, color, tamaño, fuente) y piezas decorativas para negocios, eventos y espacios.

**Inspiración de referencia:** electricneon.com.mx (Shopify, salió en Shark Tank México). Replicar nivel de funcionalidad y experiencia visual, pero sin pagos en línea (cierre por WhatsApp).

**Modelo de operación:**
1. Cliente entra al sitio, navega catálogo, ve fotos y precios.
2. Configura su producto (texto, tamaño, color, fuente para neones).
3. Agrega al carrito, sigue navegando.
4. Al finalizar, presiona "Pedir por WhatsApp" → genera mensaje pre-armado con resumen completo (productos, variantes, totales).
5. Monceri recibe el mensaje, cierra venta por WhatsApp, coordina pago y envío directamente.
6. Monceri actualiza stock e inventario manualmente desde panel admin.

**Lo que NO hace este sistema:**
- No procesa pagos en línea (no Mercado Pago, no Stripe, no nada).
- No tiene cuentas de cliente con login.
- No tiene checkout dentro del sitio.
- No emite facturas (eso será add-on futuro).

---

## 2. STACK TECNOLÓGICO (DEFINITIVO)

### Frontend
- **Framework:** Next.js 14+ con App Router
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** Tailwind CSS (utility-first, no CSS modules ni styled-components)
- **Forms:** React Hook Form + Zod resolver
- **Estado global:** Zustand (carrito, UI state)
- **Animaciones:** Framer Motion (uso moderado, no abusar)
- **Iconos:** Lucide React

### Backend
- **Framework:** Fastify + TypeScript (NO Express)
- **ORM:** Prisma
- **Database:** PostgreSQL 16+
- **Validación:** Zod (schemas compartidos con frontend vía paquete shared)
- **Auth admin:** HttpOnly cookies + JWT (RS256, no HS256) + bcrypt salt 12
- **Logs:** Pino (structured JSON logging)
- **Errores en producción:** Sentry (free tier para empezar)

### Panel Admin
- **Framework:** Refine (refine.dev)
- **UI:** Refine + Ant Design o Refine + Tailwind (definir al implementar)
- **Conexión:** Custom data provider que apunta a la API Fastify

### Infra
- **Hosting:** Hetzner Cloud CPX22 (Ashburn, Virginia) — €7.99/mes
- **OS:** Ubuntu 24.04 LTS
- **Reverse proxy:** Nginx
- **Process manager:** PM2 (no Docker en v1)
- **SSL:** Let's Encrypt + certbot (auto-renovación)
- **Backups:** Hetzner backups automáticos (20% adicional sobre el costo del servidor)
- **DNS:** Cloudflare (gratis) frente al dominio

### Repositorio
- **Estructura:** Monorepo con pnpm workspaces
- **Git:** GitHub (repo privado del cliente, código entregable al final)

---

## 3. ESTRUCTURA DEL MONOREPO

```
monceri/
├── apps/
│   ├── web/                  # Frontend Next.js (sitio público)
│   │   ├── src/
│   │   │   ├── app/          # App Router pages
│   │   │   ├── components/
│   │   │   │   ├── layout/   # Navbar, Footer, AnnouncementBar
│   │   │   │   ├── sections/ # Hero, Gallery, FAQ, Reviews, Process
│   │   │   │   └── ui/       # Button, Card, Input, etc.
│   │   │   ├── lib/          # api client, utils, constants
│   │   │   ├── hooks/        # custom React hooks
│   │   │   ├── stores/       # Zustand stores (cart, ui)
│   │   │   └── styles/       # globals.css (Tailwind directives)
│   │   ├── public/           # static assets
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   │
│   ├── admin/                # Panel admin con Refine
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── providers/    # Refine data/auth providers
│   │   │   ├── resources/    # Refine resources (products, orders, etc.)
│   │   │   └── components/
│   │   └── package.json
│   │
│   └── api/                  # Backend Fastify
│       ├── src/
│       │   ├── modules/      # Modular monolith (ver sección 4)
│       │   │   ├── auth/
│       │   │   ├── products/
│       │   │   ├── categories/
│       │   │   ├── orders/
│       │   │   ├── inventory/
│       │   │   ├── coupons/
│       │   │   ├── uploads/
│       │   │   └── shared/
│       │   ├── plugins/      # Fastify plugins (cors, helmet, jwt, etc.)
│       │   ├── lib/          # prisma client, logger, errors
│       │   ├── config/       # env validation con Zod
│       │   └── server.ts     # entry point
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       └── tsconfig.json
│
├── packages/
│   ├── shared/               # tipos y schemas Zod compartidos
│   │   └── src/
│   │       ├── schemas/      # Zod schemas (Product, Order, etc.)
│   │       └── types/        # tipos TypeScript derivados
│   │
│   └── eslint-config/        # config compartida de ESLint
│
├── docker-compose.yml        # solo para desarrollo local (PostgreSQL)
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── README.md
```

---

## 4. ARQUITECTURA: MODULAR MONOLITH

El backend NO es microservicios. Es un **monolito modular** donde cada dominio del negocio vive en su propio módulo con frontera clara.

### Estructura de cada módulo

Cada módulo en `apps/api/src/modules/<nombre>/` sigue este patrón **OBLIGATORIO**:

```
modules/products/
├── products.routes.ts       # Definición de rutas Fastify
├── products.controller.ts   # Maneja request/response HTTP
├── products.service.ts      # Lógica de negocio (PURO, sin HTTP ni DB)
├── products.repository.ts   # Única capa que habla con Prisma
├── products.schemas.ts      # Schemas Zod de input/output
├── products.types.ts        # Tipos TypeScript del módulo
└── products.errors.ts       # Errores específicos del dominio
```

### Reglas de capas

**Controller:**
- Recibe la request de Fastify.
- Valida el body/params/query con el schema Zod del módulo.
- Llama al Service con datos ya validados.
- Devuelve la response. NUNCA contiene lógica de negocio.
- NUNCA habla directo con Prisma.

**Service:**
- Contiene TODA la lógica de negocio.
- Llama a repositorios (propios y de otros módulos vía contratos).
- Aplica reglas: validar stock disponible, calcular totales, aplicar cupones, etc.
- NO sabe nada de HTTP (ni req, ni res, ni status codes).
- NO habla directo con Prisma.
- Lanza errores tipados (de `*.errors.ts`).

**Repository:**
- ÚNICA capa que importa `prisma` y ejecuta queries.
- Funciones puras: recibe params, devuelve datos o lanza error.
- NO contiene lógica de negocio (no decide, solo ejecuta).
- NO sabe nada de HTTP.

### Comunicación entre módulos

Los módulos se comunican vía **contratos exportados** (interfaces de servicios), NUNCA importando repositorios de otros módulos directamente.

Ejemplo: el módulo `orders` necesita saber stock de productos. El service de orders importa `ProductsService`, no `productsRepository`.

```typescript
// MAL ❌
import { productsRepository } from '../products/products.repository';

// BIEN ✅
import { ProductsService } from '../products/products.service';
```

---

## 5. SCHEMA DE BASE DE DATOS

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────
// AUTH (solo admin, no clientes)
// ─────────────────────────────────────
model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash, salt 12
  name      String
  role      AdminRole @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?
}

enum AdminRole {
  ADMIN
  SUPERADMIN
}

// ─────────────────────────────────────
// CATÁLOGO
// ─────────────────────────────────────
model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  sortOrder   Int       @default(0)
  active      Boolean   @default(true)
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id          String           @id @default(cuid())
  name        String
  slug        String           @unique
  description String           @db.Text
  basePrice   Decimal          @db.Decimal(10, 2)
  comparePrice Decimal?        @db.Decimal(10, 2) // precio tachado
  category    Category         @relation(fields: [categoryId], references: [id])
  categoryId  String
  images      ProductImage[]
  variants    ProductVariant[]

  // Inventario
  trackStock  Boolean          @default(true)
  stock       Int              @default(0)
  lowStockAlert Int            @default(5)

  // Estado
  active      Boolean          @default(true)
  featured    Boolean          @default(false)

  // SEO
  metaTitle       String?
  metaDescription String?

  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  orderItems  OrderItem[]

  @@index([categoryId])
  @@index([active, featured])
}

model ProductImage {
  id        String   @id @default(cuid())
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
  url       String
  alt       String?
  sortOrder Int      @default(0)

  @@index([productId])
}

model ProductVariant {
  id          String   @id @default(cuid())
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId   String
  name        String   // "Tamaño", "Color", "Fuente"
  value       String   // "50cm", "Rojo", "Cursive"
  priceAdjust Decimal  @default(0) @db.Decimal(10, 2)
  stock       Int?     // null = no se controla stock por variante
  active      Boolean  @default(true)

  @@index([productId])
}

// ─────────────────────────────────────
// PEDIDOS (de WhatsApp, no pagos)
// ─────────────────────────────────────
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique // MNC-2026-001
  status          OrderStatus @default(PENDING)

  // Datos del cliente (no hay cuenta, viene del form)
  customerName    String
  customerPhone   String
  customerEmail   String?

  // Totales
  subtotal        Decimal     @db.Decimal(10, 2)
  discount        Decimal     @default(0) @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)

  // WhatsApp tracking
  whatsappSent    Boolean     @default(false)
  whatsappSentAt  DateTime?
  notes           String?     @db.Text // notas internas del admin

  items           OrderItem[]
  coupon          Coupon?     @relation(fields: [couponId], references: [id])
  couponId        String?

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  PENDING       // recién llegó por WhatsApp
  CONFIRMED     // admin confirmó por WhatsApp con cliente
  IN_PRODUCTION // letrero en fabricación
  READY         // listo para envío/pickup
  DELIVERED     // entregado al cliente
  CANCELLED
}

model OrderItem {
  id          String   @id @default(cuid())
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId     String
  product     Product  @relation(fields: [productId], references: [id])
  productId   String

  // Snapshot del producto al momento del pedido
  productName String
  variantData Json     // { "Tamaño": "50cm", "Color": "Rojo", "Texto": "Hola" }
  unitPrice   Decimal  @db.Decimal(10, 2)
  quantity    Int
  subtotal    Decimal  @db.Decimal(10, 2)

  @@index([orderId])
}

// ─────────────────────────────────────
// CUPONES
// ─────────────────────────────────────
model Coupon {
  id          String      @id @default(cuid())
  code        String      @unique
  type        CouponType
  value       Decimal     @db.Decimal(10, 2)
  minPurchase Decimal?    @db.Decimal(10, 2)
  maxUses     Int?
  usedCount   Int         @default(0)
  expiresAt   DateTime?
  active      Boolean     @default(true)
  createdAt   DateTime    @default(now())
  orders      Order[]
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
}

// ─────────────────────────────────────
// INVENTARIO (movimientos de stock)
// ─────────────────────────────────────
model StockMovement {
  id          String   @id @default(cuid())
  productId   String
  variantId   String?
  type        StockMovementType
  quantity    Int      // positivo = entrada, negativo = salida
  reason      String   // "Pedido confirmado", "Reposición", "Ajuste manual"
  orderId     String?
  adminId     String
  createdAt   DateTime @default(now())

  @@index([productId])
  @@index([createdAt])
}

enum StockMovementType {
  PURCHASE     // compra de inventario
  SALE         // venta a cliente
  ADJUSTMENT   // ajuste manual del admin
  RETURN       // devolución
}
```

---

## 6. FLUJO DE WHATSAPP (CRÍTICO)

Este es el corazón del sistema. Cuando el cliente presiona "Pedir por WhatsApp":

### Paso 1: Frontend arma el carrito
El estado del carrito vive en Zustand (`stores/cart.ts`). Persiste en localStorage para que no se pierda al recargar.

### Paso 2: POST a `/api/orders`
El frontend envía el carrito al backend ANTES de abrir WhatsApp:

```typescript
POST /api/orders
{
  customerName: "Juan Pérez",
  customerPhone: "+52 1234567890",
  customerEmail: "juan@ejemplo.com",
  couponCode: "BIENVENIDA10", // opcional
  items: [
    {
      productId: "abc123",
      quantity: 1,
      variants: { "Tamaño": "50cm", "Color": "Rojo", "Texto": "Hola" }
    }
  ]
}
```

### Paso 3: Backend valida y crea la orden
El service:
1. Valida productos contra DB (existen, activos).
2. Valida stock disponible (no decrementa todavía).
3. Recalcula precios desde DB (NUNCA confía en el frontend).
4. Aplica cupón si existe.
5. Crea la orden con status `PENDING` y `whatsappSent: false`.
6. Devuelve el orderNumber y un mensaje pre-armado para WhatsApp.

### Paso 4: Frontend abre WhatsApp con mensaje
```typescript
const message = encodeURIComponent(orderResponse.whatsappMessage);
const phoneNumber = "521XXXXXXXXXX"; // número de Monceri
window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');

// Marcar la orden como enviada
fetch(`/api/orders/${orderResponse.orderNumber}/mark-sent`, { method: 'POST' });
```

### Mensaje pre-armado (ejemplo)
```
🛒 Nuevo pedido Monceri #MNC-2026-001

👤 Cliente: Juan Pérez
📞 Teléfono: +52 1234567890

📦 Productos:
1. Letrero Neón Personalizado
   - Texto: "Hola"
   - Tamaño: 50cm
   - Color: Rojo
   - Cantidad: 1
   - $1,500.00

💰 Subtotal: $1,500.00
🎟️ Descuento (BIENVENIDA10): -$150.00
💳 Total: $1,350.00

📝 Nota: Este pedido está registrado en el sistema con folio MNC-2026-001.
```

### Paso 5: Monceri responde por WhatsApp
Cierra la venta manualmente. Cuando confirma con el cliente, entra al panel admin y cambia el status a `CONFIRMED`. Eso dispara el decremento de stock vía StockMovement.

---

## 7. PANEL ADMIN CON REFINE

### Setup base
- Crear app dentro del monorepo en `apps/admin`.
- Refine v4+ con Vite (no Next.js, mejor en development).
- Tailwind para custom styling sobre la UI de Refine.
- Auth provider que apunta a `/api/admin/auth/login` y maneja JWT en HttpOnly cookies.
- Data provider custom (no usar `@refinedev/simple-rest` directo) que mapea las respuestas de la API Fastify al formato de Refine.

### Resources

**Productos:**
- List: tabla con nombre, categoría, precio, stock, estado activo. Búsqueda y filtros.
- Create/Edit: form con todos los campos. Upload de imágenes. Variantes inline.
- Show: detalle del producto con historial de pedidos.

**Categorías:** CRUD básico.

**Pedidos:**
- List: tabla con folio, cliente, total, status, fecha.
- Show: detalle del pedido con items, datos del cliente, link a WhatsApp del cliente.
- Edit: cambiar status (PENDING → CONFIRMED → IN_PRODUCTION → READY → DELIVERED). Agregar notas internas.

**Inventario:**
- Vista de stock por producto con alertas de stock bajo.
- Botón de "Ajuste manual" que crea un StockMovement.
- Historial de movimientos por producto.

**Cupones:** CRUD básico con código, tipo, valor, fecha de expiración, contador de usos.

**Dashboard:**
- Cards con: pedidos del mes, ventas del mes, productos con stock bajo, pedidos pendientes.
- Gráfica de ventas por semana (Recharts).
- Lista de últimos pedidos.

---

## 8. SEGURIDAD (NO NEGOCIABLE)

### Infraestructura
- HTTPS forzado (HTTP → HTTPS redirect en Nginx).
- HSTS header con preload.
- Firewall en Hetzner: solo puertos 22 (SSH), 80, 443.
- SSH solo con llaves, sin password auth.
- Fail2ban contra brute force SSH.

### Aplicación
- Helmet plugin de Fastify (CSP, X-Frame-Options, X-Content-Type-Options).
- CORS estricto: solo el dominio del frontend.
- Rate limiting con `@fastify/rate-limit`: 100 req/min por IP en endpoints públicos, 10 req/min en `/api/admin/auth/login`.
- Validación con Zod en CADA endpoint. Sin excepciones.
- Sanitización de outputs (escape HTML en descripciones de productos cuando se renderice).

### Auth admin
- Bcrypt salt rounds = 12.
- JWT en HttpOnly + Secure + SameSite=Strict cookies.
- JWT con RS256 (par de llaves), no HS256.
- Token TTL: 15 min access token + 7 días refresh token.
- Bloqueo progresivo tras 5 intentos fallidos (1 min → 5 min → 30 min → 24 hrs).

### Database
- PostgreSQL solo escucha en localhost (no expuesto a internet).
- Usuario de aplicación con privilegios mínimos (no superuser).
- Backups cifrados (Hetzner snapshots + dump diario a Storage Box).
- Connection string en variables de entorno, nunca commiteado.

### Uploads
- Multer/Fastify-multipart con límite de tamaño (5 MB por imagen).
- Validar MIME type en backend (no confiar en extensión).
- Resize automático con Sharp (max 1920px).
- Convertir a WebP para servir en sitio público.
- Nombres random (UUID) en disco, NO el nombre original.

---

## 9. SEO Y PERFORMANCE

- Next.js con SSG en home, catálogo, páginas de producto.
- ISR (revalidate every 1 hour) en producto pages.
- Metadata API en cada page (title, description, OG tags).
- Sitemap.xml generado automáticamente.
- robots.txt configurado.
- Imágenes con next/image (lazy loading + WebP automático).
- Lighthouse score objetivo: 90+ en Performance, Accessibility, SEO.
- No usar `<img>` nunca, siempre `next/image`.
- Fonts con `next/font` (no Google Fonts CDN).

---

## 10. CONVENCIONES DE CÓDIGO

### TypeScript
- `strict: true` en todos los tsconfig.
- No `any`. Si es absolutamente necesario, comentario explicando por qué.
- No `as` casting sin razón. Mejor usar type guards.
- Interfaces para objetos públicos, types para uniones e internos.
- Imports absolutos con paths (`@/components/...`, `@api/modules/...`).

### Naming
- Files: kebab-case (`product-card.tsx`, `orders.service.ts`).
- Components: PascalCase (`ProductCard`).
- Functions/variables: camelCase.
- Constants: UPPER_SNAKE_CASE.
- Types/Interfaces: PascalCase, sin prefijo `I`.

### Errores
- Nunca `throw new Error("string")` en código de negocio. Usar errores tipados.
- Cada módulo tiene su `*.errors.ts` con clases que extienden de un `AppError` base.
- El error handler global de Fastify mapea errores a status codes apropiados.

### Commits
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- En español está bien si Fernando prefiere, pero ser consistente.

### Tests
- No es prioridad para v1 dado el alcance ($4,000).
- Si se hace, Vitest para unit tests de services.
- Playwright para E2E del flujo crítico de WhatsApp.

---

## 11. VARIABLES DE ENTORNO

```bash
# apps/api/.env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://monceri:PASSWORD@localhost:5432/monceri
JWT_PRIVATE_KEY_PATH=/etc/monceri/jwt-private.pem
JWT_PUBLIC_KEY_PATH=/etc/monceri/jwt-public.pem
COOKIE_SECRET=<random 64 chars>
WHATSAPP_PHONE_NUMBER=521XXXXXXXXXX
ADMIN_FRONTEND_URL=https://admin.monceri.com.mx
WEB_FRONTEND_URL=https://monceri.com.mx
SENTRY_DSN=<si aplica>
LOG_LEVEL=info

# apps/web/.env.local
NEXT_PUBLIC_API_URL=https://api.monceri.com.mx
NEXT_PUBLIC_WHATSAPP_NUMBER=521XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://monceri.com.mx

# apps/admin/.env
VITE_API_URL=https://api.monceri.com.mx
```

Validar TODAS las env vars con Zod al arrancar el server (`apps/api/src/config/env.ts`). Si falta una, el server NO arranca.

---

## 12. PLAN DE FASES (ESTIMADO)

| Fase | Días | Entregable |
|------|------|------------|
| 0. Setup monorepo + DB schema + seed | 2 | Workspace pnpm, Prisma migrado, seeders |
| 1. API: products, categories, uploads | 4 | CRUD funcional con tests Postman |
| 2. API: orders, coupons, inventario | 4 | Flujo de orden + WhatsApp message |
| 3. API: auth admin + middleware | 2 | Login admin funcionando |
| 4. Frontend: layout + home + catálogo | 4 | Sitio navegable con datos reales |
| 5. Frontend: producto + carrito + WhatsApp | 4 | Flujo completo de pedido |
| 6. Admin: setup Refine + resources base | 4 | CRUD productos, categorías, cupones |
| 7. Admin: pedidos + inventario + dashboard | 4 | Panel completo funcional |
| 8. Deploy Hetzner + Nginx + SSL | 2 | Producción funcionando |
| 9. Carga de datos reales + capacitación | 2 | Cliente operando solo |

**Total estimado:** ~32 días de trabajo (~4-5 semanas).

---

## 13. REGLAS PARA LA IA QUE ASISTE EN EL CÓDIGO

1. **Lee este archivo completo antes de generar código.** No asumir, no inferir cosas que no están escritas aquí.

2. **Respeta la arquitectura modular.** Si pido un endpoint, genera Routes + Controller + Service + Repository + Schemas. NO mezcles capas.

3. **Nunca metas Prisma fuera del Repository.** Ni siquiera para "pruebas rápidas". Si lo veo, lo borro.

4. **Valida con Zod siempre.** Cada endpoint que recibe datos del exterior se valida. Sin excepciones.

5. **Tipos compartidos en `packages/shared`.** Si un schema lo usan frontend y backend, vive ahí.

6. **Errores tipados.** No `throw new Error("Producto no encontrado")`. Usa `throw new ProductNotFoundError(id)`.

7. **No instales librerías extra sin avisar.** El stack está cerrado. Si propones algo nuevo, justifícalo.

8. **No uses `any`.** Si algo no se puede tipar, primero busca el tipo correcto.

9. **Comentarios solo donde aclaran intención.** No comentarios obvios tipo `// loop sobre productos`.

10. **Antes de generar 200 líneas de código, propón el plan.** Especialmente en módulos nuevos.

11. **Fernando NO es senior.** Explica decisiones técnicas no obvias en los PRs/commits o cuando entregues código. Pero sin tratarlo como principiante absoluto.

12. **Si Fernando pide algo que rompe la arquitectura, dile que no.** Y explica por qué. No regresar a "código spaghetti" por presión de tiempo.

13. **El cliente real es la tía de Cineret.** El código debe quedar mantenible para que en el futuro otro dev (o Fernando mismo en 6 meses) pueda entenderlo.

14. **Performance no es prematura aquí.** Pero tampoco metas N+1 queries obvios. Usa `include` de Prisma cuando corresponda.

15. **Mobile-first siempre.** El 70%+ del tráfico de e-commerce en México es móvil.

---

## 14. NOTAS FINALES

- Este proyecto es portafolio Y deal real. Tiene que quedar entregable.
- El código se le entrega al cliente al final (repo privado transferido o copia).
- Capacitación incluida: cómo usar el panel admin, cómo subir productos, cómo gestionar pedidos.
- 15 días post-entrega para correcciones sin costo (lo prometido en cotización).
- Cualquier feature nueva post-entrega se cotiza aparte.

---

**Mantén este archivo actualizado conforme avance el proyecto.** Cuando agregues módulos nuevos, actualiza la estructura. Cuando cambies decisiones técnicas, actualiza la sección correspondiente.
