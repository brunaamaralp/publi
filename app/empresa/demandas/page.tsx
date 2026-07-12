import { ListaMinhasDemandas } from "@/components/empresa/demandas/lista-minhas-demandas";

export const metadata = {
  title: "Minhas demandas",
  description: "Gerencie as campanhas publicadas para influenciadores.",
};

export default function MinhasDemandasPage() {
  return <ListaMinhasDemandas />;
}
