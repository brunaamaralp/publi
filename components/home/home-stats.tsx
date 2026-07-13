const STATS = [
  { valor: "2.400+", label: "criadores verificados", destaque: true },
  { valor: "R$ 12M+", label: "em campanhas negociadas", destaque: false },
  { valor: "94%", label: "satisfação nas parcerias", destaque: false },
  { valor: "< 48h", label: "para primeira sugestão", destaque: false },
] as const;

export function HomeStats() {
  return (
    <section className="faixa-marcas border-y py-10 sm:py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:gap-6">
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
                  ? "font-display text-2xl font-bold tabular-nums text-verde-neon sm:text-3xl"
                  : "font-display text-lilas-escuro text-2xl font-bold tabular-nums sm:text-3xl"
              }
            >
              {stat.valor}
            </p>
            <p className="text-texto-secundario mt-1 text-sm font-normal">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
