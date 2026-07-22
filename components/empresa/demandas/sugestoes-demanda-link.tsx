"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

import { IndicadorMatch } from "@/components/influenciador/demandas/indicador-match";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MatchRing } from "@/components/ui/match-ring";
import { listarMatchesPorDemanda } from "@/lib/empresa/demanda-matches";
import { cn } from "@/lib/utils";

type SugestoesDemandaLinkProps = {
  demandaId: string;
  /** Contagem informativa (ex.: matches gerados). Se houver lista real, prevalece. */
  total: number;
  className?: string;
};

export function SugestoesDemandaLink({
  demandaId,
  total,
  className,
}: SugestoesDemandaLinkProps) {
  const [dialogAberto, setDialogAberto] = useState(false);

  const matches = useMemo(() => {
    return [...listarMatchesPorDemanda(demandaId)].sort(
      (a, b) => b.score - a.score,
    );
  }, [demandaId]);

  const contagemExibida = matches.length > 0 ? matches.length : total;
  const melhorScore = matches[0]?.score;

  if (contagemExibida === 0) {
    return (
      <span
        className={cn(
          "text-texto-secundario font-data inline-flex items-center gap-1 text-sm",
          className,
        )}
      >
        <Users className="size-3.5 opacity-60" aria-hidden />
        0
      </span>
    );
  }

  if (matches.length === 0) {
    return (
      <span
        className={cn(
          "font-data text-texto-secundario inline-flex items-center gap-1 text-sm font-medium",
          className,
        )}
        title="Sugestões ainda em processamento"
      >
        <Users className="size-3.5" aria-hidden />
        {total}
        <span className="text-xs font-normal">em análise</span>
      </span>
    );
  }

  if (matches.length === 1) {
    const match = matches[0]!;
    return (
      <Link
        href={`/negociacao/${match.matchId}`}
        className={cn(
          "group inline-flex items-center gap-2 rounded-button py-0.5 text-left transition-colors",
          className,
        )}
        title={`Negociar com ${match.influenciadorNome} (${Math.round(match.score)}%)`}
      >
        <IndicadorMatch score={match.score} variante="compact" />
        <span className="text-verde-acao text-sm font-medium group-hover:underline">
          Ver match
        </span>
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogAberto(true)}
        className={cn(
          "group inline-flex items-center gap-2 rounded-button py-0.5 text-left",
          className,
        )}
        title="Ver influenciadores sugeridos"
      >
        <span className="font-data text-verde-acao inline-flex items-center gap-1 text-sm font-semibold tabular-nums group-hover:underline">
          <Users className="size-3.5 shrink-0" aria-hidden />
          {matches.length}
        </span>
        {melhorScore !== undefined ? (
          <IndicadorMatch score={melhorScore} variante="compact" />
        ) : null}
      </button>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-md gap-0 p-0 sm:max-w-md">
          <DialogHeader className="border-border space-y-1 border-b px-5 py-4 text-left">
            <DialogTitle>Matches sugeridos</DialogTitle>
            <DialogDescription>
              Ordenados por compatibilidade — comece pelos scores mais altos.
            </DialogDescription>
          </DialogHeader>
          <ul className="max-h-[min(60vh,360px)] divide-y overflow-y-auto">
            {matches.map((match, index) => (
              <li key={match.matchId}>
                <Link
                  href={`/negociacao/${match.matchId}`}
                  className="hover:bg-muted/50 flex items-center gap-3 px-5 py-3.5 transition-colors"
                  onClick={() => setDialogAberto(false)}
                >
                  <MatchRing
                    score={match.score}
                    size="xs"
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {match.influenciadorNome}
                    </p>
                    <p className="text-texto-secundario text-xs font-normal">
                      {index === 0 ? "Melhor match desta demanda" : "Compatível"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "text-verde-acao shrink-0 gap-1",
                    )}
                  >
                    Negociar
                    <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-border border-t px-5 py-3">
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setDialogAberto(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
