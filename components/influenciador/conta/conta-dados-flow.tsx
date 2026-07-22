"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { carregarPerfilInfluenciador } from "@/lib/influenciador/perfil-storage";
import { obterOuCriarPortfolioDoUsuario } from "@/lib/influenciador/portfolio-storage";
import { cn } from "@/lib/utils";

const LABEL_PLANO: Record<string, string> = {
  basico: "Básico",
  pro: "Pro",
  elite: "Elite",
};

const LABEL_STATUS: Record<string, string> = {
  ativo: "Ativo",
  suspenso: "Suspenso",
  pendente_verificacao: "Pendente de verificação",
};

type ContaResumo = {
  nome: string;
  email: string;
  status: string;
  plano: string;
  handle: string;
};

export function ContaDadosFlow() {
  const { usuario, isLoading } = useAuth();
  const [resumo, setResumo] = useState<ContaResumo | null>(null);

  useEffect(() => {
    if (!usuario) {
      setResumo(null);
      return;
    }
    const perfil = carregarPerfilInfluenciador(usuario.id);
    const portfolio = obterOuCriarPortfolioDoUsuario(usuario.id);
    setResumo({
      nome:
        perfil?.influenciador.nome?.trim() ||
        portfolio.nome.trim() ||
        "Sem nome",
      email: usuario.email,
      status: usuario.status,
      plano: perfil?.influenciador.plano || portfolio.plano || "basico",
      handle: portfolio.handle || "—",
    });
  }, [usuario]);

  if (isLoading || !resumo) {
    return (
      <p className="text-texto-secundario text-sm">Carregando conta…</p>
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="dados-conta">
        <h2 id="dados-conta" className="font-display text-lg font-bold">
          Dados da conta
        </h2>
        <dl className="divide-y divide-cinza-200 rounded-card border border-cinza-200 bg-white">
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-texto-secundario text-sm">Nome</dt>
            <dd className="text-sm font-medium">{resumo.nome}</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-texto-secundario text-sm">Handle</dt>
            <dd className="font-data text-sm font-medium">{resumo.handle}</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-texto-secundario text-sm">E-mail</dt>
            <dd className="text-sm font-medium">{resumo.email}</dd>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <dt className="text-texto-secundario text-sm">Status</dt>
            <dd className="text-sm font-medium">
              {LABEL_STATUS[resumo.status] ?? resumo.status}
            </dd>
          </div>
        </dl>
        <p className="text-texto-secundario text-xs leading-relaxed">
          Nome, bio e mídias públicas são editados no portfólio.
        </p>
        <Link
          href="/influenciador/meu-portfolio"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "inline-flex gap-2",
          )}
        >
          <UserRound className="size-4" aria-hidden />
          Editar portfólio
        </Link>
      </section>

      <section className="space-y-4" aria-labelledby="assinatura-resumo">
        <h2 id="assinatura-resumo" className="font-display text-lg font-bold">
          Assinatura
        </h2>
        <div className="flex flex-col gap-3 rounded-card border border-cinza-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-texto-secundario text-sm">Plano atual</p>
            <p className="font-display mt-0.5 text-base font-bold">
              {LABEL_PLANO[resumo.plano] ?? resumo.plano}
            </p>
          </div>
          <Link
            href="/influenciador/conta/plano"
            className={cn(
              buttonVariants({ variant: "cta", size: "sm" }),
              "inline-flex shrink-0 gap-2 self-start sm:self-auto",
            )}
          >
            <CreditCard className="size-4" aria-hidden />
            Gerenciar plano
          </Link>
        </div>
      </section>
    </div>
  );
}
