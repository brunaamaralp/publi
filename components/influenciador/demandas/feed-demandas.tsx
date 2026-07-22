"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  DemandaCard,
  DemandaListaVazia,
} from "@/components/influenciador/demandas/demanda-card";
import {
  FiltrosDemandas,
  type FiltrosDemanda,
} from "@/components/influenciador/demandas/filtros-demandas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-context";
import {
  demandaVisivelNaBusca,
  parseQueryDemandas,
  serializarQueryDemandas,
  type OrdenacaoDemanda,
} from "@/lib/demandas/utils";
import {
  listarDemandasFeed,
  type DemandaFeedItem,
} from "@/lib/mock-data/demandas";
import { perfilInfluenciadorConcluido } from "@/lib/influenciador/perfil-storage";

function ordenarItens(
  itens: DemandaFeedItem[],
  ordenacao: OrdenacaoDemanda,
): DemandaFeedItem[] {
  const copia = [...itens];
  switch (ordenacao) {
    case "maior_orcamento":
      return copia.sort(
        (a, b) => b.demanda.orcamento - a.demanda.orcamento,
      );
    case "mais_recente":
      return copia.sort(
        (a, b) =>
          new Date(b.publicadoEm).getTime() -
          new Date(a.publicadoEm).getTime(),
      );
    case "melhor_match":
    default:
      return copia.sort((a, b) => b.match.score - a.match.score);
  }
}

function aplicarFiltros(
  itens: DemandaFeedItem[],
  filtros: FiltrosDemanda,
): DemandaFeedItem[] {
  return itens.filter((item) => {
    if (!demandaVisivelNaBusca(item.demanda.status)) {
      return false;
    }
    if (
      filtros.formato !== "todos" &&
      item.demanda.formatoEntrega !== filtros.formato
    ) {
      return false;
    }
    if (item.demanda.orcamento < filtros.orcamentoMinimo) {
      return false;
    }
    return true;
  });
}

