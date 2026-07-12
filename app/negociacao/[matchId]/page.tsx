import { NegociacaoFlow } from "@/components/negociacao/negociacao-flow";

export const metadata = {
  title: "Negociação",
  description: "Chat e contrato entre empresa e influenciador.",
};

type NegociacaoPageProps = {
  params: { matchId: string };
};

export default function NegociacaoPage({ params }: NegociacaoPageProps) {
  return <NegociacaoFlow matchId={params.matchId} />;
}
