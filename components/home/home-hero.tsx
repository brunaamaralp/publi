import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { PubliLogo } from "@/components/brand/publi-logo";
import { HeroProductPreview } from "@/components/home/hero-product-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DESTAQUES = [
  { icone: Sparkles, texto: "Match por compatibilidade real" },
  { icone: ShieldCheck, texto: "Pagamento em escrow" },
  { icone: TrendingUp, texto: "Resultados mensuráveis" },
] as const;

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-cinza-200 bg-fundo-pagina">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 100% 0%, color-mix(in srgb, var(--lilas-claro) 90%, transparent), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <PubliLogo size="lg" className="mb-8" />

          <p className="eyebrow-secao">Marketplace de influência</p>
          <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            Campanhas certas para criadores.{" "}
            <span className="destaque-lilas">Parcerias</span> que convertem.
          </h1>
          <p className="text-texto-secundario mt-6 text-base leading-relaxed font-normal sm:text-lg">
            Conectamos influenciadores, marcas e agências — do match à
            negociação, contrato, pagamento seguro e relatório de resultados.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/cadastro"
              className={cn(
                buttonVariants({ variant: "cta", size: "lg" }),
                "h-11 px-6",
              )}
            >
              Sou influenciador
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/cadastro"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-cinza-200 bg-white px-6 hover:border-lilas/50 hover:bg-lilas-claro/50",
              )}
            >
              Sou marca / empresa
            </Link>
          </div>

          <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
            {DESTAQUES.map(({ icone: Icone, texto }) => (
              <li
                key={texto}
                className="text-texto-secundario flex items-center gap-2 text-sm font-normal"
              >
                <span className="icone-marca size-8 shrink-0 rounded-md">
                  <Icone className="size-3.5" aria-hidden />
                </span>
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <HeroProductPreview />
      </div>
    </section>
  );
}
