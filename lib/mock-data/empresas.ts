import type { Empresa } from "@/lib/types";

/** Empresa já cadastrada na plataforma (mock para busca da agência). */
export type EmpresaPlataforma = Empresa & {
  nomeFantasia?: string;
};

export const EMPRESAS_PLATAFORMA_MOCK: EmpresaPlataforma[] = [
  {
    id: "emp-plat-001",
    usuarioId: "usr-emp-001",
    razaoSocial: "Glow Cosmetics Brasil Ltda.",
    nomeFantasia: "Glow Cosmetics",
    segmento: "Beleza",
  },
  {
    id: "emp-plat-002",
    usuarioId: "usr-emp-002",
    razaoSocial: "Pixel Games Interativos S.A.",
    nomeFantasia: "Pixel Games",
    segmento: "Games",
  },
  {
    id: "emp-plat-003",
    usuarioId: "usr-emp-003",
    razaoSocial: "InvestFácil Tecnologia Financeira Ltda.",
    nomeFantasia: "InvestFácil",
    segmento: "Finanças",
  },
  {
    id: "emp-plat-004",
    usuarioId: "usr-emp-004",
    razaoSocial: "Urban Style Moda Ltda.",
    nomeFantasia: "Urban Style",
    segmento: "Moda",
  },
  {
    id: "emp-plat-005",
    usuarioId: "usr-emp-005",
    razaoSocial: "Sabor & Arte Alimentos S.A.",
    nomeFantasia: "Sabor & Arte",
    segmento: "Culinária",
  },
  {
    id: "emp-plat-006",
    usuarioId: "usr-emp-006",
    razaoSocial: "Nexa Solutions Software Ltda.",
    nomeFantasia: "Nexa Solutions",
    segmento: "Tecnologia",
  },
  {
    id: "emp-plat-007",
    usuarioId: "usr-emp-007",
    razaoSocial: "Vida Ativa Suplementos Ltda.",
    nomeFantasia: "Vida Ativa",
    segmento: "Fitness",
  },
  {
    id: "emp-plat-008",
    usuarioId: "usr-emp-008",
    razaoSocial: "PetLove Brasil Comércio Ltda.",
    nomeFantasia: "PetLove",
    segmento: "Pets",
  },
  {
    id: "emp-plat-009",
    usuarioId: "usr-emp-009",
    razaoSocial: "EcoVerde Sustentabilidade S.A.",
    nomeFantasia: "EcoVerde",
    segmento: "Sustentabilidade",
  },
  {
    id: "emp-plat-010",
    usuarioId: "usr-emp-010",
    razaoSocial: "Mundo Kids Educação Infantil Ltda.",
    nomeFantasia: "Mundo Kids",
    segmento: "Educação",
  },
];
