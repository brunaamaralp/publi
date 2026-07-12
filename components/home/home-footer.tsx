import Link from "next/link";

const LINKS = [
  { href: "/influenciador/demandas", label: "Demandas" },
  { href: "/empresa/demandas", label: "Empresas" },
  { href: "/agencia/dashboard", label: "Agências" },
  { href: "/influenciador/treinamentos", label: "Treinamentos" },
] as const;

export function HomeFooter() {
  return (
    <footer className="border-t bg-[var(--cinza-900)] text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg font-semibold text-white">Publi</p>
          <p className="mt-1 max-w-xs text-sm leading-relaxed">
            Marketplace que conecta influenciadores digitais a empresas de
            publicidade.
          </p>
        </div>

        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10 px-4 py-4 sm:px-6">
        <p className="text-muted-foreground mx-auto max-w-6xl text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Publi. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
