"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { SeletorEmpresaCliente } from "@/components/agencia/seletor-empresa-cliente";
import { buttonVariants } from "@/components/ui/button";
import { navGruposParaUsuario } from "@/lib/app/nav-items";
import { useAuth } from "@/lib/auth-context";
import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { cn } from "@/lib/utils";

const LABEL_TIPO: Record<string, string> = {
  influenciador: "Influenciador",
  empresa: "Empresa",
  agencia: "Agência",
};

const LABEL_STATUS: Record<string, string> = {
  ativo: "Ativo",
  suspenso: "Suspenso",
};

type AppSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { usuario, logout } = useAuth();
  const agenciaCtx = useAgenciaOpcional();

  const grupos = usuario ? navGruposParaUsuario(usuario.tipo) : [];

  function isActive(href: string) {
    if (href === "/inicio") return pathname === "/inicio";
    return pathname === href;
  }

  function handleLogout() {
    logout();
    onNavigate?.();
    router.push("/login");
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
        {usuario ? (
          <>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              {LABEL_TIPO[usuario.tipo] ?? usuario.tipo}
              <span className="text-zinc-600"> · </span>
              <span className="text-zinc-400">
                {LABEL_STATUS[usuario.status] ?? usuario.status}
              </span>
            </p>
            <p className="mt-2 truncate text-sm font-medium leading-snug">
              {usuario.email}
            </p>
          </>
        ) : null}
      </div>

      {usuario?.tipo === "agencia" && agenciaCtx?.agencia ? (
        <div className="border-b border-white/10 p-4">
          <SeletorEmpresaCliente tema="sidebar" />
        </div>
      ) : null}

      <nav className="flex-1 overflow-y-auto p-3" aria-label="App">
        {grupos.map((grupo) => (
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
                        "flex items-center gap-2.5 rounded-button border-l-[3px] py-2 pr-2.5 pl-2 text-sm font-normal transition-colors",
                        ativo
                          ? "border-l-verde-neon bg-white/[0.04] font-medium text-white"
                          : "border-l-transparent text-zinc-400 hover:bg-white/[0.06] hover:text-white",
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

      <div className="space-y-1 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-start text-zinc-400 hover:bg-white/10 hover:text-white",
          )}
        >
          <LogOut className="size-4" aria-hidden />
          Sair
        </button>
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-start text-zinc-500 hover:bg-white/10 hover:text-white",
          )}
        >
          Site institucional
        </Link>
      </div>
    </aside>
  );
}
