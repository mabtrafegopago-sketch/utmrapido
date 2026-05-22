"use client";

import { useState } from "react";

interface ParamTooltipProps {
  param: string;
  description: string;
  example: string;
}

export function ParamTooltip({ param, description, example }: ParamTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center hover:bg-brand-light hover:text-brand transition-colors focus:outline-none"
        aria-label={`Ajuda sobre ${param}`}
      >
        ?
      </button>

      {open && (
        <div className="absolute left-6 top-0 z-20 w-64 bg-white border border-border rounded-xl shadow-lg p-3 text-xs text-text">
          <p className="font-semibold text-brand mb-1">{param}</p>
          <p className="text-muted mb-2 leading-relaxed">{description}</p>
          <p className="bg-brand-light rounded-md px-2 py-1 font-mono text-brand break-all">
            {example}
          </p>
        </div>
      )}
    </div>
  );
}

export const PARAM_TOOLTIPS = {
  utm_source: {
    param: "utm_source",
    description: "De onde vem o tráfego. Identifica o canal ou plataforma que gerou a visita.",
    example: "google, facebook, instagram, newsletter",
  },
  utm_medium: {
    param: "utm_medium",
    description: "Qual o tipo de mídia ou canal de marketing.",
    example: "cpc, social, email, banner, video",
  },
  utm_campaign: {
    param: "utm_campaign",
    description: "Nome da campanha ou promoção específica.",
    example: "black_friday_2025, lancamento_curso",
  },
  utm_content: {
    param: "utm_content (opcional)",
    description: "Diferencia elementos dentro de uma mesma campanha. Útil para testes A/B.",
    example: "banner_topo, botao_verde, variante_a",
  },
  utm_term: {
    param: "utm_term (opcional)",
    description: "Palavra-chave paga que acionou o anúncio. Usado principalmente em Google Ads.",
    example: "gestao_de_trafego, curso_marketing",
  },
} as const;
