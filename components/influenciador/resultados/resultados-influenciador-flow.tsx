"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { FormularioResultadoDialog } from "@/components/resultados/formulario-resultado-dialog";
import { BadgeStatusResultado } from "@/components/resultados/badge-status-resultado";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { INFLUENCIADOR_MOCK_ID } from "@/lib/mock-data/avaliacoes";
import type { ResultadoCampanhaRegistro } from "@/lib/mock-data/resultados";
import {
  carregarResultados,
  listarPendentesInfluenciador,
  preencherResultado,
  salvarResultados,
} from "@/lib/resultados/resultados-utils";
import { cn } from "@/lib/utils";

export function ResultadosInfluenciadorFlow() {
  const [registros, setRegistros] = useState<ResultadoCampanhaRegistro[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [selecionado, setSelecionado] = useState<ResultadoCampanhaRegistro | null>(
    null,
  );
  const [dialogAberto, setDialogAberto] = useState(false);

  useEffect(() => {
    setRegistros(carregarResultados());
    setCarregado(true);
  }, []);

  const persistir = useCallback((next: ResultadoCampanhaRegistro[]) => {
    setRegistros(next);
    salvarResultados(next);
  }, []);

  const pendentes = listarPendentesInfluenciador(
    registros,
    INFLUENCIADOR_MOCK_ID,
  );

  const solicitados = pendentes.filter(
    (p) => p.resultado.status === "solicitado",
  );
  const voluntarios = pendentes.filter(
    (p) => p.resultado.status === "nao_solicitado",
  );

  if (!carregado) {
    return (
      <div className="text-texto-secundario flex min-h-[40vh] items-center justify-center text-sm">
        Carregando resultados…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-medium">Campanhas</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Resultados de campanha
        </h1>
        <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
          Cadastre métricas das campanhas concluídas para alimentar relatórios
          das marcas e agências parceiras.
        </p>
      </header>

      {pendentes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-cinza-200 bg-white px-6 py-16 text-center">
          <ClipboardList
            className="text-texto-secundario mb-4 size-10"
            aria-hidden
          />
          <p className="font-display text-base font-bold">
            Nenhum resultado pendente
          </p>
          <p className="text-texto-secundario mt-2 max-w-sm text-sm font-normal leading-relaxed">
            Quando uma campanha for concluída, ela aparece aqui para você
            cadastrar as métricas. Enquanto isso, acompanhe oportunidades e
            contratos no painel.
          </p>
          <Link
            href="/influenciador"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-6 inline-flex",
            )}
          >
            Voltar ao painel
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {solicitados.length > 0 ? (
            <section className="space-y-3" aria-labelledby="solicitados-titulo">
              <h2
                id="solicitados-titulo"
                className="text-status-negociacao flex items-center gap-2 text-sm font-semibold"
              >
                <AlertCircle className="size-4" aria-hidden />
                Aguardando seu preenchimento
              </h2>
              <ul className="space-y-3">
                {solicitados.map((item) => (
                  <ItemPendente
                    key={item.resultado.id}
                    item={item}
                    urgente
                    onPreencher={() => {
                      setSelecionado(item);
                      setDialogAberto(true);
                    }}
                  />
                ))}
              </ul>
            </section>
          ) : null}

          {voluntarios.length > 0 ? (
            <section className="space-y-3" aria-labelledby="voluntarios-titulo">
              <h2
                id="voluntarios-titulo"
                className="text-muted-foreground text-sm font-medium"
              >
                Cadastro voluntário
              </h2>
              <ul className="space-y-3">
                {voluntarios.map((item) => (
                  <ItemPendente
                    key={item.resultado.id}
                    item={item}
                    onPreencher={() => {
                      setSelecionado(item);
                      setDialogAberto(true);
                    }}
                  />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      <FormularioResultadoDialog
        registro={selecionado}
        aberto={dialogAberto}
        onOpenChange={setDialogAberto}
        onSalvar={(dados) => {
          if (!selecionado) return;
          persistir(preencherResultado(registros, selecionado.resultado.id, dados));
          toast.success("Resultado cadastrado com sucesso!");
        }}
      />
    </div>
  );
}

function ItemPendente({
  item,
  urgente = false,
  onPreencher,
}: {
  item: ResultadoCampanhaRegistro;
  urgente?: boolean;
  onPreencher: () => void;
}) {
  return (
    <li>
      <Card
        className={cn(
          urgente && "border-status-negociacao/40 bg-status-negociacao/5",
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">
              {item.meta.campanhaTitulo}
            </CardTitle>
            <BadgeStatusResultado status={item.resultado.status} />
          </div>
          <CardDescription>{item.meta.empresaNome}</CardDescription>
        </CardHeader>
        {urgente ? (
          <CardContent className="pb-0">
            <p className="text-status-negociacao text-sm font-medium">
              A empresa solicitou o preenchimento deste resultado.
            </p>
          </CardContent>
        ) : null}
        <CardFooter className="pt-4">
          <Button
            type="button"
            variant={urgente ? "default" : "outline"}
            className="w-full sm:w-auto"
            onClick={onPreencher}
          >
            {urgente
              ? "Preencher resultado solicitado"
              : "Cadastrar resultado"}
          </Button>
        </CardFooter>
      </Card>
    </li>
  );
}
