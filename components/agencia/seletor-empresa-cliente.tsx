"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgencia } from "@/lib/contexts/agencia-context";
import { cn } from "@/lib/utils";

type SeletorEmpresaClienteProps = {
  className?: string;
};

export function SeletorEmpresaCliente({ className }: SeletorEmpresaClienteProps) {
  const { empresasClientes, empresaAtivaId, setEmpresaAtivaId } = useAgencia();

  if (empresasClientes.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <span className="text-muted-foreground hidden sm:inline">
        Você está gerenciando:
      </span>
      <Select
        value={empresaAtivaId}
        onValueChange={(id) => {
          if (id) setEmpresaAtivaId(id);
        }}
      >
        <SelectTrigger
          className="w-full min-w-[200px] sm:w-auto"
          aria-label="Selecionar empresa-cliente"
        >
          <SelectValue placeholder="Selecionar empresa" />
        </SelectTrigger>
        <SelectContent>
          {empresasClientes.map((empresa) => (
            <SelectItem key={empresa.id} value={empresa.id}>
              <span className="flex flex-col items-start">
                <span>
                  {empresa.nomeFantasia ?? empresa.razaoSocial}
                </span>
                <span className="text-muted-foreground text-xs">
                  {empresa.criadaPelaAgencia
                    ? "Criada por você"
                    : "Somente visualização"}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
