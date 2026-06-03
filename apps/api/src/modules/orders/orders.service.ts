import type { ConfiguratorInput, CreateOrderInput, OrderStatusUpdateInput } from "@monceri/shared";
import {
  CONFIGURATOR_PRODUCT_SLUG,
  calculateNeonPrice,
  countConfiguratorLetters,
  getConfiguratorSize,
} from "@monceri/shared";
import { ConflictError, NotFoundError, ValidationError } from "../../lib/errors";
import { couponsService } from "../coupons/coupons.service";
import { productsService } from "../products/products.service";
import { ordersRepository } from "./orders.repository";

type PricedOrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  subtotal: number;
  unitPrice: number;
  variantData: Record<string, string>;
};

function formatCurrency(value: number) {
  return value.toLocaleString("es-MX", {
    currency: "MXN",
    maximumFractionDigits: 0,
    style: "currency",
  });
}

function validateConfigurator(configuration: ConfiguratorInput) {
  const size = getConfiguratorSize(configuration.sizeId);

  if (!size) {
    throw new ValidationError("Tamano de configurador invalido");
  }

  const phraseLines = configuration.phrase
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const letterCount = countConfiguratorLetters(phraseLines.join(""));
  const firstOverflowLineIndex = phraseLines.findIndex(
    (line) => countConfiguratorLetters(line) > size.maxLettersPerLine,
  );

  if (phraseLines.length === 0 || letterCount < 3) {
    throw new ValidationError("El configurador requiere minimo 3 caracteres");
  }

  if (phraseLines.length > size.maxLines) {
    throw new ValidationError(`Esta medida admite hasta ${size.maxLines} renglones`);
  }

  if (letterCount > size.maxLettersPerLine) {
    throw new ValidationError(
      `El texto excede el limite de letras del tamano seleccionado (${letterCount}/${size.maxLettersPerLine})`,
    );
  }

  if (firstOverflowLineIndex >= 0) {
    throw new ValidationError(
      `El renglon ${firstOverflowLineIndex + 1} supera el maximo para esta medida`,
    );
  }

  if (configuration.addons.includes("dimmer") && size.widthCm > 70) {
    throw new ValidationError("El dimmer solo esta disponible en letreros de 70 cm o menos");
  }

  return { letterCount, phraseLines, size };
}

function buildWhatsappMessage(args: {
  couponCode?: string;
  discount: number;
  input: CreateOrderInput;
  items: PricedOrderItem[];
  orderNumber: string;
  subtotal: number;
  total: number;
}) {
  const itemLines = args.items.flatMap((item, index) => [
    `${index + 1}. ${item.productName}`,
    ...Object.entries(item.variantData).map(([label, value]) => `   - ${label}: ${value}`),
    `   - Cantidad: ${item.quantity}`,
    `   - ${formatCurrency(item.subtotal)}`,
  ]);
  const lines = [
    `Nuevo pedido Monceri #${args.orderNumber}`,
    "",
    `Cliente: ${args.input.customerName}`,
    `Telefono: ${args.input.customerPhone}`,
    args.input.customerEmail ? `Email: ${args.input.customerEmail}` : null,
    "",
    "Productos:",
    ...itemLines,
    "",
    `Subtotal: ${formatCurrency(args.subtotal)}`,
    args.couponCode ? `Descuento (${args.couponCode}): -${formatCurrency(args.discount)}` : null,
    `Total: ${formatCurrency(args.total)}`,
    "",
    `Este pedido ya fue registrado en el sistema con folio ${args.orderNumber}.`,
  ].filter(Boolean);

  return lines.join("\n");
}

export const ordersService = {
  listAdmin() {
    return ordersRepository.listAdmin();
  },

  async findByOrderNumber(orderNumber: string) {
    const order = await ordersRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new NotFoundError("Orden");
    }

    return order;
  },

  async create(input: CreateOrderInput) {
    const pricedItems: PricedOrderItem[] = [];

    for (const item of input.items) {
      if (item.type === "CONFIGURATOR") {
        const product = await productsService.findActiveBySlugForOrder(CONFIGURATOR_PRODUCT_SLUG);
        const { phraseLines, size } = validateConfigurator(item.configuration);

        if (product.trackStock && product.stock < item.quantity) {
          throw new ConflictError(`Stock insuficiente para ${product.name}`);
        }

        const price = calculateNeonPrice({
          addons: item.configuration.addons,
          phrase: item.configuration.phrase,
          size,
        });
        const colorSummary = item.configuration.colorIds.join(", ");
        const extrasSummary =
          item.configuration.addons.length > 0 ? item.configuration.addons.join(", ") : "Sin extras";

        pricedItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          subtotal: price.total * item.quantity,
          unitPrice: price.total,
          variantData: {
            Texto: phraseLines.join(" / "),
            Tamano: size.label,
            Fuente: item.configuration.fontId,
            Colores: colorSummary,
            Extras: extrasSummary,
          },
        });
        continue;
      }

      const product = await productsService.findActiveForOrder(item.productId);

      if (product.trackStock && product.stock < item.quantity) {
        throw new ConflictError(`Stock insuficiente para ${product.name}`);
      }

      const selectedVariantPairs = Object.entries(item.variants);
      const variantAdjust = product.variants
        .filter((variant) =>
          variant.active &&
          selectedVariantPairs.some(
            ([name, value]) => variant.name === name && variant.value === value,
          ),
        )
        .reduce((sum, variant) => sum + Number(variant.priceAdjust), 0);
      const unitPrice = Number(product.basePrice) + variantAdjust;

      pricedItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        subtotal: unitPrice * item.quantity,
        unitPrice,
        variantData: item.variants,
      });
    }

    const subtotal = pricedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const couponCode = input.couponCode?.trim().toUpperCase();
    const couponResult = couponCode ? await couponsService.ensureValid(couponCode, subtotal) : null;
    const discount = couponResult?.discount ?? 0;
    const total = subtotal - discount;
    const order = await ordersRepository.createPending({
      couponId: couponResult?.coupon.id,
      discount,
      input,
      items: pricedItems,
      subtotal,
      total,
    });
    const orderNumber = order.orderNumber;

    return {
      order,
      orderNumber,
      total,
      whatsappMessage: buildWhatsappMessage({
        couponCode,
        discount,
        input,
        items: pricedItems,
        orderNumber,
        subtotal,
        total,
      }),
    };
  },

  async markWhatsappSent(orderNumber: string) {
    const order = await ordersRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new NotFoundError("Orden");
    }

    return ordersRepository.markWhatsappSent(orderNumber);
  },

  async updateStatus(orderNumber: string, input: OrderStatusUpdateInput, adminId: string) {
    const order = await ordersRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new NotFoundError("Orden");
    }

    if (order.status === "CANCELLED" && input.status !== "CANCELLED") {
      throw new ValidationError("No se puede reactivar una orden cancelada en v1");
    }

    if (input.status === "CONFIRMED" && order.status !== "PENDING" && order.status !== "CONFIRMED") {
      throw new ValidationError("Solo las ordenes pendientes pueden confirmarse en v1");
    }

    if (input.status === "CONFIRMED" && order.status === "PENDING") {
      for (const item of order.items) {
        if (item.product.trackStock && item.product.stock < item.quantity) {
          throw new ConflictError(`Stock insuficiente para ${item.product.name}`);
        }
      }

      const confirmedOrder = await ordersRepository.confirmAndDecrementStock(orderNumber, input, adminId);

      if (!confirmedOrder) {
        throw new NotFoundError("Orden");
      }

      return confirmedOrder;
    }

    return ordersRepository.updateStatus(orderNumber, input);
  },
};
