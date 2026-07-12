import { FeedDemandas } from "@/components/influenciador/demandas/feed-demandas";

export const metadata = {
  title: "Demandas para você",
  description:
    "Oportunidades de campanha ordenadas por compatibilidade com seu perfil.",
};

export default function DemandasInfluenciadorPage() {
  return <FeedDemandas />;
}
