import Link from "next/link";
import { Mail } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Recuperar senha",
  description: "Instruções para redefinir sua senha.",
};

export default function EsqueciSenhaPage() {
  return (
    <AuthLayout
      titulo="Recuperação de senha"
      subtitulo="Em produção, enviaríamos um link seguro para o seu e-mail."
    >
      <div className="space-y-6 text-center">
        <div className="bg-accent text-primary mx-auto flex size-14 items-center justify-center rounded-card">
          <Mail className="size-6" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-xl font-semibold lg:hidden">
            Verifique seu e-mail
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Se existir uma conta com o endereço informado, você receberá
            instruções para redefinir a senha em alguns minutos.
          </p>
          <p className="text-muted-foreground text-xs">
            Esta é uma tela estática de simulação — nenhum e-mail é enviado
            nesta fase.
          </p>
        </div>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          Voltar ao login
        </Link>
      </div>
    </AuthLayout>
  );
}
