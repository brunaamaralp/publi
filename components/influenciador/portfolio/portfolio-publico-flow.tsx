"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Hourglass } from "lucide-react";

import { ConvidarDemandaDialog } from "@/components/empresa/busca-creators/convidar-demanda-dialog";
import { PortfolioView } from "@/components/influenciador/portfolio/portfolio-view";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import type { CreatorCatalogo } from "@/lib/empresa/creator-catalogo-types";
import {
  carregarPortfolioPorId,
  portfolioParaCreatorCatalogo,
  statusPublicoPortfolio,
} from "@/lib/influenciador/portfolio-storage";
import type { PortfolioInfluenciador } from "@/lib/influenciador/portfolio-types";
import { cn } from "@/lib/utils";

type PortfolioPublicoFlowProps = {
  portfolioId: string;
};

export function PortfolioPublicoFlow({
  portfolioId,
}: PortfolioPublicoFlowProps) {
  const { usuario } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioInfluenciador | null>(
    null,
  );
  const [status, setStatus] = useState<
    ReturnType<typeof statusPublicoPortfolio> | "carregando"
  >("carregando");
  const [convidar, setConvidar] = useState<CreatorCatalogo | null>(null);

  const isEmpresa =
    usuario?.tipo === "empresa" || usuario?.tipo === "agencia";
  const isDono =
    usuario?.tipo === "influenciador" &&
    portfolio !== null &&
    usuario.id === portfolio.usuarioId;

  useEffect(() => {
    const st = statusPublicoPortfolio(portfolioId);
    setStatus(st);
    if (st === "ativo" || st === "pendente_verificacao") {
      setPortfolio(carregarPortfolioPorId(portfolioId));
    } else {
      setPortfolio(null);
    }
  }, [portfolioId]);

  const voltaHref = isEmpresa
    ? "/empresa/buscar-creators"
    : isDono
      ? "/influenciador/meu-portfolio"
      : "/inicio";

  if (status === "carregando") {
    return (
      <div className="text-texto-secundario flex min-h-[40vh] items-center justify-center text-sm">
        Carregando portfólio…
      </div>
    );
  }

  if (status === "pendente_verificacao") {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <Hourglass
          className="text-texto-secundario mx-auto size-10 opacity-70"
          aria-hidden
        />
        <h1 className="font-display mt-4 text-xl font-bold">
          Perfil em análise
        </h1>
        <p className="text-texto-secundario mt-2 text-sm font-normal">
          Este portfólio ainda não está disponível publicamente. A moderação
          precisa aprovar o perfil completo antes da vitrine aparecer.
        </p>
        <Link
          href={voltaHref}
          className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
        >
          Voltar
        </Link>
      </div>
    );
  }

  if (status === "suspenso" || status === "inexistente" || !portfolio) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-xl font-bold">
          Portfólio não encontrado
        </h1>
        <p className="text-texto-secundario mt-2 text-sm font-normal">
          Este creator não está disponível para visualização pública.
        </p>
        <Link
          href={voltaHref}
          className={cn(buttonVariants({ variant: "outline" }), "mt-6")}
        >
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={voltaHref}
          className="text-texto-secundario hover:text-lilas-escuro inline-flex items-center gap-1 text-sm font-medium"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {isEmpresa
            ? "Voltar à busca"
            : isDono
              ? "Voltar à edição"
              : "Voltar"}
        </Link>
        {isDono ? (
          <Link
            href="/influenciador/meu-portfolio"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Editar portfólio
          </Link>
        ) : null}
      </div>

      <PortfolioView
        portfolio={portfolio}
        ocultarHandlesRedes
        acoes={
          isEmpresa ? (
            <Button
              type="button"
              variant="cta"
              onClick={() =>
                setConvidar(portfolioParaCreatorCatalogo(portfolio))
              }
            >
              Convidar para demanda
            </Button>
          ) : null
        }
      />

      <ConvidarDemandaDialog
        creator={convidar}
        open={convidar !== null}
        onOpenChange={(open) => {
          if (!open) setConvidar(null);
        }}
      />
    </div>
  );
}
