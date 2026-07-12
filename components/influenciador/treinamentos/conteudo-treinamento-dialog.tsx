"use client";

import { Lock, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Treinamento } from "@/lib/types";
import type { ProgressoTreinamento } from "@/lib/types";
import { getConteudoTreinamento } from "@/lib/mock-data/treinamentos";
import {
  LABELS_NIVEL,
  treinamentoDisponivel,
  XP_POR_TREINAMENTO,
} from "@/lib/treinamentos/treinamentos-utils";

type ConteudoTreinamentoDialogProps = {
  treinamento: Treinamento | null;
  status: ProgressoTreinamento["status"];
  nivelAtual: number;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConcluir: () => void;
};

export function ConteudoTreinamentoDialog({
  treinamento,
  status,
  nivelAtual,
  aberto,
  onOpenChange,
  onConcluir,
}: ConteudoTreinamentoDialogProps) {
  if (!treinamento) return null;

  const disponivel = treinamentoDisponivel(treinamento, nivelAtual);
  const concluido = status === "concluido";
  const conteudo = getConteudoTreinamento(treinamento.id);

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{treinamento.categoria}</Badge>
            <Badge variant="outline">
              {LABELS_NIVEL[treinamento.nivelRequerido] ??
                `Nível ${treinamento.nivelRequerido}`}
            </Badge>
          </div>
          <DialogTitle className="pt-2">{treinamento.titulo}</DialogTitle>
          <DialogDescription className="sr-only">
            Conteúdo da trilha de treinamento
          </DialogDescription>
        </DialogHeader>

        <article className="text-muted-foreground space-y-4 text-sm leading-relaxed">
          <p>{conteudo}</p>
          <p className="text-xs italic">
            [Conteúdo placeholder — módulos em vídeo e exercícios serão
            adicionados em versões futuras.]
          </p>
        </article>

        {!disponivel ? (
          <div className="banner-alerta flex gap-3 rounded-card p-4 text-sm">
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              Este treinamento requer nível{" "}
              <strong>
                {LABELS_NIVEL[treinamento.nivelRequerido] ??
                  treinamento.nivelRequerido}
              </strong>
              . Você está no nível{" "}
              <strong>{LABELS_NIVEL[nivelAtual] ?? nivelAtual}</strong> — pode
              ler o conteúdo, mas só concluirá quando atingir o nível necessário.
            </p>
          </div>
        ) : null}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {disponivel && !concluido ? (
            <Button type="button" onClick={onConcluir} className="gap-1.5">
              <Sparkles className="size-4" aria-hidden />
              Marcar como concluído (+{XP_POR_TREINAMENTO} XP)
            </Button>
          ) : concluido ? (
            <Button type="button" disabled variant="secondary">
              Treinamento concluído
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
