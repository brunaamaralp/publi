import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icone: LucideIcon;
  descricao?: string;
};

export type NavGrupo = {
  titulo: string;
  itens: NavItem[];
};

export const NAV_GRUPOS: NavGrupo[] = [
  {
    titulo: "Geral",
    itens: [
      { href: "/inicio", label: "Início", icone: Home },
    ],
  },
  {
    titulo: "Influenciador",
    itens: [
      {
        href: "/influenciador/demandas",
        label: "Demandas",
        icone: FileText,
        descricao: "Feed e matches",
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
      },
      {
        href: "/influenciador/resultados",
        label: "Meus resultados",
        icone: BarChart3,
      },
    ],
  },
  {
    titulo: "Empresa",
    itens: [
      {
        href: "/empresa/demandas",
        label: "Minhas demandas",
        icone: Building2,
      },
      {
        href: "/empresa/demandas/nova",
        label: "Nova demanda",
        icone: PlusCircle,
      },
      {
        href: "/resultados/ctr-cpf-001",
        label: "Resultados de campanha",
        icone: BarChart3,
      },
    ],
  },
  {
    titulo: "Agência",
    itens: [
      {
        href: "/agencia/dashboard",
        label: "Dashboard",
        icone: LayoutDashboard,
      },
    ],
  },
  {
    titulo: "Operação",
    itens: [
      {
        href: "/negociacao/match-001",
        label: "Negociação",
        icone: MessageSquare,
        descricao: "Exemplo match-001",
      },
      {
        href: "/contrato/ctr-cpf-001/pagamento",
        label: "Pagamento / escrow",
        icone: Wallet,
      },
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
