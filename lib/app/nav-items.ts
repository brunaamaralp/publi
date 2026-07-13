import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
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
    titulo: "Influenciador",
    itens: [
      {
        href: "/influenciador/demandas",
        label: "Oportunidades",
        icone: FileText,
        descricao: "Campanhas compatíveis com seu perfil",
        rotasRelacionadas: ["/negociacao"],
      },
      {
        href: "/influenciador/treinamentos",
        label: "Treinamentos",
        icone: GraduationCap,
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
        href: "/empresa/resultados",
        label: "Resultados",
        icone: BarChart3,
        rotasRelacionadas: ["/resultados"],
      },
    ],
  },
  {
    titulo: "Agência",
    itens: [
      {
        href: "/agencia/dashboard",
        label: "Painel consolidado",
        icone: LayoutDashboard,
      },
    ],
  },
  {
    titulo: "Cliente ativo",
    itens: [
      {
        href: "/empresa/demandas",
        label: "Campanhas do cliente",
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
        href: "/empresa/resultados",
        label: "Resultados",
        icone: BarChart3,
        rotasRelacionadas: ["/resultados"],
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
  influenciador: ["Geral", "Influenciador"],
  empresa: ["Geral", "Campanhas"],
  agencia: ["Geral", "Agência", "Cliente ativo"],
  admin: ["Geral", "Administração"],
};

export function navGruposParaUsuario(tipo: Usuario["tipo"]): NavGrupo[] {
  const permitidos = new Set(GRUPOS_POR_TIPO[tipo]);
  return NAV_GRUPOS.filter((grupo) => permitidos.has(grupo.titulo));
}
