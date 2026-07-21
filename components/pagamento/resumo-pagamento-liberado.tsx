"use client";

import { useEffect, useState } from "react";

import { AvaliacaoDialog } from "@/components/avaliacao/avaliacao-dialog";
import {
  CardEscrow,
  IndicadorProvedorEscrow,
  ValorEscrowDestaque,
} from "@/components/pagamento/escrow-ui";
import {
  carregarAvaliacoesContrato,
  salvarAvaliacaoContrato,
} from "@/lib/avaliacao/utils";
import type { Avaliacao, Contrato } from "@/lib/types";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";
import { valorExibicaoPagamento } from "@/lib/pagamento/pagamento-utils";
import type { PagamentoFluxoEstado } from "@/lib/pagamento/pagamento-types";

type ResumoPagamentoLiberadoProps = {
  estado: PagamentoFluxoEstado;
  contexto: ContratoPagamentoContexto;
  papel: "empresa" | "influenciador";
};

export function ResumoPagamentoLiberado({
  estado,
  contexto,
  papel,
}: ResumoPagamentoLiberadoProps) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const valor = valorExibicaoPagamento(estado);
  const contratoCumprido: Contrato = estado.contrato;

  useEffect(() => {
    setAvaliacoes(carregarAvaliacoesContrato(estado.contratoId));
  }, [estado.contratoId]);

  const souInfluenciador = papel === "influenciador";
  const avaliadorId = souInfluenciador
    ? contexto.influenciador.usuarioId
    : contexto.empresa.usuarioId;
  const avaliadoId = souInfluenciador
    ? contexto.empresa.usuarioId
    : contexto.influenciador.usuarioId;
  const contraparteAvaliadorId = souInfluenciador
    ? contexto.empresa.usuarioId
    : contexto.influenciador.usuarioId;
  const nomeContraparte = souInfluenciador
    ? contexto.empresa.nome
    : contexto.influenciador.nome;

  return (
    <CardEscrow status="liberado" className="space-y-6 p-4">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">Pagamento liberado</h2>
        <p className="text-texto-secundario text-sm font-normal">
          {souInfluenciador
            ? "O valor foi transferido após a confirmação da entrega pela empresa."
            : "A entrega foi confirmada e o pagamento foi liberado para o influenciador."}
        </p>
      </div>

      <ValorEscrowDestaque valor={valor} status="liberado" />

      <IndicadorProvedorEscrow />

      <div className="space-y-3 border-t border-cinza-200 pt-4">
        <p className="text-texto-secundario text-sm font-normal">
          Como foi trabalhar com {nomeContraparte}? Avaliações são mútuas e
          sigilosas até ambos enviarem.
        </p>
        <AvaliacaoDialog
          contrato={contratoCumprido}
          avaliadorId={avaliadorId}
          avaliadoId={avaliadoId}
          nomeContraparte={nomeContraparte}
          contraparteAvaliadorId={contraparteAvaliadorId}
          avaliacoesExistentes={avaliacoes}
          onAvaliacaoEnviada={(a) => {
            const next = salvarAvaliacaoContrato(a);
            setAvaliacoes(next);
          }}
        />
      </div>
    </CardEscrow>
  );
}
