"use client";

import Image from "next/image";
import { Clock, ExternalLink } from "lucide-react";

import {
  IndicadorProvedorEscrow,
  ValorEscrowDestaque,
} from "@/components/pagamento/escrow-ui";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Entrega } from "@/lib/types";
import {
  diasRestantesConfirmacaoAutomatica,
  prazoConfirmacaoAutomaticaDias,
} from "@/lib/pagamento/pagamento-utils";
import { formatarDataRelativa } from "@/lib/avaliacao/utils";

type RevisaoEntregaEmpresaProps = {
  entrega: Entrega;
  influenciadorNome: string;
  valor: number;
  printPreview?: string;
  onConfirmar: () => void;
};

export function RevisaoEntregaEmpresa({
  entrega,
  influenciadorNome,
  valor,
  printPreview,
  onConfirmar,
}: RevisaoEntregaEmpresaProps) {
  const diasRestantes = diasRestantesConfirmacaoAutomatica();
  const progresso =
    ((prazoConfirmacaoAutomaticaDias() - diasRestantes) /
      prazoConfirmacaoAutomaticaDias()) *
    100;

  return (
    <div className="secao-editavel space-y-4 border-l-[3px] border-l-lilas ring-0">
      <div>
        <h2 className="font-display text-base font-bold">
          Entrega registrada — revisar e confirmar
        </h2>
        <p className="text-texto-secundario mt-1 text-sm font-normal">
          {influenciadorNome} marcou a entrega{" "}
          {formatarDataRelativa(entrega.dataEntrega)}. Confirme para liberar o
          pagamento.
        </p>
      </div>

      <ValorEscrowDestaque valor={valor} status="retido" tamanho="md" />

      <IndicadorProvedorEscrow />

      <a
        href={entrega.linkComprovante}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lilas-escuro inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
      >
        Ver conteúdo publicado
        <ExternalLink className="size-3.5" aria-hidden />
      </a>

      {printPreview ? (
        <div className="relative aspect-video max-w-sm overflow-hidden rounded-card border border-cinza-200 bg-white">
          <Image
            src={printPreview}
            alt="Print enviado pelo influenciador"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      ) : null}

      <div className="space-y-2 rounded-card border border-cinza-200 border-l-[3px] border-l-lilas bg-lilas-claro p-3">
        <div className="text-lilas-escuro flex items-center gap-2 text-sm font-medium">
          <Clock className="size-4 shrink-0" aria-hidden />
          <span>
            <span className="font-data font-semibold">{diasRestantes}</span>{" "}
            dias restantes para confirmação automática
          </span>
        </div>
        <Progress value={progresso} className="h-1.5" />
        <p className="text-lilas-escuro/80 text-xs font-normal">
          Se não houver contestação, a entrega será confirmada automaticamente
          ao fim do prazo.
        </p>
      </div>

      <Button type="button" variant="cta" className="w-full" onClick={onConfirmar}>
        Confirmar entrega
      </Button>
    </div>
  );
}
