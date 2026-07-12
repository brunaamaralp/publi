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
      <div className="text-muted-foreground flex min-h-screen items-center justify-center text-sm">
        Verificando sessão…
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="text-muted-foreground flex min-h-screen flex-col items-center justify-center gap-2 text-sm">
        <p>{redirecionando ? "Redirecionando para o login…" : "Sessão não encontrada."}</p>
        <a href="/login" className="text-primary text-xs hover:underline">
          Ir para o login
        </a>
      </div>
    );
  }

  return children;
}
