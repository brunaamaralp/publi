import { GestaoClientesAgenciaFlow } from "@/components/agencia/gestao-clientes-agencia";

export const metadata = {
  title: "Clientes | Agência",
  description: "Gerencie empresas-clientes da agência.",
};

export default function AgenciaClientesPage() {
  return <GestaoClientesAgenciaFlow />;
}
