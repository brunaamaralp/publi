"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CadastroDraft } from "@/lib/influenciador/cadastro-types";
import {
  formatarMoeda,
  LABELS_TIPO_SERVICO,
} from "@/lib/influenciador/cadastro-utils";
import { tabelaPrecoSchema } from "@/lib/schemas/influenciador";
import type { PacoteServico, TabelaPreco } from "@/lib/types";

type PassoPacotesPrecificacaoProps = {
  draft: CadastroDraft;
  onChange: (partial: Partial<CadastroDraft>) => void;
  errors: Record<string, string>;
};

export function PassoPacotesPrecificacao({
  draft,
  onChange,
  errors,
}: PassoPacotesPrecificacaoProps) {
  function atualizarPrecoPraticado(id: string, valor: number | "") {
    onChange({
      tabelaPrecos: draft.tabelaPrecos.map((item) =>
        item.id === id
          ? { ...item, precoPraticado: valor === "" ? 0 : valor }
          : item,
      ),
    });
  }

  function criarPacote() {
    const novo: PacoteServico = {
      id: crypto.randomUUID(),
      nome: "",
      descricao: "",
      preco: 0,
      itensInclusos: [],
      ativo: true,
    };
    onChange({ pacotes: [...draft.pacotes, novo] });
  }

  function atualizarPacote(id: string, partial: Partial<PacoteServico>) {
    onChange({
      pacotes: draft.pacotes.map((p) =>
        p.id === id ? { ...p, ...partial } : p,
      ),
    });
  }

  function removerPacote(id: string) {
    onChange({ pacotes: draft.pacotes.filter((p) => p.id !== id) });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Pacotes e precificação</h2>
        <p className="text-muted-foreground text-sm">
          Defina seus preços com transparência. O preço-base garante remuneração
          justa para o seu porte de audiência.
        </p>
      </div>

      <section className="space-y-4" aria-labelledby="tabela-precos-titulo">
        <div>
          <h3 id="tabela-precos-titulo" className="text-sm font-medium">
            Tabela de preços por tipo de serviço
          </h3>
          {errors.tabelaPrecos ? (
            <p role="alert" className="text-destructive mt-1 text-sm">
              {errors.tabelaPrecos}
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          {draft.tabelaPrecos.map((item, index) => (
            <LinhaTabelaPreco
              key={item.id}
              item={item}
              index={index}
              errorPath={errors[`tabelaPrecos.${index}.precoPraticado`]}
              onChange={(valor) => atualizarPrecoPraticado(item.id, valor)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="pacotes-titulo">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 id="pacotes-titulo" className="text-sm font-medium">
              Pacotes e promoções
            </h3>
            <p className="text-muted-foreground text-sm">
              Combine serviços em ofertas para empresas.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={criarPacote}>
            <Plus className="size-4" aria-hidden />
            Criar pacote
          </Button>
        </div>

        {draft.pacotes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum pacote criado. Opcional nesta etapa.
          </p>
        ) : (
          <div className="space-y-4">
            {draft.pacotes.map((pacote, index) => (
              <PacoteCard
                key={pacote.id}
                pacote={pacote}
                index={index}
                onChange={(partial) => atualizarPacote(pacote.id, partial)}
                onRemove={() => removerPacote(pacote.id)}
                errorPrefix={`pacotes.${index}`}
                errors={errors}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function LinhaTabelaPreco({
  item,
  index,
  errorPath,
  onChange,
}: {
  item: TabelaPreco;
  index: number;
  errorPath?: string;
  onChange: (valor: number | "") => void;
}) {
  const [erroInline, setErroInline] = useState<string | null>(null);
  const label = LABELS_TIPO_SERVICO[item.tipoServico];

  function validarInline(valor: number) {
    const result = tabelaPrecoSchema.safeParse({
      ...item,
      precoPraticado: valor,
    });
    if (!result.success) {
      const issue = result.error.issues.find((i) =>
        i.path.includes("precoPraticado"),
      );
      setErroInline(issue?.message ?? null);
      return;
    }
    setErroInline(null);
  }

  return (
    <div className="border-border grid gap-3 rounded-card border p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">
          Preço-base sugerido:{" "}
          <span className="text-foreground font-data font-medium">
            {formatarMoeda(item.precoBaseSugerido)}
          </span>
        </p>
      </div>
      <div className="hidden text-center text-xs text-muted-foreground sm:block">
        →
      </div>
      <div className="space-y-1">
        <Label htmlFor={`preco-${item.id}`}>Preço praticado</Label>
        <Input
          id={`preco-${item.id}`}
          type="number"
          min={0}
          step={1}
          className="font-data"
          value={item.precoPraticado || ""}
          onChange={(e) => {
            const val = e.target.value;
            const numero = val === "" ? "" : Number(val);
            onChange(numero);
            if (typeof numero === "number") validarInline(numero);
          }}
          aria-invalid={!!(erroInline || errorPath)}
          aria-describedby={
            erroInline || errorPath ? `preco-error-${index}` : undefined
          }
        />
        {(erroInline || errorPath) && (
          <p
            id={`preco-error-${index}`}
            role="alert"
            className="text-destructive text-xs"
          >
            {erroInline ?? errorPath}
          </p>
        )}
      </div>
    </div>
  );
}

function PacoteCard({
  pacote,
  index,
  onChange,
  onRemove,
  errorPrefix,
  errors,
}: {
  pacote: PacoteServico;
  index: number;
  onChange: (partial: Partial<PacoteServico>) => void;
  onRemove: () => void;
  errorPrefix: string;
  errors: Record<string, string>;
}) {
  const [tagInput, setTagInput] = useState("");

  function adicionarTag() {
    const tag = tagInput.trim();
    if (!tag || pacote.itensInclusos.includes(tag)) return;
    onChange({ itensInclusos: [...pacote.itensInclusos, tag] });
    setTagInput("");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>Pacote {index + 1}</CardTitle>
            <CardDescription>
              {pacote.ativo ? "Visível para empresas" : "Inativo"}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`Remover pacote ${index + 1}`}
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`pacote-nome-${pacote.id}`}>Nome</Label>
          <Input
            id={`pacote-nome-${pacote.id}`}
            value={pacote.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
          />
          {errors[`${errorPrefix}.nome`] ? (
            <p role="alert" className="text-destructive text-xs">
              {errors[`${errorPrefix}.nome`]}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`pacote-desc-${pacote.id}`}>Descrição</Label>
          <Textarea
            id={`pacote-desc-${pacote.id}`}
            value={pacote.descricao}
            onChange={(e) => onChange({ descricao: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`pacote-preco-${pacote.id}`}>Preço (R$)</Label>
          <Input
            id={`pacote-preco-${pacote.id}`}
            type="number"
            min={0}
            className="font-data"
            value={pacote.preco || ""}
            onChange={(e) =>
              onChange({
                preco: e.target.value === "" ? 0 : Number(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`pacote-tags-${pacote.id}`}>Itens inclusos</Label>
          <div className="flex gap-2">
            <Input
              id={`pacote-tags-${pacote.id}`}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Ex: 2 stories + 1 reels"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionarTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={adicionarTag}>
              Adicionar
            </Button>
          </div>
          {pacote.itensInclusos.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {pacote.itensInclusos.map((item) => (
                <Badge key={item} variant="outline" className="gap-1 pr-1">
                  {item}
                  <button
                    type="button"
                    className="hover:bg-muted rounded-full p-0.5"
                    onClick={() =>
                      onChange({
                        itensInclusos: pacote.itensInclusos.filter(
                          (i) => i !== item,
                        ),
                      })
                    }
                    aria-label={`Remover ${item}`}
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Label htmlFor={`pacote-ativo-${pacote.id}`} className="text-sm">
          Pacote ativo
        </Label>
        <Switch
          id={`pacote-ativo-${pacote.id}`}
          checked={pacote.ativo}
          onCheckedChange={(checked) => onChange({ ativo: checked })}
        />
      </CardFooter>
    </Card>
  );
}
