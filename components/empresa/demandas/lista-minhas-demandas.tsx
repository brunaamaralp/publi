"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { BadgeStatusDemanda } from "@/components/empresa/demandas/badge-status-demanda";
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
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <CabecalhoDemandasEmpresa
        titulo="Minhas demandas"
        descricao="Gerencie as campanhas publicadas para influenciadores. Cada demanda aberta alimenta o feed de match do outro lado da plataforma."
      />

      {itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed px-6 py-16 text-center">
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Nenhuma demanda publicada ainda
          </p>
          <Link
            href="/empresa/demandas/nova"
            className={cn(buttonVariants(), "mt-6")}
          >
            <Plus className="size-4" aria-hidden />
            Publicar primeira demanda
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-card border md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-border bg-muted/40 border-b">
                  <th className="px-4 py-3 font-medium">Título</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Matches</th>
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
                    className="border-border border-b last:border-0"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.demanda.titulo}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {labelFormatoEntrega(item.demanda.formatoEntrega)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <BadgeStatusDemanda status={item.demanda.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-data inline-flex items-center gap-1">
                        <Users className="size-3.5" aria-hidden />
                        {item.matchesGerados}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-data font-medium">
                      {formatarMoeda(item.demanda.orcamento)}
                    </td>
                    <td className="px-4 py-3 font-data">
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
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base leading-snug">
                        {item.demanda.titulo}
                      </CardTitle>
                      <BadgeStatusDemanda status={item.demanda.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        Matches:{" "}
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
                    <p className="text-muted-foreground text-xs">
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
              verão mais esta oportunidade no feed.
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
  );
}
