"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RESUMO = [
  { label: "Perfis pendentes", valor: "6", lilas: true },
  { label: "Aprovados hoje", valor: "12", lilas: true },
  { label: "Suspensos", valor: "1", lilas: false },
  { label: "Total na fila", valor: "19", lilas: false },
] as const;

type InicioAdminProps = {
  nomeExibicao: string;
};

export function InicioAdmin({ nomeExibicao }: InicioAdminProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-normal">Início</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Olá, {nomeExibicao}
        </h1>
        <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
          Gerencie aprovações e a qualidade dos perfis na plataforma.
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

      <section className="space-y-4" aria-labelledby="atalhos-admin">
        <h2 id="atalhos-admin" className="font-display text-lg font-bold">
          Atalhos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="flex flex-col gap-4 rounded-card border border-cinza-200 border-l-[3px] border-l-verde-neon bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-button border border-cinza-200 bg-fundo-pagina">
                <ShieldCheck className="size-4" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className="font-display text-base font-bold">Moderação</h3>
                <p className="text-texto-secundario text-sm font-normal leading-relaxed">
                  Aprovar ou rejeitar perfis pendentes de verificação
                </p>
              </div>
            </div>
            <Link
              href="/admin/moderacao"
              className={cn(buttonVariants({ variant: "cta", size: "sm" }), "w-fit")}
            >
              Abrir fila
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>

          <article className="flex flex-col gap-4 rounded-card border border-cinza-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-button border border-cinza-200 bg-fundo-pagina">
                <Users className="size-4" aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className="font-display text-base font-bold">Visão geral</h3>
                <p className="text-texto-secundario text-sm font-normal leading-relaxed">
                  Influenciadores, empresas e agências aguardando análise
                </p>
              </div>
            </div>
            <Link
              href="/admin/moderacao"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit")}
            >
              Ver pendentes
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </article>
        </div>
      </section>
    </div>
  );
}
