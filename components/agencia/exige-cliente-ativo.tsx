"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAgencia } from "@/lib/contexts/agencia-context";

type ExigeClienteAtivoProps = {
  children: ReactNode;
  /** Se true, redireciona quando o cliente ativo é só leitura. */
  exigeEdicao?: boolean;
};

export function ExigeClienteAtivo({
  children,
  exigeEdicao = false,
}: ExigeClienteAtivoProps) {
  const router = useRouter();
  const { empresaAtiva, podeEditarClienteAtivo } = useAgencia();

  useEffect(() => {
    if (!empresaAtiva) {
      toast.error("Selecione um cliente para continuar.");
      router.replace("/agencia/dashboard");
      return;
    }
    if (exigeEdicao && !podeEditarClienteAtivo) {
      toast.error("Este cliente está em modo somente leitura.");
      router.replace(`/agencia/clientes/${empresaAtiva.id}`);
    }
  }, [empresaAtiva, exigeEdicao, podeEditarClienteAtivo, router]);

  if (!empresaAtiva) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
        Redirecionando…
      </div>
    );
  }

  if (exigeEdicao && !podeEditarClienteAtivo) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
        Redirecionando…
      </div>
    );
  }

  return <>{children}</>;
}
