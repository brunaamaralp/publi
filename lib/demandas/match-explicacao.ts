import {
  LABELS_FAIXA_MATCH,
  nivelMatchRing,
} from "@/components/ui/match-ring";

export type FatorMatch = {
  id: string;
  label: string;
  /** Contribuição estimada 0–100 (demonstrativa). */
  pontos: number;
  detalhe: string;
};

export type ExplicacaoMatch = {
  resumo: string;
  faixa: string;
  fatores: FatorMatch[];
};

/**
 * Detalhamento demonstrativo do score — mesma linguagem do produto
 * (audiência, nicho, formato/engajamento) usada nas sugestões.
 */
export function explicarMatchScore(score: number): ExplicacaoMatch {
  const scoreArredondado = Math.round(Math.min(100, Math.max(0, score)));
  const nivel = nivelMatchRing(scoreArredondado);
  const faixa = LABELS_FAIXA_MATCH[nivel];

  const pesoNicho =
    nivel === "alto" ? 0.42 : nivel === "medio" ? 0.38 : 0.34;
  const pesoAudiencia =
    nivel === "alto" ? 0.33 : nivel === "medio" ? 0.34 : 0.36;

  const pontosNicho = Math.round(scoreArredondado * pesoNicho);
  const pontosAudiencia = Math.round(scoreArredondado * pesoAudiencia);
  /** Restante do score após nicho/audiência (evita drift de arredondamento). */
  const pontosFormato = Math.max(
    0,
    scoreArredondado - pontosNicho - pontosAudiencia,
  );

  const fatores: FatorMatch[] = [
    {
      id: "nicho",
      label: "Nicho",
      pontos: pontosNicho,
      detalhe:
        nivel === "alto"
          ? "Seu posicionamento está alinhado ao tema da campanha."
          : nivel === "medio"
            ? "Há sobreposição parcial entre o seu nicho e o da demanda."
            : "O nicho da campanha diverge um pouco do seu foco principal.",
    },
    {
      id: "audiencia",
      label: "Audiência",
      pontos: pontosAudiencia,
      detalhe:
        nivel === "alto"
          ? "Perfil demográfico e interesses da audiência batem com o briefing."
          : nivel === "medio"
            ? "Parte da audiência combina; vale checar o briefing com atenção."
            : "A audiência pedida é mais específica — avalie se faz sentido para você.",
    },
    {
      id: "formato",
      label: "Formato e engajamento",
      pontos: pontosFormato,
      detalhe:
        nivel === "alto"
          ? "Formato solicitado combina com o que você entrega bem."
          : nivel === "medio"
            ? "Você já trabalha formatos próximos; o engajamento médio é adequado."
            : "O formato ou o ritmo de engajamento exigido pode ser um desafio.",
    },
  ];

  const resumo =
    nivel === "alto"
      ? "Alta chance de a empresa te priorizar — o perfil combina em nicho, audiência e formato."
      : nivel === "medio"
        ? "Compatibilidade razoável: há pontos fortes, mas revise o briefing antes de se candidatar."
        : "Score mais baixo — ainda pode valer se o briefing te animar, mas a empresa pode priorizar outros perfis.";

  return { resumo, faixa, fatores };
}
