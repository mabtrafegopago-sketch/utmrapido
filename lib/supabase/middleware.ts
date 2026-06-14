import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // ─── Rotas 100% públicas — portal do cliente nunca exige login ───
  // /c/[token|slug]: portal do cliente acessado por qualquer pessoa
  const publicPrefixes = ["/c/", "/api/c/"];
  const isPublicPortal =
    publicPrefixes.some((p) => pathname.startsWith(p)) ||
    pathname === "/c";

  if (isPublicPortal) {
    return supabaseResponse;
  }

  // Intercept OAuth code at root — happens when Supabase redirect URL is set to site root
  if (pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const url = request.nextUrl.clone();
    const code = url.searchParams.get("code")!;
    const next = url.searchParams.get("next") ?? "/dashboard";
    url.pathname = "/api/auth/callback";
    url.search = "";
    url.searchParams.set("code", code);
    url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = ["/dashboard", "/clientes", "/historico"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
