"use client";

import { useState } from "react";

import { AvaliacaoDialog } from "@/components/avaliacao/avaliacao-dialog";
import { Button } from "@/components/ui/button";
import {
  CardEscrow,
  IndicadorProvedorEscrow,
  ValorEscrowDestaque,
} from "@/components/pagamento/escrow-ui";
import type { Avaliacao, Contrato } from "@/lib/types";
import type { ContratoPagamentoContexto } from "@/lib/pagamento/pagamento-types";
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
    <CardEscrow status="liberado" className="space-y-6 p-4">
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold">Pagamento liberado</h2>
        <p className="text-texto-secundario text-sm font-normal">
          {papel === "influenciador"
            ? "O valor foi transferido após a confirmação da entrega pela empresa."
            : "A entrega foi confirmada e o escrow foi liberado para o influenciador."}
        </p>
      </div>

      <ValorEscrowDestaque valor={valor} status="liberado" />

      <IndicadorProvedorEscrow />

      {papel === "influenciador" ? (
        <div className="space-y-3 border-t border-cinza-200 pt-4">
          <p className="text-texto-secundario text-sm font-normal">
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
        <Button type="button" variant="outline" disabled className="w-full">
          Pagamento processado
        </Button>
      )}
    </CardEscrow>
  );
}
