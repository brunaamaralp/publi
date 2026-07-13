"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Building2, PlusCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ATALHOS = [
  {
    href: "/empresa/demandas/nova",
    titulo: "Publicar campanha",
    descricao: "Crie uma nova demanda para criadores compatíveis",
    icone: PlusCircle,
    destaque: true,
  },
  {
    href: "/empresa/demandas",
    titulo: "Minhas campanhas",
    descricao: "3 campanhas abertas · 2 em negociação",
    icone: Building2,
    destaque: false,
  },
  {
    href: "/empresa/resultados",
    titulo: "Resultados",
    descricao: "Acompanhe métricas das campanhas concluídas",
    icone: BarChart3,
    destaque: false,
  },
] as const;

const RESUMO = [
  { label: "Campanhas abertas", valor: "3", lilas: true },
  { label: "Em negociação", valor: "2", lilas: true },
  { label: "Sugestões recebidas", valor: "14", lilas: true },
  { label: "Investimento ativo", valor: "R$ 24k", lilas: false },
] as const;

type InicioEmpresaProps = {
  nomeExibicao: string;
};

export function InicioEmpresa({ nomeExibicao }: InicioEmpresaProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-normal">Início</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Olá, {nomeExibicao}
        </h1>
        <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
          Publique campanhas, acompanhe negociações e resultados em um só lugar.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {RESUMO.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-card p-4",
              item.lilas
                ? "card-metrica-perfil ring-0"
                : "border border-cinza-200 bg-white",
            )}
          >
            <p
              className={cn(
                "text-xs font-normal",
                item.lilas ? "opacity-80" : "text-texto-secundario",
              )}
            >
              {item.label}
            </p>
            <p className="font-data mt-1 text-2xl font-semibold">{item.valor}</p>
          </div>
        ))}
      </div>

      <section className="space-y-4" aria-labelledby="atalhos-empresa">
        <h2 id="atalhos-empresa" className="font-display text-lg font-bold">
          Atalhos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ATALHOS.map((atalho) => (
            <article
              key={atalho.href}
              className={cn(
                "flex flex-col gap-4 rounded-card border border-cinza-200 bg-white p-4",
                atalho.destaque && "border-l-[3px] border-l-verde-neon",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-button border border-cinza-200 bg-fundo-pagina">
                  <atalho.icone className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="font-display text-base font-bold">
                    {atalho.titulo}
                  </h3>
                  <p className="text-texto-secundario text-sm font-normal leading-relaxed">
                    {atalho.descricao}
                  </p>
                </div>
              </div>
              <Link
                href={atalho.href}
                className={cn(
                  buttonVariants({
                    variant: atalho.destaque ? "cta" : "outline",
                    size: "sm",
                  }),
                  "w-fit",
                )}
              >
                Acessar
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
