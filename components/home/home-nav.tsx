import Link from "next/link";

import { PubliLogo } from "@/components/brand/publi-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#para-quem", label: "Para quem" },
  { href: "#recursos", label: "Recursos" },
] as const;

export function HomeNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-cinza-200 bg-fundo-pagina/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="rounded-button outline-none focus-visible:ring-2 focus-visible:ring-lilas/50">
          <PubliLogo size="sm" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-texto-secundario text-sm font-normal transition-colors hover:text-lilas-escuro"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-texto-secundario hover:bg-lilas-claro/80 hover:text-lilas-escuro",
            )}
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className={cn(buttonVariants({ variant: "cta", size: "sm" }))}
          >
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}
