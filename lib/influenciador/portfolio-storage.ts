import type { CreatorCatalogo } from "@/lib/empresa/creator-catalogo-types";
import { carregarPerfilInfluenciador } from "@/lib/influenciador/perfil-storage";
import {
  novoIdLocal,
  precoPacoteMinimo,
  type PortfolioInfluenciador,
  type RedeSocialPortfolio,
  type TrabalhoAnterior,
} from "@/lib/influenciador/portfolio-types";
import { CREATORS_CATALOGO_MOCK } from "@/lib/mock-data/creators-catalogo";
import {
  statusContaInfluenciador,
} from "@/lib/mock-data/influenciadores-status";
import type { PacoteServico } from "@/lib/types";
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

function trabalhosSeed(creator: CreatorCatalogo): TrabalhoAnterior[] {
  return [
    {
      id: novoIdLocal("trab"),
      titulo: `Campanha ${creator.nichoId.replace("cat-", "")}`,
      marca: "Marca parceira",
      tipoConteudo: "Reels",
    },
  ];
}

function redesSeed(handle: string): RedeSocialPortfolio[] {
  const limpo = handle.replace(/^@/, "");
  return [
    {
      id: novoIdLocal("rede"),
      plataforma: "instagram",
      handle: `@${limpo}`,
    },
  ];
}

export function portfolioFromCatalogo(
  creator: CreatorCatalogo,
): PortfolioInfluenciador {
  return {
    id: creator.id,
    usuarioId: creator.usuarioId,
    nome: creator.nome,
    handle: creator.handle,
    bio: creator.bio,
    fotoPerfilUrl: creator.fotoUrl,
    fotoCapaUrl: null,
    nichoIds: [creator.nichoId],
    redes: redesSeed(creator.handle),
    cidade: creator.cidade,
    estado: creator.estado,
    seguidores: creator.seguidores,
    engajamentoMedio: creator.engajamentoMedio,
    pacotes: [pacotePadrao(creator)],
    trabalhos: trabalhosSeed(creator),
    notaMediaAvaliacao: creator.notaMediaAvaliacao,
    totalAvaliacoes: creator.totalAvaliacoes,
    plano: "pro",
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
    notaMediaAvaliacao: perfil.influenciador.notaMediaAvaliacao,
    totalAvaliacoes: perfil.influenciador.totalAvaliacoes,
    plano: perfil.influenciador.plano,
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
    notaMediaAvaliacao: null,
    totalAvaliacoes: 0,
    plano: "basico",
    atualizadoEm: new Date().toISOString(),
  };
}

export function salvarPortfolio(portfolio: PortfolioInfluenciador): void {
  if (typeof window === "undefined") return;
  const next = { ...portfolio, atualizadoEm: new Date().toISOString() };
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
    if (raw) return JSON.parse(raw) as PortfolioInfluenciador;
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
 * Resolve o portfólio do usuário logado (cria seed se necessário).
 */
export function obterOuCriarPortfolioDoUsuario(
  usuarioId: string,
): PortfolioInfluenciador {
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
