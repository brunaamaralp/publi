import type {
  Agencia,
  AudienciaDemografia,
  Categoria,
  Empresa,
  Equipamento,
  Influenciador,
  MetricaPerfil,
} from "@/lib/types";
import type { PublicoAlvoDemanda } from "@/lib/types/demanda";
import type { Usuario } from "@/lib/types/usuario";

export type ClienteAgenciaMock = {
  id: string;
  razaoSocial: string;
  segmento: string;
};

export type CadastroInfluenciadorPendente = {
  usuario: Usuario;
  influenciador: Influenciador;
  categorias: Categoria[];
  equipamentos: Equipamento[];
  metricaPerfil: MetricaPerfil;
  audiencia: AudienciaDemografia[];
};

export type CadastroEmpresaPendente = {
  usuario: Usuario;
  empresa: Empresa;
  orcamentoMedioCampanha?: number;
  publicoAlvo: PublicoAlvoDemanda[];
};

export type CadastroAgenciaPendente = {
  usuario: Usuario;
  agencia: Agencia;
  clientesVinculados: ClienteAgenciaMock[];
};

export type UsuarioPendenteModeracao =
  | { tipo: "influenciador"; cadastro: CadastroInfluenciadorPendente }
  | { tipo: "empresa"; cadastro: CadastroEmpresaPendente }
  | { tipo: "agencia"; cadastro: CadastroAgenciaPendente };

function usuario(
  id: string,
  email: string,
  tipo: Usuario["tipo"],
  criadoEm: string,
): Usuario {
  return {
    id,
    email,
    tipo,
    status: "pendente_verificacao",
    criadoEm,
  };
}

