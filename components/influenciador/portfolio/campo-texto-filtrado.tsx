"use client";

import { useState } from "react";

import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { analisarTextoLivrePortfolio } from "@/lib/negociacao/filtro-contato";
import type { Mensagem } from "@/lib/types";
import { cn } from "@/lib/utils";

type FlagAviso = Extract<
  Mensagem["flagContatoExterno"],
  "bloqueado_padrao" | "alerta_termo"
>;

type CampoTextoFiltradoProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
  maxLength?: number;
};

/**
 * Campo de texto livre do portfólio com o mesmo filtro de contato do chat (Prompt 8).
 */
export function CampoTextoFiltrado({
  id,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  className,
  maxLength,
}: CampoTextoFiltradoProps) {
  const [aviso, setAviso] = useState<FlagAviso | null>(null);

  function aplicar(texto: string) {
    const analise = analisarTextoLivrePortfolio(texto);
    if (!analise.podeEnviar) {
      if (analise.flag === "bloqueado_padrao") {
        setAviso("bloqueado_padrao");
      }
      return;
    }
    setAviso(analise.flag === "alerta_termo" ? "alerta_termo" : null);
    onChange(texto);
  }

  const shared = {
    id,
    value,
    placeholder,
    maxLength,
    className: cn("border-cinza-200 bg-white", className),
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => aplicar(e.target.value),
  };

  return (
    <div className="space-y-2">
      {multiline ? (
        <Textarea {...shared} rows={rows} />
      ) : (
        <Input {...shared} />
      )}
      {aviso ? (
        <AvisoContatoInline tipo={aviso} variante="inline" />
      ) : null}
    </div>
  );
}

/** Valida vários textos livres de uma vez (ex.: ao salvar o portfólio). */
export function validarTextosLivresPortfolio(
  textos: string[],
): { ok: true } | { ok: false; flag: FlagAviso } {
  for (const texto of textos) {
    const analise = analisarTextoLivrePortfolio(texto);
    if (!analise.podeEnviar && analise.flag === "bloqueado_padrao") {
      return { ok: false, flag: "bloqueado_padrao" };
    }
  }
  return { ok: true };
}
