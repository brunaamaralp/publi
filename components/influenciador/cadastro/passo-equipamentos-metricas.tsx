"use client";

import { Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { AudienciaBreakdown } from "@/components/influenciador/cadastro/audiencia-breakdown";
import { CardMetricaValor } from "@/components/influenciador/cadastro/card-metrica-valor";
import { IndicadorMetrica } from "@/components/influenciador/cadastro/indicador-metrica";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CadastroDraft } from "@/lib/influenciador/cadastro-types";
import type { Equipamento } from "@/lib/types";

type PassoEquipamentosMetricasProps = {
  draft: CadastroDraft;
  onChange: (partial: Partial<CadastroDraft>) => void;
  errors: Record<string, string>;
};

export function PassoEquipamentosMetricas({
  draft,
  onChange,
  errors,
}: PassoEquipamentosMetricasProps) {
  const printInputRef = useRef<HTMLInputElement>(null);

  function adicionarEquipamento() {
    const novo: Equipamento = {
      id: crypto.randomUUID(),
      tipo: "",
      descricao: "",
    };
    onChange({ equipamentos: [...draft.equipamentos, novo] });
  }

  function atualizarEquipamento(
    id: string,
    campo: keyof Pick<Equipamento, "tipo" | "descricao">,
    valor: string,
  ) {
    onChange({
      equipamentos: draft.equipamentos.map((eq) =>
        eq.id === id ? { ...eq, [campo]: valor } : eq,
      ),
    });
  }

  function removerEquipamento(id: string) {
    onChange({
      equipamentos: draft.equipamentos.filter((eq) => eq.id !== id),
    });
  }

  function handlePrintChange(file: File | null) {
    if (draft.printMetricasUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(draft.printMetricasUrl);
    }
    if (!file) {
      onChange({ printMetricasUrl: "" });
      return;
    }
    onChange({ printMetricasUrl: URL.createObjectURL(file) });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg font-bold">Equipamentos e métricas</h2>
        <p className="text-texto-secundario text-sm font-normal">
          Envie o print das suas métricas para começarmos a análise do seu
          perfil. Equipamentos e demografia aumentam a confiança das empresas.
        </p>
      </div>

      <section
        className="secao-editavel space-y-4"
        aria-labelledby="equipamentos-titulo"
      >
        <div>
          <h3 id="equipamentos-titulo" className="text-sm font-medium">
            Equipamentos
          </h3>
          <p className="text-texto-secundario text-sm font-normal">
            Liste câmeras, iluminação, estúdio ou outros recursos que você usa.
          </p>
        </div>

        {draft.equipamentos.length === 0 ? (
          <p className="text-texto-secundario text-sm">
            Nenhum equipamento adicionado.
          </p>
        ) : (
          <ul className="space-y-3">
            {draft.equipamentos.map((eq, index) => (
              <li
                key={eq.id}
                className="border-border flex flex-col gap-2 rounded-card border bg-fundo-pagina p-3 sm:flex-row"
              >
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`eq-tipo-${eq.id}`}>
                    Tipo {index + 1}
                  </Label>
                  <Input
                    id={`eq-tipo-${eq.id}`}
                    value={eq.tipo}
                    onChange={(e) =>
                      atualizarEquipamento(eq.id, "tipo", e.target.value)
                    }
                    placeholder="Ex: câmera, iluminação, estúdio"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`eq-desc-${eq.id}`}>
                    Descrição (opcional)
                  </Label>
                  <Input
                    id={`eq-desc-${eq.id}`}
                    value={eq.descricao ?? ""}
                    onChange={(e) =>
                      atualizarEquipamento(eq.id, "descricao", e.target.value)
                    }
                    placeholder="Modelo ou detalhes"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removerEquipamento(eq.id)}
                    aria-label={`Remover equipamento ${index + 1}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={adicionarEquipamento}
        >
          <Plus className="size-4" aria-hidden />
          Adicionar equipamento
        </Button>
      </section>

      <section
        className="card-metrica-perfil relative space-y-4 pr-2"
        aria-labelledby="metricas-titulo"
      >
        <div className="space-y-1">
          <IndicadorMetrica tipo="informativo" />
          <h3 id="metricas-titulo" className="font-display text-sm font-bold">
            Métricas do Instagram
          </h3>
          <p className="text-sm font-normal opacity-80">
            Envie um print das suas métricas e informe os números principais.
          </p>
        </div>

        <p
          className="rounded-button border border-lilas/30 bg-white/70 px-3 py-2 text-sm font-normal"
          role="note"
        >
          Essas métricas podem ser atualizadas a cada 3 meses.
        </p>

        {draft.seguidores !== "" || draft.engajamentoMedio !== "" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {draft.seguidores !== "" ? (
              <CardMetricaValor
                variante="inline"
                rotulo="Seguidores"
                valor={Number(draft.seguidores).toLocaleString("pt-BR")}
              />
            ) : null}
            {draft.engajamentoMedio !== "" ? (
              <CardMetricaValor
                variante="inline"
                rotulo="Engajamento médio"
                valor={`${draft.engajamentoMedio}%`}
              />
            ) : null}
          </div>
        ) : null}

        <div className="secao-editavel space-y-2 ring-0">
          <Label htmlFor="print-metricas">
            Print de métricas <span className="text-destructive">*</span>
          </Label>
          <input
            ref={printInputRef}
            id="print-metricas"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) =>
              handlePrintChange(e.target.files?.[0] ?? null)
            }
          />
          <Button
            type="button"
            variant="outline"
            className="border-lilas/40 bg-white hover:bg-white/80"
            onClick={() => printInputRef.current?.click()}
          >
            <Upload className="size-4" aria-hidden />
            Enviar print
          </Button>
          {errors.printMetricasUrl ? (
            <p role="alert" className="text-destructive text-sm">
              {errors.printMetricasUrl}
            </p>
          ) : null}
          {draft.printMetricasUrl ? (
            <div className="border-border relative mt-2 aspect-video w-full max-w-md overflow-hidden rounded-card border bg-white">
              <Image
                src={draft.printMetricasUrl}
                alt="Preview do print de métricas"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="secao-editavel space-y-2 ring-0">
            <Label htmlFor="seguidores">
              Seguidores <span className="text-destructive">*</span>
            </Label>
            <Input
              id="seguidores"
              type="number"
              min={1}
              step={1}
              className="font-data"
              value={draft.seguidores}
              onChange={(e) => {
                const val = e.target.value;
                onChange({
                  seguidores: val === "" ? "" : Number(val),
                });
              }}
              aria-invalid={!!errors.seguidores}
              aria-describedby={
                errors.seguidores ? "seguidores-error" : undefined
              }
              placeholder="Ex: 45000"
            />
            {errors.seguidores ? (
              <p
                id="seguidores-error"
                role="alert"
                className="text-destructive text-sm"
              >
                {errors.seguidores}
              </p>
            ) : null}
          </div>

          <div className="secao-editavel space-y-2 ring-0">
            <Label htmlFor="engajamento">
              Engajamento médio (%) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="engajamento"
              type="number"
              min={0}
              max={100}
              step={0.1}
              className="font-data"
              value={draft.engajamentoMedio}
              onChange={(e) => {
                const val = e.target.value;
                onChange({
                  engajamentoMedio: val === "" ? "" : Number(val),
                });
              }}
              aria-invalid={!!errors.engajamentoMedio}
              aria-describedby={
                errors.engajamentoMedio ? "engajamento-error" : undefined
              }
              placeholder="Ex: 4.2"
            />
            {errors.engajamentoMedio ? (
              <p
                id="engajamento-error"
                role="alert"
                className="text-destructive text-sm"
              >
                {errors.engajamentoMedio}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="audiencia-titulo">
        <div>
          <h3 id="audiencia-titulo" className="font-display text-sm font-bold">
            Breakdown de audiência
          </h3>
          <p className="text-texto-secundario text-sm font-normal">
            Opcional, mas ajuda empresas a entender seu público.
          </p>
        </div>

        <AudienciaBreakdown
          titulo="Gênero"
          descricao="Distribuição por gênero do seu público"
          linhas={draft.audienciaGenero}
          onChange={(audienciaGenero) => onChange({ audienciaGenero })}
        />
        <AudienciaBreakdown
          titulo="Faixa etária"
          descricao="Principais faixas etárias do seu público"
          linhas={draft.audienciaFaixaEtaria}
          onChange={(audienciaFaixaEtaria) => onChange({ audienciaFaixaEtaria })}
        />
        <AudienciaBreakdown
          titulo="Localidade"
          descricao="Cidades ou regiões com maior concentração"
          linhas={draft.audienciaLocalidade}
          onChange={(audienciaLocalidade) => onChange({ audienciaLocalidade })}
        />
      </section>
    </div>
  );
}
