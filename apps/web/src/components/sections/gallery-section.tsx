"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

type GalleryMarqueeItem = {
  image: string;
  title: string;
};

type GallerySectionProps = {
  isMobileLayout: boolean;
  marqueeCards: GalleryMarqueeItem[];
};

export function GallerySection({ isMobileLayout, marqueeCards }: GallerySectionProps) {
  return (
    <section className="overflow-hidden bg-black text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.4fr_0.6fr] lg:px-8 lg:py-18">
        <div className="text-left">
          <div className="flex items-center gap-1 text-[#FF8FA3]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={`proof-star-${index}`} className="size-5 fill-current" />
            ))}
          </div>
          <h2 className="font-display mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Mas de 5,000 frases convertidas en letreros de Neon.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-white/72">
            El sitio debe vender confianza, inspiracion visual y evidencia real de que el resultado
            final se ve increible en negocio, sala, evento o showroom.
          </p>
        </div>

        <div className="overflow-hidden">
          <motion.div
            className="flex w-max gap-4 px-4 pb-2 sm:gap-5 sm:px-0 sm:pb-0"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: isMobileLayout ? 34 : 28,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {marqueeCards.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="flex w-[240px] shrink-0 flex-col overflow-hidden border border-white/10 bg-white/5 sm:w-[280px]"
              >
                <div
                  className="h-[280px] bg-cover bg-center sm:h-[340px]"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="border-t border-white/10 px-4 py-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                    Cliente real
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.title}</p>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
