"use client";

import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
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

  const temAlerta = mensagem.flagContatoExterno === "alerta_termo";
  const foiBloqueada = mensagem.flagContatoExterno === "bloqueado_padrao";

  return (
    <div
      className={cn(
        "flex w-full max-w-[85%] flex-col gap-1.5",
        ehRemetenteAtual ? "ml-auto items-end" : "items-start",
      )}
    >
      {nomeRemetente ? (
        <span
          className={cn(
            "px-1 text-xs font-normal",
            ehRemetenteAtual
              ? "text-verde-neon/90"
              : "text-texto-secundario",
          )}
        >
          {nomeRemetente}
        </span>
      ) : null}

      <div
        className={cn(
          "rounded-card px-3.5 py-2.5 text-sm leading-relaxed font-normal",
          ehRemetenteAtual ? "bolha-propria" : "bolha-interlocutor",
          foiBloqueada && "opacity-70",
        )}
      >
        {mensagem.texto}
      </div>

      {temAlerta ? (
        <AvisoContatoInline tipo="alerta_termo" variante="inline" />
      ) : null}

      {foiBloqueada ? (
        <AvisoContatoInline tipo="bloqueado_padrao" variante="inline" />
      ) : null}

      <time
        dateTime={mensagem.enviadoEm}
        className="text-texto-secundario px-1 text-xs font-normal"
      >
        {hora}
      </time>
    </div>
  );
}
