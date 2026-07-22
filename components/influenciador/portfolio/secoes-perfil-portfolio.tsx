"use client";

import { useCallback, useEffect, useState } from "react";
import { Hourglass } from "lucide-react";
import { toast } from "sonner";

import { PassoEquipamentosMetricas } from "@/components/influenciador/cadastro/passo-equipamentos-metricas";
import {
  PassoPacotesPrecificacao,
  type ContextoComparacaoMercado,
} from "@/components/influenciador/cadastro/passo-pacotes-precificacao";
import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
import { validarTextosLivresPortfolio } from "@/components/influenciador/portfolio/campo-texto-filtrado";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  dadosSecaoMetricas,
  dadosSecaoPrecos,
  type CadastroDraft,
} from "@/lib/influenciador/cadastro-types";
import {
  atualizarPrecosBase,
  draftFromPayload,
  montarPayload,
  perfilProntoParaAnalise,
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
import { CREATORS_CATALOGO_MOCK } from "@/lib/mock-data/creators-catalogo";
import { INFLUENCIADORES_MERCADO_MOCK } from "@/lib/mock-data/influenciadores-mercado";
import { enfileirarInfluenciadorParaModeracao } from "@/lib/moderacao/moderacao-utils";
import {
  validarSecaoMetricas,
  validarSecaoPrecos,
} from "@/lib/schemas/influenciador-cadastro";

type SecoesPerfilPortfolioProps = {
  onPerfilAtualizado?: () => void;
};

/**
 * Seções pós-cadastro (antigos passos 3 e 4 do wizard) — editáveis no portfólio.
 * Reutiliza os mesmos componentes/validação do cadastro original.
 */
export function SecoesPerfilPortfolio({
  onPerfilAtualizado,
}: SecoesPerfilPortfolioProps) {
  const { usuario } = useAuth();
  const [draft, setDraft] = useState<CadastroDraft | null>(null);
  const [contextoMercado, setContextoMercado] =
    useState<ContextoComparacaoMercado | null>(null);
  const [errorsMetricas, setErrorsMetricas] = useState<Record<string, string>>(
    {},
  );
  const [errorsPrecos, setErrorsPrecos] = useState<Record<string, string>>({});
  const [emAnalise, setEmAnalise] = useState(false);
  const [salvandoMetricas, setSalvandoMetricas] = useState(false);
  const [salvandoPrecos, setSalvandoPrecos] = useState(false);
  const [avisoContatoPacotes, setAvisoContatoPacotes] = useState(false);

  const recarregar = useCallback(() => {
    if (!usuario) {
      setDraft(null);
      setContextoMercado(null);
      return;
    }
    const perfil = carregarPerfilInfluenciador(usuario.id);
    if (!perfil) {
      setDraft(null);
      setContextoMercado(null);
      return;
    }
    setDraft(draftFromPayload(perfil));
    const portfolio = obterOuCriarPortfolioDoUsuario(usuario.id);
    setEmAnalise(
      perfilProntoParaAnalise(perfil, {
        trabalhosAnteriores: portfolio.trabalhos.filter(
          (t) => t.titulo.trim() || t.marca.trim(),
        ).length,
      }),
    );
    const id = perfil.influenciador.id;
    const fallbackMercado = INFLUENCIADORES_MERCADO_MOCK.find(
      (p) => p.influenciador.id === id,
    );
    const fallbackCatalogo = CREATORS_CATALOGO_MOCK.find((c) => c.id === id);
    setContextoMercado({
      influenciador: perfil.influenciador,
      cidade:
        portfolio.cidade ||
        fallbackMercado?.cidade ||
        fallbackCatalogo?.cidade ||
        "",
      estado:
        portfolio.estado ||
        fallbackMercado?.estado ||
        fallbackCatalogo?.estado ||
        "",
    });
  }, [usuario]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [draft]);

  const updateDraft = useCallback((partial: Partial<CadastroDraft>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      let next = { ...prev, ...partial };
      if (
        "seguidores" in partial &&
        partial.seguidores !== "" &&
        typeof partial.seguidores === "number"
      ) {
        next = {
          ...next,
          tabelaPrecos: atualizarPrecosBase(
            next.tabelaPrecos,
            partial.seguidores,
          ),
        };
      }
      return next;
    });
  }, []);

  const sincronizarPortfolio = useCallback(
    (payload: ReturnType<typeof montarPayload>) => {
      if (!usuario) return;
      const portfolio = obterOuCriarPortfolioDoUsuario(usuario.id);
      salvarPortfolio({
        ...portfolio,
        nome: payload.influenciador.nome,
        bio: payload.influenciador.bio,
        seguidores: payload.metricaPerfil.seguidores,
        engajamentoMedio: payload.metricaPerfil.engajamentoMedio,
        pacotes: payload.pacotes,
        plano: payload.influenciador.plano,
        tiposAtuacao: payload.influenciador.tiposAtuacao,
        disponibilidade: payload.influenciador.disponibilidade,
        nichoIds:
          payload.categorias
            .filter((c) => c.tipo === "dominio")
            .map((c) => c.id) || portfolio.nichoIds,
      });
    },
    [usuario],
  );

  const salvarMetricas = useCallback(() => {
    if (!usuario || !draft) return;

    const result = validarSecaoMetricas(dadosSecaoMetricas(draft));
    if (!result.success) {
      setErrorsMetricas(result.errors);
      toast.error("Revise as métricas antes de salvar.");
      return;
    }

    setErrorsMetricas({});
    setSalvandoMetricas(true);

    const existente = carregarPerfilInfluenciador(usuario.id);
    const payload = montarPayload(draft, usuario, existente);
    salvarPerfilInfluenciador(usuario.id, payload);
    marcarSecaoCompleta(usuario.id, "metricas");
    sincronizarPortfolio(payload);

    const portfolioAtual = obterOuCriarPortfolioDoUsuario(usuario.id);
    const trabalhosOk = portfolioAtual.trabalhos.filter(
      (t) => t.titulo.trim() || t.marca.trim(),
    ).length;
    const pronto = perfilProntoParaAnalise(payload, {
      trabalhosAnteriores: trabalhosOk,
    });
    const primeiroEnvio = !emAnalise && pronto;
    if (pronto) {
      enfileirarInfluenciadorParaModeracao(payload);
      setEmAnalise(true);
      if (primeiroEnvio) {
        toast.success(
          "Print recebido! Seu perfil entrou em análise pela moderação.",
        );
      } else {
        toast.success("Métricas atualizadas.");
      }
    } else {
      toast.success("Métricas salvas.");
    }

    onPerfilAtualizado?.();
    setSalvandoMetricas(false);
  }, [draft, emAnalise, onPerfilAtualizado, sincronizarPortfolio, usuario]);

  const salvarPrecos = useCallback(() => {
    if (!usuario || !draft) return;

    const pacotesFiltrados = draft.pacotes.filter((p) => p.nome.trim().length > 0);
    const validacaoContato = validarTextosLivresPortfolio(
      pacotesFiltrados.map((p) => p.descricao),
    );
    if (!validacaoContato.ok) {
      setAvisoContatoPacotes(true);
      toast.error("Remova telefones, e-mails e @ das descrições dos pacotes.");
      return;
    }
    setAvisoContatoPacotes(false);

    const result = validarSecaoPrecos(dadosSecaoPrecos(draft));
    if (!result.success) {
      setErrorsPrecos(result.errors);
      toast.error("Revise os preços antes de salvar.");
      return;
    }

    setErrorsPrecos({});
    setSalvandoPrecos(true);

    const existente = carregarPerfilInfluenciador(usuario.id);
    const payload = montarPayload(
      {
        ...draft,
        pacotes: pacotesFiltrados,
      },
      usuario,
      existente,
    );
    salvarPerfilInfluenciador(usuario.id, payload);
    marcarSecaoCompleta(usuario.id, "precos");
    sincronizarPortfolio(payload);
    toast.success("Pacotes e preços atualizados.");
    onPerfilAtualizado?.();
    setSalvandoPrecos(false);
  }, [draft, onPerfilAtualizado, sincronizarPortfolio, usuario]);

  if (!draft) {
    return (
      <p className="text-texto-secundario text-sm">
        Complete o cadastro básico para editar métricas e preços.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {emAnalise ? (
        <div
          className="banner-informativo flex gap-3 rounded-card p-4"
          role="status"
        >
          <Hourglass
            className="text-verde-neon mt-0.5 size-4 shrink-0"
            aria-hidden
          />
          <div className="space-y-1">
            <p className="font-display text-sm font-bold">Perfil em análise</p>
            <p className="text-texto-secundario text-sm font-normal leading-relaxed">
              A moderação está revisando seu print de métricas. Enquanto isso,
              você pode continuar editando o restante do perfil.
            </p>
          </div>
        </div>
      ) : null}

      <section id="metricas" className="scroll-mt-24 space-y-4">
        <PassoEquipamentosMetricas
          draft={draft}
          onChange={updateDraft}
          errors={errorsMetricas}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="cta"
            disabled={salvandoMetricas}
            onClick={salvarMetricas}
          >
            Salvar métricas
          </Button>
        </div>
      </section>

      <section id="precos" className="scroll-mt-24 space-y-4">
        {avisoContatoPacotes ? (
          <AvisoContatoInline tipo="bloqueado_padrao" variante="inline" />
        ) : null}
        <PassoPacotesPrecificacao
          draft={draft}
          onChange={updateDraft}
          errors={errorsPrecos}
          contextoMercado={contextoMercado}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="cta"
            disabled={salvandoPrecos}
            onClick={salvarPrecos}
          >
            Salvar pacotes e preços
          </Button>
        </div>
      </section>
    </div>
  );
}
