import { FileCheck, Search, Wallet } from "lucide-react";

const PASSOS = [
  {
    numero: "01",
    titulo: "Cadastro e verificação",
    descricao:
      "Influenciadores e empresas passam por análise antes de ficarem visíveis. Perfis confiáveis, menos ruído.",
    icone: Search,
  },
  {
    numero: "02",
    titulo: "Match inteligente",
    descricao:
      "Demandas são cruzadas com audiência, nicho e engajamento. Você vê o score de compatibilidade antes de investir tempo.",
    icone: FileCheck,
  },
  {
    numero: "03",
    titulo: "Negociação e pagamento seguro",
    descricao:
      "Chat na plataforma, contrato digital e valor retido em escrow até a entrega ser confirmada.",
    icone: Wallet,
  },
] as const;

export function HomeComoFunciona() {
  return (
    <section id="como-funciona" className="border-t border-cinza-200 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow-secao">Como funciona</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Do briefing ao resultado,{" "}
            <span className="destaque-neon">tudo em um só lugar</span>
          </h2>
          <p className="text-texto-secundario mt-4 text-base leading-relaxed font-normal">
            Sem planilhas, sem DM perdido e sem incerteza sobre pagamento. O
            fluxo foi desenhado para cada etapa da parceria entre marca e
            criador.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {PASSOS.map((passo) => (
            <li key={passo.numero} className="card-marketing p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="icone-marca size-10">
                  <passo.icone className="size-5" aria-hidden />
                </div>
                <span className="font-data text-texto-secundario text-2xl font-semibold">
                  {passo.numero}
                </span>
              </div>
              <h3 className="font-display mt-4 text-lg font-bold">
                {passo.titulo}
              </h3>
              <p className="text-texto-secundario mt-2 text-sm leading-relaxed font-normal">
                {passo.descricao}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
