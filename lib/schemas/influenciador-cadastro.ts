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
  tiposAtuacao: z
    .array(z.enum(["influenciador", "modelo"]))
    .min(1, "Selecione ao menos um tipo de atuação"),
  disponibilidade: z
    .object({
      diasSemana: z.array(
        z.enum(["dom", "seg", "ter", "qua", "qui", "sex", "sab"]),
      ),
      observacao: z.string().optional(),
    })
    .nullable()
    .optional(),
}).superRefine((data, ctx) => {
  if (
    data.tiposAtuacao.includes("modelo") &&
    (!data.disponibilidade || data.disponibilidade.diasSemana.length === 0)
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Informe ao menos um dia de disponibilidade como modelo",
      path: ["disponibilidade"],
    });
  }
});

/** Seção pós-cadastro: equipamentos e métricas (antigo passo 3). */
export const perfilSecaoMetricasSchema = z.object({
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

/** Seção pós-cadastro: pacotes e precificação (antigo passo 4). */
export const perfilSecaoPrecosSchema = z.object({
  tabelaPrecos: z
    .array(tabelaPrecoSchema)
    .length(5, "Todos os tipos de serviço devem ser precificados"),
  pacotes: z.array(pacoteServicoSchema),
});

/** Seção pós-cadastro: plano (antigo passo 5). */
export const perfilSecaoPlanoSchema = z.object({
  plano: z.enum(["basico", "pro", "elite"], {
    error: "Selecione um plano de assinatura",
  }),
});

/** @deprecated Use perfilSecaoMetricasSchema — mantido para compatibilidade. */
export const cadastroPasso3Schema = perfilSecaoMetricasSchema;
/** @deprecated Use perfilSecaoPrecosSchema — mantido para compatibilidade. */
export const cadastroPasso4Schema = perfilSecaoPrecosSchema;
/** @deprecated Use perfilSecaoPlanoSchema — mantido para compatibilidade. */
export const cadastroPasso5Schema = perfilSecaoPlanoSchema;

export const CADASTRO_STEP_SCHEMAS = [
  cadastroPasso1Schema,
  cadastroPasso2Schema,
] as const;

export function validarPassoCadastro(
  passo: number,
  dados: Record<string, unknown>,
): { success: true } | { success: false; errors: Record<string, string> } {
  const schema = CADASTRO_STEP_SCHEMAS[passo];
  if (!schema) {
    return { success: true };
  }

  return mapearResultadoZod(schema.safeParse(dados));
}

export function validarSecaoMetricas(
  dados: Record<string, unknown>,
): { success: true } | { success: false; errors: Record<string, string> } {
  return mapearResultadoZod(perfilSecaoMetricasSchema.safeParse(dados));
}

export function validarSecaoPrecos(
  dados: Record<string, unknown>,
): { success: true } | { success: false; errors: Record<string, string> } {
  return mapearResultadoZod(perfilSecaoPrecosSchema.safeParse(dados));
}

export function validarSecaoPlano(
  dados: Record<string, unknown>,
): { success: true } | { success: false; errors: Record<string, string> } {
  return mapearResultadoZod(perfilSecaoPlanoSchema.safeParse(dados));
}

function mapearResultadoZod(
  result: { success: true } | { success: false; error: z.ZodError },
): { success: true } | { success: false; errors: Record<string, string> } {
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
