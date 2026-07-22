"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BadgeStatusDemanda } from "@/components/empresa/demandas/badge-status-demanda";
import type { CreatorCatalogo } from "@/lib/empresa/creator-catalogo-types";
import {
  listarDemandasAtivasParaConvite,
  type FiltroTipoAtuacaoBusca,
} from "@/lib/empresa/busca-creators";
import { criarMatchConvite } from "@/lib/empresa/convite-match";
import type { MinhaDemandaItem } from "@/lib/empresa/demandas-types";
import { nomeNicho } from "@/lib/empresa/orcamento-nicho";
import { useEmpresaPublicadora } from "@/lib/empresa/use-empresa-publicadora";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { labelFormatoEntrega } from "@/lib/demandas/utils";
import { cn } from "@/lib/utils";

type ConvidarDemandaDialogProps = {
  creator: CreatorCatalogo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipoAtuacaoFiltro?: FiltroTipoAtuacaoBusca;
  basePath?: "/empresa" | "/agencia";
};

export function ConvidarDemandaDialog({
  creator,
  open,
  onOpenChange,
  tipoAtuacaoFiltro = "todos",
  basePath = "/empresa",
}: ConvidarDemandaDialogProps) {
  const router = useRouter();
  const publicador = useEmpresaPublicadora();
  const [demandaId, setDemandaId] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [demandas, setDemandas] = useState<MinhaDemandaItem[]>([]);

  useEffect(() => {
    if (!open) {
      setDemandaId(null);
      return;
    }
    if (!publicador.empresaId) {
      setDemandas([]);
      return;
    }
    setDemandas(listarDemandasAtivasParaConvite(publicador.empresaId));
  }, [open, publicador.empresaId]);

  function fechar() {
    setDemandaId(null);
    onOpenChange(false);
  }

  function confirmar() {
    if (!creator || !demandaId) {
      toast.error("Selecione uma demanda ativa.");
      return;
    }
    const item = demandas.find((d) => d.demanda.id === demandaId);
    if (!item) {
      toast.error("Demanda não encontrada.");
      return;
    }

    setEnviando(true);
    const matchId = criarMatchConvite({
      creator,
      item,
      empresaNome: publicador.empresaNome ?? "Sua empresa",
      tipoAtuacaoFiltro,
    });
    toast.success(`Convite criado — veja a compatibilidade com ${creator.nome}.`);
    fechar();
    setEnviando(false);
    router.push(`/negociacao/${matchId}`);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : fechar())}>
      <DialogContent className="max-w-md gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="border-border space-y-1 border-b px-5 py-4 text-left">
          <DialogTitle>Convidar para demanda</DialogTitle>
          <DialogDescription>
            {creator
              ? `Escolha uma campanha ativa para convidar ${creator.nome}. O score de match aparece na próxima etapa.`
              : "Escolha uma campanha ativa."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(55vh,360px)] overflow-y-auto px-5 py-4">
          {!publicador.empresaId ? (
            <p className="text-texto-secundario text-sm">
              Selecione um cliente para convidar creators.
            </p>
          ) : demandas.length === 0 ? (
            <div className="space-y-3 text-sm">
              <p className="text-texto-secundario">
                Nenhuma demanda ativa no momento. Publique uma campanha para
                convidar este creator.
              </p>
              <Link
                href={`${basePath}/demandas/nova`}
                className={cn(buttonVariants({ variant: "cta" }), "inline-flex")}
                onClick={fechar}
              >
                Nova demanda
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {demandas.map((item) => (
                <li key={item.demanda.id}>
                  <OpcaoDemanda
                    item={item}
                    selecionada={demandaId === item.demanda.id}
                    onSelect={() => setDemandaId(item.demanda.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="border-border gap-2 border-t px-5 py-3 sm:justify-between">
          <Button type="button" variant="ghost" onClick={fechar}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="cta"
            disabled={!demandaId || enviando || demandas.length === 0}
            onClick={confirmar}
          >
            Confirmar convite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OpcaoDemanda({
  item,
  selecionada,
  onSelect,
}: {
  item: MinhaDemandaItem;
  selecionada: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-card border p-3 text-left transition-colors",
        selecionada
          ? "border-verde-neon bg-verde-carvao-escuro/5"
          : "border-cinza-200 hover:border-verde-neon/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-display text-sm font-bold">{item.demanda.titulo}</p>
        <BadgeStatusDemanda status={item.demanda.status} />
      </div>
      <p className="text-texto-secundario mt-1 text-xs font-normal">
        {labelFormatoEntrega(item.demanda.formatoEntrega)}
        {item.demanda.nichoId
          ? ` · ${nomeNicho(item.demanda.nichoId)}`
          : ""}{" "}
        · {formatarMoeda(item.demanda.orcamento)}
      </p>
    </button>
  );
}
