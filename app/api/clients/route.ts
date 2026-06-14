import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clientSlug } from "@/lib/utils/utm";
import type { Database } from "@/types/database";

type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("clients")
    .select("*, utm_links(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

/** Garante slug único para o usuário: se conflitar, anexa -2, -3, ... */
async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  desired: string,
  ignoreClientId?: string
): Promise<string> {
  const base = clientSlug(desired) || "cliente";
  let candidate = base;
  let n = 1;
  // Limite de tentativas para evitar loop infinito.
  while (n < 100) {
    const { data } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", userId)
      .eq("slug", candidate)
      .maybeSingle();
    if (!data || data.id === ignoreClientId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now()}`;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, email, color, slug } = body;
  if (!name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

  const finalSlug = await ensureUniqueSlug(supabase, user.id, slug || name);

  const { data, error } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name,
      email: email ?? null,
      color: color ?? "#534AB7",
      slug: finalSlug,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, name, email, color, slug, logo_url } = body;
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

  const update: ClientUpdate = {};
  if (typeof name === "string") update.name = name;
  if (email !== undefined) update.email = email;
  if (typeof color === "string") update.color = color;
  if (logo_url !== undefined) update.logo_url = logo_url;

  if (typeof slug === "string" && slug.trim()) {
    update.slug = await ensureUniqueSlug(supabase, user.id, slug, id);
  }

  const { data, error } = await supabase
    .from("clients")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
