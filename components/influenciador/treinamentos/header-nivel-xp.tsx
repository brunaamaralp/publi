"use client";

import { MatchRing, nivelMatchRing } from "@/components/ui/match-ring";
import type { InfluenciadorGamificacaoMock } from "@/lib/mock-data/treinamentos";
import {
  LABELS_NIVEL,
  NIVEL_MAXIMO,
  percentualXpProximoNivel,
  xpProximoNivel,
} from "@/lib/treinamentos/treinamentos-utils";
import { cn } from "@/lib/utils";

type HeaderNivelXpProps = {
  influenciador: InfluenciadorGamificacaoMock;
};

export function HeaderNivelXp({ influenciador }: HeaderNivelXpProps) {
  const { nivelAtual, pontosXp } = influenciador;
  const percentual = percentualXpProximoNivel(pontosXp, nivelAtual);
  const proximo = xpProximoNivel(nivelAtual);
  const noMaximo = nivelAtual >= NIVEL_MAXIMO;

  return (
    <header className="border-border bg-card flex flex-col gap-6 rounded-card border p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <p className="text-primary text-sm font-medium">Seu nível</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {LABELS_NIVEL[nivelAtual] ?? `Nível ${nivelAtual}`}
        </h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          Complete trilhas para ganhar XP e subir de nível — o nível entra no
          score de match com marcas.
        </p>
        <p className="text-sm">
          <span className="font-data font-semibold">{pontosXp}</span>{" "}
          <span className="text-muted-foreground">pontos de XP</span>
          {!noMaximo && proximo !== null ? (
            <span className="text-muted-foreground">
              {" "}
              · faltam{" "}
              <span className="text-foreground font-data font-medium">
                {proximo - pontosXp}
              </span>{" "}
              para {LABELS_NIVEL[nivelAtual + 1]}
            </span>
          ) : (
            <span className="text-verde-acao ml-1 text-xs font-medium">
              · nível máximo
            </span>
          )}
        </p>
      </div>

      <div className="flex shrink-0 justify-center sm:justify-end">
        <MatchRing
          score={percentual}
          size="lg"
          showLabel
          label="xp"
          centerValue={String(pontosXp)}
          ariaLabel={`${pontosXp} pontos de XP, ${percentual}% do progresso até o próximo nível`}
          className={cn(
            nivelMatchRing(percentual) === "alto" && "ring-verde-neon/20",
          )}
        />
      </div>
    </header>
  );
}
