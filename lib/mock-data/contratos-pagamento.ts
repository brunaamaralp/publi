import {
  EMPRESA_MOCK_ID,
  INFLUENCIADOR_MOCK_ID,
} from "@/lib/mock-data/avaliacoes";
import {
  EMPRESA_NEGOCIACAO_USUARIO_ID,
  INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
} from "@/lib/mock-data/negociacao";
import { DEMANDAS_FEED_MOCK } from "@/lib/mock-data/demandas";
import { isoDiasAPartirDeHoje } from "@/lib/influenciador/agenda-utils";
import { obterContextoPagamentoRegistrado } from "@/lib/pagamento/contrato-pagamento-registro";
import { prazoLiberacaoAutomaticaIso } from "@/lib/pagamento/dias-uteis";
import type {
  ContratoPagamentoContexto,
  PagamentoFluxoEstado,
} from "@/lib/pagamento/pagamento-types";
import { camposCicloEntregaIniciais } from "@/lib/types/contrato";
import type { Aditivo, Contrato } from "@/lib/types";

/** Contrato assinado — influenciador CPF (dispara fluxo de RPA). statusEntrega: pendente */
export const CONTRATO_CPF_ID = "ctr-cpf-001";

/** Contrato em andamento com entrega registrada e prazo já vencido → liberação automática. */
export const CONTRATO_CNPJ_ID = "ctr-cnpj-001";

/** Entrega com ajuste solicitado — influenciador deve reenviar. */
export const CONTRATO_AJUSTE_ID = "ctr-ajuste-001";

/** Entrega já aprovada — valor liberado no pagamento retido. */
export const CONTRATO_APROVADO_ID = "ctr-aprovado-001";

/** Entrega aguardando revisão da empresa (dentro do prazo). */
export const CONTRATO_ENTREGUE_ID = "ctr-entregue-001";

/** Disputa: prazo de entrega vencido e nunca entregue. */
export const CONTRATO_DISPUTA_NAO_ENTREGA_ID = "ctr-disputa-nao-001";

/** Disputa: má-fé após 2 ciclos de ajuste (3ª entrega). */
export const CONTRATO_DISPUTA_MAFE_ID = "ctr-disputa-mafe-001";

function contratoBase(
  partial: Omit<Contrato, keyof ReturnType<typeof camposCicloEntregaIniciais>> &
    Partial<ReturnType<typeof camposCicloEntregaIniciais>>,
): Contrato {
  return {
    ...camposCicloEntregaIniciais(),
    ...partial,
  };
}

/** Aditivo proposto pela empresa — aguarda resposta do influenciador. */
const ADITIVO_PROPOSTO: Aditivo = {
  id: "adit-proposto-001",
  contratoId: CONTRATO_CPF_ID,
  valor: 1200,
  escopo: "Stories extras com bastidores da gravação do sérum",
  prazoEntrega: isoDiasAPartirDeHoje(10),
  criadoEm: "2026-07-20T14:00:00.000Z",
  status: "proposto",
  ...camposCicloEntregaIniciais(),
};

const CONTRATO_CPF: ContratoPagamentoContexto = {
  contrato: contratoBase({
    id: CONTRATO_CPF_ID,
    matchId: "match-001",
    valor: 8500,
    escopo:
      "Buscamos influenciador(a) de beleza para apresentar nossa nova linha de séruns com vitamina C. O conteúdo deve destacar rotina matinal, textura do produto e resultado em 7 dias. Entregas: 1 reels + 2 stories.",
    /** Prazo próximo (< 3 dias) para acionar alerta no dashboard. */
    prazoEntrega: isoDiasAPartirDeHoje(2),
    status: "em_andamento",
    dataAssinatura: "2026-07-12T10:00:00.000Z",
    /** Entrega em andamento (ainda não enviada). */
    statusEntrega: "pendente",
  }),
  empresa: {
    id: EMPRESA_MOCK_ID,
    nome: "Glow Cosmetics",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    usuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
    documentoTipo: "cpf",
  },
  demandaTitulo: DEMANDAS_FEED_MOCK[0]!.demanda.titulo,
  aditivos: [ADITIVO_PROPOSTO],
};

/** Prazo no passado para forçar liberação automática no load. */
const PRAZO_VENCIDO = "2026-07-01T12:00:00.000Z";
const DATA_ENTREGA_VENCIDA = "2026-06-20T15:00:00.000Z";

