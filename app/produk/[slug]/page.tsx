import type { Metadata } from "next";
import Link from "next/link";
import { ProductActions } from "@/components/public/product-actions";
import { ProductVisitTracker } from "@/components/public/product-visit-tracker";
import { WatermarkedImage } from "@/components/shared/watermarked-image";
import { getProductBySlug } from "@/lib/products";
import {
  createWhatsAppAvailabilityMessage,
  createWhatsAppLink,
  createWhatsAppPriceRequestMessage,
} from "@/lib/utils/whatsapp";

export const dynamic = "force-dynamic";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/produk/${product.slug}`;

  return {
    title: `${product.name} | Koleksi Keris Antik`,
    description: product.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | Koleksi Keris Antik`,
      description: product.description,
      images: [
        {
          url: product.image_url,
          alt: product.name,
        },
      ],
      type: "website",
      url: canonicalUrl,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/produk/${product.slug}`;
  const availabilityMessage = createWhatsAppAvailabilityMessage(product);
  const requestMessage = createWhatsAppPriceRequestMessage(product);

  return (
    <main className="mx-auto min-h-[100dvh] w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <ProductVisitTracker productId={product.id} productName={product.name} />

      <Link
        href="/"
        className="btn-ui btn-neutral mb-5 inline-flex rounded-full"
      >
        ← Kembali ke Etalase
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-[#c1ab92] bg-[#fff8ef]">
          <WatermarkedImage
            src={product.image_url}
            alt={product.name}
            productCode={product.code}
            sold={product.status === "sold"}
            mode="detail"
          />
        </div>

        <section className="glass-panel-strong space-y-5 rounded-2xl p-5 md:p-7">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                product.status === "sold"
                  ? "border-red-200 bg-red-100 text-red-700"
                  : "border-emerald-200 bg-emerald-100 text-emerald-700"
              }`}
            >
              {product.status === "sold" ? "Terjual" : "Tersedia"}
            </span>
            <span className="rounded-full border border-[#c1ab92] bg-[#fff8ef] px-3 py-1 text-xs font-semibold text-[#6d5443]">
              Kode: {product.code}
            </span>
          </div>

          <h1 className="text-4xl leading-tight text-[#3a2b22] md:text-5xl">
            {product.name}
          </h1>
          <p className="leading-relaxed text-[#5a4639] md:text-[15px]">
            {product.description}
          </p>

          <div className="price-tag rounded-xl border border-[#c1ab92] bg-[#fcf4ea] p-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-[#6d5443]">Harga</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  product.negotiable
                    ? "bg-[#e6d3bd] text-[#6d5443]"
                    : "bg-[#ede0cf] text-[#6d5443]"
                }`}
              >
                {product.negotiable ? "Negotiable" : "Net"}
              </span>
            </div>
            <p className="mt-1 text-xl font-semibold text-[#3a2b22]">
              {product.show_price && product.price !== null
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(product.price)
                : "Silakan gunakan tombol Request Harga"}
            </p>
          </div>

          <ProductActions
            productId={product.id}
            productName={product.name}
            productCode={product.code}
            productLink={productUrl}
            showPrice={product.show_price}
            negotiable={product.negotiable}
            originalPrice={product.price}
            productSlug={product.slug}
            whatsappAvailabilityUrl={createWhatsAppLink(availabilityMessage)}
            whatsappPriceUrl={createWhatsAppLink(requestMessage)}
          />
        </section>
      </div>
    </main>
  );
}
