"use client";

import { useEffect, useRef, useState } from "react";
import { FileSignature, Send } from "lucide-react";

import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
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
  const [avisoBloqueioVisivel, setAvisoBloqueioVisivel] = useState(false);
  const [formAviso, setFormAviso] = useState<string | null>(null);
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
  }, [estado.mensagens.length, avisoBloqueioVisivel]);

  useEffect(() => {
    setFormContratoAberto(estado.etapaContrato === "formulario");
    setDocContratoAberto(estado.etapaContrato === "documento");
  }, [estado.etapaContrato]);

  function enviarMensagem(e: React.FormEvent) {
    e.preventDefault();
    const analise = analisarTextoMensagem(texto);

    if (!analise.podeEnviar) {
      if (analise.flag === "bloqueado_padrao") {
        setAvisoBloqueioVisivel(true);
        setFormAviso(null);
      } else {
        setFormAviso(analise.motivoBloqueio ?? "Revise sua mensagem antes de enviar.");
      }
      return;
    }

    const nova: Mensagem = {
      id: crypto.randomUUID(),
      conversaId: estado.conversa.id,
      remetenteId: contexto.empresa.usuarioId,
      texto: texto.trim(),
      enviadoEm: new Date().toISOString(),
      flagContatoExterno:
        analise.flag === "bloqueado_padrao" ? "nenhum" : analise.flag,
    };

    onEstadoChange({
      ...estado,
      mensagens: [...estado.mensagens, nova],
    });
    setTexto("");
    setFormAviso(null);
    setAvisoBloqueioVisivel(false);
  }

  function abrirFecharContrato() {
    onEstadoChange({ ...estado, etapaContrato: "formulario" });
    setFormContratoAberto(true);
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col rounded-card border border-cinza-200 bg-fundo-pagina">
      <div className="sticky top-0 z-10 border-b border-cinza-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display truncate font-medium">
              {contexto.influenciador.nome}
            </p>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-4xl border border-cinza-200 bg-white px-2 py-0.5 text-[10px] font-normal text-texto-secundario">
                <span
                  className="bg-verde-neon size-1.5 shrink-0 rounded-full"
                  aria-hidden
                />
                Conversa ativa
              </span>
            </div>
            <p className="text-texto-secundario truncate text-xs font-normal">
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
            className="banner-informativo mb-4 w-full rounded-card p-3 text-left text-sm font-normal hover:opacity-90"
          >
            Contrato em rascunho — clique para revisar e assinar
          </button>
        ) : null}

        <div
          className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4"
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

          {avisoBloqueioVisivel ? (
            <AvisoContatoInline tipo="bloqueado_padrao" variante="central" />
          ) : null}

          <div ref={fimListaRef} />
        </div>

        <form
          onSubmit={enviarMensagem}
          className="sticky bottom-0 border-t border-cinza-200 bg-fundo-pagina pt-3"
        >
          <div className="flex gap-2">
            <Input
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                if (formAviso) setFormAviso(null);
                if (avisoBloqueioVisivel) setAvisoBloqueioVisivel(false);
              }}
              placeholder="Escreva sua mensagem…"
              className="border-cinza-200 bg-white font-normal"
              aria-invalid={!!formAviso}
              aria-describedby={
                formAviso ? "aviso-form-chat" : "dica-form-chat"
              }
              autoComplete="off"
            />
            <Button
              type="submit"
              variant="cta"
              size="icon"
              aria-label="Enviar mensagem"
            >
              <Send className="size-4" aria-hidden />
            </Button>
          </div>
          {formAviso ? (
            <p
              id="aviso-form-chat"
              role="status"
              className="text-texto-secundario mt-2 text-xs font-normal"
            >
              {formAviso}
            </p>
          ) : (
            <p
              id="dica-form-chat"
              className="text-texto-secundario mt-2 text-xs font-normal"
            >
              Para proteger as duas partes, telefones, e-mails e @ não podem ser
              enviados por aqui — use este chat para combinar tudo com registro na
              plataforma.
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
