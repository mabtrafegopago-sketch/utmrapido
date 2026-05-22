import type { Metadata } from "next";
import Link from "next/link";
import { AdSenseBlock } from "@/components/marketing/AdSenseBlock";

export const metadata: Metadata = {
  title: "UTM para Meta Ads: Guia Completo com Exemplos",
  description: "Aprenda como configurar UTMs no Meta Ads (Facebook e Instagram). Exemplos práticos para campanhas de conversão, tráfego e remarketing. Como ver os dados no GA4.",
  openGraph: {
    title: "UTM para Meta Ads: guia completo com exemplos práticos",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "UTM para Meta Ads: guia completo com exemplos práticos",
      "datePublished": "2025-01-01",
      "dateModified": "2026-05-22",
      "author": { "@type": "Organization", "name": "UTM Rápido" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Preciso de UTM se já uso o Pixel do Meta?", "acceptedAnswer": { "@type": "Answer", "text": "Sim. O Pixel rastreia eventos dentro do Meta (cliques, conversões reportadas pelo Meta). O UTM rastreia no Google Analytics o que acontece após o clique no seu site — e reconcilia dados entre plataformas." } },
        { "@type": "Question", "name": "utm_source deve ser 'facebook' ou 'meta'?", "acceptedAnswer": { "@type": "Answer", "text": "Depende da sua convenção. 'facebook' é o padrão histórico mais comum. 'meta' é mais preciso para campanhas que rodam em Facebook e Instagram simultaneamente. O mais importante é ser consistente dentro da equipe." } },
      ],
    },
  ],
};

const EXEMPLOS = [
  {
    tipo: "Campanha de conversão",
    objetivo: "Vendas de produto",
    source: "facebook",
    medium: "cpc",
    campaign: "conversao_produto_jan2026",
    content: "video_30s",
  },
  {
    tipo: "Campanha de tráfego",
    objetivo: "Visitantes para blog",
    source: "instagram",
    medium: "social",
    campaign: "trafego_blog_fev2026",
    content: "stories_swipe",
  },
  {
    tipo: "Remarketing",
    objetivo: "Recuperar abandono de carrinho",
    source: "facebook",
    medium: "cpc",
    campaign: "remarketing_carrinho_2026",
    content: "carrossel_produtos",
  },
];