const CONTRATO_CNPJ: ContratoPagamentoContexto = {
  contrato: contratoBase({
    id: CONTRATO_CNPJ_ID,
    matchId: "match-002",
    valor: 4200,
    escopo:
      "Reels mostrando o app em uso no dia a dia: organização de tarefas, integração com calendário e dica de produtividade. Público jovem profissional, 22-35 anos.",
    prazoEntrega: "2026-08-01",
    status: "em_andamento",
    dataAssinatura: "2026-07-11T14:00:00.000Z",
    statusEntrega: "entregue",
    dataEntrega: DATA_ENTREGA_VENCIDA,
    prazoLiberacaoAutomatica: PRAZO_VENCIDO,
    ciclosAjusteUsados: 0,
    descricaoEntrega: "Reels publicado com demo do app e CTA na bio.",
    linkComprovante: "https://www.instagram.com/p/exemplo-nexa/",
  }),
  empresa: {
    id: "emp-plat-006",
    nome: "Nexa Solutions",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: "inf-cnpj-001",
    nome: "Marcos Tech Creator",
    usuarioId: "usr-influ-cnpj-001",
    documentoTipo: "cnpj",
  },
  demandaTitulo: DEMANDAS_FEED_MOCK[1]!.demanda.titulo,
};

const ADITIVO_AJUSTE: Aditivo = {
  id: "adit-ajuste-001",
  contratoId: CONTRATO_AJUSTE_ID,
  valor: 800,
  escopo: "Stories extras com bastidores da gravação",
  prazoEntrega: "2026-08-25",
  criadoEm: "2026-07-10T10:00:00.000Z",
  status: "ativo",
  ...camposCicloEntregaIniciais(),
  statusEntrega: "pendente",
};

/** Aceito pelo influenciador — empresa ainda precisa depositar. */
const ADITIVO_ACEITO_SEM_DEPOSITO: Aditivo = {
  id: "adit-aceito-001",
  contratoId: CONTRATO_AJUSTE_ID,
  valor: 950,
  escopo: "Reels bônus com close do produto e CTA no final",
  prazoEntrega: isoDiasAPartirDeHoje(12),
  criadoEm: "2026-07-19T16:00:00.000Z",
  status: "aceito",
  ...camposCicloEntregaIniciais(),
};

const CONTRATO_AJUSTE: ContratoPagamentoContexto = {
  contrato: contratoBase({
    id: CONTRATO_AJUSTE_ID,
    matchId: "match-ajuste-001",
    valor: 3500,
    escopo: "Ensaio editorial + 1 Reels para lançamento de acessórios.",
    prazoEntrega: "2026-08-20",
    status: "em_andamento",
    dataAssinatura: "2026-07-08T09:00:00.000Z",
    statusEntrega: "ajuste_solicitado",
    dataEntrega: "2026-07-18T11:00:00.000Z",
    ciclosAjusteUsados: 1,
    descricaoEntrega: "Primeiro envio do Reels — marca pediu ajuste de enquadramento.",
    linkComprovante: "https://www.instagram.com/p/exemplo-ajuste/",
    motivoAjuste:
      "Por favor, regrave o Reels com o produto em close nos primeiros 3 segundos e sem texto sobreposto no logo.",
  }),
  empresa: {
    id: EMPRESA_MOCK_ID,
    nome: "Urban Style",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    usuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
    documentoTipo: "cpf",
  },
  demandaTitulo: "Campanha acessórios — editorial",
  aditivos: [ADITIVO_AJUSTE, ADITIVO_ACEITO_SEM_DEPOSITO],
};

const CONTRATO_APROVADO: ContratoPagamentoContexto = {
  contrato: contratoBase({
    id: CONTRATO_APROVADO_ID,
    matchId: "match-aprovado-001",
    valor: 5200,
    escopo: "Unboxing + review em Stories e feed.",
    prazoEntrega: "2026-07-30",
    status: "concluida",
    dataAssinatura: "2026-07-01T10:00:00.000Z",
    statusEntrega: "aprovado",
    dataEntrega: "2026-07-14T16:00:00.000Z",
    prazoLiberacaoAutomatica: prazoLiberacaoAutomaticaIso("2026-07-14T16:00:00.000Z"),
    ciclosAjusteUsados: 0,
    descricaoEntrega: "Unboxing publicado conforme briefing.",
    linkComprovante: "https://www.instagram.com/p/exemplo-aprovado/",
  }),
  empresa: {
    id: EMPRESA_MOCK_ID,
    nome: "Glow Cosmetics",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    usuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
    documentoTipo: "cpf",
  },
  demandaTitulo: "Unboxing linha gourmet",
};

