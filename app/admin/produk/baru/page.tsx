import Link from "next/link";
import { createProduct } from "@/app/admin/actions";
import { ProductFormFields } from "@/components/admin/product-form-fields";
import { getNextProductCodePreview } from "@/lib/utils/product-code";
export const dynamic = "force-dynamic";

type NewProductPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewProductPage({
  searchParams,
}: NewProductPageProps) {
  const [params, nextCode] = await Promise.all([
    searchParams,
    getNextProductCodePreview(),
  ]);

  return (
    <section className="glass-panel space-y-4 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700">
            Kelola Produk
          </p>
          <h2 className="text-3xl text-stone-900">Tambah Produk</h2>
        </div>
        <Link href="/admin" className="btn-ui btn-neutral rounded-full">
          Kembali ke Dashboard
        </Link>
      </div>

      {params.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {params.error}
        </div>
      ) : null}

      <form action={createProduct} className="space-y-4">
        <ProductFormFields currentCode={nextCode} submitLabel="Simpan Produk" />
      </form>
    </section>
  );
}
