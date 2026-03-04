import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProductStatus } from "@/lib/types";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number };
  };
  edited_message?: {
    text?: string;
    chat?: { id?: number };
  };
};

function parseStatusFromText(text: string): ProductStatus | null {
  const normalized = text.toLowerCase();

  if (/(terjual|sold)\b/.test(normalized)) {
    return "sold";
  }

  if (/(tersedia|available|ready)\b/.test(normalized)) {
    return "available";
  }

  return null;
}

function parseProductCodeFromText(text: string) {
  const match = text.toUpperCase().match(/\bA-\d+\b/);
  return match?.[0] ?? null;
}

async function sendTelegramReply(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return;
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
}

function isWebhookSecretValid(request: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expectedSecret) {
    return true;
  }

  const incomingSecret = request.headers.get("x-telegram-bot-api-secret-token");

  return incomingSecret === expectedSecret;
}

export async function POST(request: Request) {
  if (!isWebhookSecretValid(request)) {
    return NextResponse.json(
      { error: "Unauthorized webhook" },
      { status: 401 },
    );
  }

  let update: TelegramUpdate;

  try {
    update = (await request.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = update.message ?? update.edited_message;
  const text = message?.text ?? "";
  const chatId = message?.chat?.id;

  if (!text) {
    return NextResponse.json({ ok: true });
  }

  const status = parseStatusFromText(text);
  const productCode = parseProductCodeFromText(text);

  if (!status || !productCode) {
    if (chatId) {
      await sendTelegramReply(
        chatId,
        "Format belum dikenali. Contoh: A-01 terjual / A-01 sold / A-01 tersedia",
      );
    }

    return NextResponse.json({ ok: true });
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update({ status })
    .eq("code", productCode)
    .select("id,name,code,slug,status")
    .limit(1)
    .maybeSingle();

  if (error) {
    if (chatId) {
      await sendTelegramReply(chatId, `Gagal update status: ${error.message}`);
    }
    return NextResponse.json({ ok: true });
  }

  if (!data) {
    if (chatId) {
      await sendTelegramReply(
        chatId,
        `Produk dengan kode ${productCode} tidak ditemukan.`,
      );
    }
    return NextResponse.json({ ok: true });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/produk/${data.slug}`);

  if (chatId) {
    const statusLabel = status === "sold" ? "Terjual" : "Tersedia";
    await sendTelegramReply(
      chatId,
      `Status ${data.code} (${data.name}) berhasil diubah menjadi ${statusLabel}.`,
    );
  }

  return NextResponse.json({ ok: true });
}
