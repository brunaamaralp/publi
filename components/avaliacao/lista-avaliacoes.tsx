"use client";

import { useMemo, useState } from "react";

import { EstrelasNota } from "@/components/avaliacao/estrelas-nota";
import { Button } from "@/components/ui/button";
import { formatarDataRelativa } from "@/lib/avaliacao/utils";
import type { Avaliacao } from "@/lib/types";
import { cn } from "@/lib/utils";

const ITENS_POR_PAGINA = 5;

type ListaAvaliacoesProps = {
  avaliacoes: Avaliacao[];
  className?: string;
};

export function ListaAvaliacoes({
  avaliacoes,
  className,
}: ListaAvaliacoesProps) {
  const [visiveis, setVisiveis] = useState(ITENS_POR_PAGINA);

  const ordenadas = useMemo(
    () =>
      [...avaliacoes].sort(
        (a, b) =>
          new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
      ),
    [avaliacoes],
  );

  const exibidas = ordenadas.slice(0, visiveis);
  const temMais = visiveis < ordenadas.length;

  if (ordenadas.length === 0) {
    return (
      <p className={cn("text-texto-secundario text-sm font-normal", className)}>
        Nenhuma avaliação recebida ainda. Após concluir campanhas, as empresas
        poderão avaliar seu trabalho aqui.
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <ul className="space-y-4" aria-label="Avaliações recebidas">
        {exibidas.map((avaliacao) => (
          <li key={avaliacao.id} className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <EstrelasNota nota={avaliacao.notaFornecedor} tamanho="md" />
              <time
                dateTime={avaliacao.criadoEm}
                className="text-texto-secundario text-xs font-normal"
              >
                {formatarDataRelativa(avaliacao.criadoEm)}
              </time>
            </div>
            {avaliacao.comentario ? (
              <div className="secao-editavel ring-0">
                <p className="text-sm leading-relaxed font-normal">
                  {avaliacao.comentario}
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {temMais ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setVisiveis((v) => v + ITENS_POR_PAGINA)}
        >
          Carregar mais
        </Button>
      ) : null}
    </div>
  );
}
