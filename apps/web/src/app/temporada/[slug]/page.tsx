import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCatalogGrid } from "@/components/catalog/product-catalog-grid";
import { collectionImageUrl, fetchCollection } from "@/lib/collections";

type SeasonPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await fetchCollection(slug).catch(() => null);

  if (!collection) {
    return {
      title: "Temporada no encontrada - Monceri",
    };
  }

  return {
    description: collection.tagline ?? collection.description ?? "Temporada Monceri.",
    openGraph: {
      images: [collectionImageUrl(collection.bannerImageUrl)],
    },
    title: `${collection.name} - Monceri`,
  };
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { slug } = await params;
  const collection = await fetchCollection(slug).catch(() => null);

  if (!collection) {
    notFound();
  }

  const image = collectionImageUrl(collection.bannerImageUrl);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    description: collection.description ?? collection.tagline,
    image,
    name: collection.name,
    url: `/temporada/${collection.slug}`,
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" />
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-2xl font-black tracking-tight">
            M<span className="text-[#E63946]">O</span>NCERI
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-gray-600">
            <Link href="/#configurador" className="hover:text-[#111827]">
              Configurador
            </Link>
            <Link href="/catalogo" className="hover:text-[#111827]">
              Catalogo
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/10] overflow-hidden border-2 border-[#111827] bg-[#111827] shadow-[8px_8px_0_#111827] sm:aspect-[16/7]">
          <Image alt={collection.name} className="object-cover opacity-70" fill priority sizes="100vw" src={image} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/88 via-[#111827]/48 to-transparent" />
          <div className="relative z-10 flex h-full max-w-4xl flex-col justify-center px-5 py-8 text-white sm:px-8 lg:px-12">
            {collection.tagline ? (
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#E63946] sm:text-sm">
                {collection.tagline}
              </p>
            ) : null}
            <h1 className="font-display mt-4 text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-7xl">
              {collection.name}
            </h1>
            {collection.description ? (
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
                {collection.description}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
              Temporada Monceri
            </p>
            <h2 className="font-display mt-3 text-4xl font-black tracking-tight">
              Productos en esta coleccion
            </h2>
          </div>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white hover:bg-black"
            href="/catalogo"
          >
            Ver catalogo completo
          </Link>
        </div>

        {collection.products.length > 0 ? (
          <ProductCatalogGrid products={collection.products} />
        ) : (
          <div className="border border-gray-200 bg-white px-6 py-16 text-center">
            <h3 className="font-display text-3xl font-black tracking-tight">
              Esta temporada aun no tiene productos.
            </h3>
            <Link
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#111827] px-5 text-sm font-semibold text-white hover:bg-black"
              href="/catalogo"
            >
              Ir al catalogo
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
