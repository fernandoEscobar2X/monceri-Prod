import type { Rule } from "antd/es/form";

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const couponCodePattern = /^[A-Z0-9]+$/;

export const productRules = {
  name: [
    { required: true, message: "El nombre es obligatorio." },
    { min: 2, message: "El nombre debe tener al menos 2 caracteres." },
    { max: 120, message: "El nombre no debe pasar de 120 caracteres." },
  ] satisfies Rule[],
  slug: [
    { required: true, message: "El slug es obligatorio." },
    { min: 2, message: "El slug debe tener al menos 2 caracteres." },
    {
      pattern: slugPattern,
      message: "El slug solo permite letras minusculas, numeros y guiones.",
    },
  ] satisfies Rule[],
  description: [{ max: 2000, message: "La descripcion no debe pasar de 2000 caracteres." }] satisfies Rule[],
  basePrice: [
    { required: true, message: "El precio base es obligatorio." },
    { type: "number", min: 1, message: "El precio base debe ser mayor a 0." },
    { type: "number", max: 99999, message: "El precio base no puede pasar de $99,999." },
  ] satisfies Rule[],
  categoryId: [{ required: true, message: "Selecciona una categoria." }] satisfies Rule[],
  metaTitle: [{ max: 70, message: "El meta title no debe pasar de 70 caracteres." }] satisfies Rule[],
  metaDescription: [
    { max: 160, message: "La meta descripcion no debe pasar de 160 caracteres." },
  ] satisfies Rule[],
  variantName: [{ required: true, message: "El nombre de la variante es obligatorio." }] satisfies Rule[],
  variantValue: [{ required: true, message: "El valor de la variante es obligatorio." }] satisfies Rule[],
};

export const categoryRules = {
  name: [
    { required: true, message: "El nombre es obligatorio." },
    { min: 2, message: "El nombre debe tener al menos 2 caracteres." },
    { max: 60, message: "El nombre no debe pasar de 60 caracteres." },
  ] satisfies Rule[],
  slug: [
    { required: true, message: "El slug es obligatorio." },
    {
      pattern: slugPattern,
      message: "El slug solo permite letras minusculas, numeros y guiones.",
    },
  ] satisfies Rule[],
  sortOrder: [{ type: "integer", message: "El orden debe ser un numero entero." }] satisfies Rule[],
};

export const collectionRules = {
  ctaLabel: [{ max: 30, message: "El CTA no debe pasar de 30 caracteres." }] satisfies Rule[],
  description: [
    { max: 1000, message: "La descripcion no debe pasar de 1000 caracteres." },
  ] satisfies Rule[],
  name: [
    { required: true, message: "El nombre es obligatorio." },
    { min: 2, message: "El nombre debe tener al menos 2 caracteres." },
    { max: 80, message: "El nombre no debe pasar de 80 caracteres." },
  ] satisfies Rule[],
  slug: [
    { required: true, message: "El slug es obligatorio." },
    { min: 2, message: "El slug debe tener al menos 2 caracteres." },
    {
      pattern: slugPattern,
      message: "El slug solo permite letras minusculas, numeros y guiones.",
    },
  ] satisfies Rule[],
  tagline: [{ max: 120, message: "El texto corto no debe pasar de 120 caracteres." }] satisfies Rule[],
};

export const couponRules = {
  code: [
    { required: true, message: "El codigo es obligatorio." },
    { min: 3, message: "El codigo debe tener al menos 3 caracteres." },
    { max: 30, message: "El codigo no debe pasar de 30 caracteres." },
    { pattern: couponCodePattern, message: "Usa solo letras mayusculas y numeros." },
  ] satisfies Rule[],
  type: [{ required: true, message: "Selecciona el tipo de cupon." }] satisfies Rule[],
  value: [
    { required: true, message: "El valor es obligatorio." },
    { type: "number", min: 1, message: "El valor debe ser mayor a 0." },
  ] satisfies Rule[],
  maxUses: [{ type: "integer", min: 1, message: "Los usos deben ser un entero positivo." }] satisfies Rule[],
};

export const inventoryRules = {
  quantity: [
    { required: true, message: "La cantidad es obligatoria." },
    {
      validator: async (_rule: Rule, value?: number) => {
        if (!Number.isInteger(value)) {
          throw new Error("La cantidad debe ser un numero entero.");
        }

        if (value === 0) {
          throw new Error("La cantidad debe ser distinta de 0.");
        }
      },
    },
  ] satisfies Rule[],
  reason: [
    { required: true, message: "La razon es obligatoria." },
    { min: 3, message: "La razon debe tener al menos 3 caracteres." },
    { max: 200, message: "La razon no debe pasar de 200 caracteres." },
  ] satisfies Rule[],
};
