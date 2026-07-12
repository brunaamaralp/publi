"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PapelPagamento } from "@/lib/pagamento/pagamento-types";

type SeletorPapelPagamentoProps = {
  papel: PapelPagamento;
  onPapelChange: (papel: PapelPagamento) => void;
};

export function SeletorPapelPagamento({
  papel,
  onPapelChange,
}: SeletorPapelPagamentoProps) {
  return (
    <div className="border-border bg-muted/40 secao-editavel space-y-2 ring-0 p-3">
      <p className="text-texto-secundario text-xs font-medium uppercase tracking-wide">
        Simular visão (demo)
      </p>
      <Tabs
        value={papel}
        onValueChange={(v) => onPapelChange(v as PapelPagamento)}
      >
        <TabsList className="w-full">
          <TabsTrigger value="empresa" className="flex-1">
            Empresa
          </TabsTrigger>
          <TabsTrigger value="influenciador" className="flex-1">
            Influenciador
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
