"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Upload } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { analisarTextoLivrePortfolio } from "@/lib/negociacao/filtro-contato";

type ReportarProblemaDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onReportar: (dados: { motivo: string; evidencia?: string }) => void;
  contextoLabel?: string;
};

export function ReportarProblemaDialog({
  aberto,
  onOpenChange,
  onReportar,
  contextoLabel = "Reportar problema na entrega",
}: ReportarProblemaDialogProps) {
  const [motivo, setMotivo] = useState("");
  const [evidencia, setEvidencia] = useState<string | null>(null);
  const [aviso, setAviso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function resetar() {
    setMotivo("");
    if (evidencia?.startsWith("blob:")) URL.revokeObjectURL(evidencia);
    setEvidencia(null);
    setAviso(false);
    setErro(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!motivo.trim()) {
      setErro("Descreva o motivo do problema.");
      return;
    }
    const analise = analisarTextoLivrePortfolio(motivo);
    if (!analise.podeEnviar) {
      setAviso(true);
      return;
    }
    setAviso(false);
    onReportar({
      motivo: motivo.trim(),
      evidencia: evidencia ?? undefined,
    });
    onOpenChange(false);
    resetar();
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
            <AlertTriangle className="size-4 text-ambar" aria-hidden />
            {contextoLabel}
          </DialogTitle>
          <DialogDescription>
            O time Publi analisa o caso com base no motivo, na evidência e no
            histórico do contrato. O valor fica pausado no pagamento retido até a decisão.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="motivo-disputa">Motivo do problema</Label>
            <CampoTextoFiltrado
              id="motivo-disputa"
              value={motivo}
              onChange={(v) => {
                setMotivo(v);
                if (erro) setErro(null);
              }}
              multiline
              rows={4}
              placeholder="Explique o que aconteceu — sem telefone, @ ou PIX"
            />
            {aviso ? (
              <AvisoContatoInline tipo="bloqueado_padrao" variante="inline" />
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidencia-disputa">Evidência (opcional)</Label>
            <input
              ref={fileRef}
              id="evidencia-disputa"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (evidencia?.startsWith("blob:")) {
                  URL.revokeObjectURL(evidencia);
                }
                setEvidencia(file ? URL.createObjectURL(file) : null);
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4" aria-hidden />
              Anexar print
            </Button>
            {evidencia ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={evidencia}
                alt="Evidência anexada"
                className="mt-2 aspect-video w-full rounded-card object-contain border border-cinza-200"
              />
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
            <Button type="submit" variant="destructive">
              Enviar reporte
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
