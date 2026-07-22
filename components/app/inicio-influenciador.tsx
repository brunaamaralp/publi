"use client";

import {
  DashboardInfluenciador,
  useNomeExibicaoUsuario,
} from "@/components/influenciador/dashboard/dashboard-influenciador";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";

type InicioInfluenciadorProps = {
  nomeExibicao: string;
};

/** Dashboard consolidado — também acessível em `/influenciador`. */
export function InicioInfluenciador({ nomeExibicao }: InicioInfluenciadorProps) {
  return (
    <DashboardInfluenciador
      nomeExibicao={nomeExibicao}
      influenciadorId={INFLUENCIADOR_MOCK_ID}
    />
  );
}

export { useNomeExibicaoUsuario };
