"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

import { AdicionarEmpresaCliente } from "@/components/agencia/adicionar-empresa-cliente";
import { CardsResumoAgencia } from "@/components/agencia/dashboard/cards-resumo-agencia";
import { ListaEmpresasClientes } from "@/components/agencia/dashboard/lista-empresas-clientes";
import { buttonVariants } from "@/components/ui/button";
import { useAgencia } from "@/lib/contexts/agencia-context";
import {
  obterResumoConsolidado,
  obterResumoEmpresaCliente,
  type ResumoConsolidadoAgencia,
} from "@/lib/agencia/dashboard-utils";
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
    empresaAtiva,
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

  const resumoConsolidado = useMemo(
    () => obterResumoConsolidado(empresasClientes),
    [empresasClientes],
  );

  const resumoExibido: ResumoConsolidadoAgencia = useMemo(() => {
    if (!empresaAtivaId) return resumoConsolidado;
    const cliente = obterResumoEmpresaCliente(empresaAtivaId);
    return {
      totalDemandasAtivas: cliente.demandasAtivas,
      totalContratosAndamento: cliente.contratosAndamento,
      totalInvestidoMes: cliente.investidoMes,
      totalEmpresasClientes: resumoConsolidado.totalEmpresasClientes,
    };
  }, [empresaAtivaId, resumoConsolidado]);

  if (!pronto) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
        Carregando painel…
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
            {empresaAtiva
              ? `Métricas do cliente ativo: ${empresaAtiva.nomeFantasia ?? empresaAtiva.razaoSocial}. Abra o workspace ou troque na lista abaixo.`
              : "Portfólio de empresas-clientes com métricas agregadas. Selecione um cliente para operar campanhas e resultados."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/agencia/clientes"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Gerenciar clientes
          </Link>
          <AdicionarEmpresaCliente className="shrink-0" />
        </div>
      </section>

        <CardsResumoAgencia
          resumo={resumoExibido}
          escopo={empresaAtiva ? "cliente" : "consolidado"}
        />

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Empresas-clientes
              </h2>
              <p className="text-muted-foreground text-sm">
                Clique para abrir o workspace do cliente.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/agencia/financeiro"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Financeiro
              </Link>
              <Link
                href="/agencia/demandas"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Campanhas do cliente ativo
              </Link>
              <Link
                href="/agencia/resultados"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-1.5",
                )}
              >
                <BarChart3 className="size-4" aria-hidden />
                Resultados
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
