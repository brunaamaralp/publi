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

import {
  ehSomenteModelo,
  normalizarTiposAtuacao,
} from "@/lib/influenciador/atuacao-utils";
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

export function montarPayload(
  draft: CadastroDraft,
  usuario: Pick<Usuario, "id" | "email" | "tipo" | "status" | "criadoEm">,
  existente?: CadastroPayload | null,
): CadastroPayload {
  const agora = new Date().toISOString();
  const temPrint = draft.printMetricasUrl.trim().length > 0;
  const seguidores =
    draft.seguidores === "" ? (existente?.metricaPerfil.seguidores ?? 0) : draft.seguidores;
  const engajamento =
    draft.engajamentoMedio === ""
      ? (existente?.metricaPerfil.engajamentoMedio ?? 0)
      : draft.engajamentoMedio;

  return {
    usuario: {
      id: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
      status: usuario.status,
      criadoEm: usuario.criadoEm,
    },
    influenciador: {
      id: existente?.influenciador.id ?? crypto.randomUUID(),
      usuarioId: usuario.id,
      nome: draft.nome,
      bio: draft.bio,
      /** Default até a pessoa escolher na página de plano. */
      plano: draft.plano ?? existente?.influenciador.plano ?? "basico",
      nivelAtual: existente?.influenciador.nivelAtual ?? 1,
      pontosXp: existente?.influenciador.pontosXp ?? 0,
      notaMediaAvaliacao: existente?.influenciador.notaMediaAvaliacao ?? null,
      totalAvaliacoes: existente?.influenciador.totalAvaliacoes ?? 0,
      tiposAtuacao: normalizarTiposAtuacao(draft.tiposAtuacao),
      midias: existente?.influenciador.midias ?? [],
      ...(draft.disponibilidade &&
      normalizarTiposAtuacao(draft.tiposAtuacao).includes("modelo")
        ? { disponibilidade: draft.disponibilidade }
        : {}),
    },
    categorias: [
      ...draft.categoriasDominio,
      ...draft.categoriasInteresse,
    ],
    equipamentos: draft.equipamentos.filter((e) => e.tipo.trim().length > 0),
    metricaPerfil: {
      id: existente?.metricaPerfil.id ?? crypto.randomUUID(),
      dataReferencia: agora,
      seguidores,
      engajamentoMedio: engajamento,
      printUrl: draft.printMetricasUrl || existente?.metricaPerfil.printUrl || "",
      /** Print enviado → pronto para análise; sem print → ainda não verificável. */
      statusValidacao: temPrint
        ? "pendente"
        : (existente?.metricaPerfil.statusValidacao ?? "pendente"),
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
    pacotes: draft.pacotes.filter((p) => p.nome.trim().length > 0),
  };
}

/** Converte o payload persistido de volta para o draft editável. */
export function draftFromPayload(payload: CadastroPayload): CadastroDraft {
  const dominio = payload.categorias.filter((c) => c.tipo === "dominio");
  const interesse = payload.categorias.filter((c) => c.tipo === "interesse");
  const audiencia = payload.audiencia;

  return {
    nome: payload.influenciador.nome,
    bio: payload.influenciador.bio,
    fotoPerfilUrl: null,
    categoriasDominio: dominio,
    categoriasInteresse: interesse,
    tiposAtuacao: normalizarTiposAtuacao(payload.influenciador.tiposAtuacao),
    disponibilidade: payload.influenciador.disponibilidade ?? null,
    equipamentos: payload.equipamentos,
    printMetricasUrl: payload.metricaPerfil.printUrl,
    seguidores: payload.metricaPerfil.seguidores || "",
    engajamentoMedio: payload.metricaPerfil.engajamentoMedio || "",
    audienciaGenero: audiencia
      .filter((a) => a.dimensao === "genero")
      .map((a) => ({
        id: crypto.randomUUID(),
        valor: a.valor,
        percentual: a.percentual,
      })),
    audienciaFaixaEtaria: audiencia
      .filter((a) => a.dimensao === "faixa_etaria")
      .map((a) => ({
        id: crypto.randomUUID(),
        valor: a.valor,
        percentual: a.percentual,
      })),
    audienciaLocalidade: audiencia
      .filter((a) => a.dimensao === "localidade")
      .map((a) => ({
        id: crypto.randomUUID(),
        valor: a.valor,
        percentual: a.percentual,
      })),
    tabelaPrecos:
      payload.tabelaPrecos.length === 5
        ? payload.tabelaPrecos
        : criarTabelaPrecosInicial(payload.metricaPerfil.seguidores || 0),
    pacotes: payload.pacotes,
    plano: payload.influenciador.plano,
  };
}

export function criarEstadoInicial(): CadastroDraft {
  return {
    nome: "",
    bio: "",
    fotoPerfilUrl: null,
    categoriasDominio: [],
    categoriasInteresse: [],
    tiposAtuacao: ["influenciador"],
    disponibilidade: null,
    equipamentos: [],
    printMetricasUrl: "",
    seguidores: "",
    engajamentoMedio: "",
    audienciaGenero: [],
    audienciaFaixaEtaria: [],
    audienciaLocalidade: [],
    tabelaPrecos: criarTabelaPrecosInicial(0),
    pacotes: [],
    plano: null,
  };
}

/** Percentual de completude do perfil (0–100) — cadastro essencial + seções pós-login. */
export function calcularCompletudePerfil(draft: CadastroDraft): number {
  let pontos = 0;

  if (draft.nome.trim().length >= 2) pontos += 20;
  if (draft.bio.trim().length >= 20) pontos += 5;
  if (draft.fotoPerfilUrl) pontos += 5;
  if (draft.categoriasDominio.length > 0) pontos += 15;
  if (draft.seguidores !== "" && Number(draft.seguidores) > 0) pontos += 15;
  if (draft.engajamentoMedio !== "") pontos += 5;
  if (draft.printMetricasUrl.trim()) pontos += 15;
  if (draft.equipamentos.some((e) => e.tipo.trim())) pontos += 5;
  if (
    draft.audienciaGenero.length > 0 ||
    draft.audienciaFaixaEtaria.length > 0 ||
    draft.audienciaLocalidade.length > 0
  ) {
    pontos += 5;
  }
  if (draft.tabelaPrecos.every((t) => t.precoPraticado >= t.precoBaseSugerido)) {
    pontos += 5;
  }
  if (draft.pacotes.some((p) => p.nome.trim())) pontos += 5;
  if (draft.plano) pontos += 5;

  return Math.min(100, pontos);
}

/** Print + seguidores: o mínimo para a moderação poder analisar o perfil.
 *  Quem atua só como modelo dispensa print — usa trabalhos/portfólio. */
export function perfilProntoParaAnalise(
  payload: Pick<CadastroPayload, "metricaPerfil" | "influenciador">,
  opts?: { trabalhosAnteriores?: number },
): boolean {
  if (ehSomenteModelo(payload.influenciador.tiposAtuacao)) {
    return (opts?.trabalhosAnteriores ?? 0) > 0;
  }
  const m = payload.metricaPerfil;
  return Boolean(m.printUrl?.trim()) && m.seguidores > 0;
}

