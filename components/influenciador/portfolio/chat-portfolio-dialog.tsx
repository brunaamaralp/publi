"use client";

import { useEffect, useRef, useState } from "react";
import { FileEdit, MessageCircle, Send } from "lucide-react";

import {
  CheckoutContratarDialog,
  type PrefillCheckout,
} from "@/components/influenciador/portfolio/checkout-contratar-dialog";
import { AgendaDisponibilidade } from "@/components/influenciador/portfolio/agenda-disponibilidade";
import { AvisoContatoInline } from "@/components/negociacao/aviso-contato-inline";
import { MensagemBolha } from "@/components/negociacao/mensagem-bolha";
import { PropostaContratacaoCard } from "@/components/negociacao/proposta-contratacao-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  carregarEstadoChatPortfolio,
  obterOuCriarContextoChatPortfolio,
  salvarEstadoChatPortfolio,
} from "@/lib/influenciador/contratacao-direta";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import type { PortfolioInfluenciador } from "@/lib/influenciador/portfolio-types";
import { analisarTextoMensagem } from "@/lib/negociacao/filtro-contato";
import type { NegociacaoEstado } from "@/lib/negociacao/negociacao-types";
import type { Mensagem, PacoteServico, PropostaContratacaoMensagem } from "@/lib/types";

type ChatPortfolioDialogProps = {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  portfolio: PortfolioInfluenciador;
  empresaUsuarioId: string;
  empresaNome?: string;
};

