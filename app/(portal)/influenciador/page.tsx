import { DashboardInfluenciadorPageClient } from "@/components/influenciador/dashboard/dashboard-influenciador-page";

export const metadata = {
  title: "Painel | Influenciador",
  description:
    "Central de ações pendentes, saldo, oportunidades e resumo do perfil.",
};

export default function DashboardInfluenciadorPage() {
  return <DashboardInfluenciadorPageClient />;
}
