import type { AudienciaLinha } from "@/lib/influenciador/cadastro-types";
import type { Demanda, PublicoAlvoDemanda } from "@/lib/types";
import { demandaFormSchema } from "@/lib/schemas/demanda";
import { MINHAS_DEMANDAS_MOCK } from "@/lib/mock-data/minhas-demandas";
import { mesclarDemandasAgenciaClientes } from "@/lib/agencia/dashboard-utils";
import {
  orcamentoMinimoNicho,
  validarOrcamentoNicho,
} from "@/lib/empresa/orcamento-nicho";

import type {
  DemandaPublicacaoDraft,
  MinhaDemandaItem,
} from "@/lib/empresa/demandas-types";

const STORAGE_KEY = "minhas-demandas-v2";

export const LABELS_STATUS_DEMANDA: Record<Demanda["status"], string> = {
  rascunho: "Rascunho",
  aberta: "Aberta",
  em_negociacao: "Em negociação",
  em_andamento: "Em andamento",
  fechada: "Fechada",
  cancelada: "Cancelada",
};

export function criarDemandaPublicacaoInicial(): DemandaPublicacaoDraft {
  return {
    titulo: "",
    briefing: "",
    formatoEntrega: "",
    nichoId: "",
    orcamento: "",
    prazo: "",
    publicoGenero: [],
    publicoFaixaEtaria: [],
    publicoLocalidade: [],
  };
}

function mapPublico(
  linhas: AudienciaLinha[],
  dimensao: PublicoAlvoDemanda["dimensao"],
): PublicoAlvoDemanda[] {
  return linhas
    .filter((l) => l.valor.trim())
    .map((l) => ({ dimensao, valor: l.valor.trim() }));
}

export function montarPublicoAlvo(
  draft: DemandaPublicacaoDraft,
): PublicoAlvoDemanda[] {
  return [
    ...mapPublico(draft.publicoGenero, "genero"),
    ...mapPublico(draft.publicoFaixaEtaria, "faixa_etaria"),
    ...mapPublico(draft.publicoLocalidade, "localidade"),
  ];
}

/** Erros de publicação, incluindo faixa mínima do nicho. */
export function validarDemandaPublicacao(
  draft: DemandaPublicacaoDraft,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.formatoEntrega) {
    errors.formatoEntrega = "Selecione o formato de entrega";
  }

  if (!draft.nichoId) {
    errors.nichoId = "Selecione o nicho da campanha";
  }

  const result = demandaFormSchema.safeParse({
    titulo: draft.titulo,
    briefing: draft.briefing,
    orcamento:
      draft.orcamento === "" ? undefined : Number(draft.orcamento),
    formatoEntrega: draft.formatoEntrega || undefined,
    prazo: draft.prazo,
  });

  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string") {
        errors[path] = issue.message;
      }
    }
  }

  const erroNicho = validarOrcamentoNicho(draft.nichoId, draft.orcamento);
  if (erroNicho) {
    errors.orcamento = erroNicho;
  }

  return errors;
}

/**
 * Validação leve para rascunho: exige ao menos título;
 * orçamento vs nicho só se ambos estiverem preenchidos.
 */
export function validarDemandaRascunho(
  draft: DemandaPublicacaoDraft,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!draft.titulo.trim()) {
    errors.titulo = "Informe um título para salvar o rascunho";
  }
  const erroNicho = validarOrcamentoNicho(draft.nichoId, draft.orcamento);
  if (erroNicho) {
    errors.orcamento = erroNicho;
  }
  return errors;
}

/** Erro de orçamento vs nicho para feedback em tempo real (antes do submit). */
export function erroOrcamentoAoVivo(
  draft: Pick<DemandaPublicacaoDraft, "nichoId" | "orcamento">,
): string | null {
  return validarOrcamentoNicho(draft.nichoId, draft.orcamento);
}

export function podePublicarDemanda(draft: DemandaPublicacaoDraft): boolean {
  return Object.keys(validarDemandaPublicacao(draft)).length === 0;
}

function carregarTodasDemandas(): MinhaDemandaItem[] {
  if (typeof window === "undefined") {
    return mesclarDemandasAgenciaClientes(MINHAS_DEMANDAS_MOCK);
  }

  const salvo = localStorage.getItem(STORAGE_KEY);
  if (!salvo) {
    const iniciais = mesclarDemandasAgenciaClientes(MINHAS_DEMANDAS_MOCK);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(iniciais));
    return iniciais;
  }

  try {
    const parsed = JSON.parse(salvo) as MinhaDemandaItem[];
    const mescladas = mesclarDemandasAgenciaClientes(parsed);
    if (mescladas.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mescladas));
    }
    return mescladas;
  } catch {
    return mesclarDemandasAgenciaClientes(MINHAS_DEMANDAS_MOCK);
  }
}

function salvarTodasDemandas(itens: MinhaDemandaItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
}

