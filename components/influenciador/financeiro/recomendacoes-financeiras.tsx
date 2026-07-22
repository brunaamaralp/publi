import { Lightbulb } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RecomendacaoFinanceira } from "@/lib/financeiro/types";

type RecomendacoesFinanceirasProps = {
  recomendacoes: RecomendacaoFinanceira[];
};

export function RecomendacoesFinanceiras({
  recomendacoes,
}: RecomendacoesFinanceirasProps) {
  return (
    <section className="space-y-4" aria-labelledby="recomendacoes-titulo">
      <div>
        <h2
          id="recomendacoes-titulo"
          className="font-display text-lg font-semibold"
        >
          Recomendações
        </h2>
        <p className="text-muted-foreground text-sm">
          Dicas com base no seu histórico na plataforma
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recomendacoes.map((rec) => (
          <Card key={rec.id} className="banner-informativo border-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-start gap-2 text-base">
                <Lightbulb
                  className="text-primary mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                {rec.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {rec.descricao}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
