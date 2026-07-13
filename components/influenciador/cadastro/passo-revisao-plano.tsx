"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Pencil, ShieldCheck } from "lucide-react";

import { CardMetricaValor } from "@/components/influenciador/cadastro/card-metrica-valor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CadastroDraft } from "@/lib/influenciador/cadastro-types";
import {
  formatarMoeda,
  LABELS_TIPO_SERVICO,
} from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

const PLANOS = [
  {
    id: "basico" as const,
    nome: "Básico",
    preco: 9.9,
    beneficios: ["Aparece nas buscas", "Perfil profissional completo"],
  },
  {
    id: "pro" as const,
    nome: "Pro",
    preco: 19.9,
    recomendado: true,
    beneficios: [
      "Prioridade nas sugestões",
      "Acesso a treinamentos",
      "Destaque moderado nas buscas",
    ],
  },
  {
    id: "elite" as const,
    nome: "Elite",
    preco: 39.9,
    beneficios: [
      "Selo de destaque no perfil",
      "Suporte prioritário",
      "Máxima visibilidade nas oportunidades",
    ],
  },
];

type PassoRevisaoPlanoProps = {
  draft: CadastroDraft;
  onChange: (partial: Partial<CadastroDraft>) => void;
  onEditarPasso: (passo: number) => void;
  errors: Record<string, string>;
};

export function PassoRevisaoPlano({
  draft,
  onChange,
  onEditarPasso,
  errors,
}: PassoRevisaoPlanoProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h2 className="font-display text-lg font-bold">
          {draft.nome || "Revisão do perfil"}
        </h2>
        <p className="text-texto-secundario text-sm font-normal">
          Confira seus dados e escolha o plano antes de concluir.
        </p>
      </header>

      <div>
        <p className="text-texto-secundario text-sm font-normal">
          Confira seus dados antes de concluir o cadastro.
        </p>
      </div>

      <ResumoSecao titulo="Dados básicos" onEditar={() => onEditarPasso(0)}>
        <p>
          <span className="text-muted-foreground">Nome:</span> {draft.nome}
        </p>
        {draft.bio ? (
          <p>
            <span className="text-muted-foreground">Bio:</span> {draft.bio}
          </p>
        ) : null}
        {draft.fotoPerfilUrl ? (
          <p className="text-muted-foreground text-sm">Foto de perfil anexada</p>
        ) : null}
      </ResumoSecao>

      <ResumoSecao titulo="Áreas" onEditar={() => onEditarPasso(1)}>
        <div className="space-y-2">
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase">
              Domínio
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {draft.categoriasDominio.map((c) => (
                <Badge key={c.id} variant="default">
                  {c.nome}
                </Badge>
              ))}
            </div>
          </div>
          {draft.categoriasInteresse.length > 0 ? (
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Interesse
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {draft.categoriasInteresse.map((c) => (
                  <Badge key={c.id} variant="secondary">
                    {c.nome}
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </ResumoSecao>

      <ResumoSecao
        titulo="Equipamentos e métricas"
        onEditar={() => onEditarPasso(2)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <CardMetricaValor
            rotulo="Seguidores"
            valor={Number(draft.seguidores).toLocaleString("pt-BR")}
          />
          <CardMetricaValor
            rotulo="Engajamento médio"
            valor={`${draft.engajamentoMedio}%`}
          />
        </div>
        <p className="text-texto-secundario pt-2 text-sm">
          {draft.equipamentos.filter((e) => e.tipo.trim()).length} equipamento(s)
          · Print de métricas anexado
        </p>
      </ResumoSecao>

      <ResumoSecao titulo="Preços e pacotes" onEditar={() => onEditarPasso(3)}>
        <ul className="space-y-1 text-sm">
          {draft.tabelaPrecos.map((item) => (
            <li key={item.id} className="flex justify-between gap-2">
              <span>{LABELS_TIPO_SERVICO[item.tipoServico]}</span>
              <span className="font-data font-medium">
                {formatarMoeda(item.precoPraticado)}
              </span>
            </li>
          ))}
        </ul>
        {draft.pacotes.length > 0 ? (
          <p className="text-muted-foreground mt-2 text-sm">
            {draft.pacotes.length} pacote(s) configurado(s)
          </p>
        ) : null}
      </ResumoSecao>

      <section className="space-y-4" aria-labelledby="planos-titulo">
        <div>
          <h3 id="planos-titulo" className="font-display text-sm font-bold">
            Plano de assinatura
          </h3>
          <p className="text-texto-secundario text-sm font-normal">
            Escolha o plano que melhor se encaixa no seu momento.
          </p>
          {errors.plano ? (
            <p role="alert" className="text-destructive mt-1 text-sm">
              {errors.plano}
            </p>
          ) : null}
        </div>

        <div
          className="grid gap-4 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Planos de assinatura"
        >
          {PLANOS.map((plano) => {
            const selecionado = draft.plano === plano.id;
            return (
              <button
                key={plano.id}
                type="button"
                role="radio"
                aria-checked={selecionado}
                onClick={() => onChange({ plano: plano.id })}
                className={cn(
                  "relative rounded-card border p-4 text-left transition-all outline-none",
                  "focus-visible:ring-3 focus-visible:ring-ring/50",
                  selecionado
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/40",
                  "recomendado" in plano && plano.recomendado && "sm:scale-[1.02]",
                )}
              >
                {"recomendado" in plano && plano.recomendado ? (
                  <Badge className="absolute -top-2.5 right-3">Recomendado</Badge>
                ) : null}
                <p className="font-semibold">{plano.nome}</p>
                <p className="text-primary mt-1 font-display text-lg font-bold">
                  <span className="font-data">{formatarMoeda(plano.preco)}</span>
                  <span className="text-muted-foreground text-xs font-normal">
                    /mês
                  </span>
                </p>
                <ul className="text-muted-foreground mt-3 space-y-1.5 text-sm">
                  {plano.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2
                        className="text-verde-neon mt-0.5 size-3.5 shrink-0"
                        aria-hidden
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </section>

      <div
        className="banner-informativo flex gap-3 rounded-card p-4"
        role="note"
      >
        <ShieldCheck className="text-verde-neon mt-0.5 size-4 shrink-0" aria-hidden />
        <p className="text-sm">
          Ao concluir, seu perfil ficará ativo e visível para empresas na
          plataforma.
        </p>
      </div>
    </div>
  );
}

function ResumoSecao({
  titulo,
  onEditar,
  children,
}: {
  titulo: string;
  onEditar: () => void;
  children: ReactNode;
}) {
  return (
    <Card size="sm" className="secao-editavel ring-0">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="font-display font-bold">{titulo}</CardTitle>
          <CardDescription className="sr-only">
            Resumo de {titulo}
          </CardDescription>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEditar}
          aria-label={`Editar ${titulo}`}
        >
          <Pencil className="size-3.5" aria-hidden />
          Editar
        </Button>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">{children}</CardContent>
    </Card>
  );
}
