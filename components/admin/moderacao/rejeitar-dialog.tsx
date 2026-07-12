"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getNomeExibicao } from "@/lib/moderacao/moderacao-utils";
import type { UsuarioPendenteModeracao } from "@/lib/mock-data/moderacao";

type RejeitarDialogProps = {
  item: UsuarioPendenteModeracao | null;
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
  onConfirmar: (motivo: string) => void;
};

export function RejeitarDialog({
  item,
  aberto,
  onAbertoChange,
  onConfirmar,
}: RejeitarDialogProps) {
  const [motivo, setMotivo] = useState("");

  function handleConfirmar() {
    if (!motivo.trim()) return;
    onConfirmar(motivo.trim());
    setMotivo("");
  }

  function handleAbertoChange(open: boolean) {
    if (!open) setMotivo("");
    onAbertoChange(open);
  }

  return (
    <Dialog open={aberto} onOpenChange={handleAbertoChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rejeitar cadastro</DialogTitle>
          <DialogDescription>
            {item
              ? `Informe o motivo da rejeição de ${getNomeExibicao(item)}. O status será alterado para suspenso.`
              : "Informe o motivo da rejeição."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="motivo-rejeicao" className="text-xs">
            Motivo / observação
          </Label>
          <Textarea
            id="motivo-rejeicao"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex.: métricas inconsistentes, documentação incompleta..."
            className="min-h-24 text-sm"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => handleAbertoChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={!motivo.trim()}
            onClick={handleConfirmar}
          >
            Confirmar rejeição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
