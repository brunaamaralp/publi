"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";
import type { Usuario } from "@/lib/types/usuario";

type GuardTipoProps = {
  permitidos: Usuario["tipo"][];
  children: ReactNode;
  mensagem?: string;
};

export function GuardTipo({
  permitidos,
  children,
  mensagem = "Você não tem permissão para acessar esta área.",
}: GuardTipoProps) {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();

  const autorizado = usuario ? permitidos.includes(usuario.tipo) : false;

  useEffect(() => {
    if (isLoading || !usuario) return;
    if (!autorizado) {
      toast.error(mensagem);
      router.replace("/inicio");
    }
  }, [isLoading, usuario, autorizado, mensagem, router]);

  if (isLoading) {
    return (
      <div className="text-texto-secundario flex min-h-screen items-center justify-center bg-fundo-pagina text-sm font-normal">
        Carregando…
      </div>
    );
  }

  if (!usuario || !autorizado) {
    return (
      <div className="text-texto-secundario flex min-h-screen items-center justify-center bg-fundo-pagina text-sm font-normal">
        Redirecionando…
      </div>
    );
  }

  return children;
}
