"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Lock,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ResumoFinanceiroEmpresaPainel } from "@/lib/financeiro/types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

type CardsResumoFinanceiroEmpresaProps = {
  resumo: ResumoFinanceiroEmpresaPainel;
};

export function CardsResumoFinanceiroEmpresa({
  resumo,
}: CardsResumoFinanceiroEmpresaProps) {
  const variacaoPositiva = resumo.variacaoMesAnterior >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <TrendingUp className="size-3.5" aria-hidden />
            Investido este mês
          </CardDescription>
          <CardTitle className="font-data text-2xl font-bold tracking-tight">
            {formatarMoeda(resumo.investidoMes)}
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
            <span className="text-muted-foreground font-normal">
              vs. mês anterior
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="border-verde-neon/30">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <Lock className="size-3.5" aria-hidden />
            Retido agora
          </CardDescription>
          <CardTitle className="font-data text-2xl font-bold">
            {formatarMoeda(resumo.retido)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            {resumo.contratosAtivos === 0
              ? "Nenhum contrato ativo"
              : resumo.contratosAtivos === 1
                ? "1 contrato ativo"
                : `${resumo.contratosAtivos} contratos ativos`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1.5">
            <Wallet className="size-3.5" aria-hidden />
            Liberado este mês
          </CardDescription>
          <CardTitle className="font-data text-2xl font-bold">
            {formatarMoeda(resumo.liberadoMes)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">
            Já creditado aos creators
          </p>
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
          <p className="text-muted-foreground text-xs">Por contrato no mês</p>
        </CardContent>
      </Card>
    </div>
  );
}
