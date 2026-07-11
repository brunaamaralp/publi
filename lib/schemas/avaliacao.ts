import { z } from "zod";

export const avaliacaoSchema = z.object({
  id: z.string(),
  contratoId: z.string(),
  avaliadorId: z.string(),
  avaliadoId: z.string(),
  notaFornecedor: z
    .number()
    .int("Nota deve ser um número inteiro")
    .min(1, "Nota mínima é 1")
    .max(5, "Nota máxima é 5"),
  comentario: z
    .string()
    .max(300, "Comentário deve ter no máximo 300 caracteres")
    .optional(),
  criadoEm: z.string(),
});

/** Campos preenchidos pelo usuário no formulário de avaliação. */
export const avaliacaoFormSchema = z.object({
  notaFornecedor: z
    .number()
    .int("Nota deve ser um número inteiro")
    .min(1, "Selecione uma nota de 1 a 5")
    .max(5, "Nota máxima é 5"),
  comentario: z
    .string()
    .max(300, "Comentário deve ter no máximo 300 caracteres")
    .optional()
    .or(z.literal("")),
});

export type AvaliacaoInput = z.infer<typeof avaliacaoSchema>;
export type AvaliacaoFormInput = z.infer<typeof avaliacaoFormSchema>;
