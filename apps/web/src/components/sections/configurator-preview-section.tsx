import type { CSSProperties } from "react";

type ConfiguratorPreviewSectionProps = {
  promoBannerStyle: CSSProperties;
};

export function ConfiguratorPreviewSection({ promoBannerStyle }: ConfiguratorPreviewSectionProps) {
  return (
    <section style={promoBannerStyle} className="border-b border-white/10 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-3xl text-left">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/75">
            Frase Neon personalizable
          </p>
          <h2 className="font-display mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Disena tu frase, visualizala y llevala directo al carrito.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/78">
            Un flujo pensado para convertir visitas en pedidos reales, con visualizacion en ambiente
            y precio estimado en tiempo real.
          </p>
        </div>

        <div
          className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {[
            { title: "Garantia", subtitle: "Fabricacion cubierta" },
            { title: "Instalacion", subtitle: "Guiada y sencilla" },
            { title: "Atencion", subtitle: "WhatsApp directo" },
          ].map((badge) => (
            <div
              key={badge.title}
              className="flex h-28 w-28 shrink-0 snap-start flex-col items-center justify-center rounded-full border border-white/18 bg-white/10 px-4 text-center backdrop-blur-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">{badge.title}</p>
              <p className="mt-1 text-xs leading-5 text-white/75">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
