import { PainelFinanceiro } from "@/components/influenciador/financeiro/painel-financeiro";

export const metadata = {
  title: "Painel financeiro",
  description:
    "Acompanhe ganhos, receita mensal e transações na plataforma.",
};

export default function FinanceiroInfluenciadorPage() {
  return <PainelFinanceiro />;
}
