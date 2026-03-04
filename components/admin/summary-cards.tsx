import type { DashboardSummary } from "@/lib/types";

type SummaryCardsProps = {
  summary: DashboardSummary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total Produk",
      value: summary.totalProduk,
      accent: "bg-stone-200 text-stone-700",
    },
    {
      label: "Total Terjual",
      value: summary.totalTerjual,
      accent: "bg-red-100 text-red-700",
    },
    {
      label: "Total Tersedia",
      value: summary.totalTersedia,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Permintaan Harga",
      value: summary.totalPermintaanHarga,
      accent: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${card.accent}`}
          >
            {card.label}
          </span>
          <p className="mt-2 text-3xl font-semibold text-stone-900">
            {card.value}
          </p>
        </article>
      ))}
    </div>
  );
}
