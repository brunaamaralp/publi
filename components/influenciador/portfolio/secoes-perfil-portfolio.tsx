"use client";

import { useCallback, useEffect, useState } from "react";
import { Hourglass } from "lucide-react";

import { PassoEquipamentosMetricas } from "@/components/influenciador/cadastro/passo-equipamentos-metricas";
import {
  PassoPacotesPrecificacao,
  type ContextoComparacaoMercado,
} from "@/components/influenciador/cadastro/passo-pacotes-precificacao";
import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
import { validarTextosLivresPortfolio } from "@/components/influenciador/portfolio/campo-texto-filtrado";
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
  carregarSecoesCompletas,
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

export type ResultadoPersistenciaSecoes =
  | { ok: true; mensagem?: string }
  | {
      ok: false;
      secao: "metricas" | "precos";
      mensagem: string;
    };

export type UseSecoesPerfilPortfolioResult = {
  draft: CadastroDraft | null;
  updateDraft: (partial: Partial<CadastroDraft>) => void;
  contextoMercado: ContextoComparacaoMercado | null;
  errorsMetricas: Record<string, string>;
  errorsPrecos: Record<string, string>;
  emAnalise: boolean;
  avisoContatoPacotes: boolean;
  setAvisoContatoPacotes: (v: boolean) => void;
  /** Persiste métricas + preços no perfil e sincroniza o portfólio. */
  persistirSecoes: (trabalhosCount: number) => ResultadoPersistenciaSecoes;
};

/**
 * Estado e persistência das seções pós-cadastro (métricas / preços),
 * para o Salvar único do editor de portfólio.
 */
export function useSecoesPerfilPortfolio(): UseSecoesPerfilPortfolioResult {
  const { usuario } = useAuth();
  const [draft, setDraft] = useState<CadastroDraft | null>(null);
  const [contextoMercado, setContextoMercado] =
    useState<ContextoComparacaoMercado | null>(null);
  const [errorsMetricas, setErrorsMetricas] = useState<Record<string, string>>(
    {},
  );
  const [errorsPrecos, setErrorsPrecos] = useState<Record<string, string>>({});
  const [emAnalise, setEmAnalise] = useState(false);
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

  const persistirSecoes = useCallback(
    (trabalhosCount: number): ResultadoPersistenciaSecoes => {
      if (!usuario || !draft) {
        return { ok: true };
      }

      const secoesJaCompletas = carregarSecoesCompletas(usuario.id);
      const metricasIniciadas =
        Boolean(draft.printMetricasUrl) ||
        draft.seguidores !== "" ||
        draft.engajamentoMedio !== "";
      const pacotesFiltrados = draft.pacotes.filter(
        (p) => p.nome.trim().length > 0,
      );
      const precosIniciados = pacotesFiltrados.length > 0;

      const resultMetricas = validarSecaoMetricas(dadosSecaoMetricas(draft));
      if (!resultMetricas.success) {
        setErrorsMetricas(resultMetricas.errors);
        if (secoesJaCompletas.metricas || metricasIniciadas) {
          return {
            ok: false,
            secao: "metricas",
            mensagem: "Revise as métricas na aba Prova antes de salvar.",
          };
        }
      } else {
        setErrorsMetricas({});
      }

      const validacaoContato = validarTextosLivresPortfolio(
        pacotesFiltrados.map((p) => p.descricao),
      );
      if (!validacaoContato.ok) {
        setAvisoContatoPacotes(true);
        return {
          ok: false,
          secao: "precos",
          mensagem:
            "Remova telefones, e-mails e @ das descrições dos pacotes.",
        };
      }
      setAvisoContatoPacotes(false);

      const resultPrecos = validarSecaoPrecos(
        dadosSecaoPrecos({ ...draft, pacotes: pacotesFiltrados }),
      );
      if (!resultPrecos.success) {
        setErrorsPrecos(resultPrecos.errors);
        if (secoesJaCompletas.precos || precosIniciados) {
          return {
            ok: false,
            secao: "precos",
            mensagem: "Revise os preços na aba Preços antes de salvar.",
          };
        }
      } else {
        setErrorsPrecos({});
      }

      const salvarMetricas = resultMetricas.success;
      const salvarPrecos = resultPrecos.success;
      if (!salvarMetricas && !salvarPrecos) {
        return { ok: true };
      }

      const existente = carregarPerfilInfluenciador(usuario.id);
      const payload = montarPayload(
        { ...draft, pacotes: pacotesFiltrados },
        usuario,
        existente,
      );
      salvarPerfilInfluenciador(usuario.id, payload);
      if (salvarMetricas) marcarSecaoCompleta(usuario.id, "metricas");
      if (salvarPrecos) marcarSecaoCompleta(usuario.id, "precos");
      sincronizarPortfolio(payload);

      const pronto = perfilProntoParaAnalise(payload, {
        trabalhosAnteriores: trabalhosCount,
      });
      const primeiroEnvio = !emAnalise && pronto;
      if (pronto) {
        enfileirarInfluenciadorParaModeracao(payload);
        setEmAnalise(true);
      }

      setDraft(draftFromPayload(payload));

      return {
        ok: true,
        mensagem: primeiroEnvio
          ? "Print recebido! Seu perfil entrou em análise pela moderação."
          : undefined,
      };
    },
    [draft, emAnalise, sincronizarPortfolio, usuario],
  );

  return {
    draft,
    updateDraft,
    contextoMercado,
    errorsMetricas,
    errorsPrecos,
    emAnalise,
    avisoContatoPacotes,
    setAvisoContatoPacotes,
    persistirSecoes,
  };
}

export function BannerPerfilEmAnalise() {
  return (
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
          A moderação está revisando seu print de métricas. Enquanto isso, você
          pode continuar editando o restante do perfil.
        </p>
      </div>
    </div>
  );
}

type SecaoMetricasProps = {
  draft: CadastroDraft;
  onChange: (partial: Partial<CadastroDraft>) => void;
  errors: Record<string, string>;
};

export function SecaoMetricasPortfolio({
  draft,
  onChange,
  errors,
}: SecaoMetricasProps) {
  return (
    <section id="metricas" className="scroll-mt-24 space-y-4">
      <PassoEquipamentosMetricas
        draft={draft}
        onChange={onChange}
        errors={errors}
      />
    </section>
  );
}

type SecaoPrecosProps = {
  draft: CadastroDraft;
  onChange: (partial: Partial<CadastroDraft>) => void;
  errors: Record<string, string>;
  contextoMercado: ContextoComparacaoMercado | null;
  avisoContato: boolean;
};

export function SecaoPrecosPortfolio({
  draft,
  onChange,
  errors,
  contextoMercado,
  avisoContato,
}: SecaoPrecosProps) {
  return (
    <section id="precos" className="scroll-mt-24 space-y-4">
      {avisoContato ? (
        <AvisoContatoInline tipo="bloqueado_padrao" variante="inline" />
      ) : null}
      <PassoPacotesPrecificacao
        draft={draft}
        onChange={onChange}
        errors={errors}
        contextoMercado={contextoMercado}
      />
    </section>
  );
}
