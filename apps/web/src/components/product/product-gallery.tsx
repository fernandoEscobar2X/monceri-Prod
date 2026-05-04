"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@monceri/shared";
import { productImageUrl } from "@/lib/products";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const safeImages = images.length > 0 ? images : [{ id: "fallback", productId: "fallback", url: "/monceri-hero-installation.jpg", sortOrder: 0 }];
  const [index, setIndex] = useState(0);
  const current = safeImages[index] ?? safeImages[0];

  function move(delta: number) {
    setIndex((currentIndex) => (currentIndex + delta + safeImages.length) % safeImages.length);
  }

  return (
    <div>
      <div className="group relative aspect-square overflow-hidden border border-gray-200 bg-white">
        <Image
          alt={current.alt ?? name}
          className="object-cover transition duration-500 group-hover:scale-105"
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          src={productImageUrl(current.url)}
        />
        {safeImages.length > 1 ? (
          <>
            <button
              className="absolute left-4 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm lg:flex"
              onClick={() => move(-1)}
              type="button"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              className="absolute right-4 top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111827] shadow-sm lg:flex"
              onClick={() => move(1)}
              type="button"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        ) : null}
      </div>
      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {safeImages.map((image, imageIndex) => (
          <button
            key={image.id}
            className={`relative h-20 w-20 shrink-0 overflow-hidden border ${
              imageIndex === index ? "border-[#111827]" : "border-gray-200"
            }`}
            onClick={() => setIndex(imageIndex)}
            type="button"
          >
            <Image alt={image.alt ?? name} className="object-cover" fill sizes="80px" src={productImageUrl(image.url)} />
          </button>
        ))}
      </div>
    </div>
  );
}
