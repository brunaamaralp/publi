import { DashboardAgenciaFlow } from "@/components/agencia/dashboard/dashboard-agencia-flow";

export const metadata = {
  title: "Painel | Agência",
  description:
    "Visão consolidada das empresas-clientes gerenciadas pela agência.",
};

export default function DashboardAgenciaPage() {
  return <DashboardAgenciaFlow />;
}
