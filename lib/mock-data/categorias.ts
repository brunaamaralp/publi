import type { Categoria } from "@/lib/types";

/** Catálogo mock de categorias — o tipo (domínio/interesse) é definido na seleção. */
export const CATEGORIAS_CATALOGO: Omit<Categoria, "tipo">[] = [
  { id: "cat-beleza", nome: "Beleza" },
  { id: "cat-games", nome: "Games" },
  { id: "cat-financas", nome: "Finanças" },
  { id: "cat-maternidade", nome: "Maternidade" },
  { id: "cat-fitness", nome: "Fitness" },
  { id: "cat-culinaria", nome: "Culinária" },
  { id: "cat-viagem", nome: "Viagem" },
  { id: "cat-moda", nome: "Moda" },
  { id: "cat-tecnologia", nome: "Tecnologia" },
  { id: "cat-humor", nome: "Humor" },
  { id: "cat-pets", nome: "Pets" },
  { id: "cat-educacao", nome: "Educação" },
  { id: "cat-saude", nome: "Saúde e bem-estar" },
  { id: "cat-decoracao", nome: "Decoração" },
  { id: "cat-automotivo", nome: "Automotivo" },
  { id: "cat-esportes", nome: "Esportes" },
  { id: "cat-musica", nome: "Música" },
  { id: "cat-cinema", nome: "Cinema e séries" },
  { id: "cat-sustentabilidade", nome: "Sustentabilidade" },
  { id: "cat-empreendedorismo", nome: "Empreendedorismo" },
];
