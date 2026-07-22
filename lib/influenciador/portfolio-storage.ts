import {
  normalizarTiposAtuacao,
} from "@/lib/influenciador/atuacao-utils";
import type { CreatorCatalogo } from "@/lib/empresa/creator-catalogo-types";
import {
  carregarPerfilInfluenciador,
  garantirPerfilDemoCompleto,
} from "@/lib/influenciador/perfil-storage";
import {
  novoIdLocal,
  precoPacoteMinimo,
  type PortfolioInfluenciador,
  type RedeSocialPortfolio,
  type TrabalhoAnterior,
} from "@/lib/influenciador/portfolio-types";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { CREATORS_CATALOGO_MOCK } from "@/lib/mock-data/creators-catalogo";
import {
  FOTO_CAPA_DEMO,
  FOTO_PERFIL_DEMO,
  PACOTES_DEMO,
  ehUsuarioDemoInfluenciador,
} from "@/lib/mock-data/perfil-influenciador-demo";
import { midiasSeedParaCreator } from "@/lib/mock-data/portfolio-midias";
import {
  statusContaInfluenciador,
} from "@/lib/mock-data/influenciadores-status";
import type { Midia, PacoteServico } from "@/lib/types";
import type { Usuario } from "@/lib/types/usuario";

const STORAGE_PREFIX = "influenciador-portfolio";
const INDEX_KEY = "influenciador-portfolio-index";

function chave(id: string): string {
  return `${STORAGE_PREFIX}:${id}`;
}

