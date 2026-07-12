import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FormularioNovaDemanda } from "@/components/empresa/demandas/formulario-nova-demanda";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Nova demanda",
  description: "Publique uma nova campanha para influenciadores.",
};

export default function NovaDemandaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-4">
        <Link
          href="/empresa/demandas"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar para minhas demandas
        </Link>
        <div>
          <p className="text-primary text-sm font-medium">Nova campanha</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
            Publicar demanda
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Preencha os detalhes da campanha. Após publicar, ela ficará
            disponível para match com influenciadores compatíveis.
          </p>
        </div>
      </header>

      <FormularioNovaDemanda />
    </div>
  );
}
