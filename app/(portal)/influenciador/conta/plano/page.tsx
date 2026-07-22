import { PlanoInfluenciadorFlow } from "@/components/influenciador/plano/plano-influenciador-flow";

export const metadata = {
  title: "Plano",
  description: "Escolha ou troque seu plano de assinatura.",
};

export default function ContaPlanoPage() {
  return <PlanoInfluenciadorFlow embutido />;
}
