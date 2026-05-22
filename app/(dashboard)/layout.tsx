import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ToastContainer } from "@/components/ui/Toast";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⚡" },
  { href: "/clientes", label: "Clientes", icon: "👥" },
  { href: "/historico", label: "Histórico", icon: "📋" },
];

async function Sidebar({ avatarUrl, fullName, plan }: { avatarUrl: string | null; fullName: string | null; plan: string }) {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-border min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-text hover:text-brand transition-colors">
          <span className="text-xl">⚡</span> UTM Rápido
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-brand-light hover:text-brand transition-colors"
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Plan badge + user */}
      <div className="px-3 py-4 border-t border-border flex flex-col gap-3">
        {plan === "free" && (
          <Link
            href="/precos"
            className="flex items-center justify-center gap-2 bg-brand text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-brand-dark transition-colors"
          >
            ⭐ Ser Pro — R$9,90/mês
          </Link>
        )}
        {plan === "pro" && (
          <div className="flex items-center justify-center gap-2 bg-brand-light text-brand text-xs font-semibold px-3 py-2.5 rounded-xl">
            ⭐ Plano Pro
          </div>
        )}

        <form action="/api/auth/signout" method="POST">
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
        </form>
      </div>
    </aside>
  );
}

function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button
        type="submit"
        className="text-xs text-muted hover:text-danger transition-colors px-1"
        title="Sair"
      >
        ↪
      </button>
    </form>
  );
}

// Mobile top bar
function MobileTopBar() {
  return (
    <div className="md:hidden bg-white border-b border-border px-4 h-14 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-bold text-text">
        <span>⚡</span> UTM Rápido
      </Link>
      <nav className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="p-2 rounded-lg text-muted hover:text-brand hover:bg-brand-light transition-colors text-lg"
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
