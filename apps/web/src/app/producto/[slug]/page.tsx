import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { formatPrice } from "@/lib/formatters/price";
import { fetchProduct, productImageUrl } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug).catch(() => null);

  if (!product) {
    return {
      title: "Producto no encontrado - Monceri",
    };
  }

  return {
    description: product.metaDescription ?? product.description,
    openGraph: {
      images: [productImageUrl(product.thumbnail ?? product.images[0]?.url)],
    },
    title: `${product.metaTitle ?? product.name} - Monceri`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug).catch(() => null);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    description: product.description,
    image: productImageUrl(product.thumbnail ?? product.images[0]?.url),
    name: product.name,
    offers: {
      "@type": "Offer",
      availability: product.trackStock && product.stock <= 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      price: product.basePrice,
      priceCurrency: "MXN",
    },
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
      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-8 lg:py-14">
        <ProductGallery images={product.images} name={product.name} />
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
            {(product.categoryName ?? product.category?.name ?? "Monceri").toUpperCase()}
          </p>
          <h1 className="font-display mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-5 flex items-center gap-4">
            <span className="text-3xl font-bold">{formatPrice(product.basePrice)}</span>
            {product.comparePrice ? (
              <span className="text-xl font-semibold text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            ) : null}
          </div>
          <p className="mt-6 text-base leading-7 text-gray-600">{product.description}</p>
          <ProductPurchase product={product} />
        </div>
      </section>
    </main>
  );
}
