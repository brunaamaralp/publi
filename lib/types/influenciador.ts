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
