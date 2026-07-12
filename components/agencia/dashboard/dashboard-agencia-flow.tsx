"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

import { AdicionarEmpresaCliente } from "@/components/agencia/adicionar-empresa-cliente";
import { CardsResumoAgencia } from "@/components/agencia/dashboard/cards-resumo-agencia";
import { ListaEmpresasClientes } from "@/components/agencia/dashboard/lista-empresas-clientes";
import { buttonVariants } from "@/components/ui/button";
import { useAgencia } from "@/lib/contexts/agencia-context";
import { obterResumoConsolidado } from "@/lib/agencia/dashboard-utils";
import {
  AGENCIA_DEMO,
  EMPRESAS_CLIENTES_DEMO,
} from "@/lib/mock-data/agencia-dashboard";
import { cn } from "@/lib/utils";

export function DashboardAgenciaFlow() {
  const {
    agencia,
    empresasClientes,
    empresaAtivaId,
    setEmpresaAtivaId,
    inicializarAgencia,
  } = useAgencia();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!agencia && empresasClientes.length === 0) {
      inicializarAgencia(AGENCIA_DEMO, EMPRESAS_CLIENTES_DEMO);
    }
    setPronto(true);
  }, [agencia, empresasClientes.length, inicializarAgencia]);

  const resumo = useMemo(
    () => obterResumoConsolidado(empresasClientes),
    [empresasClientes],
  );

  if (!pronto) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
        Carregando dashboard…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-primary text-sm font-medium">Agência</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {agencia?.razaoSocial ?? "Visão consolidada"}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Métricas agregadas de todas as empresas-clientes que você gerencia.
            Troque o contexto no menu lateral ou selecione uma empresa abaixo.
          </p>
        </div>
        <AdicionarEmpresaCliente className="shrink-0" />
      </section>

        <CardsResumoAgencia resumo={resumo} />

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Empresas-clientes
              </h2>
              <p className="text-muted-foreground text-sm">
                Clique para definir o contexto ativo e abrir as demandas.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/empresa/demandas"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Ver demandas da empresa ativa
              </Link>
              <Link
                href="/resultados/ctr-cpf-001"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-1.5",
                )}
              >
                <BarChart3 className="size-4" aria-hidden />
                Resultados (exemplo)
              </Link>
            </div>
          </div>

          <ListaEmpresasClientes
            empresas={empresasClientes}
            empresaAtivaId={empresaAtivaId}
            onSelecionar={setEmpresaAtivaId}
          />
        </section>
    </div>
  );
}
