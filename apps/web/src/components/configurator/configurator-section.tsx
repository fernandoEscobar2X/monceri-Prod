"use client";

import { useMemo, useState } from "react";
import type { ConfiguratorAddon } from "@monceri/shared";
import { calculateNeonPrice } from "@/lib/pricing/calculate-neon-price";
import {
  addonLabels,
  configuratorColors,
  configuratorFonts,
  configuratorSizes,
} from "@/lib/pricing/neon-pricing";
import { formatPrice } from "@/lib/pricing/format-price";

export function ConfiguratorSection() {
  const [phrase, setPhrase] = useState("Monceri");
  const [sizeId, setSizeId] = useState(configuratorSizes[0].id);
  const [fontId, setFontId] = useState(configuratorFonts[0].id);
  const [colorId, setColorId] = useState(configuratorColors[0].id);
  const [addons, setAddons] = useState<ConfiguratorAddon[]>([]);
  const size = configuratorSizes.find((item) => item.id === sizeId) ?? configuratorSizes[0];
  const font = configuratorFonts.find((item) => item.id === fontId) ?? configuratorFonts[0];
  const color = configuratorColors.find((item) => item.id === colorId) ?? configuratorColors[0];
  const price = useMemo(() => calculateNeonPrice({ addons, phrase, size }), [addons, phrase, size]);

  function toggleAddon(addon: ConfiguratorAddon) {
    setAddons((current) =>
      current.includes(addon) ? current.filter((item) => item !== addon) : [...current, addon],
    );
  }

  return (
    <section className="border-b border-gray-200 bg-white px-6 py-16" id="configurador-modular">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#E63946]">
            Configurador modular
          </p>
          <h2 className="font-display mt-3 text-4xl font-black tracking-tight text-[#111827]">
            Base limpia del configurador
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
            Este modulo ya separa pricing, opciones y estado. El pixel-match final se migrara desde el
            prototipo seccion por seccion sin mantener un componente gigante como nucleo permanente.
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-[#F9FAFB] p-6">
          <label className="text-sm font-bold text-[#111827]" htmlFor="phrase">
            Texto
          </label>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-gray-200 px-4"
            id="phrase"
            onChange={(event) => setPhrase(event.target.value)}
            value={phrase}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {configuratorSizes.map((item) => (
              <button
                className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                  item.id === size.id ? "border-[#E63946] bg-white text-[#E63946]" : "border-gray-200"
                }`}
                key={item.id}
                onClick={() => setSizeId(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {configuratorFonts.map((item) => (
              <button
                className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                  item.id === font.id ? "border-[#111827] bg-white" : "border-gray-200"
                }`}
                key={item.id}
                onClick={() => setFontId(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {configuratorColors.map((item) => (
              <button
                aria-label={item.label}
                className={`size-10 rounded-full border-4 ${item.id === color.id ? "border-[#111827]" : "border-white"}`}
                key={item.id}
                onClick={() => setColorId(item.id)}
                style={{ backgroundColor: item.hex }}
                type="button"
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(addonLabels) as ConfiguratorAddon[]).map((addon) => (
              <button
                className={`rounded-full border px-4 py-2 text-xs font-bold ${
                  addons.includes(addon) ? "border-[#E63946] bg-[#E63946] text-white" : "border-gray-200"
                }`}
                key={addon}
                onClick={() => toggleAddon(addon)}
                type="button"
              >
                {addonLabels[addon]}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[#111827] p-5 text-white">
            <p className="text-sm text-white/60">Precio calculado por modulo</p>
            <p className="mt-2 text-3xl font-black">{formatPrice(price.total)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
