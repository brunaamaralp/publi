/* Depoimentos fictícios — reativar quando houver histórias reais autorizadas:
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
*/

export function HomeDepoimentos() {
  return (
    <section className="border-t border-lilas/20 bg-fundo-pagina py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-secao">Depoimentos</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Quem usa, <span className="destaque-lilas">recomenda</span>
          </h2>
          <p className="text-texto-secundario mt-6 text-base leading-relaxed font-normal">
            Estamos construindo a Publi com os primeiros criadores e marcas
            parceiras — histórias reais chegam aqui em breve.
          </p>
        </div>
      </div>
    </section>
  );
}
