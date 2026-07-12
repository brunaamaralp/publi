"use client";

import Image from "next/image";
import { Clock, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="border-status-negociacao/30">
      <CardHeader>
        <CardTitle className="text-base">Entrega registrada — revisar e confirmar</CardTitle>
        <CardDescription>
          {influenciadorNome} marcou a entrega{" "}
          {formatarDataRelativa(entrega.dataEntrega)}. Confirme para liberar o
          pagamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <a
          href={entrega.linkComprovante}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
        >
          Ver conteúdo publicado
          <ExternalLink className="size-3.5" aria-hidden />
        </a>

        {printPreview ? (
          <div className="border-border relative aspect-video max-w-sm overflow-hidden rounded-card border">
            <Image
              src={printPreview}
              alt="Print enviado pelo influenciador"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        ) : null}

        <div className="banner-alerta space-y-2 rounded-card p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="size-4" aria-hidden />
            <span className="font-data">{diasRestantes} dias</span> restantes para
            confirmação automática
          </div>
          <Progress value={progresso} className="h-1.5" />
          <p className="text-muted-foreground text-xs">
            Se não houver contestação, a entrega será confirmada automaticamente
            ao fim do prazo.
          </p>
        </div>

        <Button type="button" className="w-full" onClick={onConfirmar}>
          Confirmar entrega
        </Button>
      </CardContent>
    </Card>
  );
}
