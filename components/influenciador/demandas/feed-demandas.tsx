"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DemandaCard,
  DemandaListaVazia,
} from "@/components/influenciador/demandas/demanda-card";
import {
  FILTROS_INICIAIS,
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
import type { OrdenacaoDemanda } from "@/lib/demandas/utils";
import {
  DEMANDAS_FEED_MOCK,
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

export function FeedDemandas() {
  const { usuario } = useAuth();
  const [perfilPronto, setPerfilPronto] = useState(false);
  const [itens, setItens] = useState<DemandaFeedItem[]>([]);
  const [filtros, setFiltros] = useState<FiltrosDemanda>(FILTROS_INICIAIS);
  const [recusarMatchId, setRecusarMatchId] = useState<string | null>(null);
  const [abaAtiva, setAbaAtiva] = useState("para-voce");

  useEffect(() => {
    if (!usuario) {
      setPerfilPronto(false);
      setItens([]);
      return;
    }
    const concluido = perfilInfluenciadorConcluido(usuario.id);
    setPerfilPronto(concluido);
    setItens(concluido ? DEMANDAS_FEED_MOCK : []);
  }, [usuario]);

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
    toast.success("Interesse enviado! A empresa será notificada.");
    setAbaAtiva("enviados");
  }

  function confirmarRecusa() {
    if (!recusarMatchId) return;
    setItens((prev) =>
      prev.filter((item) => item.match.id !== recusarMatchId),
    );
    toast("Demanda recusada e removida da sua lista.");
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
      <div className="mx-auto w-full max-w-lg px-4 py-6 sm:max-w-xl sm:py-8">
        <header className="mb-6">
          <p className="text-texto-secundario text-sm font-medium">
            Oportunidades
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold tracking-tight">
            Demandas para você
          </h1>
          <p className="text-texto-secundario mt-2 text-sm font-normal">
            Ordenadas por compatibilidade com seu perfil — quanto maior o match,
            melhor a oportunidade.
          </p>
          {filtros.ordenacao === "melhor_match" && sugeridos.length > 0 ? (
            <p className="text-lilas-escuro mt-3 text-xs font-medium">
              Exibindo do maior para o menor score de match
            </p>
          ) : null}
        </header>

        <FiltrosDemandas
          filtros={filtros}
          onChange={setFiltros}
          className="mb-6"
        />

        <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
          <TabsList className="mb-4 w-full">
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

          <TabsContent value="para-voce" className="space-y-4">
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
              <ul className="space-y-4" aria-label="Demandas sugeridas">
                {sugeridos.map((item) => (
                  <li key={item.match.id}>
                    <DemandaCard
                      item={item}
                      onInteresse={handleInteresse}
                      onRecusar={setRecusarMatchId}
                    />
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="enviados" className="space-y-4">
            {enviados.length === 0 ? (
              <DemandaListaVazia
                mensagem="Você ainda não demonstrou interesse em nenhuma demanda. Explore a aba 'Para você' e clique em 'Tenho interesse'."
                mostrarLinkPerfil={false}
              />
            ) : (
              <ul
                className="space-y-4"
                aria-label="Demandas com interesse enviado"
              >
                {enviados.map((item) => (
                  <li key={item.match.id}>
                    <DemandaCard
                      item={item}
                      onInteresse={handleInteresse}
                      onRecusar={setRecusarMatchId}
                      modoEnviado
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
              <DialogTitle>Recusar esta demanda?</DialogTitle>
              <DialogDescription>
                {itemRecusar
                  ? `“${itemRecusar.demanda.titulo}” será removida da sua lista. Você não poderá desfazer esta ação.`
                  : "Esta demanda será removida da sua lista."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRecusarMatchId(null)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmarRecusa}
              >
                Recusar demanda
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
