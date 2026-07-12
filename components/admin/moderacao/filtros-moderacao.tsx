"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  FiltroDataCadastro,
  FiltroTipoUsuario,
} from "@/lib/moderacao/moderacao-utils";

type FiltrosModeracaoProps = {
  tipo: FiltroTipoUsuario;
  data: FiltroDataCadastro;
  total: number;
  onTipoChange: (tipo: FiltroTipoUsuario) => void;
  onDataChange: (data: FiltroDataCadastro) => void;
};

export function FiltrosModeracao({
  tipo,
  data,
  total,
  onTipoChange,
  onDataChange,
}: FiltrosModeracaoProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 border-b bg-muted/30 px-4 py-2.5">
      <div className="min-w-[140px]">
        <label className="text-muted-foreground mb-1 block text-[10px] font-medium uppercase tracking-wide">
          Tipo
        </label>
        <Select
          value={tipo}
          onValueChange={(v) => onTipoChange(v as FiltroTipoUsuario)}
        >
          <SelectTrigger size="sm" className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="influenciador">Influenciador</SelectItem>
            <SelectItem value="empresa">Empresa</SelectItem>
            <SelectItem value="agencia">Agência</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[140px]">
        <label className="text-muted-foreground mb-1 block text-[10px] font-medium uppercase tracking-wide">
          Cadastro
        </label>
        <Select
          value={data}
          onValueChange={(v) => onDataChange(v as FiltroDataCadastro)}
        >
          <SelectTrigger size="sm" className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Qualquer data</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-muted-foreground ml-auto text-xs">
        <span className="font-data text-foreground font-semibold">{total}</span>{" "}
        pendente{total === 1 ? "" : "s"}
      </p>
    </div>
  );
}
