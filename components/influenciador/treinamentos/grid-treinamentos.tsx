"use client";

import { CardTreinamento } from "@/components/influenciador/treinamentos/card-treinamento";
import { CATEGORIAS_TREINAMENTO } from "@/lib/mock-data/treinamentos";
import type { Treinamento } from "@/lib/types";
import type { ProgressoTreinamento } from "@/lib/types";
import { getProgressoTreinamento } from "@/lib/treinamentos/treinamentos-utils";

type GridTreinamentosProps = {
  treinamentos: Treinamento[];
  progressos: ProgressoTreinamento[];
  influenciadorId: string;
  nivelAtual: number;
  onAbrir: (treinamento: Treinamento) => void;
};

export function GridTreinamentos({
  treinamentos,
  progressos,
  influenciadorId,
  nivelAtual,
  onAbrir,
}: GridTreinamentosProps) {
  return (
    <div className="space-y-8">
      {CATEGORIAS_TREINAMENTO.map((categoria) => {
        const itens = treinamentos.filter((t) => t.categoria === categoria);
        if (itens.length === 0) return null;

        return (
          <section key={categoria} aria-labelledby={`cat-${categoria}`}>
            <h2
              id={`cat-${categoria}`}
              className="font-display mb-4 text-lg font-semibold"
            >
              {categoria}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {itens.map((treinamento) => (
                <li key={treinamento.id}>
                  <CardTreinamento
                    treinamento={treinamento}
                    status={getProgressoTreinamento(
                      progressos,
                      treinamento.id,
                      influenciadorId,
                    )}
                    nivelAtual={nivelAtual}
                    onClick={() => onAbrir(treinamento)}
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