export function ChatPortfolioDialog({
  aberto,
  onOpenChange,
  portfolio,
  empresaUsuarioId,
  empresaNome,
}: ChatPortfolioDialogProps) {
  const contexto = obterOuCriarContextoChatPortfolio({
    portfolio,
    empresaUsuarioId,
    empresaNome,
  });
  const [estado, setEstado] = useState<NegociacaoEstado | null>(null);
  const [texto, setTexto] = useState("");
  const [avisoBloqueio, setAvisoBloqueio] = useState(false);
  const [formAviso, setFormAviso] = useState<string | null>(null);
  const [formTermosAberto, setFormTermosAberto] = useState(false);
  const [checkoutPrefill, setCheckoutPrefill] = useState<PrefillCheckout | null>(
    null,
  );
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    setEstado(carregarEstadoChatPortfolio(contexto.match.id));
  }, [aberto, contexto.match.id]);

  useEffect(() => {
    if (!aberto) return;
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aberto, estado?.mensagens.length, avisoBloqueio]);

  function persistir(next: NegociacaoEstado) {
    setEstado(next);
    salvarEstadoChatPortfolio(next);
  }

  function enviarMensagem(e: React.FormEvent) {
    e.preventDefault();
    if (!estado) return;

    const analise = analisarTextoMensagem(texto);
    if (!analise.podeEnviar) {
      if (analise.flag === "bloqueado_padrao") {
        setAvisoBloqueio(true);
        setFormAviso(null);
      } else {
        setFormAviso(
          analise.motivoBloqueio ?? "Revise sua mensagem antes de enviar.",
        );
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

    persistir({
      ...estado,
      mensagens: [...estado.mensagens, nova],
    });
    setTexto("");
    setFormAviso(null);
    setAvisoBloqueio(false);
  }

  function registrarTermos(proposta: PropostaContratacaoMensagem) {
    if (!estado) return;

    const nova: Mensagem = {
      id: crypto.randomUUID(),
      conversaId: estado.conversa.id,
      remetenteId: contexto.influenciadorUsuarioId,
      texto: "Termos acordados na conversa — revise e confirme a contratação.",
      enviadoEm: new Date().toISOString(),
      flagContatoExterno: "nenhum",
      propostaContratacao: proposta,
    };

    persistir({
      ...estado,
      mensagens: [...estado.mensagens, nova],
      termosPropostos: {
        escopo: proposta.escopo,
        valor: proposta.valor,
        prazoEntrega: proposta.dataAgendada ?? "",
      },
    });
    setFormTermosAberto(false);
  }

  function abrirCheckoutDaProposta(proposta: PropostaContratacaoMensagem) {
    setCheckoutPrefill({
      escopo: proposta.escopo,
      valor: proposta.valor,
      dataAgendada: proposta.dataAgendada,
      pacoteId: proposta.pacoteId,
      pacoteNome: proposta.pacoteNome,
      origem: "portfolio_chat",
    });
    setCheckoutAberto(true);
  }

  const pacoteBase =
    portfolio.pacotes.find((p) => p.ativo) ?? portfolio.pacotes[0] ?? null;

  return (
    <>
      <Dialog open={aberto} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
          <DialogHeader className="border-b border-cinza-200 px-4 py-3 sm:px-5">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="size-4" aria-hidden />
              Chat com {portfolio.nome}
            </DialogTitle>
            <DialogDescription>
              Gratuito e sempre disponível — sem convite, demanda ou taxa. O
              filtro de contato continua ativo.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col bg-fundo-pagina">
            <div className="border-b border-cinza-200 bg-white px-4 py-2 sm:px-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormTermosAberto(true)}
              >
                <FileEdit className="size-4" aria-hidden />
                Registrar termos acordados
              </Button>
            </div>

            <div
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-5"
              aria-label="Mensagens"
            >
              {estado && estado.mensagens.length === 0 ? (
                <p className="text-texto-secundario text-center text-sm font-normal">
                  Tire dúvidas de escopo antes de comprometer o depósito. Quando
                  houver acordo, registre os termos e avance ao mesmo checkout.
                </p>
              ) : null}

              {estado?.mensagens.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <MensagemBolha
                    mensagem={msg}
                    ehRemetenteAtual={
                      msg.remetenteId === contexto.empresa.usuarioId
                    }
                    nomeRemetente={
                      msg.remetenteId === contexto.empresa.usuarioId
                        ? "Você"
                        : portfolio.nome.split(" ")[0]
                    }
                  />
                  {msg.propostaContratacao ? (
                    <div
                      className={
                        msg.remetenteId === contexto.empresa.usuarioId
                          ? "ml-auto flex justify-end"
                          : "mr-auto flex justify-start"
                      }
                    >
                      <PropostaContratacaoCard
                        proposta={msg.propostaContratacao}
                        onRevisarConfirmar={() =>
                          abrirCheckoutDaProposta(msg.propostaContratacao!)
                        }
                      />
                    </div>
                  ) : null}
                </div>
              ))}

              {avisoBloqueio ? (
                <AvisoContatoInline tipo="bloqueado_padrao" variante="central" />
              ) : null}
              <div ref={fimRef} />
            </div>

            <form
              onSubmit={enviarMensagem}
              className="border-t border-cinza-200 bg-fundo-pagina px-4 py-3 sm:px-5"
            >
              <div className="flex gap-2">
                <Input
                  value={texto}
                  onChange={(e) => {
                    setTexto(e.target.value);
                    if (formAviso) setFormAviso(null);
                    if (avisoBloqueio) setAvisoBloqueio(false);
                  }}
                  placeholder="Escreva sua dúvida…"
                  className="border-cinza-200 bg-white font-normal"
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
                <p className="text-texto-secundario mt-2 text-xs" role="status">
                  {formAviso}
                </p>
              ) : (
                <p className="text-texto-secundario mt-2 text-xs font-normal">
                  Telefones, e-mails e @ não passam — combine tudo com registro
                  na plataforma.
                </p>
              )}
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <FormTermosAcordadosDialog
        aberto={formTermosAberto}
        onOpenChange={setFormTermosAberto}
        pacotes={portfolio.pacotes.filter((p) => p.ativo)}
        pacotePadrao={pacoteBase}
        portfolio={portfolio}
        onRegistrar={registrarTermos}
      />

      <CheckoutContratarDialog
        aberto={checkoutAberto}
        onOpenChange={setCheckoutAberto}
        portfolio={portfolio}
        pacote={
          pacoteBase && checkoutPrefill?.pacoteId
            ? portfolio.pacotes.find((p) => p.id === checkoutPrefill.pacoteId) ??
              pacoteBase
            : pacoteBase
        }
        prefill={checkoutPrefill}
        empresa={{
          usuarioId: empresaUsuarioId,
          nome: empresaNome,
        }}
      />
    </>
  );
}

