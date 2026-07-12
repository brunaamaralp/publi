"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell } from "lucide-react";
import { toast } from "sonner";

import { SeletorEmpresaCliente } from "@/components/agencia/seletor-empresa-cliente";
import { DashboardResultadoCampanha } from "@/components/resultados/dashboard-resultado-campanha";
import { VisaoConsolidadaAgencia } from "@/components/resultados/visao-consolidada-agencia";
import { BadgeStatusResultado } from "@/components/resultados/badge-status-resultado";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { getResultadoPorContratoId } from "@/lib/mock-data/resultados";
import type { ResultadoCampanhaRegistro } from "@/lib/mock-data/resultados";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/mock-data/negociacao";
import {
  carregarResultados,
  consolidarResultadosEmpresa,
  salvarResultados,
  solicitarResultado,
} from "@/lib/resultados/resultados-utils";
import { cn } from "@/lib/utils";

type ResultadosEmpresaFlowProps = {
  contratoId: string;
};

export function ResultadosEmpresaFlow({ contratoId }: ResultadosEmpresaFlowProps) {
  const agenciaCtx = useAgenciaOpcional();
  const [registros, setRegistros] = useState<ResultadoCampanhaRegistro[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setRegistros(carregarResultados());
    setCarregado(true);
  }, []);

  const persistir = useCallback((next: ResultadoCampanhaRegistro[]) => {
    setRegistros(next);
    salvarResultados(next);
  }, []);

  const registro = getResultadoPorContratoId(registros, contratoId);
  const isAgencia = !!agenciaCtx?.agencia && !!agenciaCtx.empresaAtiva;
  const empresaIdConsolidacao =
    isAgencia && agenciaCtx?.empresaAtivaId
      ? agenciaCtx.empresaAtivaId
      : registro?.meta.empresaId;
  const empresaNome =
    isAgencia && agenciaCtx?.empresaAtiva
      ? (agenciaCtx.empresaAtiva.nomeFantasia ??
        agenciaCtx.empresaAtiva.razaoSocial)
      : registro?.meta.empresaNome;

  const metricasConsolidadas =
    isAgencia && empresaIdConsolidacao
      ? consolidarResultadosEmpresa(registros, empresaIdConsolidacao)
      : null;

  if (!carregado) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
        Carregando…
      </div>
    );
  }

  if (!registro) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-xl font-semibold">
          Contrato não encontrado
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Não há registro de resultado para{" "}
          <span className="font-data">{contratoId}</span>.
        </p>
        <p className="text-muted-foreground mt-4 text-xs">
          Exemplos:{" "}
          <Link href="/resultados/ctr-cpf-001" className="text-primary hover:underline">
            ctr-cpf-001
          </Link>
          ,{" "}
          <Link href="/resultados/ctr-mock-005" className="text-primary hover:underline">
            ctr-mock-005
          </Link>
        </p>
      </div>
    );
  }

  const temResultado =
    registro.resultado.status === "preenchido" ||
    registro.resultado.status === "validado";
  const podeSolicitar =
    registro.resultado.status === "nao_solicitado";

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-4">
        <Link
          href="/empresa/demandas"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar
        </Link>
        <div>
          <p className="text-primary text-sm font-medium">Resultados</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            {registro.meta.campanhaTitulo}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Contrato <span className="font-data">{contratoId}</span>
          </p>
        </div>

        {isAgencia ? (
          <div className="border-border flex flex-col gap-3 rounded-card border p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Agência{" "}
              <span className="text-foreground font-medium">
                {agenciaCtx.agencia?.razaoSocial}
              </span>
            </p>
            <SeletorEmpresaCliente />
          </div>
        ) : null}
      </header>

      {isAgencia && metricasConsolidadas && empresaNome ? (
        <VisaoConsolidadaAgencia
          empresaNome={empresaNome}
          metricas={metricasConsolidadas}
        />
      ) : null}

      {temResultado ? (
        <DashboardResultadoCampanha registro={registro} />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Resultado pendente</CardTitle>
                <CardDescription className="mt-1">
                  {registro.meta.influenciadorNome} ainda não preencheu as
                  métricas desta campanha.
                </CardDescription>
              </div>
              <BadgeStatusResultado status={registro.resultado.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {registro.resultado.status === "solicitado" ? (
              <div className="banner-informativo flex gap-3 rounded-card p-4 text-sm">
                <Bell className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                <p>
                  Solicitação enviada — o influenciador foi notificado (mock) e
                  deve preencher em breve.
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Solicite o preenchimento para que o influenciador registre
                impressões, alcance e engajamento da campanha.
              </p>
            )}
            {podeSolicitar ? (
              <Button
                type="button"
                onClick={() => {
                  persistir(
                    solicitarResultado(
                      registros,
                      contratoId,
                      EMPRESA_NEGOCIACAO_USUARIO_ID,
                    ),
                  );
                  toast.success(
                    "Solicitação enviada! O influenciador foi notificado.",
                  );
                }}
              >
                Solicitar resultado
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
