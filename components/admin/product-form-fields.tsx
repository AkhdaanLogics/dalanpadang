import type { Product } from "@/lib/types";
import {
  DEFAULT_PRODUCT_CATEGORY,
  PRODUCT_CATEGORIES,
  getProductCategoryLabel,
} from "@/lib/product-categories";

type ProductFormFieldsProps = {
  product?: Product;
  currentCode: string;
  submitLabel: string;
};

export function ProductFormFields({
  product,
  currentCode,
  submitLabel,
}: ProductFormFieldsProps) {
  return (
    <>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      {product ? (
        <input type="hidden" name="existing_code" value={product.code} />
      ) : null}
      <input type="hidden" name="code" value={currentCode} />
      {product ? (
        <input
          type="hidden"
          name="current_image_url"
          value={product.image_url}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Nama Produk
          </label>
          <input
            id="name"
            name="name"
            defaultValue={product?.name ?? ""}
            required
            className="field-ui"
          />
        </div>

        <div>
          <label
            htmlFor="kode-otomatis"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Kode Produk Saat Ini
          </label>
          <input
            id="kode-otomatis"
            value={currentCode}
            disabled
            className="field-ui cursor-not-allowed bg-stone-100 font-medium text-stone-700"
          />
          <p className="mt-1 text-xs text-stone-500">
            Kode dibuat otomatis oleh sistem dan tidak dapat diedit.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-stone-700"
        >
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          required
          rows={5}
          className="field-ui"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div>
          <label
            htmlFor="status"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={product?.status ?? "available"}
            className="field-ui"
          >
            <option value="available">Tersedia</option>
            <option value="sold">Terjual</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Kategori
          </label>
          <select
            id="category"
            name="category"
            defaultValue={product?.category ?? DEFAULT_PRODUCT_CATEGORY}
            className="field-ui"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {getProductCategoryLabel(category)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="mb-1 block text-sm font-medium text-stone-700"
          >
            Harga (opsional)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            defaultValue={product?.price ?? ""}
            className="field-ui"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <input
              type="checkbox"
              name="show_price"
              defaultChecked={product?.show_price ?? false}
              className="h-4 w-4"
            />
            Tampilkan Harga ke Publik
          </label>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
            <input
              type="checkbox"
              name="negotiable"
              defaultChecked={product?.negotiable ?? false}
              className="h-4 w-4"
            />
            Negotiable
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor="image"
          className="mb-1 block text-sm font-medium text-stone-700"
        >
          Upload Gambar {product ? "(opsional)" : ""}
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required={!product}
          className="field-ui text-sm"
        />
      </div>

      <button type="submit" className="btn-ui btn-dark">
        {submitLabel}
      </button>
    </>
  );
}
