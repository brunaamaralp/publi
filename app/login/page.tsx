import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Entrar",
  description: "Acesse sua conta na Publi.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      titulo="Parcerias que começam com confiança"
      subtitulo="Escolha se você é empresa ou influencer e entre para testar as telas de cada perfil."
    >
      <LoginForm />
    </AuthLayout>
  );
}
