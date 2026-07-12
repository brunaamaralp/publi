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
    <section id="como-funciona" className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-medium">Como funciona</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Do briefing ao resultado, tudo em um só lugar
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Sem planilhas, sem DM perdido e sem incerteza sobre pagamento. O
            fluxo foi desenhado para cada etapa da parceria entre marca e
            criador.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {PASSOS.map((passo) => (
            <li
              key={passo.numero}
              className="rounded-card border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="bg-accent text-primary flex size-10 items-center justify-center rounded-button">
                  <passo.icone className="size-5" aria-hidden />
                </div>
                <span className="font-data text-muted-foreground text-2xl font-semibold">
                  {passo.numero}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{passo.titulo}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {passo.descricao}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
