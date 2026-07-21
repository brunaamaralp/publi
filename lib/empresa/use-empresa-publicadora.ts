"use client";

import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";

const EMPRESA_DIRETA_NOME = "Marca Exemplo Ltda.";

type AgenciaCtx = NonNullable<ReturnType<typeof useAgenciaOpcional>>["agencia"];

export type EmpresaPublicadora =
  | {
      modo: "empresa";
      empresaId: string;
      empresaNome: string;
      agenciaNome: null;
      agencia: null;
    }
  | {
      modo: "agencia";
      empresaId: string;
      empresaNome: string;
      agenciaNome: string;
      agencia: AgenciaCtx;
    }
  | {
      /** Agência autenticada sem empresa-cliente selecionada — não publicar. */
      modo: "agencia_sem_cliente";
      empresaId: null;
      empresaNome: null;
      agenciaNome: string;
      agencia: AgenciaCtx;
    };

export function useEmpresaPublicadora(): EmpresaPublicadora {
  const agenciaCtx = useAgenciaOpcional();

  if (agenciaCtx?.agencia) {
    if (agenciaCtx.empresaAtiva) {
      return {
        modo: "agencia",
        empresaId: agenciaCtx.empresaAtiva.id,
        empresaNome:
          agenciaCtx.empresaAtiva.nomeFantasia ??
          agenciaCtx.empresaAtiva.razaoSocial,
        agenciaNome: agenciaCtx.agencia.razaoSocial,
        agencia: agenciaCtx.agencia,
      };
    }

    return {
      modo: "agencia_sem_cliente",
      empresaId: null,
      empresaNome: null,
      agenciaNome: agenciaCtx.agencia.razaoSocial,
      agencia: agenciaCtx.agencia,
    };
  }

  return {
    modo: "empresa",
    empresaId: EMPRESA_MOCK_ID,
    empresaNome: EMPRESA_DIRETA_NOME,
    agenciaNome: null,
    agencia: null,
  };
}
