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
import { formatarNomeExibicao } from "@/lib/app/formatar-nome-exibicao";
import { useAuth } from "@/lib/auth-context";
import { nomeExibicaoPerfil } from "@/lib/influenciador/perfil-storage";
import { cn } from "@/lib/utils";

const ATALHOS = [
  {
    href: "/influenciador/demandas",
    titulo: "Ver demandas",
    descricao: "12 oportunidades com match acima de 70%",
    icone: FileText,
    destaque: true,
  },
  {
    href: "/influenciador/treinamentos",
    titulo: "Continuar treinamento",
    descricao: "1 trilha em andamento · nível Iniciante",
    icone: GraduationCap,
    destaque: false,
  },
  {
    href: "/influenciador/financeiro",
    titulo: "Painel financeiro",
    descricao: "R$ 4.200 previstos neste mês",
    icone: Wallet,
    destaque: false,
  },
  {
    href: "/influenciador/resultados",
    titulo: "Registrar resultados",
    descricao: "2 campanhas aguardando métricas",
    icone: BarChart3,
    destaque: false,
  },
] as const;

const RESUMO = [
  { label: "Matches novos", valor: "5", lilas: true },
  { label: "Campanhas ativas", valor: "3", lilas: true },
  { label: "XP de treinamento", valor: "240", lilas: true },
  { label: "Nota média", valor: "4,8", lilas: false, notaAlta: true },
] as const;

export function InicioDashboard() {
  const { usuario } = useAuth();
  const nomePerfil = usuario ? nomeExibicaoPerfil(usuario.id) : null;
  const nomeExibicao = nomePerfil ?? formatarNomeExibicao(usuario?.email);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-normal">Início</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Olá, {nomeExibicao}
        </h1>
        <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
          Acompanhe matches, campanhas e ganhos pelo menu lateral.
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
            <p
              className={cn(
                "font-data mt-1 text-2xl font-semibold",
                "notaAlta" in item && item.notaAlta ? "text-verde-neon" : "",
              )}
            >
              {item.valor}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-4" aria-labelledby="atalhos-inicio">
        <h2 id="atalhos-inicio" className="font-display text-lg font-bold">
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
                <div className="flex size-9 shrink-0 items-center justify-center rounded-button border border-cinza-200 bg-fundo-pagina text-foreground">
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
