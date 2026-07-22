"use client";

import { Building2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EmpresaClienteVinculada } from "@/lib/contexts/agencia-context";
import {
  formatarUltimoContrato,
  labelStatusContrato,
  obterResumoEmpresaCliente,
} from "@/lib/agencia/dashboard-utils";
import { resolverModoAcesso } from "@/lib/agencia/modo-acesso";
import { cn } from "@/lib/utils";

type ListaEmpresasClientesProps = {
  empresas: EmpresaClienteVinculada[];
  empresaAtivaId: string | null;
  onSelecionar: (empresaId: string) => void;
  /** Destino após selecionar cliente. */
  hrefAposSelecionar?: string;
};

export function ListaEmpresasClientes({
  empresas,
  empresaAtivaId,
  onSelecionar,
  hrefAposSelecionar = "/agencia/clientes",
}: ListaEmpresasClientesProps) {
  const router = useRouter();

  function handleClick(empresaId: string) {
    onSelecionar(empresaId);
    router.push(`${hrefAposSelecionar}/${empresaId}`);
  }

  if (empresas.length === 0) {
    return (
      <div className="text-muted-foreground rounded-card border border-dashed px-6 py-12 text-center text-sm">
        Nenhuma empresa-cliente vinculada. Adicione a primeira para começar.
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {empresas.map((empresa) => {
        const resumo = obterResumoEmpresaCliente(empresa.id);
        const ativa = empresa.id === empresaAtivaId;
        const modo = resolverModoAcesso(empresa);

        return (
          <li key={empresa.id}>
            <Card
              size="sm"
              className={cn(
                "cursor-pointer transition-colors hover:border-primary/40 hover:bg-accent/30",
                ativa && "border-primary ring-1 ring-primary/20",
              )}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => handleClick(empresa.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Building2
                        className="text-muted-foreground mt-0.5 size-4 shrink-0"
                        aria-hidden
                      />
                      <div>
                        <CardTitle className="text-sm leading-snug">
                          {empresa.nomeFantasia ?? empresa.razaoSocial}
                        </CardTitle>
                        <CardDescription className="mt-0.5">
                          {empresa.segmento}
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronRight
                      className="text-muted-foreground size-4 shrink-0"
                      aria-hidden
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {resumo.demandasAtivas}{" "}
                      {resumo.demandasAtivas === 1
                        ? "demanda ativa"
                        : "demandas ativas"}
                    </Badge>
                    <Badge variant="outline">
                      {modo === "edicao" ? "Edição" : "Leitura"}
                    </Badge>
                    {ativa ? (
                      <Badge variant="default">Contexto ativo</Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Último contrato:{" "}
                    <span className="text-foreground">
                      {formatarUltimoContrato(resumo.ultimoContrato)}
                    </span>
                    {resumo.ultimoContrato ? (
                      <span className="text-muted-foreground ml-1">
                        ({labelStatusContrato(resumo.ultimoContrato.status)})
                      </span>
                    ) : null}
                  </p>
                </CardContent>
              </button>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
