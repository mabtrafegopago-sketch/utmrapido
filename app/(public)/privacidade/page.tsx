import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | UTM Rápido",
  description:
    "Saiba como o UTM Rápido coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text mb-2">Política de Privacidade</h1>
      <p className="text-sm text-muted mb-10">Última atualização: maio de 2026</p>

      <div className="flex flex-col gap-10 text-text">

        {/* 1. Introdução */}
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Introdução</h2>
          <p className="text-muted leading-relaxed">
            O <strong>UTM Rápido</strong> ("nós", "nosso") respeita a sua privacidade e está comprometido
            com a proteção dos seus dados pessoais. Esta Política de Privacidade descreve como coletamos,
            usamos, armazenamos e protegemos as informações dos usuários do site{" "}
            <strong>utmrapido.com.br</strong>, em conformidade com a Lei Geral de Proteção de Dados
            Pessoais (LGPD — Lei nº 13.709/2018).
          </p>
        </section>

        {/* 2. Dados coletados */}
        <section>
          <h2 className="text-xl font-semibold mb-3">2. Dados que coletamos</h2>
          <p className="text-muted leading-relaxed mb-4">
            Coletamos apenas os dados necessários para o funcionamento da plataforma:
          </p>
          <ul className="flex flex-col gap-3">
            <li className="bg-white border border-border rounded-xl p-4">
              <p className="font-medium text-sm mb-1">Nome e endereço de e-mail</p>
              <p className="text-muted text-sm leading-relaxed">
                Obtidos via autenticação Google OAuth no momento do cadastro ou login. Utilizamos
                apenas os dados que o Google disponibiliza com sua permissão explícita.
              </p>
            </li>
            <li className="bg-white border border-border rounded-xl p-4">
              <p className="font-medium text-sm mb-1">Links UTM gerados</p>
              <p className="text-muted text-sm leading-relaxed">
                Armazenamos os links UTM que você cria dentro da plataforma para exibir seu
                histórico e permitir o gerenciamento de campanhas.
              </p>
            </li>
            <li className="bg-white border border-border rounded-xl p-4">
              <p className="font-medium text-sm mb-1">Dados de uso e navegação</p>
              <p className="text-muted text-sm leading-relaxed">
                Coletamos dados agregados de comportamento no site (páginas visitadas, cliques,
                tempo de sessão) por meio do Google Analytics e Google Tag Manager para melhorar
                a experiência da plataforma.
              </p>
            </li>
          </ul>
        </section>

        {/* 3. Como usamos os dados */}
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Como usamos seus dados</h2>
          <p className="text-muted leading-relaxed mb-4">Seus dados são utilizados exclusivamente para:</p>
          <ul className="flex flex-col gap-2 text-muted text-sm list-disc list-inside leading-relaxed">
            <li>Autenticar sua identidade e manter sua sessão ativa;</li>
            <li>Salvar e exibir os links UTM que você cria;</li>
            <li>Enviar comunicações relacionadas ao serviço, como confirmações de conta;</li>
            <li>Analisar métricas de uso agregadas para melhorar a plataforma;</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>
          <p className="text-muted text-sm leading-relaxed mt-4">
            Não vendemos, alugamos nem compartilhamos seus dados pessoais com terceiros para fins
            comerciais ou de marketing.
          </p>
        </section>

        {/* 4. Cookies e rastreamento */}
        <section>
          <h2 className="text-xl font-semibold mb-3">4. Cookies e rastreamento</h2>
          <p className="text-muted leading-relaxed mb-4">
            Utilizamos cookies e tecnologias similares para garantir o funcionamento do site e
            coletar métricas de uso:
          </p>
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="font-medium text-sm mb-1">Cookies essenciais</p>
              <p className="text-muted text-sm leading-relaxed">
                Necessários para manter sua sessão autenticada. Sem eles, a plataforma não funciona
                corretamente.
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="font-medium text-sm mb-1">Google Analytics (GA4)</p>
              <p className="text-muted text-sm leading-relaxed">
                Coletamos dados de navegação de forma anônima para entender como os usuários
                utilizam a plataforma. Os dados são enviados para servidores do Google e tratados
                conforme a{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  Política de Privacidade do Google
                </a>
                .
              </p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="font-medium text-sm mb-1">Google Tag Manager (GTM)</p>
              <p className="text-muted text-sm leading-relaxed">
                Utilizamos o GTM para gerenciar a implementação do Google Analytics e eventuais
                outras tags de rastreamento de forma centralizada.
              </p>
            </div>
          </div>
          <p className="text-muted text-sm leading-relaxed mt-4">
            Você pode bloquear cookies a qualquer momento nas configurações do seu navegador. Isso
            pode impactar algumas funcionalidades do site.
          </p>
        </section>

        {/* 5. Compartilhamento de dados */}
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Compartilhamento de dados</h2>
          <p className="text-muted leading-relaxed mb-3">
            Seus dados podem ser compartilhados com os seguintes prestadores de serviço, estritamente
            para viabilizar o funcionamento da plataforma:
          </p>
          <ul className="flex flex-col gap-2 text-muted text-sm list-disc list-inside leading-relaxed">
            <li>
              <strong>Supabase</strong> — banco de dados e autenticação (hospedagem dos seus dados e
              gerenciamento de sessão);
            </li>
            <li>
              <strong>Google LLC</strong> — autenticação via OAuth, Google Analytics e Google Tag
              Manager;
            </li>
            <li>
              <strong>Stripe</strong> — processamento seguro de pagamentos (para usuários do plano Pro).
            </li>
          </ul>
          <p className="text-muted text-sm leading-relaxed mt-3">
            Todos os prestadores de serviço são contratualmente obrigados a tratar seus dados com
            segurança e apenas para as finalidades especificadas.
          </p>
        </section>

        {/* 6. Retenção */}
        <section>
          <h2 className="text-xl font-semibold mb-3">6. Retenção de dados</h2>
          <p className="text-muted leading-relaxed">
            Mantemos seus dados pelo tempo necessário para a prestação do serviço ou pelo período
            exigido por lei. Ao excluir sua conta, seus dados pessoais e links UTM armazenados serão
            removidos dos nossos sistemas em até 30 dias, salvo obrigação legal de retenção.
          </p>
        </section>

        {/* 7. Direitos do usuário (LGPD) */}
        <section>
          <h2 className="text-xl font-semibold mb-3">7. Seus direitos (LGPD)</h2>
          <p className="text-muted leading-relaxed mb-4">
            Nos termos da LGPD, você tem os seguintes direitos sobre seus dados pessoais:
          </p>
          <ul className="flex flex-col gap-2 text-muted text-sm list-disc list-inside leading-relaxed">
            <li><strong>Acesso:</strong> solicitar uma cópia dos dados que temos sobre você;</li>
            <li><strong>Correção:</strong> solicitar a correção de dados incompletos ou incorretos;</li>
            <li><strong>Exclusão:</strong> solicitar a remoção dos seus dados pessoais;</li>
            <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado;</li>
            <li><strong>Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento;</li>
            <li><strong>Oposição:</strong> se opor ao tratamento dos seus dados em determinadas circunstâncias;</li>
            <li><strong>Informação:</strong> ser informado sobre os terceiros com quem compartilhamos seus dados.</li>
          </ul>
          <p className="text-muted text-sm leading-relaxed mt-4">
            Para exercer qualquer um desses direitos, entre em contato conosco pelo e-mail abaixo.
            Responderemos em até 15 dias úteis.
          </p>
        </section>

        {/* 8. Segurança */}
        <section>
          <h2 className="text-xl font-semibold mb-3">8. Segurança</h2>
          <p className="text-muted leading-relaxed">
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra
            acesso não autorizado, perda, destruição ou divulgação indevida. Isso inclui criptografia
            em trânsito (HTTPS/TLS), controles de acesso baseados em função (RLS no banco de dados)
            e autenticação segura via OAuth 2.0.
          </p>
        </section>

        {/* 9. Alterações */}
        <section>
          <h2 className="text-xl font-semibold mb-3">9. Alterações nesta política</h2>
          <p className="text-muted leading-relaxed">
            Podemos atualizar esta Política de Privacidade periodicamente. Quando fizermos alterações
            relevantes, notificaremos você por e-mail ou por aviso destacado na plataforma. A data
            da última atualização sempre estará indicada no topo desta página.
          </p>
        </section>

        {/* 10. Contato */}
        <section>
          <h2 className="text-xl font-semibold mb-3">10. Como entrar em contato</h2>
          <p className="text-muted leading-relaxed mb-4">
            Se tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos como
            titular de dados, entre em contato com o nosso Encarregado de Dados (DPO):
          </p>
          <div className="bg-brand-light border border-brand/20 rounded-xl p-5">
            <p className="font-semibold text-text mb-1">UTM Rápido</p>
            <p className="text-sm text-muted">
              E-mail:{" "}
              <a
                href="mailto:contato@utmrapido.com.br"
                className="text-brand hover:underline font-medium"
              >
                contato@utmrapido.com.br
              </a>
            </p>
            <p className="text-sm text-muted mt-1">Brasil</p>
          </div>
        </section>

      </div>
    </div>
  );
}
