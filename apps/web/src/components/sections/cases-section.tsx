import type { CSSProperties } from "react";
import { Check, Sparkles } from "lucide-react";

type CasesSectionProps = {
  anatomyDetailStyle: CSSProperties;
};

export function CasesSection({ anatomyDetailStyle }: CasesSectionProps) {
  return (
    <section className="border-b border-gray-200 bg-[#F4F5F7]">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-18">
        <div className="relative min-h-[380px] overflow-hidden bg-[#120d0a] sm:min-h-[520px] lg:min-h-[620px]">
          <div className="absolute inset-0" style={anatomyDetailStyle} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.02)_36%,rgba(0,0,0,0.3)_100%)]" />

          <div className="relative z-10 h-full px-4 py-5 sm:px-8 sm:py-10">
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 bg-black/56 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm sm:left-8 sm:top-8">
              <Sparkles className="size-3.5 text-[#E63946]" />
              Pieza real Monceri
            </div>

            <div className="absolute left-3 top-[5.5rem] hidden max-w-[190px] bg-black/64 px-4 py-3 text-sm text-white backdrop-blur-sm sm:block sm:left-[10%] sm:top-[22%]">
              <p className="font-semibold">Trazo continuo</p>
              <p className="mt-1 text-xs text-white/70">Lectura limpia y brillo uniforme en toda la forma.</p>
            </div>
            <div className="absolute left-[29%] top-[30%] hidden h-px w-[82px] bg-white/32 lg:block" />

            <div className="absolute right-3 top-[58%] hidden max-w-[200px] bg-black/64 px-4 py-3 text-sm text-white backdrop-blur-sm sm:block sm:right-[8%] sm:top-[44%]">
              <p className="font-semibold">Base lista para montar</p>
              <p className="mt-1 text-xs text-white/70">Pensada para instalar con presencia y estabilidad visual.</p>
            </div>
            <div className="absolute right-[26%] top-[49%] hidden h-px w-[74px] bg-white/32 lg:block" />

            <div className="absolute left-3 bottom-4 hidden max-w-[210px] bg-black/64 px-4 py-3 text-sm text-white backdrop-blur-sm sm:block sm:left-[12%] sm:bottom-[14%]">
              <p className="font-semibold">Montaje limpio</p>
              <p className="mt-1 text-xs text-white/70">La construccion debe verse premium incluso a corta distancia.</p>
            </div>
            <div className="absolute left-[26%] bottom-[23%] hidden h-px w-[96px] bg-white/32 lg:block" />
          </div>
        </div>

        <div className="text-left">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
            Anatomia de un letrero
          </p>
          <h2 className="font-display mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
            Materiales y acabados que sostienen la venta.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
            La pieza final no solo debe verse bien en foto. Debe sentirse solida, instalarse con
            facilidad y mantenerse impecable en uso real.
          </p>

          <div className="mt-10 space-y-5">
            {[
              {
                title: "Acrilico 6mm",
                text: "Mayor estabilidad visual y una base premium para logos o frases luminosas.",
              },
              {
                title: "Waterproof IP65",
                text: "Listo para proyectos que exigen resistencia y confianza en condiciones reales.",
              },
              {
                title: "Angulos y trazos limpios",
                text: "La lectura importa. Por eso se cuidan curvas, cortes y remates de cada linea.",
              },
              {
                title: "Instalacion guiada",
                text: "El proyecto llega con claridad visual para que el montaje no se vuelva un dolor de cabeza.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 border-b border-gray-200 pb-5"
              >
                <div className="mt-1 inline-flex size-10 items-center justify-center rounded-full bg-[#E63946]/10 text-[#E63946]">
                  <Check className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#111827]">{feature.title}</p>
                  <p className="mt-2 text-base leading-7 text-gray-600">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
