import type { CadastroPayload } from "@/lib/influenciador/cadastro-utils";

const STORAGE_PREFIX = "influenciador-perfil";

function chavePerfil(usuarioId: string): string {
  return `${STORAGE_PREFIX}:${usuarioId}`;
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
