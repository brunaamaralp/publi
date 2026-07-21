"use client";

import { useEffect, useState } from "react";

import { PortfolioEditor } from "@/components/influenciador/portfolio/portfolio-editor";
import { useAuth } from "@/lib/auth-context";
import { obterOuCriarPortfolioDoUsuario } from "@/lib/influenciador/portfolio-storage";
import type { PortfolioInfluenciador } from "@/lib/influenciador/portfolio-types";

export function MeuPortfolioFlow() {
  const { usuario, isLoading } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioInfluenciador | null>(
    null,
  );

  useEffect(() => {
    if (!usuario) {
      setPortfolio(null);
      return;
    }
    setPortfolio(obterOuCriarPortfolioDoUsuario(usuario.id));
  }, [usuario]);

  if (isLoading || !portfolio) {
    return (
      <div className="text-texto-secundario flex min-h-[40vh] items-center justify-center text-sm">
        Carregando portfólio…
      </div>
    );
  }

  return <PortfolioEditor key={portfolio.id} inicial={portfolio} />;
}
