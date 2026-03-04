export type ProductStatus = "available" | "sold";

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
