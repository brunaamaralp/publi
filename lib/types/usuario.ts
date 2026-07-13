export type Usuario = {
  id: string;
  email: string;
  tipo: "influenciador" | "empresa" | "agencia" | "admin";
  status: "ativo" | "suspenso" | "pendente_verificacao";
  criadoEm: string; // ISO date
};
