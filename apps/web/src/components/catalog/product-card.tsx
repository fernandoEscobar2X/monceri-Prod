"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@monceri/shared";
import { formatPrice } from "@/lib/formatters/price";
import { productImageUrl } from "@/lib/products";

export function ProductCard({ product }: { product: ProductSummary }) {
  const image = productImageUrl(product.thumbnail ?? product.images[0]?.url);

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm"
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <Link
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E63946]"
        href={`/producto/${product.slug}`}
      >
        <div className="relative h-[280px] overflow-hidden bg-gray-100 sm:h-[360px]">
          <Image
            alt={product.name}
            className="object-cover transition duration-300 group-hover:scale-105"
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={image}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col px-5 py-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
          {product.categoryName ?? product.category?.name ?? "Monceri"}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#111827]">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="text-lg font-bold text-[#111827]">{formatPrice(product.basePrice)}</span>
          <Link
            href={`/producto/${product.slug}`}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold !text-white transition-colors hover:bg-black hover:!text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E63946]"
          >
            <span className="text-white">Ver detalle</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