export default function UTMParaMetaAdsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-brand">Home</Link>
          {" › "}
          <Link href="/o-que-e-utm" className="hover:text-brand">O que é UTM?</Link>
          {" › "}
          <span>UTM para Meta Ads</span>
        </nav>

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4 leading-tight">
            UTM para Meta Ads: guia completo com exemplos práticos
          </h1>
          <p className="text-muted text-sm mb-8">Atualizado em 22 de maio de 2026 · Leitura: ~7 minutos</p>

          <p className="text-lg text-muted leading-relaxed mb-4">
            Muitos gestores de tráfego acham que o Pixel do Meta já é suficiente para rastrear suas campanhas. Mas há uma diferença crucial: o Pixel reporta dados de dentro do Meta, enquanto os UTMs mostram o que acontece no seu site, pelo Google Analytics. Neste guia, você aprende como combinar os dois do jeito certo.
          </p>

          <AdSenseBlock slot="article-top" />

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Por que usar UTM no Meta Ads se já tenho o Pixel?</h2>
          <p className="text-muted leading-relaxed mb-4">
            O <strong>Pixel do Meta</strong> rastreia eventos que acontecem dentro do ecossistema do Meta: cliques no anúncio, visualizações, conversões reportadas pela plataforma. O problema é que esses dados são proprietários — o Meta tem interesse em mostrar que seus anúncios performam bem.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            Já o <strong>Google Analytics com UTM</strong> rastreia o que acontece no seu site depois do clique: sessões reais, páginas visitadas, tempo no site, conversões no funil. É um dado independente que você controla.
          </p>
          <p className="text-muted leading-relaxed mb-6">
            A combinação ideal é usar as duas ferramentas em paralelo: o Meta Ads para otimização e o GA4 com UTMs para análise cross-channel e atribuição real.
          </p>

          <h2 className="text-2xl font-bold text-text mt-10 mb-6">Convenção recomendada para Meta Ads</h2>
          <div className="bg-brand-light border border-[#C4C0F0] rounded-xl p-5 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><span className="font-semibold text-brand">utm_source:</span> <span className="text-muted">facebook <em>ou</em> instagram (conforme a plataforma)</span></div>
              <div><span className="font-semibold text-brand">utm_medium:</span> <span className="text-muted">cpc (pago) ou social (orgânico)</span></div>
              <div><span className="font-semibold text-brand">utm_campaign:</span> <span className="text-muted">objetivo_produto_mes (ex: conversao_calca_jan26)</span></div>
              <div><span className="font-semibold text-brand">utm_content:</span> <span className="text-muted">formato_variante (ex: video_30s, carrossel_v2)</span></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-text mt-10 mb-6">Exemplos práticos por tipo de campanha</h2>
          {EXEMPLOS.map((ex) => (
            <div key={ex.tipo} className="mb-5 bg-white rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full">{ex.tipo}</span>
                <span className="text-xs text-muted">{ex.objetivo}</span>
              </div>
              <div className="font-mono text-xs bg-gray-50 border border-border rounded-lg p-3 break-all leading-relaxed">
                <span className="text-gray-700">https://seusite.com.br/pagina</span>
                <span className="text-muted">?utm_source=</span>
                <span className="text-success">{ex.source}</span>
                <span className="text-muted">&amp;utm_medium=</span>
                <span className="text-success">{ex.medium}</span>
                <span className="text-muted">&amp;utm_campaign=</span>
                <span className="text-success">{ex.campaign}</span>
                <span className="text-muted">&amp;utm_content=</span>
                <span className="text-success">{ex.content}</span>
              </div>
            </div>
          ))}

          <AdSenseBlock slot="article-mid" />

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Como adicionar UTM nos anúncios do Meta</h2>
          <div className="flex flex-col gap-4 mb-8">
            {[
              { step: "1", title: "No Gerenciador de Anúncios, vá até o nível de anúncio", desc: "Edite o anúncio ou crie um novo. Na seção 'Destino', procure pelo campo 'Parâmetros de URL'." },
              { step: "2", title: "Cole os parâmetros UTM no campo", desc: "Você pode colar apenas os parâmetros (sem o ?), assim: utm_source=facebook&utm_medium=cpc&utm_campaign=nome" },
              { step: "3", title: "Use variáveis dinâmicas do Meta (opcional)", desc: "O Meta permite usar {{campaign.name}} e {{adset.name}} para preencher automaticamente. Cuidado: esses valores têm espaços — prefira nomes manuais padronizados." },
              { step: "4", title: "Verifique o preview do link", desc: "Antes de publicar, confira se a URL completa está correta no preview do anúncio." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 bg-white rounded-xl border border-border p-4">
                <div className="w-8 h-8 rounded-full bg-brand text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-text text-sm mb-1">{s.title}</p>
                  <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Como ver os dados no GA4</h2>
          <p className="text-muted leading-relaxed mb-4">
            Após configurar os UTMs e ter tráfego, acesse no GA4:
          </p>
          <ul className="list-disc pl-6 text-muted leading-relaxed mb-6 flex flex-col gap-2">
            <li><strong>Relatórios → Aquisição → Aquisição de tráfego</strong>: veja a coluna "Origem/mídia da sessão" com facebook/cpc e instagram/cpc separados</li>
            <li><strong>Relatórios → Aquisição → Campanhas de marketing</strong>: filtre por utm_campaign para comparar campanhas</li>
            <li><strong>Explorar → Formato livre</strong>: crie análises customizadas cruzando utm_content com conversões para saber qual criativo performa melhor</li>
          </ul>

          <h2 className="text-2xl font-bold text-text mt-10 mb-6">Dúvidas frequentes</h2>
          <div className="flex flex-col gap-4 mb-8">
            {[
              { q: "Preciso de UTM se já uso o Pixel do Meta?", a: "Sim. O Pixel rastreia dentro do Meta. O UTM rastreia no GA4 o que acontece no seu site — são dados complementares e independentes." },
              { q: "utm_source deve ser 'facebook' ou 'meta'?", a: "Depende da convenção da equipe. 'facebook' é o padrão histórico mais usado. 'meta' é mais preciso para campanhas que rodam em Facebook e Instagram ao mesmo tempo. O mais importante é ser consistente." },
              { q: "Posso usar UTM no Instagram?", a: "Sim. O Instagram faz parte do Meta Ads. Use utm_source=instagram para campanhas que rodam especificamente no Instagram." },
              { q: "UTM funciona em campanhas de WhatsApp?", a: "O UTM vai para a URL de destino. Se o anúncio redireciona para o WhatsApp, não há rastreamento de URL. Se o anúncio vai para uma landing page, o UTM funciona normalmente." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-border p-5">
                <p className="font-semibold text-text mb-2">{faq.q}</p>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <AdSenseBlock slot="article-bottom" />

          <div className="bg-brand rounded-2xl p-8 text-center text-white mt-10">
            <h2 className="text-2xl font-bold mb-2">Gere seus UTMs para Meta Ads agora</h2>
            <p className="text-white/80 mb-6 text-sm">
              Presets para Facebook e Instagram, validação automática e histórico por cliente.
            </p>
            <Link
              href="/#gerador"
              className="inline-block bg-white text-brand font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Usar o gerador grátis →
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
