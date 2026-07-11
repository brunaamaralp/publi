import type { Avaliacao } from "@/lib/types";

/** ID do influenciador mock usado no cadastro/perfil. */
export const INFLUENCIADOR_MOCK_ID = "inf-mock-001";

/** Empresa mock para testar avaliação mútua. */
export const EMPRESA_MOCK_ID = "emp-mock-001";

/** Contrato concluído — avaliação disponível apenas neste status. */
export const CONTRATO_MOCK_CUMPRIDO = {
  id: "ctr-mock-001",
  matchId: "match-mock-001",
  valor: 2500,
  escopo: "Campanha de lançamento — 2 reels + 3 stories",
  prazoEntrega: "2026-05-15",
  status: "cumprido" as const,
  dataAssinatura: "2026-04-01",
  empresaId: EMPRESA_MOCK_ID,
  influenciadorId: INFLUENCIADOR_MOCK_ID,
  empresaNome: "Marca Exemplo Ltda.",
};

export const avaliacoesRecebidasMock: Avaliacao[] = [
  {
    id: "avl-001",
    contratoId: "ctr-101",
    avaliadorId: "emp-201",
    avaliadoId: INFLUENCIADOR_MOCK_ID,
    notaFornecedor: 5,
    comentario:
      "Entrega impecável, dentro do prazo e com ótima comunicação durante a campanha.",
    criadoEm: "2026-06-28T14:30:00.000Z",
  },
  {
    id: "avl-002",
    contratoId: "ctr-098",
    avaliadorId: "emp-188",
    avaliadoId: INFLUENCIADOR_MOCK_ID,
    notaFornecedor: 4,
    comentario: "Conteúdo de qualidade. Pequeno atraso na primeira entrega, mas resolveu rápido.",
    criadoEm: "2026-06-10T09:15:00.000Z",
  },
  {
    id: "avl-003",
    contratoId: "ctr-087",
    avaliadorId: "emp-175",
    avaliadoId: INFLUENCIADOR_MOCK_ID,
    notaFornecedor: 5,
    criadoEm: "2026-05-22T16:00:00.000Z",
  },
  {
    id: "avl-004",
    contratoId: "ctr-076",
    avaliadorId: "emp-162",
    avaliadoId: INFLUENCIADOR_MOCK_ID,
    notaFornecedor: 3,
    comentario:
      "Resultado aceitável, mas faltou alinhamento prévio sobre o tom da marca.",
    criadoEm: "2026-04-30T11:45:00.000Z",
  },
  {
    id: "avl-005",
    contratoId: "ctr-065",
    avaliadorId: "emp-149",
    avaliadoId: INFLUENCIADOR_MOCK_ID,
    notaFornecedor: 5,
    comentario: "Parceria excelente. Já estamos planejando a próxima campanha.",
    criadoEm: "2026-03-18T08:20:00.000Z",
  },
  {
    id: "avl-006",
    contratoId: "ctr-054",
    avaliadorId: "emp-136",
    avaliadoId: INFLUENCIADOR_MOCK_ID,
    notaFornecedor: 4,
    criadoEm: "2026-02-05T13:10:00.000Z",
  },
  {
    id: "avl-007",
    contratoId: "ctr-043",
    avaliadorId: "emp-123",
    avaliadoId: INFLUENCIADOR_MOCK_ID,
    notaFornecedor: 5,
    comentario: "Profissionalismo do início ao fim. Métricas acima do esperado.",
    criadoEm: "2025-12-20T10:00:00.000Z",
  },
  {
    id: "avl-008",
    contratoId: "ctr-032",
    avaliadorId: "emp-110",
    avaliadoId: INFLUENCIADOR_MOCK_ID,
    notaFornecedor: 4,
    comentario: "Boa execução criativa. Recomendo para campanhas de awareness.",
    criadoEm: "2025-11-08T17:30:00.000Z",
  },
];
