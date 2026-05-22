import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
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

  const campaigns = [...new Set((links ?? []).map((l) => l.utm_campaign).filter(Boolean))];

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
        {/* Stats rápidas */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="bg-white rounded-xl border border-border px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-brand">{(links ?? []).length}</span>
            <span className="text-sm text-muted">links no total</span>
          </div>
          <div className="bg-white rounded-xl border border-border px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-brand">{campaigns.length}</span>
            <span className="text-sm text-muted">campanhas</span>
          </div>
        </div>

        {/* Lista de links */}
        {!links || links.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center text-muted">
            <p className="text-4xl mb-3">🔗</p>
            <p className="font-medium">Nenhum link criado ainda</p>
            <p className="text-sm mt-1">Quando seu gestor criar links para você, eles aparecerão aqui.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-xl border border-border p-5 hover:border-brand/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="font-semibold text-text">{link.name}</p>
                  <CopyButton url={link.full_url} label="Copiar" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {link.utm_source && <Badge variant="default">source: {link.utm_source}</Badge>}
                  {link.utm_medium && <Badge variant="info">medium: {link.utm_medium}</Badge>}
                  {link.utm_campaign && <Badge variant="success">campaign: {link.utm_campaign}</Badge>}
                  {link.utm_content && <Badge variant="warning">content: {link.utm_content}</Badge>}
                  {link.utm_term && <Badge>term: {link.utm_term}</Badge>}
                </div>

                <p className="text-xs font-mono text-muted bg-gray-50 rounded-lg px-3 py-2 break-all border border-border">
                  {link.full_url}
                </p>

                <p className="text-xs text-muted mt-2">
                  Criado em{" "}
                  {new Date(link.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted mt-10">
          Portal gerado por{" "}
          <a href="/" className="text-brand hover:underline font-medium">
            UTM Rápido
          </a>
        </p>
      </div>
    </div>
  );
}

