import { calcularPrecoBaseSugerido } from "@/lib/influenciador/cadastro-utils";
import type { TipoServico } from "@/lib/influenciador/cadastro-utils";
import { TIPOS_SERVICO } from "@/lib/influenciador/cadastro-utils";
import type { Influenciador, TabelaPreco } from "@/lib/types";
import type { PerfilComparacaoMercado } from "@/lib/utils/comparacao-mercado";

import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";

/** Multiplicadores por tipo — variam a posição relativa à mediana do cohort. */
type FatoresPreco = Partial<Record<TipoServico, number>>;

function influenciadorBase(
  id: string,
  nome: string,
  partial?: Partial<Influenciador>,
): Influenciador {
  return {
    id,
    usuarioId: `usr-${id}`,
    nome,
    bio: "",
    plano: "pro",
    nivelAtual: 1,
    pontosXp: 0,
    notaMediaAvaliacao: null,
    totalAvaliacoes: 0,
    tiposAtuacao: ["influenciador"],
    ...partial,
  };
}

function tabelaComFatores(
  idPrefix: string,
  seguidores: number,
  fatores: FatoresPreco = {},
): TabelaPreco[] {
  return TIPOS_SERVICO.map((tipo) => {
    const base = calcularPrecoBaseSugerido(seguidores, tipo);
    const fator = fatores[tipo] ?? 1;
    return {
      id: `${idPrefix}-${tipo}`,
      tipoServico: tipo,
      precoBaseSugerido: base,
      precoPraticado: Math.max(50, Math.round(base * fator)),
    };
  });
}

function perfil(params: {
  id: string;
  nome: string;
  dominioIds: string[];
  cidade: string;
  estado: string;
  seguidores: number;
  fatores?: FatoresPreco;
}): PerfilComparacaoMercado {
  return {
    influenciador: influenciadorBase(params.id, params.nome),
    categoriasDominioIds: params.dominioIds,
    cidade: params.cidade,
    estado: params.estado,
    seguidores: params.seguidores,
    tabelaPrecos: tabelaComFatores(params.id, params.seguidores, params.fatores),
  };
}

/**
 * Mercado mock para comparação de preços.
 * Densidade mínima ~6–8 peers por combinação nicho + faixa + região usada nos testes.
 * Preços variados para gerar abaixo / na média / acima.
 */
