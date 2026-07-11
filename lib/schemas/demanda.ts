import { z } from "zod";

export const formatoEntregaSchema = z.enum([
  "reels",
  "stories",
  "post_feed",
  "unboxing",
  "live",
]);

export const demandaSchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  titulo: z.string().min(1, "Título é obrigatório"),
  briefing: z.string().min(1, "Briefing é obrigatório"),
  orcamento: z.number().positive("Orçamento deve ser um valor positivo"),
  formatoEntrega: formatoEntregaSchema,
  prazo: z.string().min(1, "Prazo é obrigatório"),
  status: z.enum(["aberta", "em_negociacao", "fechada", "cancelada"]),
});

export const publicoAlvoDemandaSchema = z.object({
  dimensao: z.enum(["genero", "faixa_etaria", "localidade"]),
  valor: z.string(),
});

export const matchSchema = z.object({
  id: z.string(),
  demandaId: z.string(),
  influenciadorId: z.string(),
  score: z.number().min(0).max(100),
  status: z.enum(["sugerido", "aceito", "recusado", "expirado"]),
});

/** Formulário de criação/edição de demanda (sem campos de sistema). */
export const demandaFormSchema = demandaSchema.pick({
  titulo: true,
  briefing: true,
  orcamento: true,
  formatoEntrega: true,
  prazo: true,
});

export type DemandaInput = z.infer<typeof demandaSchema>;
export type DemandaFormInput = z.infer<typeof demandaFormSchema>;
