"use client";

import { useEffect, useRef, useState } from "react";
import { FileSignature, Send } from "lucide-react";

import { DocumentoContratoDialog } from "@/components/negociacao/documento-contrato-dialog";
import { FormularioContratoDialog } from "@/components/negociacao/formulario-contrato-dialog";
import { MensagemBolha } from "@/components/negociacao/mensagem-bolha";
import { ResumoContratoBar } from "@/components/negociacao/resumo-contrato-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { analisarTextoMensagem } from "@/lib/negociacao/filtro-contato";
import type { Mensagem } from "@/lib/types";
import type {
  NegociacaoContexto,
  NegociacaoEstado,
} from "@/lib/negociacao/negociacao-types";

type ChatNegociacaoProps = {
  contexto: NegociacaoContexto;
  estado: NegociacaoEstado;
  onEstadoChange: (estado: NegociacaoEstado) => void;
  onGerarContrato: (dados: {
    escopo: string;
    valor: number;
    prazoEntrega: string;
  }) => void;
  onAssinarEmpresa: () => void;
  onAssinarInfluenciador: () => void;
};

export function ChatNegociacao({
  contexto,
  estado,
  onEstadoChange,
  onGerarContrato,
  onAssinarEmpresa,
  onAssinarInfluenciador,
}: ChatNegociacaoProps) {
  const [texto, setTexto] = useState("");
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [formContratoAberto, setFormContratoAberto] = useState(
    estado.etapaContrato === "formulario",
  );
  const [docContratoAberto, setDocContratoAberto] = useState(
    estado.etapaContrato === "documento",
  );
  const fimListaRef = useRef<HTMLDivElement>(null);

  const contratoAssinado =
    estado.contrato?.status === "assinado" && estado.assinaturaInfluenciador;

  useEffect(() => {
    fimListaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [estado.mensagens.length]);

  useEffect(() => {
    setFormContratoAberto(estado.etapaContrato === "formulario");
    setDocContratoAberto(estado.etapaContrato === "documento");
  }, [estado.etapaContrato]);

  function enviarMensagem(e: React.FormEvent) {
    e.preventDefault();
    const analise = analisarTextoMensagem(texto);

    if (!analise.podeEnviar) {
      setErroEnvio(
        analise.motivoBloqueio ??
          "Não é possível compartilhar contato externo pelo chat",
      );
      return;
    }

    const nova: Mensagem = {
      id: crypto.randomUUID(),
      conversaId: estado.conversa.id,
      remetenteId: contexto.empresa.usuarioId,
      texto: texto.trim(),
      enviadoEm: new Date().toISOString(),
      flagContatoExterno: analise.flag === "bloqueado_padrao" ? "nenhum" : analise.flag,
    };

    onEstadoChange({
      ...estado,
      mensagens: [...estado.mensagens, nova],
    });
    setTexto("");
    setErroEnvio(null);
  }

  function abrirFecharContrato() {
    onEstadoChange({ ...estado, etapaContrato: "formulario" });
    setFormContratoAberto(true);
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      <div className="border-border bg-background/95 sticky top-0 z-10 border-b px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{contexto.influenciador.nome}</p>
            <p className="text-muted-foreground truncate text-xs">
              {contexto.demanda.titulo}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={abrirFecharContrato}
            disabled={!!estado.contrato && estado.contrato.status === "assinado"}
          >
            <FileSignature className="size-4" aria-hidden />
            Fechar contrato
          </Button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-4 sm:px-6">
        {contratoAssinado && estado.contrato ? (
          <ResumoContratoBar contrato={estado.contrato} className="mb-4" />
        ) : null}

        {estado.contrato && estado.contrato.status === "rascunho" ? (
          <button
            type="button"
            onClick={() => {
              onEstadoChange({ ...estado, etapaContrato: "documento" });
              setDocContratoAberto(true);
            }}
            className="banner-informativo mb-4 w-full rounded-card p-3 text-left text-sm hover:opacity-90"
          >
            Contrato em rascunho — clique para revisar e assinar
          </button>
        ) : null}

        <div
          className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4"
          aria-label="Mensagens da negociação"
        >
          {estado.mensagens.map((msg) => (
            <MensagemBolha
              key={msg.id}
              mensagem={msg}
              ehRemetenteAtual={msg.remetenteId === contexto.empresa.usuarioId}
              nomeRemetente={
                msg.remetenteId === contexto.empresa.usuarioId
                  ? "Você"
                  : contexto.influenciador.nome.split(" ")[0]
              }
            />
          ))}
          <div ref={fimListaRef} />
        </div>

        <form
          onSubmit={enviarMensagem}
          className="border-border bg-background sticky bottom-0 border-t pt-3"
        >
          <div className="flex gap-2">
            <Input
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                if (erroEnvio) setErroEnvio(null);
              }}
              placeholder="Escreva sua mensagem…"
              aria-invalid={!!erroEnvio}
              aria-describedby={erroEnvio ? "erro-chat" : undefined}
              autoComplete="off"
            />
            <Button type="submit" size="icon" aria-label="Enviar mensagem">
              <Send className="size-4" aria-hidden />
            </Button>
          </div>
          {erroEnvio ? (
            <p
              id="erro-chat"
              role="alert"
              className="text-destructive mt-2 text-sm"
            >
              {erroEnvio}
            </p>
          ) : (
            <p className="text-muted-foreground mt-2 text-xs">
              Contatos externos (telefone, e-mail, @) são bloqueados automaticamente.
            </p>
          )}
        </form>
      </div>

      <FormularioContratoDialog
        aberto={formContratoAberto}
        onOpenChange={(open) => {
          setFormContratoAberto(open);
          if (!open && estado.etapaContrato === "formulario") {
            onEstadoChange({ ...estado, etapaContrato: "nenhuma" });
          }
        }}
        contexto={contexto}
        onGerar={(dados) => {
          onGerarContrato(dados);
          setFormContratoAberto(false);
          setDocContratoAberto(true);
        }}
      />

      {estado.contrato ? (
        <DocumentoContratoDialog
          aberto={docContratoAberto}
          onOpenChange={(open) => {
            setDocContratoAberto(open);
            if (!open && estado.etapaContrato === "documento") {
              onEstadoChange({ ...estado, etapaContrato: "nenhuma" });
            }
          }}
          contrato={estado.contrato}
          contexto={contexto}
          assinaturaEmpresa={estado.assinaturaEmpresa}
          assinaturaInfluenciador={estado.assinaturaInfluenciador}
          onAssinarEmpresa={onAssinarEmpresa}
          onAssinarInfluenciador={() => {
            onAssinarInfluenciador();
            setDocContratoAberto(false);
          }}
        />
      ) : null}
    </div>
  );
}
