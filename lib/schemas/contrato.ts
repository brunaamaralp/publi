import { z } from "zod";

export const contratoSchema = z.object({
  id: z.string(),
  matchId: z.string(),
  valor: z.number().positive("Valor do contrato deve ser um valor positivo"),
  escopo: z.string().min(1, "Escopo é obrigatório"),
  prazoEntrega: z.string().min(1, "Prazo de entrega é obrigatório"),
  status: z.enum([
    "rascunho",
    "assinado",
    "em_andamento",
    "concluida",
    "cancelado",
    "em_disputa",
  ]),
  dataAssinatura: z.string().optional(),
  statusEntrega: z
    .enum([
      "pendente",
      "entregue",
      "ajuste_solicitado",
      "aprovado",
      "em_disputa",
    ])
    .default("pendente"),
  dataEntrega: z.string().optional(),
  prazoLiberacaoAutomatica: z.string().optional(),
  ciclosAjusteUsados: z.number().int().nonnegative().default(0),
  descricaoEntrega: z.string().optional(),
  linkComprovante: z.string().optional(),
  arquivoComprovanteUrl: z.string().optional(),
  motivoAjuste: z.string().optional(),
});

export const conversaSchema = z.object({
  id: z.string(),
  contratoId: z.string(),
});

export const mensagemSchema = z.object({
  id: z.string(),
  conversaId: z.string(),
  remetenteId: z.string(),
  texto: z.string().min(1, "Mensagem não pode estar vazia"),
  enviadoEm: z.string(),
  flagContatoExterno: z.enum([
    "nenhum",
    "bloqueado_padrao",
    "alerta_termo",
  ]),
});

export const pagamentoSchema = z.object({
  id: z.string(),
  contratoId: z.string(),
  valor: z.number().positive(),
  status: z.enum(["retido", "liberado", "estornado", "reembolsado"]),
});

export const rpaSchema = z.object({
  id: z.string(),
  pagamentoId: z.string(),
  empresaId: z.string(),
  influenciadorId: z.string(),
  municipioReferencia: z.string(),
  valorBruto: z.number().nonnegative(),
  inssRetido: z.number().nonnegative(),
  irrfRetido: z.number().nonnegative(),
  issRetido: z.number().nonnegative(),
  valorLiquido: z.number().nonnegative(),
  status: z.enum(["calculado", "confirmado_pela_empresa", "recolhido"]),
});

export const entregaSchema = z.object({
  id: z.string(),
  contratoId: z.string(),
  aditivoId: z.string().optional(),
  linkComprovante: z.string().min(1),
  dataEntrega: z.string(),
  descricao: z.string().optional(),
  arquivoComprovanteUrl: z.string().optional(),
  statusConfirmacao: z.enum([
    "aguardando",
    "confirmada",
    "confirmada_automaticamente",
    "contestada",
  ]),
});

export const camposCicloEntregaSchema = z.object({
  statusEntrega: z.enum([
    "pendente",
    "entregue",
    "ajuste_solicitado",
    "aprovado",
    "em_disputa",
  ]),
  dataEntrega: z.string().optional(),
  prazoLiberacaoAutomatica: z.string().optional(),
  ciclosAjusteUsados: z.number().int().nonnegative(),
  descricaoEntrega: z.string().optional(),
  linkComprovante: z.string().optional(),
  arquivoComprovanteUrl: z.string().optional(),
  motivoAjuste: z.string().optional(),
  disputa: z
    .object({
      motivo: z.string(),
      evidencia: z.string().optional(),
      reportadoEm: z.string(),
      decisao: z
        .enum(["liberado_influenciador", "reembolsado_empresa"])
        .optional(),
      decididoEm: z.string().optional(),
    })
    .optional(),
});

export const aditivoSchema = camposCicloEntregaSchema.extend({
  id: z.string(),
  contratoId: z.string(),
  valor: z.number().positive(),
  escopo: z.string().min(1),
  prazoEntrega: z.string().min(1),
  criadoEm: z.string(),
  status: z.enum(["proposto", "aceito", "ativo", "cancelado"]),
});

export const pagamentoRetidoItemSchema = z.object({
  id: z.string(),
  origem: z.enum(["contrato", "aditivo"]),
  referenciaId: z.string(),
  valor: z.number().positive(),
  status: z.enum(["retido", "liberado", "estornado", "reembolsado"]),
});

export const pagamentoRetidoSchema = z.object({
  id: z.string(),
  contratoId: z.string(),
  itens: z.array(pagamentoRetidoItemSchema),
});

/** Formulário de contrato (campos preenchidos pelo usuário). */
export const contratoFormSchema = contratoSchema.pick({
  valor: true,
  escopo: true,
  prazoEntrega: true,
});

export type ContratoInput = z.infer<typeof contratoSchema>;
export type ContratoFormInput = z.infer<typeof contratoFormSchema>;
