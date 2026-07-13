"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();
  const [redirecionando, setRedirecionando] = useState(false);

  useEffect(() => {
    if (!isLoading && !usuario) {
      setRedirecionando(true);
      router.replace("/login");
    }
  }, [isLoading, usuario, router]);

  if (isLoading) {
    return (
      <div className="text-texto-secundario flex min-h-screen items-center justify-center bg-fundo-pagina text-sm font-normal">
        Verificando sessão…
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-texto-secundario flex min-h-screen flex-col items-center justify-center gap-2 bg-fundo-pagina text-sm font-normal">
        <p>{redirecionando ? "Redirecionando para o login…" : "Sessão não encontrada."}</p>
        <a href="/login" className="text-lilas-escuro text-xs font-medium hover:text-verde-neon hover:underline">
          Ir para o login
        </a>
      </div>
    );
  }

  return children;
}
