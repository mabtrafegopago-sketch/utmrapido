import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortalClient } from "./PortalClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("name")
    .eq("access_token", token)
    .single();

  return {
    title: client ? `Links UTM — ${client.name}` : "Portal do Cliente",
    robots: { index: false },
  };
}

export default async function ClientPortalPage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, name, color")
    .eq("access_token", token)
    .single();

  if (!client) return notFound();

  const { data: links } = await supabase
    .from("utm_links")
    .select("*")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      {/* Header do portal */}
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: client.color }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-muted font-medium uppercase tracking-wide">Portal de links UTM</p>
            <h1 className="text-xl font-bold text-text">{client.name}</h1>
          </div>
          <div className="ml-auto">
            <a href="/" className="text-xs text-brand hover:underline font-medium">
              ⚡ UTM Rápido
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <PortalClient
          clientName={client.name}
          clientColor={client.color}
          links={(links ?? []) as Parameters<typeof PortalClient>[0]["links"]}
        />

        <p className="text-center text-xs text-muted mt-10">
          Portal gerado por{" "}
          <a href="/" className="text-brand hover:underline font-medium">UTM Rápido</a>
        </p>
      </div>
    </div>
  );
}
