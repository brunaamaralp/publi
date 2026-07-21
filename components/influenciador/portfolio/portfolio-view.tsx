"use client";

import {
  Briefcase,
  ExternalLink,
  MapPin,
  Package,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { BadgeSemantico } from "@/components/ui/badge-semantico";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { creatorExibeNota } from "@/lib/empresa/creator-catalogo-types";
import { formatarFaixaSeguidores } from "@/lib/empresa/busca-creators";
import { nomeNicho } from "@/lib/empresa/orcamento-nicho";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import {
  LABELS_PLATAFORMA_REDE,
  precoPacoteMinimo,
  type PortfolioInfluenciador,
} from "@/lib/influenciador/portfolio-types";
import { cn } from "@/lib/utils";

type PortfolioViewProps = {
  portfolio: PortfolioInfluenciador;
  /** Esconde handles de rede (modo público) — só mostra plataformas. */
  ocultarHandlesRedes?: boolean;
  className?: string;
  acoes?: React.ReactNode;
};

function iniciais(nome: string): string {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function PortfolioView({
  portfolio,
  ocultarHandlesRedes = true,
  className,
  acoes,
}: PortfolioViewProps) {
  const exibeNota = creatorExibeNota({
    totalAvaliacoes: portfolio.totalAvaliacoes,
    notaMediaAvaliacao: portfolio.notaMediaAvaliacao,
  });
  const pacotesAtivos = portfolio.pacotes.filter((p) => p.ativo);
  const precoMin = precoPacoteMinimo(portfolio.pacotes);

  return (
    <div className={cn("space-y-6", className)}>
      <section className="card-marketing overflow-hidden p-0">
        <div
          className="relative h-36 w-full bg-verde-carvao sm:h-44"
          style={
            portfolio.fotoCapaUrl
              ? {
                  backgroundImage: `url(${portfolio.fotoCapaUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  background:
                    "radial-gradient(circle at 30% 40%, color-mix(in srgb, var(--verde-neon) 35%, transparent), transparent 55%), var(--verde-carvao)",
                }
          }
          aria-hidden
        />
        <div className="space-y-5 px-5 pb-6 sm:px-6">
          <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="size-20 border-4 border-white shadow-sm sm:size-24">
                {portfolio.fotoPerfilUrl ? (
                  <AvatarImage src={portfolio.fotoPerfilUrl} alt="" />
                ) : null}
                <AvatarFallback className="bg-verde-carvao-escuro font-display text-xl font-bold text-verde-neon">
                  {iniciais(portfolio.nome || "?")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 pb-1">
                <h1 className="font-display text-2xl font-bold tracking-tight">
                  {portfolio.nome || "Sem nome"}
                </h1>
                {portfolio.handle ? (
                  <p className="text-texto-secundario text-sm font-normal">
                    {portfolio.handle}
                  </p>
                ) : null}
              </div>
            </div>
            {acoes}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {portfolio.nichoIds.map((nichoId) => (
              <BadgeSemantico key={nichoId} variante="info">
                {nomeNicho(nichoId)}
              </BadgeSemantico>
            ))}
            {exibeNota ? (
              <span className="text-texto-secundario inline-flex items-center gap-1 text-sm font-medium">
                <Star className="size-3.5 text-ambar-escuro" aria-hidden />
                {portfolio.notaMediaAvaliacao!.toFixed(1)} (
                {portfolio.totalAvaliacoes})
              </span>
            ) : (
              <BadgeSemantico variante="sucesso">Novo no Publi</BadgeSemantico>
            )}
            {portfolio.cidade || portfolio.estado ? (
              <span className="text-texto-secundario inline-flex items-center gap-1 text-sm">
                <MapPin className="size-3.5" aria-hidden />
                {[portfolio.cidade, portfolio.estado].filter(Boolean).join(", ")}
              </span>
            ) : null}
          </div>

          {portfolio.bio ? (
            <p className="text-sm leading-relaxed font-normal">{portfolio.bio}</p>
          ) : (
            <p className="text-texto-secundario text-sm italic">
              Bio ainda não preenchida.
            </p>
          )}

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-texto-secundario flex items-center gap-1 text-xs">
                <Users className="size-3" aria-hidden />
                Seguidores
              </dt>
              <dd className="font-data mt-1 text-lg font-semibold">
                {formatarFaixaSeguidores(portfolio.seguidores)}
              </dd>
            </div>
            <div>
              <dt className="text-texto-secundario flex items-center gap-1 text-xs">
                <Zap className="size-3" aria-hidden />
                Engajamento
              </dt>
              <dd className="font-data mt-1 text-lg font-semibold">
                {portfolio.engajamentoMedio.toFixed(1)}%
              </dd>
            </div>
            <div>
              <dt className="text-texto-secundario flex items-center gap-1 text-xs">
                <Package className="size-3" aria-hidden />
                Pacotes a partir de
              </dt>
              <dd className="font-data mt-1 text-lg font-semibold">
                {precoMin > 0 ? formatarMoeda(precoMin) : "—"}
              </dd>
            </div>
          </dl>

          {portfolio.redes.length > 0 ? (
            <div>
              <p className="text-texto-secundario mb-2 text-xs font-medium uppercase tracking-wide">
                Presença nas redes
              </p>
              <ul className="flex flex-wrap gap-2">
                {portfolio.redes.map((rede) => (
                  <li key={rede.id}>
                    <BadgeSemantico variante="neutro">
                      {LABELS_PLATAFORMA_REDE[rede.plataforma]}
                      {!ocultarHandlesRedes && rede.handle
                        ? ` · ${rede.handle}`
                        : null}
                    </BadgeSemantico>
                  </li>
                ))}
              </ul>
              {ocultarHandlesRedes ? (
                <p className="text-texto-secundario mt-2 text-xs font-normal">
                  Handles e contatos ficam ocultos até o match e o chat
                  filtrado.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold">Pacotes e serviços</h2>
        {pacotesAtivos.length === 0 ? (
          <p className="text-texto-secundario text-sm">
            Nenhum pacote ativo no momento.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {pacotesAtivos.map((pacote) => (
              <li key={pacote.id} className="card-marketing space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display font-bold">{pacote.nome}</p>
                  <p className="font-data shrink-0 text-sm font-semibold">
                    {formatarMoeda(pacote.preco)}
                  </p>
                </div>
                <p className="text-texto-secundario text-sm leading-relaxed font-normal">
                  {pacote.descricao}
                </p>
                {pacote.itensInclusos.length > 0 ? (
                  <ul className="text-texto-secundario list-inside list-disc text-xs">
                    {pacote.itensInclusos.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-display flex items-center gap-2 text-lg font-bold">
          <Briefcase className="size-5" aria-hidden />
          Trabalhos anteriores
        </h2>
        {portfolio.trabalhos.length === 0 ? (
          <p className="text-texto-secundario text-sm">
            Nenhum trabalho listado ainda.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {portfolio.trabalhos.map((trab) => (
              <li key={trab.id} className="rounded-card border border-cinza-200 bg-white p-4">
                <p className="font-display font-bold">{trab.titulo}</p>
                <p className="text-texto-secundario mt-1 text-sm font-normal">
                  {trab.marca} · {trab.tipoConteudo}
                </p>
                {trab.link ? (
                  <a
                    href={trab.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-verde-acao mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  >
                    Ver referência
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
