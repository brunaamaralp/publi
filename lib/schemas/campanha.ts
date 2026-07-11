import { z } from "zod";

export const resultadoCampanhaSchema = z.object({
  id: z.string(),
  contratoId: z.string(),
  influenciadorId: z.string(),
  solicitadoPorUsuarioId: z.string().optional(),
  status: z.enum([
    "nao_solicitado",
    "solicitado",
    "preenchido",
    "validado",
  ]),
  impressoes: z.number().int().nonnegative().optional(),
  alcance: z.number().int().nonnegative().optional(),
  cliques: z.number().int().nonnegative().optional(),
  engajamentoTotal: z.number().int().nonnegative().optional(),
  taxaEngajamento: z.number().min(0).max(100).optional(),
  linkComprovante: z.string().url().optional(),
  observacoes: z.string().optional(),
});

export type ResultadoCampanhaInput = z.infer<typeof resultadoCampanhaSchema>;
