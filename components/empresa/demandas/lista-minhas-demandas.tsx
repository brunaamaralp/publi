"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { BadgeStatusDemanda, BORDA_LINHA_DEMANDA } from "@/components/empresa/demandas/badge-status-demanda";
import { CabecalhoDemandasEmpresa } from "@/components/empresa/demandas/cabecalho-demandas-empresa";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatarPrazo, labelFormatoEntrega } from "@/lib/demandas/utils";
import {
  cancelarDemanda,
  listarDemandasEmpresa,
} from "@/lib/empresa/demandas-utils";
import type { MinhaDemandaItem } from "@/lib/empresa/demandas-types";
import { useEmpresaPublicadora } from "@/lib/empresa/use-empresa-publicadora";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { cn } from "@/lib/utils";

export function ListaMinhasDemandas() {
  const publicador = useEmpresaPublicadora();
  const agenciaCtx = useAgenciaOpcional();
  const [itens, setItens] = useState<MinhaDemandaItem[]>([]);
  const [cancelarId, setCancelarId] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    setItens(listarDemandasEmpresa(publicador.empresaId));
  }, [publicador.empresaId]);

  useEffect(() => {
    recarregar();
  }, [recarregar, agenciaCtx?.empresaAtivaId]);

  function confirmarCancelamento() {
    if (!cancelarId) return;
    const ok = cancelarDemanda(cancelarId, publicador.empresaId);
    if (ok) {
      toast.success("Demanda cancelada.");
      recarregar();
    } else {
      toast.error("Não foi possível cancelar esta demanda.");
    }
    setCancelarId(null);
  }

  const itemCancelar = itens.find((i) => i.demanda.id === cancelarId);

  return (
    <div className="min-h-full bg-fundo-pagina">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <CabecalhoDemandasEmpresa
        titulo="Minhas demandas"
        descricao="Gerencie as campanhas publicadas para influenciadores. Cada demanda aberta vira oportunidade para criadores compatíveis."
      />

      {itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed px-6 py-16 text-center">
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Nenhuma demanda publicada ainda
          </p>
          <Link
            href="/empresa/demandas/nova"
            className={cn(
              buttonVariants(),
              "mt-6 border-transparent bg-verde-carvao-escuro text-verde-neon shadow-none hover:bg-verde-carvao hover:text-verde-neon",
            )}
          >
            <Plus className="size-4" aria-hidden />
            Publicar primeira demanda
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto overflow-y-hidden rounded-card border bg-card md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-border border-b bg-muted/40">
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sugestões</th>
                  <th className="px-4 py-3 font-medium">Orçamento</th>
                  <th className="px-4 py-3 font-medium">Prazo</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr
                    key={item.demanda.id}
                    className={cn(
                      "border-border border-b last:border-0",
                      BORDA_LINHA_DEMANDA[item.demanda.status],
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold">{item.demanda.titulo}</p>
                      <p className="text-texto-secundario mt-0.5 text-xs font-normal">
                        {labelFormatoEntrega(item.demanda.formatoEntrega)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <BadgeStatusDemanda status={item.demanda.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-data inline-flex items-center gap-1 font-medium">
                        <Users className="text-texto-secundario size-3.5" aria-hidden />
                        {item.matchesGerados}
                      </span>
                    </td>
                    <td className="font-data px-4 py-3 font-medium">
                      {formatarMoeda(item.demanda.orcamento)}
                    </td>
                    <td className="font-data text-texto-secundario px-4 py-3">
                      {formatarPrazo(item.demanda.prazo)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {item.demanda.status === "aberta" ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setCancelarId(item.demanda.id)}
                        >
                          Cancelar
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-4 md:hidden" aria-label="Minhas demandas">
            {itens.map((item) => (
              <li key={item.demanda.id}>
                <Card
                  className={cn(
                    "overflow-hidden",
                    BORDA_LINHA_DEMANDA[item.demanda.status],
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="font-sans text-base leading-snug font-bold">
                        {item.demanda.titulo}
                      </CardTitle>
                      <BadgeStatusDemanda status={item.demanda.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="text-texto-secundario flex flex-wrap gap-x-4 gap-y-1 font-normal">
                      <span>
                        Sugestões:{" "}
                        <span className="text-foreground font-data font-medium">
                          {item.matchesGerados}
                        </span>
                      </span>
                      <span>
                        Orçamento:{" "}
                        <span className="text-foreground font-data font-medium">
                          {formatarMoeda(item.demanda.orcamento)}
                        </span>
                      </span>
                      <span>
                        Prazo:{" "}
                        <span className="text-foreground font-data">
                          {formatarPrazo(item.demanda.prazo)}
                        </span>
                      </span>
                    </div>
                    <p className="text-texto-secundario text-xs font-normal">
                      {labelFormatoEntrega(item.demanda.formatoEntrega)}
                    </p>
                  </CardContent>
                  {item.demanda.status === "aberta" ? (
                    <CardFooter className="border-t pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive w-full"
                        onClick={() => setCancelarId(item.demanda.id)}
                      >
                        Cancelar demanda
                      </Button>
                    </CardFooter>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}

      <Dialog
        open={cancelarId !== null}
        onOpenChange={(open) => !open && setCancelarId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar demanda</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar{" "}
              <strong>{itemCancelar?.demanda.titulo}</strong>? Influenciadores não
              verão mais esta oportunidade entre as sugestões.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelarId(null)}
            >
              Voltar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmarCancelamento}
            >
              Confirmar cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
