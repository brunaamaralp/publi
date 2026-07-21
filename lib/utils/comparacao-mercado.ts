import type { FaixaSeguidores } from "@/lib/empresa/busca-creators";
import type { TipoServico } from "@/lib/influenciador/cadastro-utils";
import { TIPOS_SERVICO } from "@/lib/influenciador/cadastro-utils";
import type { Influenciador, TabelaPreco } from "@/lib/types";

/** Margem relativa à mediana (±) para classificar posição de mercado. */
export const MARGEM_POSICAO_MERCADO = 0.15;

/** Mínimo de peers com preço no tipo de serviço para emitir classificação. */
export const MIN_COHORT_POR_SERVICO = 5;

/**
 * Perfil usado só no cálculo de mercado.
 * Compõe `Influenciador` + `TabelaPreco` e campos já existentes em métrica/portfólio —
 * sem alterar o modelo de dados.
 */
export type PerfilComparacaoMercado = {
  influenciador: Influenciador;
  /** IDs de categorias com `tipo: "dominio"`. */
  categoriasDominioIds: string[];
  cidade: string;
  estado: string;
  seguidores: number;
  tabelaPrecos: TabelaPreco[];
};

export type PosicaoMercado =
  | "abaixo"
  | "na_media"
  | "acima"
  | "dados_insuficientes";

export type NivelRegiaoCohort = "cidade" | "estado" | "regiao_macro" | "nacional";

export type ComparacaoServicoMercado = {
  tipoServico: TipoServico;
  posicao: PosicaoMercado;
  tamanhoCohort: number;
  mediana: number | null;
  faixaMin: number | null;
  faixaMax: number | null;
};

export type ResumoComparacaoMercado = {
  nivelRegiao: NivelRegiaoCohort;
  tamanhoCohort: number;
  porServico: ComparacaoServicoMercado[];
  /** Contagem só entre serviços com classificação definitiva. */
  abaixo: number;
  naMedia: number;
  acima: number;
  insuficientes: number;
  textoResumo: string;
};

/** Mesmos limites de `FaixaSeguidores` em busca-creators (Prompt 16). */
export function obterFaixaSeguidores(seguidores: number): Exclude<
  FaixaSeguidores,
  "todos"
> {
  if (seguidores <= 10_000) return "ate_10k";
  if (seguidores <= 50_000) return "10k_50k";
  if (seguidores <= 100_000) return "50k_100k";
  if (seguidores <= 250_000) return "100k_250k";
  return "acima_250k";
}

export function mesmaFaixaSeguidores(a: number, b: number): boolean {
  return obterFaixaSeguidores(a) === obterFaixaSeguidores(b);
}

/** Regiões macro do IBGE — usadas ao afrouxar o filtro de localidade. */
export const REGIOES_MACRO: Record<string, readonly string[]> = {
  Norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  Nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  Sudeste: ["ES", "MG", "RJ", "SP"],
  Sul: ["PR", "RS", "SC"],
};

export function regiaoMacroDoEstado(estado: string): string | null {
  const uf = estado.trim().toUpperCase();
  for (const [nome, ufs] of Object.entries(REGIOES_MACRO)) {
    if (ufs.includes(uf)) return nome;
  }
  return null;
}

