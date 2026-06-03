import type { Collection, CollectionSummary } from "@monceri/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function collectionImageUrl(src?: null | string) {
  if (!src) {
    return "/monceri-hero-installation.jpg";
  }

  if (src.startsWith("http") || !src.startsWith("/uploads")) {
    return src;
  }

  return `${API_URL}${src}`;
}

export async function fetchHomeBannerCollection() {
  const response = await fetch(`${API_URL}/api/home/banner-collection`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar la temporada destacada");
  }

  return (await response.json()) as Collection | null;
}

export async function fetchPopupCollection() {
  const response = await fetch(`${API_URL}/api/collections/popup-active`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar el popup de temporada");
  }

  return (await response.json()) as Collection | null;
}

export async function fetchCollection(slug: string) {
  const response = await fetch(`${API_URL}/api/collections/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("No se pudo cargar la temporada");
  }

  return (await response.json()) as Collection;
}

export async function fetchCollections() {
  const response = await fetch(`${API_URL}/api/collections`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("No se pudieron cargar temporadas");
  }

  return (await response.json()) as CollectionSummary[];
}