const DATA_ENTREGA_RECENTE = new Date(
  Date.now() - 2 * 24 * 60 * 60 * 1000,
).toISOString();

const CONTRATO_ENTREGUE: ContratoPagamentoContexto = {
  contrato: contratoBase({
    id: CONTRATO_ENTREGUE_ID,
    matchId: "match-entregue-001",
    valor: 2800,
    escopo: "1 Reels + 3 Stories para app de produtividade.",
    prazoEntrega: "2026-08-10",
    status: "em_andamento",
    dataAssinatura: "2026-07-15T10:00:00.000Z",
    statusEntrega: "entregue",
    dataEntrega: DATA_ENTREGA_RECENTE,
    prazoLiberacaoAutomatica: prazoLiberacaoAutomaticaIso(DATA_ENTREGA_RECENTE),
    ciclosAjusteUsados: 0,
    descricaoEntrega: "Conteúdo no ar — link e print anexados.",
    linkComprovante: "https://www.instagram.com/p/exemplo-entregue/",
  }),
  empresa: {
    id: EMPRESA_MOCK_ID,
    nome: "Glow Cosmetics",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    usuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
    documentoTipo: "cnpj",
  },
  demandaTitulo: "Reels produtividade — revisão empresa",
};

const CONTRATO_DISPUTA_NAO_ENTREGA: ContratoPagamentoContexto = {
  contrato: contratoBase({
    id: CONTRATO_DISPUTA_NAO_ENTREGA_ID,
    matchId: "match-disputa-nao-001",
    valor: 4100,
    escopo: "1 Reels + 2 Stories para lançamento de perfume.",
    prazoEntrega: "2026-07-10",
    status: "em_disputa",
    dataAssinatura: "2026-06-20T10:00:00.000Z",
    statusEntrega: "em_disputa",
    ciclosAjusteUsados: 0,
    disputa: {
      motivo:
        "O prazo combinado (10/07) passou e o influenciador não registrou nenhuma entrega na plataforma.",
      reportadoEm: "2026-07-16T14:00:00.000Z",
    },
  }),
  empresa: {
    id: EMPRESA_MOCK_ID,
    nome: "Glow Cosmetics",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    usuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
    documentoTipo: "cpf",
  },
  demandaTitulo: "Lançamento perfume — não entregue",
};

const CONTRATO_DISPUTA_MAFE: ContratoPagamentoContexto = {
  contrato: contratoBase({
    id: CONTRATO_DISPUTA_MAFE_ID,
    matchId: "match-disputa-mafe-001",
    valor: 3900,
    escopo: "Unboxing completo com close do produto e menção à marca.",
    prazoEntrega: "2026-07-25",
    status: "em_disputa",
    dataAssinatura: "2026-07-05T09:00:00.000Z",
    statusEntrega: "em_disputa",
    dataEntrega: "2026-07-19T18:00:00.000Z",
    ciclosAjusteUsados: 2,
    descricaoEntrega:
      "Terceiro envio — marca alega que o produto continua fora de foco.",
    linkComprovante: "https://www.instagram.com/p/exemplo-mafe/",
    motivoAjuste:
      "Segundo ajuste: o produto precisa aparecer com a embalagem legível nos primeiros 3 segundos.",
    disputa: {
      motivo:
        "Após dois ciclos de ajuste, a terceira entrega ainda não mostra o produto conforme o briefing. Parece má-fé / descaso com o combinado.",
      evidencia:
        "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800",
      reportadoEm: "2026-07-20T11:30:00.000Z",
    },
  }),
  empresa: {
    id: "emp-urban",
    nome: "Urban Style",
    usuarioId: EMPRESA_NEGOCIACAO_USUARIO_ID,
  },
  influenciador: {
    id: INFLUENCIADOR_MOCK_ID,
    nome: "Ana Beatriz Silva",
    usuarioId: INFLUENCIADOR_NEGOCIACAO_USUARIO_ID,
    documentoTipo: "cpf",
  },
  demandaTitulo: "Unboxing — disputa por má-fé",
};

