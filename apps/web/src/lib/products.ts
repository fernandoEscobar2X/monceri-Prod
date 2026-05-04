import type { Category, ProductListResponse, ProductSummary } from "@monceri/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function productImageUrl(src?: string | null) {
  if (!src) {
    return "/monceri-hero-installation.jpg";
  }

  if (src.startsWith("http") || !src.startsWith("/uploads")) {
    return src;
  }

  return `${API_URL}${src}`;
}

export async function fetchProducts(query: Record<string, boolean | number | string | undefined> = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const response = await fetch(`${API_URL}/api/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar productos");
  }

  return (await response.json()) as ProductListResponse;
}

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/api/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar categorias");
  }

  return (await response.json()) as Category[];
}

export async function fetchProduct(slug: string) {
  const response = await fetch(`${API_URL}/api/products/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("No se pudo cargar producto");
  }

  return (await response.json()) as ProductSummary;
}
