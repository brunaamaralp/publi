import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Building2,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RotaHub = {
  href: string;
  label: string;
  descricao?: string;
};

type SecaoHub = {
  titulo: string;
  icone: ComponentType<{ className?: string }>;
  rotas: RotaHub[];
};

const SECOES: SecaoHub[] = [
  {
    titulo: "Influenciador",
    icone: Sparkles,
    rotas: [
      { href: "/influenciador/demandas", label: "Feed de demandas" },
      { href: "/influenciador/cadastro", label: "Cadastro" },
      { href: "/influenciador/treinamentos", label: "Treinamentos" },
      { href: "/influenciador/financeiro", label: "Painel financeiro" },
      { href: "/influenciador/resultados", label: "Resultados de campanha" },
    ],
  },
  {
    titulo: "Empresa",
    icone: Building2,
    rotas: [
      { href: "/empresa/demandas", label: "Minhas demandas" },
      { href: "/empresa/demandas/nova", label: "Nova demanda" },
      { href: "/empresa/cadastro", label: "Cadastro" },
      { href: "/resultados/ctr-cpf-001", label: "Resultados (exemplo)" },
    ],
  },
  {
    titulo: "Agência",
    icone: LayoutDashboard,
    rotas: [
      { href: "/agencia/dashboard", label: "Dashboard consolidado" },
      { href: "/agencia/cadastro", label: "Cadastro" },
    ],
  },
  {
    titulo: "Admin",
    icone: ShieldCheck,
    rotas: [
      { href: "/admin/moderacao", label: "Moderação de cadastros" },
    ],
  },
  {
    titulo: "Fluxos de exemplo",
    icone: UserRound,
    rotas: [
      {
        href: "/negociacao/match-001",
        label: "Negociação",
        descricao: "Paywall → chat → contrato",
      },
      {
        href: "/contrato/ctr-cpf-001/pagamento",
        label: "Pagamento (CPF / RPA)",
        descricao: "Escrow e liberação",
      },
      {
        href: "/contrato/ctr-cnpj-001/pagamento",
        label: "Pagamento (CNPJ)",
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-[var(--cinza-900)] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-[var(--verde-neon)] text-xs font-semibold uppercase tracking-widest">
            Protótipo
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Marketplace de influenciadores
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Conecta criadores, marcas e agências. Use o mapa abaixo para navegar
            pelas telas implementadas — cada rota é um fluxo mockado com dados
            locais.
          </p>
          <Link
            href="/influenciador/demandas"
            className={cn(buttonVariants(), "mt-6")}
          >
            Começar pelo feed
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {SECOES.map((secao) => (
            <Card key={secao.titulo}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <secao.icone className="text-primary size-4" aria-hidden />
                  {secao.titulo}
                </CardTitle>
                <CardDescription>
                  {secao.rotas.length} rota{secao.rotas.length === 1 ? "" : "s"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {secao.rotas.map((rota) => (
                    <li key={rota.href}>
                      <Link
                        href={rota.href}
                        className="hover:bg-accent flex items-center justify-between gap-2 rounded-button px-2 py-2 text-sm transition-colors"
                      >
                        <span>
                          <span className="font-medium">{rota.label}</span>
                          {rota.descricao ? (
                            <span className="text-muted-foreground mt-0.5 block text-xs">
                              {rota.descricao}
                            </span>
                          ) : null}
                        </span>
                        <ArrowRight
                          className="text-muted-foreground size-3.5 shrink-0"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Dados persistidos no navegador (localStorage). Sem backend nesta fase.
        </p>
      </main>
    </div>
  );
}
