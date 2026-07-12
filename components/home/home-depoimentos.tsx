import { Quote } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DEPOIMENTOS = [
  {
    texto:
      "O score de match mudou o jogo. Paro de perder tempo com propostas que não combinam com minha audiência — só abro o que faz sentido.",
    nome: "Ana Beatriz Silva",
    papel: "Influenciadora · Beleza & lifestyle",
    tipo: "influenciador" as const,
  },
  {
    texto:
      "Publicamos a campanha numa tarde e em dois dias tínhamos criadores qualificados negociando. O escrow dá segurança para a marca e para o criador.",
    nome: "Glow Cosmetics",
    papel: "Marca de skincare",
    tipo: "empresa" as const,
  },
  {
    texto:
      "Gerencio quatro clientes sem ficar trocando de login. O dashboard consolidado é exatamente o que a agência precisa para justificar a parceria.",
    nome: "Pulse Media",
    papel: "Agência de influência",
    tipo: "agencia" as const,
  },
] as const;

const TIPO_ESTILO = {
  influenciador: "border-violet-200/80",
  empresa: "border-sky-200/80",
  agencia: "border-amber-200/80",
} as const;

export function HomeDepoimentos() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-primary text-sm font-medium">Depoimentos</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Quem usa, recomenda
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {DEPOIMENTOS.map((item) => (
            <li key={item.nome}>
              <Card
                className={cn(
                  "h-full border-t-4",
                  TIPO_ESTILO[item.tipo],
                )}
              >
                <CardHeader className="pb-2">
                  <Quote
                    className="text-primary size-8 opacity-40"
                    aria-hidden
                  />
                </CardHeader>
                <CardContent>
                  <blockquote className="text-sm leading-relaxed">
                    &ldquo;{item.texto}&rdquo;
                  </blockquote>
                  <footer className="mt-6 border-t pt-4">
                    <p className="font-medium">{item.nome}</p>
                    <CardDescription className="mt-0.5">
                      {item.papel}
                    </CardDescription>
                  </footer>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
