const PREFIX = "influenciador-onboarding-guia";

function chave(usuarioId: string): string {
  return `${PREFIX}:${usuarioId}`;
}

export type EstadoOnboardingGuia = {
  /** Mostrar o diálogo na próxima visita ao dashboard. */
  pendente: boolean;
  /** Usuário dispensou o guia (banner continua como fallback). */
  dispensado: boolean;
};

function ler(usuarioId: string): EstadoOnboardingGuia {
  if (typeof window === "undefined") {
    return { pendente: false, dispensado: false };
  }
  try {
    const raw = localStorage.getItem(chave(usuarioId));
    if (!raw) return { pendente: false, dispensado: false };
    const parsed = JSON.parse(raw) as Partial<EstadoOnboardingGuia>;
    return {
      pendente: Boolean(parsed.pendente),
      dispensado: Boolean(parsed.dispensado),
    };
  } catch {
    return { pendente: false, dispensado: false };
  }
}

function gravar(usuarioId: string, estado: EstadoOnboardingGuia): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(chave(usuarioId), JSON.stringify(estado));
}

/** Chamado ao concluir o cadastro — abre o guia no primeiro dashboard. */
export function marcarOnboardingGuiaPendente(usuarioId: string): void {
  gravar(usuarioId, { pendente: true, dispensado: false });
}

export function deveMostrarOnboardingGuia(usuarioId: string): boolean {
  const estado = ler(usuarioId);
  return estado.pendente && !estado.dispensado;
}

export function dispensarOnboardingGuia(usuarioId: string): void {
  gravar(usuarioId, { pendente: false, dispensado: true });
}

export function concluirOnboardingGuia(usuarioId: string): void {
  gravar(usuarioId, { pendente: false, dispensado: true });
}
