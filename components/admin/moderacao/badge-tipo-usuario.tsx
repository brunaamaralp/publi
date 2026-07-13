import { Badge } from "@/components/ui/badge";
import type { Usuario } from "@/lib/types/usuario";
import { cn } from "@/lib/utils";

const TIPO_STYLES: Record<
  Usuario["tipo"],
  { label: string; className: string }
> = {
  influenciador: {
    label: "Influenciador",
    className:
      "border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-200",
  },
  empresa: {
    label: "Empresa",
    className:
      "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200",
  },
  agencia: {
    label: "Agência",
    className:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  admin: {
    label: "Admin",
    className:
      "border-zinc-300 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
  },
};

type BadgeTipoUsuarioProps = {
  tipo: Usuario["tipo"];
  className?: string;
};

export function BadgeTipoUsuario({ tipo, className }: BadgeTipoUsuarioProps) {
  const config = TIPO_STYLES[tipo];
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-5 rounded px-1.5 text-[10px] font-semibold uppercase tracking-wide",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