function FormTermosAcordadosDialog({
  aberto,
  onOpenChange,
  pacotes,
  pacotePadrao,
  portfolio,
  onRegistrar,
}: {
  aberto: boolean;
  onOpenChange: (v: boolean) => void;
  pacotes: PacoteServico[];
  pacotePadrao: PacoteServico | null;
  portfolio: PortfolioInfluenciador;
  onRegistrar: (proposta: PropostaContratacaoMensagem) => void;
}) {
  const [pacoteId, setPacoteId] = useState(pacotePadrao?.id ?? "");
  const [escopo, setEscopo] = useState("");
  const [valor, setValor] = useState("");
  const [dataAgendada, setDataAgendada] = useState<string | null>(null);
  const [aviso, setAviso] = useState(false);
  const [erroData, setErroData] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const pacote = pacotePadrao ?? pacotes[0];
    if (pacote) {
      setPacoteId(pacote.id);
      setEscopo(
        [pacote.descricao, ...pacote.itensInclusos.map((i) => `• ${i}`)].join(
          "\n",
        ),
      );
      setValor(String(pacote.preco));
    }
    setDataAgendada(null);
    setAviso(false);
    setErroData(false);
    // Só hidrata ao abrir o dialog
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  function aoTrocarPacote(id: string) {
    setPacoteId(id);
    const pacote = pacotes.find((p) => p.id === id);
    if (!pacote) return;
    setEscopo(
      [pacote.descricao, ...pacote.itensInclusos.map((i) => `• ${i}`)].join(
        "\n",
      ),
    );
    setValor(String(pacote.preco));
    setAviso(false);
  }

  function confirmar(e: React.FormEvent) {
    e.preventDefault();
    const analise = analisarTextoMensagem(escopo);
    if (!analise.podeEnviar && analise.flag === "bloqueado_padrao") {
      setAviso(true);
      return;
    }
    const valorNum = Number(valor.replace(",", "."));
    if (!escopo.trim() || !Number.isFinite(valorNum) || valorNum <= 0) return;
    if (!dataAgendada) {
      setErroData(true);
      return;
    }

    const pacote = pacotes.find((p) => p.id === pacoteId);
    onRegistrar({
      escopo: escopo.trim(),
      valor: valorNum,
      dataAgendada,
      pacoteId: pacote?.id,
      pacoteNome: pacote?.nome,
    });
  }

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Termos acordados</DialogTitle>
          <DialogDescription>
            Registre escopo, valor e data negociados. O checkout reaproveita
            esses termos — sem preencher tudo de novo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={confirmar} className="space-y-4">
          {pacotes.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="pacote-base">Pacote de referência</Label>
              <select
                id="pacote-base"
                className="border-cinza-200 w-full rounded-button border bg-white px-2.5 py-2 text-sm"
                value={pacoteId}
                onChange={(e) => aoTrocarPacote(e.target.value)}
              >
                {pacotes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — {formatarMoeda(p.preco)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="escopo-acordado">Escopo</Label>
            <Textarea
              id="escopo-acordado"
              value={escopo}
              onChange={(e) => {
                setEscopo(e.target.value);
                setAviso(false);
              }}
              rows={4}
              className="border-cinza-200 bg-white font-normal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor-acordado">Valor (R$)</Label>
            <Input
              id="valor-acordado"
              type="number"
              min={1}
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="border-cinza-200 bg-white font-data"
            />
          </div>
          <div className="space-y-2">
            <Label>Data combinada</Label>
            <AgendaDisponibilidade
              disponibilidade={portfolio.disponibilidade}
              modo="selecao"
              selecionavel
              ocultarCabecalho
              dataSelecionada={dataAgendada}
              onSelecionar={(d) => {
                setDataAgendada(d);
                setErroData(false);
              }}
            />
            {erroData ? (
              <p className="text-destructive text-xs" role="alert">
                Escolha uma data disponível na agenda.
              </p>
            ) : null}
          </div>
          {aviso ? (
            <AvisoContatoInline tipo="bloqueado_padrao" variante="central" />
          ) : null}
          <Button type="submit" variant="cta" className="w-full">
            Publicar card no chat
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
