import {
  USUARIOS_PENDENTES_MODERACAO_MOCK,
  type UsuarioPendenteModeracao,
} from "@/lib/mock-data/moderacao";
import { definirStatusConta } from "@/lib/mock-data/influenciadores-status";
import type { Usuario } from "@/lib/types/usuario";

const STORAGE_KEY = "moderacao-estado";

export type FiltroTipoUsuario = Usuario["tipo"] | "todos";

export type FiltroDataCadastro = "todos" | "7d" | "30d";

export type ModeracaoEstado = {
  pendentes: UsuarioPendenteModeracao[];
};

function idsStatusDoItem(item: UsuarioPendenteModeracao): string[] {
  const usuarioId = item.cadastro.usuario.id;
  if (item.tipo === "influenciador") {
    return [usuarioId, item.cadastro.influenciador.id];
  }
  if (item.tipo === "empresa") {
    return [usuarioId, item.cadastro.empresa.id];
  }
  return [usuarioId, item.cadastro.agencia.id];
}

export function carregarEstadoModeracao(): ModeracaoEstado {
  if (typeof window === "undefined") {
    return { pendentes: USUARIOS_PENDENTES_MODERACAO_MOCK };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { pendentes: USUARIOS_PENDENTES_MODERACAO_MOCK };
    }
    const parsed = JSON.parse(raw) as ModeracaoEstado;
    if (!Array.isArray(parsed.pendentes)) {
      return { pendentes: USUARIOS_PENDENTES_MODERACAO_MOCK };
    }
    return parsed;
  } catch {
    return { pendentes: USUARIOS_PENDENTES_MODERACAO_MOCK };
  }
}

export function salvarEstadoModeracao(estado: ModeracaoEstado): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

export function resetarEstadoModeracao(): ModeracaoEstado {
  const estado = { pendentes: USUARIOS_PENDENTES_MODERACAO_MOCK };
  salvarEstadoModeracao(estado);
  return estado;
}

export function getNomeExibicao(item: UsuarioPendenteModeracao): string {
  switch (item.tipo) {
    case "influenciador":
      return item.cadastro.influenciador.nome;
    case "empresa":
      return item.cadastro.empresa.razaoSocial;
    case "agencia":
      return item.cadastro.agencia.razaoSocial;
  }
}

export function getUsuarioId(item: UsuarioPendenteModeracao): string {
  return item.cadastro.usuario.id;
}

export function formatarDataCadastro(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function filtrarPendentes(
  pendentes: UsuarioPendenteModeracao[],
  tipo: FiltroTipoUsuario,
  data: FiltroDataCadastro,
): UsuarioPendenteModeracao[] {
  const agora = Date.now();

  return pendentes.filter((item) => {
    if (tipo !== "todos" && item.tipo !== tipo) return false;

    if (data === "todos") return true;

    const criado = new Date(item.cadastro.usuario.criadoEm).getTime();
    const limiteMs = data === "7d" ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
    return agora - criado <= limiteMs;
  });
}

function aplicarDecisaoModeracao(
  estado: ModeracaoEstado,
  usuarioId: string,
  status: Usuario["status"],
): ModeracaoEstado {
  const item = estado.pendentes.find((p) => getUsuarioId(p) === usuarioId);
  if (item) {
    definirStatusConta(idsStatusDoItem(item), status);
  }
  return {
    pendentes: estado.pendentes.filter(
      (p) => getUsuarioId(p) !== usuarioId,
    ),
  };
}

export function aprovarUsuario(
  estado: ModeracaoEstado,
  usuarioId: string,
): ModeracaoEstado {
  return aplicarDecisaoModeracao(estado, usuarioId, "ativo");
}

export function rejeitarUsuario(
  estado: ModeracaoEstado,
  usuarioId: string,
): ModeracaoEstado {
  return aplicarDecisaoModeracao(estado, usuarioId, "suspenso");
}
