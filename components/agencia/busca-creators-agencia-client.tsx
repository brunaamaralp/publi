"use client";

import { BuscaCreatorsFlow } from "@/components/empresa/busca-creators/busca-creators-flow";
import { useAgencia } from "@/lib/contexts/agencia-context";

export function BuscaCreatorsAgenciaClient() {
  const { podeEditarClienteAtivo } = useAgencia();

  return (
    <BuscaCreatorsFlow
      basePath="/agencia"
      somenteLeitura={!podeEditarClienteAtivo}
    />
  );
}
