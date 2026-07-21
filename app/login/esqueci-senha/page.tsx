import { AuthLayout } from "@/components/auth/auth-layout";
import { EsqueciSenhaForm } from "@/components/auth/esqueci-senha-form";

export const metadata = {
  title: "Recuperar senha",
  description: "Instruções para redefinir sua senha.",
};

export default function EsqueciSenhaPage() {
  return (
    <AuthLayout
      titulo="Recuperação de senha"
      subtitulo="Informe seu e-mail e enviaremos um link seguro para redefinir sua senha."
    >
      <EsqueciSenhaForm />
    </AuthLayout>
  );
}
