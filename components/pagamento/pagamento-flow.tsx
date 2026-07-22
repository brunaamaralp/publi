"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Clock, Package } from "lucide-react";
import { toast } from "sonner";

import { DepositoEmpresa } from "@/components/pagamento/deposito-empresa";
import { EstadoDisputaCard } from "@/components/pagamento/estado-disputa-card";
import {
  CardPagamentoRetido,
  IndicadorProvedorPagamentoRetido,
  ValorPagamentoRetidoDestaque,
} from "@/components/pagamento/pagamento-retido-ui";
import { FormularioEntregaDialog } from "@/components/pagamento/formulario-entrega-dialog";
import { PagamentoGarantidoCard } from "@/components/pagamento/pagamento-garantido-card";
import { ReportarProblemaDialog } from "@/components/pagamento/reportar-problema-dialog";
import { ResumoPagamentoLiberado } from "@/components/pagamento/resumo-pagamento-liberado";
import { RevisaoEntregaEmpresa } from "@/components/pagamento/revisao-entrega-empresa";
import { SeletorPapelPagamento } from "@/components/pagamento/seletor-papel-pagamento";
import { ServicoAdicionalPainel } from "@/components/pagamento/servico-adicional-painel";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { rotaVoltarPagamento } from "@/lib/app/voltar-por-papel";
import {
  CONTRATO_AJUSTE_ID,
  CONTRATO_APROVADO_ID,
  CONTRATO_CNPJ_ID,
  CONTRATO_CPF_ID,
  CONTRATO_DISPUTA_MAFE_ID,
  CONTRATO_DISPUTA_NAO_ENTREGA_ID,
  CONTRATO_ENTREGUE_ID,
  getContratoPagamentoContexto,
} from "@/lib/mock-data/contratos-pagamento";
import type {
  AlvoEntrega,
  PapelPagamento,
  PagamentoFluxoEstado,
} from "@/lib/pagamento/pagamento-types";
import {
  aceitarAditivo,
  aprovarEntrega,
  carregarPagamentoEstado,
  cancelarContrato,
  diasRestantesLiberacao,
  disputaAberta,
  podeReportarProblema,
  processarLiberacoesAutomaticas,
  recusarAditivo,
  registrarDeposito,
  registrarDepositoAditivo,
  registrarEntrega,
  reportarProblemaEntrega,
  salvarPagamentoEstado,
  solicitarAditivo,
  solicitarAjusteEntrega,
  valorExibicaoPagamento,
  valorRetidoPagamentoRetido,
} from "@/lib/pagamento/pagamento-utils";
import { creditarSaldoDisponivel } from "@/lib/pagamento/saldo-influenciador";
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
  const [dialogReporteAberto, setDialogReporteAberto] = useState(false);
  const [alvoDialog, setAlvoDialog] = useState<AlvoEntrega>({
    origem: "contrato",
    id: contratoId,
  });

  const persistir = useCallback(
    (updater: (prev: PagamentoFluxoEstado) => PagamentoFluxoEstado) => {
      setEstado((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        salvarPagamentoEstado(next);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    let atual = carregarPagamentoEstado(contratoId);
    if (!atual) {
      setEstado(null);
      setCarregado(true);
      return;
    }

    const antesLiberado = valorRetidoPagamentoRetido(atual);
    const processado = processarLiberacoesAutomaticas(atual);
    const depoisLiberado = valorRetidoPagamentoRetido(processado);
    const liberouAgora = depoisLiberado < antesLiberado;

    if (liberouAgora) {
      const delta = antesLiberado - depoisLiberado;
      if (contexto) {
        creditarSaldoDisponivel(contexto.influenciador.id, delta);
      }
      salvarPagamentoEstado(processado);
      toast.message("Pagamento liberado automaticamente pelo prazo.");
    }

    setEstado(processado);
    setCarregado(true);
  }, [contratoId, contexto]);

  if (!contexto) {
    return (
      <div className="min-h-full bg-fundo-pagina">
        <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
          <h1 className="font-display text-xl font-bold">Contrato não encontrado</h1>
          <p className="text-texto-secundario mt-2 text-sm font-normal">
            Demos:{" "}
            <Link href={`/contrato/${CONTRATO_CPF_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              pendente
            </Link>
            ,{" "}
            <Link href={`/contrato/${CONTRATO_ENTREGUE_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              entregue
            </Link>
            ,{" "}
            <Link href={`/contrato/${CONTRATO_AJUSTE_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              ajuste
            </Link>
            ,{" "}
            <Link href={`/contrato/${CONTRATO_CNPJ_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              prazo vencido
            </Link>
            ,{" "}
            <Link href={`/contrato/${CONTRATO_APROVADO_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              aprovado
            </Link>
            ,{" "}
            <Link href={`/contrato/${CONTRATO_DISPUTA_NAO_ENTREGA_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              disputa não-entrega
            </Link>
            ,{" "}
            <Link href={`/contrato/${CONTRATO_DISPUTA_MAFE_ID}/pagamento`} className="text-verde-acao font-data hover:underline">
              disputa má-fé
            </Link>
            .
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

  const cicloContrato = estado.contrato;
  const emDisputaEntrega = disputaAberta(cicloContrato);
  const pagamentoLiberado =
    estado.contrato.statusEntrega === "aprovado" &&
    (estado.pagamento?.status === "liberado" ||
      valorRetidoPagamentoRetido(estado) === 0);
  const pagamentoRetido = Boolean(
    estado.pagamento && valorRetidoPagamentoRetido(estado) > 0,
  );
  const valor = valorExibicaoPagamento(estado);
  const statusEntrega = cicloContrato.statusEntrega;
  const diasRestantes = diasRestantesLiberacao(cicloContrato);
  const podeReportar = podeReportarProblema(
    cicloContrato,
    cicloContrato.prazoEntrega,
  );

  function abrirRegistro(alvo: AlvoEntrega) {
    setAlvoDialog(alvo);
    setDialogEntregaAberto(true);
  }

  function aoAprovar(alvo: AlvoEntrega) {
    persistir((prev) => {
      const retidoAntes = valorRetidoPagamentoRetido(prev);
      const next = aprovarEntrega(prev, alvo, false);
      const liberado = retidoAntes - valorRetidoPagamentoRetido(next);
      if (liberado > 0) {
        creditarSaldoDisponivel(contexto!.influenciador.id, liberado);
      }
      return next;
    });
    toast.success("Entrega aprovada — valor liberado do pagamento retido!");
  }

  function aoReportar(dados: { motivo: string; evidencia?: string }) {
    persistir((prev) =>
      reportarProblemaEntrega(prev, {
        ...dados,
        alvo: { origem: "contrato", id: prev.contratoId },
      }),
    );
    toast.message("Problema reportado — em análise pela Publi.");
  }

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
            <IndicadorProvedorPagamentoRetido className="mt-2" />
          </div>
          <SeletorPapelPagamento papel={papel} onPapelChange={setPapel} />
        </header>

        {emDisputaEntrega ? (
          <EstadoDisputaCard
            valor={valor}
            motivo={cicloContrato.disputa?.motivo}
            papel={papel}
          />
        ) : cicloContrato.disputa?.decisao === "reembolsado_empresa" ? (
          <CardPagamentoRetido status="estornado" className="space-y-3 p-4">
            <h2 className="font-display text-base font-bold">
              Disputa resolvida — reembolso à empresa
            </h2>
            <ValorPagamentoRetidoDestaque valor={valor} status="estornado" tamanho="md" />
            <p className="text-texto-secundario text-sm font-normal leading-relaxed">
              A Publi decidiu reembolsar a empresa. O valor não entrou no saldo
              do influenciador.
            </p>
            <IndicadorProvedorPagamentoRetido />
          </CardPagamentoRetido>
        ) : pagamentoLiberado || statusEntrega === "aprovado" ? (
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
        ) : pagamentoRetido &&
          papel === "influenciador" &&
          (statusEntrega === "pendente" || statusEntrega === "ajuste_solicitado") ? (
          <div className="space-y-4">
            <PagamentoGarantidoCard valor={valor} />
            {statusEntrega === "ajuste_solicitado" && cicloContrato.motivoAjuste ? (
              <div className="rounded-card border border-ambar/35 bg-lilas-claro p-4 text-sm text-lilas-escuro">
                <p className="font-medium">Ajuste solicitado</p>
                <p className="mt-1 font-normal leading-relaxed">
                  {cicloContrato.motivoAjuste}
                </p>
              </div>
            ) : null}
            <Button
              type="button"
              variant="cta"
              className="w-full"
              onClick={() =>
                abrirRegistro({ origem: "contrato", id: estado.contratoId })
              }
            >
              <Package className="size-4" aria-hidden />
              {statusEntrega === "ajuste_solicitado"
                ? "Reenviar entrega"
                : "Registrar entrega"}
            </Button>
          </div>
        ) : pagamentoRetido &&
          statusEntrega === "entregue" &&
          papel === "empresa" ? (
          <RevisaoEntregaEmpresa
            ciclo={cicloContrato}
            influenciadorNome={contexto.influenciador.nome}
            valor={valor}
            printPreview={estado.printEntregaPreview}
            onAprovar={() =>
              aoAprovar({ origem: "contrato", id: estado.contratoId })
            }
            onSolicitarAjuste={(motivo) => {
              persistir((prev) =>
                solicitarAjusteEntrega(prev, motivo, {
                  origem: "contrato",
                  id: prev.contratoId,
                }),
              );
              toast.message("Ajuste solicitado — aguardando reenvio.");
            }}
            onReportarProblema={
              podeReportar ? () => setDialogReporteAberto(true) : undefined
            }
          />
        ) : pagamentoRetido &&
          statusEntrega === "entregue" &&
          papel === "influenciador" ? (
          <div className="space-y-4">
            <PagamentoGarantidoCard valor={valor} />
            <div className="text-texto-secundario rounded-card border border-cinza-200 border-l-[3px] border-l-lilas bg-lilas-claro p-4 text-sm font-normal">
              <p className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-lilas-escuro" aria-hidden />
                <span>
                  Entrega registrada. Libera automaticamente em{" "}
                  <span className="font-data font-semibold text-lilas-escuro">
                    {diasRestantes}
                  </span>{" "}
                  dia{diasRestantes === 1 ? "" : "s"} útil
                  {diasRestantes === 1 ? "" : "eis"} se a empresa não responder.
                </span>
              </p>
            </div>
          </div>
        ) : pagamentoRetido && papel === "empresa" && statusEntrega === "pendente" ? (
          <CardPagamentoRetido status="retido" className="space-y-3 p-4">
            <ValorPagamentoRetidoDestaque valor={valor} status="retido" tamanho="md" />
            <p className="text-texto-secundario text-center text-sm font-normal">
              Pagamento reservado em garantia — aguardando o influenciador registrar a
              entrega.
            </p>
            <IndicadorProvedorPagamentoRetido />
            {podeReportar ? (
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={() => setDialogReporteAberto(true)}
              >
                <AlertTriangle className="size-4" aria-hidden />
                Reportar problema (prazo vencido)
              </Button>
            ) : null}
            {estado.contrato.dataAgendada ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  persistir((prev) => cancelarContrato(prev, contexto));
                  toast.message("Contrato cancelado — data liberada na agenda.");
                }}
              >
                Cancelar contrato e liberar agenda
              </Button>
            ) : null}
          </CardPagamentoRetido>
        ) : pagamentoRetido &&
          papel === "empresa" &&
          statusEntrega === "ajuste_solicitado" ? (
          <CardPagamentoRetido status="retido" className="space-y-3 p-4">
            <ValorPagamentoRetidoDestaque valor={valor} status="retido" tamanho="md" />
            <p className="text-texto-secundario text-center text-sm font-normal">
              Ajuste solicitado. Aguardando o influenciador reenviar a entrega.
            </p>
            {cicloContrato.motivoAjuste ? (
              <p className="text-sm leading-relaxed font-normal">
                <span className="font-medium">Motivo: </span>
                {cicloContrato.motivoAjuste}
              </p>
            ) : null}
            <IndicadorProvedorPagamentoRetido />
          </CardPagamentoRetido>
        ) : null}

        <FormularioEntregaDialog
          aberto={dialogEntregaAberto}
          onOpenChange={setDialogEntregaAberto}
          titulo={
            statusEntrega === "ajuste_solicitado"
              ? "Reenviar entrega"
              : "Registrar entrega"
          }
          motivoAjuste={
            alvoDialog.origem === "contrato"
              ? cicloContrato.motivoAjuste
              : estado.aditivos.find((a) => a.id === alvoDialog.id)?.motivoAjuste
          }
          onRegistrar={(dados) => {
            persistir((prev) =>
              registrarEntrega(prev, { ...dados, alvo: alvoDialog }),
            );
            toast.success("Entrega registrada!");
          }}
        />

        <ReportarProblemaDialog
          aberto={dialogReporteAberto}
          onOpenChange={setDialogReporteAberto}
          onReportar={aoReportar}
        />

        {estado.pagamento || estado.contrato.status === "concluida" ? (
          <ServicoAdicionalPainel
            estado={estado}
            papel={papel}
            onSolicitar={(dados) => {
              persistir((prev) => solicitarAditivo(prev, dados));
              toast.success("Proposta de serviço adicional enviada.");
            }}
            onAceitar={(id) => {
              persistir((prev) => aceitarAditivo(prev, id));
              toast.success("Serviço adicional aceito.");
            }}
            onRecusar={(id) => {
              persistir((prev) => recusarAditivo(prev, id));
              toast.message("Proposta recusada.");
            }}
            onDepositar={(id) => {
              persistir((prev) => registrarDepositoAditivo(prev, id));
              toast.success("Valor do aditivo depositado no pagamento retido.");
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
