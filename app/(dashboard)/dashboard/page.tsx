import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { LinkHistory } from "@/components/dashboard/LinkHistory";
import { UTMGenerator } from "@/components/utm/UTMGenerator";
import { Link2, Users, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [linksRes, clientsRes, weekRes] = await Promise.all([
    supabase
      .from("utm_links")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("clients")
      .select("id, name", { count: "exact" })
      .eq("user_id", user!.id),
    supabase
      .from("utm_links")
      .select("id", { count: "exact" })
      .eq("user_id", user!.id)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const stats = [
    {
      label: "Links criados",
      value: linksRes.count ?? linksRes.data?.length ?? 0,
      Icon: Link2,
      sub: "total",
    },
    {
      label: "Clientes ativos",
      value: clientsRes.count ?? 0,
      Icon: Users,
      sub: "cadastrados",
      iconColor: "#0F6E56",
    },
    {
      label: "Esta semana",
      value: weekRes.count ?? 0,
      Icon: TrendingUp,
      sub: "últimos 7 dias",
      iconColor: "#BA7517",
    },
  ];

  const clients = (clientsRes.data ?? []).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-text mb-1">Dashboard</h1>
        <p className="text-muted text-sm">Crie e gerencie seus links UTM</p>
      </div>

      <StatsCards stats={stats} />

      <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-sm transition-shadow">
        <h2 className="text-lg font-bold text-text mb-5">Novo link UTM</h2>
        <UTMGenerator isLoggedIn isPro clients={clients} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-text mb-4">Últimos links criados</h2>
        <LinkHistory links={linksRes.data ?? []} />
      </div>
    </div>
  );
}
