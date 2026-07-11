export type Usuario = {
  id: string;
  email: string;
  tipo: "influenciador" | "empresa" | "agencia";
  status: "ativo" | "suspenso" | "pendente_verificacao";
  criadoEm: string; // ISO date
};
