import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientDetailClient } from "./ClientDetailClient";
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

  const [{ data: links }, { data: folders }] = await Promise.all([
    supabase
      .from("utm_links")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("folders")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true }),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://utmrapido.com.br";
  const portalUrl = `${siteUrl}/c/${client.access_token}`;

  return (
    <ClientDetailClient
      client={client}
      initialLinks={links ?? []}
      initialFolders={folders ?? []}
      portalUrl={portalUrl}
    />
  );
}
