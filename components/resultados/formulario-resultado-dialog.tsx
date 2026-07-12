"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import type { ResultadoCampanhaRegistro } from "@/lib/mock-data/resultados";
import { calcularTaxaEngajamento } from "@/lib/resultados/resultados-utils";
import { resultadoFormSchema } from "@/lib/schemas/resultado-form";

type FormularioResultadoDialogProps = {
  registro: ResultadoCampanhaRegistro | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSalvar: (dados: {
    impressoes: number;
    alcance: number;
    cliques: number;
    engajamentoTotal: number;
    taxaEngajamento: number;
    linkComprovante?: string;
    observacoes?: string;
  }) => void;
};

export function FormularioResultadoDialog({
  registro,
  aberto,
  onOpenChange,
  onSalvar,
}: FormularioResultadoDialogProps) {
  const [impressoes, setImpressoes] = useState<number | "">("");
  const [alcance, setAlcance] = useState<number | "">("");
  const [cliques, setCliques] = useState<number | "">("");
  const [engajamentoTotal, setEngajamentoTotal] = useState<number | "">("");
  const [taxaEngajamento, setTaxaEngajamento] = useState<number | "">("");
  const [taxaManual, setTaxaManual] = useState(false);
  const [link, setLink] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [printPreview, setPrintPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!aberto) {
      setImpressoes("");
      setAlcance("");
      setCliques("");
      setEngajamentoTotal("");
      setTaxaEngajamento("");
      setTaxaManual(false);
      setLink("");
      setObservacoes("");
      setPrintPreview(null);
      setErrors({});
    }
  }, [aberto]);

  useEffect(() => {
    if (taxaManual) return;
    const eng = typeof engajamentoTotal === "number" ? engajamentoTotal : 0;
    const alc = typeof alcance === "number" ? alcance : 0;
    if (alc > 0 && eng >= 0) {
      setTaxaEngajamento(calcularTaxaEngajamento(eng, alc));
    }
  }, [engajamentoTotal, alcance, taxaManual]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const linkFinal = printPreview ?? (link.trim() || undefined);

    const result = resultadoFormSchema.safeParse({
      impressoes,
      alcance,
      cliques,
      engajamentoTotal,
      taxaEngajamento,
      linkComprovante: linkFinal,
      observacoes: observacoes.trim() || undefined,
    });

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string") next[path] = issue.message;
      }
      setErrors(next);
      return;
    }

    onSalvar(result.data);
    onOpenChange(false);
  }

  if (!registro) return null;

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar resultado</DialogTitle>
          <DialogDescription>
            {registro.meta.campanhaTitulo} — {registro.meta.empresaNome}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <CampoNumero
              id="impressoes"
              label="Impressões"
              value={impressoes}
              onChange={setImpressoes}
              error={errors.impressoes}
            />
            <CampoNumero
              id="alcance"
              label="Alcance"
              value={alcance}
              onChange={setAlcance}
              error={errors.alcance}
            />
            <CampoNumero
              id="cliques"
              label="Cliques"
              value={cliques}
              onChange={setCliques}
              error={errors.cliques}
            />
            <CampoNumero
              id="engajamento"
              label="Engajamento total"
              value={engajamentoTotal}
              onChange={setEngajamentoTotal}
              error={errors.engajamentoTotal}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxa-engajamento">
              Taxa de engajamento (%)
            </Label>
            <Input
              id="taxa-engajamento"
              type="number"
              min={0}
              max={100}
              step={0.01}
              className="font-data"
              value={taxaEngajamento}
              onChange={(e) => {
                setTaxaManual(true);
                const val = e.target.value;
                setTaxaEngajamento(val === "" ? "" : Number(val));
              }}
              aria-invalid={!!errors.taxaEngajamento}
            />
            <p className="text-muted-foreground text-xs">
              Calculada automaticamente (engajamento ÷ alcance). Você pode
              ajustar manualmente.
            </p>
            {errors.taxaEngajamento ? (
              <p role="alert" className="text-destructive text-sm">
                {errors.taxaEngajamento}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-comprovante">Link do post/story</Label>
            <Input
              id="link-comprovante"
              type="url"
              placeholder="https://instagram.com/p/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={!!printPreview}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="print-comprovante">Print comprobatório (opcional)</Label>
            <input
              ref={fileRef}
              id="print-comprovante"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setPrintPreview(null);
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => setPrintPreview(reader.result as string);
                reader.readAsDataURL(file);
              }}
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
                  alt="Preview do comprovante"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar resultado</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CampoNumero({
  id,
  label,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  value: number | "";
  onChange: (v: number | "") => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={0}
        step={1}
        className="font-data"
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? "" : Number(val));
        }}
        aria-invalid={!!error}
      />
      {error ? (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
