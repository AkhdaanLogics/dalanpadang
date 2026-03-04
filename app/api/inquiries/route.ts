import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const inquirySchema = z.object({
  product_id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  phone: z.string().max(30).optional(),
  message: z.string().min(5).max(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data permintaan tidak valid" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("inquiries").insert({
      product_id: parsed.data.product_id,
      name: parsed.data.name ?? "Pengunjung",
      phone: parsed.data.phone ?? "",
      message: parsed.data.message,
    });

    if (error) {
      return NextResponse.json(
        { error: "Gagal menyimpan permintaan" },
        { status: 500 },
      );
    }

    return NextResponse.json({ sukses: true });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
