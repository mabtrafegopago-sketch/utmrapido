import type { Metadata } from "next";
import Link from "next/link";
import { AdSenseBlock } from "@/components/marketing/AdSenseBlock";

export const metadata: Metadata = {
  title: "O que é UTM? Guia Completo 2025",
  description: "Entenda o que é UTM, para que serve, quais são os 5 parâmetros e como criar links UTM rastreáveis para suas campanhas. Guia completo com exemplos práticos em PT-BR.",
  openGraph: {
    title: "O que é UTM? Guia completo para iniciantes e gestores de tráfego",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "O que é UTM? Guia completo para iniciantes e gestores de tráfego",
      "description": "Entenda o que é UTM, quais são os 5 parâmetros e como criar links rastreáveis para suas campanhas.",
      "datePublished": "2025-01-01",
      "dateModified": "2026-05-22",
      "author": { "@type": "Organization", "name": "UTM Rápido" },
      "publisher": { "@type": "Organization", "name": "UTM Rápido", "url": "https://utmrapido.com.br" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "O que significa UTM?", "acceptedAnswer": { "@type": "Answer", "text": "UTM significa Urchin Tracking Module. É um conjunto de parâmetros adicionados à URL de destino para rastrear a origem do tráfego no Google Analytics." } },
        { "@type": "Question", "name": "Quais são os 5 parâmetros UTM?", "acceptedAnswer": { "@type": "Answer", "text": "Os 5 parâmetros são: utm_source (origem), utm_medium (mídia), utm_campaign (campanha), utm_content (conteúdo) e utm_term (palavra-chave)." } },
        { "@type": "Question", "name": "UTM quebra o link?", "acceptedAnswer": { "@type": "Answer", "text": "Não. Os parâmetros UTM são adicionados após o ? na URL e não afetam o funcionamento da página. O usuário chega ao mesmo destino, mas o Analytics registra de onde ele veio." } },
      ],
    },
  ],
};

