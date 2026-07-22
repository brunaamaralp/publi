"use client";

import {
  DashboardInfluenciador,
  useNomeExibicaoUsuario,
} from "@/components/influenciador/dashboard/dashboard-influenciador";
import { GuardTipo } from "@/components/auth/guard-tipo";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";

export function DashboardInfluenciadorPageClient() {
  const nomeExibicao = useNomeExibicaoUsuario();

  return (
    <GuardTipo
      permitidos={["influenciador"]}
      mensagem="Esta área é exclusiva para contas de influenciador."
    >
      <DashboardInfluenciador
        nomeExibicao={nomeExibicao}
        influenciadorId={INFLUENCIADOR_MOCK_ID}
      />
    </GuardTipo>
  );
}
