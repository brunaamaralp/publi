"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  Receipt,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ResumoFinanceiro } from "@/lib/financeiro/types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

type CardsResumoFinanceiroProps = {
  resumo: ResumoFinanceiro;
  /** destaque = KPIs acima da dobra; projecao = só card de projeção; completo = tudo */
  variante?: "destaque" | "projecao" | "completo";
};

export function CardsResumoFinanceiro({
  resumo,
  variante = "completo",
}: CardsResumoFinanceiroProps) {
  const variacaoPositiva = resumo.variacaoMesAnterior >= 0;
  const projecao = resumo.projecaoMes ?? resumo.ganhosMesAtual;

  if (variante === "projecao") {
    return (
      <Card className="banner-informativo border-0">
        <CardHeader className="pb-2">
          <CardDescription>Projeção</CardDescription>
          <CardTitle className="text-base font-semibold">
            Ritmo de crescimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-texto-secundario text-sm leading-relaxed">
            Mantendo o ritmo deste mês, a projeção de fechamento é{" "}
            <span className="text-foreground font-data font-medium">
              {formatarMoeda(projecao)}
            </span>
            .
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        variante === "destaque"
          ? "sm:grid-cols-3"
          : "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      <Card className={variante === "completo" ? "sm:col-span-2 lg:col-span-1" : undefined}>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <TrendingUp className="size-3.5" aria-hidden />
            Ganhos este mês
          </CardDescription>
          <CardTitle className="font-data text-3xl font-bold tracking-tight">
            {formatarMoeda(resumo.ganhosMesAtual)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium",
              variacaoPositiva ? "text-verde-acao" : "text-destructive",
            )}
          >
            {variacaoPositiva ? (
              <ArrowUpRight className="size-4" aria-hidden />
            ) : (
              <ArrowDownRight className="size-4" aria-hidden />
            )}
            <span className="font-data">
              {variacaoPositiva ? "+" : ""}
              {resumo.variacaoMesAnterior.toFixed(1)}%
            </span>
            <span className="text-texto-secundario font-normal">
              vs. mês anterior
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <FileText className="size-3.5" aria-hidden />
            Contratos concluídos
          </CardDescription>
          <CardTitle className="font-data text-2xl font-bold">
            {resumo.contratosConcluidosMes}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-texto-secundario text-xs">Neste mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <Receipt className="size-3.5" aria-hidden />
            Ticket médio
          </CardDescription>
          <CardTitle className="font-data text-2xl font-bold">
            {formatarMoeda(resumo.ticketMedio)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-texto-secundario text-xs">Por contrato fechado</p>
        </CardContent>
      </Card>

      {variante === "completo" ? (
        <Card className="banner-informativo border-0 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Projeção</CardDescription>
            <CardTitle className="text-base font-semibold">
              Ritmo de crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-texto-secundario text-sm leading-relaxed">
              Mantendo o ritmo deste mês, a projeção de fechamento é{" "}
              <span className="text-foreground font-data font-medium">
                {formatarMoeda(projecao)}
              </span>
              .
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
