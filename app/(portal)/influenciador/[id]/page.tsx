import { PortfolioPublicoFlow } from "@/components/influenciador/portfolio/portfolio-publico-flow";

export const metadata = {
  title: "Portfólio do creator",
  description: "Vitrine pública do influenciador na Publi.",
};

type InfluenciadorPortfolioPageProps = {
  params: { id: string };
};

export default function InfluenciadorPortfolioPage({
  params,
}: InfluenciadorPortfolioPageProps) {
  return <PortfolioPublicoFlow portfolioId={params.id} />;
}