export const INFLUENCIADORES_MERCADO_MOCK: PerfilComparacaoMercado[] = [
  // —— Beleza · 100k–250k · SP / Sudeste (cohort da Ana Beatriz) ——
  perfil({
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    dominioIds: ["cat-beleza"],
    cidade: "São Paulo",
    estado: "SP",
    seguidores: 128_000,
    // Misto: reels abaixo, stories na média, post acima, unboxing abaixo, live na média
    fatores: {
      reels: 0.75,
      stories: 1.0,
      post_feed: 1.35,
      unboxing: 0.7,
      live: 0.98,
    },
  }),
  perfil({
    id: "inf-mkt-bel-01",
    nome: "Peer Beleza 01",
    dominioIds: ["cat-beleza"],
    cidade: "São Paulo",
    estado: "SP",
    seguidores: 118_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-bel-02",
    nome: "Peer Beleza 02",
    dominioIds: ["cat-beleza"],
    cidade: "São Paulo",
    estado: "SP",
    seguidores: 135_000,
    fatores: { reels: 1.05, stories: 0.95, post_feed: 1.1, unboxing: 1.0, live: 1.05 },
  }),
  perfil({
    id: "inf-mkt-bel-03",
    nome: "Peer Beleza 03",
    dominioIds: ["cat-beleza"],
    cidade: "São Paulo",
    estado: "SP",
    seguidores: 142_000,
    fatores: { reels: 0.95, stories: 1.05, post_feed: 0.9, unboxing: 1.1, live: 0.95 },
  }),
  perfil({
    id: "inf-mkt-bel-04",
    nome: "Peer Beleza 04",
    dominioIds: ["cat-beleza"],
    cidade: "Campinas",
    estado: "SP",
    seguidores: 110_000,
    fatores: { reels: 1.1, stories: 1.0, post_feed: 1.05, unboxing: 0.95, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-bel-05",
    nome: "Peer Beleza 05",
    dominioIds: ["cat-beleza"],
    cidade: "Santos",
    estado: "SP",
    seguidores: 155_000,
    fatores: { reels: 1.0, stories: 1.1, post_feed: 1.0, unboxing: 1.05, live: 1.1 },
  }),
  perfil({
    id: "inf-mkt-bel-06",
    nome: "Peer Beleza 06",
    dominioIds: ["cat-beleza"],
    cidade: "Guarulhos",
    estado: "SP",
    seguidores: 125_000,
    fatores: { reels: 0.9, stories: 0.9, post_feed: 0.95, unboxing: 0.9, live: 0.9 },
  }),
  perfil({
    id: "inf-mkt-bel-07",
    nome: "Peer Beleza 07",
    dominioIds: ["cat-beleza"],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    seguidores: 160_000,
    fatores: { reels: 1.15, stories: 1.0, post_feed: 1.2, unboxing: 1.15, live: 1.05 },
  }),
  perfil({
    id: "inf-mkt-bel-08",
    nome: "Peer Beleza 08",
    dominioIds: ["cat-beleza"],
    cidade: "Belo Horizonte",
    estado: "MG",
    seguidores: 105_000,
    fatores: { reels: 1.0, stories: 1.05, post_feed: 0.85, unboxing: 1.0, live: 1.0 },
  }),

  // —— Beleza · 10k–50k · SP (cohort micro / Úrsula Glow) ——
  perfil({
    id: "inf-cat-021",
    nome: "Úrsula Glow",
    dominioIds: ["cat-beleza"],
    cidade: "Ribeirão Preto",
    estado: "SP",
    seguidores: 29_000,
    fatores: {
      reels: 1.4,
      stories: 1.0,
      post_feed: 0.7,
      unboxing: 1.0,
      live: 1.3,
    },
  }),
  perfil({
    id: "inf-mkt-bel-m01",
    nome: "Peer Beleza Micro 01",
    dominioIds: ["cat-beleza"],
    cidade: "Ribeirão Preto",
    estado: "SP",
    seguidores: 22_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-bel-m02",
    nome: "Peer Beleza Micro 02",
    dominioIds: ["cat-beleza"],
    cidade: "São Paulo",
    estado: "SP",
    seguidores: 35_000,
    fatores: { reels: 0.95, stories: 1.05, post_feed: 1.0, unboxing: 0.95, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-bel-m03",
    nome: "Peer Beleza Micro 03",
    dominioIds: ["cat-beleza"],
    cidade: "São Paulo",
    estado: "SP",
    seguidores: 41_000,
    fatores: { reels: 1.05, stories: 0.95, post_feed: 1.1, unboxing: 1.05, live: 0.95 },
  }),
  perfil({
    id: "inf-mkt-bel-m04",
    nome: "Peer Beleza Micro 04",
    dominioIds: ["cat-beleza"],
    cidade: "Campinas",
    estado: "SP",
    seguidores: 18_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 0.9, unboxing: 1.1, live: 1.05 },
  }),
  perfil({
    id: "inf-mkt-bel-m05",
    nome: "Peer Beleza Micro 05",
    dominioIds: ["cat-beleza"],
    cidade: "Sorocaba",
    estado: "SP",
    seguidores: 45_000,
    fatores: { reels: 1.1, stories: 1.1, post_feed: 1.05, unboxing: 1.0, live: 1.1 },
  }),
  perfil({
    id: "inf-mkt-bel-m06",
    nome: "Peer Beleza Micro 06",
    dominioIds: ["cat-beleza"],
    cidade: "Santos",
    estado: "SP",
    seguidores: 27_000,
    fatores: { reels: 0.9, stories: 0.9, post_feed: 0.95, unboxing: 0.9, live: 0.9 },
  }),
  perfil({
    id: "inf-mkt-bel-m07",
    nome: "Peer Beleza Micro 07",
    dominioIds: ["cat-beleza"],
    cidade: "São Paulo",
    estado: "SP",
    seguidores: 32_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),

  // —— Fitness · 50k–100k · PR / Sul ——
  perfil({
    id: "inf-cat-002",
    nome: "Bruno Fit Costa",
    dominioIds: ["cat-fitness"],
    cidade: "Curitiba",
    estado: "PR",
    seguidores: 89_000,
    fatores: {
      reels: 0.8,
      stories: 0.75,
      post_feed: 1.0,
      unboxing: 1.25,
      live: 1.0,
    },
  }),
  perfil({
    id: "inf-mkt-fit-01",
    nome: "Peer Fitness 01",
    dominioIds: ["cat-fitness"],
    cidade: "Curitiba",
    estado: "PR",
    seguidores: 72_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-fit-02",
    nome: "Peer Fitness 02",
    dominioIds: ["cat-fitness"],
    cidade: "Curitiba",
    estado: "PR",
    seguidores: 95_000,
    fatores: { reels: 1.05, stories: 0.95, post_feed: 1.05, unboxing: 1.0, live: 1.05 },
  }),
  perfil({
    id: "inf-mkt-fit-03",
    nome: "Peer Fitness 03",
    dominioIds: ["cat-fitness"],
    cidade: "Londrina",
    estado: "PR",
    seguidores: 61_000,
    fatores: { reels: 0.95, stories: 1.05, post_feed: 0.95, unboxing: 0.95, live: 0.95 },
  }),
  perfil({
    id: "inf-mkt-fit-04",
    nome: "Peer Fitness 04",
    dominioIds: ["cat-fitness"],
    cidade: "Maringá",
    estado: "PR",
    seguidores: 84_000,
    fatores: { reels: 1.1, stories: 1.0, post_feed: 1.1, unboxing: 1.1, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-fit-05",
    nome: "Peer Fitness 05",
    dominioIds: ["cat-fitness"],
    cidade: "Florianópolis",
    estado: "SC",
    seguidores: 78_000,
    fatores: { reels: 1.0, stories: 1.1, post_feed: 1.0, unboxing: 1.05, live: 1.1 },
  }),
  perfil({
    id: "inf-mkt-fit-06",
    nome: "Peer Fitness 06",
    dominioIds: ["cat-fitness"],
    cidade: "Porto Alegre",
    estado: "RS",
    seguidores: 55_000,
    fatores: { reels: 0.9, stories: 0.9, post_feed: 0.9, unboxing: 0.9, live: 0.9 },
  }),
  perfil({
    id: "inf-mkt-fit-07",
    nome: "Peer Fitness 07",
    dominioIds: ["cat-fitness"],
    cidade: "Curitiba",
    estado: "PR",
    seguidores: 99_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),

  // —— Moda · 100k–250k · RJ / Sudeste ——
  perfil({
    id: "inf-cat-003",
    nome: "Carla Mendes",
    dominioIds: ["cat-moda"],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    seguidores: 210_000,
    fatores: {
      reels: 1.0,
      stories: 1.4,
      post_feed: 0.7,
      unboxing: 1.0,
      live: 0.8,
    },
  }),
  perfil({
    id: "inf-mkt-mod-01",
    nome: "Peer Moda 01",
    dominioIds: ["cat-moda"],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    seguidores: 185_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-mod-02",
    nome: "Peer Moda 02",
    dominioIds: ["cat-moda"],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    seguidores: 220_000,
    fatores: { reels: 1.05, stories: 0.95, post_feed: 1.05, unboxing: 1.05, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-mod-03",
    nome: "Peer Moda 03",
    dominioIds: ["cat-moda"],
    cidade: "Niterói",
    estado: "RJ",
    seguidores: 145_000,
    fatores: { reels: 0.95, stories: 1.05, post_feed: 0.95, unboxing: 0.95, live: 0.95 },
  }),
  perfil({
    id: "inf-mkt-mod-04",
    nome: "Peer Moda 04",
    dominioIds: ["cat-moda"],
    cidade: "São Paulo",
    estado: "SP",
    seguidores: 198_000,
    fatores: { reels: 1.1, stories: 1.0, post_feed: 1.1, unboxing: 1.0, live: 1.1 },
  }),
  perfil({
    id: "inf-mkt-mod-05",
    nome: "Peer Moda 05",
    dominioIds: ["cat-moda"],
    cidade: "Belo Horizonte",
    estado: "MG",
    seguidores: 130_000,
    fatores: { reels: 1.0, stories: 1.1, post_feed: 1.0, unboxing: 1.1, live: 1.05 },
  }),
  perfil({
    id: "inf-mkt-mod-06",
    nome: "Peer Moda 06",
    dominioIds: ["cat-moda"],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    seguidores: 240_000,
    fatores: { reels: 0.9, stories: 0.9, post_feed: 0.9, unboxing: 0.9, live: 0.9 },
  }),
  perfil({
    id: "inf-mkt-mod-07",
    nome: "Peer Moda 07",
    dominioIds: ["cat-moda"],
    cidade: "Rio de Janeiro",
    estado: "RJ",
    seguidores: 175_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),

  // —— Tecnologia · 50k–100k · SC (cohort menor em cidade; afrouxa para estado/macro) ——
  perfil({
    id: "inf-cat-024",
    nome: "Yuri Code",
    dominioIds: ["cat-tecnologia"],
    cidade: "Joinville",
    estado: "SC",
    seguidores: 58_000,
    fatores: {
      reels: 1.0,
      stories: 1.0,
      post_feed: 1.0,
      unboxing: 1.0,
      live: 1.0,
    },
  }),
  perfil({
    id: "inf-mkt-tec-01",
    nome: "Peer Tech 01",
    dominioIds: ["cat-tecnologia"],
    cidade: "Florianópolis",
    estado: "SC",
    seguidores: 64_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-tec-02",
    nome: "Peer Tech 02",
    dominioIds: ["cat-tecnologia"],
    cidade: "Blumenau",
    estado: "SC",
    seguidores: 71_000,
    fatores: { reels: 1.05, stories: 0.95, post_feed: 1.05, unboxing: 1.0, live: 1.05 },
  }),
  perfil({
    id: "inf-mkt-tec-03",
    nome: "Peer Tech 03",
    dominioIds: ["cat-tecnologia"],
    cidade: "Curitiba",
    estado: "PR",
    seguidores: 82_000,
    fatores: { reels: 0.95, stories: 1.05, post_feed: 0.95, unboxing: 0.95, live: 0.95 },
  }),
  perfil({
    id: "inf-mkt-tec-04",
    nome: "Peer Tech 04",
    dominioIds: ["cat-tecnologia"],
    cidade: "Porto Alegre",
    estado: "RS",
    seguidores: 55_000,
    fatores: { reels: 1.1, stories: 1.0, post_feed: 1.1, unboxing: 1.1, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-tec-05",
    nome: "Peer Tech 05",
    dominioIds: ["cat-tecnologia"],
    cidade: "Chapecó",
    estado: "SC",
    seguidores: 90_000,
    fatores: { reels: 1.0, stories: 1.1, post_feed: 1.0, unboxing: 1.05, live: 1.1 },
  }),
  perfil({
    id: "inf-mkt-tec-06",
    nome: "Peer Tech 06",
    dominioIds: ["cat-tecnologia"],
    cidade: "Criciúma",
    estado: "SC",
    seguidores: 48_000, // 10k_50k — fora da faixa do Yuri; não entra no cohort dele
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),
  perfil({
    id: "inf-mkt-tec-07",
    nome: "Peer Tech 07",
    dominioIds: ["cat-tecnologia"],
    cidade: "Joinville",
    estado: "SC",
    seguidores: 66_000,
    fatores: { reels: 0.9, stories: 0.9, post_feed: 0.9, unboxing: 0.9, live: 0.9 },
  }),
  perfil({
    id: "inf-mkt-tec-08",
    nome: "Peer Tech 08",
    dominioIds: ["cat-tecnologia"],
    cidade: "Joinville",
    estado: "SC",
    seguidores: 75_000,
    fatores: { reels: 1.0, stories: 1.0, post_feed: 1.0, unboxing: 1.0, live: 1.0 },
  }),
];

/** Lista usada pelo cálculo local (fase mock). */
export function listarInfluenciadoresMercado(): PerfilComparacaoMercado[] {
  return INFLUENCIADORES_MERCADO_MOCK;
}
