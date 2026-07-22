"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { BannerAcessoLeitura } from "@/components/agencia/banner-acesso-leitura";
import { BadgeStatusDemanda, BORDA_LINHA_DEMANDA } from "@/components/empresa/demandas/badge-status-demanda";
import { CabecalhoDemandasEmpresa } from "@/components/empresa/demandas/cabecalho-demandas-empresa";
import { SugestoesDemandaLink } from "@/components/empresa/demandas/sugestoes-demanda-link";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatarPrazo, labelFormatoEntrega } from "@/lib/demandas/utils";
import {
  atualizarOrcamentoDemanda,
  cancelarDemanda,
  listarDemandasEmpresa,
} from "@/lib/empresa/demandas-utils";
import type { MinhaDemandaItem } from "@/lib/empresa/demandas-types";
import {
  nomeNicho,
  orcamentoMinimoNicho,
  validarOrcamentoNicho,
} from "@/lib/empresa/orcamento-nicho";
import { useEmpresaPublicadora } from "@/lib/empresa/use-empresa-publicadora";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { useAgenciaOpcional } from "@/lib/contexts/agencia-context";
import { cn } from "@/lib/utils";

const STATUS_EDITAVEL = new Set([
  "aberta",
  "em_negociacao",
  "em_andamento",
  "rascunho",
]);

type ListaMinhasDemandasProps = {
  basePath?: "/empresa" | "/agencia";
  somenteLeitura?: boolean;
};

