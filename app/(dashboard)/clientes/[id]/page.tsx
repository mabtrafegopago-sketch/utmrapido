import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LinkHistory } from "@/components/dashboard/LinkHistory";
import { CopyButton } from "@/components/ui/CopyButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("clients").select("name").eq("id", id).single();
  return { title: data ? `Cliente — ${data.name}` : "Cliente" };
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!client) return notFound();

  const { data: links } = await supabase
    .from("utm_links")
    .select("*")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://utmrapido.com.br";
  const portalUrl = `${siteUrl}/c/${client.access_token}`;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/clientes" className="text-muted hover:text-brand transition-colors text-sm mt-1">
          ← Clientes
        </Link>
        <div className="flex-1 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: client.color }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{client.name}</h1>
            {client.email && <p className="text-muted text-sm">{client.email}</p>}
          </div>
        </div>
      </div>

      {/* Portal link card */}
      <div className="bg-brand-light border border-[#C4C0F0] rounded-2xl p-5">
        <p className="text-sm font-semibold text-brand mb-1">Link do portal do cliente</p>
        <p className="text-xs text-muted mb-3">
          Envie este link para {client.name}. Ele abre sem precisar de login.
        </p>
        <div className="flex items-center gap-3 bg-white rounded-xl border border-border px-4 py-3">
          <p className="flex-1 text-sm font-mono text-muted truncate">{portalUrl}</p>
          <CopyButton url={portalUrl} label="Copiar link" />
        </div>
      </div>

      {/* Links list */}
      <div>
        <h2 className="text-lg font-bold text-text mb-4">
          Links UTM ({(links ?? []).length})
        </h2>
        <LinkHistory links={links ?? []} />
      </div>
    </div>
  );
}
