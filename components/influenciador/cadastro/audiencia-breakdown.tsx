"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AudienciaLinha } from "@/lib/influenciador/cadastro-types";
import { somaPercentuais } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

type AudienciaBreakdownProps = {
  titulo: string;
  descricao: string;
  linhas: AudienciaLinha[];
  onChange: (linhas: AudienciaLinha[]) => void;
};

const CORES_SERIE = ["grafico-serie-neon", "grafico-serie-lilas"] as const;

export function AudienciaBreakdown({
  titulo,
  descricao,
  linhas,
  onChange,
}: AudienciaBreakdownProps) {
  const soma = somaPercentuais(linhas);
  const somaInvalida = linhas.length > 0 && Math.abs(soma - 100) > 0.01;

  function adicionarLinha() {
    onChange([
      ...linhas,
      { id: crypto.randomUUID(), valor: "", percentual: "" },
    ]);
  }

  function atualizarLinha(
    id: string,
    campo: "valor" | "percentual",
    valor: string,
  ) {
    onChange(
      linhas.map((linha) => {
        if (linha.id !== id) return linha;
        if (campo === "valor") {
          return { ...linha, valor };
        }
        const numero = valor === "" ? "" : Number(valor);
        return {
          ...linha,
          percentual: numero === "" || Number.isNaN(numero) ? "" : numero,
        };
      }),
    );
  }

  function removerLinha(id: string) {
    onChange(linhas.filter((l) => l.id !== id));
  }

  return (
    <div className="secao-editavel space-y-3">
      <div>
        <h3 className="font-display text-sm font-bold">{titulo}</h3>
        <p className="text-texto-secundario text-sm font-normal">{descricao}</p>
      </div>

      {linhas.length === 0 ? (
        <p className="text-texto-secundario text-sm">
          Nenhuma linha adicionada.
        </p>
      ) : (
        <ul className="space-y-3" aria-label={titulo}>
          {linhas.map((linha, index) => {
            const percentual =
              typeof linha.percentual === "number" ? linha.percentual : 0;
            const corSerie = CORES_SERIE[index % CORES_SERIE.length];

            return (
              <li key={linha.id} className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex-1">
                    <Label className="sr-only" htmlFor={`${linha.id}-valor`}>
                      Valor {index + 1} em {titulo}
                    </Label>
                    <Input
                      id={`${linha.id}-valor`}
                      placeholder="Ex: Feminino, 18-24, São Paulo"
                      value={linha.valor}
                      onChange={(e) =>
                        atualizarLinha(linha.id, "valor", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 sm:w-40">
                    <div className="flex-1">
                      <Label className="sr-only" htmlFor={`${linha.id}-pct`}>
                        Percentual {index + 1}
                      </Label>
                      <Input
                        id={`${linha.id}-pct`}
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        placeholder="%"
                        value={linha.percentual}
                        onChange={(e) =>
                          atualizarLinha(linha.id, "percentual", e.target.value)
                        }
                        className="font-data"
                        aria-label={`Percentual da linha ${index + 1}`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removerLinha(linha.id)}
                      aria-label={`Remover linha ${index + 1}`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
                {percentual > 0 ? (
                  <div
                    className="flex items-center gap-2"
                    aria-hidden
                    title={`${percentual}%`}
                  >
                    <div className="grafico-trilha h-1.5 min-w-0 flex-1 overflow-hidden rounded-full">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          corSerie,
                        )}
                        style={{
                          width: `${Math.min(percentual, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-texto-secundario font-data w-10 shrink-0 text-right text-xs">
                      {percentual}%
                    </span>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {somaInvalida ? (
        <p
          role="status"
          className={cn("banner-alerta rounded-button px-3 py-2 text-sm")}
        >
          A soma dos percentuais está em{" "}
          <span className="font-data">{soma.toFixed(1)}%</span> — o ideal é
          fechar em 100%.
        </p>
      ) : null}

      <Button type="button" variant="outline" size="sm" onClick={adicionarLinha}>
        <Plus className="size-4" aria-hidden />
        Adicionar linha
      </Button>
    </div>
  );
}
