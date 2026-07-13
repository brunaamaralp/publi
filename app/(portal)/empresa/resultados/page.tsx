import { ListaResultadosEmpresaFlow } from "@/components/resultados/lista-resultados-empresa-flow";

export const metadata = {
  title: "Resultados de campanha",
  description: "Acompanhe métricas e solicite resultados de campanhas concluídas.",
};

export default function ResultadosEmpresaPage() {
  return <ListaResultadosEmpresaFlow />;
}
