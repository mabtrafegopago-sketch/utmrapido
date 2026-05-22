import Link from "next/link";
import { ToastContainer } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/server";

async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-text hover:text-brand transition-colors">
          <span className="text-xl">⚡</span>
          <span>UTM Rápido</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
          <Link href="/o-que-e-utm" className="hover:text-text transition-colors">O que é UTM?</Link>
          <Link href="/precos" className="hover:text-text transition-colors">Preços</Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-brand text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted hover:text-text transition-colors px-3 py-2"
              >
                Entrar
              </Link>
              <Link
                href="/precos"
                className="bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
              >
                Ser Pro — R$9,90/mês
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 font-bold text-text mb-2">
              <span className="text-xl">⚡</span> UTM Rápido
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Gerador de links UTM para gestores de tráfego brasileiros.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-text mb-3">Ferramenta</p>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li><Link href="/" className="hover:text-brand transition-colors">Gerador de UTM</Link></li>
              <li><Link href="/precos" className="hover:text-brand transition-colors">Planos e preços</Link></li>
              <li><Link href="/login" className="hover:text-brand transition-colors">Entrar</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-text mb-3">Aprender</p>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li><Link href="/o-que-e-utm" className="hover:text-brand transition-colors">O que é UTM?</Link></li>
              <li><Link href="/utm-para-meta-ads" className="hover:text-brand transition-colors">UTM para Meta Ads</Link></li>
              <li><Link href="/utm-para-google-ads" className="hover:text-brand transition-colors">UTM para Google Ads</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-text mb-3">Contato</p>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li>
                <a href="mailto:contato@utmrapido.com.br" className="hover:text-brand transition-colors">
                  contato@utmrapido.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© {new Date().getFullYear()} UTM Rápido. Todos os direitos reservados.</p>
          <p>Feito para gestores de tráfego brasileiros 🇧🇷</p>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastContainer />
    </>
  );
}
