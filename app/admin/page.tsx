import Link from "next/link";
import { ProductTable } from "@/components/admin/product-table";
import { SummaryCards } from "@/components/admin/summary-cards";
import { getAdminSummary, getPublicProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [summary, products] = await Promise.all([
    getAdminSummary(),
    getPublicProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700">
              Panel Admin
            </p>
            <h2 className="text-3xl text-stone-900 md:text-4xl">
              Ringkasan Data
            </h2>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <Link
              href="/admin/produk/baru"
              className="btn-ui btn-amber flex-1 text-center sm:flex-none"
            >
              Tambah Produk
            </Link>
            <a
              href="/api/backup"
              className="btn-ui btn-dark flex-1 text-center sm:flex-none"
            >
              Unduh Backup JSON
            </a>
          </div>
        </div>
      </div>

      <SummaryCards summary={summary} />

      <section className="glass-panel space-y-3 rounded-2xl p-4 md:p-5">
        <h3 className="text-2xl text-stone-900">Kelola Produk</h3>
        <ProductTable products={products} />
      </section>
    </div>
  );
}
