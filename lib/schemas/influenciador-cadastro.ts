import { z } from "zod";

import {
  categoriaSchema,
  equipamentoSchema,
  pacoteServicoSchema,
  tabelaPrecoSchema,
} from "@/lib/schemas/influenciador";

export const cadastroPasso1Schema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  bio: z
    .string()
    .max(500, "Bio deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export const cadastroPasso2Schema = z.object({
  categoriasDominio: z
    .array(categoriaSchema)
    .min(1, "Selecione pelo menos uma área de domínio"),
  categoriasInteresse: z.array(categoriaSchema),
});

export const cadastroPasso3Schema = z.object({
  printMetricasUrl: z.string().min(1, "O print de métricas é obrigatório"),
  seguidores: z
    .number({
      error: "Informe o número de seguidores",
    })
    .int("Seguidores deve ser um número inteiro")
    .positive("Seguidores deve ser um número positivo"),
  engajamentoMedio: z
    .number({
      error: "Informe o engajamento médio",
    })
    .min(0, "Engajamento deve ser no mínimo 0%")
    .max(100, "Engajamento deve ser no máximo 100%"),
  equipamentos: z.array(equipamentoSchema),
});

export const cadastroPasso4Schema = z.object({
  tabelaPrecos: z
    .array(tabelaPrecoSchema)
    .length(5, "Todos os tipos de serviço devem ser precificados"),
  pacotes: z.array(pacoteServicoSchema),
});

export const cadastroPasso5Schema = z.object({
  plano: z.enum(["basico", "pro", "elite"], {
    error: "Selecione um plano de assinatura",
  }),
});

export const CADASTRO_STEP_SCHEMAS = [
  cadastroPasso1Schema,
  cadastroPasso2Schema,
  cadastroPasso3Schema,
  cadastroPasso4Schema,
  cadastroPasso5Schema,
] as const;

export function validarPassoCadastro(
  passo: number,
  dados: Record<string, unknown>,
): { success: true } | { success: false; errors: Record<string, string> } {
  const schema = CADASTRO_STEP_SCHEMAS[passo];
  if (!schema) {
    return { success: true };
  }

  const result = schema.safeParse(dados);
  if (result.success) {
    return { success: true };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".") || "root";
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }

  return { success: false, errors };
}
