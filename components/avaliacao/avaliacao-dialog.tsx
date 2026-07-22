"use client";

import { Clock, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BadgeEstadoAvaliacao } from "@/components/avaliacao/badge-estado-avaliacao";
import { ComentarioAvaliacaoCard } from "@/components/avaliacao/comentario-avaliacao-card";
import { EstrelasInput } from "@/components/avaliacao/estrelas-input";
import { EstrelasNota } from "@/components/avaliacao/estrelas-nota";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  avaliacaoDaParte,
  avaliacaoMutuaRevelada,
  jaAvaliouContrato,
} from "@/lib/avaliacao/utils";
import { avaliacaoFormSchema } from "@/lib/schemas/avaliacao";
import type { Avaliacao } from "@/lib/types";
import type { Contrato } from "@/lib/types/contrato";
import { cn } from "@/lib/utils";

type AvaliacaoDialogProps = {
  contrato: Pick<Contrato, "id" | "status">;
  avaliadorId: string;
  avaliadoId: string;
  nomeContraparte: string;
  /** ID do outro avaliador (para revelação mútua). */
  contraparteAvaliadorId: string;
  avaliacoesExistentes: Avaliacao[];
  onAvaliacaoEnviada?: (avaliacao: Avaliacao) => void;
  className?: string;
};

export function AvaliacaoDialog({
  contrato,
  avaliadorId,
  avaliadoId,
  nomeContraparte,
  contraparteAvaliadorId,
  avaliacoesExistentes,
  onAvaliacaoEnviada,
  className,
}: AvaliacaoDialogProps) {
  const [nota, setNota] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const contratoCumprido = contrato.status === "concluida";
  const avaliacaoEnviada = avaliacaoDaParte(
    avaliacoesExistentes,
    contrato.id,
    avaliadorId,
  );
  const jaAvaliou =
    enviado ||
    jaAvaliouContrato(avaliacoesExistentes, contrato.id, avaliadorId);
  const revelada = avaliacaoMutuaRevelada(
    avaliacoesExistentes,
    contrato.id,
    avaliadorId,
    contraparteAvaliadorId,
  );
  const notaContraparte = revelada
    ? avaliacaoDaParte(
        avaliacoesExistentes,
        contrato.id,
        contraparteAvaliadorId,
      )
    : undefined;

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
    toast.success("Avaliação enviada!", {
      description:
        "A nota da contraparte só aparece quando ambos avaliarem.",
    });
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
              <strong className="font-medium">concluída</strong>). Cada parte
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
            Sua avaliação foi enviada. Uma avaliação por contrato e por
            avaliador — não é possível alterar.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-texto-secundario font-normal">
              Sua nota
            </Label>
            {notaFinal ? (
              <EstrelasNota nota={notaFinal} tamanho="lg" mostrarNumero />
            ) : null}
          </div>

          <div className="space-y-2">
            <Label className="text-texto-secundario font-normal">
              Seu comentário
            </Label>
            <ComentarioAvaliacaoCard>{comentarioFinal}</ComentarioAvaliacaoCard>
          </div>

          {revelada && notaContraparte ? (
            <div className="space-y-3 border-t border-cinza-200 pt-4">
              <Label className="text-texto-secundario font-normal">
                Nota de {nomeContraparte} para você
              </Label>
              <EstrelasNota
                nota={notaContraparte.notaFornecedor}
                tamanho="lg"
                mostrarNumero
              />
              {notaContraparte.comentario ? (
                <ComentarioAvaliacaoCard>
                  {notaContraparte.comentario}
                </ComentarioAvaliacaoCard>
              ) : null}
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-card border border-lilas/40 bg-lilas-claro px-3 py-2.5">
              <EyeOff
                className="text-lilas-escuro mt-0.5 size-3.5 shrink-0"
                aria-hidden
              />
              <p className="text-lilas-escuro text-xs font-normal leading-relaxed">
                A nota da contraparte fica oculta até que {nomeContraparte}{" "}
                também avalie.
              </p>
            </div>
          )}
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
          Sua avaliação ajuda a construir reputação na plataforma. A nota que
          você receber só será revelada depois que ambos avaliarem.
        </p>
      </div>

      <div className="rounded-card border border-lilas/40 bg-lilas-claro px-3 py-2.5">
        <p className="text-lilas-escuro text-xs font-normal leading-relaxed">
          <span className="font-semibold">Avaliação mútua e sigilosa.</span>{" "}
          Após enviar, o formulário fica bloqueado. A nota da outra parte só
          aparece quando os dois lados tiverem avaliado.
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
        />
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
