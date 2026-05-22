export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "o-que-e-utm-e-por-que-usar",
    title: "O que é UTM e por que todo gestor de tráfego precisa usar",
    description: "Entenda o que é UTM, como funciona e por que nenhum gestor de tráfego profissional deveria trabalhar sem links rastreados.",
    date: "2026-05-01",
    readingTime: "7 min",
    content: `
## O problema de não rastrear suas campanhas

Imagine investir R$5.000 em anúncios no Meta Ads, no Google Ads e em uma campanha de e-mail ao mesmo tempo — e ao final do mês não saber qual canal gerou as vendas. Você renova o que? Corta o que? Sem dados, você está chutando.

Esse é o cenário de quem não usa UTM. E infelizmente é mais comum do que parece.

## O que é UTM?

UTM significa **Urchin Tracking Module**. São parâmetros adicionados ao final de uma URL que informam ao Google Analytics de onde veio cada visitante do seu site.

Quando alguém clica em um link com UTM, o Analytics registra automaticamente:
- De qual plataforma veio (Google, Facebook, e-mail...)
- Qual tipo de mídia (pago, orgânico, e-mail...)
- Qual campanha específica gerou o clique

## Os 5 parâmetros UTM

Existem 5 parâmetros possíveis. Os três primeiros são essenciais:

**utm_source** — A origem do tráfego. Exemplos: \`google\`, \`facebook\`, \`instagram\`, \`newsletter\`

**utm_medium** — O tipo de canal. Exemplos: \`cpc\`, \`social\`, \`email\`, \`organic\`

**utm_campaign** — O nome da campanha. Exemplos: \`black_friday_2025\`, \`lancamento_produto_jan\`

**utm_content** — Diferencia elementos dentro da mesma campanha (ótimo para testes A/B). Exemplos: \`banner_topo\`, \`video_30s\`

**utm_term** — Palavra-chave que acionou o anúncio (usado no Google Ads). Exemplos: \`gestor_trafego\`, \`marketing_digital\`

## Como fica um link UTM na prática?

Sem UTM:
\`\`\`
https://seusite.com.br/oferta
\`\`\`

Com UTM:
\`\`\`
https://seusite.com.br/oferta?utm_source=facebook&utm_medium=cpc&utm_campaign=black_friday_2025
\`\`\`

A URL de destino é a mesma. O usuário chega ao mesmo lugar. Mas agora você sabe de onde ele veio.

## Por que o gestor de tráfego precisa de UTM?

Se você gerencia campanhas para clientes, UTM é indispensável por três razões:

**1. Atribuição correta de resultados**
Sem UTM, uma venda aparece como "direct" no Analytics — acesso direto, sem origem identificada. Com UTM, você prova que aquela venda veio do seu anúncio específico.

**2. Otimização baseada em dados**
Você descobre que o Instagram gerou 3x mais conversões que o Facebook com o mesmo orçamento. Sem UTM, você nunca saberia isso.

**3. Relatórios para o cliente**
Um gestor profissional mostra dados, não achismos. O relatório mensal com dados de UTM é a diferença entre "parece que está funcionando" e "aqui está a prova de que está funcionando".

## Erros que destroem o rastreamento

- **Usar espaços** nos valores (use underline \`_\` ou hífen \`-\`)
- **Misturar maiúsculas e minúsculas** (\`Facebook\` e \`facebook\` são diferentes no Analytics)
- **Não padronizar** os valores entre a equipe (cada gestor escrevendo diferente)
- **Esquecer de adicionar UTM** em anúncios novos

## Como criar links UTM sem erro

O jeito mais rápido e seguro é usar um gerador que valida automaticamente, como o UTM Rápido. Você preenche os campos, ele constrói a URL correta, valida os caracteres e você copia com um clique.

Gestores que atendem vários clientes ainda têm a vantagem de salvar cada link com o cliente correspondente — sem planilha, sem caos.

## Conclusão

UTM não é opcional para quem trabalha com tráfego pago profissionalmente. É a base do rastreamento, da atribuição e dos relatórios que você entrega ao cliente. Sem UTM, você está voando às cegas.

Comece hoje: gere seu primeiro link UTM rastreado usando o gerador gratuito do UTM Rápido.
    `.trim(),
  },
  {
    slug: "como-organizar-utms-por-cliente",
    title: "Como organizar UTMs por cliente sem perder o controle",
    description: "Gestores que atendem múltiplos clientes precisam de um sistema para não misturar links. Veja a estratégia mais eficiente.",
    date: "2026-05-05",
    readingTime: "6 min",
    content: `
## O caos das planilhas de UTM

Se você atende mais de um cliente, provavelmente já passou por isso: abrir uma planilha de UTMs, não saber mais qual link é de qual cliente, encontrar duplicatas com nomes ligeiramente diferentes, e gastar 20 minutos procurando um link que você "sabe que criou semana passada".

Isso não é falta de organização sua. É falta de sistema.

## Por que planilhas não escalam

Planilhas funcionam para uma pessoa gerenciando um único cliente. Mas quando você tem 5, 10, 15 clientes, cada um com múltiplas campanhas ativas ao mesmo tempo, a planilha vira um pesadelo:

- Difícil de buscar por cliente específico
- Sem controle de versão (quem editou o quê?)
- Compartilhar com o cliente significa dar acesso à planilha inteira
- Sem validação — qualquer erro de digitação passa despercebido

## A estratégia certa para organizar UTMs por cliente

A organização começa **antes** de criar o link. Você precisa de um sistema que responda a três perguntas de forma instantânea:

1. Quais links existem para o cliente X?
2. O link da campanha Y do cliente X está correto?
3. Como o cliente X acessa os links dele?

### Passo 1: Crie um perfil por cliente

Cada cliente deve ter seu próprio espaço. Nome, cor identificadora, e-mail de contato. Não misture links de clientes diferentes no mesmo lugar.

### Passo 2: Padronize a nomenclatura de campanhas

Defina um padrão e documente. Sugestão:
- **utm_source**: sempre minúsculas, nome da plataforma (\`facebook\`, \`google\`, \`instagram\`)
- **utm_medium**: tipo de mídia (\`cpc\`, \`social\`, \`email\`)
- **utm_campaign**: objetivo + produto + mês (\`conversao_calca_jan26\`)
- **utm_content**: formato do criativo (\`video_30s\`, \`carrossel_v2\`)

Com esse padrão, qualquer link que você criar em 6 meses vai ser legível e comparável com os anteriores.

### Passo 3: Nomeie cada link de forma descritiva

O nome do link é o que você vai usar para encontrá-lo depois. Não use "link1" ou "campanha nova". Use:

*"Meta Ads — Conversão — Black Friday — Carrossel V2"*

Isso te diz imediatamente o canal, o objetivo, a campanha e o criativo.

### Passo 4: Crie um portal para o cliente

O cliente frequentemente precisa consultar os links das campanhas dele — especialmente para usar em posts orgânicos, bio do Instagram, etc. Se ele precisar te perguntar toda hora, você perde tempo.

A solução é um portal de acesso direto: uma URL única que o cliente abre e vê todos os links dele, organizados e prontos para copiar, sem precisar de login.

## O que acontece quando você tem sistema

Com um sistema funcionando:
- Você cria um link em 30 segundos, não em 5 minutos
- O cliente consulta os links sem te acionar
- Você exporta um relatório em CSV com um clique
- Novos colaboradores na equipe conseguem entender o histórico sem treinamento

## Ferramenta vs. processo

Nenhuma ferramenta resolve um processo ruim. Mas uma boa ferramenta amplifica um bom processo.

Se você já tem o hábito de nomear bem as campanhas e separar por cliente, o próximo passo é uma ferramenta que reforce esse hábito e tire a fricção de criar e buscar links.

O UTM Rápido foi construído exatamente para esse fluxo: crie o link, vincule ao cliente, acesse o histórico a qualquer momento, compartilhe com o cliente em segundos.
    `.trim(),
  },
  {
    slug: "utm-para-meta-ads-guia-pratico",
    title: "UTM para Meta Ads: guia prático com exemplos reais",
    description: "Como configurar UTMs no Meta Ads (Facebook e Instagram) com exemplos reais de campanhas e como ver os dados no GA4.",
    date: "2026-05-08",
    readingTime: "8 min",
    content: `
## Pixel do Meta vs UTM: qual a diferença?

Essa é a dúvida mais comum entre gestores de tráfego: "já tenho o Pixel instalado, preciso de UTM também?"

A resposta é sim — e entender o porquê muda como você trabalha.

O **Pixel do Meta** rastreia eventos dentro do ecossistema Meta: cliques, visualizações, conversões reportadas pela própria plataforma. O problema é que esses dados são proprietários — o Meta tem incentivo para mostrar que seus anúncios performam.

O **UTM com Google Analytics** rastreia o que acontece no seu site depois do clique. Sessões reais, páginas visitadas, tempo no site, jornada de compra. São dados seus, independentes de qualquer plataforma.

Usar os dois em paralelo é a estratégia correta para ter dados confiáveis.

## Convenção de UTM para Meta Ads

Antes de criar os links, defina a convenção da sua conta. Aqui está a que recomendamos:

| Parâmetro | Valor recomendado |
|-----------|-------------------|
| utm_source | \`facebook\` ou \`instagram\` (conforme a plataforma) |
| utm_medium | \`cpc\` (pago) |
| utm_campaign | \`objetivo_produto_mes\` |
| utm_content | \`formato_variante\` |

**Dica importante:** use \`facebook\` ou \`instagram\` como source dependendo de onde o anúncio vai rodar. Se vai rodar nos dois ao mesmo tempo, use \`meta\` como convenção. O mais importante é ser consistente.

## Exemplos reais por tipo de campanha

### Campanha de conversão — venda de produto

**Cenário:** e-commerce de roupas, campanha de conversão para calças jeans

\`\`\`
https://loja.com.br/calcas?utm_source=facebook&utm_medium=cpc&utm_campaign=conversao_calca_jan26&utm_content=carrossel_modelos
\`\`\`

### Campanha de tráfego — blog ou conteúdo

**Cenário:** levar visitantes para um artigo do blog

\`\`\`
https://blog.com.br/dicas-maquiagem?utm_source=instagram&utm_medium=social&utm_campaign=trafego_blog_jan26&utm_content=stories_swipe
\`\`\`

### Remarketing — recuperação de carrinho

**Cenário:** atingir quem abandonou o carrinho nos últimos 7 dias

\`\`\`
https://loja.com.br/checkout?utm_source=facebook&utm_medium=cpc&utm_campaign=remarketing_carrinho_jan26&utm_content=video_urgencia
\`\`\`

## Como adicionar UTM no Meta Ads

1. No **Gerenciador de Anúncios**, acesse o nível de anúncio
2. Na seção "Destino", procure por **"Parâmetros de URL"**
3. Cole os parâmetros (sem o ponto de interrogação):
   \`utm_source=facebook&utm_medium=cpc&utm_campaign=nome_campanha\`
4. Verifique o preview da URL final antes de publicar

**Atenção com variáveis dinâmicas:** o Meta permite usar \`{{campaign.name}}\` para preencher automaticamente. O problema é que esses valores costumam ter espaços e caracteres especiais que quebram o Analytics. Prefira valores fixos e padronizados manualmente.

## Como ver os dados no GA4

Após configurar os UTMs e ter tráfego suficiente, acesse no GA4:

**Relatórios → Aquisição → Aquisição de tráfego**

Na coluna "Origem/mídia da sessão" você vai ver:
- \`facebook / cpc\`
- \`instagram / cpc\`
- \`instagram / social\`

Separados, mensuráveis, comparáveis.

Para ver por campanha: **Relatórios → Aquisição → Campanhas de marketing**

Para análise de criativos: **Explorar → Formato livre** — adicione "Conteúdo do anúncio" como dimensão e compare utm_content lado a lado.

## Dicas avançadas

**Separe Facebook de Instagram:** mesmo que a campanha rode nos dois, use sources diferentes. Isso te diz onde está o melhor CPL.

**Use utm_content para testes A/B:** crie dois anúncios idênticos com utm_content=variante_a e utm_content=variante_b. Veja qual converte mais no GA4, não só no Meta.

**Padronize com a equipe:** crie um documento de convenção e compartilhe com todos que criam anúncios na conta. Um colaborador que escreve \`Facebook\` ao invés de \`facebook\` fragmenta seus dados.

## Conclusão

UTM no Meta Ads não é opcional — é o que transforma dados de plataforma (que sempre parecem ótimos) em dados independentes e verificáveis. Com a convenção certa e os links criados de forma consistente, você tem uma visão real do impacto das suas campanhas.
    `.trim(),
  },
  {
    slug: "utm-para-google-ads-manual-vs-automatico",
    title: "UTM para Google Ads: manual vs automático",
    description: "Auto-tagging, GCLID e UTMs manuais: entenda a diferença e quando usar cada abordagem no Google Ads.",
    date: "2026-05-12",
    readingTime: "7 min",
    content: `
## A vantagem (e a armadilha) do auto-tagging

O Google Ads tem um recurso chamado **auto-tagging** que está ativo por padrão. Quando ativado, o Google adiciona automaticamente um parâmetro \`gclid\` (Google Click ID) a cada URL clicada.

Esse GCLID permite que o GA4 reconheça automaticamente que o tráfego veio do Google Ads, de qual campanha, grupo de anúncios e até qual palavra-chave. Tudo isso sem você configurar nada.

Soa perfeito. E para muitos casos, é.

Mas há uma armadilha: **o GCLID só funciona dentro do ecossistema Google**. Se você usa outras ferramentas de análise — Mixpanel, Hotjar, sistemas de CRM, plataformas de e-mail, BI — o GCLID não passa informações para elas. Você fica cego fora do Google Analytics.

## GCLID vs UTM Manual: quando usar cada um

**Use somente auto-tagging (GCLID) quando:**
- Você usa exclusivamente o Google Analytics 4
- Não precisa comparar dados com outras plataformas
- A conta é simples, com um gestor e um cliente

**Use UTMs manuais quando:**
- Você usa outras ferramentas além do GA4
- Precisa de uma convenção unificada com Meta Ads para comparação cross-channel
- O cliente tem sistemas de CRM que leem parâmetros de URL
- Você quer mais controle sobre como os dados aparecem no Analytics

**Use os dois em paralelo quando:**
- Quer o melhor dos dois mundos: dados completos no GA4 via GCLID + compatibilidade com ferramentas externas via UTM

## ValueTrack Parameters: UTMs dinâmicos do Google

Se você vai usar UTMs manuais no Google Ads, conheça os **ValueTrack Parameters** — variáveis que o Google substitui automaticamente no momento do clique.

Os mais úteis:

| ValueTrack | O que retorna |
|------------|---------------|
| \`{campaign}\` | Nome da campanha |
| \`{adgroupid}\` | ID do grupo de anúncios |
| \`{keyword}\` | Palavra-chave que acionou |
| \`{matchtype}\` | Tipo de correspondência (e/p/b) |
| \`{device}\` | Dispositivo (m/t/c) |
| \`{network}\` | Rede (g/d/yt) |

## Template recomendado para Google Ads

Use este modelo no campo **"Modelo de acompanhamento"** (nas configurações da campanha ou da conta):

\`\`\`
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaign}&utm_content={adgroupid}&utm_term={keyword}
\`\`\`

O \`{lpurl}\` é substituído pela URL de destino do anúncio. Os outros valores são preenchidos dinamicamente pelo Google no momento do clique.

## Como configurar passo a passo

### Opção 1: Modelo de acompanhamento (recomendado para contas maiores)

1. No Google Ads, vá em **Configurações da conta → Configurações de URL da conta**
2. Em "Modelo de acompanhamento", cole o template acima
3. Clique em "Verificar" para testar
4. Salve

Isso aplica o modelo a **toda a conta** automaticamente.

### Opção 2: UTM manual em cada anúncio

1. Acesse o anúncio específico
2. No "URL final", adicione os parâmetros após o \`?\`:
   \`utm_source=google&utm_medium=cpc&utm_campaign=nome_campanha\`
3. Use valores fixos e padronizados

## Dúvidas frequentes

**Posso usar UTM manual e auto-tagging ao mesmo tempo?**
Sim. O GCLID e os UTMs coexistem na URL sem conflito. O GA4 processa os dois.

**Se eu sobrescrever utm_source com outro valor, o GA4 ainda atribui ao Google Ads?**
Sim, desde que o auto-tagging esteja ativo e a conta do GA4 esteja vinculada ao Google Ads. O GCLID garante a atribuição.

**Devo usar o mesmo padrão de UTM do Meta Ads?**
Sim. Ter a mesma convenção nos dois canais facilita a comparação no GA4 e nos relatórios que você entrega ao cliente.

## Conclusão

Para contas simples com apenas GA4: auto-tagging é suficiente. Para agências que gerenciam múltiplos clientes com ferramentas diversas: UTMs manuais com ValueTrack dão mais controle e flexibilidade. Na dúvida, use os dois.
    `.trim(),
  },
  {
    slug: "5-erros-comuns-utm",
    title: "Os 5 erros mais comuns ao criar links UTM (e como evitar)",
    description: "Erros simples nos parâmetros UTM podem fragmentar seus dados e tornar o Analytics inútil. Veja os mais frequentes e como corrigi-los.",
    date: "2026-05-15",
    readingTime: "6 min",
    content: `
## Por que pequenos erros no UTM destroem seus dados

Um link UTM com erro não quebra o site. O usuário chega ao destino normalmente. O problema é silencioso: seus dados no Analytics ficam fragmentados, duplicados ou simplesmente errados — e você só descobre semanas depois quando tenta analisar os resultados.

Esses são os 5 erros que vejo mais frequentemente, e como evitar cada um.

## Erro 1: Usar espaços nos valores

**O problema:**
\`utm_campaign=black friday 2025\`

O espaço é codificado como \`%20\` na URL:
\`utm_campaign=black%20friday%202025\`

Resultado: no Analytics aparecem entradas separadas para "black friday 2025", "black%20friday%202025", dependendo de como o navegador processou. Seus dados ficam fragmentados.

**A solução:** use underline \`_\` ou hífen \`-\` para separar palavras.
\`utm_campaign=black_friday_2025\`

## Erro 2: Misturar maiúsculas e minúsculas

**O problema:**
Em uma campanha você usa \`utm_source=Facebook\`. Na seguinte, \`utm_source=facebook\`. No próximo mês, \`utm_source=FACEBOOK\`.

Para o Google Analytics, esses são **três origens diferentes**. Você está dividindo seus dados em três linhas quando deveria ter uma só.

**A solução:** adote a regra absoluta: **tudo minúsculo, sempre**. Sem exceções.
\`utm_source=facebook\` ✓

## Erro 3: Não padronizar com a equipe

**O problema:** cada pessoa na equipe cria UTMs do seu jeito. Um usa \`utm_medium=pago\`, outro usa \`utm_medium=cpc\`, outro \`utm_medium=paid\`. Você acaba com 4 entradas para o mesmo tipo de mídia.

**A solução:** crie um documento de convenção de UTM e compartilhe com todos. Uma página no Notion ou no Google Docs com uma tabela de valores aprovados para cada parâmetro. Revisão obrigatória antes de publicar.

Exemplo de tabela de convenção:

| Plataforma | utm_source | utm_medium |
|------------|------------|------------|
| Google Ads | google | cpc |
| Meta Ads (Facebook) | facebook | cpc |
| Meta Ads (Instagram) | instagram | cpc |
| E-mail marketing | newsletter | email |
| Post orgânico Instagram | instagram | social |

## Erro 4: Usar o mesmo nome de campanha para coisas diferentes

**O problema:** você cria uma campanha de remarketing e outra de prospecting no mesmo mês, ambas com \`utm_campaign=janeiro_2026\`. No Analytics, elas aparecem juntas — você não consegue separá-las.

**A solução:** o nome da campanha deve incluir o **objetivo**:
- \`utm_campaign=remarketing_carrinho_jan26\`
- \`utm_campaign=prospecting_frio_jan26\`

Quanto mais específico, melhor para análise futura.

## Erro 5: Não usar UTM em todos os pontos de contato

**O problema:** você coloca UTM nos anúncios pagos mas esquece de usar no link da bio do Instagram, no botão do e-mail marketing, no link do post orgânico que viraliza. O resultado: vendas que vieram desses canais aparecem como "direct" — sem origem.

**A solução:** crie o hábito de UTM em **qualquer link** que leve para o seu site ou do cliente:
- Bio do Instagram → utm_source=instagram&utm_medium=social&utm_campaign=bio
- Assinatura de e-mail → utm_source=email&utm_medium=signature
- Link no YouTube → utm_source=youtube&utm_medium=video

## Bônus: Como evitar todos esses erros de uma vez

A raiz da maioria desses erros é o processo manual. Digitar UTMs à mão em um documento de texto é pedir para errar.

A solução é usar um gerador que:
- Force os valores para minúsculo automaticamente
- Substitua espaços por underline
- Valide a URL antes de gerar
- Salve o histórico para você reusar padrões corretos

Com um gerador confiável e uma convenção documentada, esses 5 erros deixam de acontecer. Seus dados ficam limpos, comparáveis e confiáveis — exatamente o que você precisa para tomar decisões e provar resultados para o cliente.
    `.trim(),
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
