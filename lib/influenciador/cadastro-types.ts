import type {
  Categoria,
  Equipamento,
  PacoteServico,
  TabelaPreco,
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

export const CADASTRO_PASSOS = [
  { id: "dados", label: "Dados básicos", description: "Identidade" },
  { id: "categorias", label: "Áreas", description: "Domínio e interesse" },
  { id: "metricas", label: "Audiência", description: "Métricas e equipamentos" },
  { id: "precos", label: "Preços", description: "Pacotes e tabela" },
  { id: "revisao", label: "Revisão", description: "Plano e confirmação" },
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
      };
    case 2:
      return {
        printMetricasUrl: draft.printMetricasUrl,
        seguidores: draft.seguidores === "" ? undefined : draft.seguidores,
        engajamentoMedio:
          draft.engajamentoMedio === "" ? undefined : draft.engajamentoMedio,
        equipamentos: draft.equipamentos,
      };
    case 3:
      return {
        tabelaPrecos: draft.tabelaPrecos,
        pacotes: draft.pacotes,
      };
    case 4:
      return { plano: draft.plano ?? undefined };
    default:
      return {};
  }
}
