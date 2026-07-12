"use client";

import Image from "next/image";
import { Clock, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Entrega } from "@/lib/types";
import {
  diasRestantesConfirmacaoAutomatica,
  prazoConfirmacaoAutomaticaDias,
} from "@/lib/pagamento/pagamento-utils";
import { formatarDataRelativa } from "@/lib/avaliacao/utils";
import { cn } from "@/lib/utils";

const CTA_CONFIRMAR =
  "border-transparent bg-verde-carvao-escuro text-verde-neon shadow-none hover:bg-verde-carvao hover:text-verde-neon";

type RevisaoEntregaEmpresaProps = {
  entrega: Entrega;
  influenciadorNome: string;
  printPreview?: string;
  onConfirmar: () => void;
};

export function RevisaoEntregaEmpresa({
  entrega,
  influenciadorNome,
  printPreview,
  onConfirmar,
}: RevisaoEntregaEmpresaProps) {
  const diasRestantes = diasRestantesConfirmacaoAutomatica();
  const progresso =
    ((prazoConfirmacaoAutomaticaDias() - diasRestantes) /
      prazoConfirmacaoAutomaticaDias()) *
    100;

  return (
    <div className="secao-editavel space-y-4">
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

      <a
        href={entrega.linkComprovante}
        target="_blank"
        rel="noopener noreferrer"
        className="text-verde-acao inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
      >
        Ver conteúdo publicado
        <ExternalLink className="size-3.5" aria-hidden />
      </a>

      {printPreview ? (
        <div className="border-border relative aspect-video max-w-sm overflow-hidden rounded-card border bg-white">
          <Image
            src={printPreview}
            alt="Print enviado pelo influenciador"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      ) : null}

      <div className="space-y-2 rounded-card border border-lilas/40 bg-lilas-claro p-3">
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

      <Button
        type="button"
        className={cn(CTA_CONFIRMAR, "w-full")}
        onClick={onConfirmar}
      >
        Confirmar entrega
      </Button>
    </div>
  );
}
