import { Suspense } from "react";

import { DemandaDetalheFlow } from "@/components/influenciador/demandas/demanda-detalhe-flow";

export const metadata = {
  title: "Detalhes da demanda",
  description: "Briefing completo, match e ação para esta oportunidade.",
};

type DemandaDetalhePageProps = {
  params: { id: string };
};

export default function DemandaDetalhePage({ params }: DemandaDetalhePageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-full bg-fundo-pagina">
          <div className="mx-auto max-w-3xl px-4 py-8">
            <p className="text-texto-secundario text-sm">Carregando demanda…</p>
          </div>
        </div>
      }
    >
      <DemandaDetalheFlow demandaId={params.id} />
    </Suspense>
  );
}
