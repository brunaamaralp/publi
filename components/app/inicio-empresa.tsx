"use client";

import {
  DashboardEmpresa,
  useNomeExibicaoUsuario,
} from "@/components/empresa/dashboard/dashboard-empresa";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";

type InicioEmpresaProps = {
  nomeExibicao: string;
};

/** Dashboard consolidado — também acessível em `/empresa`. */
export function InicioEmpresa({ nomeExibicao }: InicioEmpresaProps) {
  return (
    <DashboardEmpresa
      nomeExibicao={nomeExibicao}
      empresaId={EMPRESA_MOCK_ID}
      empresaUsuarioId={EMPRESA_NEGOCIACAO_USUARIO_ID}
    />
  );
}

export { useNomeExibicaoUsuario };
