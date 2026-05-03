import { Check, Ruler, ShoppingBag, Type } from "lucide-react";
import { ConfiguratorSummary } from "./configurator-summary";
import type { FontOption, NeonColor, PriceBreakdownItem, SizeOption } from "./configurator-types";

type ConfiguratorControlsProps = {
  activeColorId: string;
  activeWordLabel: string;
  addOnCount: number;
  addToCartLabel: string;
  calculatedPrice: number;
  currentLineCount: number;
  dimmerAvailable: boolean;
  editableWordTokens: string[];
  effectiveDimmerEnabled: boolean;
  fontOptions: FontOption[];
  hasValidationError: boolean;
  isConfigurationValid: boolean;
  letterCount: number;
  neonColors: NeonColor[];
  nfcEnabled: boolean;
  onAddToCart: () => void;
  onNfcChange: (enabled: boolean) => void;
  onPhraseChange: (value: string) => void;
  onSelectActiveWord: (index: number) => void;
  onSelectFont: (font: FontOption) => void;
  onSelectSize: (size: SizeOption) => void;
  onUpdateActiveWordColor: (colorId: string) => void;
  onWaterproofChange: (enabled: boolean) => void;
  onDimmerChange: (enabled: boolean) => void;
  phrase: string;
  priceBreakdown: PriceBreakdownItem[];
  priceDelta: number;
  resolvedWordColorIds: string[];
  safeActiveWordIndex: number;
  selectedAddOnLabels: string[];
  selectedFont: FontOption;
  selectedSize: SizeOption;
  sizeOptions: SizeOption[];
  validationMessage: string;
  waterproofEnabled: boolean;
};

function findColor(colors: NeonColor[], colorId: string) {
  return colors.find((color) => color.id === colorId) ?? colors[0];
}

