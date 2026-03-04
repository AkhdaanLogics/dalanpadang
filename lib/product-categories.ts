export const PRODUCT_CATEGORIES = [
  "koleksi-reguler",
  "koleksi-langka",
  "koleksi-premium",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = "koleksi-premium";

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

const PRODUCT_CATEGORY_LABEL_MAP: Record<ProductCategory, string> = {
  "koleksi-reguler": "Koleksi Reguler",
  "koleksi-langka": "Koleksi Langka",
  "koleksi-premium": "Koleksi Premium",
};

const LEGACY_CATEGORY_MAP: Record<string, ProductCategory> = {
  harian: "koleksi-reguler",
  pusaka: "koleksi-premium",
  langka: "koleksi-langka",
};

export function normalizeProductCategory(category: string | null | undefined) {
  if (!category) {
    return DEFAULT_PRODUCT_CATEGORY;
  }

  if (isProductCategory(category)) {
    return category;
  }

  return LEGACY_CATEGORY_MAP[category] ?? DEFAULT_PRODUCT_CATEGORY;
}

export function getProductCategoryLabel(category: string | null | undefined) {
  return PRODUCT_CATEGORY_LABEL_MAP[normalizeProductCategory(category)];
}
