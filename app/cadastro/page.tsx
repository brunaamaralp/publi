import { AuthLayout } from "@/components/auth/auth-layout";
import { CadastroTipoSelector } from "@/components/auth/cadastro-tipo-selector";

export const metadata = {
  title: "Criar conta",
  description: "Escolha o tipo de conta na Publi.",
};

export default function CadastroPage() {
  return (
    <AuthLayout
      titulo="Comece gratuitamente"
      subtitulo="Selecione como você vai usar a plataforma. Seu perfil passará por verificação antes de ficar visível."
    >
      <CadastroTipoSelector />
    </AuthLayout>
  );
}
