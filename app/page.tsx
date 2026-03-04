import { ProductGrid } from "@/components/public/product-grid";
import { BrandIcon } from "@/components/shared/brand-icon";
import { getPublicProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getPublicProducts();
  const totalTersedia = products.filter(
    (item) => item.status === "available",
  ).length;
  const totalTerjual = products.filter((item) => item.status === "sold").length;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <header className="hero-gradient relative mb-8 overflow-hidden rounded-2xl border border-[#fff8ee]/45 px-6 py-9 text-[#f8efe2] shadow-lg md:px-10">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#ba8c60]/12 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#e8d7c4] md:text-sm">
              Etalase Koleksi
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#f8efe2]/20 text-[#f5eadf]">
                <BrandIcon className="h-5 w-5" />
              </span>
              <h1 className="text-4xl font-semibold md:text-5xl">
                Koleksi Keris Antik
              </h1>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#eadccc] md:text-base">
              Jelajahi koleksi keris pilihan dengan kurasi premium. Setiap
              produk menampilkan kode unik, status ketersediaan, dan akses cepat
              ke WhatsApp.
            </p>

            <div className="mt-6 inline-flex items-center rounded-full border border-[#d8c6b0]/35 bg-[#f8efe2]/10 px-4 py-2 text-xs text-[#f5eadf] md:text-sm">
              Kurasi autentik • Tampilan modern • Siap koleksi
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-[#fff8ee]/35 bg-[#f8efe2]/10 p-3 text-center">
              <p className="text-xs text-[#eadccc]">Total</p>
              <p className="mt-1 text-2xl font-semibold">{products.length}</p>
            </div>
            <div className="rounded-xl border border-[#fff8ee]/35 bg-[#f8efe2]/10 p-3 text-center">
              <p className="text-xs text-[#eadccc]">Tersedia</p>
              <p className="mt-1 text-2xl font-semibold">{totalTersedia}</p>
            </div>
            <div className="rounded-xl border border-[#fff8ee]/35 bg-[#f8efe2]/10 p-3 text-center">
              <p className="text-xs text-[#eadccc]">Terjual</p>
              <p className="mt-1 text-2xl font-semibold">{totalTerjual}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="glass-panel space-y-5 rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl">Daftar Produk</h2>
          <span className="rounded-full border border-[#fff8ee] bg-[#fff8f0] px-4 py-1.5 text-sm font-medium text-[#5a4639]">
            {products.length} koleksi
          </span>
        </div>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
