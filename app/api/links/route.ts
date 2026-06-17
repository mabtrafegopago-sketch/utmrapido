import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client_id");
  const page = Number(searchParams.get("page") ?? 1);
  const limit = 20;
  const from = (page - 1) * limit;

  let query = supabase
    .from("utm_links")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (clientId) query = query.eq("client_id", clientId);

  const folderId = searchParams.get("folder_id");
  if (folderId === "none") query = query.is("folder_id", null);
  else if (folderId) query = query.eq("folder_id", folderId);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data, count });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, base_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term, full_url, client_id, folder_id, description } = body;

  if (!name || !base_url || !full_url) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("utm_links")
    .insert({ user_id: user.id, name, base_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term, full_url, client_id: client_id ?? null, folder_id: folder_id ?? null, description: description ?? null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, ids, folder_id, client_id, description, name } = body;

  // Atualização em lote: { ids: string[], folder_id?, client_id? }
  if (Array.isArray(ids) && ids.length > 0) {
    const update: { folder_id?: string | null; client_id?: string | null } = {};
    if (folder_id === null || typeof folder_id === "string") update.folder_id = folder_id || null;
    if (client_id === null || typeof client_id === "string") update.client_id = client_id || null;
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
    }
    const { error } = await supabase
      .from("utm_links")
      .update(update)
      .in("id", ids)
      .eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, count: ids.length });
  }

  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

  const update: { description?: string | null; name?: string; folder_id?: string | null } = {};
  if (typeof description === "string" || description === null) update.description = description || null;
  if (typeof name === "string") update.name = name.trim();
  if (folder_id === null || typeof folder_id === "string") update.folder_id = folder_id || null;

  const { data, error } = await supabase
    .from("utm_links")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const idsParam = searchParams.get("ids");

  if (idsParam) {
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length === 0) return NextResponse.json({ error: "IDs obrigatórios" }, { status: 400 });
    const { error } = await supabase
      .from("utm_links")
      .delete()
      .in("id", ids)
      .eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, count: ids.length });
  }

  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

  const { error } = await supabase
    .from("utm_links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
