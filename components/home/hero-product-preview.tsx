import { BadgeSemantico } from "@/components/ui/badge-semantico";

export function HeroProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-48 rounded-full bg-lilas/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-4 size-40 rounded-full bg-lilas-claro blur-2xl"
        aria-hidden
      />

      <div className="relative space-y-4">
        <article className="card-marketing-destaque p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <BadgeSemantico variante="info" className="mb-3">
                Nova oportunidade
              </BadgeSemantico>
              <h3 className="font-display text-lg font-bold leading-snug">
                Campanha Verão Glow
              </h3>
              <p className="text-texto-secundario mt-1 text-sm font-normal">
                Beleza · Reels + Stories · R$ 8.500
              </p>
            </div>
            <div className="stat-landing shrink-0 border-l-[3px] border-l-verde-neon px-3 py-2 text-center">
              <p className="font-display text-2xl font-bold tabular-nums text-verde-neon">
                92
              </p>
              <p className="text-texto-secundario text-[10px] font-normal uppercase tracking-wide">
                compatível
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full border border-lilas/40 bg-lilas-claro px-2.5 py-0.5 text-xs font-medium text-lilas-escuro">
              Skincare
            </span>
            <span className="rounded-full border border-cinza-200 bg-fundo-pagina px-2.5 py-0.5 text-xs font-normal text-texto-secundario">
              45k seguidores
            </span>
          </div>
        </article>

        <div className="grid grid-cols-2 gap-4 pl-4 sm:pl-8">
          <article className="card-marketing-lilas p-4">
            <p className="text-texto-secundario text-xs font-normal">
              Pagamento
            </p>
            <p className="font-display mt-1 text-sm font-bold">Protegido</p>
            <p className="text-lilas-escuro mt-2 text-xs font-normal">
              Liberado após entrega
            </p>
          </article>
          <article className="card-marketing p-4">
            <p className="text-texto-secundario text-xs font-normal">
              Negociação
            </p>
            <p className="font-display mt-1 text-sm font-bold">Na plataforma</p>
            <p className="text-texto-secundario mt-2 text-xs font-normal">
              Chat + contrato digital
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
