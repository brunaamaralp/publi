import {
  BarChart3,
  GraduationCap,
  Handshake,
  Shield,
} from "lucide-react";

const RECURSOS = [
  {
    titulo: "Match Ring",
    descricao:
      "Visualize em segundos o quanto um criador combina com sua campanha — audiência, formato e orçamento alinhados.",
    icone: Handshake,
  },
  {
    titulo: "Escrow e RPA",
    descricao:
      "Valor retido até a entrega ser confirmada. Para influenciadores CPF, cálculo assistido de RPA integrado ao fluxo.",
    icone: Shield,
  },
  {
    titulo: "Treinamentos",
    descricao:
      "Trilhas de precificação, negociação e storytelling que elevam o nível do criador e sua visibilidade no match.",
    icone: GraduationCap,
  },
  {
    titulo: "Resultados de campanha",
    descricao:
      "Impressões, alcance e engajamento registrados na plataforma — com visão consolidada para agências reportarem ao cliente.",
    icone: BarChart3,
  },
] as const;

export function HomeFeatures() {
  return (
    <section id="recursos" className="border-t bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-medium">Recursos</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Feito para quem leva influência a sério
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {RECURSOS.map((recurso) => (
            <article
              key={recurso.titulo}
              className="banner-informativo rounded-card p-6"
            >
              <recurso.icone
                className="text-primary size-5"
                aria-hidden
              />
              <h3 className="mt-4 text-lg font-semibold">{recurso.titulo}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {recurso.descricao}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
