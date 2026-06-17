import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import { CLIENT_SESSION_COOKIE } from "@/lib/utils/client-auth";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;

  if (token) {
    try {
      const svc = createServiceClient();
      await svc.from("client_user_sessions").delete().eq("token", token);
    } catch {
      // segue
    }
  }

  cookieStore.delete(CLIENT_SESSION_COOKIE);

  // Redirect de volta para /login-cliente
  const url = new URL(request.url);
  return NextResponse.redirect(new URL("/login-cliente", url.origin), { status: 303 });
}