export const USUARIOS_PENDENTES_MODERACAO_MOCK: UsuarioPendenteModeracao[] = [
  {
    tipo: "influenciador",
    cadastro: {
      usuario: usuario(
        "usr-mod-001",
        "marina.beauty@email.com",
        "influenciador",
        "2026-07-01T14:22:00.000Z",
      ),
      influenciador: {
        id: "inf-mod-001",
        usuarioId: "usr-mod-001",
        nome: "Marina Souza",
        bio: "Criadora de conteúdo de beleza e skincare. Foco em rotinas acessíveis e reviews honestos de produtos nacionais.",
        plano: "pro",
        nivelAtual: 1,
        pontosXp: 0,
        notaMediaAvaliacao: null,
        totalAvaliacoes: 0,
        tiposAtuacao: ["influenciador"],
      },
      categorias: [
        { id: "cat-1", nome: "Beleza", tipo: "dominio" },
        { id: "cat-2", nome: "Skincare", tipo: "dominio" },
        { id: "cat-3", nome: "Lifestyle", tipo: "interesse" },
      ],
      equipamentos: [
        { id: "eq-1", tipo: "Ring light", descricao: "60cm com tripé" },
        { id: "eq-2", tipo: "Microfone", descricao: "Lapela sem fio" },
      ],
      metricaPerfil: {
        id: "met-001",
        dataReferencia: "2026-06-28",
        seguidores: 48200,
        engajamentoMedio: 4.8,
        alcanceMedio: 18500,
        printUrl: "/placeholder-audiencia.png",
        statusValidacao: "pendente",
      },
      audiencia: [
        { dimensao: "genero", valor: "feminino", percentual: 78 },
        { dimensao: "genero", valor: "masculino", percentual: 22 },
        { dimensao: "faixa_etaria", valor: "18-24", percentual: 42 },
        { dimensao: "faixa_etaria", valor: "25-34", percentual: 38 },
        { dimensao: "localidade", valor: "São Paulo", percentual: 31 },
        { dimensao: "localidade", valor: "Rio de Janeiro", percentual: 18 },
      ],
    },
  },
  {
    tipo: "empresa",
    cadastro: {
      usuario: usuario(
        "usr-mod-002",
        "contato@vitaminasol.com.br",
        "empresa",
        "2026-07-02T09:15:00.000Z",
      ),
      empresa: {
        id: "emp-mod-002",
        usuarioId: "usr-mod-002",
        razaoSocial: "Vitamina Sol Suplementos Ltda",
        segmento: "Saúde e bem-estar",
      },
      orcamentoMedioCampanha: 12000,
      publicoAlvo: [
        { dimensao: "genero", valor: "todos" },
        { dimensao: "faixa_etaria", valor: "25-44" },
        { dimensao: "localidade", valor: "Brasil" },
      ],
    },
  },
  {
    tipo: "influenciador",
    cadastro: {
      usuario: usuario(
        "usr-mod-003",
        "lucas.tech@email.com",
        "influenciador",
        "2026-07-03T18:40:00.000Z",
      ),
      influenciador: {
        id: "inf-mod-003",
        usuarioId: "usr-mod-003",
        nome: "Lucas Ferreira",
        bio: "Reviews de gadgets, setups e dicas de produtividade para criadores. Conteúdo em PT-BR com tom descontraído.",
        plano: "basico",
        nivelAtual: 1,
        pontosXp: 0,
        notaMediaAvaliacao: null,
        totalAvaliacoes: 0,
        tiposAtuacao: ["influenciador"],
      },
      categorias: [
        { id: "cat-4", nome: "Tecnologia", tipo: "dominio" },
        { id: "cat-5", nome: "Games", tipo: "interesse" },
      ],
      equipamentos: [
        { id: "eq-3", tipo: "Câmera", descricao: "Sony ZV-E10" },
        { id: "eq-4", tipo: "Estúdio", descricao: "Home office com chroma" },
      ],
      metricaPerfil: {
        id: "met-003",
        dataReferencia: "2026-07-01",
        seguidores: 128000,
        engajamentoMedio: 3.2,
        alcanceMedio: 42000,
        printUrl: "/placeholder-audiencia.png",
        statusValidacao: "pendente",
      },
      audiencia: [
        { dimensao: "genero", valor: "masculino", percentual: 64 },
        { dimensao: "genero", valor: "feminino", percentual: 36 },
        { dimensao: "faixa_etaria", valor: "18-24", percentual: 35 },
        { dimensao: "faixa_etaria", valor: "25-34", percentual: 45 },
        { dimensao: "localidade", valor: "Brasil", percentual: 72 },
      ],
    },
  },
  {
    tipo: "agencia",
    cadastro: {
      usuario: usuario(
        "usr-mod-004",
        "ops@pulsemedia.com.br",
        "agencia",
        "2026-07-04T11:00:00.000Z",
      ),
      agencia: {
        id: "ag-mod-004",
        usuarioId: "usr-mod-004",
        razaoSocial: "Pulse Media Agência Digital",
      },
      clientesVinculados: [
        {
          id: "emp-cli-01",
          razaoSocial: "Café Aroma Especial",
          segmento: "Alimentos e bebidas",
        },
        {
          id: "emp-cli-02",
          razaoSocial: "FitRun Calçados",
          segmento: "Moda esportiva",
        },
      ],
    },
  },
  {
    tipo: "empresa",
    cadastro: {
      usuario: usuario(
        "usr-mod-005",
        "marketing@modafit.com",
        "empresa",
        "2026-07-05T16:30:00.000Z",
      ),
      empresa: {
        id: "emp-mod-005",
        usuarioId: "usr-mod-005",
        razaoSocial: "ModaFit Confecções S.A.",
        segmento: "Moda e vestuário",
      },
      orcamentoMedioCampanha: 25000,
      publicoAlvo: [
        { dimensao: "genero", valor: "feminino" },
        { dimensao: "faixa_etaria", valor: "18-34" },
        { dimensao: "localidade", valor: "Sudeste" },
      ],
    },
  },
  {
    tipo: "influenciador",
    cadastro: {
      usuario: usuario(
        "usr-mod-006",
        "rafa.fitness@email.com",
        "influenciador",
        "2026-07-06T08:05:00.000Z",
      ),
      influenciador: {
        id: "inf-mod-006",
        usuarioId: "usr-mod-006",
        nome: "Rafa Oliveira",
        bio: "Personal trainer e nutricionista esportivo. Treinos em casa, receitas fit e parcerias com marcas de suplementos.",
        plano: "elite",
        nivelAtual: 2,
        pontosXp: 340,
        notaMediaAvaliacao: null,
        totalAvaliacoes: 0,
        tiposAtuacao: ["influenciador"],
      },
      categorias: [
        { id: "cat-6", nome: "Fitness", tipo: "dominio" },
        { id: "cat-7", nome: "Nutrição", tipo: "dominio" },
      ],
      equipamentos: [
        { id: "eq-5", tipo: "Iluminação", descricao: "Softbox duplo" },
      ],
      metricaPerfil: {
        id: "met-006",
        dataReferencia: "2026-07-04",
        seguidores: 215000,
        engajamentoMedio: 5.1,
        alcanceMedio: 68000,
        printUrl: "/placeholder-audiencia.png",
        statusValidacao: "pendente",
      },
      audiencia: [
        { dimensao: "genero", valor: "masculino", percentual: 55 },
        { dimensao: "genero", valor: "feminino", percentual: 45 },
        { dimensao: "faixa_etaria", valor: "25-34", percentual: 48 },
        { dimensao: "faixa_etaria", valor: "35-44", percentual: 28 },
        { dimensao: "localidade", valor: "Brasil", percentual: 85 },
      ],
    },
  },
  {
    tipo: "agencia",
    cadastro: {
      usuario: usuario(
        "usr-mod-007",
        "contato@nexusbrands.com",
        "agencia",
        "2026-07-07T13:20:00.000Z",
      ),
      agencia: {
        id: "ag-mod-007",
        usuarioId: "usr-mod-007",
        razaoSocial: "Nexus Brands Comunicação",
      },
      clientesVinculados: [
        {
          id: "emp-cli-03",
          razaoSocial: "EcoClean Produtos Sustentáveis",
          segmento: "Casa e limpeza",
        },
      ],
    },
  },
  {
    tipo: "empresa",
    cadastro: {
      usuario: usuario(
        "usr-mod-008",
        "parcerias@petlovebox.com",
        "empresa",
        "2026-07-08T10:45:00.000Z",
      ),
      empresa: {
        id: "emp-mod-008",
        usuarioId: "usr-mod-008",
        razaoSocial: "PetLove Box Assinaturas Ltda",
        segmento: "Pet care",
      },
      orcamentoMedioCampanha: 8000,
      publicoAlvo: [
        { dimensao: "genero", valor: "todos" },
        { dimensao: "faixa_etaria", valor: "25-54" },
        { dimensao: "localidade", valor: "Capitais" },
      ],
    },
  },
  {
    tipo: "influenciador",
    cadastro: {
      usuario: usuario(
        "usr-mod-009",
        "julia.viagens@email.com",
        "influenciador",
        "2026-07-09T19:10:00.000Z",
      ),
      influenciador: {
        id: "inf-mod-009",
        usuarioId: "usr-mod-009",
        nome: "Júlia Campos",
        bio: "Viagens nacionais, hospedagens boutique e roteiros para casais. Parcerias com turismo e hotelaria.",
        plano: "pro",
        nivelAtual: 1,
        pontosXp: 0,
        notaMediaAvaliacao: null,
        totalAvaliacoes: 0,
        tiposAtuacao: ["influenciador"],
      },
      categorias: [
        { id: "cat-8", nome: "Viagens", tipo: "dominio" },
        { id: "cat-9", nome: "Gastronomia", tipo: "interesse" },
      ],
      equipamentos: [
        { id: "eq-6", tipo: "Drone", descricao: "DJI Mini 3" },
        { id: "eq-7", tipo: "Gimbal", descricao: "Estabilizador portátil" },
      ],
      metricaPerfil: {
        id: "met-009",
        dataReferencia: "2026-07-07",
        seguidores: 67300,
        engajamentoMedio: 6.2,
        alcanceMedio: 24000,
        printUrl: "/placeholder-audiencia.png",
        statusValidacao: "pendente",
      },
      audiencia: [
        { dimensao: "genero", valor: "feminino", percentual: 62 },
        { dimensao: "genero", valor: "masculino", percentual: 38 },
        { dimensao: "faixa_etaria", valor: "25-34", percentual: 52 },
        { dimensao: "localidade", valor: "Sudeste", percentual: 44 },
        { dimensao: "localidade", valor: "Nordeste", percentual: 22 },
      ],
    },
  },
  {
    tipo: "agencia",
    cadastro: {
      usuario: usuario(
        "usr-mod-010",
        "admin@creatorhub.ag",
        "agencia",
        "2026-07-10T07:55:00.000Z",
      ),
      agencia: {
        id: "ag-mod-010",
        usuarioId: "usr-mod-010",
        razaoSocial: "Creator Hub Influencer Marketing",
      },
      clientesVinculados: [
        {
          id: "emp-cli-04",
          razaoSocial: "Glow Cosmetics Brasil",
          segmento: "Beleza",
        },
        {
          id: "emp-cli-05",
          razaoSocial: "StreamBox Entretenimento",
          segmento: "Streaming e mídia",
        },
        {
          id: "emp-cli-06",
          razaoSocial: "VerdeVida Orgânicos",
          segmento: "Alimentação",
        },
      ],
    },
  },
];
