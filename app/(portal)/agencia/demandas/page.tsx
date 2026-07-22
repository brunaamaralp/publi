import { ExigeClienteAtivo } from "@/components/agencia/exige-cliente-ativo";
import { DemandasAgenciaClient } from "@/components/agencia/demandas-agencia-client";

export const metadata = {
  title: "Campanhas do cliente | Agência",
  description: "Gerencie as campanhas do cliente ativo da agência.",
};

export default function AgenciaDemandasPage() {
  return (
    <ExigeClienteAtivo>
      <DemandasAgenciaClient />
    </ExigeClienteAtivo>
  );
}
