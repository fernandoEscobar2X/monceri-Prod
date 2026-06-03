import type { CSSProperties } from "react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

type HeroSectionProps = {
  heroInstallationStyle: CSSProperties;
};

export function HeroSection({ heroInstallationStyle }: HeroSectionProps) {
  return (
    <section id="inicio" className="bg-white">
      <div className="grid lg:min-h-[620px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] xl:min-h-[680px]">
        <div className="px-4 py-10 sm:px-6 lg:py-16 lg:pl-[max(2rem,calc((100vw-1440px)/2+2rem))] lg:pr-10 xl:pr-14">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-[#E63946]">
              <Sparkles className="size-4" />
              Monceri corte laser shop
            </div>

            <h1 className="font-display mt-6 text-balance text-4xl font-black tracking-tight text-[#111827] sm:text-6xl xl:text-7xl">
              Fabricamos tus ideas en Neon, Acrilico y MDF.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Letreros personalizados, piezas en acrilico, corte laser y volumen para negocios,
              eventos y espacios que necesitan verse mejor desde el primer vistazo.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#configurador" className="hard-button w-full sm:w-auto">
                Cotiza tu letrero Neon
                <ArrowRight className="size-5" />
              </a>
              <a href="#catalogo" className="hard-button hard-button-light w-full sm:w-auto">
                Ver productos destacados
              </a>
            </div>

            <div className="mt-10 grid gap-6 border-t border-gray-200 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#111827]">
                  +5,000
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">Frases convertidas en letreros.</p>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#111827]">
                  4.9 / 5
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">Calificacion promedio en clientes.</p>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#111827]">
                  Hecho en MX
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">Produccion local y atencion directa.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden bg-[#0B0F14] sm:min-h-[430px] lg:min-h-full">
          <div className="absolute inset-0" style={heroInstallationStyle} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,12,0.48)_0%,rgba(6,8,12,0.14)_42%,rgba(6,8,12,0.4)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0)_34%,rgba(0,0,0,0.34)_100%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-8 lg:p-10 xl:p-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white backdrop-blur-sm">
              <ShieldCheck className="size-4 text-[#E63946]" />
              Instalacion real Monceri
            </div>

            <div className="max-w-[340px] text-left sm:max-w-md">
              <div className="border border-white/12 bg-black/38 p-4 backdrop-blur-[2px] sm:p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                  Resultado comercial real
                </p>
                <p className="mt-3 text-xl font-semibold leading-tight text-white sm:text-2xl">
                  Letreros y piezas que ya viven en negocios, eventos y espacios fotografiables.
                </p>
                <p className="mt-3 text-sm leading-6 text-white/74">
                  La idea no es prometer un mockup bonito, sino mostrar el tipo de presencia visual
                  que Monceri ya entrega en instalaciones reales.
                </p>
              </div>
            </div>

            <div
              className="no-scrollbar -mb-1 flex gap-3 overflow-x-auto pb-1 pr-4 snap-x snap-mandatory sm:mb-0 sm:grid sm:max-w-xl sm:grid-cols-3 sm:overflow-visible sm:pb-0 sm:pr-0"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {[
                "Negocios y locales",
                "Eventos especiales",
                "Decoracion interior",
              ].map((item) => (
                <div
                  key={item}
                  className="min-w-[190px] snap-start border border-white/12 bg-black/24 px-4 py-4 text-left text-sm font-medium text-white backdrop-blur-[2px] sm:min-w-0"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