export function ConfiguratorControls({
  activeColorId,
  activeWordLabel,
  addOnCount,
  addToCartLabel,
  calculatedPrice,
  currentLineCount,
  dimmerAvailable,
  editableWordTokens,
  effectiveDimmerEnabled,
  fontOptions,
  hasValidationError,
  isConfigurationValid,
  letterCount,
  neonColors,
  nfcEnabled,
  onAddToCart,
  onDimmerChange,
  onNfcChange,
  onPhraseChange,
  onSelectActiveWord,
  onSelectFont,
  onSelectSize,
  onUpdateActiveWordColor,
  onWaterproofChange,
  phrase,
  priceBreakdown,
  priceDelta,
  resolvedWordColorIds,
  safeActiveWordIndex,
  selectedAddOnLabels,
  selectedFont,
  selectedSize,
  sizeOptions,
  validationMessage,
  waterproofEnabled,
}: ConfiguratorControlsProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto flex h-full w-full max-w-[640px] flex-col px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#E63946]">
          Configurador principal
        </p>
        <h2 className="font-display mt-4 text-4xl font-black tracking-tight text-[#111827] sm:text-5xl">
          Crea tu Letrero Neon con los siguientes pasos
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
          Escribe tu texto, define medida, tipografia, color y extras. El precio se actualiza
          automaticamente mientras configuras.
        </p>

        <div className="mt-10 space-y-6 text-left">
          <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <label
                  htmlFor="phrase"
                  className="block text-sm font-bold uppercase tracking-[0.2em] text-gray-500"
                >
                  Escribe tu texto
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  {currentLineCount}/3 Renglones, {selectedSize.maxLettersPerLine} Letras maximas por renglon
                </p>
              </div>

              <div className="rounded-full bg-[#111827] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                {letterCount} caracteres
              </div>
            </div>

            <textarea
              id="phrase"
              value={phrase}
              onChange={(event) => onPhraseChange(event.target.value)}
              rows={3}
              className="mt-4 w-full rounded-[24px] border border-gray-200 bg-white px-4 py-4 text-2xl font-black tracking-tight text-[#111827] outline-none transition focus:border-[#E63946] sm:px-5 sm:text-3xl"
              placeholder="Monceri"
            />

            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                hasValidationError
                  ? "border-[#E63946]/20 bg-[#FFF1F3] text-[#B42318]"
                  : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              {validationMessage}
            </div>
          </div>

          <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                  Elige el tamano de tu letrero
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Las medidas mostradas pueden variar de 2 a 4 centimetros.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                <Ruler className="size-4" />
                Medida estimada
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {sizeOptions.map((size) => {
                const isActive = selectedSize.id === size.id;

                return (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => onSelectSize(size)}
                    className={`rounded-[24px] border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-[#E63946] bg-white shadow-[0_18px_40px_rgba(230,57,70,0.08)]"
                        : "border-gray-200 bg-white hover:border-[#E63946]/25"
                    }`}
                  >
                    <div className="text-xl font-black tracking-tight text-[#111827]">{size.label}</div>
                    <div className="mt-2 text-sm leading-6 text-gray-500">
                      Maximo {size.maxLettersPerLine} letras y {size.maxLines} renglones
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                  Selecciona una tipografia
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  El grosor de la tira neon led es de 6mm.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                <Type className="size-4" />
                Vista real en el preview
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {fontOptions.map((font) => {
                const isActive = selectedFont.id === font.id;

                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => onSelectFont(font)}
                    className={`flex min-h-[112px] items-center overflow-hidden rounded-[22px] border bg-white p-4 text-left transition ${
                      isActive
                        ? "border-[#E63946] shadow-[0_16px_36px_rgba(230,57,70,0.08)]"
                        : "border-gray-200 hover:border-[#E63946]/25"
                    }`}
                  >
                    <div
                      className={`text-balance max-w-full overflow-hidden text-[clamp(1.65rem,2.35vw,2.55rem)] leading-[0.92] [overflow-wrap:anywhere] ${font.previewClassName}`}
                      style={{ fontFamily: font.previewFamily }}
                    >
                      {font.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                  Selecciona el color del neon
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Puedes personalizar el color neon de cada palabra. Da click en la palabra
                  para cambiarla.
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                  Palabra activa
                </div>
                <div className="mt-1 text-sm font-semibold text-[#E63946]">{activeWordLabel}</div>
              </div>
            </div>

            <div
              className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {editableWordTokens.map((word, index) => {
                const isActive = safeActiveWordIndex === index;
                const currentColor = findColor(neonColors, resolvedWordColorIds[index] ?? neonColors[0].id);

                return (
                  <button
                    key={`${word}-${index}`}
                    type="button"
                    onClick={() => onSelectActiveWord(index)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-[#E63946]/25"
                    }`}
                  >
                    <span>{word}</span>
                    <span
                      className="ml-2 inline-flex size-2.5 rounded-full align-middle"
                      style={{ background: currentColor.swatchBackground }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#111827]">
              {findColor(neonColors, activeColorId).label}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
              {neonColors.map((color) => {
                const isActive = activeColorId === color.id;

                return (
                  <button
                    key={color.id}
                    type="button"
                    aria-label={`Seleccionar ${color.label}`}
                    onClick={() => onUpdateActiveWordColor(color.id)}
                    className={`relative aspect-square rounded-2xl border transition ${
                      isActive
                        ? "border-[#E63946] shadow-[0_12px_30px_rgba(230,57,70,0.16)]"
                        : "border-gray-200 hover:border-[#E63946]/25"
                    }`}
                    style={{ background: color.swatchBackground }}
                  >
                    {isActive ? (
                      <span className="absolute inset-0 flex items-center justify-center text-[#111827]">
                        <Check className="size-5" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[30px] border border-gray-200 bg-[#FAFAFA] p-5 sm:p-6">
            <div className="space-y-5">
              <div className="rounded-[24px] border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="text-lg font-bold tracking-tight text-[#111827]">
                      Control remoto Dimmer (+$210)
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Personaliza los efectos de luz, encendido y apagado, y la intensidad de
                      luz. Disponible unicamente en letreros de 70 cm o menos.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#E63946]">Ejemplo</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!dimmerAvailable}
                    onClick={() => onDimmerChange(true)}
                    className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      effectiveDimmerEnabled
                        ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                        : "border-gray-200 bg-white text-[#111827]"
                    } ${!dimmerAvailable ? "cursor-not-allowed opacity-45" : "hover:border-[#E63946]/25"}`}
                  >
                    Si
                  </button>
                  <button
                    type="button"
                    onClick={() => onDimmerChange(false)}
                    className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      !effectiveDimmerEnabled
                        ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                        : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                    }`}
                  >
                    No
                  </button>
                </div>

                {!dimmerAvailable ? (
                  <p className="mt-3 text-sm text-[#B42318]">
                    Esta medida ya no permite dimmer. Cambia a 50cm o 70cm para activarlo.
                  </p>
                ) : null}
              </div>

              <div className="rounded-[24px] border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="text-lg font-bold tracking-tight text-[#111827]">
                      Waterproof - Letrero para exterior
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Agrega tecnologia Waterproof con certificacion IP65 para uso exterior y
                      ambientes humedos. El precio se estima segun el tamano elegido.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#E63946]">Ejemplo</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onWaterproofChange(true)}
                    className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      waterproofEnabled
                        ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                        : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                    }`}
                  >
                    Si
                  </button>
                  <button
                    type="button"
                    onClick={() => onWaterproofChange(false)}
                    className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      !waterproofEnabled
                        ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                        : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="rounded-[24px] border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <p className="text-lg font-bold tracking-tight text-[#111827]">
                      Tecnologia NFC (+$499)
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Tus clientes podran interactuar con su smartphone y abrir tus redes,
                      sitio web o cualquier link personalizado.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[#E63946]">Ejemplo</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onNfcChange(true)}
                    className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      nfcEnabled
                        ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                        : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                    }`}
                  >
                    Si
                  </button>
                  <button
                    type="button"
                    onClick={() => onNfcChange(false)}
                    className={`min-h-12 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                      !nfcEnabled
                        ? "border-[#E63946] bg-[#FFF1F3] text-[#111827]"
                        : "border-gray-200 bg-white text-[#111827] hover:border-[#E63946]/25"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ConfiguratorSummary
            addOnCount={addOnCount}
            calculatedPrice={calculatedPrice}
            hasValidationError={hasValidationError}
            letterCount={letterCount}
            priceBreakdown={priceBreakdown}
            priceDelta={priceDelta}
            selectedAddOnLabels={selectedAddOnLabels}
            selectedSizeBasePrice={selectedSize.basePrice}
            validationMessage={validationMessage}
          />

          <button
            type="button"
            onClick={onAddToCart}
            disabled={!isConfigurationValid}
            className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#E63946] px-4 text-base font-bold text-white shadow-[0_18px_34px_rgba(230,57,70,0.24)] transition hover:-translate-y-0.5 hover:bg-[#c81f2f] disabled:cursor-not-allowed disabled:bg-[#F29AA3] disabled:shadow-none sm:h-16 sm:px-6 sm:text-lg"
          >
            <ShoppingBag className="size-5" />
            {addToCartLabel}
          </button>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Color por palabra con vista instantanea",
              "Precio que reacciona en tiempo real",
              "Dimmer, waterproof y NFC integrados",
              "Checkout preparado para seguir creciendo",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[22px] border border-gray-200 bg-[#FAFAFA] px-4 py-4"
              >
                <div className="inline-flex size-8 items-center justify-center rounded-full bg-[#E63946]/10 text-[#E63946]">
                  <Check className="size-4" />
                </div>
                <p className="text-sm font-medium text-[#111827]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
