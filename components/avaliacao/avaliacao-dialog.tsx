"use client";

import { Clock, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BadgeEstadoAvaliacao } from "@/components/avaliacao/badge-estado-avaliacao";
import { ComentarioAvaliacaoCard } from "@/components/avaliacao/comentario-avaliacao-card";
import { EstrelasInput } from "@/components/avaliacao/estrelas-input";
import { EstrelasNota } from "@/components/avaliacao/estrelas-nota";
import { Button } from "@/components/ui/button";
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
    setErro(null);
    toast.success("Avaliação enviada com sucesso!");
  }

  if (!contratoCumprido) {
    return (
      <div
        className={cn(
          "secao-editavel space-y-3 border-l-[3px] border-l-lilas ring-0",
          className,
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <BadgeEstadoAvaliacao estado="pendente" />
        </div>
        <div className="flex items-start gap-3">
          <Clock
            className="text-lilas-escuro mt-0.5 size-4 shrink-0"
            aria-hidden
          />
          <div className="space-y-1">
            <h2 className="font-display text-lg font-bold text-lilas-escuro">
              Avaliar {nomeContraparte}
            </h2>
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
    const comentarioFinal =
      avaliacaoEnviada?.comentario?.trim() || "Nenhum comentário adicionado.";

    return (
      <div
        className={cn("secao-editavel space-y-5 ring-0", className)}
        aria-label={`Avaliação enviada para ${nomeContraparte}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold">
            Avaliar {nomeContraparte}
          </h2>
          <BadgeEstadoAvaliacao estado="concluida" />
        </div>

        <div className="flex items-start gap-2 rounded-card border border-cinza-200 bg-cinza-200/30 px-3 py-2.5">
          <Lock className="text-cinza-500 mt-0.5 size-3.5 shrink-0" aria-hidden />
          <p className="text-texto-secundario text-xs font-normal leading-relaxed">
            Avaliação já enviada para este contrato. Uma avaliação por contrato
            e por avaliador — não é possível alterar ou reenviar.
          </p>
        </div>

        <div
          className="pointer-events-none space-y-5 opacity-75"
          aria-disabled="true"
        >
          <div className="space-y-2">
            <Label className="text-texto-secundario font-normal">Nota</Label>
            {notaFinal ? (
              <EstrelasNota nota={notaFinal} tamanho="lg" mostrarNumero />
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="text-texto-secundario font-normal">
              Comentário
            </Label>
            <ComentarioAvaliacaoCard>{comentarioFinal}</ComentarioAvaliacaoCard>
          </div>
        </div>
      </div>
    );
  }

  const comentarioLength = comentario.length;

  return (
    <div className={cn("secao-editavel space-y-5 ring-0", className)}>
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">
          Avaliar {nomeContraparte}
        </h2>
        <p className="text-texto-secundario text-sm font-normal">
          Sua avaliação ajuda a construir reputação na plataforma. Cada parte
          avalia a outra uma única vez por contrato concluído.
        </p>
      </div>

      <div className="rounded-card border border-lilas/40 bg-lilas-claro px-3 py-2.5">
        <p className="text-lilas-escuro text-xs font-normal leading-relaxed">
          <span className="font-semibold">Uma avaliação por contrato.</span>{" "}
          Após enviar, o formulário ficará bloqueado para este contrato e este
          avaliador.
        </p>
      </div>

      <div className="space-y-2">
        <Label id="nota-avaliacao-label" className="font-normal">
          Nota
        </Label>
        <EstrelasInput
          id="nota-avaliacao"
          value={nota}
          onChange={(n) => {
            setNota(n);
            setErro(null);
          }}
        />
      </div>

      <div className="space-y-2">
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
          rows={4}
          maxLength={300}
          className="border-cinza-200 bg-white font-normal"
          aria-describedby="comentario-avaliacao-hint"
        />
        <p
          id="comentario-avaliacao-hint"
          className="text-texto-secundario text-xs font-normal"
        >
          O comentário fica em card neutro — a nota não altera as cores do
          formulário.
        </p>
      </div>

      {erro ? (
        <p role="alert" className="text-texto-secundario text-sm font-normal">
          {erro}
        </p>
      ) : null}

      <Button
        type="button"
        variant="cta"
        className="w-full sm:w-auto"
        onClick={handleEnviar}
        disabled={nota === null}
      >
        Enviar avaliação
      </Button>
    </div>
  );
}
