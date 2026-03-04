import { notFound } from "next/navigation";
import type { Product } from "@/lib/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getPublicProducts() {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,code,description,image_url,price,show_price,negotiable,status,created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Gagal memuat produk: ${error.message}`);
  }

  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,code,description,image_url,price,show_price,negotiable,status,created_at",
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  return data as Product;
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
