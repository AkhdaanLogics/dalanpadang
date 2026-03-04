import type { User } from "@supabase/supabase-js";

export function isAdminUser(user: User | null) {
  if (!user) return false;

  const metadataRole = user.app_metadata?.role;
  if (metadataRole === "admin") return true;

  const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return allowedEmails.includes(user.email?.toLowerCase() ?? "");
}
