"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

import { AudienciaBreakdown } from "@/components/influenciador/cadastro/audiencia-breakdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  criarDemandaPublicacaoInicial,
  publicarDemanda,
  validarDemandaPublicacao,
} from "@/lib/empresa/demandas-utils";
import type { DemandaPublicacaoDraft } from "@/lib/empresa/demandas-types";
import { useEmpresaPublicadora } from "@/lib/empresa/use-empresa-publicadora";
import {
  LABELS_TIPO_SERVICO,
  TIPOS_SERVICO,
} from "@/lib/influenciador/cadastro-utils";

export function FormularioNovaDemanda() {
  const router = useRouter();
  const publicador = useEmpresaPublicadora();
  const [draft, setDraft] = useState<DemandaPublicacaoDraft>(
    criarDemandaPublicacaoInicial,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  function updateDraft(partial: Partial<DemandaPublicacaoDraft>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validarDemandaPublicacao(draft);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setEnviando(true);
    try {
      publicarDemanda(draft, publicador.empresaId);
      toast.success("Demanda publicada com sucesso!");
      router.push("/empresa/demandas");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {publicador.modo === "agencia" ? (
        <Badge
          variant="outline"
          className="banner-informativo gap-1.5 rounded-card px-3 py-2 text-sm font-normal"
        >
          <Building2 className="text-primary size-3.5 shrink-0" aria-hidden />
          Publicando em nome de{" "}
          <span className="text-foreground font-medium">
            {publicador.empresaNome}
          </span>
        </Badge>
      ) : null}

      <section className="space-y-4" aria-labelledby="titulo-demanda">
        <div className="space-y-2">
          <Label htmlFor="titulo">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="titulo"
            value={draft.titulo}
            onChange={(e) => updateDraft({ titulo: e.target.value })}
            placeholder="Ex: Lançamento linha verão 2026"
            aria-invalid={!!errors.titulo}
            aria-describedby={errors.titulo ? "titulo-error" : undefined}
            maxLength={120}
          />
          {errors.titulo ? (
            <p id="titulo-error" role="alert" className="text-destructive text-sm">
              {errors.titulo}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="briefing">
            Briefing <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="briefing"
            value={draft.briefing}
            onChange={(e) => updateDraft({ briefing: e.target.value })}
            placeholder="Descreva o que a marca espera do influenciador: tom, entregáveis, referências..."
            rows={5}
            aria-invalid={!!errors.briefing}
            aria-describedby={errors.briefing ? "briefing-error" : undefined}
          />
          {errors.briefing ? (
            <p
              id="briefing-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {errors.briefing}
            </p>
          ) : null}
        </div>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2"
        aria-labelledby="detalhes-demanda"
      >
        <h2 id="detalhes-demanda" className="sr-only">
          Detalhes da demanda
        </h2>

        <div className="space-y-2">
          <Label htmlFor="formato">
            Formato de entrega <span className="text-destructive">*</span>
          </Label>
          <Select
            value={draft.formatoEntrega || undefined}
            onValueChange={(value) =>
              updateDraft({
                formatoEntrega:
                  value as DemandaPublicacaoDraft["formatoEntrega"],
              })
            }
          >
            <SelectTrigger
              id="formato"
              className="w-full"
              aria-invalid={!!errors.formatoEntrega}
            >
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_SERVICO.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {LABELS_TIPO_SERVICO[tipo]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.formatoEntrega ? (
            <p role="alert" className="text-destructive text-sm">
              {errors.formatoEntrega}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="orcamento">
            Orçamento (R$) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="orcamento"
            type="number"
            min={1}
            step={1}
            className="font-data"
            value={draft.orcamento}
            onChange={(e) => {
              const val = e.target.value;
              updateDraft({
                orcamento: val === "" ? "" : Number(val),
              });
            }}
            placeholder="Ex: 5000"
            aria-invalid={!!errors.orcamento}
            aria-describedby={errors.orcamento ? "orcamento-error" : undefined}
          />
          {errors.orcamento ? (
            <p
              id="orcamento-error"
              role="alert"
              className="text-destructive text-sm"
            >
              {errors.orcamento}
            </p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2 sm:max-w-xs">
          <Label htmlFor="prazo">
            Prazo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="prazo"
            type="date"
            className="font-data"
            value={draft.prazo}
            onChange={(e) => updateDraft({ prazo: e.target.value })}
            aria-invalid={!!errors.prazo}
            aria-describedby={errors.prazo ? "prazo-error" : undefined}
          />
          {errors.prazo ? (
            <p id="prazo-error" role="alert" className="text-destructive text-sm">
              {errors.prazo}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="publico-alvo-titulo">
        <div>
          <h2 id="publico-alvo-titulo" className="text-lg font-semibold">
            Público-alvo desejado
          </h2>
          <p className="text-muted-foreground text-sm">
            Defina quem a empresa quer atingir com esta campanha. Opcional, mas
            melhora o match com influenciadores compatíveis.
          </p>
        </div>

        <AudienciaBreakdown
          titulo="Gênero"
          descricao="Perfil de gênero do público que a marca deseja alcançar"
          linhas={draft.publicoGenero}
          onChange={(publicoGenero) => updateDraft({ publicoGenero })}
        />
        <AudienciaBreakdown
          titulo="Faixa etária"
          descricao="Faixas etárias prioritárias para a campanha"
          linhas={draft.publicoFaixaEtaria}
          onChange={(publicoFaixaEtaria) => updateDraft({ publicoFaixaEtaria })}
        />
        <AudienciaBreakdown
          titulo="Localidade"
          descricao="Regiões ou cidades com maior relevância"
          linhas={draft.publicoLocalidade}
          onChange={(publicoLocalidade) => updateDraft({ publicoLocalidade })}
        />
      </section>

      <footer className="border-border flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/empresa/demandas")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando ? "Publicando…" : "Publicar demanda"}
        </Button>
      </footer>
    </form>
  );
}
