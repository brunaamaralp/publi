"use client";

import { GuardTipo } from "@/components/auth/guard-tipo";
import {
  DashboardEmpresa,
  useNomeExibicaoUsuario,
} from "@/components/empresa/dashboard/dashboard-empresa";
import { EMPRESA_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { EMPRESA_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";

export function DashboardEmpresaPageClient() {
  const nomeExibicao = useNomeExibicaoUsuario();

  return (
    <GuardTipo
      permitidos={["empresa"]}
      mensagem="Esta área é exclusiva para contas de empresa."
    >
      <DashboardEmpresa
        nomeExibicao={nomeExibicao}
        empresaId={EMPRESA_MOCK_ID}
        empresaUsuarioId={EMPRESA_NEGOCIACAO_USUARIO_ID}
      />
    </GuardTipo>
  );
}
