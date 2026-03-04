"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DEFAULT_PRODUCT_CATEGORY,
  normalizeProductCategory,
} from "@/lib/product-categories";
import {
  generateUniqueProductCode,
  isProductCodeFormatValid,
} from "@/lib/utils/product-code";
import { slugify } from "@/lib/utils/slugify";

function isMissingCategoryColumnError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("products.category") ||
    (normalized.includes("category") &&
      (normalized.includes("does not exist") ||
        normalized.includes("schema cache")))
  );
}

async function ensureAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminUser(user)) {
    redirect("/admin/login");
  }

  return user;
}

function parseNullableNumber(value: FormDataEntryValue | null) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const numberValue = Number(raw);
  return Number.isNaN(numberValue) ? null : numberValue;
}

async function uploadProductImage(file: File, code: string) {
  const supabase = createSupabaseAdminClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "produk-keris";
  const extension = file.name.split(".").pop() ?? "jpg";
  const filePath = `produk/${Date.now()}-${slugify(code)}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new Error(`Gagal upload gambar: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      `/admin/login?error=${encodeURIComponent("Email atau password tidak valid")}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminUser(user)) {
    await supabase.auth.signOut();
    redirect(
      `/admin/login?error=${encodeURIComponent("Akun ini tidak memiliki akses admin")}`,
    );
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createProduct(formData: FormData) {
  await ensureAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const requestedCode = String(formData.get("code") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const rawCategory = String(
    formData.get("category") ?? DEFAULT_PRODUCT_CATEGORY,
  ).trim();
  const category = normalizeProductCategory(rawCategory);
  const status = String(formData.get("status") ?? "available") as
    | "available"
    | "sold";
  const showPrice = formData.get("show_price") === "on";
  const negotiable = formData.get("negotiable") === "on";
  const price = parseNullableNumber(formData.get("price"));
  const image = formData.get("image") as File | null;

  if (!name || !description || !image || image.size === 0) {
    redirect(
      `/admin/produk/baru?error=${encodeURIComponent("Semua data wajib diisi, termasuk gambar")}`,
    );
  }

  let code = requestedCode;
  if (!isProductCodeFormatValid(code)) {
    code = await generateUniqueProductCode();
  } else {
    const supabaseForCode = createSupabaseAdminClient();
    const { count } = await supabaseForCode
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("code", code);

    if ((count ?? 0) > 0) {
      code = await generateUniqueProductCode();
    }
  }

  const imageUrl = await uploadProductImage(image, code);
  const slug = `${slugify(name)}-${slugify(code)}`;

  const supabase = createSupabaseAdminClient();
  let { error } = await supabase.from("products").insert({
    name,
    code,
    slug,
    description,
    category,
    image_url: imageUrl,
    price,
    show_price: showPrice,
    negotiable,
    status,
  });

  if (error && isMissingCategoryColumnError(error.message)) {
    const fallbackInsert = await supabase.from("products").insert({
      name,
      code,
      slug,
      description,
      image_url: imageUrl,
      price,
      show_price: showPrice,
      negotiable,
      status,
    });

    error = fallbackInsert.error;
  }

  if (error) {
    redirect(`/admin/produk/baru?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?sukses=Produk berhasil ditambahkan");
}

export async function updateProduct(formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const rawCategory = String(
    formData.get("category") ?? DEFAULT_PRODUCT_CATEGORY,
  ).trim();
  const category = normalizeProductCategory(rawCategory);
  const status = String(formData.get("status") ?? "available") as
    | "available"
    | "sold";
  const showPrice = formData.get("show_price") === "on";
  const negotiable = formData.get("negotiable") === "on";
  const price = parseNullableNumber(formData.get("price"));
  const image = formData.get("image") as File | null;
  const currentImageUrl = String(
    formData.get("current_image_url") ?? "",
  ).trim();

  if (!id || !name || !description) {
    redirect(`/admin?error=${encodeURIComponent("Data produk tidak lengkap")}`);
  }

  const finalCode = String(formData.get("existing_code") ?? "").trim();
  if (!finalCode) {
    redirect(
      `/admin?error=${encodeURIComponent("Kode produk tidak ditemukan")}`,
    );
  }

  let imageUrl = currentImageUrl;
  if (image && image.size > 0) {
    imageUrl = await uploadProductImage(image, finalCode);
  }

  const slug = `${slugify(name)}-${slugify(finalCode)}`;

  const supabase = createSupabaseAdminClient();
  let { error } = await supabase
    .from("products")
    .update({
      name,
      code: finalCode,
      slug,
      description,
      category,
      image_url: imageUrl,
      price,
      show_price: showPrice,
      negotiable,
      status,
    })
    .eq("id", id);

  if (error && isMissingCategoryColumnError(error.message)) {
    const fallbackUpdate = await supabase
      .from("products")
      .update({
        name,
        code: finalCode,
        slug,
        description,
        image_url: imageUrl,
        price,
        show_price: showPrice,
        negotiable,
        status,
      })
      .eq("id", id);

    error = fallbackUpdate.error;
  }

  if (error) {
    redirect(
      `/admin/produk/${id}/edit?error=${encodeURIComponent(error.message)}`,
    );
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produk/${slug}`);
  redirect("/admin?sukses=Produk berhasil diperbarui");
}

export async function deleteProduct(formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = createSupabaseAdminClient();
  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleProductStatus(formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const nextStatus = String(formData.get("next_status") ?? "available") as
    | "available"
    | "sold";

  const supabase = createSupabaseAdminClient();
  await supabase.from("products").update({ status: nextStatus }).eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleShowPrice(formData: FormData) {
  await ensureAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const showPrice = formData.get("show_price") === "true";

  const supabase = createSupabaseAdminClient();
  await supabase
    .from("products")
    .update({ show_price: showPrice })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin");
}
