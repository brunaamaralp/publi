"use client";

import { useRef, useState } from "react";
import { Package, Upload } from "lucide-react";

import { CampoTextoFiltrado } from "@/components/influenciador/portfolio/campo-texto-filtrado";
import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
import { Button } from "@/components/ui/button";
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
import { analisarTextoLivrePortfolio } from "@/lib/negociacao/filtro-contato";
import type { DadosRegistroEntrega } from "@/lib/pagamento/pagamento-utils";

type FormularioEntregaDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onRegistrar: (dados: DadosRegistroEntrega) => void;
  titulo?: string;
  /** Quando reenvio após ajuste. */
  motivoAjuste?: string;
};

/**
 * Link e arquivo NÃO passam pelo filtro de contato (exceção documentada).
 * A descrição em texto livre passa pelo filtro.
 */
export function FormularioEntregaDialog({
  aberto,
  onOpenChange,
  onRegistrar,
  titulo = "Registrar entrega",
  motivoAjuste,
}: FormularioEntregaDialogProps) {
  const [link, setLink] = useState("");
  const [descricao, setDescricao] = useState("");
  const [printPreview, setPrintPreview] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [avisoDescricao, setAvisoDescricao] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function resetar() {
    setLink("");
    setDescricao("");
    setPrintPreview(null);
    setErro(null);
    setAvisoDescricao(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedLink = link.trim();
    if (!trimmedLink && !printPreview) {
      setErro("Informe o link do conteúdo ou envie um arquivo/print de prova.");
      return;
    }

    if (trimmedLink) {
      try {
        const url = trimmedLink.startsWith("http")
          ? trimmedLink
          : `https://${trimmedLink}`;
        new URL(url);
      } catch {
        setErro("Informe uma URL válida");
        return;
      }
    }

    const analise = analisarTextoLivrePortfolio(descricao);
    if (!analise.podeEnviar) {
      setAvisoDescricao(true);
      return;
    }
    setAvisoDescricao(false);

    const url = trimmedLink
      ? trimmedLink.startsWith("http")
        ? trimmedLink
        : `https://${trimmedLink}`
      : undefined;

    onRegistrar({
      linkComprovante: url,
      arquivoComprovanteUrl: printPreview ?? undefined,
      descricao: descricao.trim(),
    });
    onOpenChange(false);
    resetar();
  }

  function handlePrintChange(file: File | null) {
    if (!file) {
      setPrintPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    if (printPreview?.startsWith("blob:")) URL.revokeObjectURL(printPreview);
    setPrintPreview(objectUrl);
  }

  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetar();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-4" aria-hidden />
            {titulo}
          </DialogTitle>
          <DialogDescription>
            Envie o link do conteúdo publicado e/ou um print. A descrição passa
            pelo filtro de contato; o link e o arquivo são aceitos como prova de
            entrega.
          </DialogDescription>
        </DialogHeader>

        {motivoAjuste ? (
          <div className="rounded-card border border-ambar/35 bg-lilas-claro p-3 text-sm text-lilas-escuro">
            <p className="font-medium">Ajuste solicitado pela empresa</p>
            <p className="mt-1 font-normal leading-relaxed">{motivoAjuste}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="link-entrega">
              Link do conteúdo publicado (opcional se houver arquivo)
            </Label>
            <Input
              id="link-entrega"
              type="url"
              placeholder="https://instagram.com/p/..."
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (erro) setErro(null);
              }}
              aria-invalid={!!erro}
            />
            <p className="text-texto-secundario text-xs font-normal">
              Este campo não passa pelo filtro de contato — é a prova da
              publicação.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="print-entrega">Arquivo / print (opcional)</Label>
            <input
              ref={fileRef}
              id="print-entrega"
              type="file"
              accept="image/*,video/*"
              className="sr-only"
              onChange={(e) => handlePrintChange(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" aria-hidden />
              Enviar arquivo
            </Button>
            {printPreview ? (
              <div className="border-border relative mt-2 aspect-video overflow-hidden rounded-card border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={printPreview}
                  alt="Preview do comprovante de entrega"
                  className="size-full object-contain"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc-entrega">Descrição curta da entrega</Label>
            <CampoTextoFiltrado
              id="desc-entrega"
              value={descricao}
              onChange={setDescricao}
              multiline
              rows={3}
              placeholder="O que foi entregue — sem telefone, @ ou PIX"
            />
            {avisoDescricao ? (
              <AvisoContatoInline tipo="bloqueado_padrao" variante="inline" />
            ) : null}
          </div>

          {erro ? (
            <p role="alert" className="text-destructive text-sm">
              {erro}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Registrar entrega</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
