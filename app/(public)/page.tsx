"use client";

import { useState, useEffect } from "react";
import { Hero } from "@/components/marketing/Hero";
import { Benefits } from "@/components/marketing/Benefits";
import { PricingCards } from "@/components/marketing/PricingCards";
import { AdSenseBlock } from "@/components/marketing/AdSenseBlock";
import { UTMGenerator } from "@/components/utm/UTMGenerator";
import { ToastContainer } from "@/components/ui/Toast";

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-xl font-bold text-text mb-2">Você usou seus 5 links gratuitos</h2>
          <p className="text-muted text-sm leading-relaxed">
            Seja Pro por R$16,90/mês e salve links ilimitados, organize por cliente e compartilhe com quem quiser.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/precos"
            className="w-full bg-brand text-white text-center font-semibold py-3 px-6 rounded-xl hover:bg-brand-dark transition-colors text-sm"
          >
            Quero ser Pro — R$16,90/mês
          </a>
          <a
            href="/login"
            className="w-full bg-brand-light text-brand text-center font-semibold py-3 px-6 rounded-xl hover:bg-[#DDDAF8] transition-colors text-sm border border-[#C4C0F0]"
          >
            Entrar grátis
          </a>
          <button
            onClick={onClose}
            className="text-muted text-sm hover:text-text transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginPromptModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-xl font-bold text-text mb-2">Salve seus links gratuitamente</h2>
          <p className="text-muted text-sm leading-relaxed">
            Faça login grátis para salvar seus links e acessar o histórico.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/login"
            className="w-full bg-brand text-white text-center font-semibold py-3 px-6 rounded-xl hover:bg-brand-dark transition-colors text-sm"
          >
            Entrar com Google
          </a>
          <button
            onClick={onClose}
            className="text-muted text-sm hover:text-text transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    name: "Lucas M.",
    role: "Gestor de tráfego — SP",
    text: "Uso todo dia para organizar as UTMs dos meus 8 clientes. Acabou a bagunça nas planilhas.",
  },
  {
    name: "Fernanda C.",
    role: "Media buyer — RJ",
    text: "O portal do cliente é incrível. Mando o link e eles mesmos consultam os links das campanhas. Economizo horas de suporte.",
  },
  {
    name: "Rafael S.",
    role: "Gestor de tráfego — MG",
    text: "Simples, rápido e sem erro. Antes eu travava no nome da campanha e errava parâmetro. Agora não perco mais tracking.",
  },
];

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="bg-background">
        {/* Hero */}
        <Hero />

        {/* Prova social — depoimentos */}
        <section className="py-12 px-4 bg-white animate-on-scroll">
          <div className="max-w-5xl mx-auto">
            <div className="flex overflow-x-auto snap-x snap-mandatory sm:grid sm:grid-cols-3 gap-4 sm:overflow-visible pb-2 sm:pb-0">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="snap-start shrink-0 w-[85vw] sm:w-auto bg-background border border-border rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                >
                  <p className="text-sm text-text leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="text-sm font-semibold text-text">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted mt-6 font-medium">
              Mais de <span className="text-brand font-bold">1.000 links gerados</span>
            </p>
          </div>
        </section>

        {/* Generator — above the fold anchor */}
        <section id="gerador" className="max-w-3xl mx-auto px-4 py-12 animate-on-scroll">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-text mb-6">Gerar link UTM</h2>
            <UTMGenerator
              showUpgradeModal={() => setShowModal(true)}
              showLoginPrompt={() => setShowLoginModal(true)}
            />
          </div>
        </section>

        {/* Benefits */}
        <div className="bg-background animate-on-scroll">
          <Benefits />
        </div>

        {/* AdSense — entre benefícios e planos */}
        <div className="max-w-4xl mx-auto px-4">
          <AdSenseBlock slot="home-mid" />
        </div>

        {/* Como funciona */}
        <section className="py-16 px-4 bg-white animate-on-scroll">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-text mb-10">Como funciona</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Cole a URL da sua página", desc: "Adicione o endereço da página de destino da campanha." },
                { step: "2", title: "Escolha a fonte e configure", desc: "Selecione a plataforma, defina a mídia e nomeie a campanha." },
                { step: "3", title: "Copie e compartilhe", desc: "Copie o link com 1 clique e envie direto para o seu cliente." },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand text-white font-bold text-lg flex items-center justify-center shadow-sm">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-text">{s.title}</h3>
                  <p className="text-muted text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <div className="animate-on-scroll">
          <PricingCards />
        </div>
      </div>

      {showModal && <UpgradeModal onClose={() => setShowModal(false)} />}
      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
      <ToastContainer />
    </>
  );
}
