"use client";

import { AudienciaBreakdown } from "@/components/influenciador/cadastro/audiencia-breakdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EmpresaCadastroDraft } from "@/lib/empresa/cadastro-types";
import { CATEGORIAS_CATALOGO } from "@/lib/mock-data/categorias";
import { cn } from "@/lib/utils";

type FormularioCadastroEmpresaProps = {
  draft: EmpresaCadastroDraft;
  onChange: (partial: Partial<EmpresaCadastroDraft>) => void;
  errors: Record<string, string>;
  idPrefix?: string;
  className?: string;
};

export function FormularioCadastroEmpresa({
  draft,
  onChange,
  errors,
  idPrefix = "empresa",
  className,
}: FormularioCadastroEmpresaProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-razao`}>
          Razão social <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${idPrefix}-razao`}
          value={draft.razaoSocial}
          onChange={(e) => onChange({ razaoSocial: e.target.value })}
          aria-invalid={!!errors.razaoSocial}
          aria-describedby={
            errors.razaoSocial ? `${idPrefix}-razao-error` : undefined
          }
          placeholder="Nome legal da empresa"
        />
        {errors.razaoSocial ? (
          <p
            id={`${idPrefix}-razao-error`}
            role="alert"
            className="text-destructive text-sm"
          >
            {errors.razaoSocial}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-segmento`}>
          Segmento de atuação <span className="text-destructive">*</span>
        </Label>
        <Select
          value={draft.segmento || null}
          onValueChange={(valor) => {
            if (valor) onChange({ segmento: valor });
          }}
        >
          <SelectTrigger
            id={`${idPrefix}-segmento`}
            className="w-full"
            aria-invalid={!!errors.segmento}
          >
            <SelectValue placeholder="Selecione o segmento" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS_CATALOGO.map((cat) => (
              <SelectItem key={cat.id} value={cat.nome}>
                {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.segmento ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.segmento}
          </p>
        ) : null}
      </div>

      <section className="space-y-4" aria-labelledby={`${idPrefix}-publico`}>
        <div>
          <h3 id={`${idPrefix}-publico`} className="text-sm font-medium">
            Público-alvo desejado
          </h3>
          <p className="text-muted-foreground text-sm">
            Descreva o público que sua marca quer atingir nas campanhas — não são
            métricas reais, apenas preferências para o match.
          </p>
        </div>

        <AudienciaBreakdown
          titulo="Gênero"
          descricao="Público por gênero que a marca deseja alcançar"
          linhas={draft.publicoGenero}
          onChange={(publicoGenero) => onChange({ publicoGenero })}
        />
        <AudienciaBreakdown
          titulo="Faixa etária"
          descricao="Faixas etárias prioritárias para as campanhas"
          linhas={draft.publicoFaixaEtaria}
          onChange={(publicoFaixaEtaria) => onChange({ publicoFaixaEtaria })}
        />
        <AudienciaBreakdown
          titulo="Localidade"
          descricao="Regiões ou cidades de interesse"
          linhas={draft.publicoLocalidade}
          onChange={(publicoLocalidade) => onChange({ publicoLocalidade })}
        />
      </section>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-orcamento`}>
          Orçamento médio de campanha (opcional)
        </Label>
        <Input
          id={`${idPrefix}-orcamento`}
          type="number"
          min={0}
          step={100}
          value={draft.orcamentoMedioCampanha}
          onChange={(e) => {
            const val = e.target.value;
            onChange({
              orcamentoMedioCampanha: val === "" ? "" : Number(val),
            });
          }}
          aria-invalid={!!errors.orcamentoMedioCampanha}
          placeholder="Ex: 5000"
        />
        {errors.orcamentoMedioCampanha ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.orcamentoMedioCampanha}
          </p>
        ) : null}
        <p className="text-muted-foreground text-xs">
          Ajuda a calibrar sugestões de influenciadores. Pode ser definido depois.
        </p>
      </div>
    </div>
  );
}