function lerIndex(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function gravarIndex(index: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

function pacotePadrao(creator: CreatorCatalogo): PacoteServico {
  return {
    id: novoIdLocal("pkg"),
    nome: "Pacote essencial",
    descricao: `Conteúdo alinhado ao nicho, a partir de ${creator.nome.split(" ")[0]}.`,
    preco: creator.precoPacoteMin,
    itensInclusos: ["1 entrega principal", "Direitos de uso na campanha"],
    ativo: true,
  };
}

function pacotesSeed(creator: CreatorCatalogo): PacoteServico[] {
  if (creator.id === INFLUENCIADOR_MOCK_ID) {
    return PACOTES_DEMO.map((p) => ({ ...p }));
  }
  return [pacotePadrao(creator)];
}

function trabalhosSeed(
  creator: CreatorCatalogo,
  midias: Midia[],
): TrabalhoAnterior[] {
  if (creator.id === INFLUENCIADOR_MOCK_ID) {
    const midiasTrabalho = midias.filter(
      (m) => m.categoria === "trabalho_anterior",
    );
    return [
      {
        id: "trab-ana-1",
        titulo: "Lançamento sérum vitamina C",
        marca: "Glow Cosmetics",
        tipoConteudo: "Reels + Stories",
        midiaId: midiasTrabalho[0]?.id,
      },
      {
        id: "trab-ana-2",
        titulo: "Rotina noturna pele sensível",
        marca: "DermaLab Brasil",
        tipoConteudo: "Reels",
        midiaId: midiasTrabalho[1]?.id,
      },
      {
        id: "trab-ana-3",
        titulo: "Protetor solar verão — textura em 15s",
        marca: "SunCare Co.",
        tipoConteudo: "Reels",
        midiaId: midiasTrabalho[2]?.id,
      },
    ];
  }

  const midiasTrabalho = midias.filter((m) => m.categoria === "trabalho_anterior");
  if (midiasTrabalho.length === 0) {
    return [
      {
        id: novoIdLocal("trab"),
        titulo: `Campanha ${creator.nichoId.replace("cat-", "")}`,
        marca: "Marca parceira",
        tipoConteudo: "Reels",
      },
    ];
  }
  return midiasTrabalho.slice(0, 2).map((midia, i) => ({
    id: `trab-${creator.id}-${i + 1}`,
    titulo:
      i === 0
        ? `Campanha ${creator.nichoId.replace("cat-", "")}`
        : "Conteúdo parceiro",
    marca: i === 0 ? "Marca parceira" : "Cliente anterior",
    tipoConteudo: midia.tipo === "video" ? "Reels" : "Foto / ensaio",
    midiaId: midia.id,
  }));
}

function redesSeed(creatorId: string): RedeSocialPortfolio[] {
  if (creatorId === INFLUENCIADOR_MOCK_ID) {
    return [
      { id: "rede-ana-ig", plataforma: "instagram" },
      { id: "rede-ana-tt", plataforma: "tiktok" },
      { id: "rede-ana-yt", plataforma: "youtube" },
    ];
  }
  return [
    {
      id: novoIdLocal("rede"),
      plataforma: "instagram",
    },
  ];
}

/** Normaliza portfólios antigos (sem midias / com link em trabalhos). */
export function normalizarPortfolio(
  raw: PortfolioInfluenciador & {
    trabalhos?: Array<TrabalhoAnterior & { link?: string }>;
  },
): PortfolioInfluenciador {
  const midias = Array.isArray(raw.midias) ? raw.midias : [];
  const trabalhos = (raw.trabalhos ?? []).map((t) => {
    const comLink = t as TrabalhoAnterior & { link?: string };
    return {
      id: comLink.id,
      titulo: comLink.titulo,
      marca: comLink.marca,
      tipoConteudo: comLink.tipoConteudo,
      midiaId: comLink.midiaId,
    };
  });
  return {
    ...raw,
    midias,
    trabalhos,
    redes: (raw.redes ?? []).map((r) => ({
      id: r.id,
      plataforma: r.plataforma,
    })),
    tiposAtuacao: normalizarTiposAtuacao(raw.tiposAtuacao),
  };
}

export function portfolioFromCatalogo(
  creator: CreatorCatalogo,
): PortfolioInfluenciador {
  const midias = midiasSeedParaCreator(creator.id);
  const ehDemo = creator.id === INFLUENCIADOR_MOCK_ID;
  return {
    id: creator.id,
    usuarioId: creator.usuarioId,
    nome: creator.nome,
    handle: creator.handle,
    bio: creator.bio,
    fotoPerfilUrl: creator.fotoUrl ?? (ehDemo ? FOTO_PERFIL_DEMO : null),
    fotoCapaUrl: ehDemo ? FOTO_CAPA_DEMO : null,
    nichoIds: ehDemo ? ["cat-beleza", "cat-saude"] : [creator.nichoId],
    redes: redesSeed(creator.id),
    cidade: creator.cidade,
    estado: creator.estado,
    seguidores: creator.seguidores,
    engajamentoMedio: creator.engajamentoMedio,
    pacotes: pacotesSeed(creator),
    trabalhos: trabalhosSeed(creator, midias),
    midias,
    notaMediaAvaliacao: creator.notaMediaAvaliacao,
    totalAvaliacoes: creator.totalAvaliacoes,
    plano: "pro",
    tiposAtuacao: normalizarTiposAtuacao(creator.tiposAtuacao),
    disponibilidade: creator.disponibilidade,
    atualizadoEm: new Date().toISOString(),
  };
}

function portfolioFromCadastro(
  usuarioId: string,
  portfolioId: string,
): PortfolioInfluenciador | null {
  const perfil = carregarPerfilInfluenciador(usuarioId);
  if (!perfil) return null;

  const dominio = perfil.categorias.filter((c) => c.tipo === "dominio");
  const nichoIds =
    dominio.length > 0
      ? dominio.map((c) => c.id)
      : perfil.categorias.map((c) => c.id);

  return {
    id: portfolioId,
    usuarioId,
    nome: perfil.influenciador.nome,
    handle: `@${perfil.influenciador.nome
      .toLowerCase()
      .replace(/\s+/g, "")
      .slice(0, 18)}`,
    bio: perfil.influenciador.bio,
    fotoPerfilUrl: null,
    fotoCapaUrl: null,
    nichoIds: nichoIds.length > 0 ? nichoIds : ["cat-beleza"],
    redes: [],
    cidade: "",
    estado: "",
    seguidores: perfil.metricaPerfil.seguidores,
    engajamentoMedio: perfil.metricaPerfil.engajamentoMedio,
    pacotes: perfil.pacotes,
    trabalhos: [],
    midias: perfil.influenciador.midias ?? [],
    notaMediaAvaliacao: perfil.influenciador.notaMediaAvaliacao,
    totalAvaliacoes: perfil.influenciador.totalAvaliacoes,
    plano: perfil.influenciador.plano,
    tiposAtuacao: normalizarTiposAtuacao(perfil.influenciador.tiposAtuacao),
    disponibilidade: perfil.influenciador.disponibilidade,
    atualizadoEm: new Date().toISOString(),
  };
}

function portfolioVazio(usuarioId: string, portfolioId: string): PortfolioInfluenciador {
  return {
    id: portfolioId,
    usuarioId,
    nome: "",
    handle: "",
    bio: "",
    fotoPerfilUrl: null,
    fotoCapaUrl: null,
    nichoIds: [],
    redes: [],
    cidade: "",
    estado: "",
    seguidores: 0,
    engajamentoMedio: 0,
    pacotes: [],
    trabalhos: [],
    midias: [],
    notaMediaAvaliacao: null,
    totalAvaliacoes: 0,
    plano: "basico",
    tiposAtuacao: ["influenciador"],
    atualizadoEm: new Date().toISOString(),
  };
}

export function salvarPortfolio(portfolio: PortfolioInfluenciador): void {
  if (typeof window === "undefined") return;
  const next = normalizarPortfolio({
    ...portfolio,
    atualizadoEm: new Date().toISOString(),
  });
  localStorage.setItem(chave(next.id), JSON.stringify(next));
  const index = lerIndex();
  index[next.usuarioId] = next.id;
  gravarIndex(index);
}

export function carregarPortfolioPorId(
  id: string,
): PortfolioInfluenciador | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(chave(id));
    if (raw) {
      const salvo = normalizarPortfolio(
        JSON.parse(raw) as PortfolioInfluenciador,
      );
      return enriquecerPortfolioDemoSeIncompleto(
        mesclarSeedMidiasSeVazio(mesclarDisponibilidadeDoCatalogo(salvo)),
      );
    }
  } catch {
    // fall through to seed
  }

  const catalogo = CREATORS_CATALOGO_MOCK.find((c) => c.id === id);
  if (catalogo) {
    const seeded = portfolioFromCatalogo(catalogo);
    salvarPortfolio(seeded);
    return seeded;
  }

  return null;
}

