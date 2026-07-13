import { Quote } from "lucide-react";

import { cn } from "@/lib/utils";

const DEPOIMENTOS = [
  {
    texto:
      "O score de compatibilidade mudou o jogo. Paro de perder tempo com propostas que não combinam com minha audiência — só abro o que faz sentido.",
    nome: "Ana Beatriz Silva",
    papel: "Influenciadora · Beleza & lifestyle",
    borda: "border-l-verde-neon",
    fundo: "bg-white",
  },
  {
    texto:
      "Publicamos a campanha numa tarde e em dois dias tínhamos criadores qualificados negociando. O pagamento protegido dá segurança para a marca e para o criador.",
    nome: "Glow Cosmetics",
    papel: "Marca de skincare",
    borda: "border-l-lilas-escuro",
    fundo: "bg-lilas-claro/40",
  },
  {
    texto:
      "Gerencio quatro clientes sem ficar trocando de login. O painel consolidado é exatamente o que a agência precisa para justificar a parceria.",
    nome: "Pulse Media",
    papel: "Agência de influência",
    borda: "border-l-lilas-escuro",
    fundo: "bg-lilas-claro/40",
  },
] as const;

export function HomeDepoimentos() {
  return (
    <section className="border-t border-lilas/20 bg-fundo-pagina py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-secao">Depoimentos</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Quem usa, <span className="destaque-lilas">recomenda</span>
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
                  item.fundo,
                )}
              >
                <Quote
                  className="text-lilas-escuro/35 size-8"
                  aria-hidden
                />
                <p className="mt-4 flex-1 text-sm leading-relaxed font-normal">
                  &ldquo;{item.texto}&rdquo;
                </p>
                <footer className="mt-6 border-t border-lilas/25 pt-4">
                  <p className="font-display font-bold">{item.nome}</p>
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
