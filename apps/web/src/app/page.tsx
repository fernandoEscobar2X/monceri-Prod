import { MonceriHomePrototype } from "@/components/sections/monceri-home-experience";
import { fetchHomeBannerCollection } from "@/lib/collections";
import { fetchProducts, productImageUrl } from "@/lib/products";

export default async function Home() {
  const [featuredProducts, bannerCollection] = await Promise.all([
    fetchProducts({ featured: true, pageSize: 4 })
      .then((response) =>
        response.items.map((product) => ({
          category: product.categoryName ?? product.category?.name ?? "Monceri",
          image: productImageUrl(product.thumbnail ?? product.images[0]?.url),
          name: product.name,
          price: product.basePrice,
          slug: product.slug,
        })),
      )
      .catch(() => []),
    fetchHomeBannerCollection().catch(() => null),
  ]);

  return <MonceriHomePrototype bannerCollection={bannerCollection} featuredProducts={featuredProducts} />;
}
