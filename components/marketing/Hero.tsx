import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="text-center py-12 px-4 max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-brand-light text-brand text-xs font-semibold px-3 py-1 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
        Gratuito para uso básico
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text leading-tight mb-4">
        Crie links UTM organizados por cliente,{" "}
        <span className="text-brand">em segundos.</span>
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-8 max-w-xl mx-auto">
        A ferramenta de gestores de tráfego pago que atendem mais de um cliente.
        Gere, salve e compartilhe seus links — sem planilha.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/precos">
          <Button size="lg" variant="primary">
            Ser Pro — R$16,90/mês
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="secondary">
            Entrar grátis
          </Button>
        </Link>
      </div>
    </section>
  );
}
