import {
  BarChart3,
  GraduationCap,
  Handshake,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";

const RECURSOS = [
  {
    titulo: "Compatibilidade visual",
    descricao:
      "Veja em segundos o quanto um criador combina com sua campanha — audiência, formato e orçamento alinhados.",
    icone: Handshake,
    borda: "border-l-verde-neon",
  },
  {
    titulo: "Pagamento seguro e recibo",
    descricao:
      "O valor fica reservado até a entrega ser confirmada. Para quem trabalha com CPF, a plataforma ajuda no cálculo do recibo de pagamento.",
    icone: Shield,
    borda: "border-l-lilas-escuro",
  },
  {
    titulo: "Treinamentos",
    descricao:
      "Trilhas de precificação, negociação e storytelling que elevam o nível do criador e sua visibilidade nas oportunidades.",
    icone: GraduationCap,
    borda: "border-l-lilas-escuro",
  },
  {
    titulo: "Resultados de campanha",
    descricao:
      "Impressões, alcance e engajamento registrados na plataforma — com visão consolidada para agências reportarem ao cliente.",
    icone: BarChart3,
    borda: "border-l-verde-neon",
  },
] as const;

export function HomeFeatures() {
  return (
    <section
      id="recursos"
      className="border-t border-cinza-200 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow-secao">Recursos</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Feito para quem leva{" "}
            <span className="destaque-neon">influência a sério</span>
          </h2>
          <p className="text-texto-secundario mt-4 text-base font-normal leading-relaxed">
            Compatibilidade, pagamento protegido e métricas — com a mesma linguagem visual
            em todo o produto.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {RECURSOS.map((recurso) => (
            <article
              key={recurso.titulo}
              className={cn(
                "card-marketing border-l-[3px] p-6",
                recurso.borda,
              )}
            >
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
