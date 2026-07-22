import { ListaResultadosEmpresaFlow } from "@/components/resultados/lista-resultados-empresa-flow";

export const metadata = {
  title: "Resultados | Agência",
  description: "Resultados de campanha do cliente ou visão consolidada.",
};

export default function AgenciaResultadosPage() {
  return <ListaResultadosEmpresaFlow />;
}
