import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type FolderUpdate = Database["public"]["Tables"]["folders"]["Update"];

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client_id");
  if (!clientId) return NextResponse.json({ error: "client_id obrigatório" }, { status: 400 });

  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("client_id", clientId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { client_id, name, color, parent_id } = await request.json();
  if (!client_id || !name) return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });

  // Se parent_id, valida que pertence ao mesmo cliente/usuário e que ele mesmo não é subpasta (1 nível de profundidade).
  if (parent_id) {
    const { data: parent } = await supabase
      .from("folders")
      .select("id, client_id, parent_id")
      .eq("id", parent_id)
      .eq("user_id", user.id)
      .single();
    if (!parent || parent.client_id !== client_id) {
      return NextResponse.json({ error: "Pasta pai inválida" }, { status: 400 });
    }
    if (parent.parent_id) {
      return NextResponse.json({ error: "Subpasta de subpasta não é suportada" }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("folders")
    .insert({
      client_id,
      user_id: user.id,
      name: name.trim(),
      color: color ?? "#534AB7",
      parent_id: parent_id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name, color } = await request.json();
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

  const update: FolderUpdate = {};
  if (typeof name === "string") update.name = name.trim();
  if (typeof color === "string") update.color = color;

  const { data, error } = await supabase
    .from("folders")
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
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

  const { error } = await supabase
    .from("folders")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
