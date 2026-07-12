"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Package, Upload } from "lucide-react";

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

type FormularioEntregaDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onRegistrar: (link: string, printPreview?: string) => void;
};

export function FormularioEntregaDialog({
  aberto,
  onOpenChange,
  onRegistrar,
}: FormularioEntregaDialogProps) {
  const [link, setLink] = useState("");
  const [printPreview, setPrintPreview] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function resetar() {
    setLink("");
    setPrintPreview(null);
    setErro(null);
  }

  function validarLink(valor: string): string | null {
    const trimmed = valor.trim();
    if (!trimmed) return "Informe o link do post ou story publicado";

    try {
      const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      new URL(url);
      return null;
    } catch {
      return "Informe uma URL válida";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const erroLink = validarLink(link);
    if (erroLink) {
      setErro(erroLink);
      return;
    }

    const url = link.trim().startsWith("http")
      ? link.trim()
      : `https://${link.trim()}`;

    onRegistrar(url, printPreview ?? undefined);
    onOpenChange(false);
    resetar();
  }

  function handlePrintChange(file: File | null) {
    if (!file) {
      setPrintPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPrintPreview(reader.result as string);
    reader.readAsDataURL(file);
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
            Marcar como entregue
          </DialogTitle>
          <DialogDescription>
            Informe o link do conteúdo publicado. A empresa revisará e confirmará
            a entrega para liberar o pagamento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="link-entrega">
              Link do post/story <span className="text-destructive">*</span>
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
            {erro ? (
              <p role="alert" className="text-destructive text-sm">
                {erro}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="print-entrega">Print de comprovante (opcional)</Label>
            <input
              ref={fileRef}
              id="print-entrega"
              type="file"
              accept="image/*"
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
              Enviar print
            </Button>
            {printPreview ? (
              <div className="border-border relative mt-2 aspect-video overflow-hidden rounded-card border">
                <Image
                  src={printPreview}
                  alt="Preview do comprovante de entrega"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Registrar entrega</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
