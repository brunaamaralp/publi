"use client";

import { CategoriaCombobox } from "@/components/influenciador/cadastro/categoria-combobox";
import type { CadastroDraft } from "@/lib/influenciador/cadastro-types";

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
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg font-bold">
          Áreas de domínio e interesse
        </h2>
        <p className="text-texto-secundario text-sm font-normal">
          O algoritmo de match usa essas categorias para conectar você às
          campanhas certas.
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
          onChange={(categoriasInteresse) => onChange({ categoriasInteresse })}
        />
      </div>
      </div>
    </div>
  );
}
