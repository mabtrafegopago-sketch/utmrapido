import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="text-center py-16 sm:py-20 px-4 max-w-2xl mx-auto animate-fade-in">
      <div className="inline-flex items-center gap-2 bg-brand-light text-brand text-xs font-semibold px-3 py-1 rounded-full mb-5">
        ⚡ Usado por gestores de tráfego em todo o Brasil
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text leading-tight mb-4">
        Crie links UTM organizados por cliente,{" "}
        <span className="text-brand">em segundos.</span>
      </h1>
      <p className="text-lg text-muted leading-relaxed mb-8 max-w-xl mx-auto">
        A ferramenta de gestores de tráfego pago que atendem mais de um cliente.
        Gere, salve e compartilhe seus links — sem planilha.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
        <Link href="/login" className="w-full sm:w-auto">
          <Button size="lg" variant="primary" className="w-full transition-transform hover:-translate-y-0.5 hover:shadow-md duration-200">
            Entrar grátis →
          </Button>
        </Link>
        <Link
          href="/precos"
          className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors py-3 px-4"
        >
          Ver planos
        </Link>
      </div>
    </section>
  );
}
