import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { HeroMatchPreview } from "@/components/home/hero-match-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DESTAQUES = [
  { icone: Sparkles, texto: "Match por compatibilidade real", cor: "text-verde-neon" },
  { icone: ShieldCheck, texto: "Pagamento em escrow", cor: "text-lilas" },
  { icone: TrendingUp, texto: "Resultados mensuráveis", cor: "text-lilas" },
] as const;

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-verde-carvao text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(color-mix(in srgb, var(--lilas) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--verde-neon) 4%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--lilas) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="text-lilas text-xs font-semibold uppercase tracking-widest">
            Marketplace de influência
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
            Campanhas certas para criadores.{" "}
            <span className="destaque-neon-escuro">Parcerias</span> que convertem.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Conectamos influenciadores, marcas e agências em um fluxo completo —
            do match inteligente à negociação, contrato, pagamento seguro e
            relatório de resultados.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/cadastro"
              className={cn(buttonVariants({ variant: "cta", size: "lg" }), "h-10 px-5")}
            >
              Sou influenciador
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/cadastro"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-10 border-lilas/35 bg-transparent px-5 text-lilas-claro hover:border-lilas hover:bg-lilas/10 hover:text-white",
              )}
            >
              Sou marca / empresa
            </Link>
            <Link
              href="/cadastro"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-10 text-zinc-300 hover:bg-lilas/10 hover:text-lilas-claro",
              )}
            >
              Sou agência
            </Link>
          </div>

          <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
            {DESTAQUES.map(({ icone: Icone, texto, cor }) => (
              <li
                key={texto}
                className="flex items-center gap-2 text-sm text-zinc-400"
              >
                <Icone className={cn("size-4 shrink-0", cor)} aria-hidden />
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="rounded-card border border-lilas/20 bg-white/5 p-8 backdrop-blur-sm">
            <HeroMatchPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
