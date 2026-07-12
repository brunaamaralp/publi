"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

import { DepositoEmpresa } from "@/components/pagamento/deposito-empresa";
import {
  BadgeStatusEscrow,
  IndicadorProvedorEscrow,
} from "@/components/pagamento/escrow-ui";
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

const CTA_PRINCIPAL =
  "border-transparent bg-verde-carvao-escuro text-verde-neon shadow-none hover:bg-verde-carvao hover:text-verde-neon";

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
      <div className="min-h-full bg-fundo-pagina">
        <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
          <h1 className="font-display text-xl font-bold">Contrato não encontrado</h1>
          <p className="text-texto-secundario mt-2 text-sm font-normal">
            Teste com{" "}
            <Link href={`/contrato/${CONTRATO_CPF_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              {CONTRATO_CPF_ID}
            </Link>{" "}
            (CPF + RPA) ou{" "}
            <Link href={`/contrato/${CONTRATO_CNPJ_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              {CONTRATO_CNPJ_ID}
            </Link>{" "}
            (CNPJ).
          </p>
        </div>
      </div>
    );
  }

  if (!carregado || !estado) {
    return (
      <div className="text-texto-secundario flex min-h-[40vh] items-center justify-center bg-fundo-pagina text-sm font-normal">
        Carregando pagamento…
      </div>
    );
  }

  const emDisputa =
    estado.contrato.status === "em_disputa" ||
    estado.entrega?.statusConfirmacao === "contestada";
  const pagamentoLiberado = estado.pagamento?.status === "liberado";
  const pagamentoRetido = estado.pagamento?.status === "retido";
  const entregaAguardando =
    estado.entrega?.statusConfirmacao === "aguardando";
  const valor = valorExibicaoPagamento(estado);

  return (
    <div className="min-h-full bg-fundo-pagina">
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
            <p className="text-texto-secundario text-sm font-medium">Escrow</p>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight">
              Pagamento e entrega
            </h1>
            <p className="text-texto-secundario mt-1 text-sm font-normal">
              {contexto.demandaTitulo}
            </p>
          </div>
          <SeletorPapelPagamento papel={papel} onPapelChange={setPapel} />
        </header>

        {emDisputa ? (
          <div className="space-y-3 rounded-card border border-ambar-claro bg-ambar-claro p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-base font-bold text-ambar-escuro">
                Pagamento em análise
              </h2>
              <BadgeStatusEscrow status="em_disputa" />
            </div>
            <p className="text-ambar-escuro/90 text-sm leading-relaxed font-normal">
              Uma das partes contestou a entrega. O valor permanece retido no
              escrow parceiro enquanto a plataforma media o caso — isso não
              indica culpa automática de influenciador ou empresa.
            </p>
            <IndicadorProvedorEscrow className="text-ambar-escuro/70" />
          </div>
        ) : null}

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
          <p className="text-texto-secundario secao-editavel border-dashed p-8 text-center text-sm font-normal">
            Aguardando a empresa depositar o valor do contrato no escrow parceiro.
          </p>
        ) : pagamentoRetido && papel === "influenciador" && !estado.entrega ? (
          <div className="space-y-4">
            <PagamentoGarantidoCard valor={valor} />
            <Button
              type="button"
              className={cn(CTA_PRINCIPAL, "w-full")}
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
            <PagamentoGarantidoCard valor={valor} />
            <p className="text-texto-secundario rounded-card border border-lilas/40 bg-lilas-claro p-4 text-center text-sm font-normal">
              Entrega registrada. Aguardando confirmação da empresa para liberar
              o pagamento.
            </p>
          </div>
        ) : pagamentoRetido && papel === "empresa" && !estado.entrega ? (
          <p className="text-texto-secundario secao-editavel p-6 text-center text-sm font-normal">
            Pagamento retido no escrow — aguardando o influenciador registrar a
            entrega.
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
    </div>
  );
}
