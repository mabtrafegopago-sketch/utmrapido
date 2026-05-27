import Link from "next/link";
import { ToastContainer } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/marketing/Logo";

async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" aria-label="UTM Rápido — início">
          <Logo variant="horizontal" size={28} />
        </Link>

        {/* Nav — oculto no mobile */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
          <Link href="/o-que-e-utm" className="hover:text-text transition-colors">O que é UTM?</Link>
          <Link href="/blog" className="hover:text-text transition-colors">Blog</Link>
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
              {/* "Ser Pro" oculto no mobile — aparece só em sm+ */}
              <Link
                href="/precos"
                className="hidden sm:inline-flex bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
              >
                Ser Pro — R$16,90/mês
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="sm:col-span-1">
            <div className="mb-2">
              <Logo variant="horizontal" size={22} />
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
              <li><Link href="/blog" className="hover:text-brand transition-colors">Blog</Link></li>
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
              <li>
                <a
                  href="https://wa.me/55WHATSAPP_NUMBER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-brand transition-colors"
                >
                  <svg className="w-4 h-4 text-[#25D366] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© {new Date().getFullYear()} UTM Rápido. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacidade" className="hover:text-brand transition-colors">Política de Privacidade</Link>
            <p>Feito para gestores de tráfego brasileiros 🇧🇷</p>
          </div>
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
