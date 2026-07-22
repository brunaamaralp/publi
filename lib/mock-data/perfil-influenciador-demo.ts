import { criarTabelaPrecosInicial } from "@/lib/influenciador/cadastro-utils";
import type { CadastroPayload } from "@/lib/influenciador/cadastro-utils";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import { midiasSeedParaCreator } from "@/lib/mock-data/portfolio-midias";
import { INFLUENCIADOR_NEGOCIACAO_USUARIO_ID } from "@/lib/negociacao/negociacao-constantes";
import type { PacoteServico } from "@/lib/types";

/** Avatar e capa de demo (Unsplash) — perfil completo da Ana. */
export const FOTO_PERFIL_DEMO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop";
export const FOTO_CAPA_DEMO =
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&h=600&fit=crop";
/** Print de métricas placeholder (dashboard analytics). */
export const PRINT_METRICAS_DEMO =
  "https://images.unsplash.com/photo-1551281049-b1e96d6a0a2e?w=900&h=1200&fit=crop";

export const PACOTES_DEMO: PacoteServico[] = [
  {
    id: "pkg-ana-essencial",
    nome: "Essencial Skincare",
    descricao:
      "1 Reels + 3 Stories apresentando o produto com rotina autêntica e CTA para o link da marca.",
    preco: 1800,
    itensInclusos: [
      "1 Reels até 30s",
      "3 Stories com enquete",
      "Direitos de uso na campanha (30 dias)",
    ],
    ativo: true,
  },
  {
    id: "pkg-ana-completo",
    nome: "Campanha Completa",
    descricao:
      "Pacote para lançamento: feed, Reels e Stories com roteiro alinhado ao briefing e revisão incluída.",
    preco: 4500,
    itensInclusos: [
      "1 Post feed",
      "2 Reels",
      "5 Stories em sequência",
      "1 rodada de ajustes",
      "Uso orgânico + paid (60 dias)",
    ],
    ativo: true,
  },
  {
    id: "pkg-ana-stories",
    nome: "Stories Diários",
    descricao:
      "Cobertura em Stories por 3 dias consecutivos, com bastidores e menção ao cupom da marca.",
    preco: 2200,
    itensInclusos: [
      "9–12 Stories",
      "Enquetes e caixinhas",
      "Menção a cupom/código",
    ],
    ativo: true,
  },
];

/** Payload de cadastro completo para a conta demo `influenciador@publi.app`. */
export function criarPerfilDemoCompleto(): CadastroPayload {
  const seguidores = 128_000;
  const midias = midiasSeedParaCreator(INFLUENCIADOR_MOCK_ID);

  return {
    usuario: {
      id: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
      email: "influenciador@publi.app",
      tipo: "influenciador",
      status: "ativo",
      criadoEm: "2025-11-12T10:00:00.000Z",
    },
    influenciador: {
      id: INFLUENCIADOR_MOCK_ID,
      usuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
      nome: "Ana Beatriz Silva",
      bio: "Skincare realista, rotinas e lançamentos de beleza com foco em pele sensível. Já colaborei com marcas nacionais em campanhas de sérum, protetor solar e rotina noturna.",
      plano: "pro",
      nivelAtual: 4,
      pontosXp: 1280,
      notaMediaAvaliacao: 4.9,
      totalAvaliacoes: 23,
      tiposAtuacao: ["influenciador", "modelo"],
      disponibilidade: {
        diasSemana: ["seg", "ter", "qua", "qui"],
        observacao: "Ensaios em SP capital",
      },
      midias,
    },
    categorias: [
      { id: "cat-beleza", nome: "Beleza", tipo: "dominio" },
      { id: "cat-saude", nome: "Saúde e bem-estar", tipo: "dominio" },
      { id: "cat-moda", nome: "Moda", tipo: "interesse" },
    ],
    equipamentos: [
      {
        id: "eq-ana-cam",
        tipo: "câmera",
        descricao: "iPhone 15 Pro + ring light",
      },
      {
        id: "eq-ana-luz",
        tipo: "iluminação",
        descricao: "Softbox e luz natural controlada",
      },
    ],
    metricaPerfil: {
      id: "met-ana-001",
      dataReferencia: "2026-07-01T00:00:00.000Z",
      seguidores,
      engajamentoMedio: 4.8,
      alcanceMedio: 42_000,
      printUrl: PRINT_METRICAS_DEMO,
      statusValidacao: "validado",
    },
    audiencia: [
      { dimensao: "genero", valor: "Feminino", percentual: 78 },
      { dimensao: "genero", valor: "Masculino", percentual: 22 },
      { dimensao: "faixa_etaria", valor: "18-24", percentual: 28 },
      { dimensao: "faixa_etaria", valor: "25-34", percentual: 46 },
      { dimensao: "faixa_etaria", valor: "35-44", percentual: 26 },
      { dimensao: "localidade", valor: "São Paulo", percentual: 41 },
      { dimensao: "localidade", valor: "Rio de Janeiro", percentual: 18 },
      { dimensao: "localidade", valor: "Outros", percentual: 41 },
    ],
    tabelaPrecos: criarTabelaPrecosInicial(seguidores).map((item) => {
      const praticado: Record<string, number> = {
        reels: 1900,
        stories: 950,
        post_feed: 1600,
        unboxing: 1400,
        live: 3200,
      };
      return {
        ...item,
        precoPraticado: praticado[item.tipoServico] ?? item.precoBaseSugerido,
      };
    }),
    pacotes: PACOTES_DEMO.map((p) => ({ ...p })),
  };
}

export function ehUsuarioDemoInfluenciador(usuarioId: string): boolean {
  return usuarioId === INFLUENCIADOR_NEGOCIACAO_USUARIO_ID;
}