export default function OQueEUTMPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-6">
          <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          {" › "}
          <span>O que é UTM?</span>
        </nav>

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4 leading-tight">
            O que é UTM? Guia completo para iniciantes e gestores de tráfego
          </h1>

          <p className="text-muted text-sm mb-8">
            Atualizado em 22 de maio de 2026 · Leitura: ~8 minutos
          </p>

          <p className="text-lg text-muted leading-relaxed mb-4">
            Se você trabalha com tráfego pago ou marketing digital, provavelmente já ouviu falar em UTM. Mas o que é exatamente um link UTM, para que ele serve e como criar um do jeito certo? Neste guia completo, você vai entender tudo isso com exemplos práticos, direto ao ponto.
          </p>

          <AdSenseBlock slot="article-top" />

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">O que significa UTM?</h2>
          <p className="text-muted leading-relaxed mb-4">
            UTM vem de <strong>Urchin Tracking Module</strong>. O nome pode parecer estranho — e é mesmo. Vem do software de análise de dados "Urchin", que foi comprado pelo Google em 2005 e se tornou o Google Analytics. A tecnologia de rastreamento por parâmetros de URL foi herdada dessa plataforma.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            Na prática, um UTM é um conjunto de parâmetros (informações extras) que você adiciona ao final de qualquer URL. Esses parâmetros dizem ao Google Analytics <em>de onde veio</em> cada visitante — se veio de um anúncio no Meta Ads, de uma campanha de e-mail, de um post orgânico no Instagram ou de qualquer outra fonte.
          </p>

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Por que usar UTM?</h2>
          <p className="text-muted leading-relaxed mb-4">
            Sem UTM, o Google Analytics agrupa visitantes em categorias genéricas como "direct" (acesso direto) ou "social" (redes sociais). Você não sabe se aquela venda veio do anúncio de vídeo ou do banner estático. Não sabe se foi a campanha de inverno ou a de lançamento que performou melhor.
          </p>
          <p className="text-muted leading-relaxed mb-4">
            Com UTM, você vê exatamente:
          </p>
          <ul className="list-disc pl-6 text-muted leading-relaxed mb-6 flex flex-col gap-2">
            <li>Qual campanha gerou mais conversões</li>
            <li>Qual plataforma (Meta, Google, TikTok) trouxe mais receita</li>
            <li>Qual anúncio específico teve melhor custo por resultado</li>
            <li>Se o e-mail marketing gerou mais vendas que o tráfego pago</li>
          </ul>

          <h2 className="text-2xl font-bold text-text mt-10 mb-6">Os 5 parâmetros UTM explicados</h2>
          <p className="text-muted leading-relaxed mb-6">
            Existem 5 parâmetros UTM padrão. Os três primeiros são os mais importantes e devem estar em praticamente todo link rastreado.
          </p>

          {[
            {
              param: "utm_source",
              obrigatorio: true,
              desc: "Identifica de onde vem o tráfego — o canal ou plataforma que originou o clique.",
              exemplos: ["google", "facebook", "instagram", "newsletter", "tiktok"],
            },
            {
              param: "utm_medium",
              obrigatorio: true,
              desc: "Indica o tipo de mídia ou canal de marketing utilizado.",
              exemplos: ["cpc", "social", "email", "banner", "video", "organic"],
            },
            {
              param: "utm_campaign",
              obrigatorio: true,
              desc: "Nome da campanha, promoção ou iniciativa específica.",
              exemplos: ["black_friday_2025", "lancamento_curso", "remarketing_abandono"],
            },
            {
              param: "utm_content",
              obrigatorio: false,
              desc: "Diferencia elementos dentro da mesma campanha. Muito útil para testes A/B de criativos.",
              exemplos: ["banner_topo", "botao_verde", "variante_a", "video_30s"],
            },
            {
              param: "utm_term",
              obrigatorio: false,
              desc: "Registra a palavra-chave paga que acionou o anúncio. Usado principalmente em campanhas de pesquisa paga.",
              exemplos: ["gestor_de_trafego", "curso_marketing", "agencia_digital"],
            },
          ].map((p) => (
            <div key={p.param} className="mb-5 bg-white rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-2">
                <code className="bg-brand-light text-brand font-mono text-sm px-3 py-1 rounded-lg font-semibold">
                  {p.param}
                </code>
                {p.obrigatorio ? (
                  <span className="text-xs bg-green-100 text-success font-semibold px-2 py-0.5 rounded-full">Obrigatório</span>
                ) : (
                  <span className="text-xs bg-gray-100 text-muted font-semibold px-2 py-0.5 rounded-full">Opcional</span>
                )}
              </div>
              <p className="text-muted text-sm mb-3">{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.exemplos.map((ex) => (
                  <code key={ex} className="text-xs bg-gray-50 border border-border px-2 py-1 rounded-md text-muted font-mono">
                    {ex}
                  </code>
                ))}
              </div>
            </div>
          ))}

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Como um link UTM fica na prática?</h2>
          <p className="text-muted leading-relaxed mb-4">
            Aqui está um exemplo completo de link UTM para uma campanha de tráfego pago no Meta Ads:
          </p>
          <div className="bg-gray-50 border border-border rounded-xl p-4 font-mono text-xs sm:text-sm break-all mb-6 leading-relaxed">
            <span className="text-gray-700">https://seusite.com.br/oferta</span>
            <span className="text-muted">?</span>
            <span className="text-brand-dark font-semibold">utm_source</span>
            <span className="text-muted">=</span>
            <span className="text-success">facebook</span>
            <span className="text-muted">&amp;</span>
            <span className="text-brand-dark font-semibold">utm_medium</span>
            <span className="text-muted">=</span>
            <span className="text-success">cpc</span>
            <span className="text-muted">&amp;</span>
            <span className="text-brand-dark font-semibold">utm_campaign</span>
            <span className="text-muted">=</span>
            <span className="text-success">black_friday_2025</span>
          </div>

          <AdSenseBlock slot="article-mid" />

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Erros mais comuns ao criar links UTM</h2>

          <div className="flex flex-col gap-4 mb-8">
            {[
              { erro: "Usar espaços nos valores", solucao: "Use underline (_) ou hífen (-). Espaços podem quebrar a URL ou aparecer como %20 no Analytics." },
              { erro: "Misturar maiúsculas e minúsculas", solucao: '"facebook" e "Facebook" são valores diferentes no Analytics. Use sempre minúsculas.' },
              { erro: "Não padronizar os valores entre a equipe", solucao: 'Crie uma convenção: "meta" ou "facebook"? "cpc" ou "pago"? Documente e siga.' },
              { erro: "Não usar UTM em campanhas pagas", solucao: "Sem UTM, o Meta Ads aparece como 'direct' ou 'social' no Analytics — você perde dados valiosos." },
              { erro: "Criar links UTM duplicados ou com erros de digitação", solucao: "Use uma ferramenta como o UTM Rápido que valida e formata automaticamente." },
            ].map((item) => (
              <div key={item.erro} className="flex gap-3 bg-white rounded-xl border border-border p-4">
                <span className="text-xl shrink-0">⚠️</span>
                <div>
                  <p className="font-semibold text-text text-sm mb-1">{item.erro}</p>
                  <p className="text-muted text-sm leading-relaxed">{item.solucao}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Como ver os dados de UTM no GA4</h2>
          <p className="text-muted leading-relaxed mb-4">
            No Google Analytics 4, os dados de UTM aparecem em <strong>Relatórios → Aquisição → Aquisição de tráfego</strong>. Você verá colunas como:
          </p>
          <ul className="list-disc pl-6 text-muted leading-relaxed mb-6 flex flex-col gap-2">
            <li><strong>Origem/mídia da sessão</strong>: combina utm_source e utm_medium (ex: facebook/cpc)</li>
            <li><strong>Campanha da sessão</strong>: valor do utm_campaign</li>
            <li><strong>Conteúdo do anúncio</strong>: valor do utm_content</li>
          </ul>
          <p className="text-muted leading-relaxed mb-6">
            Para ver por campanha, acesse <strong>Relatórios → Aquisição → Campanhas de marketing</strong> ou crie um relatório customizado no Explorer.
          </p>

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Convenção de nomenclatura recomendada</h2>
          <p className="text-muted leading-relaxed mb-4">
            Uma boa convenção de nomenclatura é essencial para manter o histórico organizado e comparar campanhas ao longo do tempo. A recomendação do UTM Rápido:
          </p>
          <div className="bg-brand-light border border-[#C4C0F0] rounded-xl p-5 mb-6">
            <ul className="flex flex-col gap-2 text-sm">
              <li><strong>source:</strong> nome da plataforma em minúsculas (google, facebook, instagram, tiktok)</li>
              <li><strong>medium:</strong> tipo de mídia (cpc, social, email, organic, video)</li>
              <li><strong>campaign:</strong> nome_da_campanha_com_underline_e_data (black_friday_2025)</li>
              <li><strong>content:</strong> criativo_ou_variante (banner_quadrado, carrossel_v2)</li>
              <li><strong>term:</strong> palavra_chave_exata (para Google Ads)</li>
            </ul>
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-bold text-text mt-10 mb-6">Perguntas frequentes sobre UTM</h2>
          <div className="flex flex-col gap-4 mb-8">
            {[
              { q: "UTM quebra o link?", a: "Não. Os parâmetros UTM são adicionados após o ? na URL e não afetam o funcionamento da página. O usuário chega ao mesmo destino normalmente." },
              { q: "Preciso usar UTM no Google Ads?", a: "O Google Ads tem o auto-tagging (GCLID) que funciona automaticamente. Mas em muitos casos usar UTM manualmente ou em paralelo dá mais controle sobre os dados no GA4." },
              { q: "UTM funciona no Instagram?", a: "Sim. UTM funciona em qualquer link que leve para um site que tenha o GA4 instalado. Funciona em bio do Instagram, anúncios, stories com link, etc." },
              { q: "Qual é a diferença entre utm_source e utm_medium?", a: "Source é a origem (de onde veio: facebook, google). Medium é o canal (como veio: cpc, organic, email). Uma analogia: source é o jornal, medium é se foi impresso ou digital." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-border p-5">
                <p className="font-semibold text-text mb-2">{faq.q}</p>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <AdSenseBlock slot="article-bottom" />

          {/* CTA */}
          <div className="bg-brand rounded-2xl p-8 text-center text-white mt-10">
            <h2 className="text-2xl font-bold mb-2">Crie seus links UTM agora</h2>
            <p className="text-white/80 mb-6 text-sm">
              Gerador gratuito com validação automática, presets por plataforma e histórico organizado por cliente.
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
