"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  GraduationCap,
  Wallet,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const CTA_PRIMARIO =
  "border-transparent bg-verde-carvao-escuro text-verde-neon shadow-none hover:bg-verde-carvao hover:text-verde-neon";

const ATALHOS = [
  {
    href: "/influenciador/demandas",
    titulo: "Ver demandas",
    descricao: "12 oportunidades com match acima de 70%",
    icone: FileText,
    primario: true,
    borda: "border-l-verde-neon",
  },
  {
    href: "/influenciador/treinamentos",
    titulo: "Continuar treinamento",
    descricao: "1 trilha em andamento · nível Iniciante",
    icone: GraduationCap,
    primario: false,
    borda: "border-l-lilas",
  },
  {
    href: "/influenciador/financeiro",
    titulo: "Painel financeiro",
    descricao: "R$ 4.200 previstos neste mês",
    icone: Wallet,
    primario: false,
    borda: "border-l-lilas",
  },
  {
    href: "/influenciador/resultados",
    titulo: "Registrar resultados",
    descricao: "2 campanhas aguardando métricas",
    icone: BarChart3,
    primario: false,
    borda: "border-l-lilas",
  },
] as const;

const RESUMO = [
  { label: "Matches novos", valor: "5", destaque: false },
  { label: "Campanhas ativas", valor: "3", destaque: false },
  { label: "XP de treinamento", valor: "240", destaque: false },
  { label: "Nota média", valor: "4,8", destaque: true },
] as const;

export function InicioDashboard() {
  const { usuario } = useAuth();
  const primeiroNome =
    usuario?.email.split("@")[0]?.replace(/\./g, " ") ?? "usuário";
  const nomeExibicao =
    primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-normal">Início</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Olá, {nomeExibicao}
        </h1>
        <p className="text-texto-secundario text-sm font-normal">
          {usuario?.status === "pendente_verificacao"
            ? "Seu perfil está em análise — você já pode explorar a plataforma."
            : "Acompanhe matches, campanhas e ganhos pelo menu lateral."}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {RESUMO.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-card border border-cinza-200 bg-white p-4",
              item.destaque && "border-l-[3px] border-l-verde-neon",
            )}
          >
            <p className="text-texto-secundario text-xs font-normal">
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1 font-display text-2xl font-bold tabular-nums",
                item.destaque ? "text-verde-neon" : "text-foreground",
              )}
            >
              {item.valor}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-4" aria-labelledby="atalhos-inicio">
        <h2
          id="atalhos-inicio"
          className="font-display text-lg font-bold"
        >
          Atalhos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ATALHOS.map((atalho) => (
            <article
              key={atalho.href}
              className={cn(
                "secao-editavel flex flex-col gap-4 ring-0",
                "border-l-[3px]",
                atalho.borda,
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-button border border-cinza-200 bg-fundo-pagina text-foreground">
                  <atalho.icone className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="font-display text-base font-bold">
                    {atalho.titulo}
                  </h3>
                  <p className="text-texto-secundario text-sm font-normal">
                    {atalho.descricao}
                  </p>
                </div>
              </div>
              <Link
                href={atalho.href}
                className={cn(
                  buttonVariants({
                    variant: atalho.primario ? "default" : "outline",
                    size: "sm",
                  }),
                  atalho.primario && CTA_PRIMARIO,
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

      <section
        className="rounded-card border border-cinza-200 bg-white px-4 py-3"
        aria-label="Trocar visão de perfil"
      >
        <p className="text-texto-secundario text-sm font-normal">
          Testar outro perfil no protótipo:
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/empresa/demandas"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Empresa
          </Link>
          <Link
            href="/agencia/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Agência
          </Link>
          <Link
            href="/admin/moderacao"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Moderação
          </Link>
        </div>
      </section>
    </div>
  );
}
