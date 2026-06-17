import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import {
  verifyPassword,
  generateSessionToken,
  CLIENT_SESSION_COOKIE,
  SESSION_TTL_DAYS,
} from "@/lib/utils/client-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "E-mail e senha obrigatórios" }, { status: 400 });
  }

  const svc = createServiceClient();
  const { data: user } = await svc
    .from("client_users")
    .select("id, client_id, name, email, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  // Resolve slug/access_token do cliente para o redirect
  const { data: client } = await svc
    .from("clients")
    .select("slug, access_token")
    .eq("id", user.client_id)
    .maybeSingle();

  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  const { error: sessErr } = await svc.from("client_user_sessions").insert({
    token,
    client_user_id: user.id,
    expires_at: expiresAt.toISOString(),
  });
  if (sessErr) {
    return NextResponse.json({ error: "Erro ao criar sessão" }, { status: 500 });
  }

  const cookieStore = await cookies();
  cookieStore.set(CLIENT_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  const portalPath = client?.slug
    ? `/c/${client.slug}`
    : client?.access_token
    ? `/c/${client.access_token}`
    : "/login-cliente";

  return NextResponse.json({
    success: true,
    redirect: portalPath,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
