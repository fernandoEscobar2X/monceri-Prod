import { MonceriHomePrototype } from "@/components/sections/monceri-home-experience";
import { fetchProducts, productImageUrl } from "@/lib/products";

export default async function Home() {
  const featuredProducts = await fetchProducts({ featured: true, pageSize: 4 })
    .then((response) =>
      response.items.map((product) => ({
        category: product.categoryName ?? product.category?.name ?? "Monceri",
        image: productImageUrl(product.thumbnail ?? product.images[0]?.url),
        name: product.name,
        price: product.basePrice,
        slug: product.slug,
      })),
    )
    .catch(() => []);

  return <MonceriHomePrototype featuredProducts={featuredProducts} />;
}
