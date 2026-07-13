import { PagamentoFlow } from "@/components/pagamento/pagamento-flow";

export const metadata = {
  title: "Pagamento e entrega",
  description: "Depósito protegido, entrega e liberação de pagamento.",
};

type PagamentoContratoPageProps = {
  params: { contratoId: string };
};

export default function PagamentoContratoPage({
  params,
}: PagamentoContratoPageProps) {
  return <PagamentoFlow contratoId={params.contratoId} />;
}
