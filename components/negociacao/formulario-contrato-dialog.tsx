"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contratoFormSchema } from "@/lib/schemas/contrato";
import type {
  NegociacaoContexto,
  NegociacaoEstado,
} from "@/lib/negociacao/negociacao-types";

type FormularioContratoDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  contexto: NegociacaoContexto;
  estado: NegociacaoEstado;
  onGerar: (dados: {
    escopo: string;
    valor: number;
    prazoEntrega: string;
  }) => void;
};

function valoresIniciais(
  contexto: NegociacaoContexto,
  estado: NegociacaoEstado,
) {
  if (estado.termosPropostos) return estado.termosPropostos;
  if (estado.contrato) {
    return {
      escopo: estado.contrato.escopo,
      valor: estado.contrato.valor,
      prazoEntrega: estado.contrato.prazoEntrega,
    };
  }
  return {
    escopo: contexto.demanda.briefing,
    valor: contexto.demanda.orcamento,
    prazoEntrega: contexto.demanda.prazo,
  };
}

export function FormularioContratoDialog({
  aberto,
  onOpenChange,
  contexto,
  estado,
  onGerar,
}: FormularioContratoDialogProps) {
  const { demanda } = contexto;
  const iniciais = valoresIniciais(contexto, estado);
  const [escopo, setEscopo] = useState(iniciais.escopo);
  const [valor, setValor] = useState<number | "">(iniciais.valor);
  const [prazoEntrega, setPrazoEntrega] = useState(iniciais.prazoEntrega);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!aberto) return;
    const next = valoresIniciais(contexto, estado);
    setEscopo(next.escopo);
    setValor(next.valor);
    setPrazoEntrega(next.prazoEntrega);
    setErrors({});
  }, [aberto, contexto, estado]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = contratoFormSchema.safeParse({
      escopo,
      valor: valor === "" ? undefined : Number(valor),
      prazoEntrega,
    });

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string") next[path] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    onGerar(result.data);
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Fechar contrato</DialogTitle>
          <DialogDescription>
            Use os valores combinados na conversa para{" "}
            <strong>{demanda.titulo}</strong>. Orçamento e briefing da demanda
            são só o ponto de partida — ajuste o que foi negociado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="escopo-contrato">Escopo do trabalho</Label>
            <Textarea
              id="escopo-contrato"
              value={escopo}
              onChange={(e) => setEscopo(e.target.value)}
              rows={5}
              aria-invalid={!!errors.escopo}
            />
            {errors.escopo ? (
              <p role="alert" className="text-destructive text-sm">
                {errors.escopo}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="valor-contrato">Valor (R$)</Label>
              <Input
                id="valor-contrato"
                type="number"
                min={1}
                className="font-data"
                value={valor}
                onChange={(e) =>
                  setValor(e.target.value === "" ? "" : Number(e.target.value))
                }
                aria-invalid={!!errors.valor}
              />
              {errors.valor ? (
                <p role="alert" className="text-destructive text-sm">
                  {errors.valor}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazo-contrato">Prazo de entrega</Label>
              <Input
                id="prazo-contrato"
                type="date"
                className="font-data"
                value={prazoEntrega}
                onChange={(e) => setPrazoEntrega(e.target.value)}
                aria-invalid={!!errors.prazoEntrega}
              />
              {errors.prazoEntrega ? (
                <p role="alert" className="text-destructive text-sm">
                  {errors.prazoEntrega}
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Gerar contrato</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
