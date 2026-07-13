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
  /** Fundo escuro da sidebar do portal */
  tema?: "claro" | "sidebar";
};

export function SeletorEmpresaCliente({
  className,
  tema = "claro",
}: SeletorEmpresaClienteProps) {
  const { empresasClientes, empresaAtivaId, setEmpresaAtivaId } = useAgencia();

  if (empresasClientes.length === 0) return null;

  const sidebar = tema === "sidebar";

  return (
    <div className={cn("space-y-2 text-sm", className)}>
      <p
        className={cn(
          "text-xs font-normal",
          sidebar ? "text-zinc-400" : "text-texto-secundario",
        )}
      >
        Você está gerenciando
      </p>
      <Select
        value={empresaAtivaId}
        onValueChange={(id) => {
          if (id) setEmpresaAtivaId(id);
        }}
      >
        <SelectTrigger
          className={cn(
            "w-full",
            sidebar &&
              "border-white/15 bg-verde-carvao-claro/60 text-white hover:bg-white/5 data-placeholder:text-zinc-400 [&_svg]:text-zinc-400",
          )}
          aria-label="Selecionar empresa-cliente"
        >
          <SelectValue placeholder="Selecionar empresa" />
        </SelectTrigger>
        <SelectContent
          className={cn(
            sidebar &&
              "border-white/10 bg-verde-carvao text-white ring-white/10",
          )}
        >
          {empresasClientes.map((empresa) => (
            <SelectItem
              key={empresa.id}
              value={empresa.id}
              className={cn(
                sidebar &&
                  "text-white focus:bg-white/10 focus:text-white data-highlighted:bg-white/10",
              )}
            >
              <span className="flex flex-col items-start">
                <span>{empresa.nomeFantasia ?? empresa.razaoSocial}</span>
                <span
                  className={cn(
                    "text-xs font-normal",
                    sidebar ? "text-zinc-400" : "text-texto-secundario",
                  )}
                >
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
