import type { Midia, PacoteServico } from "@/lib/types";
import type {
  DisponibilidadeInfluenciador,
  Influenciador,
  TipoAtuacao,
} from "@/lib/types/influenciador";

export type RedeSocialPortfolio = {
  id: string;
  plataforma: "instagram" | "tiktok" | "youtube" | "outro";
  /** @deprecated Não exibir na vitrine pública — contato só no chat filtrado. */
  handle?: string;
};

export type TrabalhoAnterior = {
  id: string;
  titulo: string;
  marca: string;
  tipoConteudo: string;
  /**
   * Id da mídia em `PortfolioInfluenciador.midias` (categoria trabalho_anterior).
   * Substitui o antigo campo de link externo.
   */
  midiaId?: string;
};

/**
 * Vitrine do influenciador — estende o núcleo de `Influenciador`
 * com campos de apresentação (capa, nichos, redes, trabalhos).
 */
export type PortfolioInfluenciador = {
  id: string;
  usuarioId: string;
  nome: string;
  handle: string;
  bio: string;
  fotoPerfilUrl: string | null;
  fotoCapaUrl: string | null;
  nichoIds: string[];
  redes: RedeSocialPortfolio[];
  cidade: string;
  estado: string;
  seguidores: number;
  engajamentoMedio: number;
  pacotes: PacoteServico[];
  trabalhos: TrabalhoAnterior[];
  /** Galeria: vídeo de apresentação + mídias de trabalhos anteriores. */
  midias: Midia[];
  notaMediaAvaliacao: number | null;
  totalAvaliacoes: number;
  plano: Influenciador["plano"];
  tiposAtuacao: TipoAtuacao[];
  disponibilidade?: DisponibilidadeInfluenciador;
  atualizadoEm: string;
};

export const LABELS_PLATAFORMA_REDE: Record<
  RedeSocialPortfolio["plataforma"],
  string
> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  outro: "Outra",
};

export function novoIdLocal(prefixo: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefixo}-${crypto.randomUUID()}`;
  }
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function precoPacoteMinimo(pacotes: PacoteServico[]): number {
  const ativos = pacotes.filter((p) => p.ativo && p.preco > 0);
  if (ativos.length === 0) return 0;
  return Math.min(...ativos.map((p) => p.preco));
}

export function videoApresentacao(
  midias: Midia[],
): Midia | undefined {
  return midias.find((m) => m.categoria === "apresentacao" && m.tipo === "video");
}

export function midiasTrabalhoAnterior(midias: Midia[]): Midia[] {
  return midias.filter((m) => m.categoria === "trabalho_anterior");
}
