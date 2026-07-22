import { redirect } from "next/navigation";

export const metadata = {
  title: "Plano",
  description: "Escolha ou troque seu plano de assinatura.",
};

/** Rota legada — plano vive em Configurações da conta. */
export default function PlanoInfluenciadorPage() {
  redirect("/influenciador/conta/plano");
}
