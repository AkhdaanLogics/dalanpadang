import Link from "next/link";
import type { Product } from "@/lib/types";
import { WatermarkedImage } from "@/components/shared/watermarked-image";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const sold = product.status === "sold";

  return (
    <article className="card-antique group overflow-hidden rounded-2xl border border-[#c1ab92] bg-[#fffaf4]/95 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <WatermarkedImage
        src={product.image_url}
        alt={product.name}
        productCode={product.code}
        sold={sold}
      />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="line-clamp-2 font-serif text-xl leading-snug text-[#3a2b22] transition-colors duration-300 group-hover:text-[#6d5443]">
            {product.name}
          </h3>
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
              sold
                ? "border-red-200 bg-red-100 text-red-700"
                : "border-emerald-200 bg-emerald-100 text-emerald-700"
            }`}
          >
            {sold ? "Terjual" : "Tersedia"}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-[#5a4639]">
          {product.description}
        </p>

        <div className="flex items-center justify-between border-t border-[#d8c6b0] pt-3">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#8a6a4f]">
            Koleksi Premium
          </span>
          <Link
            href={`/produk/${product.slug}`}
            className="btn-ui btn-dark inline-flex"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </article>
  );
}
