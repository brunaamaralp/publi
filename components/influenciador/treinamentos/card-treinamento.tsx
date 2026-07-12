"use client";

import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Treinamento } from "@/lib/types";
import type { ProgressoTreinamento } from "@/lib/types";
import { LABELS_NIVEL } from "@/lib/treinamentos/treinamentos-utils";
import { cn } from "@/lib/utils";

type CardTreinamentoProps = {
  treinamento: Treinamento;
  status: ProgressoTreinamento["status"];
  nivelAtual: number;
  onClick: () => void;
};

export function CardTreinamento({
  treinamento,
  status,
  nivelAtual,
  onClick,
}: CardTreinamentoProps) {
  const bloqueado = nivelAtual < treinamento.nivelRequerido;
  const concluido = status === "concluido";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left transition-opacity outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50 rounded-card",
        bloqueado && "opacity-75",
      )}
    >
      <Card
        className={cn(
          "h-full transition-colors hover:bg-muted/30",
          concluido && "border-verde-acao/25 bg-verde-acao/5",
          bloqueado && "border-dashed",
        )}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <IconeStatus status={status} bloqueado={bloqueado} />
            <Badge
              variant="outline"
              className={cn(
                bloqueado
                  ? "border-cinza-500/30 text-cinza-500"
                  : "border-verde-acao/25 text-verde-acao",
              )}
            >
              {bloqueado ? (
                <span className="inline-flex items-center gap-1">
                  <Lock className="size-3" aria-hidden />
                  Nv. {treinamento.nivelRequerido}
                </span>
              ) : (
                LABELS_NIVEL[treinamento.nivelRequerido] ??
                `Nv. ${treinamento.nivelRequerido}`
              )}
            </Badge>
          </div>
          <CardTitle className="text-base leading-snug">
            {treinamento.titulo}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            <span>{treinamento.categoria}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs">{labelStatus(status)}</span>
          </CardDescription>
        </CardHeader>
      </Card>
    </button>
  );
}

function IconeStatus({
  status,
  bloqueado,
}: {
  status: ProgressoTreinamento["status"];
  bloqueado: boolean;
}) {
  if (bloqueado) {
    return (
      <Lock
        className="text-cinza-500 size-5 shrink-0"
        aria-label="Nível insuficiente"
      />
    );
  }
  if (status === "concluido") {
    return (
      <CheckCircle2
        className="text-verde-acao size-5 shrink-0"
        aria-label="Concluído"
      />
    );
  }
  if (status === "em_andamento") {
    return (
      <PlayCircle
        className="text-primary size-5 shrink-0"
        aria-label="Em andamento"
      />
    );
  }
  return (
    <Circle
      className="text-muted-foreground size-5 shrink-0"
      aria-label="Não iniciado"
    />
  );
}

function labelStatus(status: ProgressoTreinamento["status"]) {
  switch (status) {
    case "concluido":
      return "Concluído";
    case "em_andamento":
      return "Em andamento";
    default:
      return "Não iniciado";
  }
}
