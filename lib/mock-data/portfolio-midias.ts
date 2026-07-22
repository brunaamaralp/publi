import type { Midia } from "@/lib/types";

import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";

/** Placeholders de stock (mesmo padrão Unsplash do hero) + sample video público. */
const FOTO_BELEZA =
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=1000&fit=crop";
const FOTO_FITNESS =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1000&fit=crop";
const FOTO_MODA =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop";
const FOTO_TECH =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=1000&fit=crop";
const FOTO_SKINCARE =
  "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=1000&fit=crop";
const VIDEO_SAMPLE =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
const VIDEO_SAMPLE_2 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

/**
 * Mídias de exemplo para 4 creators do catálogo (inclui 1 com vídeo de apresentação).
 * Usado no seed do portfólio — sem URLs de rede social.
 */
export const MIDIAS_PORTFOLIO_MOCK: Record<string, Midia[]> = {
  [INFLUENCIADOR_MOCK_ID]: [
    {
      id: "mid-ana-apres",
      tipo: "video",
      url: VIDEO_SAMPLE,
      legenda: "Oi! Sou a Ana — conteúdo de skincare realista para pele sensível.",
      categoria: "apresentacao",
    },
    {
      id: "mid-ana-trab-1",
      tipo: "foto",
      url: FOTO_BELEZA,
      legenda: "Campanha sérum vitamina C — look natural",
      categoria: "trabalho_anterior",
    },
    {
      id: "mid-ana-trab-2",
      tipo: "foto",
      url: FOTO_SKINCARE,
      legenda: "Rotina noturna em parceria com marca nacional",
      categoria: "trabalho_anterior",
    },
    {
      id: "mid-ana-trab-3",
      tipo: "video",
      url: VIDEO_SAMPLE_2,
      legenda: "Reels: textura e aplicação em 15s",
      categoria: "trabalho_anterior",
    },
  ],
  "inf-cat-002": [
    {
      id: "mid-bruno-1",
      tipo: "foto",
      url: FOTO_FITNESS,
      legenda: "Treino HIIT em casa — marca de suplementos",
      categoria: "trabalho_anterior",
    },
    {
      id: "mid-bruno-2",
      tipo: "video",
      url: VIDEO_SAMPLE_2,
      legenda: "Stories: desafio 7 dias",
      categoria: "trabalho_anterior",
    },
  ],
  "inf-cat-003": [
    {
      id: "mid-carla-1",
      tipo: "foto",
      url: FOTO_MODA,
      legenda: "Lookbook thrift — coleção streetwear",
      categoria: "trabalho_anterior",
    },
    {
      id: "mid-carla-2",
      tipo: "foto",
      url: FOTO_BELEZA,
      legenda: "Ensaio editorial acessório",
      categoria: "trabalho_anterior",
    },
  ],
  "inf-cat-004": [
    {
      id: "mid-diego-1",
      tipo: "foto",
      url: FOTO_TECH,
      legenda: "Unboxing setup home office",
      categoria: "trabalho_anterior",
    },
    {
      id: "mid-diego-2",
      tipo: "video",
      url: VIDEO_SAMPLE,
      legenda: "Review gadget em 60s",
      categoria: "trabalho_anterior",
    },
  ],
};

export function midiasSeedParaCreator(creatorId: string): Midia[] {
  return MIDIAS_PORTFOLIO_MOCK[creatorId]?.map((m) => ({ ...m })) ?? [];
}
