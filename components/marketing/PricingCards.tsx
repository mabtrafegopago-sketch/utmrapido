import Link from "next/link";
import { Button } from "@/components/ui/Button";

const FREE_FEATURES = [
  "Gerador de UTM ilimitado",
  "Validação e presets automáticos",
  "Cópia com 1 clique",
  "Salvar até 5 links por sessão",
  "Acesso aos artigos e guias",
];

const PRO_FEATURES = [
  "Tudo do plano gratuito",
  "Links salvos ilimitados",
  "Clientes ilimitados",
  "Portal do cliente com link único",
  "Histórico permanente",
  "Exportação CSV",
  "Sem anúncios no dashboard",
];

const FAQ_ITEMS = [
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, sem fidelidade e sem multa. Cancele a qualquer momento pelo painel de configurações.",
  },
  {
    q: "O plano gratuito tem limite?",
    a: "Sim, até 5 links salvos por sessão — sem login. O gerador de UTM em si é ilimitado.",
  },
  {
    q: "Meu cliente precisa ter conta?",
    a: "Não. Ele acessa todos os links das campanhas pelo link compartilhado, sem criar conta ou login.",
  },
  {
    q: "Os dados ficam salvos para sempre?",
    a: "Sim, no plano Pro. Histórico permanente com segurança total — sem risco de perda.",
  },
  {
    q: "Funciona para qualquer tipo de campanha?",
    a: "Sim. Temos presets prontos para Meta Ads, Google Ads, TikTok e muito mais.",
  },
];

export function PricingCards() {
  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-on-scroll">
            <h2 className="text-2xl font-bold text-text mb-2">Planos simples e diretos</h2>
            <p className="text-muted">Comece grátis. Seja Pro quando precisar.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-on-scroll">
            {/* Gratuito */}
            <div className="border border-border rounded-2xl p-6 flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md duration-200">
              <div className="mb-5">
                <p className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">Gratuito</p>
                <p className="text-3xl font-bold text-text">R$0</p>
                <p className="text-muted text-sm mt-1">Para sempre</p>
              </div>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <span className="text-success mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/#gerador">
                <Button variant="secondary" size="lg" className="w-full transition-transform hover:-translate-y-0.5 duration-200">
                  Começar grátis
                </Button>
              </Link>
            </div>

            {/* Pro Gestor — destaque */}
            <div className="border-2 border-brand rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl duration-200">
              <div className="absolute top-4 right-4">
                <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Mais Popular
                </span>
              </div>
              <div className="mb-5">
                <p className="text-sm font-semibold text-brand uppercase tracking-wide mb-1">Pro Gestor</p>
                <p className="text-3xl font-bold text-text">
                  R$16,90
                  <span className="text-base font-normal text-muted">/mês</span>
                </p>
                <p className="text-muted text-sm mt-1">Tudo que um gestor profissional precisa</p>
              </div>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text">
                    <span className="text-brand mt-0.5 font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button size="lg" className="w-full transition-transform hover:-translate-y-0.5 duration-200">
                  Quero ser Pro →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 pb-16 animate-on-scroll">
        <h2 className="text-2xl font-bold text-text text-center mb-8">Dúvidas frequentes</h2>
        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((faq) => (
            <div
              key={faq.q}
              className="bg-white rounded-xl border border-border p-5 transition-all hover:border-brand/30 hover:shadow-sm duration-200"
            >
              <p className="font-semibold text-text mb-2">{faq.q}</p>
              <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
