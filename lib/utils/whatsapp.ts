import type { Product } from "@/lib/types";

function normalizeWhatsAppNumber(rawNumber: string) {
  const digits = rawNumber.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("62")) {
    return digits;
  }

  return digits;
}

function getProductUrl(slug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${siteUrl}/produk/${slug}`;
}

export function createWhatsAppAvailabilityMessage(product: Product) {
  const message = `Apakah barang ini masih tersedia?\n\nNama: ${product.name}\nKode: ${product.code}\nLink: ${getProductUrl(product.slug)}`;
  return encodeURIComponent(message);
}

export function createWhatsAppPriceRequestMessage(product: Product) {
  const message = `Saya ingin mengetahui harga untuk produk berikut:\n\nNama: ${product.name}\nKode: ${product.code}\nLink: ${getProductUrl(product.slug)}`;
  return encodeURIComponent(message);
}

export function createWhatsAppNegotiationMessage(
  product: Product,
  negotiatedPrice: string,
) {
  const originalPrice =
    product.price !== null
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(product.price)
      : "belum ditentukan";

  const message = `Saya mau nego ${product.name} dengan kode ${product.code} seharga ${negotiatedPrice} dari harga asli ${originalPrice}`;
  return encodeURIComponent(message);
}

export function createWhatsAppLink(encodedMessage: string) {
  const targetNumber = normalizeWhatsAppNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  );

  if (!targetNumber) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${targetNumber}?text=${encodedMessage}`;
}
