export type Agencia = {
  id: string;
  usuarioId: string;
  razaoSocial: string;
};

/** Uma agência gerencia várias empresas-clientes, mas não substitui a empresa
 * como contraparte contratual — quem assina contrato é sempre a Empresa. */
export type AgenciaCliente = {
  agenciaId: string;
  empresaId: string;
};
