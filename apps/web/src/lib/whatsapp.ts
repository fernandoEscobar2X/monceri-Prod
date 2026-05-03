export function buildWhatsAppHref(message: string, phoneNumber?: string) {
  const encodedMessage = encodeURIComponent(message);
  const sanitizedPhone = phoneNumber?.replace(/\D/g, "") ?? "";

  if (!sanitizedPhone) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`;
}
