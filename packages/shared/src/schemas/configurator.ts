import { z } from "zod";

export const ConfiguratorAddonSchema = z.enum(["dimmer", "waterproof", "nfc"]);
export type ConfiguratorAddon = z.infer<typeof ConfiguratorAddonSchema>;

export const ConfiguratorFontSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  family: z.string().min(1),
});
export type ConfiguratorFont = z.infer<typeof ConfiguratorFontSchema>;

export const ConfiguratorSizeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  widthCm: z.number().int().positive(),
  heightCm: z.number().int().positive(),
  basePrice: z.number().int().min(0),
  perCharacterPrice: z.number().int().min(0),
  maxCharactersPerLine: z.number().int().positive(),
  maxLines: z.number().int().positive(),
});
export type ConfiguratorSize = z.infer<typeof ConfiguratorSizeSchema>;

export const ConfiguratorColorSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  hex: z.string().min(4),
});
export type ConfiguratorColor = z.infer<typeof ConfiguratorColorSchema>;

export const ConfiguratorInputSchema = z.object({
  phrase: z.string().min(1),
  fontId: z.string().min(1),
  sizeId: z.string().min(1),
  colorIds: z.array(z.string().min(1)).min(1),
  addons: z.array(ConfiguratorAddonSchema).default([]),
});
export type ConfiguratorInput = z.infer<typeof ConfiguratorInputSchema>;

export const ConfiguratorPriceBreakdownSchema = z.object({
  base: z.number().int().min(0),
  lettering: z.number().int().min(0),
  dimmer: z.number().int().min(0),
  waterproof: z.number().int().min(0),
  nfc: z.number().int().min(0),
  total: z.number().int().min(0),
});
export type ConfiguratorPriceBreakdown = z.infer<typeof ConfiguratorPriceBreakdownSchema>;
