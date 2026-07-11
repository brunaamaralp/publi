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
    <div className="border-border space-y-3 rounded-card border p-4">
      <div>
        <h3 className="text-sm font-medium">{titulo}</h3>
        <p className="text-muted-foreground text-sm">{descricao}</p>
      </div>

      {linhas.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhuma linha adicionada.
        </p>
      ) : (
        <ul className="space-y-2" aria-label={titulo}>
          {linhas.map((linha, index) => (
            <li key={linha.id} className="flex flex-col gap-2 sm:flex-row">
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
            </li>
          ))}
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
