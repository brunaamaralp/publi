"use client";

import { ArrowDown, ArrowUp, Minus, ChevronDown } from "lucide-react";
import { useId, useState } from "react";

import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";
import {
  LABELS_POSICAO_MERCADO,
  type ComparacaoServicoMercado,
  type PosicaoMercado,
} from "@/lib/utils/comparacao-mercado";

const ESTILO_BADGE =
  "border-cinza-200 bg-cinza-200/35 text-cinza-500 hover:bg-cinza-200/55";

function IconePosicao({ posicao }: { posicao: Exclude<PosicaoMercado, "dados_insuficientes"> }) {
  if (posicao === "abaixo") {
    return <ArrowDown className="size-3.5 shrink-0" aria-hidden />;
  }
  if (posicao === "acima") {
    return <ArrowUp className="size-3.5 shrink-0" aria-hidden />;
  }
  return <Minus className="size-3.5 shrink-0" aria-hidden />;
}

type IndicadorPosicaoMercadoProps = {
  comparacao: ComparacaoServicoMercado;
};

export function IndicadorPosicaoMercado({
  comparacao,
}: IndicadorPosicaoMercadoProps) {
  const [aberto, setAberto] = useState(false);
  const painelId = useId();

  if (comparacao.posicao === "dados_insuficientes") {
    return (
      <div className="mt-2 space-y-1">
        <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
          Posição em relação ao mercado
        </p>
        <p className="text-texto-secundario text-xs leading-relaxed">
          Poucos dados para comparar nesta categoria ainda
        </p>
      </div>
    );
  }

  const label = LABELS_POSICAO_MERCADO[comparacao.posicao];
  const faixa =
    comparacao.faixaMin !== null && comparacao.faixaMax !== null
      ? `${formatarMoeda(comparacao.faixaMin)} – ${formatarMoeda(comparacao.faixaMax)}`
      : null;

  return (
    <div className="mt-2 space-y-1.5">
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        Posição em relação ao mercado
      </p>
      <button
        type="button"
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-left text-xs font-medium transition-colors",
          ESTILO_BADGE,
        )}
        aria-expanded={aberto}
        aria-controls={painelId}
        onClick={() => setAberto((v) => !v)}
      >
        <IconePosicao posicao={comparacao.posicao} />
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-70 transition-transform",
            aberto && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {aberto ? (
        <div
          id={painelId}
          className="border-border bg-fundo-pagina/80 space-y-1 rounded-lg border px-3 py-2 text-xs leading-relaxed"
          role="region"
          aria-label="Detalhe da comparação de mercado"
        >
          <p className="text-texto-secundario">
            Baseado em {comparacao.tamanhoCohort} influenciadores similares
            (mesmo nicho, porte de audiência e região).
          </p>
          {faixa ? (
            <p className="font-data text-foreground">
              Faixa praticada pelo grupo: {faixa}
            </p>
          ) : null}
          <p className="text-muted-foreground text-[11px]">
            Indicativo apenas — você decide o preço.
          </p>
        </div>
      ) : null}
    </div>
  );
}

type ResumoPosicaoMercadoProps = {
  texto: string;
};

export function ResumoPosicaoMercado({ texto }: ResumoPosicaoMercadoProps) {
  return (
    <div
      className="border-border bg-fundo-pagina space-y-1 rounded-card border px-3 py-2.5"
      role="status"
    >
      <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        Visão geral · mercado
      </p>
      <p className="text-sm leading-snug">{texto}</p>
      <p className="text-texto-secundario text-xs">
        Diferente do preço-base mínimo (piso da plataforma): aqui a referência é
        o que influenciadores parecidos estão cobrando de fato.
      </p>
    </div>
  );
}