export function listarDemandasEmpresa(empresaId: string): MinhaDemandaItem[] {
  return carregarTodasDemandas()
    .filter((item) => item.demanda.empresaId === empresaId)
    .sort(
      (a, b) =>
        new Date(b.publicadoEm).getTime() - new Date(a.publicadoEm).getTime(),
    );
}

export function obterDemandaEmpresa(
  demandaId: string,
  empresaId: string,
): MinhaDemandaItem | null {
  return (
    carregarTodasDemandas().find(
      (item) =>
        item.demanda.id === demandaId && item.demanda.empresaId === empresaId,
    ) ?? null
  );
}

function montarItemDemanda(
  draft: DemandaPublicacaoDraft,
  empresaId: string,
  status: Demanda["status"],
  id = crypto.randomUUID(),
): MinhaDemandaItem {
  return {
    demanda: {
      id,
      empresaId,
      titulo: draft.titulo.trim(),
      briefing: draft.briefing.trim(),
      orcamento: draft.orcamento === "" ? 0 : Number(draft.orcamento),
      nichoId: draft.nichoId || undefined,
      formatoEntrega: (draft.formatoEntrega || "reels") as Demanda["formatoEntrega"],
      prazo: draft.prazo,
      status,
    },
    publicoAlvo: montarPublicoAlvo(draft),
    matchesGerados: 0,
    publicadoEm: new Date().toISOString(),
  };
}

export function salvarRascunhoDemanda(
  draft: DemandaPublicacaoDraft,
  empresaId: string,
): MinhaDemandaItem {
  const item = montarItemDemanda(draft, empresaId, "rascunho");
  const todas = carregarTodasDemandas();
  salvarTodasDemandas([item, ...todas]);
  return item;
}

export function publicarDemanda(
  draft: DemandaPublicacaoDraft,
  empresaId: string,
): MinhaDemandaItem {
  const erros = validarDemandaPublicacao(draft);
  if (Object.keys(erros).length > 0) {
    throw new Error("Demanda inválida para publicação");
  }

  const item = montarItemDemanda(draft, empresaId, "aberta");
  const todas = carregarTodasDemandas();
  salvarTodasDemandas([item, ...todas]);
  return item;
}

export function cancelarDemanda(
  demandaId: string,
  empresaId: string,
): boolean {
  const todas = carregarTodasDemandas();
  const index = todas.findIndex(
    (item) =>
      item.demanda.id === demandaId &&
      item.demanda.empresaId === empresaId &&
      item.demanda.status === "aberta",
  );

  if (index === -1) return false;

  const atual = todas[index]!;
  const atualizadas = [...todas];
  atualizadas[index] = {
    ...atual,
    demanda: { ...atual.demanda, status: "cancelada" },
  };
  salvarTodasDemandas(atualizadas);
  return true;
}

const STATUS_EDITAVEL_ORCAMENTO = new Set<Demanda["status"]>([
  "aberta",
  "em_negociacao",
  "em_andamento",
  "rascunho",
]);

export function atualizarOrcamentoDemanda(
  demandaId: string,
  empresaId: string,
  novoOrcamento: number,
): { ok: boolean; matchesAfetados: number; erro?: string } {
  const todas = carregarTodasDemandas();
  const index = todas.findIndex(
    (item) =>
      item.demanda.id === demandaId && item.demanda.empresaId === empresaId,
  );

  if (index === -1) {
    return { ok: false, matchesAfetados: 0, erro: "Demanda não encontrada" };
  }

  const atual = todas[index]!;
  if (!STATUS_EDITAVEL_ORCAMENTO.has(atual.demanda.status)) {
    return {
      ok: false,
      matchesAfetados: 0,
      erro: "Esta demanda não permite edição de orçamento",
    };
  }

  const nichoId = atual.demanda.nichoId ?? "";
  if (nichoId) {
    const minimo = orcamentoMinimoNicho(nichoId);
    if (novoOrcamento < minimo) {
      return {
        ok: false,
        matchesAfetados: 0,
        erro: validarOrcamentoNicho(nichoId, novoOrcamento) ?? undefined,
      };
    }
  }

  if (!Number.isFinite(novoOrcamento) || novoOrcamento <= 0) {
    return {
      ok: false,
      matchesAfetados: 0,
      erro: "Orçamento deve ser um valor positivo",
    };
  }

  const matchesAfetados =
    atual.demanda.status === "em_andamento" ||
    atual.demanda.status === "em_negociacao"
      ? atual.matchesGerados
      : 0;

  const atualizadas = [...todas];
  atualizadas[index] = {
    ...atual,
    demanda: { ...atual.demanda, orcamento: novoOrcamento },
    matchesDesatualizados:
      matchesAfetados > 0 ? true : atual.matchesDesatualizados,
  };
  salvarTodasDemandas(atualizadas);

  return { ok: true, matchesAfetados };
}
