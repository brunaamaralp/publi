import { Quote } from "lucide-react";

import { cn } from "@/lib/utils";

const DEPOIMENTOS = [
  {
    texto:
      "O score de match mudou o jogo. Paro de perder tempo com propostas que não combinam com minha audiência — só abro o que faz sentido.",
    nome: "Ana Beatriz Silva",
    papel: "Influenciadora · Beleza & lifestyle",
    borda: "border-l-verde-neon",
  },
  {
    texto:
      "Publicamos a campanha numa tarde e em dois dias tínhamos criadores qualificados negociando. O escrow dá segurança para a marca e para o criador.",
    nome: "Glow Cosmetics",
    papel: "Marca de skincare",
    borda: "border-l-lilas",
  },
  {
    texto:
      "Gerencio quatro clientes sem ficar trocando de login. O dashboard consolidado é exatamente o que a agência precisa para justificar a parceria.",
    nome: "Pulse Media",
    papel: "Agência de influência",
    borda: "border-l-lilas",
  },
] as const;

export function HomeDepoimentos() {
  return (
    <section className="border-t border-cinza-200 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-secao">Depoimentos</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Quem usa, recomenda
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {DEPOIMENTOS.map((item) => (
            <li key={item.nome}>
              <blockquote
                className={cn(
                  "card-marketing flex h-full flex-col p-6",
                  "border-l-[3px]",
                  item.borda,
                )}
              >
                <Quote
                  className="text-lilas-escuro/40 size-8"
                  aria-hidden
                />
                <p className="mt-4 flex-1 text-sm leading-relaxed font-normal">
                  &ldquo;{item.texto}&rdquo;
                </p>
                <footer className="mt-6 border-t border-cinza-200 pt-4">
                  <p className="font-medium">{item.nome}</p>
                  <p className="text-texto-secundario mt-0.5 text-sm font-normal">
                    {item.papel}
                  </p>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
