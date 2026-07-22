import { PainelFinanceiroEmpresaFlow } from "@/components/empresa/financeiro/painel-financeiro-empresa";

export const metadata = {
  title: "Financeiro | Empresa",
  description:
    "Acompanhe investimento, valores retidos e movimentações do pagamento protegido.",
};

export default function EmpresaFinanceiroPage() {
  return <PainelFinanceiroEmpresaFlow />;
}
