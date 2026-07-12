"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { DetalheUsuarioSheet } from "@/components/admin/moderacao/detalhe-usuario-sheet";
import { FiltrosModeracao } from "@/components/admin/moderacao/filtros-moderacao";
import { RejeitarDialog } from "@/components/admin/moderacao/rejeitar-dialog";
import { TabelaPendentes } from "@/components/admin/moderacao/tabela-pendentes";
import { Button } from "@/components/ui/button";
import type { UsuarioPendenteModeracao } from "@/lib/mock-data/moderacao";
import {
  aprovarUsuario,
  carregarEstadoModeracao,
  filtrarPendentes,
  getNomeExibicao,
  getUsuarioId,
  rejeitarUsuario,
  resetarEstadoModeracao,
  salvarEstadoModeracao,
  type FiltroDataCadastro,
  type FiltroTipoUsuario,
  type ModeracaoEstado,
} from "@/lib/moderacao/moderacao-utils";

export function ModeracaoFlow() {
  const [estado, setEstado] = useState<ModeracaoEstado | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipoUsuario>("todos");
  const [filtroData, setFiltroData] = useState<FiltroDataCadastro>("todos");
  const [selecionado, setSelecionado] = useState<UsuarioPendenteModeracao | null>(
    null,
  );
  const [sheetAberto, setSheetAberto] = useState(false);
  const [rejeitarAberto, setRejeitarAberto] = useState(false);

  useEffect(() => {
    setEstado(carregarEstadoModeracao());
    setCarregado(true);
  }, []);

  const persistir = useCallback((next: ModeracaoEstado) => {
    setEstado(next);
    salvarEstadoModeracao(next);
  }, []);

  const itensFiltrados = useMemo(() => {
    if (!estado) return [];
    return filtrarPendentes(estado.pendentes, filtroTipo, filtroData);
  }, [estado, filtroTipo, filtroData]);

  function abrirRevisao(item: UsuarioPendenteModeracao) {
    setSelecionado(item);
    setSheetAberto(true);
  }

  function fecharRevisao() {
    setSheetAberto(false);
    setSelecionado(null);
  }

  function handleAprovar() {
    if (!estado || !selecionado) return;

    const nome = getNomeExibicao(selecionado);
    const usuarioId = getUsuarioId(selecionado);
    const next = aprovarUsuario(estado, usuarioId);
    persistir(next);
    fecharRevisao();

    toast.success(`${nome} aprovado`, {
      description: "Status alterado para ativo. Perfil liberado na plataforma.",
    });
  }

  function abrirRejeitar() {
    setRejeitarAberto(true);
  }

  function handleRejeitar(motivo: string) {
    if (!estado || !selecionado) return;

    const nome = getNomeExibicao(selecionado);
    const usuarioId = getUsuarioId(selecionado);
    const next = rejeitarUsuario(estado, usuarioId);
    persistir(next);
    setRejeitarAberto(false);
    fecharRevisao();

    toast.error(`${nome} rejeitado`, {
      description: motivo,
    });
  }

  function handleReset() {
    const next = resetarEstadoModeracao();
    setEstado(next);
    setFiltroTipo("todos");
    setFiltroData("todos");
    fecharRevisao();
    toast.message("Lista de pendentes restaurada.");
  }

  if (!carregado || !estado) {
    return (
      <div className="text-muted-foreground flex min-h-[40vh] items-center justify-center text-sm">
        Carregando fila de moderação…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-[var(--cinza-900)] px-4 py-3 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[var(--verde-neon)] size-4" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                Admin interno
              </p>
              <h1 className="font-heading text-sm font-semibold">
                Moderação de cadastros
              </h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="xs"
            className="border-zinc-600 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:text-white"
            onClick={handleReset}
          >
            <RefreshCw data-icon="inline-start" />
            Restaurar mocks
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">
        <FiltrosModeracao
          tipo={filtroTipo}
          data={filtroData}
          total={itensFiltrados.length}
          onTipoChange={setFiltroTipo}
          onDataChange={setFiltroData}
        />

        <TabelaPendentes itens={itensFiltrados} onRevisar={abrirRevisao} />
      </main>

      <DetalheUsuarioSheet
        item={selecionado}
        aberto={sheetAberto}
        onAbertoChange={(open) => {
          if (!open) fecharRevisao();
          else setSheetAberto(true);
        }}
        onAprovar={handleAprovar}
        onRejeitar={abrirRejeitar}
      />

      <RejeitarDialog
        item={selecionado}
        aberto={rejeitarAberto}
        onAbertoChange={setRejeitarAberto}
        onConfirmar={handleRejeitar}
      />
    </div>
  );
}
