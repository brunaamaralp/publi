import type { AudienciaLinha } from "@/lib/influenciador/cadastro-types";
import type { Demanda, PublicoAlvoDemanda } from "@/lib/types";
import { demandaFormSchema } from "@/lib/schemas/demanda";
import { MINHAS_DEMANDAS_MOCK } from "@/lib/mock-data/minhas-demandas";
import { mesclarDemandasAgenciaClientes } from "@/lib/agencia/dashboard-utils";

import type {
  DemandaPublicacaoDraft,
  MinhaDemandaItem,
} from "@/lib/empresa/demandas-types";

const STORAGE_KEY = "minhas-demandas";

export const LABELS_STATUS_DEMANDA: Record<Demanda["status"], string> = {
  aberta: "Aberta",
  em_negociacao: "Em negociação",
  fechada: "Fechada",
  cancelada: "Cancelada",
};

export function criarDemandaPublicacaoInicial(): DemandaPublicacaoDraft {
  return {
    titulo: "",
    briefing: "",
    formatoEntrega: "",
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

export function validarDemandaPublicacao(
  draft: DemandaPublicacaoDraft,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.formatoEntrega) {
    errors.formatoEntrega = "Selecione o formato de entrega";
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

  return errors;
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

export function publicarDemanda(
  draft: DemandaPublicacaoDraft,
  empresaId: string,
): MinhaDemandaItem {
  const publicoAlvo = montarPublicoAlvo(draft);
  const item: MinhaDemandaItem = {
    demanda: {
      id: crypto.randomUUID(),
      empresaId,
      titulo: draft.titulo.trim(),
      briefing: draft.briefing.trim(),
      orcamento: Number(draft.orcamento),
      formatoEntrega: draft.formatoEntrega as Demanda["formatoEntrega"],
      prazo: draft.prazo,
      status: "aberta",
    },
    publicoAlvo,
    matchesGerados: 0,
    publicadoEm: new Date().toISOString(),
  };

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
