"use client";

import { useState } from "react";
import { CheckCircle2, PartyPopper } from "lucide-react";

import { AvaliacaoDialog } from "@/components/avaliacao/avaliacao-dialog";
import { Button } from "@/components/ui/button";
import type { Avaliacao, Contrato } from "@/lib/types";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { valorExibicaoPagamento } from "@/lib/pagamento/pagamento-utils";
import type { PagamentoFluxoEstado } from "@/lib/pagamento/pagamento-types";

type ResumoPagamentoLiberadoProps = {
  estado: PagamentoFluxoEstado;
  contexto: ContratoPagamentoContexto;
  papel: "empresa" | "influenciador";
  avaliacoesIniciais?: Avaliacao[];
};

export function ResumoPagamentoLiberado({
  estado,
  contexto,
  papel,
  avaliacoesIniciais = [],
}: ResumoPagamentoLiberadoProps) {
  const [avaliacoes, setAvaliacoes] = useState(avaliacoesIniciais);
  const valor = valorExibicaoPagamento(estado);
  const contratoCumprido: Contrato = estado.contrato;

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-verde-acao/10">
        {papel === "influenciador" ? (
          <PartyPopper className="text-verde-acao size-8" aria-hidden />
        ) : (
          <CheckCircle2 className="text-verde-acao size-8" aria-hidden />
        )}
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold">Pagamento liberado</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {papel === "influenciador"
            ? "O valor foi transferido após a confirmação da entrega pela empresa."
            : "A entrega foi confirmada e o escrow foi liberado para o influenciador."}
        </p>
        <p className="font-data mt-4 text-3xl font-bold">{formatarMoeda(valor)}</p>
      </div>

      {papel === "influenciador" ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-muted-foreground max-w-sm text-sm">
            Como foi trabalhar com {contexto.empresa.nome}? Sua avaliação ajuda
            outras marcas na plataforma.
          </p>
          <AvaliacaoDialog
            contrato={contratoCumprido}
            avaliadorId={contexto.influenciador.usuarioId}
            avaliadoId={contexto.empresa.usuarioId}
            nomeContraparte={contexto.empresa.nome}
            avaliacoesExistentes={avaliacoes}
            onAvaliacaoEnviada={(a) => setAvaliacoes((prev) => [...prev, a])}
          />
        </div>
      ) : (
        <Button type="button" variant="outline" disabled className="gap-2">
          <CheckCircle2 className="size-4" aria-hidden />
          Pagamento processado
        </Button>
      )}
    </div>
  );
}
