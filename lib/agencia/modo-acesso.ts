export type ModoAcessoCliente = "edicao" | "leitura";

type ClienteAcesso = {
  criadaPelaAgencia: boolean;
  modoAcesso?: ModoAcessoCliente;
};

/** Clientes criados pela agência têm edição; vinculados de terceiros, só leitura. */
export function resolverModoAcesso(cliente: ClienteAcesso): ModoAcessoCliente {
  if (cliente.modoAcesso) return cliente.modoAcesso;
  return cliente.criadaPelaAgencia ? "edicao" : "leitura";
}

export function comModoAcesso<T extends ClienteAcesso>(
  cliente: T,
): T & { modoAcesso: ModoAcessoCliente } {
  return {
    ...cliente,
    modoAcesso: resolverModoAcesso(cliente),
  };
}