export const CONTRATOS_PAGAMENTO_MOCK: Record<
  string,
  ContratoPagamentoContexto
> = {
  [CONTRATO_CPF_ID]: CONTRATO_CPF,
  [CONTRATO_CNPJ_ID]: CONTRATO_CNPJ,
  [CONTRATO_AJUSTE_ID]: CONTRATO_AJUSTE,
  [CONTRATO_APROVADO_ID]: CONTRATO_APROVADO,
  [CONTRATO_ENTREGUE_ID]: CONTRATO_ENTREGUE,
  [CONTRATO_DISPUTA_NAO_ENTREGA_ID]: CONTRATO_DISPUTA_NAO_ENTREGA,
  [CONTRATO_DISPUTA_MAFE_ID]: CONTRATO_DISPUTA_MAFE,
};

/** Estados iniciais seedados (sem localStorage) para demos do ciclo de entrega. */
export function estadoPagamentoSeed(
  contratoId: string,
): PagamentoFluxoEstado | null {
  const ctx = CONTRATOS_PAGAMENTO_MOCK[contratoId];
  if (!ctx) return null;

  if (contratoId === CONTRATO_CPF_ID) {
    return {
      contratoId,
      contrato: { ...ctx.contrato },
      pagamento: {
        id: "pag-cpf-001",
        contratoId,
        valor: ctx.contrato.valor,
        status: "retido",
      },
      pagamentoRetido: {
        id: "pagamento-retido-cpf-001",
        contratoId,
        itens: [
          {
            id: "pagamento-retido-item-cpf",
            origem: "contrato",
            referenciaId: contratoId,
            valor: ctx.contrato.valor,
            status: "retido",
          },
        ],
      },
      aditivos: (ctx.aditivos ?? []).map((a) => ({ ...a })),
      rpa: null,
      entrega: null,
    };
  }

  if (contratoId === CONTRATO_CNPJ_ID) {
    return {
      contratoId,
      contrato: { ...ctx.contrato },
      pagamento: {
        id: "pag-cnpj-001",
        contratoId,
        valor: ctx.contrato.valor,
        status: "retido",
      },
      pagamentoRetido: {
        id: "pagamento-retido-cnpj-001",
        contratoId,
        itens: [
          {
            id: "pagamento-retido-item-cnpj",
            origem: "contrato",
            referenciaId: contratoId,
            valor: ctx.contrato.valor,
            status: "retido",
          },
        ],
      },
      aditivos: [],
      rpa: null,
      entrega: {
        id: "ent-cnpj-001",
        contratoId,
        linkComprovante: ctx.contrato.linkComprovante!,
        dataEntrega: ctx.contrato.dataEntrega!,
        descricao: ctx.contrato.descricaoEntrega,
        statusConfirmacao: "aguardando",
      },
    };
  }

  if (contratoId === CONTRATO_AJUSTE_ID) {
    return {
      contratoId,
      contrato: { ...ctx.contrato },
      pagamento: {
        id: "pag-ajuste-001",
        contratoId,
        valor: ctx.contrato.valor,
        status: "retido",
      },
      pagamentoRetido: {
        id: "pagamento-retido-ajuste-001",
        contratoId,
        itens: [
          {
            id: "pagamento-retido-item-ajuste-ctr",
            origem: "contrato",
            referenciaId: contratoId,
            valor: ctx.contrato.valor,
            status: "retido",
          },
          {
            id: "pagamento-retido-item-ajuste-adit",
            origem: "aditivo",
            referenciaId: ADITIVO_AJUSTE.id,
            valor: ADITIVO_AJUSTE.valor,
            status: "retido",
          },
        ],
      },
      aditivos: [
        { ...ADITIVO_AJUSTE },
        { ...ADITIVO_ACEITO_SEM_DEPOSITO },
      ],
      rpa: null,
      entrega: {
        id: "ent-ajuste-001",
        contratoId,
        linkComprovante: ctx.contrato.linkComprovante!,
        dataEntrega: ctx.contrato.dataEntrega!,
        descricao: ctx.contrato.descricaoEntrega,
        statusConfirmacao: "contestada",
      },
    };
  }

  if (contratoId === CONTRATO_APROVADO_ID) {
    return {
      contratoId,
      contrato: { ...ctx.contrato },
      pagamento: {
        id: "pag-aprovado-001",
        contratoId,
        valor: ctx.contrato.valor,
        status: "liberado",
      },
      pagamentoRetido: {
        id: "pagamento-retido-aprovado-001",
        contratoId,
        itens: [
          {
            id: "pagamento-retido-item-aprovado",
            origem: "contrato",
            referenciaId: contratoId,
            valor: ctx.contrato.valor,
            status: "liberado",
          },
        ],
      },
      aditivos: [],
      rpa: null,
      entrega: {
        id: "ent-aprovado-001",
        contratoId,
        linkComprovante: ctx.contrato.linkComprovante!,
        dataEntrega: ctx.contrato.dataEntrega!,
        descricao: ctx.contrato.descricaoEntrega,
        statusConfirmacao: "confirmada",
      },
    };
  }

  if (contratoId === CONTRATO_ENTREGUE_ID) {
    return {
      contratoId,
      contrato: { ...ctx.contrato },
      pagamento: {
        id: "pag-entregue-001",
        contratoId,
        valor: ctx.contrato.valor,
        status: "retido",
      },
      pagamentoRetido: {
        id: "pagamento-retido-entregue-001",
        contratoId,
        itens: [
          {
            id: "pagamento-retido-item-entregue",
            origem: "contrato",
            referenciaId: contratoId,
            valor: ctx.contrato.valor,
            status: "retido",
          },
        ],
      },
      aditivos: [],
      rpa: null,
      entrega: {
        id: "ent-entregue-001",
        contratoId,
        linkComprovante: ctx.contrato.linkComprovante!,
        dataEntrega: ctx.contrato.dataEntrega!,
        descricao: ctx.contrato.descricaoEntrega,
        statusConfirmacao: "aguardando",
      },
    };
  }

  if (contratoId === CONTRATO_DISPUTA_NAO_ENTREGA_ID) {
    return {
      contratoId,
      contrato: { ...ctx.contrato },
      pagamento: {
        id: "pag-disputa-nao-001",
        contratoId,
        valor: ctx.contrato.valor,
        status: "retido",
      },
      pagamentoRetido: {
        id: "pagamento-retido-disputa-nao-001",
        contratoId,
        itens: [
          {
            id: "pagamento-retido-item-disputa-nao",
            origem: "contrato",
            referenciaId: contratoId,
            valor: ctx.contrato.valor,
            status: "retido",
          },
        ],
      },
      aditivos: [],
      rpa: null,
      entrega: null,
    };
  }

  if (contratoId === CONTRATO_DISPUTA_MAFE_ID) {
    return {
      contratoId,
      contrato: { ...ctx.contrato },
      pagamento: {
        id: "pag-disputa-mafe-001",
        contratoId,
        valor: ctx.contrato.valor,
        status: "retido",
      },
      pagamentoRetido: {
        id: "pagamento-retido-disputa-mafe-001",
        contratoId,
        itens: [
          {
            id: "pagamento-retido-item-disputa-mafe",
            origem: "contrato",
            referenciaId: contratoId,
            valor: ctx.contrato.valor,
            status: "retido",
          },
        ],
      },
      aditivos: [],
      rpa: null,
      entrega: {
        id: "ent-disputa-mafe-001",
        contratoId,
        linkComprovante: ctx.contrato.linkComprovante!,
        dataEntrega: ctx.contrato.dataEntrega!,
        descricao: ctx.contrato.descricaoEntrega,
        statusConfirmacao: "contestada",
      },
    };
  }

  return null;
}

export const MUNICIPIOS_MOCK = [
  "São Paulo — SP",
  "Rio de Janeiro — RJ",
  "Belo Horizonte — MG",
  "Curitiba — PR",
  "Porto Alegre — RS",
] as const;

export function getContratoPagamentoContexto(
  contratoId: string,
): ContratoPagamentoContexto | null {
  const registrado = obterContextoPagamentoRegistrado(contratoId);
  if (registrado) {
    return {
      ...registrado,
      contrato: {
        ...camposCicloEntregaIniciais(),
        ...registrado.contrato,
      },
      aditivos: registrado.aditivos ?? [],
    };
  }
  return CONTRATOS_PAGAMENTO_MOCK[contratoId] ?? null;
}
