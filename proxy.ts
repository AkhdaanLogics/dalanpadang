import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isAdminUser } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  const isAdminPath = pathname.startsWith("/admin");
  const isLoginPath = pathname === "/admin/login";
  const isBackupPath = pathname.startsWith("/api/backup");

  if (isAdminPath || isBackupPath) {
    if (isLoginPath) {
      if (user && isAdminUser(user)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return response;
    }

    if (!user) {
      if (isBackupPath) {
        return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
      }

      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdminUser(user)) {
      if (isBackupPath) {
        return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/backup/:path*"],
};
