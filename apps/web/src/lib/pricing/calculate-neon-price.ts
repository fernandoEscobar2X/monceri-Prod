import type { ConfiguratorAddon, ConfiguratorPriceBreakdown, ConfiguratorSize } from "@monceri/shared";

function countLetters(value: string) {
  return value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, "").length;
}

function roundToNearestTen(value: number) {
  return Math.round(value / 10) * 10;
}

export function calculateNeonPrice(args: {
  addons: ConfiguratorAddon[];
  phrase: string;
  size: ConfiguratorSize;
}): ConfiguratorPriceBreakdown {
  const letterCount = countLetters(args.phrase);
  const base = args.size.basePrice;
  const lettering = letterCount * args.size.perCharacterPrice;
  const signSubtotal = base + lettering;
  const dimmer = args.addons.includes("dimmer") ? 210 : 0;
  const waterproof = args.addons.includes("waterproof")
    ? Math.max(490, roundToNearestTen(signSubtotal * 0.18))
    : 0;
  const nfc = args.addons.includes("nfc") ? 499 : 0;

  return {
    base,
    lettering,
    dimmer,
    waterproof,
    nfc,
    total: base + lettering + dimmer + waterproof + nfc,
  };
}
