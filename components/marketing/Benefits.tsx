const benefits = [
  {
    icon: "🎯",
    title: "Gere o link certo na primeira vez",
    description:
      "Presets por plataforma (Meta, Google, TikTok), validação automática e formatação inteligente. Sem erros de digitação que quebram o rastreamento.",
  },
  {
    icon: "📁",
    title: "Histórico organizado por cliente",
    description:
      "Cada link no lugar certo, consultável sempre. Chega de planilha desatualizada ou de perder tempo procurando qual link usou no mês passado.",
  },
  {
    icon: "🔗",
    title: "Seu cliente acessa sozinho",
    description:
      "Link único que o cliente abre e consulta quando quiser. Você manda no WhatsApp, ele abre, vê todos os links das campanhas dele. Sem login.",
  },
];

export function Benefits() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-text text-center mb-10">
          Por que gestores usam o UTM Rápido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3 hover:border-brand/30 hover:shadow-sm transition-all"
            >
              <div className="text-3xl">{b.icon}</div>
              <h3 className="font-semibold text-text text-lg leading-snug">{b.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
