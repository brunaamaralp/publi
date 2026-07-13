import type { ProgressoTreinamento, Treinamento } from "@/lib/types";

import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";

export const CATEGORIAS_TREINAMENTO = [
  "Precificação",
  "Negociação",
  "Storytelling",
  "Edição",
] as const;

export type CategoriaTreinamento = (typeof CATEGORIAS_TREINAMENTO)[number];

export type InfluenciadorGamificacaoMock = {
  id: string;
  nome: string;
  nivelAtual: number;
  pontosXp: number;
};

export const INFLUENCIADOR_GAMIFICACAO_INICIAL: InfluenciadorGamificacaoMock = {
  id: INFLUENCIADOR_MOCK_ID,
  nome: "Ana Beatriz Silva",
  nivelAtual: 1,
  pontosXp: 240,
};

export const TREINAMENTOS_MOCK: Treinamento[] = [
  {
    id: "tr-001",
    titulo: "Fundamentos de precificação para creators",
    categoria: "Precificação",
    nivelRequerido: 1,
  },
  {
    id: "tr-002",
    titulo: "Como montar tabela de preços por formato",
    categoria: "Precificação",
    nivelRequerido: 2,
  },
  {
    id: "tr-003",
    titulo: "Precificação premium para marcas grandes",
    categoria: "Precificação",
    nivelRequerido: 3,
  },
  {
    id: "tr-004",
    titulo: "Primeiros passos na negociação com marcas",
    categoria: "Negociação",
    nivelRequerido: 1,
  },
  {
    id: "tr-005",
    titulo: "Contra-propostas e limites saudáveis",
    categoria: "Negociação",
    nivelRequerido: 2,
  },
  {
    id: "tr-006",
    titulo: "Negociação avançada em campanhas multi-entrega",
    categoria: "Negociação",
    nivelRequerido: 3,
  },
  {
    id: "tr-007",
    titulo: "Storytelling autêntico para marcas",
    categoria: "Storytelling",
    nivelRequerido: 1,
  },
  {
    id: "tr-008",
    titulo: "Roteiro de Reels que converte",
    categoria: "Storytelling",
    nivelRequerido: 2,
  },
  {
    id: "tr-009",
    titulo: "Edição rápida no celular",
    categoria: "Edição",
    nivelRequerido: 1,
  },
  {
    id: "tr-010",
    titulo: "Color grading e identidade visual",
    categoria: "Edição",
    nivelRequerido: 2,
  },
];

export const PROGRESSO_TREINAMENTOS_INICIAL: ProgressoTreinamento[] = [
  {
    id: "prog-001",
    influenciadorId: INFLUENCIADOR_MOCK_ID,
    treinamentoId: "tr-001",
    status: "concluido",
    dataConclusao: "2026-06-20T10:00:00.000Z",
  },
  {
    id: "prog-002",
    influenciadorId: INFLUENCIADOR_MOCK_ID,
    treinamentoId: "tr-004",
    status: "concluido",
    dataConclusao: "2026-07-02T14:30:00.000Z",
  },
  {
    id: "prog-003",
    influenciadorId: INFLUENCIADOR_MOCK_ID,
    treinamentoId: "tr-007",
    status: "concluido",
    dataConclusao: "2026-07-08T09:00:00.000Z",
  },
  {
    id: "prog-004",
    influenciadorId: INFLUENCIADOR_MOCK_ID,
    treinamentoId: "tr-009",
    status: "em_andamento",
  },
];

/** Conteúdo placeholder por treinamento. */
export const CONTEUDO_TREINAMENTO_MOCK: Record<string, string> = {
  "tr-001":
    "Nesta trilha você aprende a calcular seu preço mínimo com base em tempo, equipamento e alcance. O foco é sair do 'preço por feeling' e construir uma tabela defensável para negociações na plataforma.",
  "tr-002":
    "Aprenda a diferenciar Reels, Stories, posts e lives na sua tabela de preços. Incluímos exemplos de pacotes combinados e como comunicar valor sem parecer genérico.",
  "tr-003":
    "Para marcas com orçamento maior, o jogo muda: exclusividade, uso de imagem e prazos curtos. Veja como precificar sem subestimar seu trabalho criativo.",
  "tr-004":
    "Entenda o fluxo de negociação dentro da plataforma: do match ao contrato. Saiba quando aceitar, quando pedir ajuste de escopo e como manter tom profissional.",
  "tr-005":
    "Técnicas para responder contra-propostas sem queimar pontes. Inclui scripts de mensagem e checklist antes de fechar valor.",
  "tr-006":
    "Campanhas com múltiplas entregas exigem clareza de escopo. Aprenda a negociar revisões, prazos e aditivos de forma documentada.",
  "tr-007":
    "Storytelling não é roteiro engessado — é conectar sua narrativa pessoal às orientações da marca. Exercícios de gancho nos primeiros 3 segundos.",
  "tr-008":
    "Estrutura problema → solução → prova social para Reels patrocinados. Modelos de CTA que não soam forçados.",
  "tr-009":
    "Fluxo de edição no CapCut/InShot: cortes, legendas, música e exportação otimizada para Instagram. Tempo alvo: 30 min por peça.",
  "tr-010":
    "Noções de contraste, saturação e LUTs leves para manter consistência visual no feed. Quando vale investir em preset vs. ajuste manual.",
};

export function getConteudoTreinamento(treinamentoId: string): string {
  return (
    CONTEUDO_TREINAMENTO_MOCK[treinamentoId] ??
    "Conteúdo em desenvolvimento. Em breve esta trilha terá módulos completos com exercícios práticos."
  );
}
