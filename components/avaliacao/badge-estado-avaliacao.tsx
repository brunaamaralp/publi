import { cn } from "@/lib/utils";

type BadgeEstadoAvaliacaoProps = {
  estado: "pendente" | "concluida";
  className?: string;
};

const ESTILOS = {
  pendente: "border-lilas/50 bg-lilas-claro text-lilas-escuro",
  concluida: "border-cinza-200 bg-cinza-200/40 text-cinza-500",
} as const;

const LABELS = {
  pendente: "Avaliação pendente",
  concluida: "Avaliação concluída",
} as const;

export function BadgeEstadoAvaliacao({
  estado,
  className,
}: BadgeEstadoAvaliacaoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-4xl border px-2.5 py-0.5 text-xs font-semibold",
        ESTILOS[estado],
        className,
      )}
    >
      {LABELS[estado]}
    </span>
  );
}
