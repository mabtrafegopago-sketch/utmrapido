import type { Metadata } from "next";
import Link from "next/link";
import { AdSenseBlock } from "@/components/marketing/AdSenseBlock";

export const metadata: Metadata = {
  title: "UTM para Google Ads: Manual vs Automático",
  description: "Entenda quando usar UTM manual e quando confiar no auto-tagging do Google Ads. Exemplos com ValueTrack parameters e como configurar tudo corretamente.",
  openGraph: {
    title: "UTM para Google Ads: manual vs automático, quando usar cada um",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "UTM para Google Ads: manual vs automático, quando usar cada um",
      "datePublished": "2025-01-01",
      "dateModified": "2026-05-22",
      "author": { "@type": "Organization", "name": "UTM Rápido" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "O que é GCLID?", "acceptedAnswer": { "@type": "Answer", "text": "GCLID (Google Click ID) é um identificador único adicionado automaticamente pelo Google Ads a cada clique quando o auto-tagging está ativado. Ele permite a importação de conversões e o relatório detalhado dentro do Google Analytics 4." } },
        { "@type": "Question", "name": "Devo usar UTM manual ou auto-tagging no Google Ads?", "acceptedAnswer": { "@type": "Answer", "text": "Se você usa somente Google Analytics 4, o auto-tagging (GCLID) é geralmente suficiente. Se você usa outras ferramentas de análise (como Pixel do Meta em comparação) ou precisa de dados em sistemas externos, os UTMs manuais com ValueTrack são mais flexíveis." } },
      ],
    },
  ],
};

