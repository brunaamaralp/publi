"use client";

import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";

const EMPRESA_DIRETA_NOME = "Marca Exemplo Ltda.";

export function useEmpresaPublicadora() {
  const agenciaCtx = useAgenciaOpcional();

  if (agenciaCtx?.agencia && agenciaCtx.empresaAtiva) {
    return {
      modo: "agencia" as const,
      empresaId: agenciaCtx.empresaAtiva.id,
      empresaNome:
        agenciaCtx.empresaAtiva.nomeFantasia ??
        agenciaCtx.empresaAtiva.razaoSocial,
      agenciaNome: agenciaCtx.agencia.razaoSocial,
      agencia: agenciaCtx.agencia,
    };
  }

  return {
    modo: "empresa" as const,
    empresaId: EMPRESA_MOCK_ID,
    empresaNome: EMPRESA_DIRETA_NOME,
    agenciaNome: null,
    agencia: null,
  };
}
