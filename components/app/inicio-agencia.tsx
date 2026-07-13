"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";

import { SeletorEmpresaCliente } from "@/components/agencia/seletor-empresa-cliente";
import { buttonVariants } from "@/components/ui/button";
import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { cn } from "@/lib/utils";

const ATALHOS = [
  {
    href: "/agencia/dashboard",
    titulo: "Painel consolidado",
    descricao: "Visão de todas as empresas-clientes",
    icone: LayoutDashboard,
    destaque: true,
  },
  {
    href: "/empresa/demandas",
    titulo: "Campanhas do cliente",
    descricao: "Gerencie demandas no contexto da marca ativa",
    icone: Building2,
    destaque: false,
  },
  {
    href: "/empresa/demandas/nova",
    titulo: "Nova campanha",
    descricao: "Publique em nome do cliente selecionado",
    icone: PlusCircle,
    destaque: false,
  },
  {
    href: "/empresa/resultados",
    titulo: "Resultados",
    descricao: "Métricas consolidadas por cliente",
    icone: BarChart3,
    destaque: false,
  },
] as const;

const RESUMO = [
  { label: "Clientes ativos", valor: "4", lilas: true },
  { label: "Campanhas em curso", valor: "11", lilas: true },
  { label: "Investimento total", valor: "R$ 86k", lilas: true },
  { label: "Contratos ativos", valor: "7", lilas: false },
] as const;

type InicioAgenciaProps = {
  nomeExibicao: string;
};

export function InicioAgencia({ nomeExibicao }: InicioAgenciaProps) {
  const agenciaCtx = useAgenciaOpcional();
  const clienteAtivo =
    agenciaCtx?.empresaAtiva?.nomeFantasia ??
    agenciaCtx?.empresaAtiva?.razaoSocial;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-texto-secundario text-sm font-normal">Início</p>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Olá, {nomeExibicao}
          </h1>
          <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
            Gerencie clientes, campanhas e resultados sem trocar de conta.
          </p>
        </div>

        {agenciaCtx?.agencia ? (
          <div className="secao-editavel max-w-md space-y-2 p-4 ring-0">
            <p className="text-texto-secundario text-xs font-normal">
              Cliente ativo
            </p>
            <SeletorEmpresaCliente />
            {clienteAtivo ? (
              <p className="text-texto-secundario text-xs font-normal">
                Operações em campanhas e resultados usam{" "}
                <span className="font-medium text-foreground">{clienteAtivo}</span>.
              </p>
            ) : null}
          </div>
        ) : null}
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

      <section className="space-y-4" aria-labelledby="atalhos-agencia">
        <h2 id="atalhos-agencia" className="font-display text-lg font-bold">
          Atalhos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
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
