"use client";

import { AlertTriangle } from "lucide-react";

import type { Mensagem } from "@/lib/types";
import { cn } from "@/lib/utils";

type MensagemBolhaProps = {
  mensagem: Mensagem;
  ehRemetenteAtual: boolean;
  nomeRemetente?: string;
};

export function MensagemBolha({
  mensagem,
  ehRemetenteAtual,
  nomeRemetente,
}: MensagemBolhaProps) {
  const hora = new Date(mensagem.enviadoEm).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex max-w-[85%] flex-col gap-1",
        ehRemetenteAtual ? "ml-auto items-end" : "items-start",
      )}
    >
      {nomeRemetente ? (
        <span className="text-muted-foreground px-1 text-xs font-medium">
          {nomeRemetente}
        </span>
      ) : null}
      <div
        className={cn(
          "flex items-end gap-1.5",
          ehRemetenteAtual ? "flex-row-reverse" : "flex-row",
        )}
      >
        <div
          className={cn(
            "rounded-card px-3 py-2 text-sm leading-relaxed",
            ehRemetenteAtual
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
          )}
        >
          {mensagem.texto}
        </div>
        {mensagem.flagContatoExterno === "alerta_termo" ? (
          <span
            className="text-status-negociacao/80 shrink-0"
            title="Termo sensível detectado"
            aria-label="Alerta: possível tentativa de contato externo"
          >
            <AlertTriangle className="size-3.5" aria-hidden />
          </span>
        ) : null}
      </div>
      <time
        dateTime={mensagem.enviadoEm}
        className="text-muted-foreground px-1 text-[0.65rem]"
      >
        {hora}
      </time>
    </div>
  );
}
