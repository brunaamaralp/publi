import { ExigeClienteAtivo } from "@/components/agencia/exige-cliente-ativo";
import { BuscaCreatorsAgenciaClient } from "@/components/agencia/busca-creators-agencia-client";

export const metadata = {
  title: "Buscar creators | Agência",
  description: "Busca ativa de creators para o cliente ativo.",
};

export default function AgenciaBuscarCreatorsPage() {
  return (
    <ExigeClienteAtivo>
      <BuscaCreatorsAgenciaClient />
    </ExigeClienteAtivo>
  );
}
