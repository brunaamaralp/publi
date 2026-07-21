import {
  creatorExibeNota,
  type CreatorCatalogo,
} from "@/lib/empresa/creator-catalogo-types";
import { STATUS_DEMANDA_BUSCA } from "@/lib/demandas/utils";
import { listarDemandasEmpresa } from "@/lib/empresa/demandas-utils";
import type { MinhaDemandaItem } from "@/lib/empresa/demandas-types";
import { nomeNicho } from "@/lib/empresa/orcamento-nicho";
import { CREATORS_CATALOGO_MOCK } from "@/lib/mock-data/creators-catalogo";
import { influenciadorAtivoEmListagens } from "@/lib/mock-data/influenciadores-status";
import { formatarNumeroGrande } from "@/lib/resultados/resultados-utils";

export type FaixaSeguidores =
  | "todos"
  | "ate_10k"
  | "10k_50k"
  | "50k_100k"
  | "100k_250k"
  | "acima_250k";

export type FaixaEngajamento =
  | "todos"
  | "ate_3"
  | "3_5"
  | "5_8"
  | "acima_8";

export type FaixaPrecoPacote =
  | "todos"
  | "ate_1k"
  | "1k_2k"
  | "2k_4k"
  | "acima_4k";

export type FiltrosBuscaCreators = {
  texto: string;
  nichoId: string | "todos";
  seguidores: FaixaSeguidores;
  engajamento: FaixaEngajamento;
  preco: FaixaPrecoPacote;
  estado: string | "todos";
};

export const FILTROS_BUSCA_CREATORS_INICIAIS: FiltrosBuscaCreators = {
  texto: "",
  nichoId: "todos",
  seguidores: "todos",
  engajamento: "todos",
  preco: "todos",
  estado: "todos",
};

export const LABELS_FAIXA_SEGUIDORES: Record<FaixaSeguidores, string> = {
  todos: "Qualquer alcance",
  ate_10k: "Até 10 mil",
  "10k_50k": "10 mil – 50 mil",
  "50k_100k": "50 mil – 100 mil",
  "100k_250k": "100 mil – 250 mil",
  acima_250k: "Acima de 250 mil",
};

export const LABELS_FAIXA_ENGAJAMENTO: Record<FaixaEngajamento, string> = {
  todos: "Qualquer engajamento",
  ate_3: "Até 3%",
  "3_5": "3% – 5%",
  "5_8": "5% – 8%",
  acima_8: "Acima de 8%",
};

export const LABELS_FAIXA_PRECO: Record<FaixaPrecoPacote, string> = {
  todos: "Qualquer preço",
  ate_1k: "Até R$ 1.000",
  "1k_2k": "R$ 1.000 – R$ 2.000",
  "2k_4k": "R$ 2.000 – R$ 4.000",
  acima_4k: "Acima de R$ 4.000",
};

export const PAGE_SIZE_BUSCA_CREATORS = 9;

export function listarCreatorsAtivos(): CreatorCatalogo[] {
  return CREATORS_CATALOGO_MOCK.filter(
    (c) => c.status === "ativo" && influenciadorAtivoEmListagens(c.id),
  );
}

export function obterCreatorPorId(id: string): CreatorCatalogo | null {
  return listarCreatorsAtivos().find((c) => c.id === id) ?? null;
}

function bateFaixaSeguidores(
  seguidores: number,
  faixa: FaixaSeguidores,
): boolean {
  switch (faixa) {
    case "todos":
      return true;
    case "ate_10k":
      return seguidores <= 10_000;
    case "10k_50k":
      return seguidores > 10_000 && seguidores <= 50_000;
    case "50k_100k":
      return seguidores > 50_000 && seguidores <= 100_000;
    case "100k_250k":
      return seguidores > 100_000 && seguidores <= 250_000;
    case "acima_250k":
      return seguidores > 250_000;
  }
}

function bateFaixaEngajamento(
  engajamento: number,
  faixa: FaixaEngajamento,
): boolean {
  switch (faixa) {
    case "todos":
      return true;
    case "ate_3":
      return engajamento <= 3;
    case "3_5":
      return engajamento > 3 && engajamento <= 5;
    case "5_8":
      return engajamento > 5 && engajamento <= 8;
    case "acima_8":
      return engajamento > 8;
  }
}

function bateFaixaPreco(preco: number, faixa: FaixaPrecoPacote): boolean {
  switch (faixa) {
    case "todos":
      return true;
    case "ate_1k":
      return preco <= 1000;
    case "1k_2k":
      return preco > 1000 && preco <= 2000;
    case "2k_4k":
      return preco > 2000 && preco <= 4000;
    case "acima_4k":
      return preco > 4000;
  }
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filtrarCreators(
  filtros: FiltrosBuscaCreators,
  creators = listarCreatorsAtivos(),
): CreatorCatalogo[] {
  const termo = normalizar(filtros.texto);

  return creators.filter((c) => {
    if (filtros.nichoId !== "todos" && c.nichoId !== filtros.nichoId) {
      return false;
    }
    if (!bateFaixaSeguidores(c.seguidores, filtros.seguidores)) return false;
    if (!bateFaixaEngajamento(c.engajamentoMedio, filtros.engajamento)) {
      return false;
    }
    if (!bateFaixaPreco(c.precoPacoteMin, filtros.preco)) return false;
    if (filtros.estado !== "todos" && c.estado !== filtros.estado) {
      return false;
    }

    if (!termo) return true;

    const haystack = normalizar(
      `${c.nome} ${c.handle} ${c.bio} ${nomeNicho(c.nichoId)} ${c.cidade}`,
    );
    return haystack.includes(termo);
  });
}

export function estadosDisponiveisNoCatalogo(): string[] {
  return Array.from(new Set(listarCreatorsAtivos().map((c) => c.estado))).sort(
    (a, b) => a.localeCompare(b, "pt-BR"),
  );
}

/** Demandas elegíveis para convite (ativas na busca). */
export function listarDemandasAtivasParaConvite(
  empresaId: string,
): MinhaDemandaItem[] {
  return listarDemandasEmpresa(empresaId).filter((item) =>
    STATUS_DEMANDA_BUSCA.has(item.demanda.status),
  );
}

export function formatarFaixaSeguidores(seguidores: number): string {
  return formatarNumeroGrande(seguidores);
}

export function rotuloAvaliacaoCreator(creator: CreatorCatalogo): string {
  if (!creatorExibeNota(creator)) return "Novo no Publi";
  return `${creator.notaMediaAvaliacao!.toFixed(1)} (${creator.totalAvaliacoes})`;
}

export function filtrosBuscaAtivos(filtros: FiltrosBuscaCreators): boolean {
  return (
    filtros.texto.trim() !== "" ||
    filtros.nichoId !== "todos" ||
    filtros.seguidores !== "todos" ||
    filtros.engajamento !== "todos" ||
    filtros.preco !== "todos" ||
    filtros.estado !== "todos"
  );
}
