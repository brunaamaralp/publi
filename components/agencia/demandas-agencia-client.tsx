"use client";

import { ListaMinhasDemandas } from "@/components/empresa/demandas/lista-minhas-demandas";
import { useAgencia } from "@/lib/contexts/agencia-context";

export function DemandasAgenciaClient() {
  const { podeEditarClienteAtivo } = useAgencia();

  return (
    <ListaMinhasDemandas
      basePath="/agencia"
      somenteLeitura={!podeEditarClienteAtivo}
    />
  );
}
