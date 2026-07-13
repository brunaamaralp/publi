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
    <section id="recursos" className="border-t border-cinza-200 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow-secao">Recursos</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Feito para quem leva{" "}
            <span className="destaque-neon">influência a sério</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {RECURSOS.map((recurso) => (
            <article key={recurso.titulo} className="card-marketing p-6">
              <div className="icone-marca size-10">
                <recurso.icone className="size-5" aria-hidden />
              </div>
              <h3 className="font-display mt-4 text-lg font-bold">
                {recurso.titulo}
              </h3>
              <p className="text-texto-secundario mt-2 text-sm leading-relaxed font-normal">
                {recurso.descricao}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
