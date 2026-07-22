import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CreditCard,
  FileText,
  GraduationCap,
  Home,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import type { Usuario } from "@/lib/types/usuario";

export type NavItem = {
  href: string;
  label: string;
  icone: LucideIcon;
  descricao?: string;
  /** Visualmente indentado dentro do grupo */
  aninhado?: boolean;
  /** Rotas extras que mantêm o item ativo (ex.: detalhe fora do prefixo) */
  rotasRelacionadas?: string[];
  filhos?: NavItem[];
};

export type NavGrupo = {
  titulo: string;
  itens: NavItem[];
};

export const NAV_GRUPOS: NavGrupo[] = [
  {
    titulo: "Geral",
    itens: [{ href: "/inicio", label: "Início", icone: Home }],
  },
  {
    titulo: "Trabalho",
    itens: [
      {
        href: "/influenciador/demandas",
        label: "Oportunidades",
        icone: FileText,
        descricao: "Campanhas compatíveis com seu perfil",
        rotasRelacionadas: ["/negociacao"],
      },
      {
        href: "/influenciador/financeiro",
        label: "Financeiro",
        icone: Wallet,
        rotasRelacionadas: ["/contrato"],
      },
      {
        href: "/influenciador/resultados",
        label: "Meus resultados",
        icone: BarChart3,
      },
    ],
  },
  {
    titulo: "Perfil",
    itens: [
      {
        href: "/influenciador/meu-portfolio",
        label: "Meu portfólio",
        icone: UserRound,
        descricao: "Vitrine pública para empresas",
      },
      {
        href: "/influenciador/conta",
        label: "Conta",
        icone: Settings,
        descricao: "Dados da conta e configurações",
      },
      {
        href: "/influenciador/conta/plano",
        label: "Plano",
        icone: CreditCard,
        descricao: "Escolha ou troque sua assinatura",
      },
      {
        href: "/influenciador/treinamentos",
        label: "Treinamentos",
        icone: GraduationCap,
      },
    ],
  },
  {
    titulo: "Campanhas",
    itens: [
      {
        href: "/empresa/demandas",
        label: "Minhas campanhas",
        icone: Building2,
        rotasRelacionadas: ["/negociacao"],
      },
      {
        href: "/empresa/demandas/nova",
        label: "Nova campanha",
        icone: PlusCircle,
        aninhado: true,
      },
      {
        href: "/empresa/buscar-creators",
        label: "Buscar creators",
        icone: Search,
        descricao: "Busca ativa de influenciadores",
        rotasRelacionadas: ["/influenciador"],
      },
      {
        href: "/empresa/resultados",
        label: "Resultados",
        icone: BarChart3,
        rotasRelacionadas: ["/resultados"],
      },
      {
        href: "/empresa/financeiro",
        label: "Financeiro",
        icone: Wallet,
        descricao: "Investimento, retido e movimentações",
        rotasRelacionadas: ["/contrato"],
      },
    ],
  },
  {
    titulo: "Agência",
    itens: [
      {
        href: "/agencia/clientes",
        label: "Clientes",
        icone: Users,
        descricao: "Empresas gerenciadas pela agência",
      },
    ],
  },
  {
    titulo: "Cliente ativo",
    itens: [
      {
        href: "/agencia/demandas",
        label: "Campanhas",
        icone: Building2,
        rotasRelacionadas: ["/negociacao"],
      },
      {
        href: "/agencia/demandas/nova",
        label: "Nova campanha",
        icone: PlusCircle,
        aninhado: true,
      },
      {
        href: "/agencia/buscar-creators",
        label: "Buscar creators",
        icone: Search,
        rotasRelacionadas: ["/influenciador"],
      },
      {
        href: "/agencia/resultados",
        label: "Resultados",
        icone: BarChart3,
        rotasRelacionadas: ["/resultados"],
      },
      {
        href: "/agencia/financeiro",
        label: "Financeiro",
        icone: Wallet,
        descricao: "Investimento do cliente ou visão consolidada",
        rotasRelacionadas: ["/contrato"],
      },
    ],
  },
  {
    titulo: "Administração",
    itens: [
      {
        href: "/admin/moderacao",
        label: "Moderação",
        icone: ShieldCheck,
      },
    ],
  },
];

export const SESSAO_MOCK = {
  nome: "Ana Beatriz Silva",
  email: "ana.beauty@exemplo.com",
  tipo: "influenciador" as const,
  plano: "Pro",
};

const GRUPOS_POR_TIPO: Record<Usuario["tipo"], string[]> = {
  influenciador: ["Geral", "Trabalho", "Perfil"],
  empresa: ["Geral", "Campanhas"],
  agencia: ["Geral", "Agência", "Cliente ativo"],
  admin: ["Geral", "Administração"],
};

/** Home do perfil no sidebar (evita /inicio paralelo no menu). */
export function homeHrefParaUsuario(tipo: Usuario["tipo"]): string {
  switch (tipo) {
    case "influenciador":
      return "/influenciador";
    case "empresa":
      return "/empresa";
    case "agencia":
      return "/agencia/dashboard";
    default:
      return "/inicio";
  }
}

export function navGruposParaUsuario(tipo: Usuario["tipo"]): NavGrupo[] {
  const permitidos = new Set(GRUPOS_POR_TIPO[tipo]);
  const homeHref = homeHrefParaUsuario(tipo);

  return NAV_GRUPOS.filter((grupo) => permitidos.has(grupo.titulo)).map(
    (grupo) => {
      if (grupo.titulo !== "Geral") return grupo;
      return {
        ...grupo,
        itens: grupo.itens.map((item) =>
          item.href === "/inicio"
            ? {
                ...item,
                href: homeHref,
                rotasRelacionadas:
                  homeHref === "/inicio" ? undefined : ["/inicio"],
              }
            : item,
        ),
      };
    },
  );
}
