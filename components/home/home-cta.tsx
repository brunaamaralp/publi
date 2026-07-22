import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeCta() {
  return (
    <section className="bg-fundo-pagina py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-card border border-verde-carvao-claro/50 bg-verde-carvao px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lilas-escuro via-lilas to-lilas-claro"
            aria-hidden
          />
          <p className="text-lilas text-xs font-semibold uppercase tracking-widest">
            Comece agora
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Pronto para encontrar a{" "}
            <span className="destaque-neon-escuro">parceria certa</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Crie seu perfil em minutos — busca ativa, negociação sem taxa e
            pagamento protegido, tudo em um só lugar.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/cadastro"
              className={cn(
                buttonVariants({ variant: "cta", size: "lg" }),
                "h-10 px-6",
              )}
            >
              Começar gratuitamente
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/cadastro"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 border-lilas/40 bg-transparent px-6 text-lilas-claro hover:bg-lilas-claro/10 hover:text-white",
              )}
            >
              Sou uma marca
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
