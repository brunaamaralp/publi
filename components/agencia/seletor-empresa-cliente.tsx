"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgencia } from "@/lib/contexts/agencia-context";
import { resolverModoAcesso } from "@/lib/agencia/modo-acesso";
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
          sidebar
            ? "text-[var(--app-sidebar-muted,#B9C2BC)]"
            : "text-texto-secundario",
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
              "border-white/15 bg-verde-carvao-claro/50 text-[var(--app-sidebar-fg,#F7F6F2)] hover:bg-white/[0.04] data-placeholder:text-[var(--app-sidebar-muted,#B9C2BC)] [&_svg]:text-[var(--app-sidebar-muted,#B9C2BC)]",
          )}
          aria-label="Selecionar empresa-cliente"
        >
          <SelectValue placeholder="Selecionar empresa" />
        </SelectTrigger>
        <SelectContent
          className={cn(
            sidebar &&
              "border-white/10 bg-verde-carvao-escuro text-[var(--app-sidebar-fg,#F7F6F2)] ring-white/10",
          )}
        >
          {empresasClientes.map((empresa) => (
            <SelectItem
              key={empresa.id}
              value={empresa.id}
              className={cn(
                sidebar &&
                  "text-[var(--app-sidebar-fg,#F7F6F2)] focus:bg-verde-neon/[0.08] focus:text-[var(--app-sidebar-fg,#F7F6F2)] data-highlighted:bg-verde-neon/[0.08]",
              )}
            >
              <span className="flex flex-col items-start">
                <span>{empresa.nomeFantasia ?? empresa.razaoSocial}</span>
                <span
                  className={cn(
                    "text-xs font-normal",
                    sidebar
                      ? "text-[var(--app-sidebar-muted,#B9C2BC)]"
                      : "text-texto-secundario",
                  )}
                >
                  {resolverModoAcesso(empresa) === "edicao"
                    ? "Edição"
                    : "Somente leitura"}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
