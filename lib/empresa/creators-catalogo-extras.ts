import type { CreatorCatalogo } from "@/lib/empresa/creator-catalogo-types";
import type { CadastroInfluenciadorPendente } from "@/lib/mock-data/moderacao";
import { normalizarTiposAtuacao } from "@/lib/influenciador/atuacao-utils";

const STORAGE_KEY = "creators-catalogo-extras-v1";

const memoria: Record<string, CreatorCatalogo> = {};
let hidratado = false;

function hidratar(): void {
  if (hidratado || typeof window === "undefined") return;
  hidratado = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, CreatorCatalogo>;
    Object.assign(memoria, parsed);
  } catch {
    // ignore
  }
}

function persistir(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memoria));
}

function slugHandle(nome: string): string {
  const base = nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
  return `@${base || "creator"}`;
}

/** Inclui no catálogo de busca um influenciador aprovado na moderação. */
export function registrarCreatorAprovadoDoCadastro(
  cadastro: CadastroInfluenciadorPendente,
): CreatorCatalogo {
  hidratar();
  const dominio = cadastro.categorias.find((c) => c.tipo === "dominio");
  const creator: CreatorCatalogo = {
    id: cadastro.influenciador.id,
    usuarioId: cadastro.usuario.id,
    nome: cadastro.influenciador.nome,
    handle: slugHandle(cadastro.influenciador.nome),
    bio: cadastro.influenciador.bio,
    fotoUrl: null,
    nichoId: dominio?.id ?? "cat-lifestyle",
    cidade: "Brasil",
    estado: "BR",
    seguidores: cadastro.metricaPerfil.seguidores,
    engajamentoMedio: cadastro.metricaPerfil.engajamentoMedio,
    precoPacoteMin: 1500,
    notaMediaAvaliacao: cadastro.influenciador.notaMediaAvaliacao,
    totalAvaliacoes: cadastro.influenciador.totalAvaliacoes,
    status: "ativo",
    tiposAtuacao: normalizarTiposAtuacao(cadastro.influenciador.tiposAtuacao),
    disponibilidade: cadastro.influenciador.disponibilidade,
  };
  memoria[creator.id] = creator;
  persistir();
  return creator;
}

export function listarCreatorsExtras(): CreatorCatalogo[] {
  hidratar();
  return Object.values(memoria);
}

export function atualizarStatusCreatorExtra(
  creatorId: string,
  status: CreatorCatalogo["status"],
): void {
  hidratar();
  const atual = memoria[creatorId];
  if (!atual) return;
  memoria[creatorId] = { ...atual, status };
  persistir();
}
