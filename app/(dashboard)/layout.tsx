import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ToastContainer } from "@/components/ui/Toast";
import { Logo } from "@/components/marketing/Logo";
import { LayoutDashboard, Users, History, Sparkles, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", Icon: Users },
  { href: "/historico", label: "Histórico", Icon: History },
];

function Sidebar({
  avatarUrl,
  fullName,
  plan,
}: {
  avatarUrl: string | null;
  fullName: string | null;
  plan: string;
}) {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-border min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="UTM Rápido — início"
        >
          <Logo variant="horizontal" size={26} />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-brand-light hover:text-brand transition-colors"
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Plan + user */}
      <div className="px-3 py-4 border-t border-border flex flex-col gap-3">
        {plan === "free" && (
          <Link
            href="/precos"
            className="flex items-center justify-center gap-2 bg-brand text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-brand-dark transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ser Pro — R$16,90/mês
          </Link>
        )}
        {plan === "pro" && (
          <div className="flex items-center justify-center gap-2 bg-brand-light text-brand text-xs font-semibold px-3 py-2.5 rounded-xl">
            <Sparkles className="w-3.5 h-3.5" />
            Plano Pro
          </div>
        )}

        <div className="flex items-center gap-2 px-2">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">
              {(fullName ?? "U").charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-muted flex-1 truncate">{fullName ?? "Usuário"}</span>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button
        type="submit"
        className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors"
        title="Sair"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}

function MobileTopBar() {
  return (
    <div className="md:hidden bg-white border-b border-border px-4 h-14 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2" aria-label="UTM Rápido">
        <Logo variant="horizontal" size={22} />
      </Link>
      <nav className="flex items-center gap-1">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand-light transition-colors"
            title={label}
          >
            <Icon className="w-5 h-5" />
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        avatarUrl={profile?.avatar_url ?? null}
        fullName={profile?.full_name ?? null}
        plan={profile?.plan ?? "free"}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar />
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
}
