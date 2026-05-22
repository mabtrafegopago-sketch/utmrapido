import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FREE_LINK_LIMIT } from "@/lib/utils/utm";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ data: [] });

  const { data } = await supabase
    .from("anonymous_links")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { session_id, name, full_url, utm_source, utm_medium, utm_campaign } = body;

  if (!session_id || !name || !full_url) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const { count } = await supabase
    .from("anonymous_links")
    .select("*", { count: "exact", head: true })
    .eq("session_id", session_id);

  if ((count ?? 0) >= FREE_LINK_LIMIT) {
    return NextResponse.json({ error: "limit_reached", limit: FREE_LINK_LIMIT }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("anonymous_links")
    .insert({ session_id, name, full_url, utm_source, utm_medium, utm_campaign })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}
