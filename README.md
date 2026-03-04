# Koleksi Keris Antik

Website katalog keris antik premium menggunakan Next.js App Router + Supabase + Tailwind CSS.

Semua teks antarmuka pengguna telah disiapkan dalam Bahasa Indonesia.

## Teknologi

- Next.js (versi terbaru)
- TypeScript
- Tailwind CSS
- Supabase (Database, Auth, Storage)
- Vercel Analytics
- Siap deploy ke Vercel

## Struktur Proyek

```bash
app/
	admin/
		actions.ts
		login/page.tsx
		page.tsx
		produk/baru/page.tsx
		produk/[id]/edit/page.tsx
	api/
		backup/route.ts
		inquiries/route.ts
	produk/[slug]/page.tsx
	globals.css
	layout.tsx
	page.tsx
components/
	admin/
		product-form-fields.tsx
		product-table.tsx
		summary-cards.tsx
	public/
		product-actions.tsx
		product-card.tsx
		product-grid.tsx
		product-visit-tracker.tsx
	shared/
		watermarked-image.tsx
lib/
	auth.ts
	products.ts
	types.ts
	supabase/
		admin.ts
		client.ts
		middleware.ts
		server.ts
	utils/
		analytics.ts
		slugify.ts
		whatsapp.ts
supabase/
	schema.sql
proxy.ts
.env.example
```

## Fitur Publik (`/`)

- Etalase grid produk
- Badge status `Tersedia` / `Terjual`
- Overlay `TERJUAL` untuk produk sold
- Kode produk di pojok kanan atas gambar
- Watermark CSS semi-transparan (`Koleksi Keris Antik`)
- Tombol:
  - `Lihat Detail`
  - `Chat WhatsApp`
  - `Request Harga`

## Fitur Detail Produk (`/produk/[slug]`)

- SEO dinamis dengan Metadata API:
  - Title: `{Nama Produk} | Koleksi Keris Antik`
  - Description dari deskripsi produk
  - OpenGraph title, description, image
  - Canonical URL
- Template pesan WhatsApp otomatis dengan `encodeURIComponent`
- Event analytics:
  - halaman produk dikunjungi
  - klik WhatsApp
  - klik Request Harga

## Fitur Admin (`/admin`)

- Login admin dengan Supabase Auth
- Halaman terlindungi middleware
- Ringkasan:
  - Total Produk
  - Total Terjual
  - Total Tersedia
  - Total Permintaan Harga
- CRUD Produk:
  - Tambah Produk
  - Edit Produk
  - Kode produk otomatis format `A-01` jika field kode dikosongkan saat tambah
  - Hapus Produk
  - Ubah Status
  - Upload gambar ke Supabase Storage
  - Toggle Tampilkan Harga ke Publik

## API Tambahan

- `GET /api/backup`
  - Mengunduh semua data produk sebagai JSON
  - Wajib login admin
- `POST /api/inquiries`
  - Menyimpan data permintaan harga ke tabel `inquiries`

## Setup Lokal

1. Salin env:

```bash
cp .env.example .env.local
```

2. Isi nilai env sesuai project Supabase.

3. Install dependency:

```bash
npm install
```

4. Jalankan SQL di Supabase SQL Editor:

- Gunakan file: `supabase/schema.sql`

5. Jalankan aplikasi:

```bash
npm run dev
```

## Konfigurasi Supabase Auth Admin

Gunakan salah satu cara berikut:

1. Set `app_metadata.role = "admin"` pada user auth, atau
2. Isi env `ADMIN_EMAILS` dengan daftar email admin dipisah koma.

## Deploy ke Vercel

1. Push repository ke GitHub.
2. Import project ke Vercel.
3. Tambahkan environment variables berikut di Vercel:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET`
   - `WATERMARK_TEXT`
   - `ADMIN_EMAILS`
4. Deploy.

## Automatic Backup

### Opsi A (sudah aktif)

Gunakan endpoint admin-protected:

- `GET /api/backup`

### Opsi B (Supabase Edge Function harian)

- Buat edge function `daily-backup`.
- Jadwalkan cron harian di Supabase.
- Simpan hasil backup ke bucket private `backups`.

## Catatan Keamanan

- Route admin diproteksi middleware.

## Update Skema (Kategori Produk)

Jika database sudah terlanjur jalan sebelum fitur kategori ditambahkan, jalankan SQL berikut di Supabase SQL Editor:

```sql
alter table public.products
add column if not exists category text not null default 'koleksi-premium';

update public.products
set category = case
	when category = 'harian' then 'koleksi-reguler'
	when category = 'langka' then 'koleksi-langka'
	when category = 'pusaka' then 'koleksi-premium'
	else category
end;

alter table public.products
drop constraint if exists products_category_check;

do $$
begin
	if not exists (
		select 1
		from pg_constraint
		where conname = 'products_category_check'
	) then
		alter table public.products
		add constraint products_category_check
		check (category in ('koleksi-reguler', 'koleksi-langka', 'koleksi-premium'));
	end if;
end $$;
```

- RLS diaktifkan untuk tabel utama.
- Policy publik default hanya baca produk `available`.
- Operasi admin memakai verifikasi role admin.
