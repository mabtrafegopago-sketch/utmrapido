import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/gif"];

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const clientId = formData.get("client_id") as string | null;
  if (!file || !clientId) {
    return NextResponse.json({ error: "Arquivo e client_id obrigatórios" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Formato não suportado" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Imagem maior que 2MB" }, { status: 400 });
  }

  // Confirma que o cliente é do usuário
  const { data: client } = await supabase
    .from("clients")
    .select("id, user_id")
    .eq("id", clientId)
    .eq("user_id", user.id)
    .single();
  if (!client) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${user.id}/${clientId}-${Date.now()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("client-logos")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  const { data: pub } = supabase.storage.from("client-logos").getPublicUrl(path);
  const logoUrl = pub.publicUrl;

  const { error: updateErr } = await supabase
    .from("clients")
    .update({ logo_url: logoUrl })
    .eq("id", clientId)
    .eq("user_id", user.id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ logo_url: logoUrl });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("client_id");
  if (!clientId) return NextResponse.json({ error: "client_id obrigatório" }, { status: 400 });

  const { error } = await supabase
    .from("clients")
    .update({ logo_url: null })
    .eq("id", clientId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
