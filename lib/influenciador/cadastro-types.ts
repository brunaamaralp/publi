import type {
  Categoria,
  DisponibilidadeInfluenciador,
  Equipamento,
  PacoteServico,
  TabelaPreco,
  TipoAtuacao,
} from "@/lib/types";

export type AudienciaLinha = {
  id: string;
  valor: string;
  percentual: number | "";
};

export type CadastroDraft = {
  nome: string;
  bio: string;
  fotoPerfilUrl: string | null;
  categoriasDominio: Categoria[];
  categoriasInteresse: Categoria[];
  tiposAtuacao: TipoAtuacao[];
  disponibilidade: DisponibilidadeInfluenciador | null;
  equipamentos: Equipamento[];
  printMetricasUrl: string;
  seguidores: number | "";
  engajamentoMedio: number | "";
  audienciaGenero: AudienciaLinha[];
  audienciaFaixaEtaria: AudienciaLinha[];
  audienciaLocalidade: AudienciaLinha[];
  tabelaPrecos: TabelaPreco[];
  pacotes: PacoteServico[];
  plano: "basico" | "pro" | "elite" | null;
};

/** Wizard de criação de conta — só dados essenciais (passos 1 e 2). */
export const CADASTRO_PASSOS = [
  { id: "dados", label: "Dados básicos", description: "Identidade" },
  { id: "categorias", label: "Áreas", description: "Domínio e interesse" },
] as const;

/** Schemas de validação das seções pós-cadastro (antigos passos 3–5). */
export const PERFIL_SECOES = [
  { id: "metricas", label: "Métricas de audiência" },
  { id: "precos", label: "Pacotes e preços" },
  { id: "plano", label: "Escolher plano" },
] as const;

export function dadosDoPasso(
  passo: number,
  draft: CadastroDraft,
): Record<string, unknown> {
  switch (passo) {
    case 0:
      return { nome: draft.nome, bio: draft.bio };
    case 1:
      return {
        categoriasDominio: draft.categoriasDominio,
        categoriasInteresse: draft.categoriasInteresse,
        tiposAtuacao: draft.tiposAtuacao,
        disponibilidade: draft.disponibilidade,
      };
    default:
      return {};
  }
}

export function dadosSecaoMetricas(draft: CadastroDraft): Record<string, unknown> {
  return {
    printMetricasUrl: draft.printMetricasUrl,
    seguidores: draft.seguidores === "" ? undefined : draft.seguidores,
    engajamentoMedio:
      draft.engajamentoMedio === "" ? undefined : draft.engajamentoMedio,
    equipamentos: draft.equipamentos,
  };
}

export function dadosSecaoPrecos(draft: CadastroDraft): Record<string, unknown> {
  return {
    tabelaPrecos: draft.tabelaPrecos,
    pacotes: draft.pacotes.filter((p) => p.nome.trim().length > 0),
  };
}

export function dadosSecaoPlano(draft: CadastroDraft): Record<string, unknown> {
  return { plano: draft.plano ?? undefined };
}
