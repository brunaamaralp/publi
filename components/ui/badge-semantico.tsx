import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BadgeSemanticoVariante =
  | "sucesso"
  | "info"
  | "pendente"
  | "alerta"
  | "neutro";

const ESTILOS: Record<BadgeSemanticoVariante, string> = {
  sucesso:
    "border-verde-carvao-claro bg-verde-carvao-escuro text-verde-neon",
  info: "border-lilas/50 bg-lilas-claro text-lilas-escuro",
  pendente: "border-lilas/50 bg-lilas-claro text-lilas-escuro",
  alerta: "border-ambar/40 bg-ambar-claro text-ambar-escuro",
  neutro: "border-cinza-200 bg-cinza-200/40 text-cinza-500",
};

type BadgeSemanticoProps = {
  variante: BadgeSemanticoVariante;
  children: ReactNode;
  className?: string;
};

export function BadgeSemantico({
  variante,
  children,
  className,
}: BadgeSemanticoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        ESTILOS[variante],
        className,
      )}
    >
      {children}
    </span>
  );
}
