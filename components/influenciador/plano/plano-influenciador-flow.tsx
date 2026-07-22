"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  dadosSecaoPlano,
  type CadastroDraft,
} from "@/lib/influenciador/cadastro-types";
import {
  draftFromPayload,
  formatarMoeda,
  montarPayload,
} from "@/lib/influenciador/cadastro-utils";
import {
  carregarPerfilInfluenciador,
  marcarSecaoCompleta,
  salvarPerfilInfluenciador,
} from "@/lib/influenciador/perfil-storage";
import {
  obterOuCriarPortfolioDoUsuario,
  salvarPortfolio,
} from "@/lib/influenciador/portfolio-storage";
import { validarSecaoPlano } from "@/lib/schemas/influenciador-cadastro";
import { cn } from "@/lib/utils";

const PLANOS = [
  {
    id: "basico" as const,
    nome: "Básico",
    preco: 9.9,
    beneficios: ["Aparece nas buscas", "Perfil profissional completo"],
  },
  {
    id: "pro" as const,
    nome: "Pro",
    preco: 19.9,
    recomendado: true,
    beneficios: [
      "Prioridade nas sugestões",
      "Acesso a treinamentos",
      "Destaque moderado nas buscas",
    ],
  },
  {
    id: "elite" as const,
    nome: "Elite",
    preco: 39.9,
    beneficios: [
      "Selo de destaque no perfil",
      "Suporte prioritário",
      "Máxima visibilidade nas oportunidades",
    ],
  },
];

type PlanoInfluenciadorFlowProps = {
  /** Quando true, omite o header de página (já coberto pelo shell de Configurações). */
  embutido?: boolean;
};

export function PlanoInfluenciadorFlow({
  embutido = false,
}: PlanoInfluenciadorFlowProps) {
  const { usuario, isLoading } = useAuth();
  const [draft, setDraft] = useState<CadastroDraft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!usuario) {
      setDraft(null);
      return;
    }
    const perfil = carregarPerfilInfluenciador(usuario.id);
    if (!perfil) {
      setDraft(null);
      return;
    }
    setDraft(draftFromPayload(perfil));
  }, [usuario]);

  const salvar = useCallback(() => {
    if (!usuario || !draft) return;

    const result = validarSecaoPlano(dadosSecaoPlano(draft));
    if (!result.success) {
      setErrors(result.errors);
      toast.error("Selecione um plano para continuar.");
      return;
    }

    setErrors({});
    setSalvando(true);

    const existente = carregarPerfilInfluenciador(usuario.id);
    const payload = montarPayload(draft, usuario, existente);
    salvarPerfilInfluenciador(usuario.id, payload);
    marcarSecaoCompleta(usuario.id, "plano");

    const portfolio = obterOuCriarPortfolioDoUsuario(usuario.id);
    salvarPortfolio({
      ...portfolio,
      plano: payload.influenciador.plano,
      nome: payload.influenciador.nome,
    });

    toast.success("Plano atualizado.");
    setSalvando(false);
  }, [draft, usuario]);

  if (isLoading) {
    return (
      <div className="text-texto-secundario flex min-h-[20vh] items-center justify-center text-sm">
        Carregando…
      </div>
    );
  }

  if (!draft) {
    return (
      <p className="text-texto-secundario text-sm">
        Complete o cadastro básico antes de escolher um plano.
      </p>
    );
  }

  const conteudo = (
    <>
      {!embutido ? (
        <header className="space-y-2">
          <p className="text-texto-secundario text-sm font-medium">Assinatura</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Seu plano
          </h1>
          <p className="text-texto-secundario max-w-xl text-sm font-normal leading-relaxed">
            Escolha ou troque o plano a qualquer momento. Você pode usar o app
            mesmo antes de confirmar.
          </p>
        </header>
      ) : (
        <div className="space-y-1">
          <h2 className="font-display text-lg font-bold">Seu plano</h2>
          <p className="text-texto-secundario text-sm font-normal leading-relaxed">
            Escolha ou troque o plano a qualquer momento.
          </p>
        </div>
      )}

      {errors.plano ? (
        <p role="alert" className="text-destructive text-sm">
          {errors.plano}
        </p>
      ) : null}

      <div
        className="grid gap-4 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Planos de assinatura"
      >
        {PLANOS.map((plano) => {
          const selecionado = draft.plano === plano.id;
          return (
            <button
              key={plano.id}
              type="button"
              role="radio"
              aria-checked={selecionado}
              onClick={() =>
                setDraft((prev) => (prev ? { ...prev, plano: plano.id } : prev))
              }
              className={cn(
                "relative rounded-card border p-4 text-left transition-all outline-none",
                "focus-visible:ring-3 focus-visible:ring-ring/50",
                selecionado
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40",
                "recomendado" in plano && plano.recomendado && "sm:scale-[1.02]",
              )}
            >
              {"recomendado" in plano && plano.recomendado ? (
                <Badge className="absolute -top-2.5 right-3">Recomendado</Badge>
              ) : null}
              <p className="font-semibold">{plano.nome}</p>
              <p className="text-primary mt-1 font-display text-lg font-bold">
                <span className="font-data">{formatarMoeda(plano.preco)}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  /mês
                </span>
              </p>
              <ul className="text-muted-foreground mt-3 space-y-1.5 text-sm">
                {plano.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2
                      className="text-verde-neon mt-0.5 size-3.5 shrink-0"
                      aria-hidden
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div
        className="banner-informativo flex gap-3 rounded-card p-4"
        role="note"
      >
        <ShieldCheck
          className="text-verde-neon mt-0.5 size-4 shrink-0"
          aria-hidden
        />
        <p className="text-sm">
          A visibilidade em buscas depende da aprovação do perfil (status ativo),
          não só do plano escolhido.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="cta"
          disabled={salvando}
          onClick={salvar}
        >
          Salvar plano
        </Button>
      </div>
    </>
  );

  if (embutido) {
    return <div className="space-y-8">{conteudo}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-6 sm:px-6 sm:py-10">
      {conteudo}
    </div>
  );
}
