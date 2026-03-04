"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/public/product-grid";
import {
  PRODUCT_CATEGORIES,
  getProductCategoryLabel,
} from "@/lib/product-categories";
import type { Product } from "@/lib/types";

type ProductCatalogProps = {
  products: Product[];
};

const INITIAL_VISIBLE_COUNT = 6;

export function ProductCatalog({ products }: ProductCatalogProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "available" | "sold">("all");
  const [category, setCategory] = useState<
    "all" | (typeof PRODUCT_CATEGORIES)[number]
  >("all");
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const minPrice = Number(minPriceInput || "0");
    const maxPrice = Number(maxPriceInput || "0");
    const hasMin = minPriceInput !== "" && !Number.isNaN(minPrice);
    const hasMax = maxPriceInput !== "" && !Number.isNaN(maxPrice);

    return products.filter((product) => {
      if (status !== "all" && product.status !== status) {
        return false;
      }

      if (category !== "all" && product.category !== category) {
        return false;
      }

      if (normalizedQuery) {
        const searchable =
          `${product.name} ${product.code} ${product.description}`.toLowerCase();
        if (!searchable.includes(normalizedQuery)) {
          return false;
        }
      }

      if (hasMin || hasMax) {
        if (product.price === null) {
          return false;
        }

        if (hasMin && product.price < minPrice) {
          return false;
        }

        if (hasMax && product.price > maxPrice) {
          return false;
        }
      }

      return true;
    });
  }, [category, maxPriceInput, minPriceInput, products, query, status]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredProducts.length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_170px_170px_170px]">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          placeholder="Cari nama, kode, atau deskripsi..."
          className="field-ui"
        />

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "all" | "available" | "sold");
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          className="field-ui"
        >
          <option value="all">Semua Status</option>
          <option value="available">Tersedia</option>
          <option value="sold">Terjual</option>
        </select>

        <select
          value={category}
          onChange={(event) => {
            setCategory(
              event.target.value as "all" | (typeof PRODUCT_CATEGORIES)[number],
            );
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          className="field-ui"
        >
          <option value="all">Semua Kategori</option>
          {PRODUCT_CATEGORIES.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {getProductCategoryLabel(categoryOption)}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          value={minPriceInput}
          onChange={(event) => {
            setMinPriceInput(event.target.value);
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          placeholder="Harga Min"
          className="field-ui"
        />

        <input
          type="number"
          min={0}
          value={maxPriceInput}
          onChange={(event) => {
            setMaxPriceInput(event.target.value);
            setVisibleCount(INITIAL_VISIBLE_COUNT);
          }}
          placeholder="Harga Max"
          className="field-ui"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#6d5443]">
          Menampilkan {visibleProducts.length} dari {filteredProducts.length}{" "}
          hasil
        </p>
        {(query ||
          status !== "all" ||
          category !== "all" ||
          minPriceInput ||
          maxPriceInput) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setCategory("all");
              setMinPriceInput("");
              setMaxPriceInput("");
              setVisibleCount(INITIAL_VISIBLE_COUNT);
            }}
            className="btn-ui btn-neutral text-xs"
          >
            Reset Filter
          </button>
        )}
      </div>

      <ProductGrid products={visibleProducts} />

      {canLoadMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((value) => value + INITIAL_VISIBLE_COUNT)
            }
            className="btn-ui btn-dark"
          >
            Lihat lainnya
          </button>
        </div>
      ) : null}
    </div>
  );
}
