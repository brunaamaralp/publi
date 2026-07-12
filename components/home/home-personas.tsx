import Link from "next/link";
import { ArrowRight, Building2, LayoutDashboard, Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PERSONAS = [
  {
    titulo: "Influenciadores",
    descricao:
      "Receba demandas compatíveis com seu perfil, evolua com trilhas de treinamento e acompanhe sua receita em um painel dedicado.",
    beneficios: [
      "Feed com score de match",
      "Treinamentos e níveis Pro / Elite",
      "Financeiro e resultados de campanha",
    ],
    href: "/cadastro",
    cta: "Criar perfil de criador",
    secundario: { href: "/influenciador/demandas", label: "Ver demandas" },
    icone: Sparkles,
    destaque: true,
  },
  {
    titulo: "Marcas e empresas",
    descricao:
      "Publique campanhas com briefing claro, receba matches qualificados e feche parcerias com contrato e pagamento protegido.",
    beneficios: [
      "Publicação de demandas",
      "Negociação e contrato digital",
      "Escrow e solicitação de resultados",
    ],
    href: "/cadastro",
    cta: "Cadastrar empresa",
    secundario: { href: "/empresa/demandas/nova", label: "Publicar campanha" },
    icone: Building2,
    destaque: false,
  },
  {
    titulo: "Agências",
    descricao:
      "Gerencie várias empresas-clientes com visão consolidada — demandas, contratos e investimento sem trocar de conta o tempo todo.",
    beneficios: [
      "Dashboard multi-cliente",
      "Seletor de contexto por marca",
      "Resultados consolidados por cliente",
    ],
    href: "/cadastro",
    cta: "Cadastrar agência",
    secundario: { href: "/agencia/dashboard", label: "Ver dashboard" },
    icone: LayoutDashboard,
    destaque: false,
  },
] as const;

export function HomePersonas() {
  return (
    <section id="para-quem" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-medium">Para quem</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Uma plataforma, três formas de participar
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Cada perfil tem ferramentas específicas, mas todos compartilham o
            mesmo ecossistema de confiança e transparência.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PERSONAS.map((persona) => (
            <Card
              key={persona.titulo}
              className={cn(
                "flex flex-col",
                persona.destaque && "border-primary/30 ring-1 ring-primary/10",
              )}
            >
              <CardHeader>
                <div className="bg-accent text-primary mb-2 flex size-10 items-center justify-center rounded-button">
                  <persona.icone className="size-5" aria-hidden />
                </div>
                <CardTitle className="text-xl">{persona.titulo}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {persona.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-6">
                <ul className="space-y-2 text-sm">
                  {persona.beneficios.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  <Link href={persona.href} className={cn(buttonVariants())}>
                    {persona.cta}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href={persona.secundario.href}
                    className={cn(buttonVariants({ variant: "ghost" }))}
                  >
                    {persona.secundario.label}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
