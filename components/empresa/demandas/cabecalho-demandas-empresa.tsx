"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { SeletorEmpresaCliente } from "@/components/agencia/seletor-empresa-cliente";
import { buttonVariants } from "@/components/ui/button";
import { useEmpresaPublicadora } from "@/lib/empresa/use-empresa-publicadora";
import { cn } from "@/lib/utils";

type CabecalhoDemandasEmpresaProps = {
  titulo: string;
  descricao?: string;
  mostrarCtaNova?: boolean;
  className?: string;
};

export function CabecalhoDemandasEmpresa({
  titulo,
  descricao,
  mostrarCtaNova = true,
  className,
}: CabecalhoDemandasEmpresaProps) {
  const publicador = useEmpresaPublicadora();

  return (
    <header className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-texto-secundario text-sm font-medium">Demandas</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
            {titulo}
          </h1>
          {descricao ? (
            <p className="text-texto-secundario mt-2 max-w-2xl text-sm font-normal">
              {descricao}
            </p>
          ) : null}
        </div>
        {mostrarCtaNova ? (
          <Link
            href="/empresa/demandas/nova"
            className={cn(
              buttonVariants(),
              "shrink-0 border-transparent bg-verde-carvao-escuro text-verde-neon shadow-none hover:bg-verde-carvao hover:text-verde-neon",
            )}
          >
            <Plus className="size-4" aria-hidden />
            Nova demanda
          </Link>
        ) : null}
      </div>

      {publicador.modo === "agencia" ? (
        <div className="flex flex-col gap-3 rounded-card border border-lilas-claro bg-lilas-claro p-4 text-lilas-escuro sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-normal">
            Agência{" "}
            <span className="font-semibold">{publicador.agenciaNome}</span>
          </p>
          <SeletorEmpresaCliente className="text-lilas-escuro [&_span]:text-lilas-escuro/70" />
        </div>
      ) : null}
    </header>
  );
}
