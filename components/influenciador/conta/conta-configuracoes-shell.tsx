"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const SECOES = [
  {
    href: "/influenciador/conta",
    label: "Dados da conta",
    exact: true,
  },
  {
    href: "/influenciador/conta/plano",
    label: "Plano",
    exact: false,
  },
] as const;

type ContaConfiguracoesShellProps = {
  children: React.ReactNode;
};

export function ContaConfiguracoesShell({
  children,
}: ContaConfiguracoesShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 sm:px-6 sm:py-10">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-medium">Conta</p>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Configurações
        </h1>
        <p className="text-texto-secundario max-w-xl text-sm font-normal leading-relaxed">
          Gerencie os dados da sua conta e a assinatura do plano.
        </p>
      </header>

      <nav
        className="flex gap-1 border-b border-cinza-200"
        aria-label="Seções de configurações"
      >
        {SECOES.map((secao) => {
          const ativo = secao.exact
            ? pathname === secao.href
            : pathname === secao.href ||
              pathname.startsWith(`${secao.href}/`);
          return (
            <Link
              key={secao.href}
              href={secao.href}
              className={cn(
                "-mb-px border-b-2 px-3 py-2.5 text-sm transition-colors",
                ativo
                  ? "border-verde-neon text-foreground font-medium"
                  : "text-texto-secundario border-transparent font-normal hover:text-foreground",
              )}
              aria-current={ativo ? "page" : undefined}
            >
              {secao.label}
            </Link>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
