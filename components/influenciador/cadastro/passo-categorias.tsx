"use client";

import { CategoriaCombobox } from "@/components/influenciador/cadastro/categoria-combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DIAS_SEMANA } from "@/lib/influenciador/atuacao-utils";
import type { CadastroDraft } from "@/lib/influenciador/cadastro-types";
import type { DiaSemana, TipoAtuacao } from "@/lib/types/influenciador";
import { cn } from "@/lib/utils";

type PassoCategoriasProps = {
  draft: CadastroDraft;
  onChange: (partial: Partial<CadastroDraft>) => void;
  errors: Record<string, string>;
};

export function PassoCategorias({
  draft,
  onChange,
  errors,
}: PassoCategoriasProps) {
  const disponivelComoModelo = draft.tiposAtuacao.includes("modelo");
  const dias = draft.disponibilidade?.diasSemana ?? [];

  function setModelo(checked: boolean) {
    let tiposAtuacao: TipoAtuacao[];
    if (checked) {
      tiposAtuacao = Array.from(
        new Set<TipoAtuacao>([...draft.tiposAtuacao, "modelo"]),
      );
      if (!tiposAtuacao.includes("influenciador")) {
        tiposAtuacao = ["influenciador", "modelo"];
      }
    } else {
      tiposAtuacao = draft.tiposAtuacao.filter((t) => t !== "modelo");
      if (tiposAtuacao.length === 0) tiposAtuacao = ["influenciador"];
    }
    onChange({
      tiposAtuacao,
      disponibilidade: checked
        ? draft.disponibilidade ?? { diasSemana: [] }
        : null,
    });
  }

  function toggleDia(dia: DiaSemana) {
    const atuais = draft.disponibilidade?.diasSemana ?? [];
    const next = atuais.includes(dia)
      ? atuais.filter((d) => d !== dia)
      : [...atuais, dia];
    onChange({
      disponibilidade: {
        ...draft.disponibilidade,
        diasSemana: next,
        observacao: draft.disponibilidade?.observacao,
      },
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg font-bold">
          Áreas de domínio e interesse
        </h2>
        <p className="text-texto-secundario text-sm font-normal">
          Usamos essas categorias para conectar você às campanhas certas.
        </p>
      </div>

      <div className="secao-editavel space-y-8">
        <CategoriaCombobox
          id="categorias-dominio"
          label="Área de domínio"
          hint="O que você faz — seu nicho principal. Selecione pelo menos uma."
          tipo="dominio"
          selected={draft.categoriasDominio}
          onChange={(categoriasDominio) => onChange({ categoriasDominio })}
          error={
            errors.categoriasDominio ??
            errors["categoriasDominio.root"] ??
            errors.root
          }
          required
        />

        <div className="border-border border-t pt-6">
          <CategoriaCombobox
            id="categorias-interesse"
            label="Área de interesse"
            hint="Outros temas que você também aborda, além do seu nicho principal."
            tipo="interesse"
            selected={draft.categoriasInteresse}
            onChange={(categoriasInteresse) =>
              onChange({ categoriasInteresse })
            }
          />
        </div>

        <div className="border-border space-y-4 border-t pt-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="atuacao-modelo"
              checked={disponivelComoModelo}
              onCheckedChange={(v) => setModelo(v === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <Label htmlFor="atuacao-modelo" className="cursor-pointer">
                Também estou disponível como modelo
              </Label>
              <p className="text-texto-secundario text-xs font-normal">
                Fotos/vídeos para marcas, sem precisar de canal próprio. Você
                continua influenciador — é um atributo a mais no mesmo cadastro.
              </p>
            </div>
          </div>

          {disponivelComoModelo ? (
            <div className="space-y-2 pl-7">
              <Label>Dias em que topa ensaios / gravações</Label>
              <div className="flex flex-wrap gap-2">
                {DIAS_SEMANA.map((dia) => {
                  const ativo = dias.includes(dia.id);
                  return (
                    <button
                      key={dia.id}
                      type="button"
                      onClick={() => toggleDia(dia.id)}
                      className={cn(
                        "rounded-button border px-3 py-1.5 text-xs font-medium transition-colors",
                        ativo
                          ? "border-verde-neon bg-verde-carvao-escuro text-verde-neon"
                          : "border-cinza-200 bg-white hover:border-verde-neon/40",
                      )}
                      aria-pressed={ativo}
                    >
                      {dia.labelCurto}
                    </button>
                  );
                })}
              </div>
              {errors.disponibilidade ? (
                <p className="text-destructive text-xs">
                  {errors.disponibilidade}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