/**
 * Se o portfólio local ainda não tem `datasIndisponiveis`, herda do catálogo mock
 * para a agenda de demo não aparecer sempre 100% livre.
 */
function mesclarDisponibilidadeDoCatalogo(
  portfolio: PortfolioInfluenciador,
): PortfolioInfluenciador {
  const jaTemDatas =
    (portfolio.disponibilidade?.datasIndisponiveis?.length ?? 0) > 0;
  if (jaTemDatas) return portfolio;

  const catalogo = CREATORS_CATALOGO_MOCK.find((c) => c.id === portfolio.id);
  const doCatalogo = catalogo?.disponibilidade;
  if (!doCatalogo?.datasIndisponiveis?.length) return portfolio;

  return {
    ...portfolio,
    disponibilidade: {
      diasSemana:
        portfolio.disponibilidade?.diasSemana?.length
          ? portfolio.disponibilidade.diasSemana
          : (doCatalogo.diasSemana ?? []),
      observacao:
        portfolio.disponibilidade?.observacao ?? doCatalogo.observacao,
      datasIndisponiveis: [...doCatalogo.datasIndisponiveis],
    },
  };
}

/** Injeta mídias de exemplo em portfólios antigos sem galeria. */
function mesclarSeedMidiasSeVazio(
  portfolio: PortfolioInfluenciador,
): PortfolioInfluenciador {
  if (portfolio.midias.length > 0) return portfolio;
  const seedMidias = midiasSeedParaCreator(portfolio.id);
  if (seedMidias.length === 0) return portfolio;

  const catalogo = CREATORS_CATALOGO_MOCK.find((c) => c.id === portfolio.id);
  const midiasTrabalho = seedMidias.filter(
    (m) => m.categoria === "trabalho_anterior",
  );
  const trabalhos =
    portfolio.trabalhos.length > 0
      ? portfolio.trabalhos.map((t, i) => ({
          ...t,
          midiaId: t.midiaId ?? midiasTrabalho[i]?.id,
        }))
      : catalogo
        ? trabalhosSeed(catalogo, seedMidias)
        : portfolio.trabalhos;

  const next = { ...portfolio, midias: seedMidias, trabalhos };
  salvarPortfolio(next);
  return next;
}

/**
 * Completa portfólio da conta demo (Ana) quando o localStorage ficou vazio/parcial.
 */
