import { ResultadosEmpresaFlow } from "@/components/resultados/resultados-empresa-flow";

export const metadata = {
  title: "Resultados da campanha",
  description: "Visualize ou solicite resultados de campanhas concluídas.",
};

type ResultadosContratoPageProps = {
  params: { contratoId: string };
};

export default function ResultadosContratoPage({
  params,
}: ResultadosContratoPageProps) {
  return <ResultadosEmpresaFlow contratoId={params.contratoId} />;
}
