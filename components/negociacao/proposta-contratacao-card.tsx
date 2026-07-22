"use client";

import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import type { PropostaContratacaoMensagem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PropostaContratacaoCardProps = {
  proposta: PropostaContratacaoMensagem;
  onRevisarConfirmar?: () => void;
  className?: string;
};

export function PropostaContratacaoCard({
  proposta,
  onRevisarConfirmar,
  className,
}: PropostaContratacaoCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm space-y-3 rounded-card border border-cinza-200 border-l-[3px] border-l-lilas bg-white p-3.5 text-left shadow-sm",
        className,
      )}
    >
      <div>
        <p className="text-texto-secundario text-[10px] font-medium uppercase tracking-wide">
          Termos acordados
        </p>
        {proposta.pacoteNome ? (
          <p className="font-display mt-0.5 font-bold">{proposta.pacoteNome}</p>
        ) : (
          <p className="font-display mt-0.5 font-bold">Proposta personalizada</p>
        )}
      </div>

      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-texto-secundario text-xs">Escopo</dt>
          <dd className="mt-0.5 whitespace-pre-wrap font-normal leading-relaxed">
            {proposta.escopo}
          </dd>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <dt className="text-texto-secundario text-xs">Valor</dt>
            <dd className="font-data mt-0.5 font-semibold">
              {formatarMoeda(proposta.valor)}
            </dd>
          </div>
          {proposta.dataAgendada ? (
            <div>
              <dt className="text-texto-secundario text-xs">Data</dt>
              <dd className="font-data mt-0.5 font-semibold">
                {new Date(`${proposta.dataAgendada}T12:00:00`).toLocaleDateString(
                  "pt-BR",
                )}
              </dd>
            </div>
          ) : null}
        </div>
      </dl>

      {onRevisarConfirmar ? (
        <Button
          type="button"
          variant="cta"
          size="sm"
          className="w-full"
          onClick={onRevisarConfirmar}
        >
          Revisar e confirmar contratação
        </Button>
      ) : null}

      <p className="text-texto-secundario text-[11px] font-normal leading-snug">
        Contatos pessoais continuam bloqueados neste chat — logística e pagamento
        só no checkout da plataforma.
      </p>
    </div>
  );
}