function enriquecerPortfolioDemoSeIncompleto(
  portfolio: PortfolioInfluenciador,
): PortfolioInfluenciador {
  const ehDemo =
    portfolio.id === INFLUENCIADOR_MOCK_ID ||
    ehUsuarioDemoInfluenciador(portfolio.usuarioId);
  if (!ehDemo) return portfolio;

  const catalogo = CREATORS_CATALOGO_MOCK.find(
    (c) => c.id === INFLUENCIADOR_MOCK_ID,
  );
  if (!catalogo) return portfolio;

  const seed = portfolioFromCatalogo(catalogo);
  const incompleto =
    !portfolio.fotoPerfilUrl ||
    !portfolio.fotoCapaUrl ||
    !portfolio.bio.trim() ||
    portfolio.pacotes.length < 2 ||
    portfolio.trabalhos.length < 2 ||
    portfolio.midias.length === 0 ||
    portfolio.redes.length < 2;

  if (!incompleto) return portfolio;

  const next: PortfolioInfluenciador = {
    ...portfolio,
    nome: portfolio.nome.trim() || seed.nome,
    handle: portfolio.handle.trim() || seed.handle,
    bio: portfolio.bio.trim() || seed.bio,
    fotoPerfilUrl: portfolio.fotoPerfilUrl || seed.fotoPerfilUrl,
    fotoCapaUrl: portfolio.fotoCapaUrl || seed.fotoCapaUrl,
    nichoIds: portfolio.nichoIds.length > 0 ? portfolio.nichoIds : seed.nichoIds,
    redes: portfolio.redes.length >= 2 ? portfolio.redes : seed.redes,
    cidade: portfolio.cidade.trim() || seed.cidade,
    estado: portfolio.estado.trim() || seed.estado,
    seguidores: portfolio.seguidores > 0 ? portfolio.seguidores : seed.seguidores,
    engajamentoMedio:
      portfolio.engajamentoMedio > 0
        ? portfolio.engajamentoMedio
        : seed.engajamentoMedio,
    pacotes: portfolio.pacotes.length >= 2 ? portfolio.pacotes : seed.pacotes,
    trabalhos:
      portfolio.trabalhos.length >= 2 ? portfolio.trabalhos : seed.trabalhos,
    midias: portfolio.midias.length > 0 ? portfolio.midias : seed.midias,
    notaMediaAvaliacao:
      portfolio.notaMediaAvaliacao ?? seed.notaMediaAvaliacao,
    totalAvaliacoes:
      portfolio.totalAvaliacoes > 0
        ? portfolio.totalAvaliacoes
        : seed.totalAvaliacoes,
    plano: portfolio.plano === "basico" ? "pro" : portfolio.plano,
    tiposAtuacao:
      portfolio.tiposAtuacao?.length > 0
        ? portfolio.tiposAtuacao
        : seed.tiposAtuacao,
    disponibilidade: portfolio.disponibilidade ?? seed.disponibilidade,
  };
  salvarPortfolio(next);
  return next;
}

/**
 * Resolve o portfólio do usuário logado (cria seed se necessário).
 */
export function obterOuCriarPortfolioDoUsuario(
  usuarioId: string,
): PortfolioInfluenciador {
  if (ehUsuarioDemoInfluenciador(usuarioId)) {
    garantirPerfilDemoCompleto(usuarioId);
  }

  const index = lerIndex();
  const indexedId = index[usuarioId];
  if (indexedId) {
    const existente = carregarPortfolioPorId(indexedId);
    if (existente) return existente;
  }

  const catalogo = CREATORS_CATALOGO_MOCK.find((c) => c.usuarioId === usuarioId);
  if (catalogo) {
    const seeded = portfolioFromCatalogo(catalogo);
    salvarPortfolio(seeded);
    return seeded;
  }

  const portfolioId = `inf-${usuarioId}`;
  const doCadastro = portfolioFromCadastro(usuarioId, portfolioId);
  const base = doCadastro ?? portfolioVazio(usuarioId, portfolioId);
  salvarPortfolio(base);
  return base;
}

export function portfolioParaCreatorCatalogo(
  portfolio: PortfolioInfluenciador,
): CreatorCatalogo {
  const status = statusContaInfluenciador(portfolio.id) ?? "ativo";
  const precoMin = precoPacoteMinimo(portfolio.pacotes);
  const perfil = carregarPerfilInfluenciador(portfolio.usuarioId);
  return {
    id: portfolio.id,
    usuarioId: portfolio.usuarioId,
    nome: portfolio.nome,
    handle: portfolio.handle,
    bio: portfolio.bio,
    fotoUrl: portfolio.fotoPerfilUrl,
    nichoId: portfolio.nichoIds[0] ?? "cat-beleza",
    cidade: portfolio.cidade,
    estado: portfolio.estado,
    seguidores: portfolio.seguidores,
    engajamentoMedio: portfolio.engajamentoMedio,
    precoPacoteMin: precoMin > 0 ? precoMin : 0,
    notaMediaAvaliacao: portfolio.notaMediaAvaliacao,
    totalAvaliacoes: portfolio.totalAvaliacoes,
    status,
    tiposAtuacao: normalizarTiposAtuacao(portfolio.tiposAtuacao),
    disponibilidade: portfolio.disponibilidade,
    nivelAtual: perfil?.influenciador.nivelAtual,
  };
}

export function statusPublicoPortfolio(
  id: string,
): Usuario["status"] | "inexistente" {
  const status = statusContaInfluenciador(id);
  if (status) return status;
  const portfolio = carregarPortfolioPorId(id);
  if (!portfolio) return "inexistente";
  return "ativo";
}
