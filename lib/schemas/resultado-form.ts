import { z } from "zod";

export const resultadoFormSchema = z.object({
  impressoes: z.coerce
    .number()
    .int("Impressões deve ser um número inteiro")
    .positive("Informe as impressões"),
  alcance: z.coerce
    .number()
    .int("Alcance deve ser um número inteiro")
    .positive("Informe o alcance"),
  cliques: z.coerce
    .number()
    .int("Cliques deve ser um número inteiro")
    .nonnegative("Cliques não pode ser negativo"),
  engajamentoTotal: z.coerce
    .number()
    .int("Engajamento deve ser um número inteiro")
    .nonnegative("Engajamento não pode ser negativo"),
  taxaEngajamento: z.coerce
    .number()
    .min(0, "Taxa mínima é 0%")
    .max(100, "Taxa máxima é 100%"),
  linkComprovante: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("data:") || /^https?:\/\/.+/.test(val),
      "Informe uma URL ou envie um print",
    ),
  observacoes: z.string().max(500).optional(),
});

export type ResultadoFormInput = z.infer<typeof resultadoFormSchema>;
