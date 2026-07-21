"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

import { DepositoEmpresa } from "@/components/pagamento/deposito-empresa";
import {
  BadgeStatusEscrow,
  CardEscrow,
  IndicadorProvedorEscrow,
  ValorEscrowDestaque,
} from "@/components/pagamento/escrow-ui";
import { FormularioEntregaDialog } from "@/components/pagamento/formulario-entrega-dialog";
import { PagamentoGarantidoCard } from "@/components/pagamento/pagamento-garantido-card";
import { ResumoPagamentoLiberado } from "@/components/pagamento/resumo-pagamento-liberado";
import { RevisaoEntregaEmpresa } from "@/components/pagamento/revisao-entrega-empresa";
import { SeletorPapelPagamento } from "@/components/pagamento/seletor-papel-pagamento";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { rotaVoltarPagamento } from "@/lib/app/voltar-por-papel";
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
  const { usuario } = useAuth();
  const contexto = getContratoPagamentoContexto(contratoId);
  const rotaVoltar = usuario
    ? rotaVoltarPagamento(usuario.tipo)
    : "/empresa/demandas";
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
            (CPF + recibo) ou{" "}
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
            href={rotaVoltar}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Voltar
          </Link>
          <div>
            <p className="text-texto-secundario text-sm font-medium">Pagamento protegido</p>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight">
              Pagamento e entrega
            </h1>
            <p className="text-texto-secundario mt-1 text-sm font-normal">
              {contexto.demandaTitulo}
            </p>
            <IndicadorProvedorEscrow className="mt-2" />
          </div>
          <SeletorPapelPagamento papel={papel} onPapelChange={setPapel} />
        </header>

        {emDisputa ? (
          <CardEscrow status="em_disputa" className="space-y-3 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-base font-bold text-ambar-escuro">
                Pagamento em análise
              </h2>
              <BadgeStatusEscrow status="em_disputa" />
            </div>
            <ValorEscrowDestaque valor={valor} status="em_disputa" tamanho="md" />
            <p className="text-ambar-escuro/90 text-sm leading-relaxed font-normal">
              Uma das partes contestou a entrega. O valor permanece reservado em
              garantia enquanto a plataforma media o caso — isso não
              indica culpa automática de influenciador ou empresa.
            </p>
            <IndicadorProvedorEscrow className="text-cinza-500" />
          </CardEscrow>
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
              toast.success("Valor depositado com proteção!");
            }}
          />
        ) : !estado.pagamento && papel === "influenciador" ? (
          <p className="text-texto-secundario secao-editavel border-dashed p-8 text-center text-sm font-normal">
            Aguardando a empresa depositar o valor do contrato na conta de garantia.
          </p>
        ) : pagamentoRetido && papel === "influenciador" && !estado.entrega ? (
          <div className="space-y-4">
            <PagamentoGarantidoCard valor={valor} />
            <Button
              type="button"
              variant="cta"
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
            valor={valor}
            printPreview={estado.printEntregaPreview}
            onConfirmar={() => {
              persistir(confirmarEntrega);
              toast.success("Entrega confirmada — pagamento liberado!");
            }}
          />
        ) : pagamentoRetido && entregaAguardando && papel === "influenciador" ? (
          <div className="space-y-4">
            <PagamentoGarantidoCard valor={valor} />
            <p className="text-texto-secundario rounded-card border border-cinza-200 border-l-[3px] border-l-lilas bg-lilas-claro p-4 text-center text-sm font-normal">
              Entrega registrada. Aguardando confirmação da empresa para liberar
              o pagamento.
            </p>
          </div>
        ) : pagamentoRetido && papel === "empresa" && !estado.entrega ? (
          <CardEscrow status="retido" className="space-y-3 p-4">
            <ValorEscrowDestaque valor={valor} status="retido" tamanho="md" />
            <p className="text-texto-secundario text-center text-sm font-normal">
              Pagamento reservado em garantia — aguardando o influenciador registrar a
              entrega.
            </p>
            <IndicadorProvedorEscrow />
          </CardEscrow>
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
