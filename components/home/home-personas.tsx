import Link from "next/link";
import { ArrowRight, Building2, LayoutDashboard, Sparkles } from "lucide-react";

import { BadgeSemantico } from "@/components/ui/badge-semantico";
import { buttonVariants } from "@/components/ui/button";
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
    <section id="para-quem" className="border-t border-cinza-200 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-secao">Para quem</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Uma plataforma, três formas de participar
          </h2>
          <p className="text-texto-secundario mt-4 text-base leading-relaxed font-normal">
            Cada perfil tem ferramentas específicas, mas todos compartilham o
            mesmo ecossistema de confiança e transparência.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PERSONAS.map((persona) => (
            <article
              key={persona.titulo}
              className={cn(
                "card-marketing flex flex-col p-6",
                persona.destaque && "card-marketing-destaque",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="icone-marca size-10">
                  <persona.icone className="size-5" aria-hidden />
                </div>
                {persona.destaque ? (
                  <BadgeSemantico variante="sucesso">Mais popular</BadgeSemantico>
                ) : null}
              </div>
              <h3 className="font-display mt-4 text-xl font-bold">
                {persona.titulo}
              </h3>
              <p className="text-texto-secundario mt-2 text-sm leading-relaxed font-normal">
                {persona.descricao}
              </p>
              <ul className="mt-6 space-y-2 text-sm">
                {persona.beneficios.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span
                      className="bg-verde-neon mt-1.5 size-1.5 shrink-0 rounded-full"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2 pt-6">
                <Link
                  href={persona.href}
                  className={cn(
                    buttonVariants({
                      variant: persona.destaque ? "cta" : "outline",
                    }),
                  )}
                >
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
