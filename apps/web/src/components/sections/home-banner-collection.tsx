"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Collection } from "@monceri/shared";
import { collectionImageUrl } from "@/lib/collections";

type HomeBannerCollectionProps = {
  collection: Collection | null;
};

export function HomeBannerCollection({ collection }: HomeBannerCollectionProps) {
  if (!collection) {
    return null;
  }

  const image = collectionImageUrl(collection.bannerImageUrl);

  return (
    <section className="bg-[#FAFAFA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto aspect-[16/8] max-w-[1440px] overflow-hidden border-2 border-[#111827] bg-[#111827] shadow-[8px_8px_0_#111827] sm:aspect-[16/6]">
        <Image
          alt={collection.name}
          className="object-cover opacity-70"
          fill
          sizes="100vw"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/88 via-[#111827]/42 to-transparent" />
        <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center px-5 py-8 text-white sm:px-8 lg:px-12">
          {collection.tagline ? (
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#E63946] sm:text-sm">
              {collection.tagline}
            </p>
          ) : null}
          <h2 className="font-display mt-3 text-4xl font-black leading-none tracking-tight sm:text-5xl lg:text-6xl">
            {collection.name}
          </h2>
          {collection.description ? (
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/82 sm:text-base">
              {collection.description}
            </p>
          ) : null}
          <Link
            className="mt-6 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-[#E63946] px-5 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5"
            href={`/temporada/${collection.slug}`}
          >
            {collection.ctaLabel ?? "Ver coleccion"}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
