import { notFound } from "next/navigation";
import type { Product } from "@/lib/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function isMissingCategoryColumnError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("products.category") ||
    (normalized.includes("category") &&
      (normalized.includes("does not exist") ||
        normalized.includes("schema cache")))
  );
}

export async function getPublicProducts() {
  const supabase = createSupabaseAdminClient();

  const withCategory = await supabase
    .from("products")
    .select(
      "id,name,slug,code,description,image_url,price,show_price,negotiable,category,status,created_at",
    )
    .order("created_at", { ascending: false });

  if (!withCategory.error) {
    return (withCategory.data ?? []) as Product[];
  }

  if (!isMissingCategoryColumnError(withCategory.error.message)) {
    throw new Error(`Gagal memuat produk: ${withCategory.error.message}`);
  }

  const fallback = await supabase
    .from("products")
    .select(
      "id,name,slug,code,description,image_url,price,show_price,negotiable,status,created_at",
    )
    .order("created_at", { ascending: false });

  if (fallback.error) {
    throw new Error(`Gagal memuat produk: ${fallback.error.message}`);
  }

  return (fallback.data ?? []).map((item) => ({
    ...item,
    category: null,
  })) as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = createSupabaseAdminClient();

  const withCategory = await supabase
    .from("products")
    .select(
      "id,name,slug,code,description,image_url,price,show_price,negotiable,category,status,created_at",
    )
    .eq("slug", slug)
    .single();

  if (!withCategory.error && withCategory.data) {
    return withCategory.data as Product;
  }

  if (
    withCategory.error &&
    isMissingCategoryColumnError(withCategory.error.message)
  ) {
    const fallback = await supabase
      .from("products")
      .select(
        "id,name,slug,code,description,image_url,price,show_price,negotiable,status,created_at",
      )
      .eq("slug", slug)
      .single();

    if (!fallback.error && fallback.data) {
      return {
        ...fallback.data,
        category: null,
      } as Product;
    }
  }

  notFound();
}

export async function getAdminSummary() {
  const supabase = createSupabaseAdminClient();

  const [
    { count: totalProduk },
    { count: totalTerjual },
    { count: totalTersedia },
    { count: totalPermintaanHarga },
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "sold"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "available"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalProduk: totalProduk ?? 0,
    totalTerjual: totalTerjual ?? 0,
    totalTersedia: totalTersedia ?? 0,
    totalPermintaanHarga: totalPermintaanHarga ?? 0,
  };
}
