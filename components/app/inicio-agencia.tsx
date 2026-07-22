"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Início da agência redireciona para o hub consolidado. */
export function InicioAgencia() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/agencia/dashboard");
  }, [router]);

  return (
    <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
      Abrindo painel da agência…
    </div>
  );
}
