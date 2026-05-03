import type { ConfiguratorAddon, ConfiguratorColor, ConfiguratorFont, ConfiguratorSize } from "@monceri/shared";

export const configuratorFonts: ConfiguratorFont[] = [
  { id: "electric-1", label: "Script Monceri", family: '"Monceri Electric 1", cursive' },
  { id: "electric-6", label: "Firma Bold", family: '"Monceri Electric 6", cursive' },
  { id: "electric-9", label: "Block Comercial", family: '"Monceri Electric 9", sans-serif' },
];

export const configuratorSizes: ConfiguratorSize[] = [
  {
    id: "medium",
    label: "Mediano",
    widthCm: 70,
    heightCm: 32,
    basePrice: 1290,
    perCharacterPrice: 55,
    maxCharactersPerLine: 14,
    maxLines: 2,
  },
  {
    id: "large",
    label: "Grande",
    widthCm: 100,
    heightCm: 42,
    basePrice: 1890,
    perCharacterPrice: 68,
    maxCharactersPerLine: 18,
    maxLines: 2,
  },
  {
    id: "business",
    label: "Negocio",
    widthCm: 140,
    heightCm: 56,
    basePrice: 2990,
    perCharacterPrice: 86,
    maxCharactersPerLine: 22,
    maxLines: 3,
  },
];

export const configuratorColors: ConfiguratorColor[] = [
  { id: "red", label: "Rojo Monceri", hex: "#ff4d55" },
  { id: "white", label: "Blanco frio", hex: "#f5fbff" },
  { id: "warm-white", label: "Blanco calido", hex: "#fff2b0" },
  { id: "pink", label: "Rosa", hex: "#ff54ca" },
  { id: "cyan", label: "Cyan", hex: "#61dfff" },
];

export const addonLabels: Record<ConfiguratorAddon, string> = {
  dimmer: "Control remoto Dimmer",
  waterproof: "Waterproof exterior",
  nfc: "Tecnologia NFC",
};
