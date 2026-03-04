export type ProductStatus = "available" | "sold";

export type ProductCategory =
  | "koleksi-reguler"
  | "koleksi-langka"
  | "koleksi-premium";

export interface Product {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string;
  image_url: string;
  price: number | null;
  show_price: boolean;
  negotiable: boolean;
  category?: ProductCategory | null;
  status: ProductStatus;
  created_at: string;
}

export interface Inquiry {
  id: string;
  product_id: string;
  name: string | null;
  phone: string | null;
  message: string;
  created_at: string;
}

export interface DashboardSummary {
  totalProduk: number;
  totalTerjual: number;
  totalTersedia: number;
  totalPermintaanHarga: number;
}
