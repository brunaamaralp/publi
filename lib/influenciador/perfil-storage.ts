import type { CadastroPayload } from "@/lib/influenciador/cadastro-utils";
import { perfilProntoParaAnalise } from "@/lib/influenciador/cadastro-utils";
import { ehSomenteModelo } from "@/lib/influenciador/atuacao-utils";
import type { TrabalhoAnterior } from "@/lib/influenciador/portfolio-types";

const STORAGE_PREFIX = "influenciador-perfil";
const SECOES_PREFIX = "influenciador-secoes-completas";
const PORTFOLIO_PREFIX = "influenciador-portfolio";

export type SecoesPerfilCompletas = {
  /** Equipamentos + print + métricas (antigo passo 3). */
  metricas: boolean;
  /** Tabela de preços + pacotes (antigo passo 4). */
  precos: boolean;
  /** Plano explicitamente escolhido (antigo passo 5). */
  plano: boolean;
};

function chavePerfil(usuarioId: string): string {
  return `${STORAGE_PREFIX}:${usuarioId}`;
}

function chaveSecoes(usuarioId: string): string {
  return `${SECOES_PREFIX}:${usuarioId}`;
}

function lerTrabalhosPortfolio(portfolioId: string): TrabalhoAnterior[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${PORTFOLIO_PREFIX}:${portfolioId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { trabalhos?: TrabalhoAnterior[] };
    return Array.isArray(parsed.trabalhos) ? parsed.trabalhos : [];
  } catch {
    return [];
  }
}

export function salvarPerfilInfluenciador(
  usuarioId: string,
  payload: CadastroPayload,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(chavePerfil(usuarioId), JSON.stringify(payload));
}

export function carregarPerfilInfluenciador(
  usuarioId: string,
): CadastroPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(chavePerfil(usuarioId));
    if (!raw) return null;
    return JSON.parse(raw) as CadastroPayload;
  } catch {
    return null;
  }
}

export function perfilInfluenciadorConcluido(usuarioId: string): boolean {
  return carregarPerfilInfluenciador(usuarioId) !== null;
}

export function nomeExibicaoPerfil(usuarioId: string): string | null {
  const perfil = carregarPerfilInfluenciador(usuarioId);
  return perfil?.influenciador.nome?.trim() || null;
}

function secoesPadrao(): SecoesPerfilCompletas {
  return { metricas: false, precos: false, plano: false };
}

function trabalhosCount(perfil: CadastroPayload): number {
  const trabalhos = [
    ...lerTrabalhosPortfolio(perfil.influenciador.id),
    ...lerTrabalhosPortfolio(`inf-${perfil.usuario.id}`),
  ];
  const porId = new Map(trabalhos.map((t) => [t.id, t]));
  return Array.from(porId.values()).filter(
    (t) => t.titulo.trim().length > 0 || t.marca.trim().length > 0,
  ).length;
}

function perfilPronto(perfil: CadastroPayload): boolean {
  return perfilProntoParaAnalise(perfil, {
    trabalhosAnteriores: trabalhosCount(perfil),
  });
}

export function carregarSecoesCompletas(
  usuarioId: string,
): SecoesPerfilCompletas {
  if (typeof window === "undefined") return secoesPadrao();
  try {
    const raw = localStorage.getItem(chaveSecoes(usuarioId));
    if (!raw) {
      const perfil = carregarPerfilInfluenciador(usuarioId);
      if (!perfil) return secoesPadrao();
      return {
        metricas: perfilPronto(perfil),
        precos: false,
        plano: false,
      };
    }
    return { ...secoesPadrao(), ...JSON.parse(raw) } as SecoesPerfilCompletas;
  } catch {
    return secoesPadrao();
  }
}

export function marcarSecaoCompleta(
  usuarioId: string,
  secao: keyof SecoesPerfilCompletas,
  completa = true,
): SecoesPerfilCompletas {
  const atual = carregarSecoesCompletas(usuarioId);
  const next = { ...atual, [secao]: completa };
  if (typeof window !== "undefined") {
    localStorage.setItem(chaveSecoes(usuarioId), JSON.stringify(next));
  }
  return next;
}

export type ItemChecklistPerfil = {
  id: keyof SecoesPerfilCompletas;
  label: string;
  descricao?: string;
  href: string;
  completo: boolean;
};

/** Itens do banner "Complete seu perfil" no dashboard. */
export function checklistPerfilIncompleto(
  usuarioId: string,
): ItemChecklistPerfil[] {
  const perfil = carregarPerfilInfluenciador(usuarioId);
  const secoes = carregarSecoesCompletas(usuarioId);
  const metricasOk =
    secoes.metricas || (perfil ? perfilPronto(perfil) : false);
  const soModelo = perfil
    ? ehSomenteModelo(perfil.influenciador.tiposAtuacao)
    : false;

  return [
    {
      id: "metricas",
      label: soModelo ? "Trabalhos anteriores" : "Métricas de audiência",
      descricao: soModelo
        ? "Adicione trabalhos/portfólio de fotos para a moderação analisar seu perfil de modelo"
        : "Envie o print das suas métricas para começarmos a análise do seu perfil",
      href: soModelo
        ? "/influenciador/meu-portfolio#trabalhos"
        : "/influenciador/meu-portfolio#metricas",
      completo: metricasOk,
    },
    {
      id: "precos",
      label: "Pacotes e preços",
      href: "/influenciador/meu-portfolio#precos",
      completo: secoes.precos,
    },
    {
      id: "plano",
      label: "Escolher plano",
      href: "/influenciador/plano",
      completo: secoes.plano,
    },
  ];
}

export function perfilTemPendencias(usuarioId: string): boolean {
  return checklistPerfilIncompleto(usuarioId).some((item) => !item.completo);
}

/** True quando o print já foi enviado e o perfil pode ir à fila de moderação. */
export function perfilAguardandoAnalise(usuarioId: string): boolean {
  const perfil = carregarPerfilInfluenciador(usuarioId);
  if (!perfil) return false;
  return (
    perfilPronto(perfil) &&
    perfil.usuario.status === "pendente_verificacao"
  );
}
