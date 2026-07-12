import { Lock, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

type PagamentoGarantidoCardProps = {
  valor: number;
  className?: string;
};

export function PagamentoGarantidoCard({
  valor,
  className,
}: PagamentoGarantidoCardProps) {
  return (
    <Card
      className={cn(
        "border-verde-acao/25 bg-verde-acao/5 overflow-hidden",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-verde-acao/15 flex size-9 items-center justify-center rounded-full">
            <Lock className="text-verde-acao size-4" aria-hidden />
          </div>
          <div>
            <CardTitle className="text-base text-verde-acao">
              Pagamento garantido
            </CardTitle>
            <CardDescription className="text-foreground/80">
              Valor reservado em escrow
            </CardDescription>
          </div>
          <ShieldCheck
            className="text-verde-acao ml-auto size-5 shrink-0"
            aria-hidden
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-data text-2xl font-bold">
          {formatarMoeda(valor)}
        </p>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          O valor já está reservado na plataforma e será liberado para você após
          a empresa confirmar a entrega do conteúdo.
        </p>
      </CardContent>
    </Card>
  );
}
