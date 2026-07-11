"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EstrelasInput } from "@/components/avaliacao/estrelas-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { jaAvaliouContrato } from "@/lib/avaliacao/utils";
import { avaliacaoFormSchema } from "@/lib/schemas/avaliacao";
import type { Avaliacao } from "@/lib/types";
import type { Contrato } from "@/lib/types/contrato";
import { cn } from "@/lib/utils";

type AvaliacaoDialogProps = {
  contrato: Pick<Contrato, "id" | "status">;
  avaliadorId: string;
  avaliadoId: string;
  nomeContraparte: string;
  avaliacoesExistentes: Avaliacao[];
  onAvaliacaoEnviada?: (avaliacao: Avaliacao) => void;
  className?: string;
};

export function AvaliacaoDialog({
  contrato,
  avaliadorId,
  avaliadoId,
  nomeContraparte,
  avaliacoesExistentes,
  onAvaliacaoEnviada,
  className,
}: AvaliacaoDialogProps) {
  const [aberto, setAberto] = useState(false);
  const [nota, setNota] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const contratoCumprido = contrato.status === "cumprido";
  const jaAvaliou =
    enviado ||
    jaAvaliouContrato(avaliacoesExistentes, contrato.id, avaliadorId);

  function resetarFormulario() {
    setNota(null);
    setComentario("");
    setErro(null);
  }

  function handleEnviar() {
    if (nota === null) return;

    const resultado = avaliacaoFormSchema.safeParse({
      notaFornecedor: nota,
      comentario: comentario.trim() || undefined,
    });

    if (!resultado.success) {
      const msg =
        resultado.error.issues[0]?.message ?? "Dados inválidos";
      setErro(msg);
      return;
    }

    if (jaAvaliouContrato(avaliacoesExistentes, contrato.id, avaliadorId)) {
      setErro("Você já avaliou este contrato.");
      return;
    }

    const novaAvaliacao: Avaliacao = {
      id: crypto.randomUUID(),
      contratoId: contrato.id,
      avaliadorId,
      avaliadoId,
      notaFornecedor: resultado.data.notaFornecedor,
      comentario: resultado.data.comentario,
      criadoEm: new Date().toISOString(),
    };

    onAvaliacaoEnviada?.(novaAvaliacao);
    setEnviado(true);
    setAberto(false);
    resetarFormulario();
    toast.success("Avaliação enviada com sucesso!");
  }

  if (!contratoCumprido) {
    return (
      <p className={cn("text-muted-foreground text-sm", className)}>
        A avaliação ficará disponível quando o contrato for concluído (status{" "}
        <strong>cumprido</strong>).
      </p>
    );
  }

  if (jaAvaliou) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled
        className={cn("gap-2", className)}
        aria-label={`Você já avaliou ${nomeContraparte}`}
      >
        <Check className="size-4 text-primary" aria-hidden />
        Avaliado ✓
      </Button>
    );
  }

  const comentarioLength = comentario.length;

  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        setAberto(open);
        if (!open) resetarFormulario();
      }}
    >
      <DialogTrigger
        render={
          <Button type="button" variant="outline" className={className} />
        }
      >
        Avaliar {nomeContraparte}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar {nomeContraparte}</DialogTitle>
          <DialogDescription>
            Sua avaliação ajuda a construir reputação na plataforma. Cada parte
            avalia a outra uma única vez por contrato concluído.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label id="nota-avaliacao-label">Nota</Label>
            <EstrelasInput
              id="nota-avaliacao"
              value={nota}
              onChange={setNota}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="comentario-avaliacao">
                Comentário (opcional)
              </Label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  comentarioLength > 300
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
                aria-live="polite"
              >
                {comentarioLength}/300
              </span>
            </div>
            <Textarea
              id="comentario-avaliacao"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Compartilhe como foi a experiência de trabalho..."
              rows={3}
              maxLength={300}
              aria-describedby="comentario-avaliacao-hint"
            />
            <p
              id="comentario-avaliacao-hint"
              className="text-muted-foreground text-xs"
            >
              Visível para a contraparte após o envio.
            </p>
          </div>

          {erro ? (
            <p role="alert" className="text-destructive text-sm">
              {erro}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleEnviar}
            disabled={nota === null}
          >
            Enviar avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
