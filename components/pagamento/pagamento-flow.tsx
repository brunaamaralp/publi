"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

import { DepositoEmpresa } from "@/components/pagamento/deposito-empresa";
import { FormularioEntregaDialog } from "@/components/pagamento/formulario-entrega-dialog";
import { PagamentoGarantidoCard } from "@/components/pagamento/pagamento-garantido-card";
import { ResumoPagamentoLiberado } from "@/components/pagamento/resumo-pagamento-liberado";
import { RevisaoEntregaEmpresa } from "@/components/pagamento/revisao-entrega-empresa";
import { SeletorPapelPagamento } from "@/components/pagamento/seletor-papel-pagamento";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  CONTRATO_CNPJ_ID,
  CONTRATO_CPF_ID,
  getContratoPagamentoContexto,
} from "@/lib/mock-data/contratos-pagamento";
import type { PapelPagamento, PagamentoFluxoEstado } from "@/lib/pagamento/pagamento-types";
import {
  carregarPagamentoEstado,
  confirmarEntrega,
  registrarDeposito,
  registrarEntrega,
  salvarPagamentoEstado,
  valorExibicaoPagamento,
} from "@/lib/pagamento/pagamento-utils";
import { cn } from "@/lib/utils";

type PagamentoFlowProps = {
  contratoId: string;
};

export function PagamentoFlow({ contratoId }: PagamentoFlowProps) {
  const contexto = getContratoPagamentoContexto(contratoId);
  const [estado, setEstado] = useState<PagamentoFluxoEstado | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [papel, setPapel] = useState<PapelPagamento>("empresa");
  const [dialogEntregaAberto, setDialogEntregaAberto] = useState(false);

  useEffect(() => {
    setEstado(carregarPagamentoEstado(contratoId));
    setCarregado(true);
  }, [contratoId]);

  const persistir = useCallback((updater: (prev: PagamentoFluxoEstado) => PagamentoFluxoEstado) => {
    setEstado((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      salvarPagamentoEstado(next);
      return next;
    });
  }, []);

  if (!contexto) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-xl font-semibold">Contrato não encontrado</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Teste com{" "}
          <Link href={`/contrato/${CONTRATO_CPF_ID}/pagamento`} className="text-primary font-data hover:underline">
            {CONTRATO_CPF_ID}
          </Link>{" "}
          (CPF + RPA) ou{" "}
          <Link href={`/contrato/${CONTRATO_CNPJ_ID}/pagamento`} className="text-primary font-data hover:underline">
            {CONTRATO_CNPJ_ID}
          </Link>{" "}
          (CNPJ).
        </p>
      </div>
    );
  }

  if (!carregado || !estado) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
        Carregando pagamento…
      </div>
    );
  }

  const pagamentoLiberado = estado.pagamento?.status === "liberado";
  const pagamentoRetido = estado.pagamento?.status === "retido";
  const entregaAguardando =
    estado.entrega?.statusConfirmacao === "aguardando";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-4">
        <Link
          href="/empresa/demandas"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar
        </Link>
        <div>
          <p className="text-primary text-sm font-medium">Escrow</p>
          <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight">
            Pagamento e entrega
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {contexto.demandaTitulo}
          </p>
        </div>
        <SeletorPapelPagamento papel={papel} onPapelChange={setPapel} />
      </header>

      {pagamentoLiberado ? (
        <ResumoPagamentoLiberado
          estado={estado}
          contexto={contexto}
          papel={papel}
        />
      ) : !estado.pagamento && papel === "empresa" ? (
        <DepositoEmpresa
          contexto={contexto}
          onDepositoConfirmado={(municipioRpa) => {
            persistir((prev) => registrarDeposito(prev, contexto, municipioRpa));
            toast.success("Valor depositado em escrow!");
          }}
        />
      ) : !estado.pagamento && papel === "influenciador" ? (
        <p className="text-muted-foreground rounded-card border border-dashed p-8 text-center text-sm">
          Aguardando a empresa depositar o valor do contrato na plataforma.
        </p>
      ) : pagamentoRetido && papel === "influenciador" && !estado.entrega ? (
        <div className="space-y-4">
          <PagamentoGarantidoCard valor={valorExibicaoPagamento(estado)} />
          <Button
            type="button"
            className="w-full"
            onClick={() => setDialogEntregaAberto(true)}
          >
            <Package className="size-4" aria-hidden />
            Marcar como entregue
          </Button>
        </div>
      ) : pagamentoRetido && entregaAguardando && papel === "empresa" ? (
        <RevisaoEntregaEmpresa
          entrega={estado.entrega!}
          influenciadorNome={contexto.influenciador.nome}
          printPreview={estado.printEntregaPreview}
          onConfirmar={() => {
            persistir(confirmarEntrega);
            toast.success("Entrega confirmada — pagamento liberado!");
          }}
        />
      ) : pagamentoRetido && entregaAguardando && papel === "influenciador" ? (
        <div className="space-y-4">
          <PagamentoGarantidoCard valor={valorExibicaoPagamento(estado)} />
          <p className="text-muted-foreground banner-alerta rounded-card p-4 text-center text-sm">
            Entrega registrada. Aguardando confirmação da empresa para liberar o
            pagamento.
          </p>
        </div>
      ) : pagamentoRetido && papel === "empresa" && !estado.entrega ? (
        <p className="text-muted-foreground rounded-card border p-6 text-center text-sm">
          Pagamento retido — aguardando o influenciador registrar a entrega.
        </p>
      ) : null}

      <FormularioEntregaDialog
        aberto={dialogEntregaAberto}
        onOpenChange={setDialogEntregaAberto}
        onRegistrar={(link, printPreview) => {
          persistir((prev) => registrarEntrega(prev, link, printPreview));
          toast.success("Entrega registrada!");
        }}
      />
    </div>
  );
}
