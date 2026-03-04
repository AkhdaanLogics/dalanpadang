import Link from "next/link";
import {
  deleteProduct,
  toggleProductStatus,
  toggleShowPrice,
} from "@/app/admin/actions";
import type { Product } from "@/lib/types";

type ProductTableProps = {
  products: Product[];
};

export function ProductTable({ products }: ProductTableProps) {
  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-sm text-stone-600">
        Belum ada produk untuk dikelola.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#fff8ee] bg-[#fff8f0] shadow-sm">
      <table className="min-w-190 text-left text-sm sm:min-w-full">
        <thead className="bg-stone-100/80 text-stone-700">
          <tr>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Kode</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Harga Publik</th>
            <th className="px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isSold = product.status === "sold";
            return (
              <tr
                key={product.id}
                className="border-t border-stone-100 transition hover:bg-stone-50/60"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-stone-900">{product.name}</p>
                  <p className="text-xs text-stone-500">/{product.slug}</p>
                </td>
                <td className="px-4 py-3 text-stone-700">{product.code}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                      isSold
                        ? "border-red-200 bg-red-100 text-red-700"
                        : "border-emerald-200 bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {isSold ? "Terjual" : "Tersedia"}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-700">
                  {product.show_price ? "Ditampilkan" : "Disembunyikan"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex min-w-70 flex-wrap gap-2">
                    <Link
                      href={`/admin/produk/${product.id}/edit`}
                      className="btn-ui btn-amber px-3 py-1.5 text-xs"
                    >
                      Edit Produk
                    </Link>

                    <form action={toggleProductStatus}>
                      <input type="hidden" name="id" value={product.id} />
                      <input
                        type="hidden"
                        name="next_status"
                        value={isSold ? "available" : "sold"}
                      />
                      <button
                        type="submit"
                        className="btn-ui btn-dark px-3 py-1.5 text-xs"
                      >
                        Ubah Status
                      </button>
                    </form>

                    <form action={toggleShowPrice}>
                      <input type="hidden" name="id" value={product.id} />
                      <input
                        type="hidden"
                        name="show_price"
                        value={String(!product.show_price)}
                      />
                      <button
                        type="submit"
                        className="btn-ui btn-indigo px-3 py-1.5 text-xs"
                      >
                        Toggle Tampilkan Harga
                      </button>
                    </form>

                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="btn-ui btn-red px-3 py-1.5 text-xs"
                      >
                        Hapus Produk
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
