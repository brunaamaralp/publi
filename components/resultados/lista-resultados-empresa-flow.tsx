"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

import { SeletorEmpresaCliente } from "@/components/agencia/seletor-empresa-cliente";
import { BadgeStatusResultado } from "@/components/resultados/badge-status-resultado";
import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";
import type { ResultadoCampanhaRegistro } from "@/lib/mock-data/resultados";
import {
  carregarResultados,
  LABELS_STATUS_RESULTADO,
} from "@/lib/resultados/resultados-utils";
import { cn } from "@/lib/utils";

function filtrarPorEmpresa(
  registros: ResultadoCampanhaRegistro[],
  empresaId?: string,
): ResultadoCampanhaRegistro[] {
  if (!empresaId) return registros;
  return registros.filter((r) => r.meta.empresaId === empresaId);
}

export function ListaResultadosEmpresaFlow() {
  const agenciaCtx = useAgenciaOpcional();
  const [registros, setRegistros] = useState<ResultadoCampanhaRegistro[]>([]);
  const [carregado, setCarregado] = useState(false);

  const isAgencia = !!agenciaCtx?.agencia;
  const empresaIdFiltro = isAgencia ? agenciaCtx?.empresaAtivaId : undefined;

  useEffect(() => {
    setRegistros(carregarResultados());
    setCarregado(true);
  }, []);

  const itens = filtrarPorEmpresa(registros, empresaIdFiltro ?? undefined);

  if (!carregado) {
    return (
      <div className="text-texto-secundario flex min-h-[40vh] items-center justify-center text-sm font-normal">
        Carregando resultados…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-4">
        <div>
          <p className="text-texto-secundario text-sm font-medium">Campanhas</p>
          <h1 className="font-display mt-1 text-2xl font-bold tracking-tight">
            Resultados de campanha
          </h1>
          <p className="text-texto-secundario mt-2 text-sm font-normal">
            Acompanhe métricas, solicite preenchimento e valide entregas
            concluídas.
          </p>
        </div>

        {isAgencia ? (
          <div className="secao-editavel max-w-md space-y-2 p-4 ring-0">
            <p className="text-texto-secundario text-xs font-normal">
              Filtrar por cliente
            </p>
            <SeletorEmpresaCliente />
          </div>
        ) : null}
      </header>

      {itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-cinza-200 px-6 py-16 text-center">
          <BarChart3
            className="text-texto-secundario mb-4 size-10"
            aria-hidden
          />
          <p className="text-texto-secundario max-w-sm text-sm font-normal">
            Nenhum resultado de campanha encontrado
            {isAgencia ? " para o cliente selecionado" : ""}.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {itens.map((item) => (
            <li key={item.resultado.id}>
              <Link
                href={`/resultados/${item.resultado.contratoId}`}
                className={cn(
                  "flex flex-col gap-3 rounded-card border border-cinza-200 bg-white p-4 transition-colors hover:border-lilas/40 sm:flex-row sm:items-center sm:justify-between",
                  "border-l-[3px] border-l-lilas",
                )}
              >
                <div className="min-w-0 space-y-1">
                  <h2 className="font-display truncate text-base font-bold">
                    {item.meta.campanhaTitulo}
                  </h2>
                  <p className="text-texto-secundario text-sm font-normal">
                    {item.meta.influenciadorNome}
                    <span className="text-cinza-400"> · </span>
                    <span className="font-data text-xs">
                      {item.resultado.contratoId}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <BadgeStatusResultado status={item.resultado.status} />
                  <span className="text-texto-secundario text-xs font-normal">
                    {LABELS_STATUS_RESULTADO[item.resultado.status]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!isAgencia && itens.length > 0 ? (
        <p className="text-texto-secundario text-center text-xs font-normal">
          Exibindo campanhas vinculadas à sua conta (
          <span className="font-data">{EMPRESA_NEGOCIACAO_USUARIO_ID}</span> em
          demo).
        </p>
      ) : null}
    </div>
  );
}