export default function UTMParaGoogleAdsPage() {
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
          <span>UTM para Google Ads</span>
        </nav>

        <article>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4 leading-tight">
            UTM para Google Ads: manual vs automático, quando usar cada um
          </h1>
          <p className="text-muted text-sm mb-8">Atualizado em 22 de maio de 2026 · Leitura: ~8 minutos</p>

          <p className="text-lg text-muted leading-relaxed mb-4">
            Ao contrário do Meta Ads, o Google Ads tem um sistema nativo de rastreamento chamado auto-tagging (GCLID). Isso cria uma dúvida clássica para gestores de tráfego: devo usar UTMs manuais, confiar no auto-tagging ou usar os dois ao mesmo tempo? Neste guia você vai entender a diferença e quando usar cada abordagem.
          </p>

          <AdSenseBlock slot="article-top" />

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">O que é auto-tagging (GCLID)?</h2>
          <p className="text-muted leading-relaxed mb-4">
            Quando o auto-tagging está ativado no Google Ads (e está por padrão), o Google adiciona automaticamente um parâmetro <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">gclid</code> a cada URL clicada.
          </p>
          <div className="bg-gray-50 border border-border rounded-xl p-4 font-mono text-xs break-all mb-4">
            https://seusite.com.br?<span className="text-warning font-semibold">gclid</span>=<span className="text-muted">Cj0KCQjw0...</span>
          </div>
          <p className="text-muted leading-relaxed mb-6">
            Esse identificador único permite que o Google Analytics 4 reconheça automaticamente que o tráfego veio do Google Ads, qual campanha, grupo de anúncios e palavra-chave. Tudo isso sem você configurar nada manualmente.
          </p>

          <h2 className="text-2xl font-bold text-text mt-10 mb-6">Auto-tagging vs UTM manual: comparativo</h2>
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand text-white">
                  <th className="px-4 py-3 text-left rounded-tl-lg">Critério</th>
                  <th className="px-4 py-3 text-left">Auto-tagging (GCLID)</th>
                  <th className="px-4 py-3 text-left rounded-tr-lg">UTM Manual</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Configuração", "Zero — funciona automaticamente", "Manual em cada anúncio/campanha"],
                  ["Integração com GA4", "Nativa e completa", "Funciona, mas sem alguns dados exclusivos"],
                  ["Dados de keyword", "Automático (com permissão)", "Manual via utm_term ou ValueTrack"],
                  ["Funciona em outras ferramentas", "Somente Google", "Universal (Mixpanel, Hotjar, etc.)"],
                  ["Análise cross-channel", "Limitado ao Google", "Permite comparar todas as plataformas"],
                  ["Visibilidade da URL", "URL limpa para o usuário", "URL com parâmetros visíveis"],
                ].map(([c, a, b]) => (
                  <tr key={c} className="border-b border-border hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-text">{c}</td>
                    <td className="px-4 py-3 text-muted">{a}</td>
                    <td className="px-4 py-3 text-muted">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Quando usar UTM manual no Google Ads</h2>
          <div className="flex flex-col gap-3 mb-8">
            {[
              "Você usa ferramentas de análise além do GA4 (Mixpanel, Amplitude, Hotjar, etc.)",
              "Precisa rastrear campanhas em sistemas de CRM ou e-commerce que leem parâmetros de URL",
              "Quer comparar dados do Google Ads com Meta Ads usando o mesmo padrão de nomenclatura",
              "O cliente tem múltiplas contas do GA4 ou usa plataformas de BI que consomem UTMs",
              "Precisa rastrear cliques fora do ambiente Google (ex: links em e-mails pagos via Google)",
            ].map((item) => (
              <div key={item} className="flex gap-3 items-start bg-white rounded-xl border border-border p-4">
                <span className="text-success font-bold shrink-0">✓</span>
                <p className="text-muted text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          <AdSenseBlock slot="article-mid" />

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">ValueTrack Parameters — UTMs dinâmicos do Google</h2>
          <p className="text-muted leading-relaxed mb-4">
            Os <strong>ValueTrack parameters</strong> são variáveis que o Google substitui automaticamente com os dados reais da campanha no momento do clique. São como UTMs, mas preenchidos pelo Google.
          </p>
          <p className="text-muted leading-relaxed mb-4">Os mais usados:</p>
          <div className="flex flex-col gap-2 mb-6">
            {[
              { param: "{campaignid}", desc: "ID numérico da campanha" },
              { param: "{adgroupid}", desc: "ID numérico do grupo de anúncios" },
              { param: "{keyword}", desc: "Palavra-chave que acionou o anúncio" },
              { param: "{matchtype}", desc: "Tipo de correspondência (e=exata, p=frase, b=ampla)" },
              { param: "{network}", desc: "Rede onde o anúncio exibiu (g=pesquisa, d=display, yt=YouTube)" },
              { param: "{device}", desc: "Dispositivo do usuário (m=mobile, t=tablet, c=computador)" },
              { param: "{adposition}", desc: "Posição do anúncio na página" },
            ].map((vt) => (
              <div key={vt.param} className="flex items-center gap-3 bg-white rounded-xl border border-border px-4 py-3">
                <code className="bg-brand-light text-brand font-mono text-xs px-2 py-1 rounded shrink-0">{vt.param}</code>
                <span className="text-muted text-sm">{vt.desc}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Exemplo de template UTM com ValueTrack</h2>
          <p className="text-muted leading-relaxed mb-4">
            Este é um template que você pode usar no <strong>Modelo de acompanhamento</strong> do Google Ads (nível de conta, campanha ou anúncio):
          </p>
          <div className="bg-gray-50 border border-border rounded-xl p-4 font-mono text-xs break-all mb-6 leading-relaxed">
            <span className="text-muted">{"{"}</span>lpurl<span className="text-muted">{"}"}</span>
            <span className="text-muted">?</span>
            <span className="text-brand-dark">utm_source</span>=<span className="text-success">google</span>
            &amp;<span className="text-brand-dark">utm_medium</span>=<span className="text-success">cpc</span>
            &amp;<span className="text-brand-dark">utm_campaign</span>=<span className="text-warning">{"{campaign}"}</span>
            &amp;<span className="text-brand-dark">utm_content</span>=<span className="text-warning">{"{adgroupid}"}</span>
            &amp;<span className="text-brand-dark">utm_term</span>=<span className="text-warning">{"{keyword}"}</span>
          </div>
          <p className="text-xs text-muted mb-8">
            <strong>Nota:</strong> {"{lpurl}"} é substituído automaticamente pela URL de destino do anúncio. Use em Configurações de conta → Configurações de URL da conta.
          </p>

          <h2 className="text-2xl font-bold text-text mt-10 mb-4">Como configurar no Google Ads</h2>
          <div className="flex flex-col gap-4 mb-8">
            {[
              { step: "1", title: "Verifique se o auto-tagging está ativado", desc: "Vá em Configurações da conta → Auto-tagging. Confirme que está ativado (é o padrão). Isso não impede o uso de UTMs adicionais." },
              { step: "2", title: "Adicione o modelo de acompanhamento", desc: "Você pode adicionar no nível de conta (aplica a tudo), campanha, grupo de anúncios ou anúncio específico. Use o modelo acima com ValueTrack." },
              { step: "3", title: "Ou adicione UTMs manualmente em cada anúncio", desc: "No URL final do anúncio, adicione os parâmetros após o ? com valores fixos. Ex: ?utm_source=google&utm_medium=cpc&utm_campaign=nome_campanha" },
              { step: "4", title: "Teste com o verificador de URL do Google", desc: "Use a ferramenta 'Verificar URL' no Google Ads para confirmar que os parâmetros estão sendo passados corretamente antes de ativar a campanha." },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 bg-white rounded-xl border border-border p-4">
                <div className="w-8 h-8 rounded-full bg-brand text-white font-bold text-sm flex items-center justify-center shrink-0">{s.step}</div>
                <div>
                  <p className="font-semibold text-text text-sm mb-1">{s.title}</p>
                  <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-text mt-10 mb-6">Dúvidas frequentes</h2>
          <div className="flex flex-col gap-4 mb-8">
            {[
              { q: "O que é GCLID?", a: "GCLID (Google Click ID) é um identificador único adicionado automaticamente pelo Google Ads quando o auto-tagging está ativo. Ele permite importação de conversões e relatórios detalhados no GA4." },
              { q: "Posso usar UTM manual e auto-tagging ao mesmo tempo?", a: "Sim. O Google Ads suporta ambos. O GCLID e os UTMs coexistem na URL sem conflito." },
              { q: "Se eu sobrescrever utm_source=google, o GA4 ainda reconhece como Google Ads?", a: "Sim, desde que o auto-tagging esteja ativo e a conta do GA4 esteja vinculada ao Google Ads. O GCLID garante a atribuição mesmo com UTMs customizados." },
              { q: "Devo usar o mesmo padrão de UTM que uso no Meta Ads?", a: "Sim. Ter uma convenção unificada (mesmos valores para medium, mesmo formato de campaign) facilita a análise cross-channel e a comparação entre plataformas no GA4." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-border p-5">
                <p className="font-semibold text-text mb-2">{faq.q}</p>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <AdSenseBlock slot="article-bottom" />

          <div className="bg-brand rounded-2xl p-8 text-center text-white mt-10">
            <h2 className="text-2xl font-bold mb-2">Gere seus UTMs para Google Ads agora</h2>
            <p className="text-white/80 mb-6 text-sm">
              Presets para Google Ads, validação automática e histórico organizado por cliente.
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
