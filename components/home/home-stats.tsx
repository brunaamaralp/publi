const STATS = [
  { valor: "2.400+", label: "criadores verificados" },
  { valor: "R$ 12M+", label: "em campanhas negociadas" },
  { valor: "94%", label: "satisfação nas parcerias" },
  { valor: "< 48h", label: "para primeiro match" },
] as const;

export function HomeStats() {
  return (
    <section className="border-b bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="font-data text-2xl font-semibold tracking-tight sm:text-3xl">
              {stat.valor}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
