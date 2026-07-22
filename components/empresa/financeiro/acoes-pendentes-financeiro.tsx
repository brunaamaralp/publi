"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AcaoDashboardEmpresa } from "@/lib/empresa/dashboard-utils";
import { cn } from "@/lib/utils";

type AcoesPendentesFinanceiroProps = {
  acoes: AcaoDashboardEmpresa[];
  total: number;
};

export function AcoesPendentesFinanceiro({
  acoes,
  total,
}: AcoesPendentesFinanceiroProps) {
  return (
    <Card className="border-cinza-200 bg-white ring-0">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold">
          Ações financeiras
        </CardTitle>
        <CardDescription className="text-texto-secundario font-normal">
          Depósitos, revisões de entrega e pendências ligadas ao pagamento
          protegido
          {total > acoes.length ? ` · ${total} no total` : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {acoes.length === 0 ? (
          <div className="rounded-button border border-cinza-200 px-4 py-6 text-center">
            <CheckCircle2
              className="text-verde-neon mx-auto size-7"
              aria-hidden
            />
            <p className="font-display mt-2 text-sm font-bold">Tudo em dia</p>
            <p className="text-texto-secundario mt-1 text-xs">
              Nenhuma ação financeira pendente no momento.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {acoes.map((acao) => (
              <li key={acao.id}>
                <Link
                  href={acao.href}
                  className="group flex items-center justify-between gap-3 rounded-button border border-cinza-200 border-l-[3px] border-l-verde-neon px-3 py-2.5 transition-colors hover:bg-fundo-pagina"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-display text-sm font-bold leading-snug">
                      {acao.titulo}
                    </p>
                    <p className="text-texto-secundario text-xs capitalize">
                      {acao.influenciadorNome}
                    </p>
                  </div>
                  <span
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "shrink-0",
                    )}
                  >
                    {acao.acaoLabel}
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
