import {
  USUARIOS_PENDENTES_MODERACAO_MOCK,
  type CadastroInfluenciadorPendente,
  type UsuarioPendenteModeracao,
} from "@/lib/mock-data/moderacao";
import { definirStatusConta } from "@/lib/mock-data/influenciadores-status";
import {
  atualizarStatusCreatorExtra,
  registrarCreatorAprovadoDoCadastro,
} from "@/lib/empresa/creators-catalogo-extras";
import { ehSomenteModelo } from "@/lib/influenciador/atuacao-utils";
import type { CadastroPayload } from "@/lib/influenciador/cadastro-utils";
import { perfilProntoParaAnalise } from "@/lib/influenciador/cadastro-utils";
import { carregarPortfolioPorId } from "@/lib/influenciador/portfolio-storage";
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

function trabalhosDoCadastro(
  cadastro: Pick<CadastroInfluenciadorPendente, "usuario" | "influenciador">,
): number {
  if (typeof window === "undefined") return 0;
  const portfolio =
    carregarPortfolioPorId(cadastro.influenciador.id) ??
    carregarPortfolioPorId(`inf-${cadastro.usuario.id}`);
  return (
    portfolio?.trabalhos.filter(
      (t) => t.titulo.trim().length > 0 || t.marca.trim().length > 0,
    ).length ?? 0
  );
}

/** Gate de moderação: print (influenciador) ou portfólio de trabalhos (só modelo). */
export function influenciadorElegivelParaModeracao(
  cadastro: Pick<
    CadastroInfluenciadorPendente,
    "metricaPerfil" | "influenciador" | "usuario"
  >,
): boolean {
  return perfilProntoParaAnalise(cadastro, {
    trabalhosAnteriores: ehSomenteModelo(cadastro.influenciador.tiposAtuacao)
      ? trabalhosDoCadastro(cadastro)
      : undefined,
  });
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

/**
 * Enfileira o influenciador para moderação após o print de métricas.
 * Idempotente: atualiza o cadastro se já estiver na fila.
 * Não enfileira se ainda não houver print (gate do Prompt 14).
 */
export function enfileirarInfluenciadorParaModeracao(
  payload: CadastroPayload,
): ModeracaoEstado {
  const estado = carregarEstadoModeracao();
  if (!influenciadorElegivelParaModeracao(payload)) {
    return estado;
  }

  const cadastro: CadastroInfluenciadorPendente = {
    usuario: {
      ...payload.usuario,
      status: "pendente_verificacao",
    },
    influenciador: payload.influenciador,
    categorias: payload.categorias,
    equipamentos: payload.equipamentos,
    metricaPerfil: {
      ...payload.metricaPerfil,
      statusValidacao: "pendente",
    },
    audiencia: payload.audiencia,
  };

  const usuarioId = payload.usuario.id;
  const semEste = estado.pendentes.filter(
    (p) => getUsuarioId(p) !== usuarioId,
  );
  const next: ModeracaoEstado = {
    pendentes: [...semEste, { tipo: "influenciador", cadastro }],
  };
  salvarEstadoModeracao(next);
  definirStatusConta(
    [usuarioId, payload.influenciador.id],
    "pendente_verificacao",
  );
  return next;
}

export function filtrarPendentes(
  pendentes: UsuarioPendenteModeracao[],
  tipo: FiltroTipoUsuario,
  data: FiltroDataCadastro,
): UsuarioPendenteModeracao[] {
  const agora = Date.now();

  return pendentes.filter((item) => {
    if (tipo !== "todos" && item.tipo !== tipo) return false;

    // Gate: influenciador sem print não aparece para o time de moderação.
    if (
      item.tipo === "influenciador" &&
      !influenciadorElegivelParaModeracao(item.cadastro)
    ) {
      return false;
    }

    if (data === "todos") return true;

    const criado = new Date(item.cadastro.usuario.criadoEm).getTime();
    const limiteMs =
      data === "7d" ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
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
    if (item.tipo === "influenciador") {
      if (status === "ativo") {
        registrarCreatorAprovadoDoCadastro(item.cadastro);
      } else {
        atualizarStatusCreatorExtra(item.cadastro.influenciador.id, status);
      }
    }
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
