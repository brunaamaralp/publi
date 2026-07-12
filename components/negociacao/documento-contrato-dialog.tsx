"use client";

import { useState } from "react";
import { Check, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatarPrazo } from "@/lib/demandas/utils";
import { LABELS_STATUS_CONTRATO } from "@/lib/negociacao/negociacao-utils";
import type { NegociacaoContexto } from "@/lib/negociacao/negociacao-types";
import type { Contrato } from "@/lib/types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

type DocumentoContratoDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  contrato: Contrato;
  contexto: NegociacaoContexto;
  assinaturaEmpresa: boolean;
  assinaturaInfluenciador: boolean;
  onAssinarEmpresa: () => void;
  onAssinarInfluenciador: () => void;
};

export function DocumentoContratoDialog({
  aberto,
  onOpenChange,
  contrato,
  contexto,
  assinaturaEmpresa,
  assinaturaInfluenciador,
  onAssinarEmpresa,
  onAssinarInfluenciador,
}: DocumentoContratoDialogProps) {
  const [assinandoInfluenciador, setAssinandoInfluenciador] = useState(false);

  async function handleAssinarInfluenciador() {
    setAssinandoInfluenciador(true);
    await new Promise((r) => setTimeout(r, 1200));
    onAssinarInfluenciador();
    setAssinandoInfluenciador(false);
  }

  const concluido =
    assinaturaEmpresa &&
    assinaturaInfluenciador &&
    contrato.status === "assinado";

  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        if (!assinandoInfluenciador) onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-xl" showCloseButton={!assinandoInfluenciador}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-4" aria-hidden />
            Contrato de prestação de serviços
          </DialogTitle>
          <DialogDescription>
            Documento gerado para a campanha com{" "}
            {contexto.influenciador.nome}.
          </DialogDescription>
        </DialogHeader>

        <article
          className={cn(
            "space-y-5 rounded-card border-2 border-double p-5 sm:p-6",
            "border-cinza-200 bg-[#fafafa] font-serif text-[0.95rem] leading-relaxed",
            "shadow-sm",
          )}
        >
          <header className="border-cinza-200 space-y-1 border-b pb-4 text-center">
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Contrato digital
            </p>
            <h3 className="font-display text-lg font-semibold">
              {contexto.demanda.titulo}
            </h3>
            <p className="text-muted-foreground text-xs">
              Ref. {contrato.id.slice(0, 8).toUpperCase()}
            </p>
          </header>

          <section className="space-y-3 text-sm">
            <p>
              <strong>Contratante:</strong> {contexto.empresa.nome}
            </p>
            <p>
              <strong>Contratado(a):</strong> {contexto.influenciador.nome}
            </p>
            <p>
              <strong>Valor:</strong>{" "}
              <span className="font-data font-semibold">
                {formatarMoeda(contrato.valor)}
              </span>
            </p>
            <p>
              <strong>Prazo de entrega:</strong>{" "}
              <span className="font-data">
                {formatarPrazo(contrato.prazoEntrega)}
              </span>
            </p>
            <div>
              <strong>Escopo:</strong>
              <p className="mt-1 whitespace-pre-wrap">{contrato.escopo}</p>
            </div>
          </section>

          <footer className="border-cinza-200 border-t pt-4">
            <p className="text-muted-foreground text-center text-xs">
              Status: {LABELS_STATUS_CONTRATO[contrato.status]}
            </p>
          </footer>
        </article>

        <div className="space-y-3">
          <AssinaturaLinha
            parte="Empresa"
            nome={contexto.empresa.nome}
            assinado={assinaturaEmpresa}
            onAssinar={onAssinarEmpresa}
            desabilitado={assinaturaEmpresa}
          />
          <AssinaturaLinha
            parte="Influenciador(a)"
            nome={contexto.influenciador.nome}
            assinado={assinaturaInfluenciador}
            onAssinar={handleAssinarInfluenciador}
            desabilitado={!assinaturaEmpresa || assinaturaInfluenciador}
            carregando={assinandoInfluenciador}
          />
        </div>

        {concluido ? (
          <div className="banner-informativo rounded-card p-3 text-center text-sm">
            Contrato assinado por ambas as partes. O resumo ficará visível no
            topo do chat.
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function AssinaturaLinha({
  parte,
  nome,
  assinado,
  onAssinar,
  desabilitado,
  carregando = false,
}: {
  parte: string;
  nome: string;
  assinado: boolean;
  onAssinar: () => void;
  desabilitado: boolean;
  carregando?: boolean;
}) {
  return (
    <div className="border-border flex flex-col gap-2 rounded-card border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{parte}</p>
        <p className="text-muted-foreground text-xs">{nome}</p>
      </div>
      {assinado ? (
        <span className="text-verde-acao inline-flex items-center gap-1 text-sm font-medium">
          <Check className="size-4" aria-hidden />
          Assinado
        </span>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={desabilitado || carregando}
          onClick={onAssinar}
        >
          {carregando ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Assinando…
            </>
          ) : (
            "Assinar eletronicamente"
          )}
        </Button>
      )}
    </div>
  );
}
