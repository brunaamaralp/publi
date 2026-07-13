import { cn } from "@/lib/utils";

type CardMetricaValorProps = {
  rotulo: string;
  valor: string;
  /** `inline` para cards aninhados em seções lilás; `destaque` para uso isolado */
  variante?: "inline" | "destaque";
  className?: string;
};

export function CardMetricaValor({
  rotulo,
  valor,
  variante = "destaque",
  className,
}: CardMetricaValorProps) {
  return (
    <div
      className={cn(
        variante === "destaque"
          ? "card-metrica-perfil space-y-1 p-3 ring-0"
          : "secao-editavel space-y-1 p-3 ring-0",
        className,
      )}
    >
      <p
        className={cn(
          "text-xs font-medium",
          variante === "destaque" ? "opacity-75" : "text-texto-secundario",
        )}
      >
        {rotulo}
      </p>
      <p
        className={cn(
          "font-display text-xl font-bold",
          variante === "inline" && "text-lilas-escuro",
        )}
      >
        <span className="font-data">{valor}</span>
      </p>
    </div>
  );
}
