import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortalClient } from "./PortalClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ token: string }>;
}

/**
 * Resolve cliente por slug (URL personalizada) OU access_token (uuid hex).
 * Tenta primeiro slug — se não bater, tenta access_token.
 */
async function resolveClient(
  supabase: Awaited<ReturnType<typeof createClient>>,
  identifier: string
) {
  const { data: bySlug } = await supabase
    .from("clients")
    .select("id, name, color, slug, logo_url, access_token")
    .eq("slug", identifier)
    .maybeSingle();
  if (bySlug) return bySlug;

  const { data: byToken } = await supabase
    .from("clients")
    .select("id, name, color, slug, logo_url, access_token")
    .eq("access_token", identifier)
    .maybeSingle();
  return byToken;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const supabase = await createClient();
  const client = await resolveClient(supabase, token);

  return {
    title: client ? `Links UTM — ${client.name}` : "Portal do Cliente",
    robots: { index: false },
  };
}

export default async function ClientPortalPage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();
  const client = await resolveClient(supabase, token);

  if (!client) return notFound();

  const [{ data: links }, { data: folders }] = await Promise.all([
    supabase
      .from("utm_links")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("folders")
      .select("id, name, color, parent_id, created_at")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <PortalClient
      client={{
        id: client.id,
        name: client.name,
        color: client.color,
        logoUrl: client.logo_url,
        slug: client.slug,
      }}
      links={(links ?? []) as Parameters<typeof PortalClient>[0]["links"]}
      folders={(folders ?? []) as Parameters<typeof PortalClient>[0]["folders"]}
    />
  );
}
