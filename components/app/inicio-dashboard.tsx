import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  GraduationCap,
  Wallet,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SESSAO_MOCK } from "@/lib/app/nav-items";
import { cn } from "@/lib/utils";

const ATALHOS = [
  {
    href: "/influenciador/demandas",
    titulo: "Ver demandas",
    descricao: "12 oportunidades com match acima de 70%",
    icone: FileText,
    primario: true,
  },
  {
    href: "/influenciador/treinamentos",
    titulo: "Continuar treinamento",
    descricao: "1 trilha em andamento · nível Iniciante",
    icone: GraduationCap,
  },
  {
    href: "/influenciador/financeiro",
    titulo: "Painel financeiro",
    descricao: "R$ 4.200 previstos neste mês",
    icone: Wallet,
  },
  {
    href: "/influenciador/resultados",
    titulo: "Registrar resultados",
    descricao: "2 campanhas aguardando métricas",
    icone: BarChart3,
  },
] as const;

const RESUMO = [
  { label: "Matches novos", valor: "5" },
  { label: "Campanhas ativas", valor: "3" },
  { label: "XP de treinamento", valor: "240" },
  { label: "Nota média", valor: "4,8" },
] as const;

export function InicioDashboard() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-1">
        <p className="text-primary text-sm font-medium">Início</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Olá, {SESSAO_MOCK.nome.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Plano {SESSAO_MOCK.plano} · use o menu ao lado para navegar pela
          plataforma.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {RESUMO.map((item) => (
          <Card key={item.label} size="sm">
            <CardContent className="pt-4">
              <p className="text-muted-foreground text-xs">{item.label}</p>
              <p className="font-data mt-1 text-2xl font-semibold">
                {item.valor}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Atalhos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ATALHOS.map((atalho) => (
            <Card
              key={atalho.href}
              className={cn(
                "primario" in atalho &&
                  atalho.primario &&
                  "border-primary/30 ring-1 ring-primary/10",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="bg-accent text-primary flex size-9 items-center justify-center rounded-button">
                    <atalho.icone className="size-4" aria-hidden />
                  </div>
                </div>
                <CardTitle className="text-base">{atalho.titulo}</CardTitle>
                <CardDescription>{atalho.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={atalho.href}
                  className={cn(
                    buttonVariants({
                      variant:
                        "primario" in atalho && atalho.primario
                          ? "default"
                          : "outline",
                      size: "sm",
                    }),
                  )}
                >
                  Acessar
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="banner-informativo border">
        <CardHeader>
          <CardTitle className="text-base">Explorar como outro perfil</CardTitle>
          <CardDescription>
            Nesta fase não há login real — o menu lista rotas de influenciador,
            empresa, agência e admin para você testar os fluxos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link
            href="/empresa/demandas"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Visão empresa
          </Link>
          <Link
            href="/agencia/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Visão agência
          </Link>
          <Link
            href="/admin/moderacao"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Moderação
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
