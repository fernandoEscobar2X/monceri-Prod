import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { ProductCatalogGrid } from "@/components/catalog/product-catalog-grid";
import { fetchCategories, fetchProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catálogo - Monceri",
  description: "Catálogo de letreros Monceri prediseñados con pedido por WhatsApp.",
};

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const query = {
    category: single(params.category),
    maxPrice: single(params.maxPrice),
    minPrice: single(params.minPrice),
    page: single(params.page) ?? "1",
    pageSize: single(params.pageSize) ?? "12",
    search: single(params.search),
    sort: single(params.sort) ?? "featured",
  };
  const [products, categories] = await Promise.all([
    fetchProducts(query).catch(() => ({ items: [], page: 1, pageSize: 12, total: 0, totalPages: 0 })),
    fetchCategories().catch(() => []),
  ]);
  const flatParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, single(value)]),
  );

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-display text-2xl font-black tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E63946]"
          >
            M<span className="text-[#E63946]">O</span>NCERI
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-gray-600">
            <Link
              href="/#configurador"
              className="hover:text-[#111827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E63946]"
            >
              Configurador
            </Link>
            <Link
              href="/catalogo"
              className="hover:text-[#111827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E63946]"
            >
              Catálogo
            </Link>
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
              Catálogo completo
            </p>
            <h1 className="font-display mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Productos listos para tu espacio.
            </h1>
            <p className="mt-4 text-sm text-gray-500">{products.total} productos</p>
          </div>
          <Link
            href="/#configurador"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[#E63946] px-5 text-sm font-bold uppercase tracking-[0.16em] !text-white shadow-[0_18px_34px_rgba(230,57,70,0.24)] transition hover:-translate-y-0.5 hover:!text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111827]"
          >
            Diseña tu propio letrero
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="flex gap-8">
          <CatalogFilters categories={categories} />
          <div className="min-w-0 flex-1">
            {products.items.length > 0 ? (
              <>
                <ProductCatalogGrid products={products.items} />
                <CatalogPagination
                  page={products.page}
                  searchParams={flatParams}
                  totalPages={products.totalPages}
                />
              </>
            ) : (
              <div className="border border-gray-200 bg-white px-6 py-16 text-center">
                <h2 className="font-display text-3xl font-black tracking-tight">
                  No encontramos productos con esos filtros
                </h2>
                <Link
                  href="/catalogo"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-5 text-sm font-semibold !text-white hover:bg-black hover:!text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E63946]"
                >
                  Limpiar filtros
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
