import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProduct } from "@/app/admin/actions";
import { ProductFormFields } from "@/components/admin/product-form-fields";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,code,description,image_url,price,show_price,negotiable,category,status,created_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;

  return (
    <section className="glass-panel space-y-4 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700">
            Kelola Produk
          </p>
          <h2 className="text-3xl text-stone-900">Edit Produk</h2>
        </div>
        <Link href="/admin" className="btn-ui btn-neutral rounded-full">
          Kembali ke Dashboard
        </Link>
      </div>

      {query.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {query.error}
        </div>
      ) : null}

      <form action={updateProduct} className="space-y-4">
        <ProductFormFields
          product={product}
          currentCode={product.code}
          submitLabel="Perbarui Produk"
        />
      </form>
    </section>
  );
}
