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
    "em_execucao",
    "cumprido",
    "cancelado",
    "em_disputa",
  ]),
  dataAssinatura: z.string().optional(),
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
  status: z.enum(["retido", "liberado", "estornado"]),
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
  linkComprovante: z.string().url("Link do comprovante deve ser uma URL válida"),
  dataEntrega: z.string(),
  statusConfirmacao: z.enum([
    "aguardando",
    "confirmada",
    "confirmada_automaticamente",
    "contestada",
  ]),
});

/** Formulário de contrato (campos preenchidos pelo usuário). */
export const contratoFormSchema = contratoSchema.pick({
  valor: true,
  escopo: true,
  prazoEntrega: true,
});

export type ContratoInput = z.infer<typeof contratoSchema>;
export type ContratoFormInput = z.infer<typeof contratoFormSchema>;
