import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const CODE_PATTERN = /^A-(\d+)$/;

function formatCode(numberValue: number) {
  return `A-${String(numberValue).padStart(2, "0")}`;
}

async function getCurrentMaxCodeNumber() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("code");

  if (error) {
    throw new Error(`Gagal membuat kode produk: ${error.message}`);
  }

  let maxNumber = 0;
  for (const item of data ?? []) {
    const code = item.code ?? "";
    const match = CODE_PATTERN.exec(code);
    if (!match) continue;

    const parsed = Number(match[1]);
    if (!Number.isNaN(parsed) && parsed > maxNumber) {
      maxNumber = parsed;
    }
  }

  return maxNumber;
}

export async function getNextProductCodePreview() {
  const maxNumber = await getCurrentMaxCodeNumber();
  return formatCode(maxNumber + 1);
}

export async function generateUniqueProductCode() {
  const supabase = createSupabaseAdminClient();
  const maxNumber = await getCurrentMaxCodeNumber();
  const nextNumber = maxNumber + 1;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = formatCode(nextNumber + attempt);

    const { count, error } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("code", candidate);

    if (error) {
      throw new Error(`Gagal membuat kode produk: ${error.message}`);
    }

    if ((count ?? 0) === 0) {
      return candidate;
    }
  }

  throw new Error("Tidak dapat membuat kode produk unik. Silakan coba lagi.");
}

export function isProductCodeFormatValid(code: string) {
  return CODE_PATTERN.test(code);
}
