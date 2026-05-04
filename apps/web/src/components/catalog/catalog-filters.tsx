"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@monceri/shared";

export function CatalogFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const setParam = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    next.set("page", "1");
    router.push(`/catalogo?${next.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setParam("search", search), 350);
    return () => window.clearTimeout(timeout);
  }, [search, setParam]);

  const panel = (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Busqueda</p>
        <input
          className="mt-3 h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-[#111827] outline-none transition focus:border-[#E63946]"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Neon, cafe, evento..."
          value={search}
        />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Categoria</p>
        <div className="mt-3 grid gap-2">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 text-sm font-medium text-[#111827]">
              <input
                checked={searchParams.get("category") === category.slug}
                className="accent-[#E63946]"
                onChange={(event) => setParam("category", event.target.checked ? category.slug : "")}
                type="checkbox"
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Precio</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            className="h-11 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#E63946]"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onBlur={(event) => setParam("minPrice", event.target.value)}
            placeholder="Min"
            type="number"
          />
          <input
            className="h-11 rounded-2xl border border-gray-200 px-4 text-sm outline-none focus:border-[#E63946]"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onBlur={(event) => setParam("maxPrice", event.target.value)}
            placeholder="Max"
            type="number"
          />
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">Orden</p>
        <select
          className="mt-3 h-11 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-[#E63946]"
          defaultValue={searchParams.get("sort") ?? "featured"}
          onChange={(event) => setParam("sort", event.target.value)}
        >
          <option value="featured">Destacados</option>
          <option value="newest">Mas nuevos</option>
          <option value="price_asc">Precio menor</option>
          <option value="price_desc">Precio mayor</option>
        </select>
      </div>
      <button
        className="text-sm font-semibold uppercase tracking-wide text-[#E63946]"
        onClick={() => router.push("/catalogo")}
        type="button"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <>
      <button
        className="mb-5 inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111827] lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <SlidersHorizontal className="size-4" />
        Filtros
      </button>
      <aside className="hidden w-[280px] shrink-0 border border-gray-200 bg-white p-5 lg:block">{panel}</aside>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} type="button" />
          <aside className="absolute left-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#E63946]">Filtros</p>
              <button onClick={() => setOpen(false)} type="button">
                <X className="size-5" />
              </button>
            </div>
            {panel}
          </aside>
        </div>
      ) : null}
    </>
  );
}
