"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/utils/analytics";

type ProductVisitTrackerProps = {
  productId: string;
  productName: string;
};

export function ProductVisitTracker({
  productId,
  productName,
}: ProductVisitTrackerProps) {
  useEffect(() => {
    trackEvent("produk_dikunjungi", {
      productId,
      productName,
    });
  }, [productId, productName]);

  return null;
}
