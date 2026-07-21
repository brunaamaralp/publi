"use client";

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, CalendarDays, ListChecks } from "lucide-react";

import { BadgeFormatoDemanda } from "@/components/influenciador/demandas/indicador-match";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { MatchRing } from "@/components/ui/match-ring";
import {
  formatarPrazo,
  hrefDetalheDemanda,
  requisitosDemanda,
  tagsDemandaCard,
} from "@/lib/demandas/utils";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import type { DemandaFeedItem } from "@/lib/mock-data/demandas";
import { cn } from "@/lib/utils";

const BRIEFING_PREVIEW = 160;
const HOVER_EXPAND_MS = 180;
const PRESS_HOLD_MS = 450;

type DemandaCardProps = {
  item: DemandaFeedItem;
  onInteresse: (matchId: string) => void;
  onRecusar: (matchId: string) => void;
  modoEnviado?: boolean;
  /** Query string atual do feed (filtros/aba) — preservada na navegação. */
  queryFeed?: string;
};

function iniciaisEmpresa(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");
}

export function DemandaCard({
  item,
  onInteresse,
  onRecusar,
  modoEnviado = false,
  queryFeed = "",
}: DemandaCardProps) {
  const router = useRouter();
  const [expandido, setExpandido] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClick = useRef(false);
  const touchAtivo = useRef(false);

  const { demanda, match, empresaNome, empresaVerificada } = item;
  const tags = tagsDemandaCard(demanda);
  const requisitos = requisitosDemanda(demanda);
  const briefingPreview =
    demanda.briefing.length > BRIEFING_PREVIEW
      ? `${demanda.briefing.slice(0, BRIEFING_PREVIEW).trim()}…`
      : demanda.briefing;
  const href = hrefDetalheDemanda(demanda.id, queryFeed);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  function limparHoverTimer() {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }

  function limparHoldTimer() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  function irParaDetalhe() {
    router.push(href);
  }

  function handleMouseEnter() {
    if (touchAtivo.current) return;
    limparHoverTimer();
    hoverTimer.current = setTimeout(() => setExpandido(true), HOVER_EXPAND_MS);
  }

  function handleMouseLeave() {
    limparHoverTimer();
    if (!touchAtivo.current) setExpandido(false);
  }

  function handleFocus() {
    setExpandido(true);
  }

  function handleBlur(e: FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setExpandido(false);
    }
  }

  function handleTouchStart() {
    touchAtivo.current = true;
    suppressClick.current = false;
    limparHoldTimer();
    holdTimer.current = setTimeout(() => {
      setExpandido(true);
      suppressClick.current = true;
    }, PRESS_HOLD_MS);
  }

  function handleTouchMove() {
    limparHoldTimer();
  }

  function handleTouchEnd(e: TouchEvent<HTMLElement>) {
    limparHoldTimer();
    if (suppressClick.current) {
      e.preventDefault();
    }
  }

  function handleClick(e: MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("[data-card-action]")) return;
    if (suppressClick.current) {
      suppressClick.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    irParaDetalhe();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("[data-card-action]")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      irParaDetalhe();
    }
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-expanded={expandido}
      aria-label={`${demanda.titulo} — ${empresaNome}. Abrir detalhes.`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "card-marketing group relative flex h-full cursor-pointer flex-col overflow-hidden p-4",
        "border-l-[3px] border-l-transparent",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out",
        "hover:-translate-y-1 hover:border-l-verde-neon hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--preto)_10%,transparent)]",
        "focus-visible:border-l-verde-neon focus-visible:ring-2 focus-visible:ring-verde-neon/25 focus-visible:outline-none",
        expandido &&
          "-translate-y-1 border-l-verde-neon shadow-[0_12px_32px_color-mix(in_srgb,var(--preto)_10%,transparent)]",
        modoEnviado &&
          "border-l-lilas-escuro bg-[color-mix(in_srgb,var(--lilas-claro)_55%,white)]",
      )}
    >
      <header className="flex items-start gap-3">
        <MatchRing
          score={match.score}
          size="sm"
          showLabel
          darkBackdrop
          className="shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Avatar size="sm">
                <AvatarFallback className="bg-lilas-claro font-display text-xs font-semibold text-lilas-escuro">
                  {iniciaisEmpresa(empresaNome)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-medium">{empresaNome}</p>
                  {empresaVerificada ? (
                    <BadgeCheck
                      className="text-verde-acao size-3.5 shrink-0"
                      aria-label="Empresa verificada"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            {modoEnviado ? (
              <Badge
                variant="outline"
                className="shrink-0 border-lilas-escuro/25 bg-lilas-claro text-lilas-escuro"
              >
                Enviado
              </Badge>
            ) : null}
          </div>
          <h2 className="font-display line-clamp-2 text-base leading-snug font-semibold tracking-tight">
            {demanda.titulo}
          </h2>
        </div>
      </header>

      <div className="mt-3 flex flex-1 flex-col gap-3">
        <p className="font-display font-data text-xl font-bold tracking-tight sm:text-2xl">
          {formatarMoeda(demanda.orcamento)}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <BadgeFormatoDemanda key={tag}>{tag}</BadgeFormatoDemanda>
          ))}
        </div>

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            expandido ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={cn(
                "space-y-3 border-t border-cinza-200/80 pt-3 transition-opacity duration-300",
                expandido ? "opacity-100" : "opacity-0",
              )}
              aria-hidden={!expandido}
            >
              <p className="text-texto-secundario text-sm leading-relaxed font-normal">
                {briefingPreview}
              </p>
              <div className="text-texto-secundario flex items-center gap-1.5 text-sm">
                <CalendarDays className="size-3.5 shrink-0" aria-hidden />
                <span>
                  Prazo{" "}
                  <span className="text-foreground font-data font-medium">
                    {formatarPrazo(demanda.prazo)}
                  </span>
                </span>
              </div>
              <ul className="space-y-1.5">
                {requisitos.slice(0, 2).map((req) => (
                  <li
                    key={req}
                    className="text-texto-secundario flex items-start gap-1.5 text-xs leading-snug"
                  >
                    <ListChecks
                      className="text-verde-acao mt-0.5 size-3 shrink-0"
                      aria-hidden
                    />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {!modoEnviado ? (
        <div
          data-card-action
          className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1.3fr_1fr]"
        >
          <Button
            type="button"
            variant="cta"
            size="lg"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onInteresse(match.id);
            }}
          >
            Tenho interesse
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="text-texto-secundario w-full hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onRecusar(match.id);
            }}
          >
            Não é pra mim
          </Button>
        </div>
      ) : (
        <div data-card-action className="mt-4 space-y-2">
          <p className="text-texto-secundario text-center text-xs font-normal">
            Interesse enviado — a empresa pode iniciar a conversa.
          </p>
          <Link
            href={`/negociacao/${match.id}`}
            className={cn(
              buttonVariants({ variant: "cta", size: "lg" }),
              "w-full",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            Acompanhar negociação
          </Link>
        </div>
      )}
    </article>
  );
}

type DemandaListaVaziaProps = {
  mensagem?: string;
  mostrarLinkPerfil?: boolean;
};

export function DemandaListaVazia({
  mensagem = "Nenhuma demanda disponível no momento — complete seu perfil para aparecer em mais buscas.",
  mostrarLinkPerfil = true,
}: DemandaListaVaziaProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-cinza-200 bg-white px-4 py-16 text-center">
      <p className="text-texto-secundario max-w-sm text-sm leading-relaxed font-normal">
        {mensagem}
      </p>
      {mostrarLinkPerfil ? (
        <Link
          href="/influenciador/meu-portfolio"
          className="text-lilas-escuro mt-4 text-sm font-medium hover:underline"
        >
          Completar meu perfil →
        </Link>
      ) : null}
    </div>
  );
}
