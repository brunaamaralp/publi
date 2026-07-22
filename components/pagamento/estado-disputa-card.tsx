"use client";

import { ShieldAlert } from "lucide-react";

import {
  CardPagamentoRetido,
  IndicadorProvedorPagamentoRetido,
  ValorPagamentoRetidoDestaque,
} from "@/components/pagamento/pagamento-retido-ui";

type EstadoDisputaCardProps = {
  valor: number;
  motivo?: string;
  papel: "empresa" | "influenciador";
};

/** Estado bloqueado para ambas as partes — só o admin decide. */
export function EstadoDisputaCard({
  valor,
  motivo,
  papel,
}: EstadoDisputaCardProps) {
  return (
    <CardPagamentoRetido status="em_disputa" className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-ambar" aria-hidden />
        <div className="space-y-1">
          <h2 className="font-display text-base font-bold text-ambar-escuro">
            Em análise pela equipe Publi
          </h2>
          <p className="text-ambar-escuro/90 text-sm leading-relaxed font-normal">
            {papel === "empresa"
              ? "Seu reporte foi recebido. O valor permanece no pagamento retido até a Publi decidir: liberar para o influenciador ou reembolsar a empresa. Nenhuma ação sua altera o status agora."
              : "A empresa reportou um problema nesta entrega. O valor permanece no pagamento retido até a Publi decidir. Você não pode reenviar nem editar enquanto o caso estiver em análise."}
          </p>
        </div>
      </div>
      <ValorPagamentoRetidoDestaque valor={valor} status="em_disputa" tamanho="md" />
      {motivo ? (
        <div className="rounded-card border border-ambar/30 bg-ambar-claro/40 p-3 text-sm">
          <p className="font-medium text-ambar-escuro">Motivo do reporte</p>
          <p className="mt-1 font-normal leading-relaxed text-ambar-escuro/90">
            {motivo}
          </p>
        </div>
      ) : null}
      <IndicadorProvedorPagamentoRetido className="text-cinza-500" />
    </CardPagamentoRetido>
  );
}
