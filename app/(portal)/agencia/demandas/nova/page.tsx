import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ExigeClienteAtivo } from "@/components/agencia/exige-cliente-ativo";
import { FormularioNovaDemanda } from "@/components/empresa/demandas/formulario-nova-demanda";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Nova campanha | Agência",
  description: "Publique uma campanha em nome do cliente ativo.",
};

export default function AgenciaNovaDemandaPage() {
  return (
    <ExigeClienteAtivo exigeEdicao>
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
        <header className="space-y-4">
          <Link
            href="/agencia/demandas"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 w-fit",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Voltar para campanhas do cliente
          </Link>
          <div>
            <p className="text-primary text-sm font-medium">Nova campanha</p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Publicar demanda
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              A campanha será publicada em nome do cliente ativo. Quem assina o
              contrato continua sendo a empresa-cliente.
            </p>
          </div>
        </header>

        <FormularioNovaDemanda basePath="/agencia" />
      </div>
    </ExigeClienteAtivo>
  );
}
