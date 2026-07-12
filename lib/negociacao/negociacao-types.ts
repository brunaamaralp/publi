import type { Contrato, Conversa, Mensagem } from "@/lib/types";
import type { Demanda, Match } from "@/lib/types";

export type PerfilInfluenciadorResumo = {
  id: string;
  nome: string;
  nicho: string;
  seguidores: number;
  engajamentoMedio: number;
  notaMedia: number | null;
  totalAvaliacoes: number;
};

export type NegociacaoContexto = {
  match: Match;
  demanda: Demanda;
  influenciador: PerfilInfluenciadorResumo;
  empresa: {
    id: string;
    nome: string;
    usuarioId: string;
  };
  influenciadorUsuarioId: string;
  taxaDesbloqueio: number;
};

export type EtapaContrato = "nenhuma" | "formulario" | "documento";

export type NegociacaoEstado = {
  matchId: string;
  conversa: Conversa;
  desbloqueado: boolean;
  desbloqueadoEm?: string;
  mensagens: Mensagem[];
  contrato: Contrato | null;
  etapaContrato: EtapaContrato;
  assinaturaEmpresa: boolean;
  assinaturaInfluenciador: boolean;
};
