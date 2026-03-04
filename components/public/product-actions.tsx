"use client";

import { useMemo, useState } from "react";
import { useTransition } from "react";
import { trackEvent } from "@/lib/utils/analytics";
import type { Product } from "@/lib/types";
import {
  createWhatsAppLink,
  createWhatsAppNegotiationMessage,
} from "@/lib/utils/whatsapp";

type ProductActionsProps = {
  productId: string;
  productName: string;
  productCode: string;
  productLink: string;
  whatsappAvailabilityUrl: string;
  whatsappPriceUrl: string;
  showPrice: boolean;
  negotiable: boolean;
  originalPrice: number | null;
  productSlug: string;
};

export function ProductActions({
  productId,
  productName,
  productCode,
  productLink,
  whatsappAvailabilityUrl,
  whatsappPriceUrl,
  showPrice,
  negotiable,
  originalPrice,
  productSlug,
}: ProductActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [showNegoInput, setShowNegoInput] = useState(false);
  const [negoPrice, setNegoPrice] = useState("");

  const productForNegotiation = useMemo(
    () =>
      ({
        id: productId,
        name: productName,
        slug: productSlug,
        code: productCode,
        description: "",
        image_url: "",
        price: originalPrice,
        show_price: showPrice,
        negotiable,
        status: "available",
        created_at: "",
      }) satisfies Product,
    [
      productCode,
      productId,
      productName,
      productSlug,
      originalPrice,
      showPrice,
      negotiable,
    ],
  );

  const handleWhatsAppClick = () => {
    trackEvent("klik_whatsapp", { productId, productName });
  };

  const handleRequestPrice = () => {
    startTransition(async () => {
      trackEvent("klik_request_harga", { productId, productName });
      await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          name: "Pengunjung",
          phone: "",
          message: `Permintaan harga untuk ${productName} (${productCode}) - ${productLink}`,
        }),
      });

      window.location.href = whatsappPriceUrl;
    });
  };

  const handleSendNegotiation = () => {
    const sanitized = negoPrice.replace(/[^0-9]/g, "");
    if (!sanitized) {
      return;
    }

    const formattedNegotiation = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(sanitized));

    const encoded = createWhatsAppNegotiationMessage(
      productForNegotiation,
      formattedNegotiation,
    );

    trackEvent("kirim_nego", { productId, productName, hargaNego: sanitized });
    window.location.href = createWhatsAppLink(encoded);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappAvailabilityUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="btn-ui btn-dark"
        >
          Chat WhatsApp
        </a>

        {!showPrice ? (
          <button
            type="button"
            onClick={handleRequestPrice}
            disabled={isPending}
            className="btn-ui btn-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Memproses..." : "Request Harga"}
          </button>
        ) : null}

        {negotiable ? (
          <button
            type="button"
            onClick={() => setShowNegoInput((value) => !value)}
            className="btn-ui btn-dark"
          >
            Nego Harga
          </button>
        ) : null}
      </div>

      {negotiable && showNegoInput ? (
        <div className="glass-panel decorative-border museum-frame rounded-xl p-3">
          <label
            htmlFor="harga-nego"
            className="font-accent mb-1 block text-sm font-medium tracking-wide text-[#2a221c]"
          >
            Masukkan Harga Nego
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              id="harga-nego"
              type="number"
              min={1}
              value={negoPrice}
              onChange={(event) => setNegoPrice(event.target.value)}
              placeholder="Contoh: 15000000"
              className="field-ui min-w-55 flex-1 text-sm"
            />
            <button
              type="button"
              onClick={handleSendNegotiation}
              className="btn-ui btn-dark"
            >
              Kirim
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
