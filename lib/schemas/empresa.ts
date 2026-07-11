import { z } from "zod";

export const empresaSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
  segmento: z.string().min(1, "Segmento é obrigatório"),
});

export type EmpresaInput = z.infer<typeof empresaSchema>;
