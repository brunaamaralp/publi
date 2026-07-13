"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";

type GuardInfluenciadorProps = {
  children: React.ReactNode;
};

export function GuardInfluenciador({ children }: GuardInfluenciadorProps) {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !usuario) return;
    if (usuario.tipo !== "influenciador") {
      toast.error("Esta área é exclusiva para contas de influenciador.");
      router.replace("/inicio");
    }
  }, [isLoading, usuario, router]);

  if (isLoading) {
    return (
      <div className="text-texto-secundario flex min-h-screen items-center justify-center bg-fundo-pagina text-sm font-normal">
        Carregando…
      </div>
    );
  }

  if (!usuario || usuario.tipo !== "influenciador") {
    return (
      <div className="text-texto-secundario flex min-h-screen items-center justify-center bg-fundo-pagina text-sm font-normal">
        Redirecionando…
      </div>
    );
  }

  return children;
}
