import { z } from "zod";

export const empresaCadastroFormSchema = z.object({
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
  segmento: z.string().min(1, "Segmento é obrigatório"),
  orcamentoMedioCampanha: z
    .number()
    .positive("Orçamento deve ser um valor positivo")
    .optional(),
});

export const agenciaCadastroFormSchema = z.object({
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
});

export type EmpresaCadastroFormInput = z.infer<typeof empresaCadastroFormSchema>;
export type AgenciaCadastroFormInput = z.infer<typeof agenciaCadastroFormSchema>;