function normalizarCidade(cidade: string): string {
  return cidade
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function temDominioEmComum(
  a: string[],
  b: string[],
): boolean {
  if (a.length === 0 || b.length === 0) return false;
  const setB = new Set(b);
  return a.some((id) => setB.has(id));
}

function bateRegiao(
  peer: PerfilComparacaoMercado,
  atual: PerfilComparacaoMercado,
  nivel: NivelRegiaoCohort,
): boolean {
  const ufAtual = atual.estado.trim().toUpperCase();
  const ufPeer = peer.estado.trim().toUpperCase();

  switch (nivel) {
    case "cidade":
      return (
        ufAtual.length > 0 &&
        ufPeer === ufAtual &&
        normalizarCidade(atual.cidade).length > 0 &&
        normalizarCidade(peer.cidade) === normalizarCidade(atual.cidade)
      );
    case "estado":
      return ufAtual.length > 0 && ufPeer === ufAtual;
    case "regiao_macro": {
      const regiao = regiaoMacroDoEstado(ufAtual);
      if (!regiao) return false;
      return REGIOES_MACRO[regiao]?.includes(ufPeer) ?? false;
    }
    case "nacional":
      return true;
  }
}

/**
 * Monta o cohort de comparação: mesmo nicho (domínio), mesma faixa de
 * seguidores e região (afrouxada progressivamente se necessário).
 * Nunca inclui o próprio influenciador.
 */
export function montarCohortMercado(
  atual: PerfilComparacaoMercado,
  todos: PerfilComparacaoMercado[],
): { cohort: PerfilComparacaoMercado[]; nivelRegiao: NivelRegiaoCohort } {
  const base = todos.filter(
    (peer) =>
      peer.influenciador.id !== atual.influenciador.id &&
      temDominioEmComum(
        atual.categoriasDominioIds,
        peer.categoriasDominioIds,
      ) &&
      mesmaFaixaSeguidores(atual.seguidores, peer.seguidores),
  );

  const niveis: NivelRegiaoCohort[] = [
    "cidade",
    "estado",
    "regiao_macro",
    "nacional",
  ];

  let melhor: {
    cohort: PerfilComparacaoMercado[];
    nivelRegiao: NivelRegiaoCohort;
  } = { cohort: [], nivelRegiao: "nacional" };

  for (const nivel of niveis) {
    const cohort = base.filter((peer) => bateRegiao(peer, atual, nivel));
    melhor = { cohort, nivelRegiao: nivel };
    if (cohort.length >= MIN_COHORT_POR_SERVICO) {
      return melhor;
    }
  }

  return melhor;
}

export function calcularMediana(valores: number[]): number | null {
  if (valores.length === 0) return null;
  const ordenados = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  if (ordenados.length % 2 === 0) {
    return (ordenados[meio - 1]! + ordenados[meio]!) / 2;
  }
  return ordenados[meio]!;
}

export function classificarPosicaoMercado(
  precoPraticado: number,
  mediana: number,
  margem: number = MARGEM_POSICAO_MERCADO,
): Exclude<PosicaoMercado, "dados_insuficientes"> {
  if (mediana <= 0) return "na_media";
  const razao = precoPraticado / mediana;
  if (razao < 1 - margem) return "abaixo";
  if (razao > 1 + margem) return "acima";
  return "na_media";
}

function precoDoTipo(
  perfil: PerfilComparacaoMercado,
  tipo: TipoServico,
): number | null {
  const item = perfil.tabelaPrecos.find((t) => t.tipoServico === tipo);
  if (!item || item.precoPraticado <= 0) return null;
  return item.precoPraticado;
}

function textoResumoAgregado(
  abaixo: number,
  naMedia: number,
  acima: number,
  insuficientes: number,
  totalServicos: number,
): string {
  const classificados = abaixo + naMedia + acima;
  if (classificados === 0) {
    return "Ainda há poucos dados de mercado para comparar seus preços.";
  }

  if (abaixo === 0 && acima === 0 && naMedia > 0) {
    return "Seus preços estão, em média, na faixa de mercado.";
  }

  if (abaixo > 0 && abaixo >= acima && abaixo >= naMedia) {
    return `${abaixo} dos seus ${totalServicos} serviços estão abaixo do mercado${
      insuficientes > 0 ? ` (${insuficientes} sem dados suficientes)` : ""
    }.`;
  }

  if (acima > 0 && acima >= abaixo && acima >= naMedia) {
    return `${acima} dos seus ${totalServicos} serviços estão acima do mercado${
      insuficientes > 0 ? ` (${insuficientes} sem dados suficientes)` : ""
    }.`;
  }

  if (naMedia > 0) {
    return `Seus preços estão, em média, na faixa de mercado (${naMedia} de ${totalServicos} na média).`;
  }

  return "Seus preços variam em relação ao mercado — confira cada serviço.";
}

/**
 * Compara a tabela de preços do influenciador com a mediana do cohort similar.
 */
export function compararPrecosComMercado(
  atual: PerfilComparacaoMercado,
  todos: PerfilComparacaoMercado[],
): ResumoComparacaoMercado {
  const { cohort, nivelRegiao } = montarCohortMercado(atual, todos);

  const porServico: ComparacaoServicoMercado[] = TIPOS_SERVICO.map((tipo) => {
    const precosPeers = cohort
      .map((peer) => precoDoTipo(peer, tipo))
      .filter((v): v is number => v !== null);

    const tamanhoCohort = precosPeers.length;
    const mediana = calcularMediana(precosPeers);
    const faixaMin =
      precosPeers.length > 0 ? Math.min(...precosPeers) : null;
    const faixaMax =
      precosPeers.length > 0 ? Math.max(...precosPeers) : null;

    const meuPreco = precoDoTipo(atual, tipo);

    if (
      tamanhoCohort < MIN_COHORT_POR_SERVICO ||
      mediana === null ||
      meuPreco === null
    ) {
      return {
        tipoServico: tipo,
        posicao: "dados_insuficientes",
        tamanhoCohort,
        mediana,
        faixaMin,
        faixaMax,
      };
    }

    return {
      tipoServico: tipo,
      posicao: classificarPosicaoMercado(meuPreco, mediana),
      tamanhoCohort,
      mediana,
      faixaMin,
      faixaMax,
    };
  });

  let abaixo = 0;
  let naMedia = 0;
  let acima = 0;
  let insuficientes = 0;

  for (const item of porServico) {
    if (item.posicao === "abaixo") abaixo += 1;
    else if (item.posicao === "na_media") naMedia += 1;
    else if (item.posicao === "acima") acima += 1;
    else insuficientes += 1;
  }

  return {
    nivelRegiao,
    tamanhoCohort: cohort.length,
    porServico,
    abaixo,
    naMedia,
    acima,
    insuficientes,
    textoResumo: textoResumoAgregado(
      abaixo,
      naMedia,
      acima,
      insuficientes,
      porServico.length,
    ),
  };
}

export const LABELS_POSICAO_MERCADO: Record<
  Exclude<PosicaoMercado, "dados_insuficientes">,
  string
> = {
  abaixo: "Abaixo do mercado",
  na_media: "Na média do mercado",
  acima: "Acima do mercado",
};
