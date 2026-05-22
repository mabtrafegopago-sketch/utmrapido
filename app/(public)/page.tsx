"use client";

import { useState } from "react";
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

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <div className="bg-background">
        {/* Hero */}
        <Hero />

        {/* Generator — above the fold anchor */}
        <section id="gerador" className="max-w-3xl mx-auto px-4 pb-12">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-text mb-6">Gerar link UTM</h2>
            <UTMGenerator
              showUpgradeModal={() => setShowModal(true)}
              showLoginPrompt={() => setShowLoginModal(true)}
            />
          </div>
        </section>

        {/* Benefits */}
        <div className="bg-background">
          <Benefits />
        </div>

        {/* AdSense — entre benefícios e planos */}
        <div className="max-w-4xl mx-auto px-4">
          <AdSenseBlock slot="home-mid" />
        </div>

        {/* How it works */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-text mb-10">Como funciona</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Cole sua URL", desc: "Adicione o endereço da página de destino da campanha." },
                { step: "2", title: "Escolha os parâmetros", desc: "Selecione a fonte, mídia e nomeie a campanha." },
                { step: "3", title: "Copie ou salve", desc: "Copie com 1 clique ou salve no histórico organizando por cliente." },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand text-white font-bold text-lg flex items-center justify-center">
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
        <PricingCards />
      </div>

      {showModal && <UpgradeModal onClose={() => setShowModal(false)} />}
      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}
      <ToastContainer />
    </>
  );
}
