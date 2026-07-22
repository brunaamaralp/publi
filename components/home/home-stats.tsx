const STATS = [
  { label: "Criadores em análise nesta fase de lançamento", destaque: true },
  { label: "Pagamento retido até aprovação, sempre", destaque: false },
  {
    label: "Resposta em até 48h para a primeira sugestão de match",
    destaque: false,
  },
] as const;

/* Números fictícios — reativar quando houver dados reais:
const STATS_MOCK = [
  { valor: "2.400+", label: "criadores verificados", destaque: true },
  { valor: "R$ 12M+", label: "em campanhas negociadas", destaque: false },
  { valor: "94%", label: "satisfação nas parcerias", destaque: false },
  { valor: "< 48h", label: "para primeira sugestão", destaque: false },
] as const;
*/

export function HomeStats() {
  return (
    <section className="faixa-marcas border-y py-10 sm:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className={
              stat.destaque
                ? "stat-landing border-l-[3px] border-l-verde-neon text-center lg:text-left"
                : "stat-landing text-center lg:text-left"
            }
          >
            <p
              className={
                stat.destaque
                  ? "font-display text-base font-bold leading-snug text-verde-neon sm:text-lg"
                  : "font-display text-lilas-escuro text-base font-bold leading-snug sm:text-lg"
              }
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
