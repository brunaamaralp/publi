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
      subtitulo="Entre para acessar demandas, negociações, contratos e resultados — tudo em um só lugar."
    >
      <LoginForm />
    </AuthLayout>
  );
}
