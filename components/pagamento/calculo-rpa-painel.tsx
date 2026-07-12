"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MUNICIPIOS_MOCK } from "@/lib/mock-data/contratos-pagamento";
import type { CalculoRpa } from "@/lib/pagamento/pagamento-types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

type CalculoRpaPainelProps = {
  empresaNome: string;
  calculo: CalculoRpa;
  municipio: string;
  onMunicipioChange: (municipio: string) => void;
  onConfirmar: () => void;
  onVoltar: () => void;
};

export function CalculoRpaPainel({
  empresaNome,
  calculo,
  municipio,
  onMunicipioChange,
  onConfirmar,
  onVoltar,
}: CalculoRpaPainelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-semibold">Cálculo de RPA</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          O influenciador é pessoa física (CPF). A plataforma calcula os descontos
          para auxiliar na emissão do recibo.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="municipio-rpa">Município do influenciador</Label>
        <Select value={municipio} onValueChange={(v) => v && onMunicipioChange(v)}>
          <SelectTrigger id="municipio-rpa" className="w-full">
            <SelectValue placeholder="Selecione o município" />
          </SelectTrigger>
          <SelectContent>
            {MUNICIPIOS_MOCK.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <dl className="border-border space-y-2 rounded-card border p-4 text-sm">
        <LinhaRpa label="Valor bruto" valor={calculo.valorBruto} destaque />
        <LinhaRpa label="INSS (11%)" valor={-calculo.inssRetido} />
        <LinhaRpa
          label="IRRF"
          valor={-calculo.irrfRetido}
          observacao={
            calculo.irrfRetido === 0 ? "Isento (simulação < R$ 5.000)" : undefined
          }
        />
        <LinhaRpa label="ISS (3%)" valor={-calculo.issRetido} />
        <div className="border-border border-t pt-2">
          <LinhaRpa label="Valor líquido" valor={calculo.valorLiquido} destaque />
        </div>
      </dl>

      <div className="banner-alerta flex gap-3 rounded-card p-4 text-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          Este RPA é emitido em nome de{" "}
          <strong className="text-foreground">{empresaNome}</strong> — a
          responsabilidade pelo recolhimento é da empresa contratante.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onVoltar}>
          Voltar
        </Button>
        <Button type="button" onClick={onConfirmar} disabled={!municipio}>
          Confirmar RPA e depositar
        </Button>
      </div>
    </div>
  );
}

function LinhaRpa({
  label,
  valor,
  destaque = false,
  observacao,
}: {
  label: string;
  valor: number;
  destaque?: boolean;
  observacao?: string;
}) {
  const prefixo = valor < 0 ? "−" : "";
  const absoluto = Math.abs(valor);

  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-muted-foreground">
        {label}
        {observacao ? (
          <span className="text-muted-foreground/80 block text-xs">{observacao}</span>
        ) : null}
      </dt>
      <dd
        className={
          destaque ? "font-data font-semibold" : "font-data text-muted-foreground"
        }
      >
        {prefixo}
        {formatarMoeda(absoluto)}
      </dd>
    </div>
  );
}
