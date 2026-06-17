import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { hashPassword } from "@/lib/utils/client-auth";

// GET ?client_id=... — lista usuários do cliente
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client_id");
  if (!clientId) return NextResponse.json({ error: "client_id obrigatório" }, { status: 400 });

  // Confirma que o cliente pertence ao gestor
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!client) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  const { data, error } = await supabase
    .from("client_users")
    .select("id, client_id, name, email, created_at")
    .eq("client_id", clientId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST — cria usuário { client_id, name, email, password }
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const client_id = String(body.client_id ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!client_id || !name || !email || !password) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Senha deve ter no mínimo 6 caracteres" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("id", client_id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!client) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  const password_hash = await hashPassword(password);

  // Insert via supabase autenticado (RLS aceita pelo gestor)
  const { data, error } = await supabase
    .from("client_users")
    .insert({ client_id, name, email, password_hash })
    .select("id, client_id, name, email, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Este e-mail já está em uso" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}

// PATCH — atualiza senha do usuário { id, password }
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, password, name } = await request.json();
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

  const update: { name?: string; password_hash?: string } = {};
  if (typeof name === "string" && name.trim()) update.name = name.trim();
  if (typeof password === "string" && password.length > 0) {
    if (password.length < 6) {
      return NextResponse.json({ error: "Senha deve ter no mínimo 6 caracteres" }, { status: 400 });
    }
    update.password_hash = await hashPassword(password);
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
  }

  // RLS verifica via client_id IN (...) — gestor só altera os próprios
  const { data, error } = await supabase
    .from("client_users")
    .update(update)
    .eq("id", id)
    .select("id, client_id, name, email, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE ?id=... — remove usuário
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });

  // Limpa sessões via service client (bypassa RLS)
  try {
    const svc = createServiceClient();
    await svc.from("client_user_sessions").delete().eq("client_user_id", id);
  } catch {
    // segue mesmo se falhar a limpeza
  }

  const { error } = await supabase.from("client_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
