"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { SeletorEmpresaCliente } from "@/components/agencia/seletor-empresa-cliente";
import { buttonVariants } from "@/components/ui/button";
import { NAV_GRUPOS, SESSAO_MOCK } from "@/lib/app/nav-items";
import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  const pathname = usePathname();
  const agenciaCtx = useAgenciaOpcional();

  function isActive(href: string) {
    if (href === "/inicio") return pathname === "/inicio";
    return pathname === href;
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-verde-carvao-claro/50 bg-verde-carvao text-white",
        className,
      )}
    >
      <div className="border-b border-white/10 p-4">
        <Link
          href="/inicio"
          onClick={onNavigate}
          className="font-display text-lg font-semibold"
        >
          Publi
        </Link>
        <p className="mt-3 text-xs uppercase tracking-wide text-zinc-500">
          Conta ativa
        </p>
        <p className="mt-1 truncate text-sm font-medium">{SESSAO_MOCK.nome}</p>
        <p className="truncate text-xs text-zinc-500">{SESSAO_MOCK.email}</p>
      </div>

      {agenciaCtx?.agencia ? (
        <div className="border-b border-white/10 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-wide text-zinc-500">
            Contexto agência
          </p>
          <SeletorEmpresaCliente className="text-white [&_span]:text-zinc-400" />
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto p-3" aria-label="App">
        {NAV_GRUPOS.map((grupo) => (
          <div key={grupo.titulo} className="mb-5 last:mb-0">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              {grupo.titulo}
            </p>
            <ul className="space-y-0.5">
              {grupo.itens.map((item) => {
                const ativo = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-button border-l-2 px-2.5 py-2 text-sm transition-colors",
                        ativo
                          ? "border-verde-neon bg-white/5 text-white"
                          : "border-transparent text-zinc-300 hover:bg-white/10 hover:text-white",
                      )}
                      aria-current={ativo ? "page" : undefined}
                    >
                      <item.icone className="size-4 shrink-0" aria-hidden />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-start text-zinc-400 hover:bg-white/10 hover:text-white",
          )}
        >
          <LogOut className="size-4" aria-hidden />
          Sair para o site
        </Link>
      </div>
    </aside>
  );
}
