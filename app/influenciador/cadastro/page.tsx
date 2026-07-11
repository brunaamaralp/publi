import { CadastroWizard } from "@/components/influenciador/cadastro/cadastro-wizard";

export const metadata = {
  title: "Cadastro de influenciador",
  description:
    "Complete seu perfil profissional para receber oportunidades de campanhas.",
};

export default function CadastroInfluenciadorPage() {
  return <CadastroWizard />;
}
