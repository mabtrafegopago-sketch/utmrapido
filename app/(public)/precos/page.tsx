import type { Metadata } from "next";
import { PricingCards } from "@/components/marketing/PricingCards";

export const metadata: Metadata = {
  title: "Planos e Preços",
  description: "Plano gratuito para uso básico e Pro Gestor por R$9,90/mês com links ilimitados, portal do cliente e histórico permanente.",
};

const faqs = [
  {
    q: "Posso usar grátis para sempre?",
    a: "Sim. O plano gratuito inclui o gerador de UTM completo, sem limite de geração. O limite é de 5 links salvos por sessão — sem login.",
  },
  {
    q: "O que é o portal do cliente?",
    a: "É um link único que você (gestor) envia para seu cliente. Ele abre no navegador e vê todos os links UTM das campanhas dele, sem precisar criar conta ou login.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. Sem fidelidade, sem multa. Cancele quando quiser pelo painel de configurações.",
  },
  {
    q: "Os dados ficam seguros?",
    a: "Sim. Usamos Supabase com PostgreSQL e Row Level Security — cada usuário só acessa seus próprios dados.",
  },
  {
    q: "Quando o Stripe estiver ativo, quais formas de pagamento aceitam?",
    a: "Cartão de crédito e débito via Stripe. Pix em breve.",
  },
];

export default function PrecosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">Planos simples e diretos</h1>
        <p className="text-muted text-lg">Comece grátis. Seja Pro quando precisar de mais.</p>
      </div>

      <PricingCards />

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-text text-center mb-10">Dúvidas frequentes</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-xl border border-border p-5">
              <p className="font-semibold text-text mb-2">{faq.q}</p>
              <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
