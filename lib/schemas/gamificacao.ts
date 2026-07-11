import { z } from "zod";

export const treinamentoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  categoria: z.string(),
  nivelRequerido: z.number().int().nonnegative(),
});

export const progressoTreinamentoSchema = z.object({
  id: z.string(),
  influenciadorId: z.string(),
  treinamentoId: z.string(),
  status: z.enum(["nao_iniciado", "em_andamento", "concluido"]),
  dataConclusao: z.string().optional(),
});

export type TreinamentoInput = z.infer<typeof treinamentoSchema>;
export type ProgressoTreinamentoInput = z.infer<
  typeof progressoTreinamentoSchema
>;