function FeedDemandasInner() {
  const { usuario } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsed = useMemo(
    () => parseQueryDemandas(searchParams),
    [searchParams],
  );

  const [perfilPronto, setPerfilPronto] = useState(false);
  const [itens, setItens] = useState<DemandaFeedItem[]>([]);
  const [filtros, setFiltros] = useState<FiltrosDemanda>(() => ({
    formato: parsed.formato,
    orcamentoMinimo: parsed.orcamentoMinimo,
    ordenacao: parsed.ordenacao,
  }));
  const [recusarMatchId, setRecusarMatchId] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState(parsed.aba);

  useEffect(() => {
    setFiltros({
      formato: parsed.formato,
      orcamentoMinimo: parsed.orcamentoMinimo,
      ordenacao: parsed.ordenacao,
    });
    setAbaAtiva(parsed.aba);
  }, [parsed]);

  useEffect(() => {
    if (!usuario) {
      setPerfilPronto(false);
      setItens([]);
      return;
    }
    const concluido = perfilInfluenciadorConcluido(usuario.id);
    setPerfilPronto(concluido);
    setItens(concluido ? listarDemandasFeed() : []);
  }, [usuario]);

  const queryFeed = useMemo(
    () =>
      serializarQueryDemandas({
        ...filtros,
        aba: abaAtiva,
      }),
    [filtros, abaAtiva],
  );

  function sincronizarUrl(prox: FiltrosDemanda, aba: string) {
    const qs = serializarQueryDemandas({ ...prox, aba });
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function handleFiltrosChange(prox: FiltrosDemanda) {
    setFiltros(prox);
    sincronizarUrl(prox, abaAtiva);
  }

  function handleAbaChange(aba: string) {
    setAbaAtiva(aba);
    sincronizarUrl(filtros, aba);
  }

  const sugeridos = useMemo(() => {
    const base = itens.filter((i) => i.match.status === "sugerido");
    return ordenarItens(aplicarFiltros(base, filtros), filtros.ordenacao);
  }, [itens, filtros]);

  const enviados = useMemo(() => {
    const base = itens.filter((i) => i.match.status === "aceito");
    return ordenarItens(aplicarFiltros(base, filtros), filtros.ordenacao);
  }, [itens, filtros]);

  const itemRecusar = itens.find((i) => i.match.id === recusarMatchId);

  function handleInteresse(matchId: string) {
    setItens((prev) =>
      prev.map((item) =>
        item.match.id === matchId
          ? { ...item, match: { ...item.match, status: "aceito" as const } }
          : item,
      ),
    );
    toast.success(
      "Interesse enviado — a empresa verá seu perfil nesta demanda.",
    );
    handleAbaChange("enviados");
  }

  function confirmarRecusa() {
    if (!recusarMatchId) return;
    setItens((prev) =>
      prev.filter((item) => item.match.id !== recusarMatchId),
    );
    toast("Oportunidade removida da sua lista.");
    setRecusarMatchId(null);
  }

  const totalDisponiveis = sugeridos.length + enviados.length;

  if (!perfilPronto) {
    return (
      <div className="min-h-full bg-fundo-pagina">
        <div className="mx-auto max-w-lg px-4 py-8">
          <header className="mb-6">
            <p className="text-texto-secundario text-sm font-medium">
              Oportunidades
            </p>
            <h1 className="font-display mt-1 text-2xl font-bold tracking-tight">
              Demandas para você
            </h1>
          </header>
          <DemandaListaVazia
            mensagem="Complete seu perfil de influenciador para ver oportunidades compatíveis com você."
            mostrarLinkPerfil
          />
        </div>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="min-h-full bg-fundo-pagina">
        <div className="mx-auto max-w-lg px-4 py-8">
          <DemandaListaVazia />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-fundo-pagina">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-8">
        <header className="mb-6 max-w-2xl">
          <p className="text-texto-secundario text-sm font-medium">
            Oportunidades
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Demandas para você
          </h1>
          <p className="text-texto-secundario mt-2 text-sm font-normal leading-relaxed">
            Cada oportunidade traz um score de compatibilidade com o seu perfil.
            Foque nos percentuais mais altos para aumentar a chance de fechar.
          </p>
        </header>

        <FiltrosDemandas
          filtros={filtros}
          onChange={handleFiltrosChange}
          className="mb-6"
        />

        <Tabs value={abaAtiva} onValueChange={handleAbaChange}>
          <TabsList className="mb-4 w-full max-w-md">
            <TabsTrigger value="para-voce" className="flex-1">
              Para você
              {sugeridos.length > 0 ? (
                <span className="text-texto-secundario font-data ml-1">
                  ({sugeridos.length})
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="enviados" className="flex-1">
              Enviados
              {enviados.length > 0 ? (
                <span className="text-texto-secundario font-data ml-1">
                  ({enviados.length})
                </span>
              ) : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="para-voce">
            {sugeridos.length === 0 ? (
              <DemandaListaVazia
                mensagem={
                  totalDisponiveis === 0
                    ? "Nenhuma demanda disponível no momento — complete seu perfil para aparecer em mais buscas."
                    : "Nenhuma demanda corresponde aos filtros selecionados. Tente ajustar formato ou orçamento mínimo."
                }
                mostrarLinkPerfil={totalDisponiveis === 0}
              />
            ) : (
              <ul
                className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3"
                aria-label="Demandas sugeridas"
              >
                {sugeridos.map((item) => (
                  <li key={item.match.id} className="min-w-0">
                    <DemandaCard
                      item={item}
                      onInteresse={handleInteresse}
                      onRecusar={setRecusarMatchId}
                      queryFeed={queryFeed}
                    />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="enviados">
            {enviados.length === 0 ? (
              <DemandaListaVazia
                mensagem="Você ainda não demonstrou interesse em nenhuma demanda. Explore a aba 'Para você' e clique em 'Tenho interesse'."
                mostrarLinkPerfil={false}
              />
            ) : (
              <ul
                className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3"
                aria-label="Demandas com interesse enviado"
              >
                {enviados.map((item) => (
                  <li key={item.match.id} className="min-w-0">
                    <DemandaCard
                      item={item}
                      onInteresse={handleInteresse}
                      onRecusar={setRecusarMatchId}
                      modoEnviado
                      queryFeed={queryFeed}
                    />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <Dialog
          open={recusarMatchId !== null}
          onOpenChange={(open) => {
            if (!open) setRecusarMatchId(null);
          }}
        >
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Remover esta oportunidade?</DialogTitle>
              <DialogDescription>
                {itemRecusar
                  ? `“${itemRecusar.demanda.titulo}” sai da sua lista. Você não poderá desfazer esta ação.`
                  : "Esta oportunidade será removida da sua lista."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRecusarMatchId(null)}
              >
                Manter
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmarRecusa}
              >
                Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function FeedDemandas() {
  return (
    <Suspense
      fallback={
        <div className="min-h-full bg-fundo-pagina">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <p className="text-texto-secundario text-sm">Carregando demandas…</p>
          </div>
        </div>
      }
    >
      <FeedDemandasInner />
    </Suspense>
  );
}
