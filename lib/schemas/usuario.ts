import { z } from "zod";

export const usuarioSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  tipo: z.enum(["influenciador", "empresa", "agencia", "admin"]),
  status: z.enum(["ativo", "suspenso", "pendente_verificacao"]),
  criadoEm: z.string(),
});

export type UsuarioInput = z.infer<typeof usuarioSchema>;
