import type { ConfiguratorAddon, ConfiguratorInput, ConfiguratorPriceBreakdown } from "@monceri/shared";

export type ConfiguratorCartPayload = ConfiguratorInput & {
  price: ConfiguratorPriceBreakdown;
  addonLabels: Record<ConfiguratorAddon, string>;
};

export type FontOption = {
  id: string;
  label: string;
  previewFamily: string;
  previewClassName: string;
  fitBias: number;
};

export type SizeOption = {
  id: string;
  label: string;
  width: string;
  widthCm: number;
  height: string;
  maxLettersPerLine: number;
  maxLines: number;
  basePrice: number;
  perCharacterPrice: number;
  previewMaxWidth: string;
  singleLineClassName: string;
  multiLineClassName: string;
};

export type EnvironmentOption = {
  id: string;
  label: string;
  helper: string;
  style: {
    backgroundImage: string;
    backgroundPosition: string;
    backgroundRepeat: string;
    backgroundSize: string;
  };
};

export type NeonColor = {
  id: string;
  label: string;
  hex: string;
  swatchBackground: string;
  isMulticolor?: boolean;
};

export type PreviewWord = {
  colorId: string;
  label: string;
};

export type PriceBreakdownItem = {
  label: string;
  value: number;
};
