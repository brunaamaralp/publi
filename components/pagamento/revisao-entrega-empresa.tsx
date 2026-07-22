"use client";

import { useState } from "react";
import { Clock, ExternalLink } from "lucide-react";

import { CampoTextoFiltrado } from "@/components/influenciador/portfolio/campo-texto-filtrado";
import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
import {
  IndicadorProvedorPagamentoRetido,
  ValorPagamentoRetidoDestaque,
} from "@/components/pagamento/pagamento-retido-ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatarDataRelativa } from "@/lib/avaliacao/utils";
import { analisarTextoLivrePortfolio } from "@/lib/negociacao/filtro-contato";
import {
  DIAS_UTEIS_LIBERACAO_AUTOMATICA,
  MAX_CICLOS_AJUSTE,
  diasRestantesLiberacao,
  podeSolicitarAjuste,
} from "@/lib/pagamento/pagamento-utils";
import type { CamposCicloEntrega } from "@/lib/types";

type RevisaoEntregaEmpresaProps = {
  ciclo: CamposCicloEntrega;
  influenciadorNome: string;
  valor: number;
  printPreview?: string;
  onAprovar: () => void;
  onSolicitarAjuste: (motivo: string) => void;
  /** Na 3ª entrega (ciclos >= 2), alternativa ao aprovar. */
  onReportarProblema?: () => void;
};

export function RevisaoEntregaEmpresa({
  ciclo,
  influenciadorNome,
  valor,
  printPreview,
  onAprovar,
  onSolicitarAjuste,
  onReportarProblema,
}: RevisaoEntregaEmpresaProps) {
  const [modoAjuste, setModoAjuste] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [avisoMotivo, setAvisoMotivo] = useState(false);

  const diasRestantes = diasRestantesLiberacao(ciclo);
  const progresso =
    ((DIAS_UTEIS_LIBERACAO_AUTOMATICA - diasRestantes) /
      DIAS_UTEIS_LIBERACAO_AUTOMATICA) *
    100;
  const permiteAjuste = podeSolicitarAjuste(ciclo);
  const limiteAtingido = ciclo.ciclosAjusteUsados >= MAX_CICLOS_AJUSTE;

  function enviarAjuste() {
    const analise = analisarTextoLivrePortfolio(motivo);
    if (!motivo.trim()) return;
    if (!analise.podeEnviar) {
      setAvisoMotivo(true);
      return;
    }
    setAvisoMotivo(false);
    onSolicitarAjuste(motivo.trim());
    setModoAjuste(false);
    setMotivo("");
  }

  return (
    <div className="secao-editavel space-y-4 border-l-[3px] border-l-lilas ring-0">
      <div>
        <h2 className="font-display text-base font-bold">
          Entrega registrada — revisar
        </h2>
        <p className="text-texto-secundario mt-1 text-sm font-normal">
          {influenciadorNome} registrou a entrega
          {ciclo.dataEntrega
            ? ` ${formatarDataRelativa(ciclo.dataEntrega)}`
            : ""}
          . Aprove para liberar o valor do pagamento retido ou solicite ajuste (se ainda
          houver ciclos).
        </p>
      </div>

      <ValorPagamentoRetidoDestaque valor={valor} status="retido" tamanho="md" />

      <IndicadorProvedorPagamentoRetido />

      {ciclo.linkComprovante ? (
        <a
          href={ciclo.linkComprovante}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lilas-escuro inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        >
          Ver conteúdo publicado
          <ExternalLink className="size-3.5" aria-hidden />
        </a>
      ) : null}

      {ciclo.descricaoEntrega ? (
        <p className="text-texto-secundario text-sm leading-relaxed font-normal">
          {ciclo.descricaoEntrega}
        </p>
      ) : null}

      {printPreview || ciclo.arquivoComprovanteUrl ? (
        <div className="relative aspect-video max-w-sm overflow-hidden rounded-card border border-cinza-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={printPreview || ciclo.arquivoComprovanteUrl!}
            alt="Print enviado pelo influenciador"
            className="size-full object-contain"
          />
        </div>
      ) : null}

      <div className="space-y-2 rounded-card border border-cinza-200 border-l-[3px] border-l-lilas bg-lilas-claro p-3">
        <div className="text-lilas-escuro flex items-center gap-2 text-sm font-medium">
          <Clock className="size-4 shrink-0" aria-hidden />
          <span>
            Libera automaticamente em{" "}
            <span className="font-data font-semibold">{diasRestantes}</span>{" "}
            dia{diasRestantes === 1 ? "" : "s"} útil
            {diasRestantes === 1 ? "" : "eis"} se não houver resposta
          </span>
        </div>
        <Progress value={Math.min(100, Math.max(0, progresso))} className="h-1.5" />
        <p className="text-lilas-escuro/80 text-xs font-normal">
          Sem aprovação nem pedido de ajuste, o pagamento sai do pagamento retido ao fim
          do prazo ({DIAS_UTEIS_LIBERACAO_AUTOMATICA} dias úteis).
        </p>
      </div>

      {limiteAtingido ? (
        <p className="text-texto-secundario rounded-card border border-cinza-200 bg-fundo-pagina p-3 text-sm font-normal">
          Limite de solicitações de ajuste atingido para esta entrega. Você pode
          aprovar, reportar um problema à Publi ou aguardar a liberação
          automática por prazo.
        </p>
      ) : null}

      {modoAjuste ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="motivo-ajuste">O que precisa ser corrigido?</Label>
            <CampoTextoFiltrado
              id="motivo-ajuste"
              value={motivo}
              onChange={setMotivo}
              multiline
              rows={3}
              placeholder="Descreva o ajuste — sem telefone, @ ou PIX"
            />
            {avisoMotivo ? (
              <AvisoContatoInline tipo="bloqueado_padrao" variante="inline" />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setModoAjuste(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="cta" onClick={enviarAjuste}>
              Enviar pedido de ajuste
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button type="button" variant="cta" className="flex-1" onClick={onAprovar}>
            Aprovar entrega
          </Button>
          {permiteAjuste ? (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setModoAjuste(true)}
            >
              Solicitar ajuste
            </Button>
          ) : null}
          {limiteAtingido && onReportarProblema ? (
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              onClick={onReportarProblema}
            >
              Reportar problema
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
