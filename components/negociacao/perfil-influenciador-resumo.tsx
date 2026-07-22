import { Star, Users, Zap } from "lucide-react";

import { MatchRing } from "@/components/ui/match-ring";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { exibeNotaPublica } from "@/lib/avaliacao/utils";
import type { NegociacaoContexto } from "@/lib/negociacao/negociacao-types";
import { cn } from "@/lib/utils";

type PerfilInfluenciadorResumoCardProps = {
  contexto: NegociacaoContexto;
  className?: string;
};

export function PerfilInfluenciadorResumoCard({
  contexto,
  className,
}: PerfilInfluenciadorResumoCardProps) {
  const { influenciador, match } = contexto;

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        <MatchRing
          score={match.score}
          size="sm"
          showLabel
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg">{influenciador.nome}</CardTitle>
          <CardDescription className="mt-1">{influenciador.nicho}</CardDescription>
          <p className="text-texto-secundario mt-2 text-xs font-normal">
            Score de compatibilidade com esta demanda
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Perfil resumido — o @ e dados de contato ficam ocultos até o
          desbloqueio da conversa.
        </p>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground flex items-center gap-1 text-xs">
              <Users className="size-3" aria-hidden />
              Seguidores
            </dt>
            <dd className="font-data mt-0.5 font-semibold">
              {influenciador.seguidores.toLocaleString("pt-BR")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground flex items-center gap-1 text-xs">
              <Zap className="size-3" aria-hidden />
              Engajamento
            </dt>
            <dd className="font-data mt-0.5 font-semibold">
              {influenciador.engajamentoMedio}%
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground flex items-center gap-1 text-xs">
              <Star className="size-3" aria-hidden />
              Avaliação
            </dt>
            <dd className="font-data mt-0.5 font-semibold">
              {exibeNotaPublica({
                totalAvaliacoes: influenciador.totalAvaliacoes,
                notaMedia: influenciador.notaMedia,
              })
                ? `${influenciador.notaMedia!.toFixed(1)} (${influenciador.totalAvaliacoes})`
                : "Novo no Publi"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