export function ListaMinhasDemandas({
  basePath = "/empresa",
  somenteLeitura = false,
}: ListaMinhasDemandasProps) {
  const publicador = useEmpresaPublicadora();
  const agenciaCtx = useAgenciaOpcional();
  const podeMutar = !somenteLeitura;
  const [itens, setItens] = useState<MinhaDemandaItem[]>([]);
  const [cancelarId, setCancelarId] = useState<string | null>(null);
  const [editarItem, setEditarItem] = useState<MinhaDemandaItem | null>(null);
  const [orcamentoEdit, setOrcamentoEdit] = useState<number | "">("");
  const [erroOrcamento, setErroOrcamento] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    if (!publicador.empresaId) {
      setItens([]);
      return;
    }
    setItens(listarDemandasEmpresa(publicador.empresaId));
  }, [publicador.empresaId]);

  useEffect(() => {
    recarregar();
  }, [recarregar, agenciaCtx?.empresaAtivaId]);

  function confirmarCancelamento() {
    if (!cancelarId || !publicador.empresaId) return;
    const ok = cancelarDemanda(cancelarId, publicador.empresaId);
    if (ok) {
      toast.success("Demanda cancelada.");
      recarregar();
    } else {
      toast.error("Não foi possível cancelar esta demanda.");
    }
    setCancelarId(null);
  }

  function abrirEdicaoOrcamento(item: MinhaDemandaItem) {
    setEditarItem(item);
    setOrcamentoEdit(item.demanda.orcamento);
    setErroOrcamento(null);
  }

  function onChangeOrcamentoEdit(val: string) {
    const next = val === "" ? "" : Number(val);
    setOrcamentoEdit(next);
    if (!editarItem || next === "") {
      setErroOrcamento(null);
      return;
    }
    const nichoId = editarItem.demanda.nichoId ?? "";
    setErroOrcamento(validarOrcamentoNicho(nichoId, next));
  }

  function confirmarEdicaoOrcamento() {
    if (!editarItem || !publicador.empresaId) return;
    if (orcamentoEdit === "" || erroOrcamento) return;

    const result = atualizarOrcamentoDemanda(
      editarItem.demanda.id,
      publicador.empresaId,
      Number(orcamentoEdit),
    );

    if (!result.ok) {
      toast.error(result.erro ?? "Não foi possível atualizar o orçamento.");
      return;
    }

    if (result.matchesAfetados > 0) {
      toast.warning(
        `Orçamento atualizado. ${result.matchesAfetados} match(es) existente(s) podem estar desatualizados.`,
      );
    } else {
      toast.success("Orçamento atualizado.");
    }

    setEditarItem(null);
    recarregar();
  }

  const itemCancelar = itens.find((i) => i.demanda.id === cancelarId);
  const edicaoEmAndamento = editarItem?.demanda.status === "em_andamento";
  const matchesEdicao = editarItem?.matchesGerados ?? 0;
  const minimoEdicao = editarItem?.demanda.nichoId
    ? orcamentoMinimoNicho(editarItem.demanda.nichoId)
    : null;

  if (publicador.modo === "agencia_sem_cliente") {
    return (
      <div className="min-h-full bg-fundo-pagina">
        <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
          <CabecalhoDemandasEmpresa
            titulo="Minhas demandas"
            descricao="Selecione um cliente no seletor de contexto para ver e gerenciar as demandas."
            mostrarCtaNova={false}
            basePath={basePath}
          />
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed px-6 py-16 text-center">
            <AlertTriangle
              className="text-muted-foreground mb-3 size-8"
              aria-hidden
            />
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              Nenhum cliente selecionado. Use o seletor de contexto da agência
              para escolher a empresa-cliente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-fundo-pagina">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      {somenteLeitura ? (
        <BannerAcessoLeitura nomeCliente={publicador.empresaNome} />
      ) : null}
      <CabecalhoDemandasEmpresa
        titulo={basePath === "/agencia" ? "Campanhas do cliente" : "Minhas demandas"}
        descricao="Gerencie as campanhas publicadas. Em Sugestões, veja criadores ranqueados pelo score de compatibilidade com cada demanda."
        mostrarCtaNova={podeMutar}
        basePath={basePath}
      />

      {itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed px-6 py-16 text-center">
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Nenhuma demanda publicada ainda
          </p>
          {podeMutar ? (
            <Link
              href={`${basePath}/demandas/nova`}
              className={cn(
                buttonVariants(),
                "mt-6 border-transparent bg-verde-carvao-escuro text-verde-neon shadow-none hover:bg-verde-carvao hover:text-verde-neon",
              )}
            >
              <Plus className="size-4" aria-hidden />
              Publicar primeira demanda
            </Link>
          ) : null}
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
                        {item.demanda.nichoId
                          ? ` · ${nomeNicho(item.demanda.nichoId)}`
                          : null}
                      </p>
                      {item.matchesDesatualizados ? (
                        <p className="text-amber-700 mt-1 text-xs">
                          Matches podem estar desatualizados
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <BadgeStatusDemanda status={item.demanda.status} />
                    </td>
                    <td className="px-4 py-3">
                      <SugestoesDemandaLink
                        demandaId={item.demanda.id}
                        total={item.matchesGerados}
                      />
                    </td>
                    <td className="font-data px-4 py-3 font-medium">
                      {formatarMoeda(item.demanda.orcamento)}
                    </td>
                    <td className="font-data text-texto-secundario px-4 py-3">
                      {item.demanda.prazo
                        ? formatarPrazo(item.demanda.prazo)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {podeMutar ? (
                        <div className="flex justify-end gap-1">
                          {STATUS_EDITAVEL.has(item.demanda.status) ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => abrirEdicaoOrcamento(item)}
                            >
                              <Pencil className="size-3.5" aria-hidden />
                              Orçamento
                            </Button>
                          ) : null}
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
                          ) : null}
                        </div>
                      ) : null}
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
                        <SugestoesDemandaLink
                          demandaId={item.demanda.id}
                          total={item.matchesGerados}
                          className="text-foreground"
                        />
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
                          {item.demanda.prazo
                            ? formatarPrazo(item.demanda.prazo)
                            : "—"}
                        </span>
                      </span>
                    </div>
                    <p className="text-texto-secundario text-xs font-normal">
                      {labelFormatoEntrega(item.demanda.formatoEntrega)}
                      {item.demanda.nichoId
                        ? ` · ${nomeNicho(item.demanda.nichoId)}`
                        : null}
                    </p>
                    {item.matchesDesatualizados ? (
                      <p className="text-amber-700 text-xs">
                        Matches podem estar desatualizados após mudança de
                        orçamento.
                      </p>
                    ) : null}
                  </CardContent>
                  {podeMutar ? (
                    <CardFooter className="flex flex-col gap-2 border-t pt-4">
                      {STATUS_EDITAVEL.has(item.demanda.status) ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => abrirEdicaoOrcamento(item)}
                        >
                          <Pencil className="size-3.5" aria-hidden />
                          Editar orçamento
                        </Button>
                      ) : null}
                      {item.demanda.status === "aberta" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive w-full"
                          onClick={() => setCancelarId(item.demanda.id)}
                        >
                          Cancelar demanda
                        </Button>
                      ) : null}
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

      <Dialog
        open={editarItem !== null}
        onOpenChange={(open) => !open && setEditarItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar orçamento</DialogTitle>
            <DialogDescription>
              {editarItem
                ? `Atualize o orçamento de “${editarItem.demanda.titulo}”.`
                : "Atualize o orçamento da demanda."}
            </DialogDescription>
          </DialogHeader>

          {edicaoEmAndamento && matchesEdicao > 0 ? (
            <div
              role="status"
              className="border-amber-600/30 bg-amber-50 text-amber-950 flex gap-2 rounded-card border p-3 text-sm"
            >
              <AlertTriangle
                className="mt-0.5 size-4 shrink-0 text-amber-700"
                aria-hidden
              />
              <p>
                Esta demanda está <strong>em andamento</strong> com{" "}
                <strong>{matchesEdicao}</strong> match(es). Alterar o orçamento
                pode afetar a compatibilidade já calculada — os matches serão
                sinalizados como possivelmente desatualizados.
              </p>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="editar-orcamento">Orçamento (R$)</Label>
            <Input
              id="editar-orcamento"
              type="number"
              min={1}
              step={1}
              className="font-data"
              value={orcamentoEdit}
              onChange={(e) => onChangeOrcamentoEdit(e.target.value)}
              aria-invalid={!!erroOrcamento}
            />
            {minimoEdicao && editarItem?.demanda.nichoId ? (
              <p className="text-texto-secundario text-xs">
                Mínimo do nicho {nomeNicho(editarItem.demanda.nichoId)}:{" "}
                {formatarMoeda(minimoEdicao)}
              </p>
            ) : null}
            {erroOrcamento ? (
              <p role="alert" className="text-destructive text-sm">
                {erroOrcamento}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditarItem(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={orcamentoEdit === "" || !!erroOrcamento}
              onClick={confirmarEdicaoOrcamento}
            >
              Salvar orçamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
