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

export function PricingCards() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-text mb-2">Planos simples e diretos</h2>
          <p className="text-muted">Comece grátis. Seja Pro quando precisar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Free */}
          <div className="border border-border rounded-2xl p-6 flex flex-col">
            <div className="mb-4">
              <p className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">Gratuito</p>
              <p className="text-3xl font-bold text-text">R$0</p>
              <p className="text-muted text-sm mt-1">Para sempre</p>
            </div>
            <ul className="flex flex-col gap-2.5 mb-6 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-success mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/#gerador">
              <Button variant="secondary" size="lg" className="w-full">
                Começar grátis
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-brand rounded-2xl p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Popular
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-brand uppercase tracking-wide mb-1">Pro Gestor</p>
              <p className="text-3xl font-bold text-text">
                R$9,90
                <span className="text-base font-normal text-muted">/mês</span>
              </p>
              <p className="text-muted text-sm mt-1">Tudo que um gestor profissional precisa</p>
            </div>
            <ul className="flex flex-col gap-2.5 mb-6 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-text">
                  <span className="text-brand mt-0.5 font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login">
              <Button size="lg" className="w-full">
                Quero ser Pro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
