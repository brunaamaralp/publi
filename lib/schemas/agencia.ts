import { z } from "zod";

export const agenciaSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
});

export const agenciaClienteSchema = z.object({
  agenciaId: z.string(),
  empresaId: z.string(),
});

export type AgenciaInput = z.infer<typeof agenciaSchema>;
export type AgenciaClienteInput = z.infer<typeof agenciaClienteSchema>;
