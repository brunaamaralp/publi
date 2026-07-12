"use client";

import { Clock, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EstrelasInput } from "@/components/avaliacao/estrelas-input";
import { EstrelasNota } from "@/components/avaliacao/estrelas-nota";
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

const CTA_ENVIAR =
  "border-transparent bg-verde-carvao-escuro text-verde-neon shadow-none hover:bg-verde-carvao hover:text-verde-neon";

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
  const avaliacaoEnviada = avaliacoesExistentes.find(
    (a) => a.contratoId === contrato.id && a.avaliadorId === avaliadorId,
  );
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
      <div
        className={cn(
          "rounded-card border border-lilas/40 bg-lilas-claro p-4",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <Clock className="text-lilas-escuro mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="space-y-1">
            <p className="text-lilas-escuro text-sm font-semibold">
              Avaliação pendente
            </p>
            <p className="text-lilas-escuro/90 text-sm font-normal leading-relaxed">
              Disponível quando o contrato for concluído (status{" "}
              <strong className="font-medium">cumprido</strong>). Cada parte
              avalia a outra uma única vez por contrato.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (jaAvaliou) {
    const notaFinal = avaliacaoEnviada?.notaFornecedor ?? nota;

    return (
      <div className={cn("space-y-4", className)}>
        <div className="rounded-card border border-cinza-200 bg-cinza-200/35 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Lock className="text-cinza-500 size-3.5 shrink-0" aria-hidden />
            <p className="text-cinza-500 text-sm font-semibold">
              Avaliação já enviada
            </p>
          </div>
          <p className="text-texto-secundario mt-1 text-xs font-normal">
            Uma avaliação por contrato e por avaliador — não é possível alterar
            ou reenviar.
          </p>
        </div>

        <div
          className="secao-editavel pointer-events-none space-y-4 opacity-80"
          aria-disabled="true"
          aria-label={`Avaliação enviada para ${nomeContraparte}`}
        >
          <h2 className="font-display text-lg font-bold">
            Avaliar {nomeContraparte}
          </h2>

          {notaFinal ? (
            <EstrelasNota nota={notaFinal} tamanho="lg" mostrarNumero />
          ) : null}

          <div className="space-y-2">
            <Label className="text-texto-secundario font-normal">
              Comentário
            </Label>
            <div className="rounded-card border border-cinza-200 bg-white p-3">
              <p className="text-sm leading-relaxed font-normal">
                {avaliacaoEnviada?.comentario?.trim() ||
                  "Nenhum comentário adicionado."}
              </p>
            </div>
          </div>
        </div>
      </div>
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
          <Button
            type="button"
            className={cn(CTA_ENVIAR, className)}
          />
        }
      >
        Avaliar {nomeContraparte}
      </DialogTrigger>

      <DialogContent className="border-cinza-200 bg-fundo-pagina sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            Avaliar {nomeContraparte}
          </DialogTitle>
          <DialogDescription className="text-texto-secundario font-normal">
            Sua avaliação ajuda a construir reputação na plataforma. Cada parte
            avalia a outra uma única vez por contrato concluído.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="rounded-card border border-lilas/30 bg-lilas-claro/60 px-3 py-2">
            <p className="text-lilas-escuro text-xs font-normal">
              <span className="font-semibold">Uma avaliação por contrato.</span>{" "}
              Após enviar, o formulário ficará bloqueado para este contrato.
            </p>
          </div>

          <div className="space-y-2">
            <Label id="nota-avaliacao-label" className="font-normal">
              Nota
            </Label>
            <EstrelasInput
              id="nota-avaliacao"
              value={nota}
              onChange={setNota}
            />
          </div>

          <div className="secao-editavel space-y-2 ring-0">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="comentario-avaliacao" className="font-normal">
                Comentário (opcional)
              </Label>
              <span
                className={cn(
                  "font-data text-xs",
                  comentarioLength > 300
                    ? "text-destructive"
                    : "text-texto-secundario",
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
              className="border-cinza-200 bg-white font-normal"
              aria-describedby="comentario-avaliacao-hint"
            />
            <p
              id="comentario-avaliacao-hint"
              className="text-texto-secundario text-xs font-normal"
            >
              Visível para a contraparte após o envio. O card permanece neutro
              independentemente da nota.
            </p>
          </div>

          {erro ? (
            <p role="alert" className="text-texto-secundario text-sm font-normal">
              {erro}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleEnviar}
            disabled={nota === null}
            className={CTA_ENVIAR}
          >
            Enviar avaliação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
