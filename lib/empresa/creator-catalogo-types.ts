import type { Usuario } from "@/lib/types/usuario";

/** Perfil listável na busca ativa de creators (empresa). */
export type CreatorCatalogo = {
  id: string;
  usuarioId: string;
  nome: string;
  handle: string;
  bio: string;
  fotoUrl: string | null;
  nichoId: string;
  cidade: string;
  estado: string;
  seguidores: number;
  engajamentoMedio: number;
  /** Menor preço de pacote ativo (R$). */
  precoPacoteMin: number;
  notaMediaAvaliacao: number | null;
  totalAvaliacoes: number;
  status: Usuario["status"];
};

/** Cold-start: nota só após este mínimo de avaliações. */
export const MIN_AVALIACOES_NOTA_PUBLICA = 3;

export function creatorExibeNota(creator: {
  totalAvaliacoes: number;
  notaMediaAvaliacao: number | null;
}): boolean {
  return (
    creator.totalAvaliacoes >= MIN_AVALIACOES_NOTA_PUBLICA &&
    creator.notaMediaAvaliacao !== null
  );
}
