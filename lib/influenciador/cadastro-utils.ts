import type {
  AudienciaDemografia,
  Categoria,
  Equipamento,
  Influenciador,
  MetricaPerfil,
  PacoteServico,
  TabelaPreco,
} from "@/lib/types";
import type { Usuario } from "@/lib/types/usuario";

import type { CadastroDraft } from "@/lib/influenciador/cadastro-types";

export const TIPOS_SERVICO = [
  "reels",
  "stories",
  "post_feed",
  "unboxing",
  "live",
] as const;

export type TipoServico = (typeof TIPOS_SERVICO)[number];

export const LABELS_TIPO_SERVICO: Record<TipoServico, string> = {
  reels: "Reels",
  stories: "Stories",
  post_feed: "Post feed",
  unboxing: "Unboxing",
  live: "Live",
};

const FATORES_PRECO: Record<TipoServico, number> = {
  reels: 15,
  stories: 8,
  post_feed: 10,
  unboxing: 12,
  live: 20,
};

export function calcularPrecoBaseSugerido(
  seguidores: number,
  tipo: TipoServico,
): number {
  return Math.max(50, Math.round((seguidores / 1000) * FATORES_PRECO[tipo]));
}

export function criarTabelaPrecosInicial(seguidores: number): TabelaPreco[] {
  return TIPOS_SERVICO.map((tipoServico) => ({
    id: crypto.randomUUID(),
    tipoServico,
    precoBaseSugerido: calcularPrecoBaseSugerido(seguidores, tipoServico),
    precoPraticado: calcularPrecoBaseSugerido(seguidores, tipoServico),
  }));
}

export function atualizarPrecosBase(
  tabela: TabelaPreco[],
  seguidores: number,
): TabelaPreco[] {
  return tabela.map((item) => ({
    ...item,
    precoBaseSugerido: calcularPrecoBaseSugerido(seguidores, item.tipoServico),
  }));
}

export function somaPercentuais(
  linhas: { percentual: number | "" }[],
): number {
  return linhas.reduce((acc, linha) => {
    const valor = linha.percentual === "" ? 0 : linha.percentual;
    return acc + valor;
  }, 0);
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export type CadastroPayload = {
  usuario: Usuario;
  influenciador: Influenciador;
  categorias: Categoria[];
  equipamentos: Equipamento[];
  metricaPerfil: MetricaPerfil;
  audiencia: AudienciaDemografia[];
  tabelaPrecos: TabelaPreco[];
  pacotes: PacoteServico[];
};

export function montarPayload(draft: CadastroDraft): CadastroPayload {
  const agora = new Date().toISOString();

  return {
    usuario: {
      id: "usr-mock",
      email: "influenciador@exemplo.com",
      tipo: "influenciador",
      status: "pendente_verificacao",
      criadoEm: agora,
    },
    influenciador: {
      id: crypto.randomUUID(),
      usuarioId: "usr-mock",
      nome: draft.nome,
      bio: draft.bio,
      plano: draft.plano ?? "pro",
      nivelAtual: 1,
      pontosXp: 0,
      notaMediaAvaliacao: null,
      totalAvaliacoes: 0,
    },
    categorias: [
      ...draft.categoriasDominio,
      ...draft.categoriasInteresse,
    ],
    equipamentos: draft.equipamentos.filter((e) => e.tipo.trim().length > 0),
    metricaPerfil: {
      id: crypto.randomUUID(),
      dataReferencia: agora,
      seguidores: draft.seguidores as number,
      engajamentoMedio: draft.engajamentoMedio as number,
      printUrl: draft.printMetricasUrl,
      statusValidacao: "pendente",
    },
    audiencia: [
      ...draft.audienciaGenero.map((l) => ({
        dimensao: "genero" as const,
        valor: l.valor,
        percentual: l.percentual as number,
      })),
      ...draft.audienciaFaixaEtaria.map((l) => ({
        dimensao: "faixa_etaria" as const,
        valor: l.valor,
        percentual: l.percentual as number,
      })),
      ...draft.audienciaLocalidade.map((l) => ({
        dimensao: "localidade" as const,
        valor: l.valor,
        percentual: l.percentual as number,
      })),
    ].filter((l) => l.valor.trim().length > 0),
    tabelaPrecos: draft.tabelaPrecos,
    pacotes: draft.pacotes,
  };
}

export function criarEstadoInicial(): CadastroDraft {
  return {
    nome: "",
    bio: "",
    fotoPerfilUrl: null,
    categoriasDominio: [],
    categoriasInteresse: [],
    equipamentos: [],
    printMetricasUrl: "",
    seguidores: "",
    engajamentoMedio: "",
    audienciaGenero: [],
    audienciaFaixaEtaria: [],
    audienciaLocalidade: [],
    tabelaPrecos: criarTabelaPrecosInicial(0),
    pacotes: [],
    plano: "pro",
  };
}

/** Percentual de completude do perfil (0–100) para indicador visual no wizard. */
export function calcularCompletudePerfil(draft: CadastroDraft): number {
  let pontos = 0;

  if (draft.nome.trim().length >= 2) pontos += 20;
  if (draft.bio.trim().length >= 20) pontos += 10;
  if (draft.fotoPerfilUrl) pontos += 5;
  if (draft.categoriasDominio.length > 0) pontos += 15;
  if (draft.seguidores !== "" && draft.engajamentoMedio !== "") pontos += 20;
  if (draft.printMetricasUrl) pontos += 5;
  if (draft.equipamentos.some((e) => e.tipo.trim())) pontos += 10;
  if (
    draft.audienciaGenero.length > 0 ||
    draft.audienciaFaixaEtaria.length > 0 ||
    draft.audienciaLocalidade.length > 0
  ) {
    pontos += 10;
  }
  if (draft.pacotes.some((p) => p.nome.trim())) pontos += 5;

  return Math.min(100, pontos);
}

