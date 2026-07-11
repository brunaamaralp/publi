"use client";

import { X } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIAS_CATALOGO } from "@/lib/mock-data/categorias";
import type { Categoria } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategoriaComboboxProps = {
  id: string;
  label: string;
  hint: string;
  tipo: Categoria["tipo"];
  selected: Categoria[];
  onChange: (categorias: Categoria[]) => void;
  error?: string;
  required?: boolean;
};

export function CategoriaCombobox({
  id,
  label,
  hint,
  tipo,
  selected,
  onChange,
  error,
  required,
}: CategoriaComboboxProps) {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selectedIds = useMemo(
    () => new Set(selected.map((c) => c.id)),
    [selected],
  );

  const options = useMemo(() => {
    return CATEGORIAS_CATALOGO.filter((cat) => {
      if (selectedIds.has(cat.id)) return false;
      if (!query.trim()) return true;
      return cat.nome.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, selectedIds]);

  function addCategoria(cat: (typeof CATEGORIAS_CATALOGO)[number]) {
    onChange([...selected, { ...cat, tipo }]);
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeCategoria(catId: string) {
    onChange(selected.filter((c) => c.id !== catId));
  }

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor={id}>
          {label}
          {required ? (
            <span className="text-destructive ml-0.5" aria-hidden>
              *
            </span>
          ) : null}
        </Label>
        <p className="text-muted-foreground mt-1 text-sm">{hint}</p>
      </div>

      {selected.length > 0 ? (
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-label={`${label} selecionadas`}
        >
          {selected.map((cat) => (
            <Badge
              key={cat.id}
              variant="secondary"
              className="gap-1 pr-1"
              role="listitem"
            >
              {cat.nome}
              <button
                type="button"
                className="hover:bg-muted rounded-full p-0.5"
                onClick={() => removeCategoria(cat.id)}
                aria-label={`Remover ${cat.nome}`}
              >
                <X className="size-3" aria-hidden />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="Buscar categoria..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
            }
            if (e.key === "Enter" && options[0]) {
              e.preventDefault();
              addCategoria(options[0]);
            }
          }}
        />

        {open && options.length > 0 ? (
          <ul
            id={listboxId}
            role="listbox"
            className="border-border bg-popover absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-card border shadow-md"
          >
            {options.map((cat) => (
              <li key={cat.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  className="hover:bg-muted w-full px-3 py-2 text-left text-sm"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addCategoria(cat)}
                >
                  {cat.nome}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className={cn("text-destructive text-sm")}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
