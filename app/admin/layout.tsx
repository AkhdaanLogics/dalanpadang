import Link from "next/link";
import { logoutAdmin } from "@/app/admin/actions";
import { BrandIcon } from "@/components/shared/brand-icon";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-[#efe3d4]">
      <header className="sticky top-0 z-20 border-b border-[#fff8ee] bg-[#f8efe2]/95">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.28em] text-[#8a6a4f]">
              Dashboard
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#efe3d4] text-[#5a4639]">
                <BrandIcon className="h-4 w-4" />
              </span>
              <h1 className="truncate text-xl text-[#3a2b22] sm:text-2xl md:text-3xl">
                Admin Koleksi Keris Antik
              </h1>
            </div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            <Link
              href="/"
              className="btn-ui btn-neutral flex-1 text-center sm:flex-none"
            >
              Lihat Etalase
            </Link>
            <form action={logoutAdmin}>
              <button type="submit" className="btn-ui btn-red w-full sm:w-auto">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="glass-panel mx-auto mt-6 w-full max-w-7xl rounded-2xl px-4 py-8 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
