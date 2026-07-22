"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ConteudoTreinamentoDialog } from "@/components/influenciador/treinamentos/conteudo-treinamento-dialog";
import { GridTreinamentos } from "@/components/influenciador/treinamentos/grid-treinamentos";
import { HeaderNivelXp } from "@/components/influenciador/treinamentos/header-nivel-xp";
import { TREINAMENTOS_MOCK } from "@/lib/mock-data/treinamentos";
import type { Treinamento } from "@/lib/types";
import {
  carregarEstadoTreinamentos,
  concluirTreinamento,
  getProgressoTreinamento,
  LABELS_NIVEL,
  salvarEstadoTreinamentos,
  type TreinamentosEstado,
  XP_POR_TREINAMENTO,
} from "@/lib/treinamentos/treinamentos-utils";

export function TreinamentosFlow() {
  const [estado, setEstado] = useState<TreinamentosEstado | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [selecionado, setSelecionado] = useState<Treinamento | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  useEffect(() => {
    setEstado(carregarEstadoTreinamentos());
    setCarregado(true);
  }, []);

  const persistir = useCallback((next: TreinamentosEstado) => {
    setEstado(next);
    salvarEstadoTreinamentos(next);
  }, []);

  function abrirTreinamento(treinamento: Treinamento) {
    setSelecionado(treinamento);
    setDialogAberto(true);
  }

  function handleConcluir() {
    if (!estado || !selecionado) return;

    const nivelAnterior = estado.influenciador.nivelAtual;
    const xpAnterior = estado.influenciador.pontosXp;
    const jaConcluido =
      getProgressoTreinamento(
        estado.progressos,
        selecionado.id,
        estado.influenciador.id,
      ) === "concluido";

    if (jaConcluido) return;

    const next = concluirTreinamento(estado, selecionado);
    persistir(next);
    setDialogAberto(false);

    const subiuNivel = next.influenciador.nivelAtual > nivelAnterior;

    toast.success(
      subiuNivel
        ? `Parabéns! Você subiu para ${LABELS_NIVEL[next.influenciador.nivelAtual]}!`
        : `Treinamento concluído! +${XP_POR_TREINAMENTO} XP`,
      {
        description: subiuNivel
          ? `Agora você tem ${next.influenciador.pontosXp} XP e novos treinamentos podem estar disponíveis.`
          : `Total: ${next.influenciador.pontosXp} XP (${xpAnterior} → ${next.influenciador.pontosXp})`,
        duration: 5000,
      },
    );
  }

  if (!carregado || !estado) {
    return (
      <div className="text-texto-secundario flex min-h-[40vh] items-center justify-center text-sm">
        Carregando trilhas…
      </div>
    );
  }

  const statusSelecionado = selecionado
    ? getProgressoTreinamento(
        estado.progressos,
        selecionado.id,
        estado.influenciador.id,
      )
    : "nao_iniciado";

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <p className="text-texto-secundario text-sm font-medium">Academia</p>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Treinamentos
        </h1>
        <p className="text-texto-secundario max-w-2xl text-sm font-normal leading-relaxed">
          Trilhas para evoluir em precificação, negociação e criação de conteúdo.
        </p>
      </header>

      <HeaderNivelXp influenciador={estado.influenciador} />

      <GridTreinamentos
        treinamentos={TREINAMENTOS_MOCK}
        progressos={estado.progressos}
        influenciadorId={estado.influenciador.id}
        nivelAtual={estado.influenciador.nivelAtual}
        onAbrir={abrirTreinamento}
      />

      <ConteudoTreinamentoDialog
        treinamento={selecionado}
        status={statusSelecionado}
        nivelAtual={estado.influenciador.nivelAtual}
        aberto={dialogAberto}
        onOpenChange={setDialogAberto}
        onConcluir={handleConcluir}
      />
    </div>
  );
}
