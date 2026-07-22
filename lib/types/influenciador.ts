export type TipoAtuacao = "influenciador" | "modelo";

/** Dias da semana em que o creator topa ensaios/gravações. */
export type DiaSemana =
  | "dom"
  | "seg"
  | "ter"
  | "qua"
  | "qui"
  | "sex"
  | "sab";

export type DisponibilidadeInfluenciador = {
  diasSemana: DiaSemana[];
  observacao?: string;
  /**
   * Datas ISO (`YYYY-MM-DD`) ocupadas por contratos (dia inteiro).
   * Gerenciadas pelo fluxo de pagamento — não editar manualmente.
   */
  datasIndisponiveis?: string[];
  /**
   * Datas ISO (`YYYY-MM-DD`) bloqueadas pelo próprio creator
   * (férias, folga, indisponibilidade pontual).
   */
  datasBloqueadas?: string[];
};

/** Mídia própria do portfólio (foto/vídeo) — sem links externos de rede social. */
export type Midia = {
  id: string;
  tipo: "foto" | "video";
  url: string;
  legenda?: string;
  categoria: "apresentacao" | "trabalho_anterior";
};

export type Influenciador = {
  id: string;
  usuarioId: string;
  nome: string;
  bio: string;
  plano: "basico" | "pro" | "elite";
  nivelAtual: number;
  pontosXp: number;
  notaMediaAvaliacao: number | null; // cache, null se ainda não tem avaliação
  totalAvaliacoes: number;
  /**
   * Papéis de atuação no mesmo cadastro.
   * Pode ser os dois ao mesmo tempo (ex.: influenciador de moda que também faz ensaio).
   * Default implícito para cadastros antigos: `['influenciador']`.
   */
  tiposAtuacao: TipoAtuacao[];
  /** Só relevante quando `tiposAtuacao` inclui `'modelo'`. */
  disponibilidade?: DisponibilidadeInfluenciador;
  /**
   * Galeria pública: vídeo de apresentação + fotos/vídeos de trabalhos.
   * Nunca inclui URL de perfil em rede social externa.
   */
  midias: Midia[];
};

export type Categoria = {
  id: string;
  nome: string;
  tipo: "dominio" | "interesse";
};

export type MetricaPerfil = {
  id: string;
  dataReferencia: string;
  seguidores: number;
  engajamentoMedio: number; // percentual, ex: 4.2
  alcanceMedio?: number;
  printUrl: string;
  statusValidacao: "pendente" | "validado" | "rejeitado";
};

export type AudienciaDemografia = {
  dimensao: "genero" | "faixa_etaria" | "localidade";
  valor: string; // ex: "feminino", "18-24", "São Paulo"
  percentual: number;
};

export type Equipamento = {
  id: string;
  tipo: string; // ex: "câmera", "iluminação", "estúdio"
  descricao?: string;
};

export type PacoteServico = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  itensInclusos: string[];
  ativo: boolean;
};

export type TabelaPreco = {
  id: string;
  tipoServico: "reels" | "stories" | "post_feed" | "unboxing" | "live";
  precoBaseSugerido: number;
  precoPraticado: number;
};
