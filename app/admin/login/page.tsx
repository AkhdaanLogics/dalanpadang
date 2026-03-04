import { loginAdmin } from "@/app/admin/actions";
import { PasswordField } from "@/components/admin/password-field";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-md items-center px-4 py-6">
      <section className="glass-panel-strong w-full rounded-3xl p-5 sm:p-7">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-700">
          Akses Terbatas
        </p>
        <h1 className="mb-1 text-3xl text-stone-900 md:text-4xl">
          Login Admin
        </h1>
        <p className="mb-6 text-sm text-stone-600">
          Masuk untuk mengelola produk, status, dan permintaan harga.
        </p>

        {params.error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}

        <form action={loginAdmin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="field-ui"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Password
            </label>
            <PasswordField />
          </div>

          <button type="submit" className="btn-ui btn-dark w-full">
            Masuk
          </button>
        </form>
      </section>
    </main>
  );
}
