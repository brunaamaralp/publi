import { z } from "zod";

export const categoriaSchema = z.object({
  id: z.string(),
  nome: z.string(),
  tipo: z.enum(["dominio", "interesse"]),
});

export const midiaSchema = z.object({
  id: z.string(),
  tipo: z.enum(["foto", "video"]),
  url: z.string().min(1),
  legenda: z.string().optional(),
  categoria: z.enum(["apresentacao", "trabalho_anterior"]),
});

export const influenciadorSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  bio: z.string().max(500, "Bio deve ter no máximo 500 caracteres"),
  plano: z.enum(["basico", "pro", "elite"]),
  nivelAtual: z.number().int().nonnegative(),
  pontosXp: z.number().int().nonnegative(),
  notaMediaAvaliacao: z.number().nullable(),
  totalAvaliacoes: z.number().int().nonnegative(),
  tiposAtuacao: z
    .array(z.enum(["influenciador", "modelo"]))
    .min(1)
    .default(["influenciador"]),
  disponibilidade: z
    .object({
      diasSemana: z.array(
        z.enum(["dom", "seg", "ter", "qua", "qui", "sex", "sab"]),
      ),
      observacao: z.string().optional(),
      datasIndisponiveis: z.array(z.string()).optional(),
      datasBloqueadas: z.array(z.string()).optional(),
    })
    .optional(),
  midias: z.array(midiaSchema).default([]),
});

/** Valida seleção de categorias: ao menos 1 domínio obrigatório; interesse é opcional. */
export const categoriasSelecionadasSchema = z
  .array(categoriaSchema)
  .refine((categorias) => categorias.some((c) => c.tipo === "dominio"), {
    message: "Selecione pelo menos uma categoria de domínio",
  });

export const metricaPerfilSchema = z.object({
  id: z.string(),
  dataReferencia: z.string(),
  seguidores: z
    .number()
    .int("Seguidores deve ser um número inteiro")
    .positive("Seguidores deve ser um número positivo"),
  engajamentoMedio: z
    .number()
    .min(0, "Engajamento deve ser no mínimo 0%")
    .max(100, "Engajamento deve ser no máximo 100%"),
  alcanceMedio: z.number().positive().optional(),
  printUrl: z.string().min(1, "O print de métricas é obrigatório"),
  statusValidacao: z.enum(["pendente", "validado", "rejeitado"]),
});

export const audienciaDemografiaSchema = z.object({
  dimensao: z.enum(["genero", "faixa_etaria", "localidade"]),
  valor: z.string(),
  percentual: z.number().min(0).max(100),
});

export const equipamentoSchema = z.object({
  id: z.string(),
  tipo: z.string(),
  descricao: z.string().optional(),
});

export const pacoteServicoSchema = z.object({
  id: z.string(),
  nome: z.string(),
  descricao: z.string(),
  preco: z.number().positive(),
  itensInclusos: z.array(z.string()),
  ativo: z.boolean(),
});

export const tabelaPrecoSchema = z
  .object({
    id: z.string(),
    tipoServico: z.enum([
      "reels",
      "stories",
      "post_feed",
      "unboxing",
      "live",
    ]),
    precoBaseSugerido: z.number().nonnegative(),
    precoPraticado: z.number().nonnegative(),
  })
  .refine((data) => data.precoPraticado >= data.precoBaseSugerido, {
    message:
      "Esse preço fica abaixo do mínimo recomendado para o seu porte de audiência",
    path: ["precoPraticado"],
  });

/** Formulário de perfil do influenciador com categorias. */
export const influenciadorPerfilFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  bio: z
    .string()
    .max(500, "Bio deve ter no máximo 500 caracteres")
    .optional(),
  categorias: categoriasSelecionadasSchema,
});

export type InfluenciadorInput = z.infer<typeof influenciadorSchema>;
export type CategoriaInput = z.infer<typeof categoriaSchema>;
export type MetricaPerfilInput = z.infer<typeof metricaPerfilSchema>;
export type TabelaPrecoInput = z.infer<typeof tabelaPrecoSchema>;
export type InfluenciadorPerfilFormInput = z.infer<
  typeof influenciadorPerfilFormSchema
>;
