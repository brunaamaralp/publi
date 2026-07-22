import Link from "next/link";
import { Eye } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BannerAcessoLeituraProps = {
  nomeCliente?: string | null;
  className?: string;
};

export function BannerAcessoLeitura({
  nomeCliente,
  className,
}: BannerAcessoLeituraProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col gap-3 rounded-card border border-amber-600/25 bg-amber-50 px-4 py-3 text-amber-950 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-2 text-sm">
        <Eye className="mt-0.5 size-4 shrink-0 text-amber-700" aria-hidden />
        <p>
          Acesso somente leitura
          {nomeCliente ? (
            <>
              {" "}
              em <span className="font-medium">{nomeCliente}</span>
            </>
          ) : null}
          . Este cliente foi vinculado à plataforma — a agência não pode criar
          ou editar campanhas em nome dele.
        </p>
      </div>
      <Link
        href="/agencia/clientes"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "shrink-0 border-amber-700/30 bg-white text-amber-950 hover:bg-amber-100",
        )}
      >
        Gerenciar clientes
      </Link>
    </div>
  );
}
