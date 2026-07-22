import { DashboardEmpresaPageClient } from "@/components/empresa/dashboard/dashboard-empresa-page";

export const metadata = {
  title: "Painel | Empresa",
  description:
    "Central de ações pendentes, pagamento protegido e busca de creators.",
};

export default function DashboardEmpresaPage() {
  return <DashboardEmpresaPageClient />;
}
